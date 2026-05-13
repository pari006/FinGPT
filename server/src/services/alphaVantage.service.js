const API_KEY =
  process.env.ALPHA_VANTAGE_API_KEY ||
  process.env.VITE_ALPHA_VANTAGE_API_KEY ||
  // Legacy fallback so an existing .env that still has this name keeps working.
  process.env.VITE_GEMINI_API_KEY;

const ALPHA_VANTAGE_URL = "https://www.alphavantage.co/query";

const fallbackStocks = {
  AAPL: { symbol: "AAPL", name: "Apple", price: 214.28, change: 1.42, changePercent: "1.42%", volume: "58230000" },
  TSLA: { symbol: "TSLA", name: "Tesla", price: 183.77, change: -0.86, changePercent: "-0.86%", volume: "88710000" },
  NVDA: { symbol: "NVDA", name: "NVIDIA", price: 129.93, change: 2.64, changePercent: "2.64%", volume: "215300000" },
  MSFT: { symbol: "MSFT", name: "Microsoft", price: 447.61, change: 0.93, changePercent: "0.93%", volume: "22180000" },
};

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

function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function parseNumber(value, fallback = 0) {
  const parsed = Number.parseFloat(String(value || "").replace("%", ""));
  return Number.isFinite(parsed) ? parsed : fallback;
}

function extractSymbol(prompt = "") {
  const lowerPrompt = prompt.toLowerCase();
  const directMatch = prompt.match(/\b[A-Z]{1,5}\b/);
  if (directMatch) return directMatch[0];

  return Object.entries(companyAliases).find(([alias]) => lowerPrompt.includes(alias))?.[1] || "AAPL";
}

function inferSentiment(changePercent) {
  const change = parseNumber(changePercent, 0);
  return Math.round(Math.max(18, Math.min(92, 55 + change * 9)));
}

function inferTrend(changePercent) {
  const change = parseNumber(changePercent, 0);
  if (change >= 2) return "Momentum";
  if (change > 0.2) return "Bullish";
  if (change <= -2) return "Risk-off";
  if (change < -0.2) return "Soft";
  return "Neutral";
}

