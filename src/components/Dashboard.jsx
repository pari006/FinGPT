import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { motion } from "framer-motion";
import {
  ArrowDownRight,
  ArrowUpRight,
  BrainCircuit,
  BriefcaseBusiness,
  FileSearch,
  Loader2,
  RefreshCw,
  ShieldAlert,
  Sparkles,
  TrendingUp,
} from "lucide-react";
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { stocks as fallbackStocks } from "../data/stocks";
import { fetchMarketMovers, fetchWatchlist, generateInsightText } from "../services/financeClient";
import { MetricCard } from "./MetricCard";
import { StockCard } from "./StockCard";

const defaultSymbols = ["AAPL", "TSLA", "NVDA", "MSFT"];

const workflowCards = [
  {
    title: "Research Assistant",
    text: "Turn ticker data into a practical thesis checklist.",
    icon: BrainCircuit,
    tone: "text-cyan bg-cyan/15",
  },
  {
    title: "Report Scanner",
    text: "Summarize earnings notes, risks, and next questions.",
    icon: FileSearch,
    tone: "text-mint bg-mint/15",
  },
  {
    title: "Portfolio Risk",
    text: "Spot concentration, volatility, and overconfidence risk.",
    icon: ShieldAlert,
    tone: "text-rose bg-rose/15",
  },
  {
    title: "Watchlist Desk",
    text: "Track movers and route tickers directly into analysis.",
    icon: BriefcaseBusiness,
    tone: "text-amber bg-amber/15",
  },
];

function formatNumber(value) {
  const number = Number(value);
  if (!Number.isFinite(number)) return value || "N/A";
  return new Intl.NumberFormat("en-US", { notation: "compact", maximumFractionDigits: 1 }).format(number);
}

function averageSentiment(stocks) {
  if (!stocks.length) return 0;
  return Math.round(stocks.reduce((sum, stock) => sum + (stock.sentiment || 50), 0) / stocks.length);
}

