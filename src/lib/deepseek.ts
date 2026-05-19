import type { ChatMessagePayload } from "./types";

export class DeepSeekError extends Error {
  constructor(
    message: string,
    public status: number,
  ) {
    super(message);
    this.name = "DeepSeekError";
  }
}

function getConfig() {
  const apiKey = process.env.DEEPSEEK_API_KEY;
  const baseUrl = (
    process.env.DEEPSEEK_BASE_URL ?? "https://api.deepseek.com"
  ).replace(/\/$/, "");
  const defaultModel = process.env.DEEPSEEK_DEFAULT_MODEL ?? "deepseek-chat";
  const systemPrompt = process.env.SYSTEM_PROMPT;
  const maxHistory = Number(process.env.MAX_HISTORY_MESSAGES ?? "40");

  return {
    apiKey,
    baseUrl,
    defaultModel,
    systemPrompt,
    maxHistory: Number.isFinite(maxHistory) && maxHistory > 0 ? maxHistory : 40,
  };
}

export function assertApiKey(): string {
  const { apiKey } = getConfig();
  if (!apiKey?.trim()) {
    throw new DeepSeekError(
      "服务端未配置 DEEPSEEK_API_KEY，请在 .env.local 中设置",
      401,
    );
  }
  return apiKey.trim();
}

export interface CreateChatCompletionOptions {
  messages: ChatMessagePayload[];
  model?: string;
  stream: boolean;
  signal?: AbortSignal;
}

export async function createChatCompletion(
  options: CreateChatCompletionOptions,
): Promise<Response> {
  const { apiKey, baseUrl, defaultModel } = getConfig();
  const key = apiKey?.trim();
  if (!key) {
    throw new DeepSeekError(
      "服务端未配置 DEEPSEEK_API_KEY，请在 .env.local 中设置",
      401,
    );
  }

  const url = `${baseUrl}/chat/completions`;
  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${key}`,
    },
    body: JSON.stringify({
      model: options.model ?? defaultModel,
      messages: options.messages,
      stream: options.stream,
    }),
    signal: options.signal,
  });

  if (!response.ok) {
    let detail = response.statusText;
    try {
      const body = (await response.json()) as { error?: { message?: string } };
      detail = body.error?.message ?? detail;
    } catch {
      /* ignore parse errors */
    }

    const status =
      response.status === 429
        ? 429
        : response.status >= 500
          ? 502
          : response.status;

    throw new DeepSeekError(detail || "DeepSeek API 请求失败", status);
  }

  return response;
}

export function getServerChatConfig() {
  return getConfig();
}
