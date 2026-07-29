"use client";

import { motion } from "framer-motion";
import { Wallet, TrendingDown, PiggyBank, TrendingUp } from "lucide-react";
import Card from "@/components/ui/Card";
import { formatINR } from "@/lib/utils";

const cards = [
  {
    label: "Monthly Budget",
    amount: 12000,
    change: "Same as last month",
    tone: "neutral" as const,
    icon: Wallet,
  },
  {
    label: "Total Spent",
    amount: 9600,
    change: "+18% vs last month",
    tone: "warning" as const,
    icon: TrendingUp,
  },
  {
    label: "Remaining Budget",
    amount: 2400,
    change: "6 days left in month",
    tone: "danger" as const,
    icon: TrendingDown,
  },
  {
    label: "Estimated Savings",
    amount: 1800,
    change: "+₹300 vs last month",
    tone: "success" as const,
    icon: PiggyBank,
  },
];

const dot = {
  neutral: "bg-slate-300",
  warning: "bg-warning",
  danger: "bg-danger",
  success: "bg-success",
};

export default function OverviewCards() {
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
