"use client";

import { useState } from "react";
import type { Message } from "@/lib/types";
import { MarkdownContent } from "./markdown-content";

interface MessageItemProps {
  message: Message;
}

export function MessageItem({ message }: MessageItemProps) {
  const [copyState, setCopyState] = useState<"idle" | "copied">("idle");
  const isUser = message.role === "user";
  const isStreaming = message.status === "streaming";

  const copyMessage = async () => {
    try {
      await navigator.clipboard.writeText(message.content);
      setCopyState("copied");
      window.setTimeout(() => setCopyState("idle"), 1200);
    } catch {
      setCopyState("idle");
    }
  };

  const copyButton = (
    <button
      type="button"
      onClick={copyMessage}
      disabled={!message.content}
      className="rounded-md px-2 py-1 text-xs text-[var(--text-muted)] transition hover:bg-[var(--bg-hover)] hover:text-[var(--text-primary)] disabled:cursor-not-allowed disabled:opacity-50"
      aria-label="复制消息"
    >
      {copyState === "copied" ? "已复制" : "复制"}
    </button>
  );

  if (isUser) {
    return (
      <div className="group flex justify-end px-4 py-3 md:px-8">
        <div className="flex max-w-[85%] flex-col items-end gap-1">
          <div className="rounded-2xl bg-[var(--bg-user)] px-4 py-2.5 text-[15px] leading-relaxed text-[var(--text-primary)]">
            <p className="whitespace-pre-wrap">{message.content}</p>
          </div>
          <div className="opacity-0 transition focus-within:opacity-100 group-hover:opacity-100">
            {copyButton}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="px-4 py-3 md:px-8">
      <div className="group mx-auto max-w-3xl">
        <MarkdownContent content={message.content} isStreaming={isStreaming} />
        {message.status === "error" && (
          <p className="mt-2 text-sm text-red-600">生成失败，请重试</p>
        )}
        {message.status === "aborted" && (
          <p className="mt-2 text-sm text-[var(--text-muted)]">已停止生成</p>
        )}
        <div className="mt-2 opacity-0 transition focus-within:opacity-100 group-hover:opacity-100">
          {copyButton}
        </div>
      </div>
    </div>
  );
}
