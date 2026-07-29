"use client";

import TopBar from "@/components/dashboard/TopBar";
import Card from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";
import Button from "@/components/ui/Button";
import { motion } from "framer-motion";
import { Calendar } from "lucide-react";
import { mentors } from "@/lib/mock-data";

export default function MentorsPage() {
  return (
    <>
      <TopBar title="Mentor & Alumni Connect" />
      <p className="text-sm text-muted -mt-2 mb-5">
        Matched by branch, interests, and career goal from your profile.
      </p>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {mentors.map((m, i) => (
          <motion.div
            key={m.id}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: i * 0.06 }}
          >
            <Card className="h-full flex flex-col hover:shadow-lift transition-shadow duration-300">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <img src={m.avatarUrl} alt="" className="h-14 w-14 rounded-full object-cover" />
                  <div>
                    <p className="font-medium text-ink">{m.name}</p>
                    <p className="text-xs text-muted">{m.branch} · {m.year}</p>
                  </div>
                </div>
                <Badge tone="success">{m.compatibility}% match</Badge>
              </div>
              {m.company && <p className="mt-3 text-sm text-primary-700 font-medium">{m.company}</p>}
              <div className="mt-3 flex flex-wrap gap-1.5">
                {m.skills.map((s) => (
                  <Badge key={s} tone="neutral">{s}</Badge>
                ))}
              </div>
              <Button variant="primary" size="sm" className="mt-auto pt-0 w-full !mt-5">
                <Calendar size={14} /> Book a session
              </Button>
            </Card>
          </motion.div>
        ))}
      </div>
    </>
  );
}
