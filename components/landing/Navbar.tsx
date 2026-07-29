"use client";

import Link from "next/link";
import { useState } from "react";
import { motion } from "framer-motion";
import { Menu, X, Compass } from "lucide-react";
import Button from "@/components/ui/Button";

const links = [
  { href: "#features", label: "Features" },
  { href: "#how-it-works", label: "How it works" },
  { href: "#testimonials", label: "Stories" },
  { href: "#faq", label: "FAQ" },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50">
      <div className="section-pad">
        <motion.nav
          initial={{ y: -16, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="mt-4 flex items-center justify-between glass-card px-5 py-3"
        >
          <Link href="/" className="flex items-center gap-2 font-display font-semibold text-lg">
            <span className="grid h-8 w-8 place-items-center rounded-xl2 bg-gradient-primary text-white">
              <Compass size={18} />
            </span>
            ONCampus
          </Link>

          <div className="hidden md:flex items-center gap-8 text-sm font-medium text-muted">
            {links.map((l) => (
              <a key={l.href} href={l.href} className="hover:text-ink transition-colors">
                {l.label}
              </a>
            ))}
          </div>

          <div className="hidden md:flex items-center gap-3">
            <Link href="/login">
              <Button variant="ghost" size="sm">Log in</Button>
            </Link>
            <Link href="/signup">
              <Button variant="primary" size="sm">Get started free</Button>
            </Link>
          </div>

          <button
            aria-label="Toggle menu"
            className="md:hidden p-2 -mr-2"
            onClick={() => setOpen((v) => !v)}
          >
            {open ? <X size={22} /> : <Menu size={22} />}
          </button>
        </motion.nav>

        {open && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            className="md:hidden glass-card mt-2 p-4 flex flex-col gap-3"
          >
            {links.map((l) => (
              <a key={l.href} href={l.href} className="text-sm font-medium text-muted" onClick={() => setOpen(false)}>
                {l.label}
              </a>
            ))}
            <div className="flex gap-2 pt-2">
              <Link href="/login" className="flex-1">
                <Button variant="outline" size="sm" className="w-full">Log in</Button>
              </Link>
              <Link href="/signup" className="flex-1">
                <Button variant="primary" size="sm" className="w-full">Get started</Button>
              </Link>
            </div>
          </motion.div>
        )}
      </div>
    </header>
  );
}
