import { CHAT_MODELS, DEFAULT_MODEL, type ChatModel, type Conversation } from "./types";

const CONVERSATIONS_KEY = "chatbot-conversations";
const ACTIVE_ID_KEY = "chatbot-active-id";
const THEME_KEY = "chatbot-theme";
const MODEL_KEY = "chatbot-model";

export type ThemeMode = "light" | "dark";

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

export function loadTheme(): ThemeMode {
  if (!isBrowser()) return "light";
  return localStorage.getItem(THEME_KEY) === "dark" ? "dark" : "light";
}

export function saveTheme(theme: ThemeMode): void {
  if (!isBrowser()) return;
  localStorage.setItem(THEME_KEY, theme);
}

export function loadModel(): ChatModel {
  if (!isBrowser()) return DEFAULT_MODEL;
  const model = localStorage.getItem(MODEL_KEY);
  return CHAT_MODELS.some((item) => item.id === model)
    ? (model as ChatModel)
    : DEFAULT_MODEL;
}

export function saveModel(model: ChatModel): void {
  if (!isBrowser()) return;
  localStorage.setItem(MODEL_KEY, model);
}
