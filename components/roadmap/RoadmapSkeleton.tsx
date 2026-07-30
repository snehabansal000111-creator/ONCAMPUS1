"use client";

import { motion } from "framer-motion";

export default function RoadmapSkeleton() {
  return (
    <div className="space-y-5">
      {/* Progress skeleton */}
      <div className="p-6 bg-white border border-border rounded-2xl">
        <div className="h-4 bg-slate-200 rounded w-32 mb-3 animate-pulse" />
        <div className="h-8 bg-slate-200 rounded w-48 mb-4 animate-pulse" />
        <div className="h-2 bg-slate-200 rounded-full w-full animate-pulse" />
      </div>

      {/* Continue Learning skeleton */}
      <div className="p-4 bg-slate-50 border border-border rounded-2xl">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1">
            <div className="h-4 bg-slate-200 rounded w-32 mb-2 animate-pulse" />
            <div className="h-4 bg-slate-200 rounded w-48 animate-pulse" />
          </div>
          <div className="h-10 w-40 bg-slate-200 rounded-lg animate-pulse shrink-0" />
        </div>
      </div>

      {/* Main detail skeleton */}
      <div className="p-6 bg-white border border-border rounded-2xl space-y-4">
        <div className="h-6 bg-slate-200 rounded w-64 animate-pulse" />
        <div className="space-y-2">
          <div className="h-4 bg-slate-200 rounded w-full animate-pulse" />
          <div className="h-4 bg-slate-200 rounded w-5/6 animate-pulse" />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="h-24 bg-slate-200 rounded animate-pulse" />
          <div className="h-24 bg-slate-200 rounded animate-pulse" />
        </div>
      </div>

      {/* Timeline skeleton */}
      <div className="p-6 bg-white border border-border rounded-2xl space-y-4">
        <div className="h-6 bg-slate-200 rounded w-48 animate-pulse" />
        <div className="space-y-3">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="h-12 bg-slate-100 rounded animate-pulse" />
          ))}
        </div>
      </div>
    </div>
  );
}
