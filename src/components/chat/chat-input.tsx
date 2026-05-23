"use client";

import { useCallback, useEffect, useRef, type KeyboardEvent } from "react";
import { SUGGESTED_PROMPTS } from "@/lib/types";

interface ChatInputProps {
  disabled?: boolean;
  homeMode?: boolean;
  isStreaming: boolean;
  onSend: (text: string) => void;
  onSuggest?: (text: string) => void;
  onStop: () => void;
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

export function ChatInput({
  disabled,
  homeMode = false,
  isStreaming,
  onSend,
  onSuggest,
  onStop,
}: ChatInputProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const resize = useCallback(() => {
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = "auto";
    el.style.height = `${Math.min(el.scrollHeight, 180)}px`;
  }, []);

  useEffect(() => {
    resize();
  }, [resize]);

  function handleKeyDown(e: KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      if (isStreaming) return;
      submit();
    }
  }

  function submit() {
    const el = textareaRef.current;
    if (!el) return;
    const value = el.value.trim();
    if (!value || disabled || isStreaming) return;
    onSend(value);
    el.value = "";
    resize();
  }

  const composer = (
    <div className="rounded-[20px] border border-[var(--border-input)] bg-[var(--bg-input)] px-5 py-4 shadow-[0_14px_40px_rgba(31,26,18,0.08)] transition focus-within:border-[var(--border-focus)]">
      <textarea
        ref={textareaRef}
        rows={2}
        placeholder="有什么可以帮您的吗？"
        disabled={disabled}
        onInput={resize}
        onKeyDown={handleKeyDown}
        className="max-h-[180px] min-h-[56px] w-full resize-none bg-transparent text-[16px] leading-7 text-[var(--text-primary)] outline-none placeholder:text-[var(--text-muted)] disabled:opacity-50"
      />
      <div className="mt-3 flex items-center gap-2">
        <button
          type="button"
          className="flex h-10 w-10 items-center justify-center rounded-lg border border-[var(--border-subtle)] text-2xl font-light text-[var(--text-secondary)] transition hover:bg-[var(--bg-hover)]"
          aria-label="添加"
          title="添加"
        >
          +
        </button>
        <button
          type="button"
          className="flex h-10 w-10 items-center justify-center rounded-lg border border-[var(--border-subtle)] text-sm text-[var(--text-secondary)] transition hover:bg-[var(--bg-hover)]"
          aria-label="调节"
          title="调节"
        >
          ⌘
        </button>
        <button
          type="button"
          className="hidden h-10 items-center gap-2 rounded-lg border border-[var(--border-subtle)] px-3 text-sm font-medium text-[var(--text-secondary)] transition hover:bg-[var(--bg-hover)] sm:flex"
          aria-label="研究"
          title="研究"
        >
          ⌘ 研究
          <span className="rounded-full bg-[var(--badge-bg)] px-2 py-0.5 text-[11px] text-[var(--badge-text)]">
            BETA
          </span>
        </button>
        <div className="ml-auto flex items-center gap-3">
          <span className="hidden text-sm text-[var(--text-secondary)] sm:inline">
            DeepSeek
          </span>
          {isStreaming ? (
            <button
              type="button"
              onClick={onStop}
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[var(--text-primary)] text-lg font-semibold text-[var(--bg-main)] transition hover:opacity-90"
              aria-label="停止生成"
              title="停止生成"
            >
              ■
            </button>
          ) : (
            <button
              type="button"
              onClick={submit}
              disabled={disabled}
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[var(--accent)] text-xl font-semibold text-white transition hover:bg-[var(--accent-strong)] disabled:opacity-40"
              aria-label="发送"
              title="发送"
            >
              ↑
            </button>
          )}
        </div>
      </div>
    </div>
  );

  if (homeMode) {
    return (
      <div className="min-h-0 flex-1 overflow-y-auto bg-[var(--bg-main)] px-4 pb-7 pt-20 md:px-8">
        <div className="mx-auto flex w-full max-w-[940px] flex-col items-center">
          <span className="rounded-full bg-[var(--badge-bg)] px-4 py-2 text-sm font-medium text-[var(--badge-text)]">
            专业版
          </span>
          <h1 className="mt-12 flex items-center gap-5 text-center font-serif text-[42px] font-medium leading-tight text-[var(--text-primary)] md:text-[56px]">
            <span className="font-sans text-[var(--accent)]">✳</span>
            晚上好，Yifan
          </h1>

          <div className="mt-10 w-full">{composer}</div>

          <div className="mt-8 grid w-full grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {quickCards.map((card, index) => (
              <button
                key={card.title}
                type="button"
                onClick={() =>
                  onSuggest?.(
                    SUGGESTED_PROMPTS[index % SUGGESTED_PROMPTS.length],
                  )
                }
                className="min-h-[80px] rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-elevated)] p-4 text-left shadow-[0_1px_2px_rgba(0,0,0,0.03)] transition hover:-translate-y-0.5 hover:border-[var(--accent-soft)] hover:shadow-[0_10px_30px_rgba(31,26,18,0.08)]"
              >
                <div className="flex items-start gap-3">
                  <span className="text-lg text-[var(--text-secondary)]">
                    {card.icon}
                  </span>
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

          <section className="mt-12 w-full">
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
                    <span className="text-xl leading-none text-[var(--text-muted)]">
                      ⋮
                    </span>
                  </div>
                  <p className="mt-5 text-sm text-[var(--text-muted)]">
                    {project.detail}
                  </p>
                </div>
              ))}
            </div>
          </section>

          <p className="mt-14 text-center text-xs text-[var(--text-muted)]">
            Claude 可以犯错。请核查重要信息。
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="shrink-0 bg-[var(--bg-main)] px-4 pb-7 pt-3 md:px-8">
      <div className="mx-auto max-w-[940px]">
        {composer}
        <p className="mt-4 text-center text-xs text-[var(--text-muted)]">
          Claude 可以犯错。请核查重要信息。
        </p>
      </div>
    </div>
  );
}
