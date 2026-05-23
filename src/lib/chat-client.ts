import type { ChatMessagePayload } from "./types";

export interface StreamChatOptions {
  messages: ChatMessagePayload[];
  model?: string;
  stream?: boolean;
  signal?: AbortSignal;
  onDelta: (text: string) => void;
  onDone: () => void;
  onError: (message: string) => void;
}

interface StreamChunk {
  choices?: Array<{
    delta?: { content?: string };
    finish_reason?: string | null;
  }>;
}

export async function streamChat(options: StreamChatOptions): Promise<void> {
  const { messages, model, stream = true, signal, onDelta, onDone, onError } =
    options;

  let response: Response;
  try {
    response = await fetch("/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ messages, model, stream }),
      signal,
    });
  } catch (err) {
    if (signal?.aborted) {
      onDone();
      return;
    }
    onError(err instanceof Error ? err.message : "网络请求失败");
    return;
  }

  if (!response.ok) {
    let message = `请求失败（${response.status}）`;
    try {
      const body = (await response.json()) as { error?: string };
      message = body.error ?? message;
    } catch {
      /* ignore */
    }
    onError(message);
    return;
  }

  if (!stream) {
    try {
      const data = (await response.json()) as { content?: string };
      const content = data.content ?? "";
      if (content) onDelta(content);
      onDone();
    } catch {
      onError("解析响应失败");
    }
    return;
  }

  const reader = response.body?.getReader();
  if (!reader) {
    onError("无法读取响应流");
    return;
  }

  const decoder = new TextDecoder();
  let buffer = "";

  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      buffer += decoder.decode(value, { stream: true });
      const lines = buffer.split("\n");
      buffer = lines.pop() ?? "";

      for (const line of lines) {
        const trimmed = line.trim();
        if (!trimmed.startsWith("data:")) continue;

        const data = trimmed.slice(5).trim();
        if (data === "[DONE]") {
          onDone();
          return;
        }

        try {
          const parsed = JSON.parse(data) as StreamChunk;
          const delta = parsed.choices?.[0]?.delta?.content;
          if (delta) onDelta(delta);
        } catch {
          /* skip malformed chunks */
        }
      }
    }
    onDone();
  } catch (err) {
    if (signal?.aborted) {
      onDone();
      return;
    }
    onError(err instanceof Error ? err.message : "流式读取失败");
  }
}
