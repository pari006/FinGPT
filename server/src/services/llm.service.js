import "../config/env.js";

const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
const OPENAI_MODEL = process.env.OPENAI_MODEL || "gpt-4o-mini";
const OPENAI_BASE_URL = (process.env.OPENAI_BASE_URL || "https://api.openai.com/v1").replace(/\/$/, "");

const financeSystemPrompt = [
  "You are FinGPT, a finance education assistant.",
  "Give practical, concise, risk-aware explanations for market data, financial terms, reports, and portfolio research.",
  "Do not provide personalized investment advice, price targets, or buy/sell commands.",
  "If live market data is not included in the context, say so instead of inventing current prices.",
  "When data is included, explain what it can and cannot prove.",
].join(" ");

function cleanMessageContent(content = "") {
  return String(content).replace(/\s+/g, " ").trim().slice(0, 4000);
}

function sanitizeConversation(messages = []) {
  return messages
    .filter((message) => ["user", "assistant"].includes(message?.role))
    .map((message) => ({
      role: message.role,
      content: cleanMessageContent(message.content),
    }))
    .filter((message) => message.content)
    .slice(-10);
}

function buildMessages({ messages = [], prompt = "", marketContext = "", systemPrompt = financeSystemPrompt }) {
  const cleanedPrompt = cleanMessageContent(prompt);
  const conversation = sanitizeConversation(messages);
  const lastMessage = conversation.at(-1);

  if (cleanedPrompt && !(lastMessage?.role === "user" && lastMessage.content === cleanedPrompt)) {
    conversation.push({ role: "user", content: cleanedPrompt });
  }

  const assembled = [{ role: "system", content: systemPrompt }];
  if (marketContext) {
    assembled.push({
      role: "system",
      content: `Use this application-provided market context when relevant. Do not treat demo fallback values as live data.\n${marketContext}`,
    });
  }

  return [...assembled, ...conversation];
}

export function isLlmConfigured() {
  return Boolean(OPENAI_API_KEY);
}

export function getLlmStatus() {
  return {
    provider: isLlmConfigured() ? "openai-compatible" : "local-fallback",
    model: isLlmConfigured() ? OPENAI_MODEL : "deterministic finance fallback",
    configured: isLlmConfigured(),
  };
}

export async function* streamModelResponse({ messages, prompt, marketContext, systemPrompt, temperature = 0.35 }) {
  if (!isLlmConfigured()) {
    throw new Error("OPENAI_API_KEY is not configured.");
  }

  const response = await fetch(`${OPENAI_BASE_URL}/chat/completions`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${OPENAI_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: OPENAI_MODEL,
      messages: buildMessages({ messages, prompt, marketContext, systemPrompt }),
      temperature,
      stream: true,
    }),
  });

  if (!response.ok || !response.body) {
    const details = await response.text().catch(() => "");
    throw new Error(`LLM request failed with status ${response.status}. ${details}`.trim());
  }

  const reader = response.body.getReader();
  const decoder = new TextDecoder();
  let buffer = "";

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;

    buffer += decoder.decode(value, { stream: true });
    const events = buffer.split("\n\n");
    buffer = events.pop() || "";

    for (const event of events) {
      const lines = event.split("\n").filter((line) => line.startsWith("data: "));
      for (const line of lines) {
        const raw = line.slice(6).trim();
        if (!raw || raw === "[DONE]") return;

        const payload = JSON.parse(raw);
        const token = payload.choices?.[0]?.delta?.content;
        if (token) yield token;
      }
    }
  }
}

export async function collectModelResponse(options) {
  let output = "";
  for await (const token of streamModelResponse(options)) {
    output += token;
  }
  return output.trim();
}
