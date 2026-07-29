import { NextRequest, NextResponse } from "next/server";
import { doc, getDoc, updateDoc, Timestamp, addDoc, collection } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { categorizeTransaction } from "@/lib/sms-parser";

/**
 * GET /api/sms-transactions/[id]
 * Fetch a single SMS transaction with full details
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  try {
    const docRef = doc(db, "sms_transactions", id);
    const snapshot = await getDoc(docRef);

    if (!snapshot.exists()) {
      return NextResponse.json(
        { error: "SMS transaction not found" },
        { status: 404 }
      );
    }

    const data = snapshot.data();
    return NextResponse.json({
      id: snapshot.id,
      merchant: data.merchant,
      category: data.category,
      amount: data.amount,
      date: data.date.toDate().toISOString().split("T")[0],
      paymentMethod: data.paymentMethod,
      confidence: data.confidence,
      status: data.status,
      rawMessage: data.rawMessage, // For review/edit context
      rawSender: data.rawSender,
      createdAt: data.createdAt?.toDate(),
    });
  } catch (error) {
    console.error("GET /api/sms-transactions/[id] error:", error);
    return NextResponse.json(
      { error: "Failed to fetch SMS transaction" },
      { status: 500 }
    );
  }
}

/**
 * PUT /api/sms-transactions/[id]
 *
 * Update SMS transaction (status, edit fields, or convert to expense)
 *
 * Query action parameter:
 * - status: "pending" | "accepted" | "ignored"
 * - accept: convert to regular expense and mark accepted
 * - reject: mark as ignored
 * - edit: update merchant, category, amount, paymentMethod
 *
 * Body for edit:
 * {
 *   "merchant": "new merchant",
 *   "category": "Food",
 *   "amount": 500,
 *   "paymentMethod": "UPI"
 * }
 */
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  try {
    const body = await request.json();
    const { searchParams } = new URL(request.url);
    const action = searchParams.get("action") || "status";
    console.log("[SMS Route] Received action:", action, "for id:", id);

    const docRef = doc(db, "sms_transactions", id);
    const snapshot = await getDoc(docRef);

    if (!snapshot.exists()) {
      console.log("[SMS Route] SMS transaction not found:", id);
      return NextResponse.json(
        { error: "SMS transaction not found" },
        { status: 404 }
      );
    }

    const data = snapshot.data();
    console.log("[SMS Route] SMS data retrieved, action:", action);

    if (action === "accept") {
      console.log("[SMS Route Accept] Processing accept action");
      // Convert to regular expense and mark accepted
      const userId = data.userId;

      console.log("[SMS Accept API] Processing SMS ID:", id);
      console.log("[SMS Accept API] SMS data:", {
        userId,
        merchant: data.merchant,
        category: data.category,
        amount: data.amount,
        date: data.date,
        paymentMethod: data.paymentMethod,
      });

      // Create expense
      const expenseRef = await addDoc(collection(db, "expenses"), {
        userId,
        merchant: data.merchant,
        category: data.category,
        amount: data.amount,
        date: data.date,
        paymentMethod: data.paymentMethod,
        aiTagged: data.aiTagged || true,
        createdAt: Timestamp.now(),
        source: "sms", // Track SMS origin
      });

      console.log("[SMS Accept API] Expense created:", {
        expenseId: expenseRef.id,
        userId,
        amount: data.amount,
      });

      // Update SMS status
      await updateDoc(docRef, {
        status: "accepted",
        linkedExpenseId: expenseRef.id,
        updatedAt: Timestamp.now(),
      });

      return NextResponse.json({
        message: "SMS transaction accepted and converted to expense",
        expenseId: expenseRef.id,
      });
    } else if (action === "reject") {
      // Mark as ignored
      await updateDoc(docRef, {
        status: "ignored",
        rejectionReason: body.reason || "User rejected",
        updatedAt: Timestamp.now(),
      });

      return NextResponse.json({ message: "SMS transaction rejected" });
    } else if (action === "edit") {
      // Edit transaction details
      const { merchant, category, amount, paymentMethod } = body;

      const updateData: Record<string, any> = {};

      if (merchant) updateData.merchant = merchant;
      if (category) updateData.category = category;
      if (amount) updateData.amount = parseFloat(amount);
      if (paymentMethod) updateData.paymentMethod = paymentMethod;

      // Auto-categorize if amount changed
      if (amount && !category) {
        updateData.category = categorizeTransaction(
          merchant || data.merchant,
          parseFloat(amount)
        );
      }

      updateData.updatedAt = Timestamp.now();
      updateData.manuallyEdited = true;

      await updateDoc(docRef, updateData);

      return NextResponse.json({
        message: "SMS transaction edited successfully",
        updated: updateData,
      });
    } else {
      // Default: update status
      const { status } = body;

      if (!status || !["pending", "accepted", "ignored"].includes(status)) {
        return NextResponse.json(
          {
            error:
              "Invalid status. Must be pending, accepted, or ignored. Use ?action=accept or ?action=reject for workflows.",
          },
          { status: 400 }
        );
      }

      await updateDoc(docRef, {
        status,
        updatedAt: Timestamp.now(),
      });

      return NextResponse.json({ message: "SMS transaction status updated" });
    }
  } catch (error) {
    console.error("PUT /api/sms-transactions/[id] error:", error);
    return NextResponse.json(
      { error: "Failed to update SMS transaction" },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/sms-transactions/[id]
 * Delete a pending SMS transaction
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  try {
    const docRef = doc(db, "sms_transactions", id);
    const snapshot = await getDoc(docRef);

    if (!snapshot.exists()) {
      return NextResponse.json(
        { error: "SMS transaction not found" },
        { status: 404 }
      );
    }

    const data = snapshot.data();

    // Can only delete pending transactions
    if (data.status !== "pending") {
      return NextResponse.json(
        {
          error: `Cannot delete ${data.status} transaction. Only pending transactions can be deleted.`,
        },
        { status: 400 }
      );
    }

    await updateDoc(docRef, {
      status: "deleted",
      deletedAt: Timestamp.now(),
    });

    return NextResponse.json({ message: "SMS transaction deleted" });
  } catch (error) {
    console.error("DELETE /api/sms-transactions/[id] error:", error);
    return NextResponse.json(
      { error: "Failed to delete SMS transaction" },
      { status: 500 }
    );
  }
}
