"use client";

import Card from "@/components/ui/Card";
import { AlertTriangle, Info, Bell } from "lucide-react";
import { useAlerts } from "@/hooks/useExpenses";
import { useAuth } from "@/hooks/useAuth";
import { cn } from "@/lib/utils";

const iconFor = {
  info: Info,
  warning: AlertTriangle,
  danger: AlertTriangle,
};

const toneClasses = {
  info: "bg-primary-50 text-primary-700",
  warning: "bg-amber-50 text-amber-700",
  danger: "bg-red-50 text-red-700",
};

interface Props {
  refreshKey?: number;
}

export default function SmartAlerts({ refreshKey }: Props) {
  const { user } = useAuth();
  const { alerts, loading } = useAlerts(user?.uid, refreshKey);

  if (loading) return <Card><div className="h-20 bg-slate-100 animate-pulse rounded mt-4" /></Card>;
  if (!alerts || alerts.length === 0) return <Card><p className="text-muted text-sm">No alerts</p></Card>;

  return (
    <Card>
      <h3 className="font-display font-semibold text-ink flex items-center gap-2">
        <Bell size={18} className="text-primary-600" /> Smart alerts
      </h3>
      <div className="mt-4 flex gap-3 overflow-x-auto pb-1 -mx-1 px-1">
        {alerts.map((a) => {
          const Icon = iconFor[a.severity];
          return (
            <div
              key={a.id}
              className={cn("shrink-0 w-64 rounded-xl2 p-3.5", toneClasses[a.severity])}
            >
              <div className="flex items-center gap-2">
                <Icon size={15} />
                <p className="text-sm font-medium">{a.title}</p>
              </div>
              <p className="text-xs mt-1.5 opacity-90 leading-relaxed">{a.detail}</p>
            </div>
          );
        })}
      </div>
    </Card>
  );
}
