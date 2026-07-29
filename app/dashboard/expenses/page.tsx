"use client";

import { useState, useEffect } from "react";
import { Plus } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
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
import AddExpenseModal from "@/components/expenses/AddExpenseModal";

export default function ExpensesPage() {
  const { user } = useAuth();
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    console.log("[ExpensesPage] refreshKey changed to:", refreshKey);
  }, [refreshKey]);

  const handleSmsExpenseAdded = () => {
    console.log("[ExpensesPage] handleSmsExpenseAdded called, incrementing refreshKey");
    setRefreshKey(k => {
      const newKey = k + 1;
      console.log("[ExpensesPage] refreshKey incremented from", k, "to", newKey);
      return newKey;
    });
  };

  return (
    <div className="relative">
      <TopBar title="AI Expense Tracker" />

      <div className="space-y-5">
        <OverviewCards refreshKey={refreshKey} />
        <BudgetProgress refreshKey={refreshKey} />
        <AIInsights />
        <QuickActions
          onAddExpense={() => setShowAddModal(true)}
          onReviewSms={() => document.getElementById('sms-section')?.scrollIntoView({ behavior: 'smooth' })}
          onViewReports={() => window.location.href = "/dashboard/profile"}
        />
        <SmsDetection onExpenseAdded={handleSmsExpenseAdded} />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          <CategoryDonut refreshKey={refreshKey} selected={selectedCategory} onSelect={setSelectedCategory} />
          <SpendingTrend refreshKey={refreshKey} />
        </div>

        <TransactionList refreshKey={refreshKey} filter={selectedCategory} />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          <BudgetForecast refreshKey={refreshKey} />
          <HealthScore refreshKey={refreshKey} />
        </div>

        <SmartAlerts refreshKey={refreshKey} />
      </div>

      {/* Floating Add Expense button — always reachable one-handed */}
      <button
        onClick={() => setShowAddModal(true)}
        aria-label="Add expense"
        className="fixed bottom-24 md:bottom-8 right-6 z-40 grid h-14 w-14 place-items-center rounded-full bg-gradient-primary text-white shadow-lift hover:scale-105 active:scale-95 transition-transform duration-200"
      >
        <Plus size={24} />
      </button>

      <AddExpenseModal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        userId={user?.uid}
        onExpenseAdded={() => setRefreshKey(k => k + 1)}
      />
    </div>
  );
}
