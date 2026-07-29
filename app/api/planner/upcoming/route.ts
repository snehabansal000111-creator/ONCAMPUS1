import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { getUpcomingTasks } from "@/lib/planner/planner-service";

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient();

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const searchParams = request.nextUrl.searchParams;
    const days = parseInt(searchParams.get("days") || "7", 10);

    if (days < 1 || days > 365) {
      return NextResponse.json(
        { error: "Days must be between 1 and 365" },
        { status: 400 }
      );
    }

    const tasks = await getUpcomingTasks(user.id, days);

    return NextResponse.json({
      tasks,
      days_requested: days,
    });
  } catch (error) {
    console.error("Error fetching upcoming tasks:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Internal server error" },
      { status: 500 }
    );
  }
}
