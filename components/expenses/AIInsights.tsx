"use client";

import { motion } from "framer-motion";
import { Sparkles, TrendingUp, PiggyBank, Lightbulb } from "lucide-react";
import { useFinancialAnalysis } from "@/hooks/useAiFinancialAssistant";
import { useAuth } from "@/hooks/useAuth";

export default function AIInsights() {
  const { user } = useAuth();
  const { insight, loading } = useFinancialAnalysis(user?.uid, "full");

  if (loading) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative overflow-hidden rounded-xl3 bg-gradient-primary p-6 md:p-7 text-white h-32 animate-pulse"
      />
    );
  }

  if (!insight) {
    return null;
  }

  // Parse insight text into bullet points
  const lines = insight.analysis
    ?.split("\n")
    .filter((line: string) => line.trim().length > 0)
    .slice(0, 3) || [];

  const insights = lines.map((text: string, i: number) => ({
    icon: i === 0 ? TrendingUp : i === 1 ? TrendingUp : PiggyBank,
    text: text.trim(),
  }));
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="relative overflow-hidden rounded-xl3 bg-gradient-primary p-6 md:p-7 text-white"
    >
      <div className="pointer-events-none absolute -top-16 -right-10 h-56 w-56 rounded-full bg-white/10 blur-3xl animate-float" />
      <div className="relative flex items-center gap-2">
        <span className="grid h-9 w-9 place-items-center rounded-xl2 bg-white/15">
          <Sparkles size={18} />
        </span>
        <h3 className="font-display font-semibold text-lg">AI Insights</h3>
      </div>

      <p className="relative mt-4 text-white/95 leading-relaxed max-w-xl">
        💡 You spent 35% more on food this week. Reducing food delivery by two orders
        could save approximately ₹900 this month.
      </p>

      <div className="relative mt-5 grid sm:grid-cols-3 gap-3">
        {insights.map((ins: typeof insights[0], i: number) => (
          <div key={i} className="flex items-start gap-2.5 rounded-xl2 bg-white/10 p-3.5 text-sm">
            <ins.icon size={16} className="shrink-0 mt-0.5" />
            <span className="text-white/90 leading-snug">{ins.text}</span>
          </div>
        ))}
      </div>

      <div className="relative mt-5 flex items-center gap-2 text-xs text-white/80">
        <Lightbulb size={14} /> Personalized advice, refreshed after each new expense.
      </div>
    </motion.div>
  );
}
