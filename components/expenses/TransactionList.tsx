"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { MoreVertical, Pencil, Trash2, Eye } from "lucide-react";
import Card from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";
import { transactions } from "@/lib/mock-data";
import { formatINR, cn } from "@/lib/utils";

export default function TransactionList({ filter }: { filter: string | null }) {
  const [menuOpen, setMenuOpen] = useState<string | null>(null);
  const list = filter ? transactions.filter((t) => t.category === filter) : transactions;

  return (
    <Card>
      <div className="flex items-center justify-between">
        <h3 className="font-display font-semibold text-ink">Recent transactions</h3>
        {filter && <Badge tone="primary">{filter}</Badge>}
      </div>

      <div className="mt-3 divide-y divide-border">
        {list.map((t, i) => (
          <motion.div
            key={t.id}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3, delay: i * 0.03 }}
            className="flex items-center gap-3 py-3"
          >
            <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-slate-100 text-sm font-semibold text-muted">
              {t.category[0]}
            </span>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <p className="text-sm font-medium text-ink truncate">{t.merchant}</p>
                {t.aiTagged && <Badge tone="primary">AI</Badge>}
              </div>
              <p className="text-xs text-muted mt-0.5">{t.date} · {t.paymentMethod}</p>
            </div>
            <p className="font-mono font-semibold text-ink shrink-0">{formatINR(t.amount)}</p>
            <div className="relative shrink-0">
              <button
                aria-label="Transaction options"
                onClick={() => setMenuOpen(menuOpen === t.id ? null : t.id)}
                className="grid h-8 w-8 place-items-center rounded-full hover:bg-slate-100 transition-colors text-muted"
              >
                <MoreVertical size={16} />
              </button>
              {menuOpen === t.id && (
                <div className="absolute right-0 top-9 z-10 w-36 rounded-xl2 border border-border bg-white shadow-lift py-1">
                  {[
                    { icon: Eye, label: "View details" },
                    { icon: Pencil, label: "Edit" },
                    { icon: Trash2, label: "Delete" },
                  ].map((opt) => (
                    <button
                      key={opt.label}
                      className={cn(
                        "w-full flex items-center gap-2 px-3 py-2 text-xs text-left hover:bg-slate-50",
                        opt.label === "Delete" && "text-danger"
                      )}
                    >
                      <opt.icon size={13} /> {opt.label}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        ))}
        {list.length === 0 && (
          <p className="text-sm text-muted text-center py-6">No transactions in this category yet.</p>
        )}
      </div>
    </Card>
  );
}
