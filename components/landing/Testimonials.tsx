"use client";

import { motion } from "framer-motion";
import { Star } from "lucide-react";

const testimonials = [
  {
    name: "Ananya P.",
    role: "1st Year, ECE",
    quote:
      "I stopped bouncing between YouTube playlists. The roadmap told me exactly what to skip.",
  },
  {
    name: "Rohan D.",
    role: "1st Year, CSE",
    quote:
      "Found a senior in my exact specialization within a day. The compatibility score was spot on.",
  },
  {
    name: "Meher K.",
    role: "2nd Year, Mechanical",
    quote:
      "The expense tracker caught a subscription I forgot about. Saved more in month one than expected.",
  },
];

export default function Testimonials() {
  return (
    <section id="testimonials" className="section-pad py-20 md:py-28">
      <div className="mx-auto max-w-2xl text-center">
        <span className="text-sm font-medium text-primary-600">Early users</span>
        <h2 className="mt-3 text-3xl md:text-4xl font-display font-semibold text-ink">
          Freshers who found their footing faster
        </h2>
      </div>

      <div className="mt-14 grid grid-cols-1 md:grid-cols-3 gap-5 max-w-6xl mx-auto">
        {testimonials.map((t, i) => (
          <motion.div
            key={t.name}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: i * 0.1 }}
            className="glass-card p-6"
          >
            <div className="flex gap-0.5 text-amber-400">
              {Array.from({ length: 5 }).map((_, s) => (
                <Star key={s} size={14} fill="currentColor" strokeWidth={0} />
              ))}
            </div>
            <p className="mt-4 text-sm text-ink leading-relaxed">"{t.quote}"</p>
            <div className="mt-5 flex items-center gap-3">
              <div className="h-9 w-9 rounded-full bg-gradient-primary" />
              <div>
                <p className="text-sm font-medium text-ink">{t.name}</p>
                <p className="text-xs text-muted">{t.role}</p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
