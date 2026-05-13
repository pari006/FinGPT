import { Suspense, lazy } from "react";
import { BrowserRouter, Navigate, Route, Routes, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { Header } from "./components/Header";
import { ToastStack } from "./components/ToastStack";
import { useToast } from "./hooks/useToast";

const ChatPage = lazy(() => import("./pages/ChatPage").then((module) => ({ default: module.ChatPage })));
const DashboardPage = lazy(() =>
  import("./pages/DashboardPage").then((module) => ({ default: module.DashboardPage }))
);
const InsightsPage = lazy(() =>
  import("./pages/InsightsPage").then((module) => ({ default: module.InsightsPage }))
);
const ReportsPage = lazy(() =>
  import("./pages/ReportsPage").then((module) => ({ default: module.ReportsPage }))
);

function RouteFallback() {
  return (
    <div className="glass rounded-lg p-8">
      <div className="h-5 w-40 animate-pulse rounded bg-white/10" />
      <div className="mt-5 h-40 animate-pulse rounded-lg bg-white/[0.05]" />
    </div>
  );
}

function AppShell() {
  const { toasts, showToast } = useToast();
  const location = useLocation();

  return (
    <div className="min-h-screen bg-market-grid bg-[length:44px_44px]">
      <div className="min-h-screen">
        <main className="w-full px-4 py-5 md:px-6 lg:px-8">
          <div className="mx-auto max-w-[1500px] space-y-8">
            <Header showToast={showToast} />
            <motion.div
              key={location.pathname}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.12 }}
              className="space-y-8"
            >
              <Suspense fallback={<RouteFallback />}>
                <Routes>
                  <Route path="/" element={<Navigate to="/dashboard" replace />} />
                  <Route path="/dashboard" element={<DashboardPage showToast={showToast} />} />
                  <Route path="/chat" element={<ChatPage showToast={showToast} />} />
                  <Route path="/insights" element={<InsightsPage showToast={showToast} />} />
                  <Route path="/reports" element={<ReportsPage showToast={showToast} />} />
                  <Route path="*" element={<Navigate to="/dashboard" replace />} />
                </Routes>
              </Suspense>
            </motion.div>
          </div>
        </main>
      </div>
      <ToastStack toasts={toasts} />
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AppShell />
    </BrowserRouter>
  );
}
