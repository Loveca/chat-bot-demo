"use client";

import { useCallback, useRef, useState } from "react";
import { streamChat } from "@/lib/chat-client";
import { buildApiMessages } from "@/lib/messages";
import type { Conversation } from "@/lib/types";
import { DEFAULT_MODEL } from "@/lib/types";

interface UseChatStreamOptions {
  model?: string;
  stream?: boolean;
  onAppend: (conversationId: string, messageId: string, delta: string) => void;
  onFinish: (
    conversationId: string,
    messageId: string,
    status: "done" | "aborted" | "error",
  ) => void;
}

export function useChatStream(options: UseChatStreamOptions) {
  const { model = DEFAULT_MODEL, stream = true, onAppend, onFinish } = options;
  const [isStreaming, setIsStreaming] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const abortRef = useRef<AbortController | null>(null);

  const clearError = useCallback(() => setError(null), []);

  const abort = useCallback(() => {
    abortRef.current?.abort();
    abortRef.current = null;
  }, []);

  const send = useCallback(
    async (
      conversationId: string,
      conversation: Conversation,
      assistantMessageId: string,
    ) => {
      abortRef.current?.abort();
      const controller = new AbortController();
      abortRef.current = controller;
      setIsStreaming(true);
      setError(null);

      const apiMessages = buildApiMessages(conversation, 40);

      await streamChat({
        messages: apiMessages,
        model,
        stream,
        signal: controller.signal,
        onDelta: (text) => {
          onAppend(conversationId, assistantMessageId, text);
        },
        onDone: () => {
          setIsStreaming(false);
          abortRef.current = null;
          onFinish(
            conversationId,
            assistantMessageId,
            controller.signal.aborted ? "aborted" : "done",
          );
        },
        onError: (message) => {
          setIsStreaming(false);
          abortRef.current = null;
          setError(message);
          onFinish(conversationId, assistantMessageId, "error");
        },
      });
    },
    [model, stream, onAppend, onFinish],
  );

  return {
    isStreaming,
    error,
    clearError,
    send,
    abort,
  };
}
