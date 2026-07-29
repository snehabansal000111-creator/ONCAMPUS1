import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { getStudentProfile } from "@/lib/supabase/profile";
import { generateRoadmap, saveRoadmap } from "@/lib/supabase/roadmap";
import { currentStudent } from "@/lib/mock-data";

interface RoadmapRequest {
  topic: string;
}

interface RoadmapResponse {
  roadmap?: unknown;
  error?: string;
}

/**
 * POST /api/roadmap/generate
 * Body: { topic: string }
 *
 * Generates a personalized 3-phase learning roadmap using Claude.
 * Saves the roadmap to Supabase and returns it.
 *
 * Flow:
 * 1. Get authenticated user
 * 2. Fetch student profile
 * 3. Generate roadmap with Claude (3 phases: Beginner, Intermediate, Advanced)
 * 4. Save to Supabase
 * 5. Return saved roadmap
 *
 * Each phase includes: Topics, Duration, Milestones, Projects, Resources, Practice
 */
export async function POST(request: Request): Promise<NextResponse<RoadmapResponse>> {
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

    const { topic } = body as RoadmapRequest;

    if (!topic || typeof topic !== "string") {
      console.error("Invalid topic field:", { topic, type: typeof topic });
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

    // Get authenticated user (try Supabase, fallback to null if not configured)
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

    console.log("Generating roadmap for topic:", topic, "user:", user?.id || "anonymous");

    // Generate roadmap with Claude
    let roadmapData;
    try {
      roadmapData = await generateRoadmap(studentProfile, topic);
    } catch (claudeError) {
      console.error("Roadmap generation failed:", claudeError);
      throw claudeError;
    }

    // Save roadmap to Supabase (if user is authenticated)
    let savedRoadmap = roadmapData;
    if (user?.id) {
      try {
        savedRoadmap = await saveRoadmap(user.id, roadmapData);
        console.log("Roadmap saved to Supabase for user:", user.id);
      } catch (saveError) {
        console.error("Failed to save roadmap to Supabase:", saveError);
        // Continue - return the roadmap even if save fails
      }
    } else {
      console.log("No authenticated user - roadmap not saved to database (development mode)");
    }

    return NextResponse.json({ roadmap: savedRoadmap });
  } catch (error) {
    console.error("Unexpected error in roadmap generation route:", error);

    const errorMessage =
      error instanceof Error ? error.message : "Failed to generate roadmap";

    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    );
  }
}