async function alphaRequest(params) {
  if (!API_KEY) {
    throw new Error("Alpha Vantage API key is not configured.");
  }

  const url = new URL(ALPHA_VANTAGE_URL);
  Object.entries({ ...params, apikey: API_KEY }).forEach(([key, value]) => {
    url.searchParams.set(key, value);
  });

  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Alpha Vantage request failed with status ${response.status}`);
  }

  const data = await response.json();
  if (data.Note || data.Information) {
    throw new Error(data.Note || data.Information);
  }
  if (data["Error Message"]) {
    throw new Error(data["Error Message"]);
  }

  return data;
}

function normalizeQuote(symbol, data) {
  const quote = data?.["Global Quote"] || {};
  const fallback = fallbackStocks[symbol] || fallbackStocks.AAPL;
  const changePercent = quote["10. change percent"] || fallback.changePercent;

  return {
    ...fallback,
    symbol,
    price: parseNumber(quote["05. price"], fallback.price),
    change: parseNumber(quote["09. change"], fallback.change),
    changePercent,
    sentiment: inferSentiment(changePercent),
    trend: inferTrend(changePercent),
    volume: quote["06. volume"] || fallback.volume,
    latestTradingDay: quote["07. latest trading day"] || "demo",
    source: quote["05. price"] ? "Alpha Vantage" : "Demo fallback",
  };
}

function createHistory(symbol, latestPrice) {
  const fallback = fallbackStocks[symbol] || fallbackStocks.AAPL;
  const base = latestPrice || fallback.price;
  return ["Mon", "Tue", "Wed", "Thu", "Fri"].map((day, index) => ({
    day,
    price: Number((base * (0.96 + index * 0.01 + (index % 2) * 0.006)).toFixed(2)),
  }));
}

export async function fetchQuote(symbol) {
  try {
    const data = await alphaRequest({ function: "GLOBAL_QUOTE", symbol });
    const quote = normalizeQuote(symbol, data);
    return { ...quote, history: createHistory(symbol, quote.price) };
  } catch {
    const fallback = fallbackStocks[symbol] || fallbackStocks.AAPL;
    return { ...fallback, history: createHistory(symbol, fallback.price), source: "Demo fallback" };
  }
}

export async function fetchOverview(symbol) {
  try {
    const overview = await alphaRequest({ function: "OVERVIEW", symbol });
    return {
      name: overview.Name,
      sector: overview.Sector,
      industry: overview.Industry,
      marketCap: overview.MarketCapitalization,
      peRatio: overview.PERatio,
      dividendYield: overview.DividendYield,
      beta: overview.Beta,
      description: overview.Description,
      source: "Alpha Vantage",
    };
  } catch {
    return {
      name: fallbackStocks[symbol]?.name || symbol,
      sector: "Technology",
      industry: "Large-cap equity",
      peRatio: "N/A",
      beta: "N/A",
      description: "Company overview is unavailable on the free API response right now.",
      source: "Demo fallback",
    };
  }
}

export async function fetchWatchlist(symbols = ["AAPL", "TSLA", "NVDA", "MSFT"]) {
  const results = [];
  for (const symbol of symbols) {
    results.push(await fetchQuote(symbol));
    await delay(120);
  }
  return results;
}

export async function fetchMarketMovers() {
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

export function generateInsightText(topic = "today's market conditions", mode = "market summary") {
  const normalizedTopic = topic.trim() || "today's market conditions";
  const intro = `Here is a ${mode} for ${normalizedTopic}.`;

  if (mode.includes("definition")) {
    return [
      intro,
      "",
      "Definition: Break the term into what it measures, why investors watch it, and what it does not prove by itself.",
      "How to use it: Compare it against similar companies, historical ranges, and the current rate environment.",
      "Risk note: One metric rarely explains a full investment case.",
    ].join("\n");
  }

  if (mode.includes("sentiment")) {
    return [
      intro,
      "",
      "Sentiment can be read from price momentum, volume, earnings expectations, analyst revisions, and news tone.",
      "Positive sentiment is useful only when it is supported by fundamentals such as revenue quality, margin durability, and cash flow.",
      "Risk note: Sentiment can reverse quickly after earnings, guidance changes, or macro data.",
    ].join("\n");
  }

  return [
    intro,
    "",
    "1. Start with the business driver: revenue growth, margins, cash flow, and balance-sheet strength.",
    "2. Compare valuation against growth quality rather than looking at price alone.",
    "3. Check market context such as interest rates, sector rotation, and earnings expectations.",
    "4. Use position sizing and diversification because even strong companies can trade down.",
    "",
    "This is educational information, not personalized financial advice.",
  ].join("\n");
}

export async function createFinanceAnswer(prompt = "") {
  const symbol = extractSymbol(prompt);
  const hasTickerIntent = prompt.match(/\b[A-Z]{1,5}\b/) || Object.keys(companyAliases).some((alias) => prompt.toLowerCase().includes(alias));

  if (!hasTickerIntent) {
    return generateInsightText(prompt, "finance explanation");
  }

  const [quote, overview] = await Promise.all([fetchQuote(symbol), fetchOverview(symbol)]);
  const direction = quote.change >= 0 ? "up" : "down";

  return [
    `I found ${quote.symbol} (${overview.name || quote.name}) and pulled the latest available Alpha Vantage quote when possible.`,
    "",
    `Price: $${quote.price.toFixed(2)}`,
    `Move: ${direction} ${Math.abs(quote.change).toFixed(2)} (${quote.changePercent})`,
    `Volume: ${Number(quote.volume || 0).toLocaleString()}`,
    `Sector: ${overview.sector || "N/A"}`,
    `P/E ratio: ${overview.peRatio || "N/A"}`,
    "",
    "How to interpret it:",
    "A short-term quote tells you what the market paid recently, not whether the company is automatically cheap or expensive. For a fuller view, compare earnings growth, valuation, debt, cash flow, and recent guidance.",
    "",
    generateInsightText(prompt, "investment explanation"),
  ].join("\n");
}

export async function* createFinanceStream({ prompt = "" }) {
  const answer = await createFinanceAnswer(prompt);
  for (const word of answer.split(" ")) {
    yield `${word} `;
    await delay(18);
  }
}
