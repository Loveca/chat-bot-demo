import type { Conversation } from "./types";

const CONVERSATIONS_KEY = "chatbot-conversations";
const ACTIVE_ID_KEY = "chatbot-active-id";

function isBrowser(): boolean {
  return typeof window !== "undefined";
}

export function loadConversations(): Conversation[] {
  if (!isBrowser()) return [];
  try {
    const raw = localStorage.getItem(CONVERSATIONS_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as Conversation[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function saveConversations(conversations: Conversation[]): void {
  if (!isBrowser()) return;
  localStorage.setItem(CONVERSATIONS_KEY, JSON.stringify(conversations));
}

export function loadActiveId(): string | null {
  if (!isBrowser()) return null;
  return localStorage.getItem(ACTIVE_ID_KEY);
}

export function saveActiveId(id: string | null): void {
  if (!isBrowser()) return;
  if (id === null) {
    localStorage.removeItem(ACTIVE_ID_KEY);
  } else {
    localStorage.setItem(ACTIVE_ID_KEY, id);
  }
}
