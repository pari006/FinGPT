import { useState } from "react";
import { motion } from "framer-motion";
import { BookOpen, Lightbulb, Loader2, Sparkles } from "lucide-react";
import { generateInsight } from "../services/financeClient";

const modes = [
  { id: "market summary", label: "Market summary" },
  { id: "term definition", label: "Term definition" },
  { id: "investment explanation", label: "Investment explanation" },
  { id: "sentiment analysis", label: "Sentiment analysis" },
];

export function Insights({ showToast }) {
  const [topic, setTopic] = useState("AI stocks and interest rates");
  const [mode, setMode] = useState(modes[0].id);
  const [insight, setInsight] = useState(
    "Choose a topic and generate an AI insight. The response will be beginner-friendly and include appropriate risk caveats."
  );
  const [isLoading, setIsLoading] = useState(false);

  async function handleGenerate() {
    if (!topic.trim()) return;
    setIsLoading(true);
    try {
      const result = await generateInsight(topic, mode);
      setInsight(result);
      showToast("Insight generated.", "success");
    } catch {
      showToast("Could not generate insight.", "error");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <section id="insights" className="grid gap-6 xl:grid-cols-[0.9fr_1.1fr]">
      <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} className="glass rounded-lg p-6">
        <div className="flex items-center gap-3">
          <div className="grid h-11 w-11 place-items-center rounded-lg bg-mint/15 text-mint">
            <Sparkles size={22} />
          </div>
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-mint">AI market insights</p>
            <h2 className="font-display text-2xl font-bold">Generate finance guidance</h2>
          </div>
        </div>

        <div className="mt-6 space-y-4">
          <label className="block">
            <span className="text-sm font-semibold text-slate-300">Topic</span>
            <input
              value={topic}
              onChange={(event) => setTopic(event.target.value)}
              className="mt-2 w-full rounded-lg border border-white/10 bg-white/[0.06] px-4 py-3 text-white outline-none transition focus:border-cyan/60"
              placeholder="Example: what is dollar-cost averaging?"
            />
          </label>

          <div>
            <span className="text-sm font-semibold text-slate-300">Insight type</span>
            <div className="mt-2 grid gap-2 sm:grid-cols-2">
              {modes.map((item) => (
                <button
                  key={item.id}
                  onClick={() => setMode(item.id)}
                  className={`rounded-lg border px-4 py-3 text-left text-sm font-semibold transition ${
                    mode === item.id
                      ? "border-cyan/60 bg-cyan/15 text-cyan"
                      : "border-white/10 bg-white/[0.04] text-slate-300 hover:bg-white/10"
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>

          <button
            onClick={handleGenerate}
            disabled={isLoading}
            className="flex w-full items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-cyan to-mint px-5 py-3 font-extrabold text-ink disabled:opacity-50"
          >
            {isLoading ? <Loader2 className="animate-spin" size={18} /> : <Lightbulb size={18} />}
            Generate insight
          </button>
        </div>
      </motion.div>

      <motion.article initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.08 }} className="glass rounded-lg p-6">
        <div className="flex items-center gap-3 border-b border-white/10 pb-5">
          <div className="grid h-11 w-11 place-items-center rounded-lg bg-cyan/15 text-cyan">
            <BookOpen size={22} />
          </div>
          <div>
            <h2 className="font-display text-2xl font-bold">AI output</h2>
            <p className="text-sm text-slate-400">Educational, plain-English market explanation</p>
          </div>
        </div>
        <div className="mt-6 whitespace-pre-wrap text-sm leading-7 text-slate-200">{insight}</div>
      </motion.article>
    </section>
  );
}
