import { ArrowDownRight, ArrowUpRight } from "lucide-react";
import { motion } from "framer-motion";

const toneColors = {
  mint: "#49f2a7",
  cyan: "#4de0ff",
  amber: "#f8c14a",
};

export function MetricCard({ label, value, change, tone = "mint", delay = 0 }) {
  const positive = !String(change).startsWith("-");
  const color = toneColors[tone] || toneColors.mint;
  return (
    <motion.div
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
      className="glass rounded-lg p-5"
    >
      <p className="text-sm text-slate-400">{label}</p>
      <div className="mt-3 flex items-end justify-between gap-3">
        <p className="font-display text-2xl font-bold text-white">{value}</p>
        <span
          className={`flex items-center gap-1 rounded-lg px-2 py-1 text-sm font-bold ${
            positive ? "bg-mint/15 text-mint" : "bg-rose/15 text-rose"
          }`}
        >
          {positive ? <ArrowUpRight size={15} /> : <ArrowDownRight size={15} />}
          {change}
        </span>
      </div>
      <div className="mt-4 h-1.5 rounded-full" style={{ backgroundColor: `${color}22` }}>
        <div className="h-full w-3/4 rounded-full" style={{ backgroundColor: color }} />
      </div>
    </motion.div>
  );
}
