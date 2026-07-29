import { createClient } from "@/lib/supabase/server";
import type {
  TopicProgress,
  QuizProgress,
  ProjectProgress,
  RoadmapItemProgress,
  ProgressSummary,
  WeeklyProgressData,
} from "@/types";

/**
 * Records a completed topic.
 *
 * @param userId - User ID
 * @param topic - Topic name
 * @param timeSpentMinutes - Time spent on topic
 * @returns Saved topic progress
 */
export async function recordTopicCompletion(
  userId: string,
  topic: string,
  timeSpentMinutes: number = 0
): Promise<TopicProgress> {
  if (!userId || !topic) {
    throw new Error("User ID and topic are required");
  }

  try {
    const supabase = await createClient();

    const { data, error } = await supabase
      .from("topic_progress")
      .insert({
        user_id: userId,
        topic,
        time_spent_minutes: Math.max(0, timeSpentMinutes),
      })
      .select()
      .single();

    if (error) {
      throw new Error(`Failed to record topic completion: ${error.message}`);
    }

    if (!data) {
      throw new Error("Failed to record topic completion");
    }

    return {
      id: data.id,
      user_id: data.user_id,
      topic: data.topic,
      completed_at: data.completed_at,
      time_spent_minutes: data.time_spent_minutes,
    };
  } catch (error) {
    if (error instanceof Error) throw error;
    throw new Error("Unexpected error recording topic completion");
  }
}

/**
 * Records a completed quiz.
 *
 * @param userId - User ID
 * @param quizId - Quiz ID
 * @param score - Quiz score (0-100)
 * @returns Saved quiz progress
 */
export async function recordQuizCompletion(
  userId: string,
  quizId: string,
  score: number
): Promise<QuizProgress> {
  if (!userId || !quizId || score < 0 || score > 100) {
    throw new Error("Invalid quiz completion data");
  }

  try {
    const supabase = await createClient();

    const { data, error } = await supabase
      .from("quiz_progress")
      .insert({
        user_id: userId,
        quiz_id: quizId,
        score,
      })
      .select()
      .single();

    if (error) {
      throw new Error(`Failed to record quiz completion: ${error.message}`);
    }

    if (!data) {
      throw new Error("Failed to record quiz completion");
    }

    return {
      id: data.id,
      user_id: data.user_id,
      quiz_id: data.quiz_id,
      score: data.score,
      completed_at: data.completed_at,
    };
  } catch (error) {
    if (error instanceof Error) throw error;
    throw new Error("Unexpected error recording quiz completion");
  }
}

/**
 * Records or updates project progress.
 *
 * @param userId - User ID
 * @param projectTitle - Project title
 * @param status - Project status
 * @returns Project progress record
 */
export async function recordProjectProgress(
  userId: string,
  projectTitle: string,
  status: "started" | "in-progress" | "completed" = "started",
  notes?: string
): Promise<ProjectProgress> {
  if (!userId || !projectTitle) {
    throw new Error("User ID and project title are required");
  }

  try {
    const supabase = await createClient();

    const { data, error } = await supabase
      .from("project_progress")
      .insert({
        user_id: userId,
        project_title: projectTitle,
        status,
        notes: notes || null,
        completed_at: status === "completed" ? new Date().toISOString() : null,
      })
      .select()
      .single();

    if (error) {
      throw new Error(`Failed to record project progress: ${error.message}`);
    }

    if (!data) {
      throw new Error("Failed to record project progress");
    }

    return {
      id: data.id,
      user_id: data.user_id,
      project_title: data.project_title,
      status: data.status,
      started_at: data.started_at,
      completed_at: data.completed_at,
    };
  } catch (error) {
    if (error instanceof Error) throw error;
    throw new Error("Unexpected error recording project progress");
  }
}

/**
 * Records roadmap item completion.
 *
 * @param userId - User ID
 * @param roadmapId - Roadmap ID
 * @param itemTitle - Item title
 * @param phase - Learning phase
 * @returns Roadmap item progress
 */
export async function recordRoadmapItemCompletion(
  userId: string,
  roadmapId: string,
  itemTitle: string,
  phase: "beginner" | "intermediate" | "advanced"
): Promise<RoadmapItemProgress> {
  if (!userId || !roadmapId || !itemTitle || !phase) {
    throw new Error("All parameters are required");
  }

  try {
    const supabase = await createClient();

    const { data, error } = await supabase
      .from("roadmap_item_progress")
      .insert({
        user_id: userId,
        roadmap_id: roadmapId,
        item_title: itemTitle,
        phase,
        completed: true,
        completed_at: new Date().toISOString(),
      })
      .select()
      .single();

    if (error) {
      throw new Error(`Failed to record roadmap item: ${error.message}`);
    }

    if (!data) {
      throw new Error("Failed to record roadmap item");
    }

    return {
      id: data.id,
      user_id: data.user_id,
      roadmap_id: data.roadmap_id,
      item_title: data.item_title,
      phase: data.phase,
      completed: data.completed || true,
      completed_at: data.completed_at,
    };
  } catch (error) {
    if (error instanceof Error) throw error;
    throw new Error("Unexpected error recording roadmap item");
  }
}

