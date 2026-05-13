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

const financeTerms = [
  "p/e",
  "pe ratio",
  "price to earnings",
  "eps",
  "roe",
  "ebitda",
  "dividend",
  "market cap",
  "beta",
  "cash flow",
  "inflation",
  "interest rate",
  "valuation",
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
  const directMatch = prompt.match(/\b[A-Z]{2,5}\b/g)?.find((token) => companyAliases[token.toLowerCase()] || fallbackStocks[token]);
  if (directMatch) return directMatch;

  return Object.entries(companyAliases).find(([alias]) => lowerPrompt.includes(alias))?.[1] || "AAPL";
}

function normalizeText(text = "") {
  return text.toLowerCase().replace(/\s+/g, " ").trim();
}

function isTickerPrompt(prompt = "") {
  const normalized = normalizeText(prompt);
  if (financeTerms.some((term) => normalized.includes(term))) return false;

  const directMatch = prompt.match(/\b[A-Z]{2,5}\b/g)?.find((token) => companyAliases[token.toLowerCase()] || fallbackStocks[token]);
  if (directMatch) return true;

  return Object.keys(companyAliases).some((alias) => normalized.includes(alias));
}

function splitSentences(text = "") {
  return text
    .replace(/\r/g, " ")
    .split(/(?<=[.!?])\s+|\n+/)
    .map((sentence) => sentence.trim())
    .filter(Boolean);
}

function pickSentence(sentences, keywords) {
  return sentences.find((sentence) => keywords.some((keyword) => sentence.toLowerCase().includes(keyword)));
}

function buildDefinitionAnswer(prompt) {
  const lower = normalizeText(prompt);

  if (lower.includes("p/e") || lower.includes("pe ratio") || lower.includes("price to earnings")) {
    return [
      "P/E ratio means price-to-earnings ratio.",
      "",
      "What it measures: how much investors are paying for one dollar of a company's earnings.",
      "Simple reading: a P/E of 20 means the market is valuing the company at about 20 times its annual earnings per share.",
      "",
      "How to use it:",
      "- Compare it with similar companies in the same sector.",
      "- Check whether earnings are stable or temporarily inflated.",
      "- Pair it with growth, margins, debt, and cash flow before forming a view.",
      "",
      "Why it matters: a high P/E can signal strong growth expectations, but it can also mean the stock is expensive if those expectations do not hold up.",
      "",
      "Risk note: P/E is not reliable on its own for loss-making companies or businesses with very cyclical earnings.",
    ].join("\n");
  }

  return [
    `Here is a plain-English explanation for ${prompt.trim()}.`,
    "",
    "Start by asking three things:",
    "1. What does the metric measure?",
    "2. Why do investors care about it?",
    "3. What can it miss if you look at it alone?",
    "",
    "A good finance explanation should connect the term to profitability, growth, risk, or valuation rather than treating it as a standalone signal.",
  ].join("\n");
}

function buildComparisonAnswer(prompt) {
  const lower = normalizeText(prompt);
  const mentionsApple = lower.includes("apple");
  const mentionsMicrosoft = lower.includes("microsoft");

  if (mentionsApple && mentionsMicrosoft) {
    return [
      "Apple and Microsoft are both large, profitable companies, but their business mix is different.",
      "",
      "Apple: more consumer-device driven, with iPhone demand and ecosystem loyalty doing most of the work.",
      "Microsoft: more diversified across enterprise software, cloud infrastructure, productivity tools, and AI platform demand.",
      "",
      "What investors usually compare:",
      "- Revenue durability: Microsoft often looks steadier because enterprise contracts are sticky.",
      "- Margins: both are strong, but software and cloud can scale differently from hardware.",
      "- Product concentration: Apple is more exposed to consumer upgrade cycles.",
      "- Growth profile: Microsoft is often discussed more through cloud and platform expansion.",
      "",
      "Beginner takeaway: Apple can look like a powerful consumer ecosystem business, while Microsoft often looks like a broader business infrastructure company.",
    ].join("\n");
  }

  return [
    `To compare ${prompt.trim()}, focus on business model, growth quality, margins, balance-sheet strength, and how dependent each company is on one product or segment.`,
    "",
    "A useful comparison is not just which stock moved more recently, but which company has the more durable earnings engine.",
  ].join("\n");
}

