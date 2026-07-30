import { NextRequest, NextResponse } from "next/server";
import { collection, addDoc, Timestamp } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { categorizeTransaction } from "@/lib/sms-parser";

/**
 * POST /api/sms-test
 * Create test SMS transaction for development/testing
 *
 * Body:
 * {
 *   "userId": "user123",
 *   "merchant": "Zomato",
 *   "amount": 340,
 *   "message": "Debit alert on A/C XXXXX. Your a/c has been debited for Rs.340/- at ZOMATO..."
 * }
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { userId, merchant, amount, message } = body;

    if (!userId || !merchant || !amount) {
      return NextResponse.json(
        { error: "Missing required fields: userId, merchant, amount" },
        { status: 400 }
      );
    }

    // Validate amount
    if (amount <= 0 || amount > 1000000) {
      return NextResponse.json(
        { error: "Invalid amount (must be between 0 and 1000000)" },
        { status: 400 }
      );
    }

    const category = categorizeTransaction(merchant, amount);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Create test SMS transaction
    const docRef = await addDoc(collection(db, "sms_transactions"), {
      userId,
      merchant,
      category,
      amount: parseFloat(amount),
      date: Timestamp.fromDate(today),
      paymentMethod: "Unknown",
      confidence: 95,
      status: "pending",
      aiTagged: true,
      rawSender: "TEST_BANK",
      rawMessage: message || `Test SMS: Debit alert for Rs.${amount} at ${merchant}`,
      createdAt: Timestamp.now(),
      source: "test",
    });

    return NextResponse.json({
      id: docRef.id,
      message: "Test SMS transaction created successfully",
      transaction: {
        id: docRef.id,
        merchant,
        category,
        amount,
        date: today.toISOString().split("T")[0],
      },
    });
  } catch (error) {
    console.error("POST /api/sms-test error:", error);
    return NextResponse.json(
      { error: "Failed to create test SMS", details: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 }
    );
  }
}
