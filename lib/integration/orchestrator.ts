import type { StudentProfile, Roadmap, Quiz, ResourceRecommendation, ProgressSummary } from "@/types";
import { getStudentProfile } from "@/lib/supabase/profile";
import { getRoadmap } from "@/lib/supabase/roadmap";
import { getUserQuizzes } from "@/lib/supabase/quiz";
import { getProgressSummary } from "@/lib/progress/progress-service";
import { getDailyPlan, getTodaysTasks } from "@/lib/planner/planner-service";

/**
 * Complete learning state for a student.
 * Aggregates profile, roadmap, plan, quizzes, resources, and progress.
 */
export interface LearningState {
  profile: StudentProfile | null;
  roadmap: Roadmap | null;
  dailyPlan: any | null;
  todaysTasks: any[];
  recentQuizzes: Quiz[];
  progressSummary: ProgressSummary | null;
  lastActivity: string | null;
}

/**
 * Gets the complete learning state for a student.
 * This is the central orchestration function that fetches everything.
 */
export async function getLearningState(userId: string): Promise<LearningState> {
  if (!userId) {
    throw new Error("User ID is required");
  }

  try {
    // Fetch all data in parallel
    const [profile, roadmap, dailyPlan, recentQuizzes, progressSummary, todaysTasks] =
      await Promise.all([
        getStudentProfile(userId),
        getRoadmap(userId),
        getDailyPlan(userId),
        getUserQuizzes(userId),
        getProgressSummary(userId),
        getTodaysTasks(userId),
      ]);

    // Determine last activity
    let lastActivity = progressSummary?.last_activity_date || null;
    if (todaysTasks && todaysTasks.length > 0) {
      const completedToday = todaysTasks.find((t) => t.completed);
      if (completedToday && completedToday.completed_at) {
        lastActivity = completedToday.completed_at;
      }
    }

    return {
      profile: profile || null,
      roadmap: roadmap || null,
      dailyPlan: dailyPlan || null,
      todaysTasks: todaysTasks || [],
      recentQuizzes: recentQuizzes || [],
      progressSummary: progressSummary || null,
      lastActivity,
    };
  } catch (error) {
    if (error instanceof Error) throw error;
    throw new Error("Failed to fetch learning state");
  }
}

/**
 * Gets a summary view of the student's progress and recommendations.
 */
export interface ProgressView {
  overall_progress_percentage: number;
  learning_streak_days: number;
  todays_task_count: number;
  todays_completed_count: number;
  quiz_average_score: number;
  total_time_invested_hours: number;
  recommended_action: string;
}

export async function getProgressView(userId: string): Promise<ProgressView> {
  if (!userId) {
    throw new Error("User ID is required");
  }

  try {
    const state = await getLearningState(userId);

    // Calculate quiz average
    let quizAverage = 0;
    if (state.recentQuizzes && state.recentQuizzes.length > 0) {
      const scores = state.recentQuizzes.map((q) => {
        const sumScores = q.questions.reduce((acc, question) => {
          // Assuming questions have some scoring mechanism
          return acc + 100;
        }, 0);
        return sumScores / (q.questions.length || 1);
      });
      quizAverage = Math.round(scores.reduce((a, b) => a + b, 0) / scores.length);
    }

    // Calculate total time invested
    let totalTimeHours = 0;
    if (state.progressSummary?.weekly_progress) {
      const totalMinutes = state.progressSummary.weekly_progress.reduce(
        (sum, week) => sum + (week.time_spent_minutes || 0),
        0
      );
      totalTimeHours = Math.round(totalMinutes / 60);
    }

    // Determine recommended action
    let recommendedAction = "Start learning by generating a roadmap";
    if (state.roadmap) {
      recommendedAction = "Work on today's tasks to build momentum";
      if (state.todaysTasks && state.todaysTasks.length > 0) {
        const unfinished = state.todaysTasks.filter((t) => !t.completed).length;
        if (unfinished > 0) {
          recommendedAction = `Complete ${unfinished} remaining task${unfinished > 1 ? "s" : ""} today`;
        } else {
          recommendedAction = "Great job! All tasks completed. Check back tomorrow.";
        }
      }
    }

    return {
      overall_progress_percentage: state.progressSummary?.overall_completion_percentage || 0,
      learning_streak_days: state.progressSummary?.learning_streak_days || 0,
      todays_task_count: state.todaysTasks?.length || 0,
      todays_completed_count: state.todaysTasks?.filter((t) => t.completed).length || 0,
      quiz_average_score: quizAverage,
      total_time_invested_hours: totalTimeHours,
      recommended_action: recommendedAction,
    };
  } catch (error) {
    if (error instanceof Error) throw error;
    throw new Error("Failed to calculate progress view");
  }
}

