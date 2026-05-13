import { AnimatePresence, motion } from "framer-motion";
import { AlertCircle, CheckCircle2, Info } from "lucide-react";

const icons = {
  success: CheckCircle2,
  error: AlertCircle,
  warning: AlertCircle,
  info: Info,
};

const colors = {
  success: "border-mint/30 text-mint",
  error: "border-rose/30 text-rose",
  warning: "border-amber/30 text-amber",
  info: "border-cyan/30 text-cyan",
};

export function ToastStack({ toasts }) {
  return (
    <div className="fixed right-4 top-4 z-[70] space-y-3">
      <AnimatePresence>
        {toasts.map((toast) => {
          const Icon = icons[toast.type] || Info;
          return (
            <motion.div
              key={toast.id}
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 30 }}
              className={`glass flex min-w-72 items-center gap-3 rounded-lg border px-4 py-3 ${colors[toast.type] || colors.info}`}
            >
              <Icon size={18} />
              <span className="text-sm font-semibold text-slate-100">{toast.message}</span>
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
}
