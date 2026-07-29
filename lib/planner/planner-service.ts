import { createClient } from "@/lib/supabase/server";
import type { Roadmap } from "@/types";

export interface DailyTask {
  id: string;
  date: string;
  title: string;
  description: string;
  duration_minutes: number;
  category: "study" | "project" | "quiz" | "practice";
  priority: "low" | "medium" | "high";
  completed: boolean;
  completed_at?: string;
}

export interface DailyPlan {
  id: string;
  user_id: string;
  roadmap_id: string;
  start_date: string;
  end_date: string;
  tasks: DailyTask[];
  created_at: string;
  updated_at: string;
}

/**
 * Converts a roadmap into a daily task plan.
 * Breaks down roadmap phases into manageable daily tasks.
 */
export async function generateDailyPlan(
  userId: string,
  roadmap: Roadmap,
  startDate: string = new Date().toISOString().split("T")[0]
): Promise<DailyPlan> {
  if (!userId || !roadmap) {
    throw new Error("User ID and roadmap are required");
  }

  try {
    const supabase = await createClient();

    // Create daily task list from roadmap phases
    const tasks: DailyTask[] = [];
    let taskIndex = 1;
    let currentDate = new Date(startDate);

    // Map roadmap phases to daily chunks
    const phases = [
      { phase: roadmap.beginner, durationDays: 14 },
      { phase: roadmap.intermediate, durationDays: 21 },
      { phase: roadmap.advanced, durationDays: 21 },
    ];

    for (const { phase, durationDays } of phases) {
      const tasksPerPhase = Math.ceil(phase.topics.length / durationDays);
      const topicsPerDay = Math.max(1, Math.ceil(phase.topics.length / durationDays));

      // Create study tasks for topics
      for (let i = 0; i < phase.topics.length; i += topicsPerDay) {
        const topicsForDay = phase.topics.slice(i, i + topicsPerDay);

        tasks.push({
          id: `task_${taskIndex++}`,
          date: currentDate.toISOString().split("T")[0],
          title: `Study: ${topicsForDay.join(", ")}`,
          description: `Focus on: ${topicsForDay.join(", ")}. Read documentation and work through examples.`,
          duration_minutes: 60,
          category: "study",
          priority: "high",
          completed: false,
        });

        currentDate.setDate(currentDate.getDate() + 1);
      }

      // Create practice tasks
      for (const practice of phase.practice) {
        tasks.push({
          id: `task_${taskIndex++}`,
          date: currentDate.toISOString().split("T")[0],
          title: `Practice: ${practice.activity}`,
          description: `${practice.activity} - ${practice.frequency}`,
          duration_minutes: 45,
          category: "practice",
          priority: "high",
          completed: false,
        });

        currentDate.setDate(currentDate.getDate() + 1);
      }

      // Create project tasks
      for (const project of phase.projects) {
        tasks.push({
          id: `task_${taskIndex++}`,
          date: currentDate.toISOString().split("T")[0],
          title: `Project: ${project.title}`,
          description: `${project.description} (Duration: ${project.duration})`,
          duration_minutes: 120,
          category: "project",
          priority: "high",
          completed: false,
        });

        currentDate.setDate(currentDate.getDate() + 1);
      }

      // Add milestone celebrations as low-priority tasks
      if (phase.milestones.length > 0) {
        tasks.push({
          id: `task_${taskIndex++}`,
          date: currentDate.toISOString().split("T")[0],
          title: `Milestone: Complete ${phase.name} phase`,
          description: `Achievement unlocked! Milestones: ${phase.milestones.join(", ")}`,
          duration_minutes: 30,
          category: "study",
          priority: "low",
          completed: false,
        });

        currentDate.setDate(currentDate.getDate() + 1);
      }
    }

    const endDate = new Date(currentDate);
    endDate.setDate(endDate.getDate() - 1);

    // Create plan record in database
    const { data, error } = await supabase
      .from("daily_plans")
      .insert({
        user_id: userId,
        roadmap_id: roadmap.id,
        start_date: startDate,
        end_date: endDate.toISOString().split("T")[0],
        tasks: tasks as any,
      })
      .select()
      .single();

    if (error) {
      throw new Error(`Failed to create daily plan: ${error.message}`);
    }

    if (!data) {
      throw new Error("Failed to create daily plan");
    }

    return {
      id: data.id,
      user_id: data.user_id,
      roadmap_id: data.roadmap_id,
      start_date: data.start_date,
      end_date: data.end_date,
      tasks: data.tasks,
      created_at: data.created_at,
      updated_at: data.updated_at,
    };
  } catch (error) {
    if (error instanceof Error) throw error;
    throw new Error("Unexpected error generating daily plan");
  }
}

