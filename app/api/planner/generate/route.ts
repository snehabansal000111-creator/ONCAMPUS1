import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { getRoadmap } from "@/lib/supabase/roadmap";
import { generateDailyPlan } from "@/lib/planner/planner-service";

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { startDate } = await request.json();

    // Get user's roadmap
    const roadmap = await getRoadmap(user.id);

    if (!roadmap) {
      return NextResponse.json(
        { error: "No roadmap found. Please generate a roadmap first." },
        { status: 400 }
      );
    }

    // Generate daily plan
    const dailyPlan = await generateDailyPlan(
      user.id,
      roadmap,
      startDate
    );

    return NextResponse.json({
      dailyPlan,
    });
  } catch (error) {
    console.error("Error generating daily plan:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Internal server error" },
      { status: 500 }
    );
  }
}
