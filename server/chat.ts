const UPSTREAM_BASE_URL = "https://www.xiaoyaoapi.com/v1";
const UPSTREAM_MODEL = "claude-sonnet-4-6";
const MAX_REQUEST_BYTES = 64 * 1024;
const MAX_MESSAGES = 20;
const MAX_MESSAGE_CHARACTERS = 4_000;
const MAX_TOTAL_CHARACTERS = 12_000;
const MAX_UPSTREAM_BYTES = 256 * 1024;
const MAX_REPLY_CHARACTERS = 6_000;
const UPSTREAM_TIMEOUT_MS = 30_000;

const SYSTEM_PROMPT = [
  "你是 Nexus 学习伴侣。请用简洁、清晰、友善的中文回答普通学习问题。",
  "只依据当前对话中真实提供的内容作答。",
  "不得声称你已读取微信、知识图谱、账号、文件或任何私人数据，除非这些内容确实出现在当前请求中。",
  "当前应用内可引用的是 Nexus Demo 已展示的示例资料：Transformer 架构优化文章摘要（涵盖模型压缩与量化技术）、强化学习奖励函数设计思考、HTTP/3 协议标准与实践文件标题、矩阵乘法几何意义与特征值语音摘要，以及强化学习、深度学习、优化算法、马尔可夫决策和环境交互的演示知识节点。",
  "这些都是演示上下文，不是真实读取的私人文件；资料没有给出正文时，不得编造正文细节。",
  "不要调用工具，不要假装执行了外部操作；信息不足时直接说明并提出一个简短的澄清问题。",
].join("\n");

type ClientRole = "user" | "assistant";

type ClientMessage = {
  role: ClientRole;
  content: string;
};

type UpstreamUsage = {
  prompt_tokens?: unknown;
  completion_tokens?: unknown;
  total_tokens?: unknown;
};

class InvalidChatRequest extends Error {}
class UpstreamPayloadTooLarge extends Error {}

function jsonResponse(body: unknown, status: number) {
  return Response.json(body, {
    status,
    headers: {
      "Cache-Control": "no-store",
      "Content-Type": "application/json; charset=utf-8",
    },
  });
}

function isPlainRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function hasExactlyKeys(value: Record<string, unknown>, expected: string[]) {
  const keys = Object.keys(value).sort();
  return keys.length === expected.length && keys.every((key, index) => key === expected[index]);
}

function validateMessages(payload: unknown): ClientMessage[] {
  if (!isPlainRecord(payload) || !hasExactlyKeys(payload, ["messages"])) {
    throw new InvalidChatRequest("Invalid request shape");
  }

  if (!Array.isArray(payload.messages) || payload.messages.length < 1 || payload.messages.length > MAX_MESSAGES) {
    throw new InvalidChatRequest("Invalid message count");
  }

  let totalCharacters = 0;
  const messages = payload.messages.map((message): ClientMessage => {
    if (!isPlainRecord(message) || !hasExactlyKeys(message, ["content", "role"])) {
      throw new InvalidChatRequest("Invalid message shape");
    }

    if (message.role !== "user" && message.role !== "assistant") {
      throw new InvalidChatRequest("Invalid role");
    }

    if (typeof message.content !== "string") {
      throw new InvalidChatRequest("Invalid content");
    }

    const content = message.content.trim();
    if (!content || content.length > MAX_MESSAGE_CHARACTERS) {
      throw new InvalidChatRequest("Invalid content length");
    }

    totalCharacters += content.length;
    if (totalCharacters > MAX_TOTAL_CHARACTERS) {
      throw new InvalidChatRequest("Conversation too long");
    }

    return { role: message.role, content };
  });

  if (messages.at(-1)?.role !== "user") {
    throw new InvalidChatRequest("Last message must be from the user");
  }

  return messages;
}

async function readTextWithLimit(response: Response, limit: number) {
  const declaredLength = Number(response.headers.get("content-length"));
  if (Number.isFinite(declaredLength) && declaredLength > limit) {
    throw new UpstreamPayloadTooLarge();
  }

  if (!response.body) return "";

  const reader = response.body.getReader();
  const chunks: Uint8Array[] = [];
  let received = 0;

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    received += value.byteLength;
    if (received > limit) {
      await reader.cancel();
      throw new UpstreamPayloadTooLarge();
    }
    chunks.push(value);
  }

  const body = new Uint8Array(received);
  let offset = 0;
  for (const chunk of chunks) {
    body.set(chunk, offset);
    offset += chunk.byteLength;
  }
  return new TextDecoder().decode(body);
}

