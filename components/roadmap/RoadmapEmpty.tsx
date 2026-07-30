"use client";

import { Map, Zap, AlertCircle } from "lucide-react";
import Button from "@/components/ui/Button";
import { useState } from "react";

interface RoadmapEmptyProps {
  onGenerate: () => Promise<void>;
  isLoading?: boolean;
  error?: string | null;
}

export default function RoadmapEmpty({ onGenerate, isLoading, error: initialError }: RoadmapEmptyProps) {
  const [error, setError] = useState<string | null>(initialError || null);

  const handleGenerate = async () => {
    setError(null);
    try {
      await onGenerate();
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to generate roadmap";
      setError(message);
      console.error("[RoadmapEmpty] Generation error:", err);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
      <div className="mb-6 p-4 bg-primary-100 rounded-full">
        <Map size={32} className="text-primary-600" />
      </div>

      <h2 className="text-2xl font-display font-semibold text-ink mb-2">
        No roadmap yet
      </h2>

      <p className="text-muted max-w-sm mb-6 leading-relaxed">
        We'll create a personalized learning path based on your profile. Your roadmap will be tailored to your goal, skills, and learning style.
      </p>

      {error && (
        <div className="max-w-sm mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex gap-3">
          <AlertCircle size={18} className="text-red-600 shrink-0 mt-0.5" />
          <div>
            <p className="text-sm text-red-800 text-left font-medium mb-2">{error}</p>
            {error.includes("User profile not found") && (
              <p className="text-xs text-red-700 text-left">
                ℹ️ Please complete your profile first to generate a personalized roadmap. Visit the Profile page to add your career goal, skills, and interests.
              </p>
            )}
          </div>
        </div>
      )}

      <Button
        onClick={handleGenerate}
        disabled={isLoading}
        size="lg"
      >
        <Zap size={18} />
        {isLoading ? "Generating..." : "Generate Your Roadmap"}
      </Button>

      <div className="mt-8 pt-8 border-t border-border max-w-sm">
        <p className="text-xs font-medium text-muted uppercase tracking-wide mb-3">What you'll get</p>
        <ul className="text-sm text-muted space-y-2">
          <li className="flex items-start gap-2">
            <span className="text-primary-600 mt-0.5">✓</span>
            <span>Personalized learning path matched to your goals</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-primary-600 mt-0.5">✓</span>
            <span>10+ curated steps with detailed content</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-primary-600 mt-0.5">✓</span>
            <span>Progress tracking and completion milestones</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-primary-600 mt-0.5">✓</span>
            <span>Mini projects and practice exercises</span>
          </li>
        </ul>
      </div>
    </div>
  );
}
