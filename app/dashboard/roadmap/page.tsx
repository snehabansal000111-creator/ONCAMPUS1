"use client";

import TopBar from "@/components/dashboard/TopBar";
import Card from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";
import { motion } from "framer-motion";
import { CheckCircle2, Circle, Clock } from "lucide-react";
import { roadmap } from "@/lib/mock-data";

export default function RoadmapPage() {
  return (
    <>
      <TopBar title="Roadmap" />
      <Card>
        <p className="text-sm text-muted mb-6">
          Sequenced for your background and goal — completed steps are skipped automatically next time the AI replans.
        </p>
        <div className="relative pl-8">
          <div className="absolute left-[11px] top-2 bottom-2 w-px bg-border" />
          <div className="space-y-6">
            {roadmap.map((item, i) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, x: -12 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.4, delay: i * 0.05 }}
                className="relative"
              >
                <span
                  className={`absolute -left-8 top-0.5 grid h-6 w-6 place-items-center rounded-full ${
                    item.status === "done"
                      ? "bg-success text-white"
                      : item.status === "in-progress"
                      ? "bg-gradient-primary text-white"
                      : "bg-white border border-border text-faint"
                  }`}
                >
                  {item.status === "done" ? (
                    <CheckCircle2 size={14} />
                  ) : item.status === "in-progress" ? (
                    <Clock size={12} />
                  ) : (
                    <Circle size={10} />
                  )}
                </span>
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <p className={`font-medium ${item.status === "done" ? "text-muted line-through" : "text-ink"}`}>
                    {item.title}
                  </p>
                  <Badge tone={item.status === "in-progress" ? "primary" : item.status === "done" ? "success" : "neutral"}>
                    {item.status === "in-progress" ? "In progress" : item.status === "done" ? "Done" : "Upcoming"}
                  </Badge>
                </div>
                <p className="text-xs text-muted mt-1">{item.category}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </Card>
    </>
  );
}
