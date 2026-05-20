export type MessageRole = "user" | "assistant" | "system";

export type MessageStatus = "streaming" | "done" | "error" | "aborted";

export interface Message {
  id: string;
  role: MessageRole;
  content: string;
  createdAt: number;
  status?: MessageStatus;
}

export interface Conversation {
  id: string;
  title: string;
  createdAt: number;
  updatedAt: number;
  messages: Message[];
}

export interface ChatMessagePayload {
  role: MessageRole;
  content: string;
}

export interface ChatRequestBody {
  messages: ChatMessagePayload[];
  model?: string;
  stream?: boolean;
}

export type ChatModel = "deepseek-chat" | "deepseek-reasoner";

export const DEFAULT_MODEL: ChatModel = "deepseek-chat";

export const CHAT_MODELS: Array<{
  id: ChatModel;
  name: string;
  description: string;
}> = [
  {
    id: "deepseek-chat",
    name: "DeepSeek Chat",
    description: "通用对话",
  },
  {
    id: "deepseek-reasoner",
    name: "DeepSeek Reasoner",
    description: "推理增强",
  },
];

export const SUGGESTED_PROMPTS = [
  "用三句话解释量子纠缠",
  "帮我写一封简短的邮件，感谢同事协助项目",
  "列出学习 TypeScript 的 5 个步骤",
] as const;
