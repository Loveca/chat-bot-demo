"use client";

import type { Message } from "@/lib/types";
import { MarkdownContent } from "./markdown-content";

interface MessageItemProps {
  message: Message;
}

export function MessageItem({ message }: MessageItemProps) {
  const isUser = message.role === "user";
  const isStreaming = message.status === "streaming";

  if (isUser) {
    return (
      <div className="flex justify-end px-4 py-3 md:px-8">
        <div className="max-w-[85%] rounded-2xl bg-[var(--bg-user)] px-4 py-2.5 text-[15px] leading-relaxed text-[var(--text-primary)]">
          <p className="whitespace-pre-wrap">{message.content}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="px-4 py-3 md:px-8">
      <div className="mx-auto max-w-3xl">
        <MarkdownContent content={message.content} isStreaming={isStreaming} />
        {message.status === "error" && (
          <p className="mt-2 text-sm text-red-600">生成失败，请重试</p>
        )}
        {message.status === "aborted" && (
          <p className="mt-2 text-sm text-[var(--text-muted)]">已停止生成</p>
        )}
      </div>
    </div>
  );
}
