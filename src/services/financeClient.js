import { stocks as fallbackStocks } from "../data/stocks";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "";
const ALPHA_VANTAGE_API_KEY =
  import.meta.env.VITE_ALPHA_VANTAGE_API_KEY ||
  // Legacy fallback so your current .env still works if the key was pasted here.
  import.meta.env.VITE_GEMINI_API_KEY;

const ALPHA_VANTAGE_URL = "https://www.alphavantage.co/query";

const companyAliases = {
  apple: "AAPL",
  aapl: "AAPL",
  tesla: "TSLA",
  tsla: "TSLA",
  nvidia: "NVDA",
  nvda: "NVDA",
  microsoft: "MSFT",
  msft: "MSFT",
};

const defaultMovers = [
  { ticker: "NVDA", price: "129.93", change_amount: "3.34", change_percentage: "2.64%", volume: "215300000" },
  { ticker: "AAPL", price: "214.28", change_amount: "3.00", change_percentage: "1.42%", volume: "58230000" },
  { ticker: "MSFT", price: "447.61", change_amount: "4.12", change_percentage: "0.93%", volume: "22180000" },
  { ticker: "TSLA", price: "183.77", change_amount: "-1.60", change_percentage: "-0.86%", volume: "88710000" },
];

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function parseNumber(value, fallback = 0) {
  const parsed = Number.parseFloat(String(value || "").replace("%", ""));
  return Number.isFinite(parsed) ? parsed : fallback;
}

function extractSymbol(prompt = "") {
  const directMatch = prompt.match(/\b[A-Z]{1,5}\b/);
  if (directMatch) return directMatch[0];

  const lowerPrompt = prompt.toLowerCase();
  return Object.entries(companyAliases).find(([alias]) => lowerPrompt.includes(alias))?.[1] || "AAPL";
}

function inferSentiment(changePercent) {
  const change = parseNumber(changePercent, 0);
  const score = Math.round(Math.max(18, Math.min(92, 55 + change * 9)));
  return Number.isFinite(score) ? score : 55;
}

function inferTrend(changePercent) {
  const change = parseNumber(changePercent, 0);
  if (change >= 2) return "Momentum";
  if (change > 0.2) return "Bullish";
  if (change <= -2) return "Risk-off";
  if (change < -0.2) return "Soft";
  return "Neutral";
}

function createHistory(symbol, price) {
  const fallback = fallbackStocks.find((stock) => stock.symbol === symbol) || fallbackStocks[0];
  const base = price || fallback.price;

  return ["Mon", "Tue", "Wed", "Thu", "Fri"].map((day, index) => ({
    day,
    price: Number((base * (0.96 + index * 0.01 + (index % 2) * 0.006)).toFixed(2)),
  }));
}

function normalizeQuote(symbol, data) {
  const quote = data?.["Global Quote"] || {};
  const fallback = fallbackStocks.find((stock) => stock.symbol === symbol) || fallbackStocks[0];
  const changePercent = quote["10. change percent"] || `${fallback.change}%`;

  return {
    ...fallback,
    symbol,
    price: parseNumber(quote["05. price"], fallback.price),
    change: parseNumber(quote["09. change"], fallback.change),
    changePercent,
    sentiment: inferSentiment(changePercent),
    trend: inferTrend(changePercent),
    volume: quote["06. volume"] || "N/A",
    latestTradingDay: quote["07. latest trading day"] || "demo",
    source: quote["05. price"] ? "Alpha Vantage" : "Demo fallback",
    history: createHistory(symbol, parseNumber(quote["05. price"], fallback.price)),
  };
}

async function alphaRequest(params) {
  if (!ALPHA_VANTAGE_API_KEY) {
    throw new Error("Alpha Vantage API key is missing.");
  }

  const url = new URL(ALPHA_VANTAGE_URL);
  Object.entries({ ...params, apikey: ALPHA_VANTAGE_API_KEY }).forEach(([key, value]) => {
    url.searchParams.set(key, value);
  });

  const response = await fetch(url);
  if (!response.ok) {
    throw new Error("Alpha Vantage request failed.");
  }

  const data = await response.json();
  if (data.Note || data.Information || data["Error Message"]) {
    throw new Error(data.Note || data.Information || data["Error Message"]);
  }
  return data;
}

async function fetchQuoteDirect(symbol) {
  try {
    const data = await alphaRequest({ function: "GLOBAL_QUOTE", symbol });
    return normalizeQuote(symbol, data);
  } catch {
    const fallback = fallbackStocks.find((stock) => stock.symbol === symbol) || fallbackStocks[0];
    return {
      ...fallback,
      changePercent: `${fallback.change}%`,
      sentiment: fallback.sentiment ?? inferSentiment(fallback.change),
      trend: fallback.trend ?? inferTrend(fallback.change),
      latestTradingDay: "demo",
      volume: "N/A",
      source: "Demo fallback",
    };
  }
}

