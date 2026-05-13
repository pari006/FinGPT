import dotenv from "dotenv";
import express from "express";
import cors from "cors";
import helmet from "helmet";
import aiRouter from "./routes/ai.routes.js";

dotenv.config({ path: "../.env" });
dotenv.config();

const app = express();
const port = process.env.PORT || 5050;
const allowedOrigin = process.env.CLIENT_ORIGIN || "http://localhost:5173";

app.use(helmet());
app.use(
  cors({
    origin: [allowedOrigin, "http://localhost:4173"],
    methods: ["GET", "POST"],
  })
);
app.use(express.json({ limit: "1mb" }));

app.get("/api/health", (_req, res) => {
  res.json({ status: "ok", service: "FinGPT API" });
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
