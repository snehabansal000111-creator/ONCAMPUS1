import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { recordRoadmapItemCompletion } from "@/lib/progress/progress-service";

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { roadmapId, itemTitle, phase } = await request.json();

    if (!roadmapId || typeof roadmapId !== "string") {
      return NextResponse.json(
        { error: "Roadmap ID is required" },
        { status: 400 }
      );
    }

    if (!itemTitle || typeof itemTitle !== "string" || itemTitle.trim().length === 0) {
      return NextResponse.json(
        { error: "Item title is required and must be a non-empty string" },
        { status: 400 }
      );
    }

    const validPhases = ["beginner", "intermediate", "advanced"];
    if (!phase || !validPhases.includes(phase)) {
      return NextResponse.json(
        { error: `Phase must be one of: ${validPhases.join(", ")}` },
        { status: 400 }
      );
    }

    const result = await recordRoadmapItemCompletion(
      user.id,
      roadmapId,
      itemTitle.trim(),
      phase
    );

    return NextResponse.json({
      roadmapItemProgress: result,
    });
  } catch (error) {
    console.error("Error recording roadmap item completion:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Internal server error" },
      { status: 500 }
    );
  }
}
