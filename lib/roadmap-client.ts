import type { RoadmapItem } from "@/types";

const API_BASE = "/api";

/**
 * Roadmap API Client
 */
export const roadmapAPI = {
  /**
   * Get user's roadmap from Firestore
   */
  getRoadmap: async (userId: string): Promise<RoadmapItem[]> => {
    const params = new URLSearchParams({ userId });
    const res = await fetch(`${API_BASE}/roadmap?${params}`, {
      cache: "no-store",
      headers: { "Cache-Control": "no-cache, no-store, must-revalidate" },
    });

    if (res.status === 404) {
      console.log("[API Client] No roadmap exists yet for user");
      return [];
    }

    if (!res.ok) {
      const error = await res.text();
      console.error("[API Client] Get roadmap failed:", error);
      throw new Error("Failed to fetch roadmap");
    }

    const { roadmap } = await res.json();
    return roadmap;
  },

  /**
   * Generate personalized roadmap and save to Firestore
   */
  generateRoadmap: async (userId: string): Promise<RoadmapItem[]> => {
    const res = await fetch(`${API_BASE}/roadmap`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId }),
    });

    if (!res.ok) {
      const error = await res.text();
      console.error("[API Client] Generate roadmap failed:", error);
      throw new Error("Failed to generate roadmap");
    }

    const { roadmap } = await res.json();
    return roadmap;
  },

  /**
   * Update roadmap item status
   */
  updateItemStatus: async (
    userId: string,
    itemId: string,
    status: "done" | "in-progress" | "upcoming"
  ): Promise<void> => {
    const params = new URLSearchParams({ userId, status });
    const res = await fetch(`${API_BASE}/roadmap/${itemId}?${params}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
    });

    if (!res.ok) {
      const error = await res.text();
      console.error("[API Client] Update item status failed:", error);
      throw new Error("Failed to update item status");
    }
  },

  /**
   * Get user's roadmap progress
   */
  getProgress: async (
    userId: string
  ): Promise<{
    userId: string;
    itemId: string;
    itemTitle: string;
    status: "done" | "in-progress" | "upcoming";
    completedAt: string | null;
    startedAt: string;
    updatedAt: string;
  }[]> => {
    const params = new URLSearchParams({ userId });
    const res = await fetch(`${API_BASE}/roadmap/progress?${params}`, {
      cache: "no-store",
      headers: { "Cache-Control": "no-cache, no-store, must-revalidate" },
    });

    if (!res.ok) {
      const error = await res.text();
      console.error("[API Client] Get progress failed:", error);
      throw new Error("Failed to fetch progress");
    }

    const { progress } = await res.json();
    return progress;
  },

  /**
   * Get progress for specific item
   */
  getItemProgress: async (userId: string, itemId: string) => {
    const params = new URLSearchParams({ userId });
    const res = await fetch(
      `${API_BASE}/roadmap/${itemId}/progress?${params}`,
      {
        cache: "no-store",
        headers: { "Cache-Control": "no-cache, no-store, must-revalidate" },
      }
    );

    if (!res.ok) {
      const error = await res.text();
      console.error("[API Client] Get item progress failed:", error);
      throw new Error("Failed to fetch item progress");
    }

    const { progress } = await res.json();
    return progress;
  },
};
