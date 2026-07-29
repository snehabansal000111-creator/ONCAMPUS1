import { NextRequest, NextResponse } from "next/server";
import {
  collection,
  query,
  where,
  getDocs,
  Timestamp,
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import type { ExpenseCategory } from "@/types";

/**
 * GET /api/expenses/stats?userId=...&month=...
 * Get spending statistics for the month
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");
    const month = searchParams.get("month") || new Date().toISOString().substring(0, 7);

    if (!userId) {
      return NextResponse.json({ error: "userId is required" }, { status: 400 });
    }

    const [year, monthNum] = month.split("-");
    const startDate = new Date(parseInt(year), parseInt(monthNum) - 1, 1);
    // Last day of the month: get first day of next month, then subtract 1ms
    const nextMonth = new Date(parseInt(year), parseInt(monthNum), 1);
    const endDate = new Date(nextMonth.getTime() - 1);

    const q = query(
      collection(db, "expenses"),
      where("userId", "==", userId),
      where("date", ">=", Timestamp.fromDate(startDate)),
      where("date", "<=", Timestamp.fromDate(endDate))
    );

    const snapshot = await getDocs(q);
    const expenses: any[] = [];
    const spendingByCategory: Record<ExpenseCategory, number> = {
      Food: 0,
      Shopping: 0,
      Transport: 0,
      Education: 0,
      Entertainment: 0,
      "Hostel/PG": 0,
      Health: 0,
      Others: 0,
    };

    let totalSpent = 0;

    snapshot.forEach((doc) => {
      const data = doc.data();
      expenses.push({
        id: doc.id,
        ...data,
      });
      totalSpent += data.amount;
      if (spendingByCategory.hasOwnProperty(data.category)) {
        spendingByCategory[data.category as ExpenseCategory] += data.amount;
      } else {
        spendingByCategory.Others += data.amount;
      }
    });

    console.log(`[API Stats] userId: ${userId}, month: ${month}, found ${expenses.length} expenses, totalSpent: ${totalSpent}`);
    expenses.forEach((exp, i) => {
      console.log(`[API Stats] Expense ${i+1}: merchant=${exp.merchant}, category=${exp.category}, amount=${exp.amount}, source=${exp.source || 'manual'}`);
    });

    // Get user budget from student profile (we'll fetch from a profiles collection)
    const profileQuery = query(
      collection(db, "profiles"),
      where("userId", "==", userId)
    );
    const profileSnapshot = await getDocs(profileQuery);
    const monthlyBudget = profileSnapshot.docs[0]?.data()?.monthlyBudget || 12000;

    const remaining = Math.max(0, monthlyBudget - totalSpent);
    const percentUsed = Math.round((totalSpent / monthlyBudget) * 100);

    const response = {
      monthlyBudget,
      totalSpent,
      remaining,
      percentUsed,
      spendingByCategory,
      expenseCount: expenses.length,
    };

    console.log(`[API Stats] Response: ${JSON.stringify(response)}`);

    return NextResponse.json(response);
  } catch (error) {
    console.error("GET /api/expenses/stats error:", error);
    return NextResponse.json(
      { error: "Failed to fetch statistics" },
      { status: 500 }
    );
  }
}
