"use client";

import { useState, useEffect } from "react";
import { roadmapAPI } from "@/lib/roadmap-client";
import type { RoadmapItem } from "@/types";

export function useRoadmap(userId?: string) {
  const [roadmap, setRoadmap] = useState<RoadmapItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    console.log("[useRoadmap] Hook called with userId:", userId);

    if (!userId) {
      console.log("[useRoadmap] No userId, clearing roadmap");
      setLoading(false);
      setRoadmap([]);
      return;
    }

    const fetchRoadmap = async () => {
      try {
        console.log("[useRoadmap] Fetching roadmap for userId:", userId);
        setLoading(true);
        setError(null);
        const data = await roadmapAPI.getRoadmap(userId);
        console.log("[useRoadmap] Received roadmap:", data);
        setRoadmap(data || []);
        if (!data || data.length === 0) {
          console.log("[useRoadmap] No roadmap yet - user can generate one");
          setError(null);
        }
      } catch (err) {
        const message =
          err instanceof Error ? err.message : "Failed to load roadmap";
        console.error("[useRoadmap] Error:", message);
        setError(message);
        setRoadmap([]);
      } finally {
        setLoading(false);
      }
    };

    fetchRoadmap();
  }, [userId]);

  const updateItemStatus = async (
    itemId: string,
    status: "done" | "in-progress" | "upcoming"
  ) => {
    if (!userId) {
      throw new Error("User not authenticated");
    }

    try {
      console.log(
        `[useRoadmap] Updating item ${itemId} status to ${status}`
      );
      await roadmapAPI.updateItemStatus(userId, itemId, status);

      // Update local state
      setRoadmap((prev) =>
        prev.map((item) =>
          item.id === itemId ? { ...item, status } : item
        )
      );

      console.log("[useRoadmap] Item status updated successfully");
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Failed to update item";
      console.error("[useRoadmap] Error updating item:", message);
      throw err;
    }
  };

  const generateRoadmap = async () => {
    if (!userId) {
      throw new Error("User not authenticated");
    }

    try {
      console.log("[useRoadmap] Generating personalized roadmap");
      setLoading(true);
      const data = await roadmapAPI.generateRoadmap(userId);
      console.log("[useRoadmap] Roadmap generated:", data);
      setRoadmap(data);
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Failed to generate roadmap";
      console.error("[useRoadmap] Error generating roadmap:", message);
      setError(message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    roadmap,
    loading,
    error,
    updateItemStatus,
    generateRoadmap,
  };
}
