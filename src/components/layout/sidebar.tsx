"use client";

import type { Conversation } from "@/lib/types";
import { ConversationList } from "./conversation-list";

interface SidebarProps {
  conversations: Conversation[];
  activeId: string | null;
  onNewChat: () => void;
  onSelect: (id: string) => void;
}

export function Sidebar({
  conversations,
  activeId,
  onNewChat,
  onSelect,
}: SidebarProps) {
  return (
    <aside className="flex h-full w-[260px] shrink-0 flex-col border-r border-[var(--border-subtle)] bg-[var(--bg-sidebar)]">
      <div className="flex items-center gap-2 px-4 py-4">
        <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-[var(--accent)] text-sm font-semibold text-white">
          D
        </span>
        <span className="text-sm font-semibold text-[var(--text-primary)]">
          Chat Demo
        </span>
      </div>

      <div className="px-3 pb-2">
        <button
          type="button"
          onClick={onNewChat}
          className="flex w-full items-center justify-center gap-2 rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-elevated)] px-3 py-2.5 text-sm font-medium text-[var(--text-primary)] transition hover:bg-[var(--bg-hover)]"
        >
          <span className="text-lg leading-none">+</span>
          新对话
        </button>
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto py-2">
        <p className="mb-1 px-4 text-xs font-medium uppercase tracking-wide text-[var(--text-muted)]">
          最近
        </p>
        <ConversationList
          conversations={conversations}
          activeId={activeId}
          onSelect={onSelect}
        />
      </div>

      <div className="border-t border-[var(--border-subtle)] px-4 py-3 text-xs text-[var(--text-muted)]">
        DeepSeek · 本地演示
      </div>
    </aside>
  );
}
