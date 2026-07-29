"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import Button from "@/components/ui/Button";

export default function CTA() {
  return (
    <section className="section-pad py-20 md:py-28">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="relative overflow-hidden rounded-xl3 bg-gradient-primary max-w-5xl mx-auto px-8 py-16 text-center"
      >
        <div className="pointer-events-none absolute -top-10 -right-10 h-56 w-56 rounded-full bg-white/10 blur-3xl" />
        <h2 className="text-3xl md:text-4xl font-display font-semibold text-white">
          Your first year doesn't need to be a guess
        </h2>
        <p className="mt-4 text-white/80 max-w-xl mx-auto">
          Set up your profile in under three minutes and get a roadmap built around you.
        </p>
        <Link href="/signup" className="inline-block mt-8">
          <Button
            variant="outline"
            size="lg"
            className="bg-white border-white text-primary-700 hover:bg-white/90 group"
          >
            Get started free
            <ArrowRight size={18} className="transition-transform group-hover:translate-x-0.5" />
          </Button>
        </Link>
      </motion.div>
    </section>
  );
}
