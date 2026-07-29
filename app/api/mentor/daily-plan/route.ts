import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { getStudentProfile } from "@/lib/supabase/profile";
import { getRoadmap } from "@/lib/supabase/roadmap";
import { getProgressSummary } from "@/lib/progress/progress-service";
import { getDailyPlan } from "@/lib/planner/planner-service";
import { generateTodaysMentor } from "@/lib/mentor/proactive-mentor";
import { currentStudent } from "@/lib/mock-data";

/**
 * GET /api/mentor/daily-plan
 *
 * Returns personalized daily mentor guidance for authenticated user
 * Includes:
 * - Today's goal
 * - Estimated study time
 * - Recommended topic
 * - Mini project
 * - Quiz reminder
 * - Motivation message
 *
 * Response: { mentor: TodaysMentor }
 * Error: { error: string }
 */
export async function GET(request: Request): Promise<NextResponse> {
  try {
    // Get authenticated user
    let user: { id: string } | null = null;
    let profile = currentStudent;

    try {
      const supabase = await createClient();
      const {
        data: { user: authUser },
        error: authError,
      } = await supabase.auth.getUser();

      if (!authError && authUser) {
        user = authUser;
        // Fetch student profile
        const fetchedProfile = await getStudentProfile(user.id).catch(
          () => null
        );
        if (fetchedProfile) {
          profile = fetchedProfile;
        }
      }
    } catch (error) {
      console.log("Using mock data for daily plan generation");
    }

    // Fetch all required context
    let roadmap = null;
    let progressSummary = null;
    let dailyPlan = null;
    let todaysTasks: any[] = [];

    if (user?.id) {
      try {
        const [
          fetchedRoadmap,
          fetchedProgress,
          fetchedDailyPlan,
          fetchedTasks,
        ] = await Promise.all([
          getRoadmap(user.id).catch(() => null),
          getProgressSummary(user.id).catch(() => null),
          getDailyPlan(user.id).catch(() => null),
          getTodaysTasks(user.id).catch(() => []),
        ]);

        roadmap = fetchedRoadmap;
        progressSummary = fetchedProgress;
        dailyPlan = fetchedDailyPlan;
        todaysTasks = fetchedTasks;
      } catch (error) {
        console.log("Could not fetch complete context, using partial data");
      }
    }

    // Fetch recent quizzes
    let recentQuizzes: any[] = [];
    if (user?.id) {
      try {
        const supabase = await createClient();
        const { data } = await supabase
          .from("quizzes")
          .select("*")
          .eq("user_id", user.id)
          .order("created_at", { ascending: false })
          .limit(5);
        recentQuizzes = data || [];
      } catch (error) {
        console.log("Could not fetch quizzes");
      }
    }

    // Generate personalized mentor guidance
    const mentor = generateTodaysMentor(
      profile,
      roadmap,
      progressSummary,
      todaysTasks,
      recentQuizzes
    );

    return NextResponse.json({ mentor });
  } catch (error) {
    console.error("Error generating daily mentor plan:", error);
    return NextResponse.json(
      { error: "Failed to generate daily mentor plan" },
      { status: 500 }
    );
  }
}

/**
 * Helper function to get today's tasks
 */
async function getTodaysTasks(userId: string): Promise<any[]> {
  try {
    const supabase = await createClient();
    const today = new Date().toISOString().split("T")[0];

    const { data } = await supabase
      .from("planner_tasks")
      .select("*")
      .eq("user_id", userId)
      .eq("date", today)
      .order("created_at", { ascending: true });

    return data || [];
  } catch (error) {
    return [];
  }
}
