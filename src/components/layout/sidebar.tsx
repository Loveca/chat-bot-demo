"use client";

import type { Conversation } from "@/lib/types";
import { ConversationList } from "./conversation-list";

interface SidebarProps {
  conversations: Conversation[];
  activeId: string | null;
  collapsed: boolean;
  onNewChat: () => void;
  onSelect: (id: string) => void;
  onDelete: (id: string) => void;
  onToggleCollapsed: () => void;
}

export function Sidebar({
  conversations,
  activeId,
  collapsed,
  onNewChat,
  onSelect,
  onDelete,
  onToggleCollapsed,
}: SidebarProps) {
  return (
    <aside
      className={`flex h-full shrink-0 flex-col border-r border-[var(--border-subtle)] bg-[var(--bg-sidebar)] ${
        collapsed ? "w-[260px] md:w-16" : "w-[260px]"
      }`}
    >
      <div
        className={`flex items-center gap-2 px-4 py-4 ${
          collapsed ? "md:justify-center md:px-2" : ""
        }`}
      >
        <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-[var(--accent)] text-sm font-semibold text-white">
          D
        </span>
        <span
          className={`text-sm font-semibold text-[var(--text-primary)] ${
            collapsed ? "md:hidden" : ""
          }`}
        >
          Chat Demo
        </span>
        <button
          type="button"
          onClick={onToggleCollapsed}
          className={`ml-auto hidden h-8 w-8 items-center justify-center rounded-md text-sm text-[var(--text-muted)] transition hover:bg-[var(--bg-hover)] hover:text-[var(--text-primary)] md:flex ${
            collapsed ? "md:ml-0" : ""
          }`}
          aria-label={collapsed ? "展开侧边栏" : "折叠侧边栏"}
          title={collapsed ? "展开侧边栏" : "折叠侧边栏"}
        >
          {collapsed ? "›" : "‹"}
        </button>
      </div>

      <div className="px-3 pb-2">
        <button
          type="button"
          onClick={onNewChat}
          className={`flex w-full items-center justify-center gap-2 rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-elevated)] px-3 py-2.5 text-sm font-medium text-[var(--text-primary)] transition hover:bg-[var(--bg-hover)] ${
            collapsed ? "md:px-0" : ""
          }`}
          title="新对话"
        >
          <span className="text-lg leading-none">+</span>
          <span className={collapsed ? "md:hidden" : ""}>新对话</span>
        </button>
      </div>

      <div
        className={`min-h-0 flex-1 overflow-y-auto py-2 ${
          collapsed ? "md:hidden" : ""
        }`}
      >
        <p className="mb-1 px-4 text-xs font-medium uppercase tracking-wide text-[var(--text-muted)]">
          最近
        </p>
        <ConversationList
          conversations={conversations}
          activeId={activeId}
          onSelect={onSelect}
          onDelete={onDelete}
        />
      </div>

      <div
        className={`border-t border-[var(--border-subtle)] px-4 py-3 text-xs text-[var(--text-muted)] ${
          collapsed ? "md:hidden" : ""
        }`}
      >
        DeepSeek · 本地演示
      </div>
    </aside>
  );
}
