import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { getLearningState, getProgressView, getRecommendedNextStep } from "@/lib/integration/orchestrator";

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient();

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const [learningState, progressView, nextStep] = await Promise.all([
      getLearningState(user.id),
      getProgressView(user.id),
      getRecommendedNextStep(user.id),
    ]);

    return NextResponse.json({
      learning_state: learningState,
      progress_view: progressView,
      next_step: nextStep,
    });
  } catch (error) {
    console.error("Error fetching dashboard data:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Internal server error" },
      { status: 500 }
    );
  }
}
