import "./config/env.js";
import express from "express";
import cors from "cors";
import helmet from "helmet";
import aiRouter from "./routes/ai.routes.js";
import { getAiStatus } from "./services/alphaVantage.service.js";

const app = express();
const port = process.env.PORT || 5050;
const configuredOrigins = [
  process.env.CLIENT_ORIGIN,
  ...(process.env.CLIENT_ORIGINS || "").split(","),
  "http://localhost:5173",
  "http://localhost:4173",
]
  .map((origin) => origin?.trim())
  .filter(Boolean);

function isAllowedOrigin(origin = "") {
  if (!origin) return true;
  if (configuredOrigins.includes(origin)) return true;

  try {
    const { hostname, protocol } = new URL(origin);
    return protocol === "https:" && hostname.endsWith(".vercel.app");
  } catch {
    return false;
  }
}

app.use(helmet());
app.use(
  cors({
    origin(origin, callback) {
      if (isAllowedOrigin(origin)) {
        callback(null, true);
        return;
      }

      callback(new Error(`CORS blocked for origin: ${origin || "unknown"}`));
    },
    methods: ["GET", "POST"],
  })
);
app.use(express.json({ limit: "1mb" }));

app.get("/api/health", (_req, res) => {
  res.json({ status: "ok", service: "FinGPT API", ai: getAiStatus() });
});

app.use("/api", aiRouter);

app.use((err, _req, res, _next) => {
  console.error(err);
  res.status(err.status || 500).json({
    error: err.message || "Unexpected server error",
  });
});

app.listen(port, () => {
  console.log(`FinGPT API running on http://localhost:${port}`);
});
