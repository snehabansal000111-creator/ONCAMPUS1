import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { getStudentProfile } from "@/lib/supabase/profile";
import {
  getResourceRecommendations,
  saveResourceRecommendations,
} from "@/lib/resources/recommendation-service";
import { currentStudent } from "@/lib/mock-data";

interface RecommendationRequest {
  topic: string;
  roadmapStage?: "beginner" | "intermediate" | "advanced";
}

interface RecommendationResponse {
  recommendations?: any;
  error?: string;
}

/**
 * POST /api/resources/recommend
 * Body: { topic: string, roadmapStage?: string }
 *
 * Recommends high-quality resources based on student profile.
 * Uses curated resource database - no random recommendations.
 *
 * Flow:
 * 1. Get authenticated user
 * 2. Fetch student profile (career goal, skill level)
 * 3. Use roadmap stage if provided
 * 4. Get personalized recommendations from curated database
 * 5. Save recommendations to Supabase
 * 6. Return filtered, ranked list
 *
 * Recommendation Criteria:
 * - Official documentation (highest priority)
 * - Verified, high-quality resources only
 * - Matches career goal
 * - Matches skill level
 * - Matches roadmap stage
 * - Relevant to topic
 */
export async function POST(request: Request): Promise<NextResponse<RecommendationResponse>> {
  try {
    let body: unknown;
    try {
      body = await request.json();
    } catch (error) {
      console.error("JSON parse error:", error);
      return NextResponse.json(
        { error: "Invalid JSON in request body" },
        { status: 400 }
      );
    }

    const { topic, roadmapStage } = body as RecommendationRequest;

    // Validate topic
    if (!topic || typeof topic !== "string") {
      return NextResponse.json(
        { error: "topic field is required and must be a string" },
        { status: 400 }
      );
    }

    if (topic.trim().length === 0) {
      return NextResponse.json(
        { error: "topic cannot be empty" },
        { status: 400 }
      );
    }

    // Validate roadmapStage if provided
    if (
      roadmapStage &&
      !["beginner", "intermediate", "advanced"].includes(roadmapStage)
    ) {
      return NextResponse.json(
        { error: "roadmapStage must be: beginner, intermediate, or advanced" },
        { status: 400 }
      );
    }

    // Get authenticated user
    let user: { id: string } | null = null;
    try {
      const supabase = await createClient();
      const {
        data: { user: authUser },
        error: authError,
      } = await supabase.auth.getUser();

      if (!authError && authUser) {
        user = authUser;
      } else {
        console.log("No authenticated user, using mock data for development");
      }
    } catch (supabaseError) {
      console.log("Supabase not configured, using mock data for development:", supabaseError);
    }

    // Fetch student profile from Supabase (or use mock data as fallback)
    let studentProfile = currentStudent;
    if (user?.id) {
      try {
        studentProfile = await getStudentProfile(user.id);
      } catch (profileError) {
        console.log("Profile not found, using mock data:", profileError);
      }
    }

    console.log(
      "Getting resource recommendations for topic:",
      topic,
      "user:",
      user?.id || "anonymous"
    );

    // Get resource recommendations from curated database
    const resources = getResourceRecommendations(
      topic,
      studentProfile.careerGoal,
      studentProfile.branch, // Using branch as skill level proxy
      roadmapStage || "beginner"
    );

    if (resources.length === 0) {
      console.log("No matching resources found for topic:", topic);
      return NextResponse.json(
        {
          recommendations: {
            topic,
            careerGoal: studentProfile.careerGoal,
            skillLevel: studentProfile.branch,
            roadmapStage: roadmapStage || "beginner",
            resources: [],
            message: "No resources found matching your criteria",
          },
        },
        { status: 200 }
      );
    }

    // Save recommendations to Supabase (if authenticated)
    let savedRecommendation: any = {
      topic,
      careerGoal: studentProfile.careerGoal,
      skillLevel: studentProfile.branch,
      roadmapStage: roadmapStage || "beginner",
      resources,
    };

    if (user?.id) {
      try {
        // Determine skill level from profile
        const skillLevel =
          studentProfile.skills.length <= 2
            ? "beginner"
            : studentProfile.skills.length <= 5
              ? "intermediate"
              : "advanced";

        savedRecommendation = (await saveResourceRecommendations(
          user.id,
          topic,
          studentProfile.careerGoal,
          skillLevel,
          roadmapStage || "beginner",
          resources
        )) as any;
        console.log("Recommendations saved to Supabase for user:", user.id);
      } catch (saveError) {
        console.error("Failed to save recommendations to Supabase:", saveError);
        // Continue - return the recommendations even if save fails
      }
    } else {
      console.log(
        "No authenticated user - recommendations not saved to database (development mode)"
      );
    }

    return NextResponse.json({ recommendations: savedRecommendation });
  } catch (error) {
    console.error("Unexpected error in resource recommendation route:", error);

    const errorMessage =
      error instanceof Error ? error.message : "Failed to get recommendations";

    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    );
  }
}