/**
 * Calculates learning streak (consecutive days with activity).
 *
 * @param userId - User ID
 * @returns Number of consecutive days with activity
 */
export async function calculateLearningStreak(userId: string): Promise<number> {
  if (!userId) {
    throw new Error("User ID is required");
  }

  try {
    const supabase = await createClient();

    // Get all activity dates (union of all activity types)
    const { data: topicDates } = await supabase
      .from("topic_progress")
      .select("completed_at")
      .eq("user_id", userId)
      .order("completed_at", { ascending: false });

    const { data: quizDates } = await supabase
      .from("quiz_progress")
      .select("completed_at")
      .eq("user_id", userId)
      .order("completed_at", { ascending: false });

    const { data: projectDates } = await supabase
      .from("project_progress")
      .select("completed_at")
      .eq("user_id", userId)
      .not("completed_at", "is", null)
      .order("completed_at", { ascending: false });

    // Combine and deduplicate dates
    const allDates = [
      ...(topicDates || []),
      ...(quizDates || []),
      ...(projectDates || []),
    ]
      .map((item) => new Date(item.completed_at).toDateString())
      .filter((v, i, a) => a.indexOf(v) === i)
      .sort((a, b) => new Date(b).getTime() - new Date(a).getTime());

    if (allDates.length === 0) return 0;

    // Calculate consecutive days
    let streak = 0;
    let currentDate = new Date();

    for (const dateStr of allDates) {
      const date = new Date(dateStr);
      const diffDays = Math.floor(
        (currentDate.getTime() - date.getTime()) / (1000 * 60 * 60 * 24)
      );

      if (diffDays === 0 || diffDays === 1) {
        streak++;
        currentDate = date;
      } else {
        break;
      }
    }

    return streak;
  } catch (error) {
    if (error instanceof Error) throw error;
    throw new Error("Unexpected error calculating learning streak");
  }
}

/**
 * Gets weekly progress data.
 *
 * @param userId - User ID
 * @param weeksBack - Number of weeks to retrieve (default: 4)
 * @returns Array of weekly progress
 */
export async function getWeeklyProgress(
  userId: string,
  weeksBack: number = 4
): Promise<WeeklyProgressData[]> {
  if (!userId) {
    throw new Error("User ID is required");
  }

  try {
    const supabase = await createClient();

    const weeklyData: Map<string, WeeklyProgressData> = new Map();

    // Initialize weeks
    const now = new Date();
    for (let i = 0; i < weeksBack; i++) {
      const date = new Date(now);
      date.setDate(date.getDate() - i * 7);
      const dateStr = date.toISOString().split("T")[0];
      weeklyData.set(dateStr, {
        date: dateStr,
        topics_completed: 0,
        quizzes_completed: 0,
        projects_completed: 0,
        time_spent_minutes: 0,
      });
    }

    // Get topic progress for weeks
    const { data: topics } = await supabase
      .from("topic_progress")
      .select("completed_at, time_spent_minutes")
      .eq("user_id", userId)
      .gte("completed_at", new Date(now.getTime() - weeksBack * 7 * 24 * 60 * 60 * 1000).toISOString());

    topics?.forEach((t) => {
      const week = new Date(t.completed_at).toISOString().split("T")[0];
      const data = weeklyData.get(week);
      if (data) {
        data.topics_completed++;
        data.time_spent_minutes += t.time_spent_minutes || 0;
      }
    });

    // Get quiz progress for weeks
    const { data: quizzes } = await supabase
      .from("quiz_progress")
      .select("completed_at")
      .eq("user_id", userId)
      .gte("completed_at", new Date(now.getTime() - weeksBack * 7 * 24 * 60 * 60 * 1000).toISOString());

    quizzes?.forEach((q) => {
      const week = new Date(q.completed_at).toISOString().split("T")[0];
      const data = weeklyData.get(week);
      if (data) {
        data.quizzes_completed++;
      }
    });

    // Get project completions for weeks
    const { data: projects } = await supabase
      .from("project_progress")
      .select("completed_at")
      .eq("user_id", userId)
      .eq("status", "completed")
      .not("completed_at", "is", null)
      .gte("completed_at", new Date(now.getTime() - weeksBack * 7 * 24 * 60 * 60 * 1000).toISOString());

    projects?.forEach((p) => {
      const week = new Date(p.completed_at).toISOString().split("T")[0];
      const data = weeklyData.get(week);
      if (data) {
        data.projects_completed++;
      }
    });

    return Array.from(weeklyData.values())
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  } catch (error) {
    if (error instanceof Error) throw error;
    throw new Error("Unexpected error getting weekly progress");
  }
}

