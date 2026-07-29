import { NextRequest, NextResponse } from "next/server";
import {
  collection,
  addDoc,
  query,
  where,
  getDocs,
  orderBy,
  Timestamp,
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import type { Transaction } from "@/types";

/**
 * GET /api/expenses?userId=...&month=...&category=...
 * Fetch expenses with optional filtering
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");
    const month = searchParams.get("month");
    const category = searchParams.get("category");

    if (!userId) {
      return NextResponse.json({ error: "userId is required" }, { status: 400 });
    }

    const constraints = [where("userId", "==", userId)];

    if (month) {
      const [year, monthNum] = month.split("-");
      const startDate = new Date(parseInt(year), parseInt(monthNum) - 1, 1);
      const endDate = new Date(parseInt(year), parseInt(monthNum), 0);
      constraints.push(
        where("date", ">=", Timestamp.fromDate(startDate)),
        where("date", "<=", Timestamp.fromDate(endDate))
      );
    }

    const q = query(
      collection(db, "expenses"),
      ...constraints,
      orderBy("date", "desc")
    );

    const snapshot = await getDocs(q);
    const expenses: (Transaction & { firestoreId: string })[] = [];

    snapshot.forEach((doc) => {
      const data = doc.data();

      if (category && data.category !== category) {
        return;
      }

      expenses.push({
        id: doc.id,
        firestoreId: doc.id,
        merchant: data.merchant,
        category: data.category,
        amount: data.amount,
        date: data.date.toDate().toISOString().split("T")[0],
        paymentMethod: data.paymentMethod,
        aiTagged: data.aiTagged || false,
      });
    });

    return NextResponse.json({ expenses });
  } catch (error) {
    console.error("GET /api/expenses error:", error);
    return NextResponse.json(
      { error: "Failed to fetch expenses" },
      { status: 500 }
    );
  }
}

/**
 * POST /api/expenses
 * Create a new expense
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { userId, merchant, category, amount, date, paymentMethod, aiTagged } = body;

    if (!userId || !merchant || !category || !amount || !date) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const docRef = await addDoc(collection(db, "expenses"), {
      userId,
      merchant,
      category,
      amount: parseFloat(amount),
      date: Timestamp.fromDate(new Date(date)),
      paymentMethod: paymentMethod || "Unknown",
      aiTagged: aiTagged || false,
      createdAt: Timestamp.now(),
    });

    return NextResponse.json({
      id: docRef.id,
      message: "Expense created successfully",
    });
  } catch (error) {
    console.error("POST /api/expenses error:", error);
    return NextResponse.json(
      { error: "Failed to create expense" },
      { status: 500 }
    );
  }
}
