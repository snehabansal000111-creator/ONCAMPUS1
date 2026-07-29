"use client";

import Card from "@/components/ui/Card";
import { TrendingUp } from "lucide-react";
import { formatINR } from "@/lib/utils";

export default function BudgetForecast() {
  return (
    <Card>
      <h3 className="font-display font-semibold text-ink flex items-center gap-2">
        <TrendingUp size={18} className="text-primary-600" /> AI budget forecast
      </h3>
      <div className="mt-4 grid grid-cols-3 gap-3 text-center">
        <div>
          <p className="text-xs text-muted">Expected by month end</p>
          <p className="font-mono font-semibold text-ink mt-1">{formatINR(13800)}</p>
        </div>
        <div>
          <p className="text-xs text-muted">Chance of exceeding</p>
          <p className="font-mono font-semibold text-warning mt-1">68%</p>
        </div>
        <div>
          <p className="text-xs text-muted">Safe daily spend</p>
          <p className="font-mono font-semibold text-ink mt-1">{formatINR(400)}</p>
        </div>
      </div>
      <p className="mt-4 text-sm text-ink bg-primary-50 rounded-xl2 p-3.5 leading-relaxed">
        AI predicts you'll spend {formatINR(13800)} this month. Reduce discretionary
        spending by {formatINR(500)} this week to stay within budget.
      </p>
    </Card>
  );
}
