import { NextRequest, NextResponse } from "next/server";
import {
  createBooking,
  getStudentBookings,
} from "@/lib/mentor-service";

/**
 * POST /api/bookings
 * Create a new booking
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { studentId, mentorId, mentorName, date, time, duration } = body;

    if (!studentId || !mentorId || !mentorName || !date || !time || !duration) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const bookingId = await createBooking(
      studentId,
      mentorId,
      mentorName,
      date,
      time,
      duration
    );

    return NextResponse.json({ bookingId, message: "Booking created successfully" });
  } catch (error) {
    console.error("[API] POST /bookings error:", error);
    return NextResponse.json(
      { error: "Failed to create booking" },
      { status: 500 }
    );
  }
}

/**
 * GET /api/bookings?userId=...
 * Fetch user's bookings
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

    const bookings = await getStudentBookings(userId);
    return NextResponse.json({ bookings });
  } catch (error) {
    console.error("[API] GET /bookings error:", error);
    return NextResponse.json(
      { error: "Failed to fetch bookings" },
      { status: 500 }
    );
  }
}
