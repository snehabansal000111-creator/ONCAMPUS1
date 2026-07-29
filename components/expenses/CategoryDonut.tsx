"use client";

import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";
import Card from "@/components/ui/Card";
import { useExpenseStats } from "@/hooks/useExpenses";
import { useAuth } from "@/hooks/useAuth";
import { formatINR, cn } from "@/lib/utils";

const categoryColors: Record<string, string> = {
  Food: "#2E5EFF",
  Shopping: "#14C7D8",
  Transport: "#5FE0E9",
  Education: "#8AACFF",
  Entertainment: "#F59E0B",
  "Hostel/PG": "#1735AD",
  Health: "#16A34A",
  Others: "#94A3B8",
};

interface Props {
  selected: string | null;
  onSelect: (category: string | null) => void;
  refreshKey?: number;
}

export default function CategoryDonut({ selected, onSelect, refreshKey }: Props) {
  const { user } = useAuth();
  const { stats, loading } = useExpenseStats(user?.uid, undefined, refreshKey);

  if (loading) return <Card><div className="h-64 bg-slate-100 animate-pulse rounded" /></Card>;
  if (!stats) return <Card>No spending data</Card>;

  const spendingByCategory = Object.entries(stats.spendingByCategory).map(([cat, val]) => ({
    category: cat,
    value: val,
    color: categoryColors[cat] || "#94A3B8",
  }));

  const total = spendingByCategory.reduce((s, c) => s + c.value, 0);

  return (
    <Card>
      <h3 className="font-display font-semibold text-ink">Spending by category</h3>
      <div className="mt-2 grid md:grid-cols-2 gap-4 items-center">
        <div className="relative h-64">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={spendingByCategory}
                dataKey="value"
                nameKey="category"
                innerRadius={62}
                outerRadius={92}
                paddingAngle={2}
                animationDuration={800}
                onClick={(d) => onSelect(selected === d.category ? null : d.category)}
              >
                {spendingByCategory.map((entry) => (
                  <Cell
                    key={entry.category}
                    fill={entry.color}
                    className="cursor-pointer"
                    opacity={selected && selected !== entry.category ? 0.35 : 1}
                  />
                ))}
              </Pie>
              <Tooltip formatter={(v: number) => formatINR(v)} />
            </PieChart>
          </ResponsiveContainer>
          <div className="absolute inset-0 grid place-items-center pointer-events-none">
            <div className="text-center">
              <p className="text-xs text-muted">Total</p>
              <p className="font-display font-semibold text-lg text-ink">{formatINR(total)}</p>
            </div>
          </div>
        </div>

        <div className="space-y-1.5">
          {spendingByCategory.map((c) => (
            <button
              key={c.category}
              onClick={() => onSelect(selected === c.category ? null : c.category)}
              className={cn(
                "w-full flex items-center justify-between rounded-xl2 px-3 py-2 text-sm transition-colors",
                selected === c.category ? "bg-primary-50" : "hover:bg-slate-50"
              )}
            >
              <span className="flex items-center gap-2">
                <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: c.color }} />
                <span className="text-ink">{c.category}</span>
              </span>
              <span className="font-mono text-muted">{formatINR(c.value)}</span>
            </button>
          ))}
        </div>
      </div>
    </Card>
  );
}
