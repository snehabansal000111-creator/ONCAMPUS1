import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { recordProjectProgress } from "@/lib/progress/progress-service";

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { projectTitle, status, notes } = await request.json();

    if (!projectTitle || typeof projectTitle !== "string" || projectTitle.trim().length === 0) {
      return NextResponse.json(
        { error: "Project title is required and must be a non-empty string" },
        { status: 400 }
      );
    }

    const validStatuses = ["started", "in-progress", "completed"];
    if (status && !validStatuses.includes(status)) {
      return NextResponse.json(
        { error: `Status must be one of: ${validStatuses.join(", ")}` },
        { status: 400 }
      );
    }

    const result = await recordProjectProgress(
      user.id,
      projectTitle.trim(),
      status || "started",
      notes
    );

    return NextResponse.json({
      projectProgress: result,
    });
  } catch (error) {
    console.error("Error recording project progress:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Internal server error" },
      { status: 500 }
    );
  }
}
