import type { ChatMessagePayload, Conversation, Message } from "./types";

const MAX_CONTENT_LENGTH = 32_000;

export function validateMessageContent(content: string): string | null {
  if (!content.trim()) return "消息不能为空";
  if (content.length > MAX_CONTENT_LENGTH) {
    return `消息过长，最多 ${MAX_CONTENT_LENGTH} 个字符`;
  }
  return null;
}

export function titleFromFirstMessage(content: string): string {
  const trimmed = content.trim().replace(/\s+/g, " ");
  if (trimmed.length <= 30) return trimmed || "新对话";
  return `${trimmed.slice(0, 30)}...`;
}

export function buildApiMessages(
  conversation: Conversation,
  maxMessages: number,
  systemPrompt?: string,
): ChatMessagePayload[] {
  const history = conversation.messages
    .filter((m) => m.role === "user" || m.role === "assistant")
    .filter((m) => m.content.trim() && m.status !== "error")
    .slice(-maxMessages);

  const payloads: ChatMessagePayload[] = history.map((m) => ({
    role: m.role,
    content: m.content,
  }));

  if (systemPrompt?.trim()) {
    return [{ role: "system", content: systemPrompt.trim() }, ...payloads];
  }

  return payloads;
}

export function toChatPayload(messages: Message[]): ChatMessagePayload[] {
  return messages
    .filter((m) => m.role === "user" || m.role === "assistant")
    .map((m) => ({ role: m.role, content: m.content }));
}
