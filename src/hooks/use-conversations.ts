"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { createId } from "@/lib/id";
import { titleFromFirstMessage } from "@/lib/messages";
import {
  loadActiveId,
  loadConversations,
  saveActiveId,
  saveConversations,
} from "@/lib/storage";
import type { Conversation, Message, MessageStatus } from "@/lib/types";

function sortConversations(list: Conversation[]): Conversation[] {
  return [...list].sort((a, b) => b.updatedAt - a.updatedAt);
}

export function useConversations() {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    const loaded = loadConversations();
    const savedActiveId = loadActiveId();
    // localStorage is only available after mount; keep the server render stable,
    // then hydrate the client state once.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setConversations(loaded);
    if (savedActiveId && loaded.some((c) => c.id === savedActiveId)) {
      setActiveId(savedActiveId);
    } else if (loaded.length > 0) {
      setActiveId(loaded[0].id);
    }
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    saveConversations(conversations);
  }, [conversations, hydrated]);

  useEffect(() => {
    if (!hydrated) return;
    saveActiveId(activeId);
  }, [activeId, hydrated]);

  const activeConversation = useMemo(
    () => conversations.find((c) => c.id === activeId) ?? null,
    [conversations, activeId],
  );

  const createConversation = useCallback((): string => {
    const now = Date.now();
    const conversation: Conversation = {
      id: createId(),
      title: "新对话",
      createdAt: now,
      updatedAt: now,
      messages: [],
    };
    setConversations((prev) => sortConversations([conversation, ...prev]));
    setActiveId(conversation.id);
    return conversation.id;
  }, []);

  const selectConversation = useCallback((id: string) => {
    setActiveId(id);
  }, []);

  const updateConversation = useCallback(
    (id: string, updater: (conversation: Conversation) => Conversation) => {
      setConversations((prev) =>
        sortConversations(prev.map((c) => (c.id === id ? updater(c) : c))),
      );
    },
    [],
  );

  const addMessage = useCallback(
    (
      conversationId: string,
      role: Message["role"],
      content: string,
      status?: MessageStatus,
    ): string => {
      const messageId = createId();
      const now = Date.now();

      setConversations((prev) =>
        sortConversations(
          prev.map((c) => {
            if (c.id !== conversationId) return c;
            const isFirstUser =
              role === "user" && c.messages.every((m) => m.role !== "user");
            return {
              ...c,
              title: isFirstUser ? titleFromFirstMessage(content) : c.title,
              updatedAt: now,
              messages: [
                ...c.messages,
                {
                  id: messageId,
                  role,
                  content,
                  createdAt: now,
                  status,
                },
              ],
            };
          }),
        ),
      );

      return messageId;
    },
    [],
  );

  const updateMessage = useCallback(
    (
      conversationId: string,
      messageId: string,
      patch: Partial<Pick<Message, "content" | "status">>,
    ) => {
      setConversations((prev) =>
        sortConversations(
          prev.map((c) => {
            if (c.id !== conversationId) return c;
            return {
              ...c,
              updatedAt: Date.now(),
              messages: c.messages.map((m) =>
                m.id === messageId ? { ...m, ...patch } : m,
              ),
            };
          }),
        ),
      );
    },
    [],
  );

  const appendToMessage = useCallback(
    (conversationId: string, messageId: string, delta: string) => {
      setConversations((prev) =>
        sortConversations(
          prev.map((c) => {
            if (c.id !== conversationId) return c;
            return {
              ...c,
              updatedAt: Date.now(),
              messages: c.messages.map((m) =>
                m.id === messageId ? { ...m, content: m.content + delta } : m,
              ),
            };
          }),
        ),
      );
    },
    [],
  );

  const ensureActiveConversation = useCallback((): string => {
    if (activeId && conversations.some((c) => c.id === activeId)) {
      return activeId;
    }
    if (conversations.length > 0) {
      setActiveId(conversations[0].id);
      return conversations[0].id;
    }
    return createConversation();
  }, [activeId, conversations, createConversation]);

  return {
    hydrated,
    conversations,
    activeId,
    activeConversation,
    createConversation,
    selectConversation,
    updateConversation,
    addMessage,
    updateMessage,
    appendToMessage,
    ensureActiveConversation,
  };
}