/**
 * Gets complete progress summary for a user.
 *
 * @param userId - User ID
 * @returns Progress summary with all metrics
 */
export async function getProgressSummary(
  userId: string
): Promise<ProgressSummary> {
  if (!userId) {
    throw new Error("User ID is required");
  }

  try {
    const supabase = await createClient();

    // Get or create summary
    let { data: summary, error: summaryError } = await supabase
      .from("progress_summary")
      .select("*")
      .eq("user_id", userId)
      .maybeSingle();

    if (summaryError) {
      throw new Error(`Failed to fetch summary: ${summaryError.message}`);
    }

    if (!summary) {
      // Create initial summary if doesn't exist
      const { data: newSummary, error: createError } = await supabase
        .from("progress_summary")
        .insert({
          user_id: userId,
          total_topics_completed: 0,
          total_quizzes_completed: 0,
          total_projects_completed: 0,
        })
        .select()
        .single();

      if (createError) {
        throw new Error(`Failed to create summary: ${createError.message}`);
      }

      summary = newSummary;
    }

    // Get actual counts from activity tables
    const { count: topicsCount } = await supabase
      .from("topic_progress")
      .select("*", { count: "exact" })
      .eq("user_id", userId);

    const { count: quizzesCount } = await supabase
      .from("quiz_progress")
      .select("*", { count: "exact" })
      .eq("user_id", userId);

    const { count: projectsCount } = await supabase
      .from("project_progress")
      .select("*", { count: "exact" })
      .eq("user_id", userId)
      .eq("status", "completed");

    // Get learning streak
    const streak = await calculateLearningStreak(userId);

    // Get weekly progress
    const weekly = await getWeeklyProgress(userId, 4);

    // Calculate percentages (based on total possible activities)
    const totalActivities = (topicsCount || 0) + (quizzesCount || 0) + (projectsCount || 0);
    const overallCompletion = totalActivities > 0 ? Math.round((totalActivities / (totalActivities + 10)) * 100) : 0;

    // Get roadmap completion
    const { count: completedRoadmapItems } = await supabase
      .from("roadmap_item_progress")
      .select("*", { count: "exact" })
      .eq("user_id", userId)
      .eq("completed", true);

    const { count: totalRoadmapItems } = await supabase
      .from("roadmap_item_progress")
      .select("*", { count: "exact" })
      .eq("user_id", userId);

    const roadmapCompletion =
      totalRoadmapItems && totalRoadmapItems > 0
        ? Math.round(((completedRoadmapItems || 0) / totalRoadmapItems) * 100)
        : 0;

    // Get last activity date
    const allActivities = [
      ...(await supabase
        .from("topic_progress")
        .select("completed_at")
        .eq("user_id", userId)
        .order("completed_at", { ascending: false })
        .limit(1)
        .then((r) => r.data || [])),
      ...(await supabase
        .from("quiz_progress")
        .select("completed_at")
        .eq("user_id", userId)
        .order("completed_at", { ascending: false })
        .limit(1)
        .then((r) => r.data || [])),
      ...(await supabase
        .from("project_progress")
        .select("completed_at")
        .eq("user_id", userId)
        .order("completed_at", { ascending: false })
        .limit(1)
        .then((r) => r.data || [])),
    ];

    const lastActivityDate = allActivities.length > 0
      ? new Date(Math.max(...allActivities.map((a) => new Date(a.completed_at).getTime()))).toISOString()
      : new Date().toISOString();

    return {
      user_id: userId,
      total_topics_completed: topicsCount || 0,
      total_quizzes_completed: quizzesCount || 0,
      total_projects_completed: projectsCount || 0,
      overall_completion_percentage: overallCompletion,
      roadmap_completion_percentage: roadmapCompletion,
      learning_streak_days: streak,
      weekly_progress: weekly,
      last_activity_date: lastActivityDate,
      created_at: summary.created_at,
    };
  } catch (error) {
    if (error instanceof Error) throw error;
    throw new Error("Unexpected error getting progress summary");
  }
}
