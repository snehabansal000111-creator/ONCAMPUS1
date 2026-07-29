"use client";

import { Bell } from "lucide-react";
import { currentStudent } from "@/lib/mock-data";

export default function TopBar({ title }: { title: string }) {
  const hour = new Date().getHours();
  const greeting = hour < 12 ? "Good morning" : hour < 17 ? "Good afternoon" : "Good evening";
  const firstName = currentStudent.name.split(" ")[0];

  return (
    <div className="flex items-center justify-between py-5">
      <div>
        <p className="text-sm text-muted">{greeting}, {firstName} 👋</p>
        <h1 className="text-2xl font-display font-semibold text-ink mt-0.5">{title}</h1>
      </div>
      <div className="flex items-center gap-3">
        <button aria-label="Notifications" className="relative grid h-10 w-10 place-items-center rounded-full bg-white border border-border hover:border-primary-300 transition-colors">
          <Bell size={18} className="text-muted" />
          <span className="absolute top-2 right-2.5 h-1.5 w-1.5 rounded-full bg-danger" />
        </button>
        <div className="h-10 w-10 rounded-full bg-gradient-primary grid place-items-center text-white text-sm font-medium">
          {currentStudent.name.split(" ").map((n) => n[0]).join("")}
        </div>
      </div>
    </div>
  );
}
