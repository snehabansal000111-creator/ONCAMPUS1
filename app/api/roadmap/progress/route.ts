import { NextRequest, NextResponse } from "next/server";
import { getUserProgress } from "@/lib/roadmap-service";

/**
 * GET /api/roadmap/progress?userId=...
 * Get all progress items for a user
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");

    if (!userId) {
      return NextResponse.json(
        { error: "userId is required" },
        { status: 400 }
      );
    }

    const progress = await getUserProgress(userId);

    return NextResponse.json({
      progress,
      count: progress.length,
    });
  } catch (error) {
    console.error("[API] GET /roadmap/progress error:", error);
    return NextResponse.json(
      { error: "Failed to fetch progress" },
      { status: 500 }
    );
  }
}
