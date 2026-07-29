import { NextRequest, NextResponse } from "next/server";
import {
  collection,
  query,
  where,
  getDocs,
  Timestamp,
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import type { AlertItem } from "@/types";

/**
 * GET /api/expenses/alerts?userId=...
 * Generate smart alerts based on spending patterns
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");

    if (!userId) {
      return NextResponse.json({ error: "userId is required" }, { status: 400 });
    }

    // Fetch user profile for budget
    const profileQuery = query(
      collection(db, "profiles"),
      where("userId", "==", userId)
    );
    const profileSnapshot = await getDocs(profileQuery);
    if (profileSnapshot.empty) {
      return NextResponse.json({ alerts: [] });
    }

    const monthlyBudget = profileSnapshot.docs[0].data().monthlyBudget || 12000;

    // Get current month expenses
    const now = new Date();
    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
    const monthEnd = new Date(now.getFullYear(), now.getMonth() + 1, 0);

    const expenseQuery = query(
      collection(db, "expenses"),
      where("userId", "==", userId),
      where("date", ">=", Timestamp.fromDate(monthStart)),
      where("date", "<=", Timestamp.fromDate(monthEnd))
    );

    const expenseSnapshot = await getDocs(expenseQuery);
    const expenses: any[] = [];
    let totalSpent = 0;
    const categorySpending: Record<string, number> = {};
    const lastWeekSpending: Record<string, number> = {};

    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);

    expenseSnapshot.forEach((doc) => {
      const data = doc.data();
      const expDate = data.date.toDate();
      expenses.push(data);
      totalSpent += data.amount;
      categorySpending[data.category] =
        (categorySpending[data.category] || 0) + data.amount;

      if (expDate >= weekAgo) {
        lastWeekSpending[data.category] =
          (lastWeekSpending[data.category] || 0) + data.amount;
      }
    });

    const alerts: AlertItem[] = [];
    const percentUsed = Math.round((totalSpent / monthlyBudget) * 100);

    // Alert 1: Budget usage
    if (percentUsed >= 80) {
      alerts.push({
        id: "a1",
        type: "budget",
        title: `Budget ${percentUsed}% used`,
        detail: `You've used ₹${totalSpent} of your ₹${monthlyBudget} monthly budget.`,
        severity: percentUsed >= 100 ? "danger" : "warning",
      });
    }

    // Alert 2: High spending detection
    const topCategory = Object.entries(categorySpending).reduce((a, b) =>
      a[1] > b[1] ? a : b
    );
    if (lastWeekSpending[topCategory[0]]) {
      const thisWeekTop = lastWeekSpending[topCategory[0]];
      const lastMonthAvg = totalSpent / expenses.length;
      if (thisWeekTop > lastMonthAvg * 1.35) {
        alerts.push({
          id: "a2",
          type: "spending",
          title: "High spending detected",
          detail: `${topCategory[0]} spending is significantly higher than usual this week.`,
          severity: "warning",
        });
      }
    }

    // Alert 3: Large transaction
    const largestExpense = expenses.reduce((a, b) =>
      a.amount > b.amount ? a : b
    );
    if (largestExpense && largestExpense.amount > monthlyBudget * 0.15) {
      alerts.push({
        id: "a3",
        type: "unusual",
        title: "Unusual transaction",
        detail: `₹${largestExpense.amount} at ${largestExpense.merchant} is larger than your usual transactions.`,
        severity: "warning",
      });
    }

    // Alert 4: Days remaining in month
    const daysInMonth = new Date(
      now.getFullYear(),
      now.getMonth() + 1,
      0
    ).getDate();
    const daysRemaining = daysInMonth - now.getDate();
    const dailyBudget = (monthlyBudget - totalSpent) / daysRemaining;

    if (dailyBudget < 100) {
      alerts.push({
        id: "a4",
        type: "budget",
        title: "Low daily budget remaining",
        detail: `Only ₹${Math.round(dailyBudget)} per day available for ${daysRemaining} days.`,
        severity: "danger",
      });
    }

    // Alert 5: Weekly summary
    if (expenses.length > 0) {
      alerts.push({
        id: "a5",
        type: "summary",
        title: "Weekly summary available",
        detail: `Your spending recap for this week is ready. Review to stay on track.`,
        severity: "info",
      });
    }

    return NextResponse.json({ alerts });
  } catch (error) {
    console.error("GET /api/expenses/alerts error:", error);
    return NextResponse.json(
      { error: "Failed to generate alerts", alerts: [] },
      { status: 500 }
    );
  }
}
