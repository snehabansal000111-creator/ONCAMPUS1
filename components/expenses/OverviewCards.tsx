"use client";

import { motion } from "framer-motion";
import { Wallet, TrendingDown, PiggyBank, TrendingUp } from "lucide-react";
import Card from "@/components/ui/Card";
import { useExpenseStats } from "@/hooks/useExpenses";
import { useAuth } from "@/hooks/useAuth";
import { formatINR } from "@/lib/utils";

interface Props {
  refreshKey?: number;
}

export default function OverviewCards({ refreshKey }: Props) {
  const { user } = useAuth();
  console.log("[OverviewCards] Component rendered with refreshKey:", refreshKey, "userId:", user?.uid);
  const { stats, loading } = useExpenseStats(user?.uid, undefined, refreshKey);
  console.log("[OverviewCards] Stats received:", stats);

  if (loading) {
    return (
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[...Array(4)].map((_, i) => (
          <Card key={i} className="h-32 bg-slate-100 animate-pulse" />
        ))}
      </div>
    );
  }

  if (!stats) {
    return <div>No budget data available</div>;
  }

  const dot = {
    neutral: "bg-slate-300",
    warning: "bg-warning",
    danger: "bg-danger",
    success: "bg-success",
  };

  const cards = [
    {
      label: "Monthly Budget",
      amount: stats.monthlyBudget,
      change: "Same as last month",
      tone: "neutral" as const,
      icon: Wallet,
    },
    {
      label: "Total Spent",
      amount: stats.totalSpent,
      change: stats.totalSpent > 7200 ? "+18% vs last month" : "Lower than average",
      tone: (stats.totalSpent > stats.monthlyBudget * 0.8 ? "warning" : "success") as keyof typeof dot,
      icon: TrendingUp,
    },
    {
      label: "Remaining Budget",
      amount: stats.remaining,
      change: "6 days left in month",
      tone: (stats.remaining < 1000 ? "danger" : "neutral") as keyof typeof dot,
      icon: TrendingDown,
    },
    {
      label: "Estimated Savings",
      amount: Math.max(0, stats.remaining),
      change: `₹${Math.max(0, stats.remaining)} available`,
      tone: "success" as const,
      icon: PiggyBank,
    },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {cards.map((c, i) => (
        <motion.div
          key={c.label}
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: i * 0.06 }}
        >
          <Card className="h-full">
            <div className="flex items-center justify-between">
              <span className={`h-2 w-2 rounded-full ${dot[c.tone]}`} />
              <c.icon size={16} className="text-faint" />
            </div>
            <p className="text-xs text-muted mt-3">{c.label}</p>
            <p className="text-xl md:text-2xl font-display font-semibold text-ink mt-1 font-mono">
              {formatINR(c.amount)}
            </p>
            <p className="text-[11px] text-muted mt-1.5">{c.change}</p>
          </Card>
        </motion.div>
      ))}
    </div>
  );
}
