"use client";

import Card from "@/components/ui/Card";
import ProgressBar from "@/components/ui/ProgressBar";

const factors = [
  { label: "Savings", score: 78 },
  { label: "Budget control", score: 84 },
  { label: "Spending consistency", score: 88 },
  { label: "Unnecessary expenses", score: 76 },
];

export default function HealthScore() {
  const overall = Math.round(factors.reduce((s, f) => s + f.score, 0) / factors.length);

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
