"use client";

import Card from "@/components/ui/Card";
import ProgressRing from "@/components/ui/ProgressRing";
import { AlertTriangle, CheckCircle2 } from "lucide-react";
import { formatINR } from "@/lib/utils";
import { currentStudent } from "@/lib/mock-data";

export default function BudgetProgress() {
  const spent = 9600;
  const budget = currentStudent.monthlyBudget;
  const pctUsed = Math.round((spent / budget) * 100);
  const onTrack = pctUsed < 85;
  const dailyLimit = Math.round((budget - spent) / 6);

  return (
    <Card>
      <h3 className="font-display font-semibold text-ink">Budget progress</h3>
      <div className="mt-4 flex flex-col md:flex-row items-center gap-8">
        <ProgressRing value={pctUsed} label={`${pctUsed}%`} sublabel="used" size={168} />

        <div className="flex-1 w-full space-y-4">
          <div className="grid grid-cols-3 gap-3 text-center">
            <div>
              <p className="text-xs text-muted">Used</p>
              <p className="font-mono font-semibold text-ink mt-0.5">{formatINR(spent)}</p>
            </div>
            <div>
              <p className="text-xs text-muted">Remaining</p>
              <p className="font-mono font-semibold text-ink mt-0.5">{formatINR(budget - spent)}</p>
            </div>
            <div>
              <p className="text-xs text-muted">Daily limit</p>
              <p className="font-mono font-semibold text-ink mt-0.5">{formatINR(dailyLimit)}</p>
            </div>
          </div>

          <div
            className={`flex items-start gap-2.5 rounded-xl2 p-3.5 text-sm ${
              onTrack ? "bg-emerald-50 text-emerald-800" : "bg-amber-50 text-amber-800"
            }`}
          >
            {onTrack ? (
              <CheckCircle2 size={18} className="shrink-0 mt-0.5" />
            ) : (
              <AlertTriangle size={18} className="shrink-0 mt-0.5" />
            )}
            <span>
              {onTrack
                ? "You're spending within your planned budget."
                : "At your current pace, you'll exceed your budget in 5 days."}
            </span>
          </div>
        </div>
      </div>
    </Card>
  );
}
