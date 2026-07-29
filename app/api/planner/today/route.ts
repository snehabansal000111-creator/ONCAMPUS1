import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { getTodaysTasks } from "@/lib/planner/planner-service";

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient();

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const tasks = await getTodaysTasks(user.id);

    return NextResponse.json({
      tasks,
      date: new Date().toISOString().split("T")[0],
    });
  } catch (error) {
    console.error("Error fetching today's tasks:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Internal server error" },
      { status: 500 }
    );
  }
}
