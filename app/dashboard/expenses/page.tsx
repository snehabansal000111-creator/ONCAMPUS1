"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import TopBar from "@/components/dashboard/TopBar";
import OverviewCards from "@/components/expenses/OverviewCards";
import BudgetProgress from "@/components/expenses/BudgetProgress";
import AIInsights from "@/components/expenses/AIInsights";
import QuickActions from "@/components/expenses/QuickActions";
import SmsDetection from "@/components/expenses/SmsDetection";
import CategoryDonut from "@/components/expenses/CategoryDonut";
import SpendingTrend from "@/components/expenses/SpendingTrend";
import TransactionList from "@/components/expenses/TransactionList";
import BudgetForecast from "@/components/expenses/BudgetForecast";
import HealthScore from "@/components/expenses/HealthScore";
import SmartAlerts from "@/components/expenses/SmartAlerts";

export default function ExpensesPage() {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  return (
    <div className="relative">
      <TopBar title="AI Expense Tracker" />

      <div className="space-y-5">
        <OverviewCards />
        <BudgetProgress />
        <AIInsights />
        <QuickActions />
        <SmsDetection />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          <CategoryDonut selected={selectedCategory} onSelect={setSelectedCategory} />
          <SpendingTrend />
        </div>

        <TransactionList filter={selectedCategory} />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          <BudgetForecast />
          <HealthScore />
        </div>

        <SmartAlerts />
      </div>

      {/* Floating Add Expense button — always reachable one-handed */}
      <button
        aria-label="Add expense"
        className="fixed bottom-24 md:bottom-8 right-6 z-40 grid h-14 w-14 place-items-center rounded-full bg-gradient-primary text-white shadow-lift hover:scale-105 active:scale-95 transition-transform duration-200"
      >
        <Plus size={24} />
      </button>
    </div>
  );
}
