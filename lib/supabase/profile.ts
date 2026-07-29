import { createClient } from "./server";
import type { StudentProfile } from "@/types";

interface ProfileRow {
  id: string;
  user_id: string;
  name: string;
  branch: string;
  year: string;
  background: string | null;
  skills: string[];
  interests: string[];
  career_goal: string;
  learning_style: "visual" | "reading" | "hands-on" | "mixed";
  monthly_budget: number;
  daily_study_hours: number;
  created_at: string;
  updated_at: string;
}

/**
 * Retrieves the student profile from Supabase.
 *
 * @param userId - The authenticated user's ID
 * @returns The student profile with all onboarding data
 * @throws Error if profile not found or database query fails
 */
export async function getStudentProfile(userId: string): Promise<StudentProfile> {
  if (!userId || typeof userId !== "string") {
    throw new Error("Valid userId is required");
  }

  try {
    const supabase = await createClient();

    const { data, error } = await supabase
      .from("profiles")
      .select("*")
      .eq("user_id", userId)
      .single();

    if (error) {
      if (error.code === "PGRST116") {
        throw new Error("Student profile not found. Please complete onboarding first.");
      }
      throw new Error(`Failed to fetch student profile: ${error.message}`);
    }

    if (!data) {
      throw new Error("Student profile not found");
    }

    const profile = data as ProfileRow;

    return {
      id: profile.id,
      name: profile.name,
      branch: profile.branch,
      year: profile.year,
      background: profile.background || undefined,
      skills: profile.skills || [],
      interests: profile.interests || [],
      careerGoal: profile.career_goal,
      learningStyle: profile.learning_style,
      monthlyBudget: profile.monthly_budget,
      dailyStudyHours: profile.daily_study_hours,
    };
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    }
    throw new Error("Unexpected error retrieving student profile");
  }
}

/**
 * Creates or updates a student profile in Supabase.
 * Called after onboarding is completed.
 *
 * @param userId - The authenticated user's ID
 * @param profile - The student profile data
 * @returns The created/updated profile
 * @throws Error if database operation fails
 */
export async function upsertStudentProfile(
  userId: string,
  profile: {
    name: string;
    branch: string;
    year: string;
    skills: string[];
    interests: string[];
    careerGoal: string;
    learningStyle: "visual" | "reading" | "hands-on" | "mixed";
    monthlyBudget: number;
    dailyStudyHours: number;
    background?: string;
  }
): Promise<StudentProfile> {
  if (!userId || typeof userId !== "string") {
    throw new Error("Valid userId is required");
  }

  try {
    const supabase = await createClient();

    const { data, error } = await supabase
      .from("profiles")
      .upsert(
        {
          user_id: userId,
          name: profile.name,
          branch: profile.branch,
          year: profile.year,
          background: profile.background || null,
          skills: profile.skills,
          interests: profile.interests,
          career_goal: profile.careerGoal,
          learning_style: profile.learningStyle,
          monthly_budget: profile.monthlyBudget,
          daily_study_hours: profile.dailyStudyHours,
          updated_at: new Date().toISOString(),
        },
        { onConflict: "user_id" }
      )
      .select()
      .single();

    if (error) {
      throw new Error(`Failed to save student profile: ${error.message}`);
    }

    if (!data) {
      throw new Error("Failed to save student profile");
    }

    const savedProfile = data as ProfileRow;

    return {
      id: savedProfile.id,
      name: savedProfile.name,
      branch: savedProfile.branch,
      year: savedProfile.year,
      background: savedProfile.background || undefined,
      skills: savedProfile.skills || [],
      interests: savedProfile.interests || [],
      careerGoal: savedProfile.career_goal,
      learningStyle: savedProfile.learning_style,
      monthlyBudget: savedProfile.monthly_budget,
      dailyStudyHours: savedProfile.daily_study_hours,
    };
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    }
    throw new Error("Unexpected error saving student profile");
  }
}
