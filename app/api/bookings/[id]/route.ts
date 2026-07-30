import { NextRequest, NextResponse } from "next/server";
import { cancelBooking } from "@/lib/mentor-service";

/**
 * PUT /api/bookings/[id]
 * Cancel a booking
 */
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    await cancelBooking(id);
    return NextResponse.json({ message: "Booking cancelled successfully" });
  } catch (error) {
    console.error("[API] PUT /bookings/[id] error:", error);
    return NextResponse.json(
      { error: "Failed to cancel booking" },
      { status: 500 }
    );
  }
}
