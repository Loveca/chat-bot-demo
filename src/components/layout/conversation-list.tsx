"use client";

import type { Conversation } from "@/lib/types";

interface ConversationListProps {
  conversations: Conversation[];
  activeId: string | null;
  onSelect: (id: string) => void;
}

export function ConversationList({
  conversations,
  activeId,
  onSelect,
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
          <button
            key={conversation.id}
            type="button"
            onClick={() => onSelect(conversation.id)}
            className={`w-full truncate rounded-lg px-3 py-2 text-left text-sm transition ${
              isActive
                ? "bg-[var(--bg-active)] text-[var(--text-primary)]"
                : "text-[var(--text-secondary)] hover:bg-[var(--bg-hover)]"
            }`}
            title={conversation.title}
          >
            {conversation.title}
          </button>
        );
      })}
    </nav>
  );
}
