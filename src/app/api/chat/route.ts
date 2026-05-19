import {
  createChatCompletion,
  DeepSeekError,
  getServerChatConfig,
} from "@/lib/deepseek";
import type { ChatMessagePayload, ChatRequestBody } from "@/lib/types";

export const runtime = "nodejs";

const MAX_CONTENT_LENGTH = 32_000;

function validateMessages(
  messages: unknown,
): { ok: true; messages: ChatMessagePayload[] } | { ok: false; error: string } {
  if (!Array.isArray(messages) || messages.length === 0) {
    return { ok: false, error: "messages 必须为非空数组" };
  }

  for (const item of messages) {
    if (
      !item ||
      typeof item !== "object" ||
      !("role" in item) ||
      !("content" in item)
    ) {
      return { ok: false, error: "messages 格式无效" };
    }
    const { role, content } = item as ChatMessagePayload;
    if (!["user", "assistant", "system"].includes(role)) {
      return { ok: false, error: "role 必须为 user、assistant 或 system" };
    }
    if (typeof content !== "string") {
      return { ok: false, error: "content 必须为字符串" };
    }
    if (content.length > MAX_CONTENT_LENGTH) {
      return {
        ok: false,
        error: `单条消息不能超过 ${MAX_CONTENT_LENGTH} 个字符`,
      };
    }
  }

  return { ok: true, messages: messages as ChatMessagePayload[] };
}

export async function POST(request: Request) {
  let body: ChatRequestBody;
  try {
    body = (await request.json()) as ChatRequestBody;
  } catch {
    return Response.json({ error: "无效的 JSON 请求体" }, { status: 400 });
  }

  const validated = validateMessages(body.messages);
  if (!validated.ok) {
    return Response.json({ error: validated.error }, { status: 400 });
  }

  const { defaultModel, systemPrompt, maxHistory } = getServerChatConfig();
  const model = body.model ?? defaultModel;
  const stream = body.stream !== false;

  let messages = validated.messages;
  if (systemPrompt?.trim() && !messages.some((m) => m.role === "system")) {
    messages = [{ role: "system", content: systemPrompt.trim() }, ...messages];
  }
  if (messages.length > maxHistory) {
    const systemMsgs = messages.filter((m) => m.role === "system");
    const rest = messages.filter((m) => m.role !== "system");
    messages = [...systemMsgs, ...rest.slice(-maxHistory)];
  }

  try {
    const upstream = await createChatCompletion({
      messages,
      model,
      stream,
      signal: request.signal,
    });

    if (!stream) {
      const data = (await upstream.json()) as {
        choices?: Array<{ message?: { content?: string } }>;
      };
      const content = data.choices?.[0]?.message?.content ?? "";
      return Response.json({ content });
    }

    return new Response(upstream.body, {
      headers: {
        "Content-Type": "text/event-stream; charset=utf-8",
        "Cache-Control": "no-cache, no-transform",
        Connection: "keep-alive",
      },
    });
  } catch (err) {
    if (request.signal.aborted) {
      return new Response(null, { status: 499 });
    }
    if (err instanceof DeepSeekError) {
      return Response.json({ error: err.message }, { status: err.status });
    }
    return Response.json(
      { error: err instanceof Error ? err.message : "服务器错误" },
      { status: 502 },
    );
  }
}
