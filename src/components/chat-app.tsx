"use client";

import { useCallback, useEffect, useState } from "react";
import { createId } from "@/lib/id";
import { titleFromFirstMessage, validateMessageContent } from "@/lib/messages";
import { DEFAULT_MODEL, type ChatModel, type Conversation } from "@/lib/types";
import {
  loadModel,
  loadTheme,
  saveModel,
  saveTheme,
  type ThemeMode,
} from "@/lib/storage";
import { useChatStream } from "@/hooks/use-chat-stream";
import { useConversations } from "@/hooks/use-conversations";
import { AppLayout } from "@/components/layout/app-layout";
import { Sidebar } from "@/components/layout/sidebar";
import { ChatHeader } from "@/components/chat/chat-header";
import { MessageList } from "@/components/chat/message-list";
import { ChatInput } from "@/components/chat/chat-input";
import { ErrorBanner } from "@/components/chat/error-banner";

export function ChatApp() {
  const [theme, setTheme] = useState<ThemeMode>("light");
  const [model, setModel] = useState<ChatModel>(DEFAULT_MODEL);
  const [streamMode, setStreamMode] = useState(true);
  const [preferencesHydrated, setPreferencesHydrated] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const {
    hydrated,
    conversations,
    activeId,
    activeConversation,
    createConversation,
    selectConversation,
    deleteConversation,
    renameConversation,
    updateConversation,
    appendToMessage,
    updateMessage,
    ensureActiveConversation,
  } = useConversations();

  useEffect(() => {
    const storedTheme = loadTheme();
    const storedModel = loadModel();
    // Browser preferences are persisted separately from conversations.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setTheme(storedTheme);
    setModel(storedModel);
    setPreferencesHydrated(true);
  }, []);

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    if (!preferencesHydrated) return;
    saveTheme(theme);
  }, [preferencesHydrated, theme]);

  useEffect(() => {
    if (!preferencesHydrated) return;
    saveModel(model);
  }, [model, preferencesHydrated]);

  const onAppend = useCallback(
    (conversationId: string, messageId: string, delta: string) => {
      appendToMessage(conversationId, messageId, delta);
    },
    [appendToMessage],
  );

  const onFinish = useCallback(
    (
      conversationId: string,
      messageId: string,
      status: "done" | "aborted" | "error",
    ) => {
      updateMessage(conversationId, messageId, { status });
    },
    [updateMessage],
  );

  const { isStreaming, error, clearError, send, abort } = useChatStream({
    model,
    stream: streamMode,
    onAppend,
    onFinish,
  });

  const toggleTheme = useCallback(() => {
    setTheme((current) => (current === "dark" ? "light" : "dark"));
  }, []);

  const openSidebar = useCallback(() => setIsSidebarOpen(true), []);
  const closeSidebar = useCallback(() => setIsSidebarOpen(false), []);
  const toggleSidebarCollapsed = useCallback(() => {
    setIsSidebarCollapsed((current) => !current);
  }, []);

  const handleRegenerate = useCallback(async () => {
    if (!activeConversation || isStreaming) return;
    const messages = activeConversation.messages;
    if (messages.length === 0) return;

    const last = messages[messages.length - 1];
    if (last.role !== "assistant") return;

    const trimmed: Conversation = {
      ...activeConversation,
      messages: messages.slice(0, -1),
    };
    const assistantId = createId();
    const now = Date.now();

    const updatedConversation: Conversation = {
      ...trimmed,
      updatedAt: now,
      messages: [
        ...trimmed.messages,
        {
          id: assistantId,
          role: "assistant",
          content: "",
          createdAt: now,
          status: "streaming",
        },
      ],
    };

    updateConversation(activeConversation.id, () => updatedConversation);
    await send(activeConversation.id, updatedConversation, assistantId);
  }, [activeConversation, isStreaming, send, updateConversation]);

  const handleSend = useCallback(
    async (text: string) => {
      const validationError = validateMessageContent(text);
      if (validationError) return;

      clearError();
      const conversationId = ensureActiveConversation();
      const base =
        activeConversation?.id === conversationId
          ? activeConversation
          : conversations.find((c) => c.id === conversationId);

      if (!base) return;

      const assistantId = createId();
      const isFirstUser = base.messages.every((m) => m.role !== "user");
      const now = Date.now();

      const updatedConversation: Conversation = {
        ...base,
        title: isFirstUser ? titleFromFirstMessage(text) : base.title,
        updatedAt: now,
        messages: [
          ...base.messages,
          {
            id: createId(),
            role: "user",
            content: text,
            createdAt: now,
          },
          {
            id: assistantId,
            role: "assistant",
            content: "",
            createdAt: now,
            status: "streaming",
          },
        ],
      };

      updateConversation(conversationId, () => updatedConversation);
      await send(conversationId, updatedConversation, assistantId);
    },
    [
      clearError,
      activeConversation,
      conversations,
      ensureActiveConversation,
      send,
      updateConversation,
    ],
  );

  if (!hydrated) {
    return (
      <div className="flex h-dvh items-center justify-center bg-[var(--bg-main)] text-[var(--text-muted)]">
        加载中...
      </div>
    );
  }

  const isEmptyConversation =
    !activeConversation || activeConversation.messages.length === 0;

  return (
    <AppLayout
      isSidebarOpen={isSidebarOpen}
      isSidebarCollapsed={isSidebarCollapsed}
      onCloseSidebar={closeSidebar}
      sidebar={
        <Sidebar
          conversations={conversations}
          activeId={activeId}
          collapsed={isSidebarCollapsed}
          onNewChat={createConversation}
          onSelect={(id) => {
            selectConversation(id);
            closeSidebar();
          }}
          onDelete={deleteConversation}
          onRename={renameConversation}
          onToggleCollapsed={toggleSidebarCollapsed}
        />
      }
    >
      <ChatHeader
        title={activeConversation?.title ?? "新对话"}
        model={model}
        theme={theme}
        streamMode={streamMode}
        onOpenSidebar={openSidebar}
        onModelChange={setModel}
        onThemeToggle={toggleTheme}
        onStreamToggle={() => setStreamMode((prev) => !prev)}
      />
      <ErrorBanner message={error} onDismiss={clearError} />
      {!isEmptyConversation && (
        <MessageList
          conversation={activeConversation}
          isStreaming={isStreaming}
          onSuggest={handleSend}
          onRegenerate={handleRegenerate}
        />
      )}
      <ChatInput
        homeMode={isEmptyConversation}
        isStreaming={isStreaming}
        onSend={handleSend}
        onSuggest={handleSend}
        onStop={abort}
      />
    </AppLayout>
  );
}
