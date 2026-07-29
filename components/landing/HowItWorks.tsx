"use client";

import { motion } from "framer-motion";

const steps = [
  { title: "Tell it about you", desc: "Branch, skills, goals, budget, and how you like to learn." },
  { title: "Get your roadmap", desc: "A sequenced plan of what to learn next, and what to skip." },
  { title: "Connect & track", desc: "Meet the right mentors and keep spending in check as you go." },
];

export default function HowItWorks() {
  return (
    <section id="how-it-works" className="section-pad py-20 md:py-28 bg-white/60 border-y border-border">
      <div className="mx-auto max-w-2xl text-center">
        <span className="text-sm font-medium text-primary-600">The flow</span>
        <h2 className="mt-3 text-3xl md:text-4xl font-display font-semibold text-ink">
          Three steps to a plan that's actually yours
        </h2>
      </div>

      <div className="mt-14 grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto relative">
        <div className="hidden md:block absolute top-6 left-[16.6%] right-[16.6%] h-px bg-gradient-path" />
        {steps.map((s, i) => (
          <motion.div
            key={s.title}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: i * 0.1 }}
            className="relative text-center md:text-left"
          >
            <div className="mx-auto md:mx-0 grid h-12 w-12 place-items-center rounded-full bg-white border-2 border-primary-500 font-display font-semibold text-primary-600 relative z-10">
              {i + 1}
            </div>
            <h3 className="mt-4 font-display font-semibold text-lg text-ink">{s.title}</h3>
            <p className="mt-2 text-sm text-muted">{s.desc}</p>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
