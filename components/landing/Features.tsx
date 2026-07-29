"use client";

import { motion } from "framer-motion";
import { UserRoundCog, BrainCircuit, Users, Wallet, LayoutDashboard } from "lucide-react";

const features = [
  {
    icon: UserRoundCog,
    title: "AI Student Profiling",
    desc: "A short, interactive onboarding reads your background, skills, goals, and learning style — once.",
  },
  {
    icon: BrainCircuit,
    title: "Personalized Learning Assistant",
    desc: "Roadmaps, weekly plans, and quizzes generated from your profile — not a generic course list.",
  },
  {
    icon: Users,
    title: "Mentor & Alumni Connect",
    desc: "Seniors matched by branch, interests, and goals, with a compatibility score and session booking.",
  },
  {
    icon: Wallet,
    title: "AI Expense Tracker",
    desc: "Auto-categorized spending, saving suggestions, and a forecast for the rest of the month.",
  },
  {
    icon: LayoutDashboard,
    title: "One Progress Dashboard",
    desc: "Learning, roadmap, and career readiness — the whole picture on a single screen.",
  },
];

export default function Features() {
  return (
    <section id="features" className="section-pad py-20 md:py-28">
      <div className="mx-auto max-w-2xl text-center">
        <span className="text-sm font-medium text-primary-600">What you get</span>
        <h2 className="mt-3 text-3xl md:text-4xl font-display font-semibold text-ink">
          Five systems, one student profile
        </h2>
        <p className="mt-4 text-muted">
          Every feature reads from the same profile, so recommendations stay consistent
          as your journey unfolds.
        </p>
      </div>

      <div className="mt-14 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 max-w-6xl mx-auto">
        {features.map((f, i) => (
          <motion.div
            key={f.title}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.5, delay: (i % 3) * 0.08 }}
            className={`glass-card p-6 hover:shadow-lift transition-shadow duration-300 ${
              i === 0 ? "lg:col-span-2" : ""
            }`}
          >
            <div className="grid h-11 w-11 place-items-center rounded-xl2 bg-gradient-primary text-white">
              <f.icon size={20} />
            </div>
            <h3 className="mt-4 font-display font-semibold text-lg text-ink">{f.title}</h3>
            <p className="mt-2 text-sm text-muted leading-relaxed">{f.desc}</p>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
