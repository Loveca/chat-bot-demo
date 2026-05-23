"use client";

import { useRef, useState } from "react";
import type { Conversation } from "@/lib/types";

interface ConversationListProps {
  conversations: Conversation[];
  activeId: string | null;
  onSelect: (id: string) => void;
  onDelete: (id: string) => void;
  onRename: (id: string, title: string) => void;
}

const fallbackItems = ["介绍下日本的文化", "帮我写一封产品经理岗位的求职信", "解释一下什么是量子计算", "如何提高睡眠质量"];

export function ConversationList({
  conversations,
  activeId,
  onSelect,
  onDelete,
  onRename,
}: ConversationListProps) {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editValue, setEditValue] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  const startRename = (conversation: Conversation) => {
    setEditingId(conversation.id);
    setEditValue(conversation.title);
    requestAnimationFrame(() => inputRef.current?.select());
  };

  const submitRename = () => {
    if (editingId && editValue.trim()) {
      onRename(editingId, editValue.trim());
    }
    setEditingId(null);
  };

  if (conversations.length === 0) {
    return (
      <div className="flex flex-col gap-1">
        {fallbackItems.map((item) => (
          <div
            key={item}
            className="flex h-9 items-center gap-2 rounded-lg px-2 text-sm text-[var(--text-secondary)]"
          >
            <span className="text-[13px] text-[var(--text-muted)]">□</span>
            <span className="truncate">{item}</span>
          </div>
        ))}
      </div>
    );
  }

  return (
    <nav className="flex flex-col gap-1">
      {conversations.map((conversation) => {
        const isActive = conversation.id === activeId;
        const isEditing = editingId === conversation.id;
        return (
          <div
            key={conversation.id}
            className={`group flex h-9 items-center gap-1 rounded-lg transition ${
              isActive
                ? "bg-[var(--bg-active)] text-[var(--text-primary)]"
                : "text-[var(--text-secondary)] hover:bg-[var(--bg-hover)]"
            }`}
          >
            <span className="pl-2 text-[13px] text-[var(--text-muted)]">□</span>
            {isEditing ? (
              <input
                ref={inputRef}
                value={editValue}
                onChange={(e) => setEditValue(e.target.value)}
                onBlur={submitRename}
                onKeyDown={(e) => {
                  if (e.key === "Enter") submitRename();
                  if (e.key === "Escape") setEditingId(null);
                }}
                className="min-w-0 flex-1 bg-transparent py-1 text-left text-sm text-[var(--text-primary)] outline-none"
              />
            ) : (
              <button
                type="button"
                onClick={() => onSelect(conversation.id)}
                onDoubleClick={() => startRename(conversation)}
                className="min-w-0 flex-1 truncate py-1 text-left text-sm"
                title={conversation.title}
              >
                {conversation.title}
              </button>
            )}
            {!isEditing && (
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
            )}
          </div>
        );
      })}
    </nav>
  );
}
