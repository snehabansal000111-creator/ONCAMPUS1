"use client";

import { PlusCircle, Camera, MailSearch, PieChart } from "lucide-react";

interface QuickActionsProps {
  onAddExpense?: () => void;
  onScanReceipt?: () => void;
  onReviewSms?: () => void;
  onViewReports?: () => void;
}

export default function QuickActions({
  onAddExpense,
  onScanReceipt,
  onReviewSms,
  onViewReports,
}: QuickActionsProps) {
  const actions = [
    { icon: PlusCircle, label: "Add Expense", onClick: onAddExpense },
    { icon: Camera, label: "Scan Receipt", onClick: onScanReceipt },
    { icon: MailSearch, label: "Review SMS", onClick: onReviewSms },
    { icon: PieChart, label: "View Reports", onClick: onViewReports },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
      {actions.map((a) => (
        <button
          key={a.label}
          onClick={a.onClick}
          className="flex flex-col items-center justify-center gap-2 rounded-xl2 border border-border bg-white py-5 hover:border-primary-300 hover:shadow-soft transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          disabled={!a.onClick}
        >
          <span className="grid h-10 w-10 place-items-center rounded-full bg-primary-50 text-primary-600">
            <a.icon size={18} />
          </span>
          <span className="text-xs font-medium text-ink">{a.label}</span>
        </button>
      ))}
    </div>
  );
}
