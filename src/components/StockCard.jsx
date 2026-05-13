import { Area, AreaChart, ResponsiveContainer } from "recharts";
import { ArrowDownRight, ArrowUpRight, Activity } from "lucide-react";
import { motion } from "framer-motion";

export function StockCard({ stock, index }) {
  const positive = stock.change >= 0;
  return (
    <motion.article
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.08 * index }}
      whileHover={{ y: -4 }}
      className="glass rounded-lg p-5"
    >
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm text-slate-400">{stock.name}</p>
          <h3 className="mt-1 font-display text-2xl font-bold">{stock.symbol}</h3>
        </div>
        <div className="grid h-11 w-11 place-items-center rounded-lg" style={{ background: `${stock.color}22`, color: stock.color }}>
          <Activity size={20} />
        </div>
      </div>

      <div className="mt-5 flex items-end justify-between">
        <div>
          <p className="text-2xl font-extrabold">${stock.price.toFixed(2)}</p>
          <p className="mt-1 text-sm text-slate-400">{stock.trend || stock.source} trend</p>
        </div>
        <span className={`flex items-center gap-1 rounded-lg px-2 py-1 text-sm font-bold ${positive ? "bg-mint/15 text-mint" : "bg-rose/15 text-rose"}`}>
          {positive ? <ArrowUpRight size={15} /> : <ArrowDownRight size={15} />}
          {Math.abs(stock.change).toFixed(2)}%
        </span>
      </div>

      <div className="mt-4 h-24">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={stock.history}>
            <defs>
              <linearGradient id={`gradient-${stock.symbol}`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={stock.color} stopOpacity={0.5} />
                <stop offset="95%" stopColor={stock.color} stopOpacity={0} />
              </linearGradient>
            </defs>
            <Area type="monotone" dataKey="price" stroke={stock.color} strokeWidth={3} fill={`url(#gradient-${stock.symbol})`} />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      <div className="mt-5">
        <div className="mb-2 flex justify-between text-xs text-slate-400">
          <span>AI sentiment</span>
          <span>{stock.sentiment}%</span>
        </div>
        <div className="h-2 rounded-full bg-white/10">
          <div className="h-full rounded-full" style={{ width: `${stock.sentiment}%`, background: stock.color }} />
        </div>
      </div>
    </motion.article>
  );
}
