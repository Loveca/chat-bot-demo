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

const quickCards = [
  { title: "写一封感谢信", detail: "感谢一位导师的帮助", icon: "✎" },
  { title: "总结这篇文章的要点", detail: "https://example.com/article", icon: "□" },
  { title: "解释这个概念", detail: "什么是边际效应？", icon: "◇" },
  { title: "制定学习计划", detail: "帮助我准备期末考试", icon: "□" },
];

const projects = [
  { title: "个人笔记", detail: "昨天更新" },
  { title: "产品设计", detail: "2 天前更新" },
  { title: "市场调研", detail: "1 周前更新" },
  { title: "学习资料", detail: "2 周前更新" },
];

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
      <div className="flex min-h-0 flex-1 overflow-y-auto px-4 pt-20 md:px-8">
        <div className="mx-auto flex w-full max-w-[980px] flex-col items-center pb-8 pt-1 md:pt-8">
          <span className="rounded-full bg-[var(--badge-bg)] px-4 py-2 text-sm font-medium text-[var(--badge-text)]">
            专业版
          </span>
          <h1 className="mt-14 flex items-center gap-5 text-center font-serif text-[42px] font-medium leading-tight text-[var(--text-primary)] md:text-[56px]">
            <span className="font-sans text-[var(--accent)]">✳</span>
            晚上好，Yifan
          </h1>

          <div className="mt-10 grid w-full grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {quickCards.map((card, index) => (
              <button
                key={card.title}
                type="button"
                onClick={() => onSuggest(SUGGESTED_PROMPTS[index % SUGGESTED_PROMPTS.length])}
                className="min-h-[80px] rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-elevated)] p-4 text-left shadow-[0_1px_2px_rgba(0,0,0,0.03)] transition hover:-translate-y-0.5 hover:border-[var(--accent-soft)] hover:shadow-[0_10px_30px_rgba(31,26,18,0.08)]"
              >
                <div className="flex items-start gap-3">
                  <span className="text-lg text-[var(--text-secondary)]">{card.icon}</span>
                  <div className="min-w-0">
                    <p className="truncate text-sm font-semibold text-[var(--text-primary)]">
                      {card.title}
                    </p>
                    <p className="mt-2 truncate text-sm text-[var(--text-muted)]">
                      {card.detail}
                    </p>
                  </div>
                </div>
              </button>
            ))}
          </div>

          <section className="mt-14 w-full">
            <div className="mb-5 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <h2 className="text-base font-semibold text-[var(--text-primary)]">
                  您的项目
                </h2>
                <span className="rounded-full bg-[var(--badge-bg)] px-2.5 py-1 text-xs font-medium text-[var(--badge-text)]">
                  Beta
                </span>
              </div>
              <button
                type="button"
                className="text-sm text-[var(--text-secondary)] transition hover:text-[var(--accent)]"
              >
                查看全部 →
              </button>
            </div>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
              {projects.map((project) => (
                <div
                  key={project.title}
                  className="min-h-[104px] rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-elevated)] p-4 shadow-[0_1px_2px_rgba(0,0,0,0.03)]"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-lg text-[var(--text-muted)]">□</span>
                    <p className="min-w-0 flex-1 truncate font-semibold">
                      {project.title}
                    </p>
                    <span className="text-xl leading-none text-[var(--text-muted)]">⋮</span>
                  </div>
                  <p className="mt-5 text-sm text-[var(--text-muted)]">
                    {project.detail}
                  </p>
                </div>
              ))}
            </div>
          </section>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-0 flex-1 overflow-y-auto px-4 pt-20 md:px-8">
      <div className="mx-auto max-w-[860px] py-6">
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
