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
      <p className="px-3 py-2 text-xs text-[var(--text-muted)]">
        暂无历史对话
      </p>
    );
  }

  return (
    <nav className="flex flex-col gap-0.5 px-2">
      {conversations.map((conversation) => {
        const isActive = conversation.id === activeId;
        const isEditing = editingId === conversation.id;
        return (
          <div
            key={conversation.id}
            className={`group flex items-center gap-1 rounded-lg transition ${
              isActive
                ? "bg-[var(--bg-active)] text-[var(--text-primary)]"
                : "text-[var(--text-secondary)] hover:bg-[var(--bg-hover)]"
            }`}
          >
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
                className="min-w-0 flex-1 bg-transparent px-3 py-2 text-left text-sm text-[var(--text-primary)] outline-none"
              />
            ) : (
              <button
                type="button"
                onClick={() => onSelect(conversation.id)}
                onDoubleClick={() => startRename(conversation)}
                className="min-w-0 flex-1 truncate px-3 py-2 text-left text-sm"
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
                  if (window.confirm(`删除对话"${conversation.title}"？`)) {
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
