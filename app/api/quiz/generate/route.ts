import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { getStudentProfile } from "@/lib/supabase/profile";
import { generateQuiz, saveQuiz } from "@/lib/supabase/quiz";
import { currentStudent } from "@/lib/mock-data";

interface QuizRequest {
  topic: string;
  difficulty: "easy" | "medium" | "hard";
  roadmapStage?: "beginner" | "intermediate" | "advanced";
  roadmapId?: string;
}

interface QuizResponse {
  quiz?: unknown;
  error?: string;
}

/**
 * POST /api/quiz/generate
 * Body: { topic: string, difficulty: string, roadmapStage?: string, roadmapId?: string }
 *
 * Generates a personalized quiz using Claude with:
 * - 3 MCQ (Multiple Choice Questions)
 * - 2 Coding Questions
 * - 2 Short Answer Questions
 *
 * Flow:
 * 1. Get authenticated user
 * 2. Fetch student profile
 * 3. Generate quiz with Claude (personalized)
 * 4. Save to Supabase
 * 5. Return saved quiz
 */
export async function POST(request: Request): Promise<NextResponse<QuizResponse>> {
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

    const { topic, difficulty, roadmapStage, roadmapId } = body as QuizRequest;

    // Validate topic
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

    // Validate difficulty
    if (!difficulty || !["easy", "medium", "hard"].includes(difficulty)) {
      return NextResponse.json(
        { error: "difficulty must be: easy, medium, or hard" },
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

    console.log("Generating quiz for topic:", topic, "difficulty:", difficulty, "user:", user?.id || "anonymous");

    // Generate quiz with Claude
    let quizData;
    try {
      quizData = await generateQuiz(
        studentProfile,
        topic,
        difficulty as "easy" | "medium" | "hard",
        roadmapStage as "beginner" | "intermediate" | "advanced" | undefined
      );
    } catch (claudeError) {
      console.error("Quiz generation failed:", claudeError);
      throw claudeError;
    }

    // Save quiz to Supabase (if user is authenticated)
    let savedQuiz = quizData;
    if (user?.id) {
      try {
        const quiz = await saveQuiz(user.id, quizData, roadmapId);
        savedQuiz = quiz;
        console.log("Quiz saved to Supabase for user:", user.id);
      } catch (saveError) {
        console.error("Failed to save quiz to Supabase:", saveError);
        // Continue - return the quiz even if save fails
      }
    } else {
      console.log("No authenticated user - quiz not saved to database (development mode)");
    }

    return NextResponse.json({ quiz: savedQuiz });
  } catch (error) {
    console.error("Unexpected error in quiz generation route:", error);

    const errorMessage =
      error instanceof Error ? error.message : "Failed to generate quiz";

    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    );
  }
}
