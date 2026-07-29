"use client";

import { useState } from "react";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";
import Card from "@/components/ui/Card";
import { cn, formatINR } from "@/lib/utils";
import { monthlyTrend } from "@/lib/mock-data";

const periods = ["Weekly", "Monthly", "Yearly"] as const;

export default function SpendingTrend() {
  const [period, setPeriod] = useState<(typeof periods)[number]>("Weekly");

  return (
    <Card>
      <div className="flex items-center justify-between flex-wrap gap-3">
        <h3 className="font-display font-semibold text-ink">Monthly spending trend</h3>
        <div className="flex gap-1 bg-slate-100 rounded-full p-1">
          {periods.map((p) => (
            <button
              key={p}
              onClick={() => setPeriod(p)}
              className={cn(
                "px-3 py-1 rounded-full text-xs font-medium transition-colors",
                period === p ? "bg-white text-ink shadow-soft" : "text-muted"
              )}
            >
              {p}
            </button>
          ))}
        </div>
      </div>

      <div className="h-56 mt-4">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={monthlyTrend} margin={{ left: -20, right: 10 }}>
            <defs>
              <linearGradient id="lineGrad" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stopColor="#2E5EFF" />
                <stop offset="100%" stopColor="#14C7D8" />
              </linearGradient>
            </defs>
            <CartesianGrid stroke="#F1F5F9" vertical={false} />
            <XAxis dataKey="label" tick={{ fontSize: 12, fill: "#64748B" }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fontSize: 12, fill: "#64748B" }} axisLine={false} tickLine={false} />
            <Tooltip formatter={(v: number) => formatINR(v)} />
            <Line
              type="monotone"
              dataKey="spend"
              stroke="url(#lineGrad)"
              strokeWidth={3}
              dot={{ r: 4, fill: "#2E5EFF" }}
              activeDot={{ r: 6 }}
              animationDuration={900}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
      <p className="text-xs text-muted mt-1">Showing {period.toLowerCase()} view (demo data).</p>
    </Card>
  );
}
