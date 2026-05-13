import { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { Bell, Bot, FileText, LayoutDashboard, Search, ShieldCheck, Sparkles } from "lucide-react";
import { motion } from "framer-motion";

const navItems = [
  { path: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { path: "/chat", label: "Chat", icon: Bot },
  { path: "/insights", label: "Insights", icon: Sparkles },
  { path: "/reports", label: "Reports", icon: FileText },
];

export function Header({ showToast }) {
  const [query, setQuery] = useState("");
  const [showNotifications, setShowNotifications] = useState(false);
  const navigate = useNavigate();

  function submitSearch(event) {
    event.preventDefault();
    const symbol = query.trim().toUpperCase();
    if (!symbol) {
      showToast?.("Enter a ticker like AAPL or NVDA.", "warning");
      return;
    }

    navigate(`/dashboard?symbol=${encodeURIComponent(symbol)}`);
    showToast?.(`Loaded ${symbol} on the dashboard.`, "success");
    setQuery("");
  }

  return (
    <header className="space-y-5">
      <div className="flex flex-col gap-5 xl:flex-row xl:items-end xl:justify-between">
        <div>
          <motion.p
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-2 text-sm font-semibold uppercase tracking-[0.22em] text-cyan"
          >
            Premium finance intelligence
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05 }}
            className="font-display text-4xl font-extrabold leading-tight text-white md:text-6xl"
          >
            FinGPT
          </motion.h1>
          <p className="mt-3 max-w-2xl text-base leading-7 text-slate-300">
            Real quote lookup, market dashboards, research workflows, and finance guidance in one clean cockpit.
          </p>
        </div>

        <div className="relative">
          <div className="glass flex flex-col gap-3 rounded-lg p-2 md:flex-row md:items-center">
            <form onSubmit={submitSearch} className="flex min-w-0 items-center gap-2 rounded-lg bg-white/[0.06] px-3 py-2 text-slate-200 md:min-w-80">
              <Search size={17} className="shrink-0 text-slate-400" />
              <input
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                className="min-w-0 flex-1 bg-transparent text-sm text-white outline-none placeholder:text-slate-500"
                placeholder="Search ticker, e.g. AAPL"
                aria-label="Search ticker"
              />
              <button type="submit" className="rounded-md bg-white px-2.5 py-1 text-xs font-extrabold text-ink">
                Go
              </button>
            </form>
            <button
              onClick={() => {
                setShowNotifications((value) => !value);
                showToast?.("Notifications panel toggled.", "info");
              }}
              className="relative grid h-10 w-10 place-items-center rounded-lg border border-white/10 text-slate-200 hover:bg-white/10"
              aria-label="Notifications"
            >
              <Bell size={18} />
              <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-rose" />
            </button>
            <div className="flex items-center gap-2 rounded-lg bg-mint/15 px-3 py-2 text-mint">
              <ShieldCheck size={17} />
              <span className="text-sm font-bold">Risk aware</span>
            </div>
          </div>

          {showNotifications && (
            <div className="glass absolute right-0 top-[calc(100%+0.75rem)] z-30 w-80 rounded-lg p-4">
              <p className="font-display text-lg font-bold">Market alerts</p>
              <div className="mt-3 space-y-3 text-sm text-slate-300">
                <p>Alpha Vantage free quote data may be end-of-day or delayed depending on entitlement.</p>
                <p>Sentiment scores are derived from price movement and should be treated as directional signals.</p>
              </div>
            </div>
          )}
        </div>
      </div>

      <nav className="glass flex gap-2 overflow-x-auto rounded-lg p-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `flex min-w-fit items-center gap-2 rounded-lg px-4 py-2.5 text-sm font-bold transition ${
                  isActive ? "bg-white text-ink" : "text-slate-300 hover:bg-white/10 hover:text-white"
                }`
              }
            >
              <Icon size={17} />
              {item.label}
            </NavLink>
          );
        })}
      </nav>
    </header>
  );
}
