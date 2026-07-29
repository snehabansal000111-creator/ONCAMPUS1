import { createClient } from "./server";
import Anthropic from "@anthropic-ai/sdk";
import type { StudentProfile, Roadmap, RoadmapPhase } from "@/types";

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY || "",
});

/**
 * Response format from Claude for roadmap generation
 */
interface RoadmapResponse {
  topic: string;
  beginner: RoadmapPhase;
  intermediate: RoadmapPhase;
  advanced: RoadmapPhase;
}

/**
 * Generates a personalized learning roadmap using Claude API.
 * Returns 3 phases: Beginner, Intermediate, Advanced.
 *
 * @param profile - Student's profile from onboarding
 * @param topic - Topic/skill to learn (e.g., "Web Development", "Machine Learning")
 * @returns Generated roadmap with 3 phases
 * @throws Error if generation fails
 */
export async function generateRoadmap(
  profile: StudentProfile,
  topic: string
): Promise<RoadmapResponse> {
  if (!topic || topic.trim().length === 0) {
    throw new Error("Topic is required");
  }

  const systemPrompt = `You are an expert learning path designer. Generate a detailed, personalized learning roadmap.

Student Profile:
- Name: ${profile.name}
- Year: ${profile.year}
- Branch: ${profile.branch}
- Current Skills: ${profile.skills.join(", ") || "none"}
- Learning Style: ${profile.learningStyle}
- Career Goal: ${profile.careerGoal}
- Daily Study Hours: ${profile.dailyStudyHours}
- Interests: ${profile.interests.join(", ")}

Your job: Create a 3-phase roadmap for "${topic}" tailored to this student.

CRITICAL: Return ONLY valid JSON (no markdown, no explanation) matching this exact structure:
{
  "topic": "string",
  "beginner": {
    "name": "Beginner",
    "duration": "string (e.g., '4 weeks')",
    "topics": ["topic1", "topic2", ...],
    "milestones": ["milestone1", "milestone2", ...],
    "projects": [
      {"title": "string", "description": "string", "duration": "string (e.g., '5 days')"},
      ...
    ],
    "resources": [
      {"title": "string", "type": "string (e.g., 'video', 'article', 'course')", "url": "optional", "cost": "optional"},
      ...
    ],
    "practice": [
      {"activity": "string", "frequency": "string (e.g., 'daily', '3x per week')"},
      ...
    ]
  },
  "intermediate": { ... same structure ... },
  "advanced": { ... same structure ... }
}`;

  const userPrompt = `Generate a comprehensive 3-phase learning roadmap for "${topic}" for ${profile.name}.

Consider:
- They have ${profile.dailyStudyHours} hours daily to study
- They prefer ${profile.learningStyle} learning
- Their goal is: ${profile.careerGoal}
- They're interested in: ${profile.interests.join(", ")}
- Current skills: ${profile.skills.join(", ") || "foundational"}

Each phase should include specific topics, milestones, hands-on projects, resources (with types and costs), and practice activities.`;

  try {
    const response = await anthropic.messages.create({
      model: "claude-opus-5",
      max_tokens: 4096,
      system: systemPrompt,
      messages: [{ role: "user", content: userPrompt }],
    });

    const textContent = response.content.find((block) => block.type === "text");
    if (!textContent || textContent.type !== "text") {
      throw new Error("No text response from Claude");
    }

    // Parse JSON response
    const jsonText = textContent.text.trim();
    const roadmapData: RoadmapResponse = JSON.parse(jsonText);

    // Validate structure
    if (!roadmapData.beginner || !roadmapData.intermediate || !roadmapData.advanced) {
      throw new Error("Invalid roadmap structure: missing phases");
    }

    // Set phase names if not already set
    roadmapData.beginner.name = "Beginner";
    roadmapData.intermediate.name = "Intermediate";
    roadmapData.advanced.name = "Advanced";

    return roadmapData;
  } catch (error) {
    if (error instanceof SyntaxError) {
      throw new Error(`Failed to parse Claude response as JSON: ${error.message}`);
    }
    if (error instanceof Anthropic.APIError) {
      throw new Error(`Claude API error: ${error.message}`);
    }
    throw error;
  }
}

/**
 * Saves a generated roadmap to Supabase.
 *
 * @param userId - Authenticated user's ID
 * @param roadmap - Generated roadmap to save
 * @returns Saved roadmap with ID and timestamps
 * @throws Error if save fails
 */
