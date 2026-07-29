import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { recordQuizCompletion } from "@/lib/progress/progress-service";

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { quizId, score } = await request.json();

    if (!quizId || typeof quizId !== "string") {
      return NextResponse.json(
        { error: "Quiz ID is required" },
        { status: 400 }
      );
    }

    if (
      typeof score !== "number" ||
      score < 0 ||
      score > 100 ||
      !Number.isInteger(score)
    ) {
      return NextResponse.json(
        { error: "Score must be an integer between 0 and 100" },
        { status: 400 }
      );
    }

    const result = await recordQuizCompletion(user.id, quizId, score);

    return NextResponse.json({
      quizProgress: result,
    });
  } catch (error) {
    console.error("Error recording quiz completion:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Internal server error" },
      { status: 500 }
    );
  }
}
