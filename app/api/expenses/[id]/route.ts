import { NextRequest, NextResponse } from "next/server";
import { doc, getDoc, updateDoc, deleteDoc, Timestamp } from "firebase/firestore";
import { db } from "@/lib/firebase";

/**
 * GET /api/expenses/[id]
 * Fetch a single expense
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  try {
    const docRef = doc(db, "expenses", id);
    const snapshot = await getDoc(docRef);

    if (!snapshot.exists()) {
      return NextResponse.json({ error: "Expense not found" }, { status: 404 });
    }

    const data = snapshot.data();
    return NextResponse.json({
      id: snapshot.id,
      merchant: data.merchant,
      category: data.category,
      amount: data.amount,
      date: data.date.toDate().toISOString().split("T")[0],
      paymentMethod: data.paymentMethod,
      aiTagged: data.aiTagged,
    });
  } catch (error) {
    console.error("GET /api/expenses/[id] error:", error);
    return NextResponse.json(
      { error: "Failed to fetch expense" },
      { status: 500 }
    );
  }
}

/**
 * PUT /api/expenses/[id]
 * Update an expense
 */
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  try {
    const body = await request.json();
    const { merchant, category, amount, date, paymentMethod, aiTagged } = body;

    const docRef = doc(db, "expenses", id);
    const snapshot = await getDoc(docRef);

    if (!snapshot.exists()) {
      return NextResponse.json({ error: "Expense not found" }, { status: 404 });
    }

    const updateData: Record<string, any> = {};
    if (merchant) updateData.merchant = merchant;
    if (category) updateData.category = category;
    if (amount) updateData.amount = parseFloat(amount);
    if (date) updateData.date = Timestamp.fromDate(new Date(date));
    if (paymentMethod) updateData.paymentMethod = paymentMethod;
    if (aiTagged !== undefined) updateData.aiTagged = aiTagged;

    updateData.updatedAt = Timestamp.now();

    await updateDoc(docRef, updateData);

    return NextResponse.json({ message: "Expense updated successfully" });
  } catch (error) {
    console.error("PUT /api/expenses/[id] error:", error);
    return NextResponse.json(
      { error: "Failed to update expense" },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/expenses/[id]
 * Delete an expense
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  try {
    const docRef = doc(db, "expenses", id);
    const snapshot = await getDoc(docRef);

    if (!snapshot.exists()) {
      return NextResponse.json({ error: "Expense not found" }, { status: 404 });
    }

    await deleteDoc(docRef);

    return NextResponse.json({ message: "Expense deleted successfully" });
  } catch (error) {
    console.error("DELETE /api/expenses/[id] error:", error);
    return NextResponse.json(
      { error: "Failed to delete expense" },
      { status: 500 }
    );
  }
}
