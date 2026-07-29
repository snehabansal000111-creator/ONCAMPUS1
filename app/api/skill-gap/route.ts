import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { getStudentProfile } from "@/lib/supabase/profile";
import { analyzeSkillGaps } from "@/lib/skill-gap-analyzer";
import { currentStudent } from "@/lib/mock-data";

/**
 * GET /api/skill-gap
 *
 * Returns skill gap analysis for authenticated user
 * Shows:
 * - Skill Match Percentage
 * - Missing Skills (critical, important, nice-to-have)
 * - Recommended Learning Order
 * - Estimated Timeline
 *
 * Response: { analysis: SkillGapAnalysis }
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
        const fetchedProfile = await getStudentProfile(user.id).catch(() => null);
        if (fetchedProfile) {
          profile = fetchedProfile;
        }
      }
    } catch (error) {
      console.log("Using mock data for skill gap analysis");
    }

    // Analyze skill gaps
    const analysis = analyzeSkillGaps(profile);

    return NextResponse.json({ analysis });
  } catch (error) {
    console.error("Error in skill gap analysis:", error);
    return NextResponse.json(
      { error: "Failed to analyze skill gaps" },
      { status: 500 }
    );
  }
}
