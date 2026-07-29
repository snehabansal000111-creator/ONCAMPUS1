import { NextRequest, NextResponse } from "next/server";
import {
  collection,
  query,
  where,
  getDocs,
  Timestamp,
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import { askAssistant } from "@/lib/claude";
import type { StudentProfile } from "@/types";

/**
 * GET /api/expenses/insights?userId=...&month=...
 * Generate AI insights for expenses
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");
    const month = searchParams.get("month") || new Date().toISOString().substring(0, 7);

    if (!userId) {
      return NextResponse.json({ error: "userId is required" }, { status: 400 });
    }

    // Fetch user profile
    const profileQuery = query(
      collection(db, "profiles"),
      where("userId", "==", userId)
    );
    const profileSnapshot = await getDocs(profileQuery);
    if (profileSnapshot.empty) {
      return NextResponse.json(
        { error: "User profile not found" },
        { status: 404 }
      );
    }

    const profileData = profileSnapshot.docs[0].data() as StudentProfile;

    // Fetch expenses for the month
    const [year, monthNum] = month.split("-");
    const startDate = new Date(parseInt(year), parseInt(monthNum) - 1, 1);
    const endDate = new Date(parseInt(year), parseInt(monthNum), 0);

    const expenseQuery = query(
      collection(db, "expenses"),
      where("userId", "==", userId),
      where("date", ">=", Timestamp.fromDate(startDate)),
      where("date", "<=", Timestamp.fromDate(endDate))
    );

    const expenseSnapshot = await getDocs(expenseQuery);
    const expenses: any[] = [];
    let totalSpent = 0;
    const spendingByCategory: Record<string, number> = {};

    expenseSnapshot.forEach((doc) => {
      const data = doc.data();
      expenses.push({
        merchant: data.merchant,
        category: data.category,
        amount: data.amount,
        date: data.date.toDate().toLocaleDateString(),
      });
      totalSpent += data.amount;
      spendingByCategory[data.category] =
        (spendingByCategory[data.category] || 0) + data.amount;
    });

    const summaryText = `
Student: ${profileData.name}
Monthly Budget: ₹${profileData.monthlyBudget}
Total Spent This Month: ₹${totalSpent}
Spending by Category: ${JSON.stringify(spendingByCategory, null, 2)}
Recent Expenses: ${JSON.stringify(expenses, null, 2)}
    `.trim();

    const prompt = `
You are a financial advisor for a college student. Analyze their spending data and provide 3 concise, actionable AI insights about their expenses. Focus on:
1. Biggest spending category and trend
2. Spending comparison to budget
3. One specific, quantifiable savings opportunity

Format as bullet points. Be encouraging but honest. Include specific amounts and actionable steps.

Data:
${summaryText}
    `.trim();

    const reply = await askAssistant(profileData, prompt);

    // Parse the response into structured insights
    const insights = reply.split("\n").filter((line: string) => line.trim().length > 0);

    return NextResponse.json({
      summary: `Total: ₹${totalSpent} of ₹${profileData.monthlyBudget} budget used`,
      insights: insights.slice(0, 3),
      rawResponse: reply,
    });
  } catch (error) {
    console.error("GET /api/expenses/insights error:", error);
    return NextResponse.json(
      { error: "Failed to generate insights" },
      { status: 500 }
    );
  }
}
