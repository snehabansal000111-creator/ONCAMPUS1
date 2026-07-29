"use client";

import { motion } from "framer-motion";
import { cn, clamp } from "@/lib/utils";

interface ProgressBarProps {
  value: number;
  max?: number;
  tone?: "primary" | "success" | "warning" | "danger";
  className?: string;
  trackClassName?: string;
}

export default function ProgressBar({
  value,
  max = 100,
  tone = "primary",
  className,
  trackClassName,
}: ProgressBarProps) {
  const pct = clamp((value / max) * 100, 0, 100);
  return (
    <div className={cn("h-2.5 w-full rounded-full bg-slate-100 overflow-hidden", trackClassName)}>
      <motion.div
        initial={{ width: 0 }}
        animate={{ width: `${pct}%` }}
        transition={{ duration: 1, ease: "easeOut" }}
        className={cn(
          "h-full rounded-full",
          tone === "primary" && "bg-gradient-primary",
          tone === "success" && "bg-success",
          tone === "warning" && "bg-warning",
          tone === "danger" && "bg-danger",
          className
        )}
      />
    </div>
  );
}