/**
 * Gets the daily plan for a user.
 */
export async function getDailyPlan(userId: string): Promise<DailyPlan | null> {
  if (!userId) {
    throw new Error("User ID is required");
  }

  try {
    const supabase = await createClient();

    const { data, error } = await supabase
      .from("daily_plans")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false })
      .maybeSingle();

    if (error) {
      throw new Error(`Failed to fetch daily plan: ${error.message}`);
    }

    return data ? {
      id: data.id,
      user_id: data.user_id,
      roadmap_id: data.roadmap_id,
      start_date: data.start_date,
      end_date: data.end_date,
      tasks: data.tasks,
      created_at: data.created_at,
      updated_at: data.updated_at,
    } : null;
  } catch (error) {
    if (error instanceof Error) throw error;
    throw new Error("Unexpected error fetching daily plan");
  }
}

/**
 * Gets today's tasks for a user.
 */
export async function getTodaysTasks(userId: string): Promise<DailyTask[]> {
  if (!userId) {
    throw new Error("User ID is required");
  }

  try {
    const plan = await getDailyPlan(userId);

    if (!plan) {
      return [];
    }

    const today = new Date().toISOString().split("T")[0];
    return plan.tasks.filter((task) => task.date === today);
  } catch (error) {
    if (error instanceof Error) throw error;
    throw new Error("Unexpected error fetching today's tasks");
  }
}

/**
 * Gets upcoming tasks (next 7 days).
 */
export async function getUpcomingTasks(userId: string, days: number = 7): Promise<DailyTask[]> {
  if (!userId) {
    throw new Error("User ID is required");
  }

  try {
    const plan = await getDailyPlan(userId);

    if (!plan) {
      return [];
    }

    const today = new Date();
    const endDate = new Date(today);
    endDate.setDate(endDate.getDate() + days);

    return plan.tasks.filter((task) => {
      const taskDate = new Date(task.date);
      return taskDate >= today && taskDate <= endDate;
    });
  } catch (error) {
    if (error instanceof Error) throw error;
    throw new Error("Unexpected error fetching upcoming tasks");
  }
}

/**
 * Marks a task as completed.
 */
export async function completeTask(userId: string, taskId: string): Promise<DailyTask> {
  if (!userId || !taskId) {
    throw new Error("User ID and task ID are required");
  }

  try {
    const supabase = await createClient();

    // Get current plan
    const { data: planData } = await supabase
      .from("daily_plans")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false })
      .limit(1)
      .single();

    if (!planData) {
      throw new Error("No daily plan found");
    }

    // Update task
    const updatedTasks = planData.tasks.map((task: DailyTask) => {
      if (task.id === taskId) {
        return {
          ...task,
          completed: true,
          completed_at: new Date().toISOString(),
        };
      }
      return task;
    });

    // Save updated plan
    const { data, error } = await supabase
      .from("daily_plans")
      .update({ tasks: updatedTasks })
      .eq("id", planData.id)
      .select()
      .single();

    if (error) {
      throw new Error(`Failed to complete task: ${error.message}`);
    }

    const completedTask = data.tasks.find((t: DailyTask) => t.id === taskId);

    if (!completedTask) {
      throw new Error("Task not found");
    }

    return completedTask;
  } catch (error) {
    if (error instanceof Error) throw error;
    throw new Error("Unexpected error completing task");
  }
}

/**
 * Gets task completion statistics.
 */
export async function getTaskStats(userId: string): Promise<{
  total_tasks: number;
  completed_tasks: number;
  completion_percentage: number;
  tasks_today: number;
  completed_today: number;
}> {
  if (!userId) {
    throw new Error("User ID is required");
  }

  try {
    const plan = await getDailyPlan(userId);

    if (!plan) {
      return {
        total_tasks: 0,
        completed_tasks: 0,
        completion_percentage: 0,
        tasks_today: 0,
        completed_today: 0,
      };
    }

    const totalTasks = plan.tasks.length;
    const completedTasks = plan.tasks.filter((t) => t.completed).length;
    const today = new Date().toISOString().split("T")[0];
    const tasksToday = plan.tasks.filter((t) => t.date === today).length;
    const completedToday = plan.tasks.filter(
      (t) => t.date === today && t.completed
    ).length;

    return {
      total_tasks: totalTasks,
      completed_tasks: completedTasks,
      completion_percentage: totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0,
      tasks_today: tasksToday,
      completed_today: completedToday,
    };
  } catch (error) {
    if (error instanceof Error) throw error;
    throw new Error("Unexpected error getting task stats");
  }
}
