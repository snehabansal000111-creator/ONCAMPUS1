import { NextResponse } from "next/server";
import { askAssistant } from "@/lib/claude";
import { currentStudent } from "@/lib/mock-data";

/**
 * POST /api/chat
 * Body: { message: string }
 *
 * In production, swap `currentStudent` for the authenticated user's
 * profile fetched from Supabase.
 */
export async function POST(request: Request) {
  try {
    const { message } = await request.json();

    if (!message || typeof message !== "string") {
      return NextResponse.json({ error: "message is required" }, { status: 400 });
    }

    const reply = await askAssistant(currentStudent, message);
    return NextResponse.json({ reply });
  } catch (error) {
    console.error("chat route error", error);
    return NextResponse.json(
      { error: "Something went wrong talking to the assistant." },
      { status: 500 }
    );
  }
}
