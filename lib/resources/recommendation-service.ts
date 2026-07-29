import { createClient } from "@/lib/supabase/server";
import { getRecommendedResources } from "./curated-resources";
import type { Resource, ResourceRecommendation } from "@/types";

/**
 * Generates personalized resource recommendations based on student profile.
 * Uses curated resource database - no random recommendations.
 *
 * @param topic - Topic to get resources for (e.g., "Web Development", "React")
 * @param careerGoal - Student's career goal (e.g., "frontend", "backend")
 * @param skillLevel - Current skill level (beginner, intermediate, advanced)
 * @param roadmapStage - Current learning stage (beginner, intermediate, advanced)
 * @returns Array of recommended resources filtered and ranked by relevance
 */
export function getResourceRecommendations(
  topic: string,
  careerGoal: string,
  skillLevel: string,
  roadmapStage: string
): Resource[] {
  if (!topic || topic.trim().length === 0) {
    return [];
  }

  // Get filtered resources from curated database
  const resources = getRecommendedResources(
    topic,
    careerGoal,
    skillLevel,
    roadmapStage
  );

  // Limit to top 10 recommendations
  return resources.slice(0, 10);
}

/**
 * Saves resource recommendations to Supabase for later access.
 *
 * @param userId - Authenticated user's ID
 * @param topic - Topic recommendations are for
 * @param careerGoal - Career goal context
 * @param skillLevel - Skill level context
 * @param roadmapStage - Roadmap stage context
 * @param resources - Array of recommended resources
 * @returns Saved recommendation record
 */
export async function saveResourceRecommendations(
  userId: string,
  topic: string,
  careerGoal: string,
  skillLevel: string,
  roadmapStage: string,
  resources: Resource[]
): Promise<ResourceRecommendation> {
  if (!userId) {
    throw new Error("User ID is required");
  }

  if (!topic || topic.trim().length === 0) {
    throw new Error("Topic is required");
  }

  try {
    const supabase = await createClient();

    const { data, error } = await supabase
      .from("resource_recommendations")
      .insert({
        user_id: userId,
        topic,
        career_goal: careerGoal,
        skill_level: skillLevel,
        roadmap_stage: roadmapStage,
        resources,
      })
      .select()
      .single();

    if (error) {
      throw new Error(`Failed to save recommendations: ${error.message}`);
    }

    if (!data) {
      throw new Error("Failed to save recommendations");
    }

    return {
      id: data.id,
      user_id: data.user_id,
      topic: data.topic,
      career_goal: data.career_goal,
      skill_level: data.skill_level,
      roadmap_stage: data.roadmap_stage,
      resources: data.resources,
      created_at: data.created_at,
      updated_at: data.updated_at,
    };
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    }
    throw new Error("Unexpected error saving recommendations");
  }
}

/**
 * Retrieves saved resource recommendations for a topic.
 *
 * @param userId - User ID
 * @param topic - Topic to retrieve recommendations for
 * @returns Saved recommendations or null if not found
 */
export async function getSavedRecommendations(
  userId: string,
  topic: string
): Promise<ResourceRecommendation | null> {
  if (!userId || !topic) {
    throw new Error("User ID and topic are required");
  }

  try {
    const supabase = await createClient();

    const { data, error } = await supabase
      .from("resource_recommendations")
      .select("*")
      .eq("user_id", userId)
      .eq("topic", topic)
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle();

    if (error) {
      throw new Error(`Failed to fetch recommendations: ${error.message}`);
    }

    if (!data) {
      return null;
    }

    return {
      id: data.id,
      user_id: data.user_id,
      topic: data.topic,
      career_goal: data.career_goal,
      skill_level: data.skill_level,
      roadmap_stage: data.roadmap_stage,
      resources: data.resources,
      created_at: data.created_at,
      updated_at: data.updated_at,
    };
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    }
    throw new Error("Unexpected error retrieving recommendations");
  }
}

/**
 * Gets all saved recommendation history for a user.
 *
 * @param userId - User ID
 * @returns Array of all saved recommendations
 */
export async function getUserRecommendationHistory(
  userId: string
): Promise<ResourceRecommendation[]> {
  if (!userId) {
    throw new Error("User ID is required");
  }

  try {
    const supabase = await createClient();

    const { data, error } = await supabase
      .from("resource_recommendations")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false });

    if (error) {
      throw new Error(`Failed to fetch history: ${error.message}`);
    }

    if (!data) {
      return [];
    }

    return data.map((r) => ({
      id: r.id,
      user_id: r.user_id,
      topic: r.topic,
      career_goal: r.career_goal,
      skill_level: r.skill_level,
      roadmap_stage: r.roadmap_stage,
      resources: r.resources,
      created_at: r.created_at,
      updated_at: r.updated_at,
    }));
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    }
    throw new Error("Unexpected error retrieving recommendation history");
  }
}
