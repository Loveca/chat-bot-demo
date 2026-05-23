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
  onRename: (id: string, title: string) => void;
  onToggleCollapsed: () => void;
}

const navItems = [
  { label: "对话", icon: "◱", active: true },
  { label: "项目", icon: "□", badge: "Beta" },
  { label: "Artifacts", icon: "◇" },
  { label: "收藏夹", icon: "☆" },
];

export function Sidebar({
  conversations,
  activeId,
  collapsed,
  onNewChat,
  onSelect,
  onDelete,
  onRename,
  onToggleCollapsed,
}: SidebarProps) {
  return (
    <aside
      className={`flex h-full shrink-0 flex-col border-r border-[var(--border-subtle)] bg-[var(--bg-sidebar)] ${
        collapsed ? "w-[304px] md:w-[76px]" : "w-[304px]"
      }`}
    >
      <div
        className={`flex h-[72px] items-center gap-3 border-b border-[var(--border-soft)] px-5 ${
          collapsed ? "md:justify-center md:px-3" : ""
        }`}
      >
        <div
          className={`font-serif text-[29px] font-semibold leading-none tracking-normal text-[var(--text-primary)] ${
            collapsed ? "md:hidden" : ""
          }`}
        >
          Claude
        </div>
        <button
          type="button"
          onClick={onToggleCollapsed}
          className={`ml-auto hidden h-9 w-9 items-center justify-center rounded-lg text-lg text-[var(--text-muted)] transition hover:bg-[var(--bg-hover)] hover:text-[var(--text-primary)] md:flex ${
            collapsed ? "md:ml-0" : ""
          }`}
          aria-label={collapsed ? "展开侧边栏" : "折叠侧边栏"}
          title={collapsed ? "展开侧边栏" : "折叠侧边栏"}
        >
          {collapsed ? "›" : "‹"}
        </button>
      </div>

      <div className="px-3 py-7">
        <button
          type="button"
          onClick={onNewChat}
          className={`flex h-12 w-full items-center gap-3 rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-elevated)] px-4 text-[15px] font-medium text-[var(--accent)] shadow-[0_1px_2px_rgba(0,0,0,0.03)] transition hover:border-[var(--accent-soft)] hover:bg-white ${
            collapsed ? "md:justify-center md:px-0" : ""
          }`}
          title="新建对话"
        >
          <span className="text-2xl font-light leading-none">+</span>
          <span className={collapsed ? "md:hidden" : ""}>新建对话</span>
        </button>
      </div>

      <nav
        className={`flex flex-col gap-2 px-3 ${
          collapsed ? "md:items-center md:px-2" : ""
        }`}
      >
        {navItems.map((item) => (
          <button
            key={item.label}
            type="button"
            className={`flex h-12 w-full items-center gap-3 rounded-lg px-4 text-left text-[15px] transition ${
              item.active
                ? "bg-[var(--bg-active)] text-[var(--accent)]"
                : "text-[var(--text-secondary)] hover:bg-[var(--bg-hover)] hover:text-[var(--text-primary)]"
            } ${collapsed ? "md:w-11 md:justify-center md:px-0" : ""}`}
            title={item.label}
          >
            <span className="w-5 text-center text-lg leading-none">{item.icon}</span>
            <span className={`min-w-0 flex-1 ${collapsed ? "md:hidden" : ""}`}>
              {item.label}
            </span>
            {item.badge && (
              <span
                className={`rounded-full bg-[var(--badge-bg)] px-2.5 py-1 text-xs font-medium text-[var(--badge-text)] ${
                  collapsed ? "md:hidden" : ""
                }`}
              >
                {item.badge}
              </span>
            )}
          </button>
        ))}
      </nav>

      <div
        className={`mt-7 min-h-0 flex-1 overflow-y-auto border-t border-[var(--border-soft)] px-3 pt-4 ${
          collapsed ? "md:hidden" : ""
        }`}
      >
        <div className="mb-2 flex items-center justify-between px-2">
          <p className="text-sm font-medium text-[var(--text-muted)]">最近对话</p>
          <span className="text-sm text-[var(--text-muted)]">查看全部 →</span>
        </div>
        <ConversationList
          conversations={conversations}
          activeId={activeId}
          onSelect={onSelect}
          onDelete={onDelete}
          onRename={onRename}
        />
      </div>

      <div className={`px-5 pb-5 ${collapsed ? "md:hidden" : ""}`}>
        <div className="mb-7 rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-elevated)] p-4">
          <p className="font-serif text-lg font-semibold">Claude Pro</p>
          <p className="mt-2 text-sm leading-6 text-[var(--text-muted)]">
            使用更多模型和更高的使用限额。
          </p>
          <button
            type="button"
            className="mt-4 h-10 w-full rounded-lg border border-[var(--border-subtle)] bg-white text-sm font-medium transition hover:bg-[var(--bg-hover)]"
          >
            升级计划
          </button>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[var(--text-primary)] text-sm font-semibold text-[var(--bg-main)]">
            Y
          </div>
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-semibold">Yifan</p>
            <p className="truncate text-sm text-[var(--text-muted)]">
              yifan@example.com
            </p>
          </div>
          <span className="text-lg text-[var(--text-muted)]">⌄</span>
        </div>
      </div>
    </aside>
  );
}
