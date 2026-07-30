"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";

interface AnimatedProgressBarProps {
  value: number;
  max: number;
  showLabel?: boolean;
}

export default function AnimatedProgressBar({
  value,
  max,
  showLabel = true,
}: AnimatedProgressBarProps) {
  const [displayValue, setDisplayValue] = useState(0);
  const percentage = (value / max) * 100;

  // Animate to target value
  useEffect(() => {
    const timer = setTimeout(() => {
      setDisplayValue(value);
    }, 100);
    return () => clearTimeout(timer);
  }, [value]);

  const displayPercentage = (displayValue / max) * 100;

  return (
    <div>
      <div className="relative h-3 bg-slate-100 rounded-full overflow-hidden">
        {/* Animated fill */}
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${displayPercentage}%` }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="h-full bg-gradient-to-r from-primary-500 to-primary-600 rounded-full"
        />

        {/* Shimmer effect */}
        <motion.div
          animate={{
            x: ["0%", "100%"],
          }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="absolute inset-0 w-1/3 bg-gradient-to-r from-transparent via-white/30 to-transparent"
        />
      </div>

      {showLabel && (
        <div className="flex items-center justify-between mt-2">
          <p className="text-xs font-medium text-muted">
            {displayValue}/{max} completed
          </p>
          <motion.p
            key={displayPercentage}
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="text-sm font-semibold text-primary-600"
          >
            {Math.round(displayPercentage)}%
          </motion.p>
        </div>
      )}
    </div>
  );
}
