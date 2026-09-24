import type { IncomingMessage, ServerResponse } from "node:http";
import { POST } from "../../server/chat.js";

type VercelRequest = IncomingMessage & {
  body?: unknown;
};

function requestBody(request: VercelRequest) {
  if (typeof request.body === "string") return Promise.resolve(request.body);
  if (request.body !== undefined) return Promise.resolve(JSON.stringify(request.body));

  return new Promise<string>((resolve, reject) => {
    const chunks: Buffer[] = [];
    request.on("data", (chunk) => chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk)));
    request.on("end", () => resolve(Buffer.concat(chunks).toString("utf8")));
    request.on("error", reject);
  });
}

export default async function handler(request: VercelRequest, response: ServerResponse) {
  if (request.method !== "POST") {
    response.statusCode = 405;
    response.setHeader("Allow", "POST");
    response.setHeader("Content-Type", "application/json; charset=utf-8");
    response.end(JSON.stringify({ error: "请求方法不受支持。" }));
    return;
  }

  const headers = new Headers();
  for (const [name, value] of Object.entries(request.headers)) {
    if (Array.isArray(value)) {
      value.forEach((item) => headers.append(name, item));
    } else if (typeof value === "string") {
      headers.set(name, value);
    }
  }

  const upstreamResponse = await POST(new Request("https://nexus-ai.local/api/nexus/chat", {
    method: "POST",
    headers,
    body: await requestBody(request),
  }));

  response.statusCode = upstreamResponse.status;
  upstreamResponse.headers.forEach((value, name) => response.setHeader(name, value));
  response.end(await upstreamResponse.text());
}
