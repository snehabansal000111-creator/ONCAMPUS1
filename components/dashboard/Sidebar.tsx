"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Compass, LayoutDashboard, Map, Users, Wallet, User, Bot } from "lucide-react";
import { cn } from "@/lib/utils";

const items = [
  { href: "/dashboard", label: "Home", icon: LayoutDashboard },
  { href: "/dashboard/roadmap", label: "Roadmap", icon: Map },
  { href: "/dashboard/assistant", label: "AI Assistant", icon: Bot },
  { href: "/dashboard/mentors", label: "Mentors", icon: Users },
  { href: "/dashboard/expenses", label: "Expense Tracker", icon: Wallet },
  { href: "/dashboard/profile", label: "Profile", icon: User },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="hidden md:flex md:w-64 shrink-0 flex-col border-r border-border bg-white/70 backdrop-blur-xl min-h-screen sticky top-0 py-6 px-4">
      <Link href="/dashboard" className="flex items-center gap-2 font-display font-semibold text-lg px-2">
        <span className="grid h-8 w-8 place-items-center rounded-xl2 bg-gradient-primary text-white">
          <Compass size={18} />
        </span>
        ONCampus
      </Link>

      <nav className="mt-8 flex flex-col gap-1">
        {items.map((item) => {
          const active = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-xl2 text-sm font-medium transition-colors",
                active
                  ? "bg-primary-50 text-primary-700"
                  : "text-muted hover:bg-slate-100 hover:text-ink"
              )}
            >
              <item.icon size={18} />
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="mt-auto glass-card p-4 mx-1">
        <p className="text-xs font-medium text-ink">Career readiness</p>
        <p className="text-2xl font-display font-semibold text-primary-600 mt-1">68%</p>
        <p className="text-xs text-muted mt-1">Keep going — 3 roadmap items left this month.</p>
      </div>
    </aside>
  );
}
