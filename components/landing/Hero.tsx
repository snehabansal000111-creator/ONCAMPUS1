"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight, Sparkles } from "lucide-react";
import Button from "@/components/ui/Button";

const nodes = [
  { x: 40, y: 210, label: "Onboarding", delay: 0.2 },
  { x: 220, y: 90, label: "Roadmap", delay: 0.6 },
  { x: 420, y: 200, label: "Mentor match", delay: 1.0 },
  { x: 610, y: 80, label: "Placement-ready", delay: 1.4 },
];

export default function Hero() {
  return (
    <section className="relative overflow-hidden bg-gradient-radiant">
      {/* Floating gradient blobs */}
      <div className="pointer-events-none absolute -top-24 -left-24 h-96 w-96 rounded-full bg-primary-200/40 blur-3xl animate-float" />
      <div className="pointer-events-none absolute top-40 -right-16 h-80 w-80 rounded-full bg-cyan-200/50 blur-3xl animate-float [animation-delay:1.5s]" />

      <div className="section-pad relative pt-16 pb-10 md:pt-24 md:pb-16">
        <div className="mx-auto max-w-3xl text-center">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 rounded-full border border-border bg-white/70 px-4 py-1.5 text-xs font-medium text-primary-700"
          >
            <Sparkles size={14} /> Built for the first year that decides the next four
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="mt-6 text-4xl md:text-6xl font-display font-semibold tracking-tight text-ink"
          >
            Your personalized path
            <br />
            through college, mapped by AI
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mt-5 text-lg text-muted max-w-xl mx-auto"
          >
            ONCampus learns your background, goals, and pace — then builds the
            roadmap, finds the right seniors, and keeps your money in check. No generic advice.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="mt-8 flex flex-wrap items-center justify-center gap-3"
          >
            <Link href="/signup">
              <Button variant="primary" size="lg" className="group">
                Start your roadmap
                <ArrowRight size={18} className="transition-transform group-hover:translate-x-0.5" />
              </Button>
            </Link>
            <a href="#how-it-works">
              <Button variant="outline" size="lg">See how it works</Button>
            </a>
          </motion.div>
        </div>

        {/* Signature element: the animated journey path */}
        <div className="mx-auto mt-16 max-w-4xl">
          <svg viewBox="0 0 650 260" className="w-full h-auto" aria-hidden="true">
            <motion.path
              d="M40,210 C120,210 140,90 220,90 C300,90 340,200 420,200 C500,200 530,80 610,80"
              fill="none"
              stroke="url(#heroPath)"
              strokeWidth="3"
              strokeLinecap="round"
              strokeDasharray="1000"
              initial={{ strokeDashoffset: 1000 }}
              animate={{ strokeDashoffset: 0 }}
              transition={{ duration: 2, ease: "easeInOut", delay: 0.4 }}
            />
            <defs>
              <linearGradient id="heroPath" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#2E5EFF" />
                <stop offset="100%" stopColor="#14C7D8" />
              </linearGradient>
            </defs>
            {nodes.map((n) => (
              <g key={n.label}>
                <motion.circle
                  cx={n.x}
                  cy={n.y}
                  r={9}
                  fill="white"
                  stroke="#2E5EFF"
                  strokeWidth={3}
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ duration: 0.4, delay: n.delay }}
                />
                <motion.text
                  x={n.x}
                  y={n.y - 20}
                  textAnchor="middle"
                  className="fill-ink font-body text-[13px] font-medium"
                  initial={{ opacity: 0, y: n.y - 10 }}
                  animate={{ opacity: 1, y: n.y - 20 }}
                  transition={{ duration: 0.4, delay: n.delay + 0.1 }}
                >
                  {n.label}
                </motion.text>
              </g>
            ))}
          </svg>
        </div>
      </div>
    </section>
  );
}