export async function fetchWatchlist(symbols = ["AAPL", "TSLA", "NVDA", "MSFT"]) {
  if (API_BASE_URL) {
    try {
      const response = await fetch(`${API_BASE_URL}/api/stocks?symbols=${symbols.join(",")}`);
      if (response.ok) {
        const data = await response.json();
        return data.stocks;
      }
    } catch {
      // Direct Alpha Vantage or demo fallback below keeps the app usable.
    }
  }

  const results = [];
  for (const symbol of symbols) {
    results.push(await fetchQuoteDirect(symbol));
    await sleep(120);
  }
  return results;
}

export async function fetchMarketMovers() {
  if (API_BASE_URL) {
    try {
      const response = await fetch(`${API_BASE_URL}/api/market-movers`);
      if (response.ok) {
        const data = await response.json();
        return data.movers;
      }
    } catch {
      // Direct Alpha Vantage or demo fallback below.
    }
  }

  try {
    const data = await alphaRequest({ function: "TOP_GAINERS_LOSERS" });
    return [...(data.top_gainers || []).slice(0, 4), ...(data.top_losers || []).slice(0, 2)].map((item) => ({
      ticker: item.ticker,
      price: item.price,
      change_amount: item.change_amount,
      change_percentage: item.change_percentage,
      volume: item.volume,
    }));
  } catch {
    return defaultMovers;
  }
}

export function generateInsightText(topic, mode) {
  const normalizedTopic = topic.trim() || "today's market conditions";
  const intro = `Here is a ${mode} for ${normalizedTopic}.`;

  if (mode.includes("definition")) {
    return [
      intro,
      "",
      "Definition: Identify what the term measures and why investors use it.",
      "Example: A valuation ratio can help compare companies, but it does not prove that one stock is automatically better.",
      "Risk note: Always compare the metric with growth, profitability, debt, and sector context.",
    ].join("\n");
  }

  if (mode.includes("sentiment")) {
    return [
      intro,
      "",
      "Sentiment usually combines price momentum, volume, earnings expectations, analyst revisions, and news tone.",
      "A positive setup is stronger when sentiment agrees with revenue quality, margin stability, and cash-flow strength.",
      "Risk note: Sentiment can change quickly after earnings, inflation data, rate decisions, or guidance updates.",
    ].join("\n");
  }

  return [
    intro,
    "",
    "1. Start with the business fundamentals: revenue, margins, debt, and free cash flow.",
    "2. Compare valuation against expected growth instead of looking only at share price.",
    "3. Check market context: rates, inflation, sector rotation, and earnings expectations.",
    "4. Manage risk with diversification and a clear time horizon.",
    "",
    "This is educational information, not personalized financial advice.",
  ].join("\n");
}

export async function generateInsight(topic, mode) {
  if (API_BASE_URL) {
    try {
      const response = await fetch(`${API_BASE_URL}/api/insights`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ topic, mode }),
      });
      if (response.ok) {
        const data = await response.json();
        return data.insight;
      }
    } catch {
      // Local deterministic insight below.
    }
  }

  await sleep(350);
  return generateInsightText(topic, mode);
}

async function buildFinanceAnswer(prompt) {
  const symbol = extractSymbol(prompt);
  const hasTickerIntent = prompt.match(/\b[A-Z]{1,5}\b/) || Object.keys(companyAliases).some((alias) => prompt.toLowerCase().includes(alias));

  if (!hasTickerIntent) {
    return generateInsightText(prompt, "finance explanation");
  }

  const quote = await fetchQuoteDirect(symbol);
  const direction = quote.change >= 0 ? "up" : "down";

  return [
    `I found ${quote.symbol} and used Alpha Vantage quote data when available.`,
    "",
    `Latest price: $${quote.price.toFixed(2)}`,
    `Move: ${direction} ${Math.abs(quote.change).toFixed(2)} (${quote.changePercent})`,
    `Volume: ${quote.volume}`,
    `Data source: ${quote.source}`,
    "",
    "How to read this:",
    "A quote is only the market's latest available price snapshot. It does not prove whether the stock is cheap, expensive, safe, or risky by itself.",
    "",
    generateInsightText(prompt, "investment explanation"),
  ].join("\n");
}

async function streamFromBackend({ prompt, onToken }) {
  const response = await fetch(`${API_BASE_URL}/api/chat`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ prompt }),
  });

  if (!response.ok || !response.body) {
    throw new Error("Backend finance stream unavailable");
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
      const line = event.split("\n").find((entry) => entry.startsWith("data: "));
      if (!line) continue;
      const raw = line.replace("data: ", "");
      if (raw === "[DONE]") return;
      const payload = JSON.parse(raw);
      if (payload.token) onToken(payload.token);
    }
  }
}

export async function streamFinanceResponse({ prompt, onToken }) {
  try {
    if (API_BASE_URL) {
      await streamFromBackend({ prompt, onToken });
      return;
    }
  } catch {
    // Direct Alpha Vantage fallback below.
  }

  const answer = await buildFinanceAnswer(prompt);
  for (const token of answer.split(" ")) {
    onToken(`${token} `);
    await sleep(18);
  }
}
