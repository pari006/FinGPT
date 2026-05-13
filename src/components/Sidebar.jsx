import { BarChart3, Bot, FileText, LineChart, Menu, Sparkles, WalletCards, X } from "lucide-react";
import { motion } from "framer-motion";
import { NavLink } from "react-router-dom";

const navItems = [
  { path: "/dashboard", label: "Dashboard", icon: BarChart3 },
  { path: "/chat", label: "AI Chat", icon: Bot },
  { path: "/insights", label: "Insights", icon: Sparkles },
  { path: "/reports", label: "Reports", icon: FileText },
];

export function Sidebar({ isOpen, setIsOpen }) {
  return (
    <>
      <button
        className="fixed left-4 top-4 z-50 grid h-11 w-11 place-items-center rounded-lg border border-white/10 bg-white/10 text-white backdrop-blur lg:hidden"
        onClick={() => setIsOpen(true)}
        aria-label="Open navigation"
      >
        <Menu size={20} />
      </button>

      <motion.aside
        initial={false}
        animate={{ x: isOpen ? 0 : -320 }}
        className="glass fixed inset-y-0 left-0 z-50 flex w-72 flex-col p-5 lg:sticky lg:top-0 lg:h-screen lg:translate-x-0"
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="grid h-11 w-11 place-items-center rounded-lg bg-gradient-to-br from-cyan to-mint text-ink shadow-glow">
              <WalletCards size={22} />
            </div>
            <div>
              <p className="font-display text-xl font-extrabold">FinGPT</p>
              <p className="text-xs text-slate-400">AI finance cockpit</p>
            </div>
          </div>
          <button
            className="grid h-9 w-9 place-items-center rounded-lg border border-white/10 text-slate-300 lg:hidden"
            onClick={() => setIsOpen(false)}
            aria-label="Close navigation"
          >
            <X size={18} />
          </button>
        </div>

        <nav className="mt-9 space-y-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                onClick={() => setIsOpen(false)}
                className={({ isActive }) =>
                  `flex w-full items-center gap-3 rounded-lg px-4 py-3 text-left transition ${
                    isActive ? "bg-white text-ink shadow-lg" : "text-slate-300 hover:bg-white/10 hover:text-white"
                  }`
                }
              >
                <Icon size={19} />
                <span className="font-semibold">{item.label}</span>
              </NavLink>
            );
          })}
        </nav>

        <div className="mt-auto rounded-lg border border-white/10 bg-white/[0.06] p-4">
          <div className="mb-3 flex items-center gap-2 text-mint">
            <LineChart size={17} />
            <span className="text-sm font-bold">Live demo mode</span>
          </div>
          <p className="text-sm leading-6 text-slate-300">
            Configure Alpha Vantage in `.env` for live quote data. Demo fallbacks keep the app usable for interviews.
          </p>
        </div>
      </motion.aside>

      {isOpen && (
        <button
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          onClick={() => setIsOpen(false)}
          aria-label="Close navigation overlay"
        />
      )}
    </>
  );
}
