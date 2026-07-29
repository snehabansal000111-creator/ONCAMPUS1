"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageSquareText, Check, Pencil, X, Sparkles } from "lucide-react";
import Card from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";
import { smsDetected as initial } from "@/lib/mock-data";
import { formatINR } from "@/lib/utils";
import type { SmsDetectedTransaction } from "@/types";

export default function SmsDetection() {
  const [items, setItems] = useState<SmsDetectedTransaction[]>(initial);

  const setStatus = (id: string, status: SmsDetectedTransaction["status"]) =>
    setItems((prev) => prev.map((it) => (it.id === id ? { ...it, status } : it)));

  const pending = items.filter((i) => i.status === "pending");

  return (
    <Card>
      <div className="flex items-center justify-between">
        <h3 className="font-display font-semibold text-ink flex items-center gap-2">
          <MessageSquareText size={18} className="text-primary-600" /> Auto SMS Detection
        </h3>
        <Badge tone="primary">
          <Sparkles size={11} /> AI Detected
        </Badge>
      </div>
      <p className="text-xs text-muted mt-1">
        {pending.length} new transaction{pending.length !== 1 ? "s" : ""} detected from SMS.
      </p>

      <div className="mt-4 space-y-3">
        <AnimatePresence initial={false}>
          {pending.map((t) => (
            <motion.div
              key={t.id}
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.25 }}
              className="overflow-hidden"
            >
              <div className="flex items-center gap-3 rounded-xl2 border border-border p-3.5">
                <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-slate-100 text-sm font-semibold text-muted">
                  {t.merchant[0]}
                </span>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-medium text-ink truncate">{t.merchant}</p>
                    <Badge tone="neutral">{t.category}</Badge>
                  </div>
                  <p className="text-xs text-muted mt-0.5">
                    {t.date} · {t.confidence}% confidence
                  </p>
                </div>
                <p className="font-mono font-semibold text-ink shrink-0">{formatINR(t.amount)}</p>
                <div className="flex items-center gap-1 shrink-0">
                  <button
                    aria-label="Accept"
                    onClick={() => setStatus(t.id, "accepted")}
                    className="grid h-8 w-8 place-items-center rounded-full bg-emerald-50 text-emerald-600 hover:bg-emerald-100 transition-colors"
                  >
                    <Check size={15} />
                  </button>
                  <button
                    aria-label="Edit"
                    className="grid h-8 w-8 place-items-center rounded-full bg-slate-100 text-muted hover:bg-slate-200 transition-colors"
                  >
                    <Pencil size={13} />
                  </button>
                  <button
                    aria-label="Ignore"
                    onClick={() => setStatus(t.id, "ignored")}
                    className="grid h-8 w-8 place-items-center rounded-full bg-red-50 text-red-500 hover:bg-red-100 transition-colors"
                  >
                    <X size={15} />
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
        {pending.length === 0 && (
          <p className="text-sm text-muted text-center py-6">All caught up — no pending SMS transactions.</p>
        )}
      </div>
    </Card>
  );
}
