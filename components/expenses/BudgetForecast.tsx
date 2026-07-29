"use client";

import Card from "@/components/ui/Card";
import { TrendingUp } from "lucide-react";
import { useBudgetAnalysis } from "@/hooks/useAiFinancialAssistant";
import { useAuth } from "@/hooks/useAuth";
import { formatINR } from "@/lib/utils";

interface Props {
  refreshKey?: number;
}

export default function BudgetForecast({ refreshKey }: Props) {
  const { user } = useAuth();
  const { insight, loading } = useBudgetAnalysis(user?.uid);

  if (loading) return <Card><div className="h-32 bg-slate-100 animate-pulse rounded" /></Card>;
  if (!insight) return <Card>No forecast data available</Card>;

  const chanceOfExceeding = insight.prediction.projectedMonthlySpend > insight.current.spent
    ? Math.round((Math.max(0, insight.prediction.projectedDeficit) / insight.prediction.projectedMonthlySpend) * 100)
    : 0;

  return (
    <Card>
      <h3 className="font-display font-semibold text-ink flex items-center gap-2">
        <TrendingUp size={18} className="text-primary-600" /> AI budget forecast
      </h3>
      <div className="mt-4 grid grid-cols-3 gap-3 text-center">
        <div>
          <p className="text-xs text-muted">Expected by month end</p>
          <p className="font-mono font-semibold text-ink mt-1">{formatINR(insight.prediction.projectedMonthlySpend)}</p>
        </div>
        <div>
          <p className="text-xs text-muted">Chance of exceeding</p>
          <p className="font-mono font-semibold text-warning mt-1">{chanceOfExceeding}%</p>
        </div>
        <div>
          <p className="text-xs text-muted">Safe daily spend</p>
          <p className="font-mono font-semibold text-ink mt-1">{formatINR(insight.prediction.safeRemainingDaily)}</p>
        </div>
      </div>
      <p className="mt-4 text-sm text-ink bg-primary-50 rounded-xl2 p-3.5 leading-relaxed">
        AI predicts you'll spend {formatINR(insight.prediction.projectedMonthlySpend)} this month. {
          insight.prediction.projectedDeficit > 0
            ? `Reduce discretionary spending by ₹${Math.round(insight.prediction.projectedDeficit / 4)} this week to stay within budget.`
            : `You're on track to stay within your ₹${insight.current.spent} budget!`
        }
      </p>
    </Card>
  );
}