function safeTokenCount(value: unknown) {
  return typeof value === "number" && Number.isFinite(value) && value >= 0 ? Math.floor(value) : 0;
}

export async function POST(request: Request) {
  if (!request.headers.get("content-type")?.toLowerCase().startsWith("application/json")) {
    return jsonResponse({ error: "请求格式不正确。" }, 415);
  }

  const declaredLength = Number(request.headers.get("content-length"));
  if (Number.isFinite(declaredLength) && declaredLength > MAX_REQUEST_BYTES) {
    return jsonResponse({ error: "对话内容过长，请缩短后再试。" }, 413);
  }

  let messages: ClientMessage[];
  try {
    const rawBody = await request.text();
    if (new TextEncoder().encode(rawBody).byteLength > MAX_REQUEST_BYTES) {
      return jsonResponse({ error: "对话内容过长，请缩短后再试。" }, 413);
    }
    messages = validateMessages(JSON.parse(rawBody));
  } catch (error) {
    if (error instanceof InvalidChatRequest || error instanceof SyntaxError) {
      return jsonResponse({ error: "消息内容不符合要求，请检查后重试。" }, 400);
    }
    return jsonResponse({ error: "暂时无法处理这条消息，请稍后再试。" }, 400);
  }

  const apiKey = process.env.XIAOYAO_API_KEY?.trim();
  if (!apiKey) {
    return jsonResponse({ error: "AI 服务暂时不可用，请稍后再试。" }, 503);
  }

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), UPSTREAM_TIMEOUT_MS);

  try {
    const upstreamResponse = await fetch(`${UPSTREAM_BASE_URL}/chat/completions`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: UPSTREAM_MODEL,
        messages: [{ role: "system", content: SYSTEM_PROMPT }, ...messages],
        max_tokens: 900,
        stream: false,
      }),
      signal: controller.signal,
    });

    if (!upstreamResponse.ok) {
      return jsonResponse({ error: "AI 服务暂时没有响应，请稍后再试。" }, 503);
    }

    const rawUpstreamBody = await readTextWithLimit(upstreamResponse, MAX_UPSTREAM_BYTES);
    const upstreamPayload: unknown = JSON.parse(rawUpstreamBody);
    if (!isPlainRecord(upstreamPayload) || !Array.isArray(upstreamPayload.choices)) {
      return jsonResponse({ error: "AI 回复格式异常，请重新发送。" }, 502);
    }

    const firstChoice = upstreamPayload.choices[0];
    const message = isPlainRecord(firstChoice) ? firstChoice.message : undefined;
    const content = isPlainRecord(message) && typeof message.content === "string" ? message.content.trim() : "";
    if (!content || content.length > MAX_REPLY_CHARACTERS) {
      return jsonResponse({ error: "AI 回复格式异常，请重新发送。" }, 502);
    }

    const usage = isPlainRecord(upstreamPayload.usage) ? (upstreamPayload.usage as UpstreamUsage) : {};
    return jsonResponse(
      {
        message: content,
        meta: {
          model: UPSTREAM_MODEL,
          usage: {
            prompt_tokens: safeTokenCount(usage.prompt_tokens),
            completion_tokens: safeTokenCount(usage.completion_tokens),
            total_tokens: safeTokenCount(usage.total_tokens),
          },
        },
      },
      200,
    );
  } catch (error) {
    if (error instanceof UpstreamPayloadTooLarge) {
      return jsonResponse({ error: "AI 回复过长，请换一种更简短的问法。" }, 502);
    }
    if (error instanceof Error && error.name === "AbortError") {
      return jsonResponse({ error: "AI 回复超时，请重新发送。" }, 504);
    }
    return jsonResponse({ error: "AI 服务暂时不可用，请稍后再试。" }, 502);
  } finally {
    clearTimeout(timeout);
  }
}
