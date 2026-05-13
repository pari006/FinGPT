import { useState } from "react";
import { FileUp, Loader2, ScanText } from "lucide-react";
import { summarizeFinancialReport } from "../services/financeClient";

export function ReportSummarizer({ showToast }) {
  const [reportText, setReportText] = useState("");
  const [fileName, setFileName] = useState("");
  const [summary, setSummary] = useState("Upload a text-based report or paste earnings notes to generate a compact summary.");
  const [isLoading, setIsLoading] = useState(false);

  async function handleFile(event) {
    const file = event.target.files?.[0];
    if (!file) return;
    setFileName(file.name);

    if (file.type === "application/pdf") {
      showToast("PDF selected. Paste report text below for best browser-only summarization.", "warning");
      return;
    }

    const text = await file.text();
    setReportText(text.slice(0, 9000));
    showToast("Report text loaded.", "success");
  }

  async function summarize() {
    if (!reportText.trim()) {
      showToast("Add report text before summarizing.", "warning");
      return;
    }

    setIsLoading(true);
    try {
      const result = await summarizeFinancialReport(reportText.slice(0, 9000));
      setSummary(result);
      showToast("Report summary generated.", "success");
    } catch {
      showToast("Could not summarize report.", "error");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <section id="reports" className="glass rounded-lg p-6">
      <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-amber">Bonus feature</p>
          <h2 className="mt-2 font-display text-3xl font-bold">Financial report summarizer</h2>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-300">
            Upload a text report or paste key sections from a PDF, then ask FinGPT for an investor-friendly summary.
          </p>
        </div>
        <label className="flex items-center justify-center gap-2 rounded-lg border border-white/10 bg-white/[0.06] px-4 py-3 text-sm font-bold text-slate-100 hover:bg-white/10">
          <FileUp size={18} />
          Upload report
          <input type="file" accept=".txt,.md,.csv,.pdf" onChange={handleFile} className="sr-only" />
        </label>
      </div>

      {fileName && <p className="mt-4 text-sm text-slate-400">Selected file: {fileName}</p>}

      <div className="mt-6 grid gap-5 lg:grid-cols-2">
        <textarea
          value={reportText}
          onChange={(event) => setReportText(event.target.value)}
          placeholder="Paste earnings report text, 10-K excerpts, analyst notes, or PDF text here..."
          className="min-h-80 resize-none rounded-lg border border-white/10 bg-white/[0.06] p-4 text-sm leading-6 text-white outline-none transition placeholder:text-slate-500 focus:border-cyan/60"
        />
        <div className="rounded-lg border border-white/10 bg-white/[0.05] p-5">
          <div className="mb-4 flex items-center justify-between gap-3">
            <div className="flex items-center gap-2 text-cyan">
              <ScanText size={19} />
              <span className="font-bold">Summary</span>
            </div>
            <button
              onClick={summarize}
              disabled={isLoading}
              className="flex items-center gap-2 rounded-lg bg-white px-4 py-2 text-sm font-extrabold text-ink disabled:opacity-50"
            >
              {isLoading && <Loader2 className="animate-spin" size={16} />}
              Summarize
            </button>
          </div>
          <div className="whitespace-pre-wrap text-sm leading-7 text-slate-200">{summary}</div>
        </div>
      </div>
    </section>
  );
}
