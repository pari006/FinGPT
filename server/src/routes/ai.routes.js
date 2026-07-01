import { Router } from "express";
import {
  createFinanceStream,
  createInsightResponse,
  createReportSummary,
  fetchMarketMovers,
  fetchWatchlist,
  getAiStatus,
} from "../services/alphaVantage.service.js";

const router = Router();

router.post("/chat", async (req, res, next) => {
  try {
    const { messages = [], prompt = "" } = req.body;
    const stream = await createFinanceStream({ messages, prompt });

    res.setHeader("Content-Type", "text/event-stream");
    res.setHeader("Cache-Control", "no-cache");
    res.setHeader("Connection", "keep-alive");

    for await (const chunk of stream) {
      res.write(`data: ${JSON.stringify({ token: chunk })}\n\n`);
    }

    res.write("data: [DONE]\n\n");
    res.end();
  } catch (error) {
    next(error);
  }
});

router.get("/ai-status", (_req, res) => {
  res.json(getAiStatus());
});

router.post("/insights", async (req, res, next) => {
  try {
    const { topic = "today's market conditions", mode = "summary" } = req.body;
    const text = await createInsightResponse(topic, mode);
    res.json({ insight: text });
  } catch (error) {
    next(error);
  }
});

router.post("/summarize", async (req, res, next) => {
  try {
    const { reportText = "" } = req.body;
    const summary = await createReportSummary(reportText);
    res.json({ summary });
  } catch (error) {
    next(error);
  }
});

router.get("/stocks", async (req, res, next) => {
  try {
    const symbols = String(req.query.symbols || "AAPL,TSLA,NVDA,MSFT")
      .split(",")
      .map((symbol) => symbol.trim().toUpperCase())
      .filter(Boolean);

    const stocks = await fetchWatchlist(symbols);
    res.json({ stocks });
  } catch (error) {
    next(error);
  }
});

router.get("/market-movers", async (_req, res, next) => {
  try {
    const movers = await fetchMarketMovers();
    res.json({ movers });
  } catch (error) {
    next(error);
  }
});

export default router;
