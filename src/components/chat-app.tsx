"use client";

import { useCallback } from "react";
import { createId } from "@/lib/id";
import { titleFromFirstMessage, validateMessageContent } from "@/lib/messages";
import type { Conversation } from "@/lib/types";
import { useChatStream } from "@/hooks/use-chat-stream";
import { useConversations } from "@/hooks/use-conversations";
import { AppLayout } from "@/components/layout/app-layout";
import { Sidebar } from "@/components/layout/sidebar";
import { ChatHeader } from "@/components/chat/chat-header";
import { MessageList } from "@/components/chat/message-list";
import { ChatInput } from "@/components/chat/chat-input";
import { ErrorBanner } from "@/components/chat/error-banner";

export function ChatApp() {
  const {
    hydrated,
    conversations,
    activeId,
    activeConversation,
    createConversation,
    selectConversation,
    updateConversation,
    appendToMessage,
    updateMessage,
    ensureActiveConversation,
  } = useConversations();

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
    onAppend,
    onFinish,
  });

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

  return (
    <AppLayout
      sidebar={
        <Sidebar
          conversations={conversations}
          activeId={activeId}
          onNewChat={createConversation}
          onSelect={selectConversation}
        />
      }
    >
      <ChatHeader title={activeConversation?.title ?? "新对话"} />
      <ErrorBanner message={error} onDismiss={clearError} />
      <MessageList
        conversation={activeConversation}
        isStreaming={isStreaming}
        onSuggest={handleSend}
      />
      <ChatInput
        isStreaming={isStreaming}
        onSend={handleSend}
        onStop={abort}
      />
    </AppLayout>
  );
}