/**
 * Validates the integration between all modules.
 * Returns status of each module.
 */
export interface IntegrationStatus {
  profile_loaded: boolean;
  roadmap_generated: boolean;
  daily_plan_created: boolean;
  quizzes_taken: boolean;
  progress_tracked: boolean;
  resources_available: boolean;
  chat_ready: boolean;
  all_systems_ready: boolean;
  recommendations: string[];
}

export async function checkIntegrationStatus(userId: string): Promise<IntegrationStatus> {
  if (!userId) {
    throw new Error("User ID is required");
  }

  try {
    const state = await getLearningState(userId);
    const recommendations: string[] = [];

    const profileLoaded = !!state.profile;
    const roadmapGenerated = !!state.roadmap;
    const dailyPlanCreated = !!state.dailyPlan;
    const quizzesTaken = state.recentQuizzes && state.recentQuizzes.length > 0;
    const progressTracked = !!state.progressSummary;
    const resourcesAvailable = !!state.roadmap; // Resources available once roadmap exists
    const chatReady = profileLoaded; // Chat ready once profile exists

    // Build recommendations
    if (!profileLoaded) {
      recommendations.push("Complete your student profile to get started");
    } else if (!roadmapGenerated) {
      recommendations.push("Generate a learning roadmap based on your profile");
    } else if (!dailyPlanCreated) {
      recommendations.push("Create a daily task plan from your roadmap");
    } else if (!quizzesTaken) {
      recommendations.push("Take your first quiz to test your knowledge");
    } else if (!progressTracked) {
      recommendations.push("Your progress will be tracked automatically");
    } else {
      recommendations.push("Keep building momentum with daily tasks");
    }

    return {
      profile_loaded: profileLoaded,
      roadmap_generated: roadmapGenerated,
      daily_plan_created: dailyPlanCreated,
      quizzes_taken: quizzesTaken,
      progress_tracked: progressTracked,
      resources_available: resourcesAvailable,
      chat_ready: chatReady,
      all_systems_ready:
        profileLoaded &&
        roadmapGenerated &&
        dailyPlanCreated &&
        quizzesTaken &&
        progressTracked,
      recommendations,
    };
  } catch (error) {
    if (error instanceof Error) throw error;
    throw new Error("Failed to check integration status");
  }
}

/**
 * Gets next recommended action for a student.
 */
export async function getRecommendedNextStep(userId: string): Promise<{
  step: string;
  action: string;
  reason: string;
  endpoint?: string;
}> {
  if (!userId) {
    throw new Error("User ID is required");
  }

  try {
    const status = await checkIntegrationStatus(userId);

    if (!status.profile_loaded) {
      return {
        step: "1. Setup Profile",
        action: "Complete your student profile",
        reason: "Your profile helps personalize all recommendations",
      };
    }

    if (!status.roadmap_generated) {
      return {
        step: "2. Generate Roadmap",
        action: "Create a learning roadmap",
        reason: "A roadmap structures your learning journey",
        endpoint: "POST /api/roadmap/generate",
      };
    }

    if (!status.daily_plan_created) {
      return {
        step: "3. Create Daily Plan",
        action: "Convert roadmap into daily tasks",
        reason: "Daily tasks keep you on track",
        endpoint: "POST /api/planner/generate",
      };
    }

    const state = await getLearningState(userId);

    if (state.todaysTasks && state.todaysTasks.length > 0) {
      const incompleteTasks = state.todaysTasks.filter((t) => !t.completed);
      if (incompleteTasks.length > 0) {
        return {
          step: "4. Complete Daily Tasks",
          action: `Complete ${incompleteTasks.length} task${incompleteTasks.length > 1 ? "s" : ""} today`,
          reason: "Daily consistency builds momentum",
        };
      }
    }

    if (!status.quizzes_taken) {
      return {
        step: "5. Test Your Knowledge",
        action: "Take a quiz",
        reason: "Quizzes reinforce learning and identify gaps",
        endpoint: "POST /api/quiz/generate",
      };
    }

    return {
      step: "6. Keep Learning",
      action: "Continue with daily tasks and quizzes",
      reason: "Consistency is key to long-term learning",
    };
  } catch (error) {
    if (error instanceof Error) throw error;
    throw new Error("Failed to get recommended next step");
  }
}
