import { NextRequest, NextResponse } from "next/server";
import { updateItemStatus, getUserProgress } from "@/lib/roadmap-service";

/**
 * PUT /api/roadmap/[itemId]?userId=...&status=...
 * Update roadmap item status
 */
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ itemId: string }> }
) {
  try {
    const { itemId } = await params;
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");
    const status = searchParams.get("status") as
      | "done"
      | "in-progress"
      | "upcoming"
      | null;

    if (!userId) {
      return NextResponse.json(
        { error: "userId is required" },
        { status: 400 }
      );
    }

    if (!status || !["done", "in-progress", "upcoming"].includes(status)) {
      return NextResponse.json(
        { error: "status must be 'done', 'in-progress', or 'upcoming'" },
        { status: 400 }
      );
    }

    await updateItemStatus(userId, itemId, status);

    console.log(
      `[API] Updated item ${itemId} status to ${status} for userId: ${userId}`
    );

    return NextResponse.json({
      message: "Roadmap item updated",
      itemId,
      status,
    });
  } catch (error) {
    console.error("[API] PUT /roadmap/[itemId] error:", error);
    return NextResponse.json(
      { error: "Failed to update roadmap item" },
      { status: 500 }
    );
  }
}

/**
 * GET /api/roadmap/[itemId]/progress?userId=...
 * Get progress for an item
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ itemId: string }> }
) {
  try {
    const { itemId } = await params;
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");

    if (!userId) {
      return NextResponse.json(
        { error: "userId is required" },
        { status: 400 }
      );
    }

    const progress = await getUserProgress(userId);
    const itemProgress = progress.find((p) => p.itemId === itemId);

    if (!itemProgress) {
      return NextResponse.json(
        { error: "Progress not found for item" },
        { status: 404 }
      );
    }

    return NextResponse.json({ progress: itemProgress });
  } catch (error) {
    console.error("[API] GET /roadmap/[itemId] error:", error);
    return NextResponse.json(
      { error: "Failed to fetch progress" },
      { status: 500 }
    );
  }
}