function buildChartAnswer() {
  return [
    "A safe way to read a stock chart is to treat it as context, not as proof.",
    "",
    "Start with these checks:",
    "1. Trend: is the stock making higher highs and higher lows, or the opposite?",
    "2. Volume: did the move happen with strong participation or weak trading?",
    "3. Timeframe: a daily chart and a six-month chart can tell very different stories.",
    "4. News context: earnings, guidance, rates, and macro data can overpower chart patterns.",
    "",
    "Beginner mistake to avoid: buying only because the chart looks strong without checking valuation, cash flow, and risk.",
  ].join("\n");
}

function buildGeneralFinanceAnswer(prompt) {
  const normalized = normalizeText(prompt);

  if (normalized.includes("compare")) return buildComparisonAnswer(prompt);
  if (normalized.includes("chart")) return buildChartAnswer();
  if (normalized.includes("what is") || normalized.includes("explain") || normalized.includes("mean")) {
    return buildDefinitionAnswer(prompt);
  }

  return [
    `Here is a practical take on ${prompt.trim() || "the topic"}.`,
    "",
    "Look at four layers:",
    "1. Fundamentals: revenue, margins, debt, and cash flow.",
    "2. Valuation: what price investors are paying for that quality and growth.",
    "3. Catalysts: earnings, guidance, rates, and sector news.",
    "4. Risk: what could break the thesis and how quickly sentiment could change.",
    "",
    "This is educational information, not personalized financial advice.",
  ].join("\n");
}

export function summarizeReportText(reportText = "") {
  const cleaned = reportText.replace(/\s+/g, " ").trim();
  const sentences = splitSentences(reportText);
  const companyLine = cleaned.match(/company\s*:\s*([^.:\n]+)/i)?.[1]?.trim();
  const revenueSentence = pickSentence(sentences, ["revenue", "sales", "earnings", "margin", "profit"]);
  const riskSentence = pickSentence(sentences, ["risk", "pressure", "inflation", "supply", "debt", "decline", "cautious"]);
  const actionSentence = pickSentence(sentences, ["implement", "expand", "improve", "optimiz", "invest", "reduce"]);
  const outlookSentence = pickSentence(sentences, ["outlook", "guidance", "remain", "expected", "long-term", "stability"]);

  const highlights = [revenueSentence, riskSentence, actionSentence].filter(Boolean);
  const keyTakeaway =
    highlights[0] ||
    sentences[0] ||
    "The report does not provide enough detail for a stronger summary, so the safest reading is to focus on revenue quality, margin pressure, and balance-sheet risk.";

  const risks = [riskSentence, outlookSentence]
    .filter(Boolean)
    .filter((sentence, index, items) => items.indexOf(sentence) === index);

  const questions = [];
  if (revenueSentence) questions.push("Are revenue growth and margins improving together, or is growth being supported by lower profitability?");
  if (riskSentence) questions.push("Are the reported risks temporary, or do they point to a longer-term pressure on earnings quality?");
  if (actionSentence) questions.push("Is management's response likely to improve cash flow, or is it mainly a short-term operational fix?");
  if (questions.length === 0) {
    questions.push("What would need to improve in revenue, margins, or cash flow to strengthen the investment case?");
  }

  return [
    `Company: ${companyLine || "Not clearly stated"}`,
    "",
    "Summary:",
    keyTakeaway,
    "",
    "What stands out:",
    ...highlights.slice(0, 3).map((sentence, index) => `${index + 1}. ${sentence}`),
    "",
    "Main risks:",
    ...(risks.length ? risks.map((sentence, index) => `${index + 1}. ${sentence}`) : ["1. The report text is limited, so hidden balance-sheet or demand risks may not be visible yet."]),
    "",
    "Questions to research next:",
    ...questions.slice(0, 3).map((question, index) => `${index + 1}. ${question}`),
  ].join("\n");
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
  const hasTickerIntent = isTickerPrompt(prompt);

  if (!hasTickerIntent) {
    return buildGeneralFinanceAnswer(prompt);
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
