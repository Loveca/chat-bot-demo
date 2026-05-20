"use client";

import type { Conversation } from "@/lib/types";

interface ConversationListProps {
  conversations: Conversation[];
  activeId: string | null;
  onSelect: (id: string) => void;
  onDelete: (id: string) => void;
}

export function ConversationList({
  conversations,
  activeId,
  onSelect,
  onDelete,
}: ConversationListProps) {
  if (conversations.length === 0) {
    return (
      <p className="px-3 py-2 text-xs text-[var(--text-muted)]">
        暂无历史对话
      </p>
    );
  }

  return (
    <nav className="flex flex-col gap-0.5 px-2">
      {conversations.map((conversation) => {
        const isActive = conversation.id === activeId;
        return (
          <div
            key={conversation.id}
            className={`group flex items-center gap-1 rounded-lg transition ${
              isActive
                ? "bg-[var(--bg-active)] text-[var(--text-primary)]"
                : "text-[var(--text-secondary)] hover:bg-[var(--bg-hover)]"
            }`}
          >
            <button
              type="button"
              onClick={() => onSelect(conversation.id)}
              className="min-w-0 flex-1 truncate px-3 py-2 text-left text-sm"
              title={conversation.title}
            >
              {conversation.title}
            </button>
            <button
              type="button"
              onClick={(event) => {
                event.stopPropagation();
                if (window.confirm(`删除对话“${conversation.title}”？`)) {
                  onDelete(conversation.id);
                }
              }}
              className="mr-1 flex h-7 w-7 shrink-0 items-center justify-center rounded-md text-base leading-none text-[var(--text-muted)] opacity-0 transition hover:bg-[var(--bg-elevated)] hover:text-red-600 focus:opacity-100 group-hover:opacity-100"
              aria-label={`删除对话：${conversation.title}`}
              title="删除对话"
            >
              ×
            </button>
          </div>
        );
      })}
    </nav>
  );
}
