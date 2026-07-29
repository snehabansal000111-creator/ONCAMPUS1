"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown } from "lucide-react";

const faqs = [
  {
    q: "Is ONCampus free for students?",
    a: "Yes — the core roadmap, mentor matching, and expense tracker are free for students. We may introduce optional premium tiers later.",
  },
  {
    q: "How does the AI personalize recommendations?",
    a: "Everything is grounded in your onboarding profile — branch, skills, goals, and learning style — so the assistant references your context instead of giving generic answers.",
  },
  {
    q: "Can I connect my bank SMS for expense tracking?",
    a: "In the mobile app, yes. The web MVP uses manual entry and demo data so you can try the experience without connecting anything sensitive.",
  },
  {
    q: "Is my data shared with mentors or other students?",
    a: "No. Mentors see only what you choose to share when you request a session.",
  },
];

export default function FAQ() {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <section id="faq" className="section-pad py-20 md:py-28 bg-white/60 border-y border-border">
      <div className="mx-auto max-w-2xl text-center">
        <span className="text-sm font-medium text-primary-600">Questions</span>
        <h2 className="mt-3 text-3xl md:text-4xl font-display font-semibold text-ink">
          Frequently asked
        </h2>
      </div>

      <div className="mt-12 max-w-2xl mx-auto divide-y divide-border glass-card p-2">
        {faqs.map((f, i) => (
          <div key={f.q} className="p-4">
            <button
              className="w-full flex items-center justify-between text-left gap-4"
              onClick={() => setOpen(open === i ? null : i)}
              aria-expanded={open === i}
            >
              <span className="font-medium text-ink text-sm md:text-base">{f.q}</span>
              <motion.span animate={{ rotate: open === i ? 180 : 0 }} transition={{ duration: 0.2 }}>
                <ChevronDown size={18} className="text-muted shrink-0" />
              </motion.span>
            </button>
            <AnimatePresence initial={false}>
              {open === i && (
                <motion.p
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.25 }}
                  className="text-sm text-muted overflow-hidden mt-2"
                >
                  {f.a}
                </motion.p>
              )}
            </AnimatePresence>
          </div>
        ))}
      </div>
    </section>
  );
}
