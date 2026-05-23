"use client";

import { useEffect, useRef } from "react";
import { SUGGESTED_PROMPTS } from "@/lib/types";
import type { Conversation } from "@/lib/types";
import { MessageItem } from "./message-item";

interface MessageListProps {
  conversation: Conversation | null;
  isStreaming: boolean;
  onSuggest: (text: string) => void;
  onRegenerate?: () => void;
}

export function MessageList({
  conversation,
  isStreaming,
  onSuggest,
  onRegenerate,
}: MessageListProps) {
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [conversation?.messages, isStreaming]);

  if (!conversation || conversation.messages.length === 0) {
    return (
      <div className="flex flex-1 flex-col items-center justify-center px-6 pb-8">
        <h1 className="mb-2 text-center text-3xl font-medium tracking-tight text-[var(--text-primary)]">
          今天有什么可以帮你的？
        </h1>
        <p className="mb-10 text-center text-[var(--text-muted)]">
          由 DeepSeek 驱动 · Claude 风格界面演示
        </p>
        <div className="flex max-w-2xl flex-wrap justify-center gap-2">
          {SUGGESTED_PROMPTS.map((prompt) => (
            <button
              key={prompt}
              type="button"
              onClick={() => onSuggest(prompt)}
              className="rounded-full border border-[var(--border-subtle)] bg-[var(--bg-elevated)] px-4 py-2 text-sm text-[var(--text-primary)] transition hover:bg-[var(--bg-hover)]"
            >
              {prompt}
            </button>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto">
      <div className="mx-auto max-w-3xl py-6">
        {conversation.messages.map((message, index) => {
          const isLastAssistant =
            message.role === "assistant" &&
            index === conversation.messages.length - 1;
          return (
            <MessageItem
              key={message.id}
              message={message}
              isLastAssistant={isLastAssistant}
              isStreaming={isStreaming}
              onRegenerate={onRegenerate}
            />
          );
        })}
        <div ref={bottomRef} className="h-4" />
      </div>
    </div>
  );
}
