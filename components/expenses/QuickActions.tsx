"use client";

import { PlusCircle, Camera, MailSearch, PieChart } from "lucide-react";

const actions = [
  { icon: PlusCircle, label: "Add Expense" },
  { icon: Camera, label: "Scan Receipt" },
  { icon: MailSearch, label: "Review SMS" },
  { icon: PieChart, label: "View Reports" },
];

export default function QuickActions() {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
      {actions.map((a) => (
        <button
          key={a.label}
          className="flex flex-col items-center justify-center gap-2 rounded-xl2 border border-border bg-white py-5 hover:border-primary-300 hover:shadow-soft transition-all duration-200"
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
