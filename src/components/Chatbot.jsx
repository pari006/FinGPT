import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Bot, Mic, MicOff, Send, UserRound } from "lucide-react";
import { streamFinanceResponse } from "../services/financeClient";

const starters = [
  "Explain what a P/E ratio means for beginners.",
  "Compare Apple and Microsoft as businesses.",
  "What is the latest available quote for NVDA?",
  "How should I read a stock chart safely?",
];

export function Chatbot({ showToast }) {
  const [messages, setMessages] = useState([
    {
      id: "welcome",
      role: "assistant",
      content:
        "Hi, I am FinGPT. Ask me about stocks, financial terms, reports, portfolio basics, or market trends. I will keep explanations practical and risk-aware.",
    },
  ]);
  const [input, setInput] = useState("");
  const [isStreaming, setIsStreaming] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const bottomRef = useRef(null);
  const recognitionRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  function startVoiceInput() {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      showToast("Voice input is not supported in this browser.", "warning");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = "en-US";
    recognition.interimResults = false;
    recognition.onstart = () => setIsListening(true);
    recognition.onend = () => setIsListening(false);
    recognition.onerror = () => showToast("Voice capture stopped. Try again.", "warning");
    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      setInput((value) => `${value} ${transcript}`.trim());
      showToast("Voice input added to chat.", "success");
    };
    recognitionRef.current = recognition;
    recognition.start();
  }

  function stopVoiceInput() {
    recognitionRef.current?.stop();
    setIsListening(false);
  }

  async function sendMessage(customPrompt) {
    const prompt = (customPrompt || input).trim();
    if (!prompt || isStreaming) return;

    const userMessage = { id: crypto.randomUUID(), role: "user", content: prompt };
    const assistantId = crypto.randomUUID();
    const history = [...messages, userMessage];

    setMessages([...history, { id: assistantId, role: "assistant", content: "" }]);
    setInput("");
    setIsStreaming(true);

    try {
      await streamFinanceResponse({
        messages,
        prompt,
        onToken: (token) => {
          setMessages((items) =>
            items.map((item) =>
              item.id === assistantId ? { ...item, content: `${item.content}${token}` } : item
            )
          );
        },
      });
    } catch {
      setMessages((items) =>
        items.map((item) =>
          item.id === assistantId
            ? { ...item, content: "I could not reach the AI service. Check your environment variable and try again." }
            : item
        )
      );
      showToast("AI service unavailable.", "error");
    } finally {
      setIsStreaming(false);
    }
  }

  return (
    <section id="chat" className="glass grid min-h-[660px] overflow-hidden rounded-lg lg:grid-cols-[0.7fr_1.3fr]">
      <aside className="border-b border-white/10 p-6 lg:border-b-0 lg:border-r">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-cyan">Conversational AI</p>
        <h2 className="mt-2 font-display text-3xl font-bold">Finance chatbot</h2>
        <p className="mt-3 text-sm leading-6 text-slate-300">
          Streaming answers, voice input, quote lookup, conversation history, and finance-specific safety rules are built into the assistant.
        </p>

        <div className="mt-7 space-y-3">
          {starters.map((starter) => (
            <button
              key={starter}
              onClick={() => sendMessage(starter)}
              className="w-full rounded-lg border border-white/10 bg-white/[0.06] px-4 py-3 text-left text-sm text-slate-200 transition hover:border-cyan/40 hover:bg-cyan/10"
            >
              {starter}
            </button>
          ))}
        </div>
      </aside>

      <div className="flex min-h-[620px] flex-col">
        <div className="flex-1 space-y-5 overflow-y-auto p-5 md:p-7">
          <AnimatePresence initial={false}>
            {messages.map((message) => (
              <motion.div
                key={message.id}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                className={`flex gap-3 ${message.role === "user" ? "justify-end" : "justify-start"}`}
              >
                {message.role === "assistant" && (
                  <div className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-cyan/15 text-cyan">
                    <Bot size={18} />
                  </div>
                )}
                <div
                  className={`max-w-[85%] whitespace-pre-wrap rounded-lg px-4 py-3 text-sm leading-6 md:max-w-[72%] ${
                    message.role === "user"
                      ? "bg-white text-ink"
                      : "border border-white/10 bg-white/[0.06] text-slate-100"
                  }`}
                >
                  {message.content || (
                    <span className="inline-flex items-center gap-1 text-slate-400">
                      <span className="h-2 w-2 animate-pulse rounded-full bg-cyan" />
                      FinGPT is typing
                    </span>
                  )}
                </div>
                {message.role === "user" && (
                  <div className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-white text-ink">
                    <UserRound size={18} />
                  </div>
                )}
              </motion.div>
            ))}
          </AnimatePresence>
          <div ref={bottomRef} />
        </div>

        <div className="border-t border-white/10 p-4">
          <div className="flex items-end gap-3 rounded-lg border border-white/10 bg-white/[0.06] p-2">
            <textarea
              value={input}
              onChange={(event) => setInput(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === "Enter" && !event.shiftKey) {
                  event.preventDefault();
                  sendMessage();
                }
              }}
              placeholder="Ask about AAPL, TSLA, NVDA, MSFT, finance terms, or portfolio basics..."
              rows={2}
              className="min-h-12 flex-1 resize-none bg-transparent px-3 py-2 text-sm text-white outline-none placeholder:text-slate-500"
            />
            <button
              onClick={isListening ? stopVoiceInput : startVoiceInput}
              className={`grid h-11 w-11 shrink-0 place-items-center rounded-lg border ${
                isListening ? "border-rose/50 bg-rose/15 text-rose" : "border-white/10 text-slate-200 hover:bg-white/10"
              }`}
              aria-label={isListening ? "Stop voice input" : "Start voice input"}
            >
              {isListening ? <MicOff size={18} /> : <Mic size={18} />}
            </button>
            <button
              onClick={() => sendMessage()}
              disabled={!input.trim() || isStreaming}
              className="grid h-11 w-11 shrink-0 place-items-center rounded-lg bg-gradient-to-br from-cyan to-mint text-ink disabled:opacity-40"
              aria-label="Send message"
            >
              <Send size={18} />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
