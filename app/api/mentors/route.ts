import { NextRequest, NextResponse } from "next/server";
import { getAllMentors } from "@/lib/mentor-service";

/**
 * GET /api/mentors
 * Fetch all mentors
 */
export async function GET(request: NextRequest) {
  try {
    const mentors = await getAllMentors();
    return NextResponse.json({ mentors });
  } catch (error) {
    console.error("[API] GET /mentors error:", error);
    return NextResponse.json(
      { error: "Failed to fetch mentors" },
      { status: 500 }
    );
  }
}
