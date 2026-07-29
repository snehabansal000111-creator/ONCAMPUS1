"use client";

import Card from "@/components/ui/Card";
import ProgressBar from "@/components/ui/ProgressBar";
import { useFinancialHealthScore } from "@/hooks/useAiFinancialAssistant";
import { useAuth } from "@/hooks/useAuth";

interface Props {
  refreshKey?: number;
}

export default function HealthScore({ refreshKey }: Props) {
  const { user } = useAuth();
  const { insight, loading } = useFinancialHealthScore(user?.uid);

  if (loading) return <Card><div className="h-32 bg-slate-100 animate-pulse rounded" /></Card>;
  if (!insight) return <Card>No health data available</Card>;

  const factors = [
    { label: "Budget control", score: insight.components.budgetControl },
    { label: "Savings rate", score: insight.components.savingsRate },
    { label: "Consistency", score: insight.components.consistency },
    { label: "Organization", score: insight.components.organization },
  ];

  const overall = insight.overallScore;

  return (
    <Card>
      <div className="flex items-center justify-between">
        <h3 className="font-display font-semibold text-ink">Financial health score</h3>
        <span className="font-display font-semibold text-primary-600">{overall}/100</span>
      </div>
      <ProgressBar value={overall} tone="primary" className="mt-3" />
      <div className="mt-5 space-y-3">
        {factors.map((f) => (
          <div key={f.label}>
            <div className="flex justify-between text-xs text-muted mb-1">
              <span>{f.label}</span>
              <span className="font-mono">{f.score}</span>
            </div>
            <ProgressBar value={f.score} tone={f.score > 80 ? "success" : "primary"} trackClassName="h-1.5" />
          </div>
        ))}
      </div>
    </Card>
  );
}
