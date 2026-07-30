import { NextRequest, NextResponse } from "next/server";
import { getMentorById } from "@/lib/mentor-service";

/**
 * GET /api/mentors/[id]
 * Fetch mentor by ID
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const mentor = await getMentorById(id);

    if (!mentor) {
      return NextResponse.json(
        { error: "Mentor not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ mentor });
  } catch (error) {
    console.error("[API] GET /mentors/[id] error:", error);
    return NextResponse.json(
      { error: "Failed to fetch mentor" },
      { status: 500 }
    );
  }
}
