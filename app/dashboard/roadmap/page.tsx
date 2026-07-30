"use client";

import { useState, useEffect, useMemo } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useRoadmap } from "@/hooks/useRoadmap";
import TopBar from "@/components/dashboard/TopBar";
import Card from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";
import Button from "@/components/ui/Button";
import ProgressBar from "@/components/ui/ProgressBar";
import RoadmapFilters, { FilterState } from "@/components/roadmap/RoadmapFilters";
import RoadmapSkeleton from "@/components/roadmap/RoadmapSkeleton";
import RoadmapEmpty from "@/components/roadmap/RoadmapEmpty";
import AnimatedProgressBar from "@/components/roadmap/AnimatedProgressBar";
import SuccessAnimation from "@/components/roadmap/SuccessAnimation";
import { motion, AnimatePresence } from "framer-motion";
import {
  CheckCircle2,
  Circle,
  Clock,
  ChevronDown,
  ChevronUp,
  ArrowRight,
  ArrowLeft,
  BookOpen,
  Zap,
} from "lucide-react";
import type { RoadmapItem } from "@/types";

export default function RoadmapPage() {
  const { user, loading: authLoading } = useAuth();
  const {
    roadmap,
    loading: roadmapLoading,
    error,
    updateItemStatus,
    generateRoadmap,
  } = useRoadmap(user?.uid);

  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isUpdating, setIsUpdating] = useState(false);
  const [filters, setFilters] = useState<FilterState>({
    search: "",
    status: "all",
    difficulty: "all",
  });
  const [showSuccess, setShowSuccess] = useState(false);
  const [successTitle, setSuccessTitle] = useState("");

  // Find next unstarted item on mount
  useEffect(() => {
    if (roadmap.length > 0) {
      const upcomingIndex = roadmap.findIndex((item) => item.status === "upcoming");
      setCurrentIndex(upcomingIndex > -1 ? upcomingIndex : 0);
    }
  }, [roadmap]);

  // Filter roadmap items
  const filteredRoadmap = useMemo(() => {
    if (!roadmap) return [];
    return roadmap.filter((item) => {
      // Search filter
      if (filters.search) {
        const search = filters.search.toLowerCase();
        const matchesTitle = item.title.toLowerCase().includes(search);
        const matchesConcepts =
          item.conceptsToLearn?.some((c) =>
            c.toLowerCase().includes(search)
          ) || false;
        if (!matchesTitle && !matchesConcepts) return false;
      }

      // Status filter
      if (filters.status !== "all" && item.status !== filters.status) {
        return false;
      }

      // Difficulty filter
      if (
        filters.difficulty !== "all" &&
        item.difficulty !== filters.difficulty
      ) {
        return false;
      }

      return true;
    });
  }, [roadmap, filters]);

  if (authLoading || roadmapLoading) {
    return (
      <>
        <TopBar title="Roadmap" />
        <RoadmapSkeleton />
      </>
    );
  }

  if (error || !roadmap || roadmap.length === 0) {
    return (
      <>
        <TopBar title="Roadmap" />
        <Card>
          <RoadmapEmpty onGenerate={generateRoadmap} isLoading={roadmapLoading} error={error} />
        </Card>
      </>
    );
  }

  const completedCount = roadmap.filter((item) => item.status === "done").length;
  const progressPercent = (completedCount / roadmap.length) * 100;
  const currentItem = roadmap[currentIndex];
  const nextItem = roadmap[currentIndex + 1];
  const prevItem = currentIndex > 0 ? roadmap[currentIndex - 1] : null;

  const handleMarkComplete = async (itemId: string) => {
    setIsUpdating(true);
    try {
      const item = roadmap.find((r) => r.id === itemId);
      await updateItemStatus(itemId, "done");
      // Show success animation
      setSuccessTitle(item?.title || "Step");
      setShowSuccess(true);
    } finally {
      setIsUpdating(false);
    }
  };

  const handleStartItem = async (itemId: string) => {
    setIsUpdating(true);
    try {
      await updateItemStatus(itemId, "in-progress");
    } finally {
      setIsUpdating(false);
    }
  };

  const handleNextStep = () => {
    if (currentIndex < roadmap.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setExpandedId(null);
    }
  };

  const handlePrevStep = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
      setExpandedId(null);
    }
  };

  const handleContinueLearning = async () => {
    const nextUpcoming = roadmap.find((item) => item.status === "upcoming");
    if (nextUpcoming) {
      setIsUpdating(true);
      try {
        await handleStartItem(nextUpcoming.id);
        const index = roadmap.findIndex((item) => item.id === nextUpcoming.id);
        setCurrentIndex(index);
        setExpandedId(nextUpcoming.id);
      } finally {
        setIsUpdating(false);
      }
    }
  };

  return (
    <>
      <TopBar title="Roadmap" />

      {/* Progress Overview */}
      <Card>
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
          <div>
            <p className="text-xs text-muted uppercase tracking-wide font-medium">Overall Progress</p>
            <p className="text-2xl font-display font-semibold mt-1">
              {completedCount}/{roadmap.length} steps completed
            </p>
          </div>
          <div className="text-right">
            <p className="text-3xl font-display font-semibold text-primary-600">
              {Math.round(progressPercent)}%
            </p>
          </div>
        </div>
        <AnimatedProgressBar value={completedCount} max={roadmap.length} />
      </Card>

      {/* Filters */}
      <Card className="mt-5">
        <RoadmapFilters onFilterChange={setFilters} />
      </Card>

      {/* Continue Learning Card */}
      {roadmap.some((item) => item.status === "upcoming") && (
        <motion.div
          initial={{ opacity: 0, y: -12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <Card className="mt-5 bg-gradient-primary/5 border border-primary-200">
            <div className="flex flex-col sm:flex-row sm:items-center gap-4">
              <div className="flex items-start gap-3 flex-1">
                <Zap size={20} className="text-primary-600 shrink-0 mt-0.5" />
                <div className="min-w-0">
                  <h3 className="font-semibold text-ink">Ready to continue?</h3>
                  <p className="text-sm text-muted mt-1">
                    Start the next step in your learning journey
                  </p>
                </div>
              </div>
              <Button
                onClick={handleContinueLearning}
                disabled={isUpdating}
                className="shrink-0 w-full sm:w-auto"
              >
                <BookOpen size={16} />
                Continue Learning
              </Button>
            </div>
          </Card>
        </motion.div>
      )}

      {/* Current Step Detail View */}
      {currentItem && (
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <Card className="mt-5">
            <div className="flex flex-col sm:flex-row items-start justify-between gap-4 mb-4">
              <div className="flex-1 w-full">
                <div className="flex flex-wrap items-center gap-2 mb-3">
                  <Badge tone={currentItem.status === "done" ? "success" : "primary"}>
                    Step {currentIndex + 1} of {roadmap.length}
                  </Badge>
                  {currentItem.estimatedDuration && (
                    <Badge tone="neutral">
                      <Clock size={12} className="inline mr-1" />
                      {currentItem.estimatedDuration}
                    </Badge>
                  )}
                </div>
                <h2 className="text-lg sm:text-xl md:text-2xl font-display font-semibold pr-2">{currentItem.title}</h2>
                {currentItem.difficulty && (
                  <p className="text-sm text-muted mt-2">Difficulty: <span className="font-medium capitalize">{currentItem.difficulty}</span></p>
                )}
              </div>
              <div className="flex gap-2 self-start sm:self-auto shrink-0">
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => handlePrevStep()}
                  disabled={currentIndex === 0}
                  className="px-3"
                >
                  <ArrowLeft size={14} />
                </Button>
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => handleNextStep()}
                  disabled={currentIndex === roadmap.length - 1}
                  className="px-3"
                >
                  <ArrowRight size={14} />
                </Button>
              </div>
            </div>

          {/* Description and Details */}
          {currentItem.description && (
            <div className="mb-4 pb-4 border-b border-border">
              <p className="text-sm text-ink leading-relaxed">{currentItem.description}</p>
            </div>
          )}

          {/* Why It Matters */}
          {currentItem.whyItMatters && (
            <div className="mb-4 p-3 bg-blue-50 rounded-lg border border-blue-100">
              <p className="text-sm font-medium text-blue-900 mb-1">Why it matters</p>
              <p className="text-sm text-blue-800">{currentItem.whyItMatters}</p>
            </div>
          )}

          {/* Concepts and Objectives */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-4">
            {currentItem.conceptsToLearn && currentItem.conceptsToLearn.length > 0 && (
              <div>
                <h4 className="font-medium text-sm mb-2">Concepts to Learn</h4>
                <ul className="text-sm text-muted space-y-1">
                  {currentItem.conceptsToLearn.map((concept, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <span className="text-primary-600 mt-1">•</span>
                      <span>{concept}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
            {currentItem.learningObjectives && currentItem.learningObjectives.length > 0 && (
              <div>
                <h4 className="font-medium text-sm mb-2">Learning Objectives</h4>
                <ul className="text-sm text-muted space-y-1">
                  {currentItem.learningObjectives.map((obj, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <span className="text-success mt-1">✓</span>
                      <span>{obj}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {/* Mini Project */}
          {currentItem.miniProject && (
            <div className="mb-4 p-4 bg-amber-50 rounded-lg border border-amber-100">
              <h4 className="font-medium text-sm text-amber-900 mb-2">
                📁 Mini Project: {currentItem.miniProject.title}
              </h4>
              <p className="text-sm text-amber-800 mb-3">{currentItem.miniProject.description}</p>
              {currentItem.miniProject.steps && (
                <ol className="text-sm text-amber-800 space-y-1 list-decimal list-inside">
                  {currentItem.miniProject.steps.map((step, i) => (
                    <li key={i}>{step}</li>
                  ))}
                </ol>
              )}
            </div>
          )}

          {/* Practice Tasks */}
          {currentItem.practiceTasks && currentItem.practiceTasks.length > 0 && (
            <div className="mb-4">
              <h4 className="font-medium text-sm mb-2">Practice Tasks</h4>
              <div className="space-y-2">
                {currentItem.practiceTasks.map((task, i) => (
                  <div key={i} className="flex items-center gap-2 text-sm">
                    <Badge
                      tone={
                        task.difficulty === "hard"
                          ? "danger"
                          : task.difficulty === "medium"
                            ? "warning"
                            : "success"
                      }
                      className="shrink-0"
                    >
                      {task.difficulty}
                    </Badge>
                    <span className="text-muted">{task.task}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Resources */}
          {currentItem.freeResources && currentItem.freeResources.length > 0 && (
            <div className="mb-4">
              <h4 className="font-medium text-sm mb-2">Free Learning Resources</h4>
              <div className="space-y-2">
                {currentItem.freeResources.map((resource, i) => (
                  <a
                    key={i}
                    href={resource.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-start gap-3 p-2 rounded-lg hover:bg-border transition-colors"
                  >
                    <span className="text-lg shrink-0">
                      {resource.type === "video"
                        ? "▶️"
                        : resource.type === "documentation"
                          ? "📚"
                          : resource.type === "interactive"
                            ? "🎮"
                            : resource.type === "book"
                              ? "📖"
                              : "📄"}
                    </span>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-ink hover:text-primary-600">
                        {resource.title}
                      </p>
                      {resource.description && (
                        <p className="text-xs text-muted mt-0.5">{resource.description}</p>
                      )}
                    </div>
                    <ArrowRight size={14} className="text-muted shrink-0 mt-0.5" />
                  </a>
                ))}
              </div>
            </div>
          )}

          {/* Completion Checklist */}
          {currentItem.completionChecklist && currentItem.completionChecklist.length > 0 && (
            <div className="mb-4 p-3 bg-green-50 rounded-lg border border-green-100">
              <h4 className="font-medium text-sm text-green-900 mb-2">Completion Checklist</h4>
              <ul className="text-sm text-green-800 space-y-1">
                {currentItem.completionChecklist.map((item, i) => (
                  <li key={i}>{item}</li>
                ))}
              </ul>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex gap-2 flex-wrap mt-6">
            {currentItem.status === "upcoming" ? (
              <Button
                onClick={() => handleStartItem(currentItem.id)}
                disabled={isUpdating}
              >
                Start Learning
              </Button>
            ) : currentItem.status === "in-progress" ? (
              <Button
                onClick={() => handleMarkComplete(currentItem.id)}
                disabled={isUpdating}
                variant="primary"
              >
                Mark as Complete
              </Button>
            ) : null}
          </div>
        </Card>
        </motion.div>
      )}

      {/* Full Roadmap Timeline */}
      <Card className="mt-5">
        <div className="flex items-center justify-between mb-6">
          <h3 className="font-display font-semibold text-ink">Full Learning Path</h3>
          {filteredRoadmap.length < roadmap.length && (
            <Badge tone="neutral">
              {filteredRoadmap.length}/{roadmap.length}
            </Badge>
          )}
        </div>

        {filteredRoadmap.length === 0 ? (
          <div className="py-8 text-center">
            <p className="text-muted mb-2">No steps match your filters</p>
            <p className="text-xs text-muted">Try adjusting your search or filters</p>
          </div>
        ) : (
          <div className="relative pl-8">
            <div className="absolute left-[11px] top-2 bottom-2 w-px bg-border" />
            <div className="space-y-4">
              <AnimatePresence>
                {filteredRoadmap.map((item) => {
                  const actualIndex = roadmap.findIndex((r) => r.id === item.id);
                  return (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, x: -12 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 12 }}
                  transition={{ duration: 0.3 }}
                  className="relative"
                >
                  <button
                    onClick={() =>
                      setExpandedId(expandedId === item.id ? null : item.id)
                    }
                    className="w-full text-left"
                  >
                    <span
                      className={`absolute -left-8 top-0.5 grid h-6 w-6 place-items-center rounded-full transition-all ${
                        item.status === "done"
                          ? "bg-success text-white"
                          : item.status === "in-progress"
                            ? "bg-gradient-primary text-white"
                            : actualIndex === currentIndex
                              ? "bg-primary-100 border-2 border-primary-600"
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
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex-1">
                        <p
                          className={`font-medium ${
                            item.status === "done"
                              ? "text-muted line-through"
                              : "text-ink"
                          }`}
                        >
                          {item.title}
                        </p>
                        {item.estimatedDuration && (
                          <p className="text-xs text-muted mt-0.5">
                            {item.estimatedDuration}
                          </p>
                        )}
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge
                          tone={
                            item.status === "in-progress"
                              ? "primary"
                              : item.status === "done"
                                ? "success"
                                : "neutral"
                          }
                        >
                          {item.status === "in-progress"
                            ? "In progress"
                            : item.status === "done"
                              ? "Done"
                              : "Upcoming"}
                        </Badge>
                        {expandedId === item.id ? (
                          <ChevronUp size={14} className="text-muted" />
                        ) : (
                          <ChevronDown size={14} className="text-muted" />
                        )}
                      </div>
                    </div>
                  </button>

                  {/* Expanded Details */}
                  <AnimatePresence>
                    {expandedId === item.id && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.2 }}
                        className="mt-3 pt-3 border-t border-border ml-0"
                      >
                        {item.description && (
                          <p className="text-sm text-muted mb-2">{item.description}</p>
                        )}
                        {item.difficulty && (
                          <p className="text-xs text-muted mb-2">
                            Difficulty: <span className="font-medium">{item.difficulty}</span>
                          </p>
                        )}
                        {item.conceptsToLearn && (
                          <div className="text-sm mb-2">
                            <p className="font-medium text-ink mb-1">Concepts:</p>
                            <p className="text-muted">{item.conceptsToLearn.join(", ")}</p>
                          </div>
                        )}
                        <div className="flex gap-2 mt-3">
                          {item.status === "upcoming" && (
                            <Button
                              size="sm"
                              onClick={() => handleStartItem(item.id)}
                              disabled={isUpdating}
                            >
                              Start
                            </Button>
                          )}
                          {item.status === "in-progress" && (
                            <Button
                              size="sm"
                              onClick={() => handleMarkComplete(item.id)}
                              disabled={isUpdating}
                              variant="primary"
                            >
                              Complete
                            </Button>
                          )}
                          <Button
                            size="sm"
                            variant="secondary"
                            onClick={() => {
                              setCurrentIndex(actualIndex);
                              setExpandedId(null);
                            }}
                          >
                            View Full
                          </Button>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
                  );
                })}
              </AnimatePresence>
            </div>
          </div>
        )}
      </Card>

      {/* Success Animation */}
      <SuccessAnimation
        isVisible={showSuccess}
        title={successTitle}
        onComplete={() => setShowSuccess(false)}
      />
    </>
  );
}