export async function saveRoadmap(
  userId: string,
  roadmap: RoadmapResponse
): Promise<Roadmap> {
  if (!userId) {
    throw new Error("User ID is required");
  }

  try {
    const supabase = await createClient();

    const { data, error } = await supabase
      .from("roadmaps")
      .upsert(
        {
          user_id: userId,
          topic: roadmap.topic,

          // Beginner phase
          beginner_duration: roadmap.beginner.duration,
          beginner_topics: roadmap.beginner.topics,
          beginner_milestones: roadmap.beginner.milestones,
          beginner_projects: roadmap.beginner.projects,
          beginner_resources: roadmap.beginner.resources,
          beginner_practice: roadmap.beginner.practice,

          // Intermediate phase
          intermediate_duration: roadmap.intermediate.duration,
          intermediate_topics: roadmap.intermediate.topics,
          intermediate_milestones: roadmap.intermediate.milestones,
          intermediate_projects: roadmap.intermediate.projects,
          intermediate_resources: roadmap.intermediate.resources,
          intermediate_practice: roadmap.intermediate.practice,

          // Advanced phase
          advanced_duration: roadmap.advanced.duration,
          advanced_topics: roadmap.advanced.topics,
          advanced_milestones: roadmap.advanced.milestones,
          advanced_projects: roadmap.advanced.projects,
          advanced_resources: roadmap.advanced.resources,
          advanced_practice: roadmap.advanced.practice,

          updated_at: new Date().toISOString(),
        },
        { onConflict: "user_id" }
      )
      .select()
      .single();

    if (error) {
      throw new Error(`Failed to save roadmap: ${error.message}`);
    }

    if (!data) {
      throw new Error("Failed to save roadmap");
    }

    // Convert database row to Roadmap type
    return {
      id: data.id,
      user_id: data.user_id,
      topic: data.topic,
      beginner: {
        name: "Beginner",
        duration: data.beginner_duration,
        topics: data.beginner_topics,
        milestones: data.beginner_milestones,
        projects: data.beginner_projects,
        resources: data.beginner_resources,
        practice: data.beginner_practice,
      },
      intermediate: {
        name: "Intermediate",
        duration: data.intermediate_duration,
        topics: data.intermediate_topics,
        milestones: data.intermediate_milestones,
        projects: data.intermediate_projects,
        resources: data.intermediate_resources,
        practice: data.intermediate_practice,
      },
      advanced: {
        name: "Advanced",
        duration: data.advanced_duration,
        topics: data.advanced_topics,
        milestones: data.advanced_milestones,
        projects: data.advanced_projects,
        resources: data.advanced_resources,
        practice: data.advanced_practice,
      },
      created_at: data.created_at,
      updated_at: data.updated_at,
    };
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    }
    throw new Error("Unexpected error saving roadmap");
  }
}

/**
 * Retrieves a student's saved roadmap from Supabase.
 *
 * @param userId - Authenticated user's ID
 * @returns Student's roadmap or null if not found
 * @throws Error if retrieval fails
 */
export async function getRoadmap(userId: string): Promise<Roadmap | null> {
  if (!userId) {
    throw new Error("User ID is required");
  }

  try {
    const supabase = await createClient();

    const { data, error } = await supabase
      .from("roadmaps")
      .select("*")
      .eq("user_id", userId)
      .single();

    if (error) {
      if (error.code === "PGRST116") {
        // No rows found
        return null;
      }
      throw new Error(`Failed to fetch roadmap: ${error.message}`);
    }

    if (!data) {
      return null;
    }

    // Convert database row to Roadmap type
    return {
      id: data.id,
      user_id: data.user_id,
      topic: data.topic,
      beginner: {
        name: "Beginner",
        duration: data.beginner_duration,
        topics: data.beginner_topics,
        milestones: data.beginner_milestones,
        projects: data.beginner_projects,
        resources: data.beginner_resources,
        practice: data.beginner_practice,
      },
      intermediate: {
        name: "Intermediate",
        duration: data.intermediate_duration,
        topics: data.intermediate_topics,
        milestones: data.intermediate_milestones,
        projects: data.intermediate_projects,
        resources: data.intermediate_resources,
        practice: data.intermediate_practice,
      },
      advanced: {
        name: "Advanced",
        duration: data.advanced_duration,
        topics: data.advanced_topics,
        milestones: data.advanced_milestones,
        projects: data.advanced_projects,
        resources: data.advanced_resources,
        practice: data.advanced_practice,
      },
      created_at: data.created_at,
      updated_at: data.updated_at,
    };
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    }
    throw new Error("Unexpected error retrieving roadmap");
  }
}
