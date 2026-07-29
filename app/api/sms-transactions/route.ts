import { NextRequest, NextResponse } from "next/server";
import {
  collection,
  addDoc,
  query,
  where,
  getDocs,
  updateDoc,
  doc,
  Timestamp,
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import type { SmsDetectedTransaction } from "@/types";

/**
 * GET /api/sms-transactions?userId=...&status=...
 * Fetch SMS detected transactions
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");
    const status = searchParams.get("status");

    if (!userId) {
      return NextResponse.json({ error: "userId is required" }, { status: 400 });
    }

    const constraints = [where("userId", "==", userId)];
    if (status) {
      constraints.push(where("status", "==", status));
    }

    const q = query(collection(db, "sms_transactions"), ...constraints);
    const snapshot = await getDocs(q);
    const transactions: (SmsDetectedTransaction & { firestoreId: string })[] = [];

    snapshot.forEach((docSnapshot) => {
      const data = docSnapshot.data();
      transactions.push({
        id: docSnapshot.id,
        firestoreId: docSnapshot.id,
        merchant: data.merchant,
        category: data.category,
        amount: data.amount,
        date: data.date.toDate().toISOString().split("T")[0],
        paymentMethod: data.paymentMethod,
        confidence: data.confidence,
        status: data.status,
        aiTagged: data.aiTagged,
      });
    });

    return NextResponse.json({ transactions });
  } catch (error) {
    console.error("GET /api/sms-transactions error:", error);
    return NextResponse.json(
      { error: "Failed to fetch SMS transactions" },
      { status: 500 }
    );
  }
}

/**
 * POST /api/sms-transactions
 * Create a new SMS detected transaction
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { userId, merchant, category, amount, date, paymentMethod, confidence } = body;

    if (!userId || !merchant || !category || !amount || !date) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const docRef = await addDoc(collection(db, "sms_transactions"), {
      userId,
      merchant,
      category,
      amount: parseFloat(amount),
      date: Timestamp.fromDate(new Date(date)),
      paymentMethod: paymentMethod || "Unknown",
      confidence: confidence || 85,
      status: "pending",
      aiTagged: true,
      createdAt: Timestamp.now(),
    });

    return NextResponse.json({
      id: docRef.id,
      message: "SMS transaction created successfully",
    });
  } catch (error) {
    console.error("POST /api/sms-transactions error:", error);
    return NextResponse.json(
      { error: "Failed to create SMS transaction" },
      { status: 500 }
    );
  }
}
