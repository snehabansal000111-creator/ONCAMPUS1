"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle2 } from "lucide-react";

interface SuccessAnimationProps {
  isVisible: boolean;
  title: string;
  onComplete?: () => void;
}

export default function SuccessAnimation({
  isVisible,
  title,
  onComplete,
}: SuccessAnimationProps) {
  useEffect(() => {
    if (isVisible && onComplete) {
      const timer = setTimeout(onComplete, 3000);
      return () => clearTimeout(timer);
    }
  }, [isVisible, onComplete]);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: 20, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -20, scale: 0.9 }}
          transition={{ type: "spring", duration: 0.5 }}
          className="fixed inset-0 flex items-center justify-center pointer-events-none z-50 px-4"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0 }}
            transition={{ type: "spring", delay: 0.1, duration: 0.4 }}
            className="bg-success/10 border border-success rounded-2xl px-6 py-4 flex items-center gap-3 pointer-events-auto"
          >
            <motion.div
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ type: "spring", delay: 0.2, duration: 0.5 }}
            >
              <CheckCircle2 size={24} className="text-success" />
            </motion.div>
            <div>
              <p className="text-sm font-medium text-success">Step completed!</p>
              <p className="text-xs text-success/70">{title}</p>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