export function Dashboard({ showToast }) {
  const [searchParams] = useSearchParams();
  const searchedSymbol = searchParams.get("symbol")?.trim().toUpperCase();
  const [stocks, setStocks] = useState(fallbackStocks);
  const [movers, setMovers] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [source, setSource] = useState("Demo fallback");
  const symbols = useMemo(() => {
    if (!searchedSymbol) return defaultSymbols;
    return [searchedSymbol, ...defaultSymbols.filter((symbol) => symbol !== searchedSymbol)];
  }, [searchedSymbol]);

  async function loadDashboard() {
    setIsLoading(true);
    try {
      const [watchlist, marketMovers] = await Promise.all([fetchWatchlist(symbols), fetchMarketMovers()]);
      setStocks(watchlist);
      setMovers(marketMovers);
      setSource(watchlist.some((stock) => stock.source === "Alpha Vantage") ? "Alpha Vantage" : "Demo fallback");
      showToast?.("Dashboard refreshed.", "success");
    } catch {
      setStocks(fallbackStocks);
      setMovers([]);
      setSource("Demo fallback");
      showToast?.("Live data unavailable. Showing demo dashboard.", "warning");
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    loadDashboard();
  }, [symbols]);

  const featured = stocks[0] || fallbackStocks[0];
  const insight = generateInsightText(`${featured.symbol} and large-cap technology`, "market summary");
  const sentiment = averageSentiment(stocks);
  const positiveCount = stocks.filter((stock) => stock.change >= 0).length;

  return (
    <section id="dashboard" className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <MetricCard label="Data Source" value={source} change={source === "Alpha Vantage" ? "Live" : "Demo"} tone="cyan" />
        <MetricCard label="Watchlist Breadth" value={`${positiveCount}/${stocks.length} Up`} change={`${Math.round((positiveCount / stocks.length) * 100)}%`} tone="mint" delay={0.04} />
        <MetricCard label="AI Sentiment" value={`${sentiment}/100`} change={sentiment >= 55 ? "Constructive" : "Cautious"} tone="amber" delay={0.08} />
        <MetricCard label="Tracked Tickers" value={stocks.map((stock) => stock.symbol).join(", ")} change="Active" tone="cyan" delay={0.12} />
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.25fr_0.75fr]">
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="glass rounded-lg p-6">
          <div className="flex flex-col gap-5 md:flex-row md:items-start md:justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-mint">Executive dashboard</p>
              <h2 className="mt-2 font-display text-3xl font-bold">Market intelligence desk</h2>
              <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-300">
                Search any ticker from the top bar. The first card and chart update to the selected symbol while the core watchlist stays available.
              </p>
            </div>
            <button
              onClick={loadDashboard}
              disabled={isLoading}
              className="flex items-center justify-center gap-2 rounded-lg bg-white px-4 py-2.5 text-sm font-extrabold text-ink disabled:opacity-60"
            >
              {isLoading ? <Loader2 className="animate-spin" size={16} /> : <RefreshCw size={16} />}
              Refresh
            </button>
          </div>

          <div className="mt-6 grid gap-5 lg:grid-cols-[0.85fr_1.15fr]">
            <div className="rounded-lg border border-white/10 bg-white/[0.05] p-5">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm text-slate-400">Featured ticker</p>
                  <h3 className="mt-1 font-display text-5xl font-extrabold">{featured.symbol}</h3>
                  <p className="mt-2 text-slate-300">{featured.name}</p>
                </div>
                <span className={`flex items-center gap-1 rounded-lg px-3 py-1.5 text-sm font-bold ${featured.change >= 0 ? "bg-mint/15 text-mint" : "bg-rose/15 text-rose"}`}>
                  {featured.change >= 0 ? <ArrowUpRight size={16} /> : <ArrowDownRight size={16} />}
                  {featured.changePercent}
                </span>
              </div>
              <p className="mt-8 text-4xl font-black">${featured.price.toFixed(2)}</p>
              <div className="mt-6 grid grid-cols-2 gap-3 text-sm">
                <div className="rounded-lg bg-white/[0.06] p-3">
                  <p className="text-slate-400">Volume</p>
                  <p className="mt-1 font-bold text-white">{formatNumber(featured.volume)}</p>
                </div>
                <div className="rounded-lg bg-white/[0.06] p-3">
                  <p className="text-slate-400">Sentiment</p>
                  <p className="mt-1 font-bold text-white">{featured.sentiment}/100</p>
                </div>
                <div className="rounded-lg bg-white/[0.06] p-3">
                  <p className="text-slate-400">Trend</p>
                  <p className="mt-1 font-bold text-white">{featured.trend}</p>
                </div>
                <div className="rounded-lg bg-white/[0.06] p-3">
                  <p className="text-slate-400">Last day</p>
                  <p className="mt-1 font-bold text-white">{featured.latestTradingDay || "Demo"}</p>
                </div>
              </div>
            </div>

            <div className="rounded-lg border border-white/10 bg-white/[0.04] p-5">
              <div className="mb-4 flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-400">Price path</p>
                  <h3 className="font-display text-xl font-bold">{featured.symbol} trend model</h3>
                </div>
                <TrendingUp className="text-mint" size={22} />
              </div>
              <div className="h-72">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={featured.history}>
                    <defs>
                      <linearGradient id="featuredChart" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#49f2a7" stopOpacity={0.45} />
                        <stop offset="95%" stopColor="#49f2a7" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid stroke="rgba(255,255,255,0.08)" vertical={false} />
                    <XAxis dataKey="day" stroke="#94a3b8" tickLine={false} axisLine={false} />
                    <YAxis stroke="#94a3b8" tickLine={false} axisLine={false} domain={["dataMin - 2", "dataMax + 2"]} />
                    <Tooltip contentStyle={{ background: "#0b1728", border: "1px solid rgba(255,255,255,0.12)", borderRadius: 8 }} />
                    <Area type="monotone" dataKey="price" stroke="#49f2a7" strokeWidth={3} fill="url(#featuredChart)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </motion.div>

        <motion.aside initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.08 }} className="glass rounded-lg p-6">
          <div className="flex items-center gap-3">
            <div className="grid h-11 w-11 place-items-center rounded-lg bg-cyan/15 text-cyan">
              <Sparkles size={22} />
            </div>
            <div>
              <h2 className="font-display text-xl font-bold">Market pulse</h2>
              <p className="text-sm text-slate-400">Auto-generated from current selection</p>
            </div>
          </div>
          <div className="mt-5 whitespace-pre-wrap text-sm leading-7 text-slate-300">{insight}</div>
        </motion.aside>
      </div>

      <div className="grid gap-6 xl:grid-cols-[1fr_0.9fr]">
        <div className="glass rounded-lg p-6">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-cyan">Watchlist</p>
              <h2 className="mt-2 font-display text-2xl font-bold">Professional quote board</h2>
            </div>
          </div>
          <div className="mt-5 overflow-x-auto">
            <table className="w-full min-w-[680px] border-separate border-spacing-y-2 text-left text-sm">
              <thead className="text-slate-400">
                <tr>
                  <th className="px-3 py-2">Ticker</th>
                  <th className="px-3 py-2">Price</th>
                  <th className="px-3 py-2">Move</th>
                  <th className="px-3 py-2">Volume</th>
                  <th className="px-3 py-2">Sentiment</th>
                  <th className="px-3 py-2">Trend</th>
                </tr>
              </thead>
              <tbody>
                {stocks.map((stock) => (
                  <tr key={stock.symbol} className="bg-white/[0.05]">
                    <td className="rounded-l-lg px-3 py-3 font-bold text-white">{stock.symbol}</td>
                    <td className="px-3 py-3">${stock.price.toFixed(2)}</td>
                    <td className={`px-3 py-3 font-bold ${stock.change >= 0 ? "text-mint" : "text-rose"}`}>{stock.changePercent}</td>
                    <td className="px-3 py-3">{formatNumber(stock.volume)}</td>
                    <td className="px-3 py-3">
                      <div className="flex items-center gap-2">
                        <div className="h-2 w-24 rounded-full bg-white/10">
                          <div className="h-full rounded-full bg-mint" style={{ width: `${stock.sentiment}%` }} />
                        </div>
                        <span>{stock.sentiment}</span>
                      </div>
                    </td>
                    <td className="rounded-r-lg px-3 py-3">{stock.trend}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="glass rounded-lg p-6">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-amber">Market movers</p>
          <h2 className="mt-2 font-display text-2xl font-bold">Top activity monitor</h2>
          <div className="mt-5 space-y-3">
            {(movers.length ? movers : []).slice(0, 6).map((item) => {
              const positive = !String(item.change_percentage).startsWith("-");
              return (
                <div key={item.ticker} className="flex items-center justify-between gap-3 rounded-lg border border-white/10 bg-white/[0.05] p-3">
                  <div>
                    <p className="font-bold text-white">{item.ticker}</p>
                    <p className="text-xs text-slate-400">Volume {formatNumber(item.volume)}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold">${item.price}</p>
                    <p className={positive ? "text-sm font-bold text-mint" : "text-sm font-bold text-rose"}>{item.change_percentage}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {workflowCards.map((card) => {
          const Icon = card.icon;
          return (
            <div key={card.title} className="glass rounded-lg p-5">
              <div className={`grid h-11 w-11 place-items-center rounded-lg ${card.tone}`}>
                <Icon size={21} />
              </div>
              <h3 className="mt-4 font-display text-lg font-bold">{card.title}</h3>
              <p className="mt-2 text-sm leading-6 text-slate-300">{card.text}</p>
            </div>
          );
        })}
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {stocks.map((stock, index) => (
          <StockCard key={stock.symbol} stock={stock} index={index} />
        ))}
      </div>
    </section>
  );
}
