"use client";

import { useCallback, useEffect, useRef, type KeyboardEvent } from "react";

interface ChatInputProps {
  disabled?: boolean;
  isStreaming: boolean;
  onSend: (text: string) => void;
  onStop: () => void;
}

export function ChatInput({
  disabled,
  isStreaming,
  onSend,
  onStop,
}: ChatInputProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const resize = useCallback(() => {
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = "auto";
    el.style.height = `${Math.min(el.scrollHeight, 200)}px`;
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

  return (
    <div className="border-t border-[var(--border-subtle)] bg-[var(--bg-main)] px-4 pb-6 pt-4 md:px-8">
      <div className="mx-auto max-w-3xl">
        <div className="relative flex items-end gap-2 rounded-2xl border border-[var(--border-input)] bg-[var(--bg-input)] px-4 py-3 shadow-sm focus-within:border-[var(--border-focus)]">
          <textarea
            ref={textareaRef}
            rows={1}
            placeholder="输入消息..."
            disabled={disabled}
            onInput={resize}
            onKeyDown={handleKeyDown}
            className="max-h-[200px] min-h-[24px] flex-1 resize-none bg-transparent text-[15px] leading-6 text-[var(--text-primary)] outline-none placeholder:text-[var(--text-muted)] disabled:opacity-50"
          />
          {isStreaming ? (
            <button
              type="button"
              onClick={onStop}
              className="shrink-0 rounded-lg bg-[var(--text-primary)] px-3 py-1.5 text-sm font-medium text-[var(--bg-main)] transition hover:opacity-90"
            >
              停止
            </button>
          ) : (
            <button
              type="button"
              onClick={submit}
              disabled={disabled}
              className="shrink-0 rounded-lg bg-[var(--accent)] px-3 py-1.5 text-sm font-medium text-white transition hover:opacity-90 disabled:opacity-40"
            >
              发送
            </button>
          )}
        </div>
        <p className="mt-2 text-center text-xs text-[var(--text-muted)]">
          Enter 发送 · Shift+Enter 换行
        </p>
      </div>
    </div>
  );
}
