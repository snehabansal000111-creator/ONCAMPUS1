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
import {
  buildFinancialAnalysisPrompt,
  buildWeeklyAnalysisPrompt,
  buildMonthlyAnalysisPrompt,
  buildSavingsSuggestionPrompt,
  buildHealthScorePrompt,
  buildAnomalyDetectionPrompt,
} from "@/lib/ai-prompts/financial-analysis";

/**
 * GET /api/ai-financial-assistant?userId=...&analysisType=...
 *
 * analysisType options:
 * - full: Complete financial analysis
 * - budget: Budget remaining, predictions
 * - weekly: Weekly summary
 * - monthly: Monthly summary
 * - savings: Savings suggestions
 * - health: Financial health score
 * - anomalies: Unusual transaction detection
 *
 * Returns structured JSON with insights
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");
    const analysisType = searchParams.get("analysisType") || "full";
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

    const profile = profileSnapshot.docs[0].data() as StudentProfile;

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
    const weeklySpending: number[] = [0, 0, 0, 0];

    expenseSnapshot.forEach((doc) => {
      const data = doc.data();
      const expDate = data.date.toDate();

      expenses.push({
        merchant: data.merchant,
        category: data.category,
        amount: data.amount,
        date: expDate.toISOString().split("T")[0],
      });

      totalSpent += data.amount;
      spendingByCategory[data.category] =
        (spendingByCategory[data.category] || 0) + data.amount;

      // Weekly breakdown
      const week = Math.floor((expDate.getDate() - 1) / 7);
      weeklySpending[week] = (weeklySpending[week] || 0) + data.amount;
    });

    const monthlyBudget = profile.monthlyBudget || 12000;
    const remaining = Math.max(0, monthlyBudget - totalSpent);
    const percentUsed = Math.round((totalSpent / monthlyBudget) * 100);
    const daysInMonth = endDate.getDate();
    const today = new Date();
    const daysRemaining = Math.max(0, daysInMonth - today.getDate());

    // Build financial data object
    const financialData = {
      monthlyBudget,
      totalSpent,
      remaining,
      percentUsed,
      daysRemainingInMonth: daysRemaining,
      expenses: expenses.sort(
        (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
      ),
      spendingByCategory,
      weeklySpending,
      monthlyTrend: weeklySpending,
    };

    // Route to appropriate analysis type
    if (analysisType === "full") {
      return await performFullAnalysis(profile, financialData);
    } else if (analysisType === "budget") {
      return await performBudgetAnalysis(profile, financialData);
    } else if (analysisType === "savings") {
      return await performSavingsAnalysis(profile, financialData);
    } else if (analysisType === "health") {
      return await performHealthAnalysis(profile, financialData);
    } else if (analysisType === "anomalies") {
      return await performAnomalyAnalysis(profile, financialData);
    } else {
      return NextResponse.json(
        { error: `Unknown analysis type: ${analysisType}` },
        { status: 400 }
      );
    }
  } catch (error) {
    console.error("GET /api/ai-financial-assistant error:", error);
    return NextResponse.json(
      { error: "Failed to perform financial analysis" },
      { status: 500 }
    );
  }
}

async function performFullAnalysis(
  profile: StudentProfile,
  financialData: any
) {
  try {
    const prompt = buildFinancialAnalysisPrompt(profile, financialData);
    const analysis = await askAssistant(profile, prompt);

    return NextResponse.json({
      type: "full",
      profile: {
        name: profile.name,
        branch: profile.branch,
        year: profile.year,
      },
      budgetStatus: {
        monthlyBudget: financialData.monthlyBudget,
        totalSpent: financialData.totalSpent,
        remaining: financialData.remaining,
        percentUsed: financialData.percentUsed,
        daysRemaining: financialData.daysRemainingInMonth,
      },
      highestCategory: getHighestCategory(financialData.spendingByCategory),
      analysis: parseAnalysis(analysis),
      generatedAt: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Full analysis error:", error);
    return NextResponse.json(
      { error: "Failed to perform full analysis" },
      { status: 500 }
    );
  }
}

async function performBudgetAnalysis(
  profile: StudentProfile,
  financialData: any
) {
  try {
    const dailySpend = financialData.totalSpent / (30 - financialData.daysRemainingInMonth || 1);
    const projectedMonthly = dailySpend * 30;

    const prompt = `Analyze budget status for ${profile.name}:
    Budget: ₹${financialData.monthlyBudget}
    Spent: ₹${financialData.totalSpent}
    Daily Average: ₹${Math.round(dailySpend)}
    Days Remaining: ${financialData.daysRemainingInMonth}

    Provide:
    1. Will they exceed budget? By how much?
    2. Safe daily limit for remaining days
    3. Spending prediction by month end
    4. Risk level (Low/Medium/High)
    Be concise.`;

    const analysis = await askAssistant(profile, prompt);

    return NextResponse.json({
      type: "budget",
      current: {
        spent: financialData.totalSpent,
        remaining: financialData.remaining,
        percentUsed: financialData.percentUsed,
      },
      prediction: {
        projectedMonthlySpend: Math.round(projectedMonthly),
        projectedDeficit: Math.max(0, Math.round(projectedMonthly - financialData.monthlyBudget)),
        safeRemainingDaily: Math.round(financialData.remaining / (financialData.daysRemainingInMonth || 1)),
      },
      analysis,
      generatedAt: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Budget analysis error:", error);
    return NextResponse.json(
      { error: "Failed to perform budget analysis" },
      { status: 500 }
    );
  }
}

async function performSavingsAnalysis(
  profile: StudentProfile,
  financialData: any
) {
  try {
    const prompt = buildSavingsSuggestionPrompt(profile, {
      monthlyBudget: financialData.monthlyBudget,
      totalSpent: financialData.totalSpent,
      spendingByCategory: financialData.spendingByCategory,
      yearOfStudy: profile.year,
      goals: profile.interests,
    });

    const analysis = await askAssistant(profile, prompt);

    // Extract suggestions from analysis
    const suggestions = extractSavingsSuggestions(analysis);

    return NextResponse.json({
      type: "savings",
      topSpendingCategories: Object.entries(financialData.spendingByCategory)
        .sort((a, b) => (b[1] as number) - (a[1] as number))
        .slice(0, 3)
        .map(([category, amount]) => ({ category, amount })),
      suggestions,
      analysis,
      generatedAt: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Savings analysis error:", error);
    return NextResponse.json(
      { error: "Failed to perform savings analysis" },
      { status: 500 }
    );
  }
}

async function performHealthAnalysis(
  profile: StudentProfile,
  financialData: any
) {
  try {
    // Calculate metrics
    const budgetControl = Math.max(0, 100 - financialData.percentUsed);
    const savingsRate = (financialData.remaining / financialData.monthlyBudget) * 100;
    const consistencyScore = calculateConsistencyScore(financialData.weeklySpending);
    const categorizedWell = Math.min(100, Object.keys(financialData.spendingByCategory).length * 15);
    const unnecessaryExpenses = 70; // Placeholder

    const prompt = buildHealthScorePrompt(profile, {
      monthlyBudget: financialData.monthlyBudget,
      totalSpent: financialData.totalSpent,
      percentUsed: financialData.percentUsed,
      savingsRate: Math.round(savingsRate),
      consistencyScore,
      categorizedWell,
      noUnnecessaryExpenses: unnecessaryExpenses,
    });

    const analysis = await askAssistant(profile, prompt);

    // Calculate overall health score
    const healthScore = Math.round(
      (budgetControl * 0.3 + savingsRate * 0.3 + consistencyScore * 0.2 + categorizedWell * 0.1 + unnecessaryExpenses * 0.1) / 100
    );

    return NextResponse.json({
      type: "health",
      overallScore: Math.min(100, Math.max(0, healthScore)),
      components: {
        budgetControl: Math.round(budgetControl),
        savingsRate: Math.round(savingsRate),
        consistency: consistencyScore,
        organization: Math.round(categorizedWell),
        discipline: unnecessaryExpenses,
      },
      analysis,
      generatedAt: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Health analysis error:", error);
    return NextResponse.json(
      { error: "Failed to perform health analysis" },
      { status: 500 }
    );
  }
}

async function performAnomalyAnalysis(
  profile: StudentProfile,
  financialData: any
) {
  try {
    const recentTransactions = financialData.expenses.slice(0, 10);
    const avgTransaction = financialData.totalSpent / (financialData.expenses.length || 1);

    const prompt = buildAnomalyDetectionPrompt(profile, {
      recentTransactions,
      averageTransactionAmount: avgTransaction,
      monthlyAverage: financialData.totalSpent,
      dailyAverage: financialData.totalSpent / 30,
    });

    const analysis = await askAssistant(profile, prompt);

    // Detect anomalies
    const anomalies = detectAnomalies(recentTransactions, avgTransaction);

    return NextResponse.json({
      type: "anomalies",
      detectedAnomalies: anomalies,
      averageTransaction: Math.round(avgTransaction),
      analysis,
      generatedAt: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Anomaly analysis error:", error);
    return NextResponse.json(
      { error: "Failed to perform anomaly analysis" },
      { status: 500 }
    );
  }
}

// Helper functions

function getHighestCategory(spending: Record<string, number>) {
  const entries = Object.entries(spending).sort((a, b) => b[1] - a[1]);
  if (entries.length === 0) return null;
  return {
    category: entries[0][0],
    amount: entries[0][1],
    percentage: 0,
  };
}

function parseAnalysis(analysis: string) {
  // Clean up Claude response
  return analysis
    .split("\n")
    .filter(line => line.trim().length > 0)
    .join("\n");
}

function extractSavingsSuggestions(analysis: string) {
  // Parse Claude response for structured suggestions
  const suggestions: Array<{
    area: string;
    action: string;
    monthlySavings: number;
    effort: string;
  }> = [];

  // Simple parsing - can be enhanced
  const lines = analysis.split("\n");
  lines.forEach(line => {
    if (line.includes("₹") && (line.includes("save") || line.includes("reduce"))) {
      // Extract amount
      const amountMatch = line.match(/₹(\d+)/);
      if (amountMatch) {
        suggestions.push({
          area: "General",
          action: line.trim(),
          monthlySavings: parseInt(amountMatch[1]) || 100,
          effort: "Medium",
        });
      }
    }
  });

  return suggestions.slice(0, 5);
}

function calculateConsistencyScore(weeklySpending: number[]) {
  if (weeklySpending.length < 2) return 100;

  // Low variance = high consistency
  const avg = weeklySpending.reduce((a, b) => a + b) / weeklySpending.length;
  const variance = weeklySpending.reduce((sum, spend) => sum + Math.pow(spend - avg, 2), 0) / weeklySpending.length;
  const stdDev = Math.sqrt(variance);
  const coefficientOfVariation = (stdDev / avg) * 100;

  // Convert CV to score (lower CV = higher score)
  return Math.max(0, Math.min(100, 100 - coefficientOfVariation * 2));
}

function detectAnomalies(
  transactions: Array<{ merchant: string; category: string; amount: number; date: string }>,
  avgTransaction: number
) {
  const threshold = avgTransaction * 2.5; // Anomaly if > 2.5x average

  return transactions
    .filter(t => t.amount > threshold)
    .map(t => ({
      merchant: t.merchant,
      category: t.category,
      amount: t.amount,
      date: t.date,
      severity: t.amount > threshold * 2 ? "high" : "medium",
      reason: `Amount (₹${t.amount}) is significantly higher than average (₹${Math.round(avgTransaction)})`,
    }))
    .slice(0, 5);
}
