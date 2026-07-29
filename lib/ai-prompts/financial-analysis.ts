import type { StudentProfile } from "@/types";

export function buildFinancialAnalysisPrompt(
  profile: StudentProfile,
  financialData: {
    monthlyBudget: number;
    totalSpent: number;
    remaining: number;
    percentUsed: number;
    daysRemainingInMonth: number;
    expenses: Array<{
      merchant: string;
      category: string;
      amount: number;
      date: string;
    }>;
    spendingByCategory: Record<string, number>;
    weeklySpending: number[];
    monthlyTrend: number[];
  }
): string {
  const { monthlyBudget, totalSpent, remaining, percentUsed, daysRemainingInMonth, expenses, spendingByCategory, weeklySpending, monthlyTrend } = financialData;

  const topCategories = Object.entries(spendingByCategory)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3)
    .map(([cat, amt]) => `${cat}: ₹${amt}`)
    .join(", ");

  const averageDailySpend = totalSpent / (30 - daysRemainingInMonth || 1);
  const projectedMonthlySpend = averageDailySpend * 30;
  const projectedDeficit = Math.max(0, projectedMonthlySpend - monthlyBudget);

  const recentExpenses = expenses
    .slice(0, 5)
    .map(e => `${e.merchant} (${e.category}): ₹${e.amount} on ${e.date}`)
    .join("\n");

  const weeklyTrend = weeklySpending
    .map((spend, i) => `Week ${i + 1}: ₹${spend}`)
    .join(", ");

  const prompt = `
You are an expert financial advisor for a college student. Analyze the following financial data and provide specific, actionable insights.

STUDENT PROFILE
===============
Name: ${profile.name}
Branch: ${profile.branch}
Year: ${profile.year}
Career Goal: ${profile.careerGoal}

MONTHLY BUDGET STATUS
====================
Total Monthly Budget: ₹${monthlyBudget}
Amount Spent: ₹${totalSpent}
Amount Remaining: ₹${remaining}
Budget Used: ${percentUsed}%
Days Remaining in Month: ${daysRemainingInMonth}

SPENDING BREAKDOWN
==================
Top Categories: ${topCategories}
Total Categories Tracked: ${Object.keys(spendingByCategory).length}

TREND ANALYSIS
===============
Weekly Spending Pattern: ${weeklyTrend}
Average Daily Spend: ₹${Math.round(averageDailySpend)}
Projected Monthly Spend: ₹${Math.round(projectedMonthlySpend)}
Projected Deficit: ₹${Math.round(projectedDeficit)}

RECENT TRANSACTIONS
====================
${recentExpenses}

ANALYSIS REQUIRED
=================
Based on this data, provide the following analysis in structured format:

1. BUDGET STATUS: Is the student on track? Will they exceed budget?
2. HIGHEST SPENDING CATEGORY: Which category has the most spending? Why might this be?
3. SPENDING PREDICTION: What will total spending be by month end? Any risks?
4. DAILY SPENDING LIMIT: What's a safe daily spending limit for remaining days?
5. WEEKLY TREND: Is spending increasing or decreasing? Any concerning patterns?
6. UNUSUAL TRANSACTIONS: Any unusually large or suspicious transactions?
7. FINANCIAL HEALTH SCORE: On a scale of 0-100, how is this student doing financially?
8. SAVINGS OPPORTUNITIES: Specific, quantifiable ways to save ₹500+ per month
9. PRIORITY ADVICE: 1-2 most important things to focus on

Provide actionable advice specific to a college student. Be encouraging but honest.
Use exact amounts (₹) in your response. Think about ${profile.branch} background and ${profile.careerGoal} goal.
`;

  return prompt.trim();
}

export function buildWeeklyAnalysisPrompt(
  profile: StudentProfile,
  weekData: {
    weekStart: string;
    weekEnd: string;
    totalSpent: number;
    transactions: Array<{ merchant: string; category: string; amount: number; date: string }>;
    compareToLastWeek: number;
  }
): string {
  const { weekStart, weekEnd, totalSpent, transactions, compareToLastWeek } = weekData;

  const trend = compareToLastWeek > 0 ? "INCREASED" : "DECREASED";
  const change = Math.abs(compareToLastWeek);

  const txnSummary = transactions
    .map(t => `${t.merchant} (${t.category}): ₹${t.amount}`)
    .join("\n");

  return `
You are a financial advisor. Summarize this week's spending for ${profile.name}:

WEEK: ${weekStart} to ${weekEnd}
Total Spent: ₹${totalSpent}
Vs Last Week: ${trend} by ₹${change} (${Math.round((change / compareToLastWeek) * 100)}%)

TRANSACTIONS
${txnSummary}

Provide:
1. Brief spending summary (1-2 sentences)
2. Biggest expense this week
3. One positive observation
4. One area to improve

Be concise and encouraging.
`;
}

export function buildMonthlyAnalysisPrompt(
  profile: StudentProfile,
  monthData: {
    month: string;
    budget: number;
    spent: number;
    remaining: number;
    categories: Record<string, number>;
    transactions: Array<{ merchant: string; category: string; amount: number; date: string }>;
    compareToLastMonth: { spent: number; percentChange: number };
  }
): string {
  const { month, budget, spent, remaining, categories, compareToLastMonth } = monthData;

  const monthStatus = spent > budget ? "EXCEEDED" : "WITHIN BUDGET";
  const excess = spent > budget ? spent - budget : 0;
  const saving = spent < budget ? budget - spent : 0;

  const topSpending = Object.entries(categories)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3)
    .map(([cat, amt]) => `${cat}: ₹${amt}`)
    .join(", ");

  return `
You are a financial advisor. Provide monthly summary for ${profile.name} - ${month}:

BUDGET STATUS: ${monthStatus}
Total Budget: ₹${budget}
Total Spent: ₹${spent}
${excess > 0 ? `Amount Over Budget: ₹${excess}` : `Amount Saved: ₹${saving}`}

TOP SPENDING CATEGORIES: ${topSpending}

VS LAST MONTH: ${compareToLastMonth.percentChange > 0 ? "INCREASED" : "DECREASED"} by ${Math.abs(compareToLastMonth.percentChange)}%

Provide:
1. Monthly performance summary (2-3 sentences)
2. Top category and insight
3. Month-over-month comparison
4. Key wins and areas for improvement
5. Recommendation for next month

Be comprehensive but concise.
`;
}

export function buildSavingsSuggestionPrompt(
  profile: StudentProfile,
  data: {
    monthlyBudget: number;
    totalSpent: number;
    spendingByCategory: Record<string, number>;
    yearOfStudy: string;
    goals: string[];
  }
): string {
  const { monthlyBudget, totalSpent, spendingByCategory, yearOfStudy, goals } = data;

  const percentageOfBudget = Math.round((totalSpent / monthlyBudget) * 100);

  const topCategories = Object.entries(spendingByCategory)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3)
    .map(([cat, amt]) => `${cat} (${Math.round((amt / totalSpent) * 100)}%): ₹${amt}`)
    .join(", ");

  return `
You are a budget optimization expert. Suggest specific savings opportunities for ${profile.name}:

CURRENT SITUATION
Budget: ₹${monthlyBudget}
Current Spend: ₹${totalSpent} (${percentageOfBudget}%)
Top Spending: ${topCategories}

PROFILE CONTEXT
Year: ${yearOfStudy}
Career Goal: ${profile.careerGoal}
Interests: ${profile.interests.join(", ")}

SAVINGS OPPORTUNITIES
Identify 3-5 specific, quantifiable ways to save money. For each:
1. Area (which spending category)
2. Specific action (e.g., "reduce food delivery by 2 orders/week")
3. Monthly savings (₹ amount)
4. Effort level (Easy/Medium/Hard)
5. Impact on lifestyle (Low/Medium/High)

Make suggestions aligned with ${profile.careerGoal} and ${yearOfStudy} lifestyle.
Prioritize quick wins. Be realistic for a student.
`;
}

export function buildHealthScorePrompt(
  profile: StudentProfile,
  data: {
    monthlyBudget: number;
    totalSpent: number;
    percentUsed: number;
    savingsRate: number;
    consistencyScore: number;
    categorizedWell: number;
    noUnnecessaryExpenses: number;
  }
): string {
  return `
You are a financial analyst. Calculate a Financial Health Score (0-100) for ${profile.name}:

METRICS
======
Budget Control: ${100 - Math.min(data.percentUsed, 100)} points (spent ${data.percentUsed}% of budget)
Savings Rate: ${data.savingsRate} points (saving ₹${data.monthlyBudget - data.totalSpent}/month)
Consistency: ${data.consistencyScore} points (spending patterns)
Organization: ${data.categorizedWell} points (categorized expenses well)
Discipline: ${data.noUnnecessaryExpenses} points (minimal unnecessary spending)

Calculate:
1. Overall Financial Health Score (0-100)
2. Strongest area (1-2 sentences)
3. Area needing improvement (1-2 sentences)
4. Specific recommendation

Consider ${profile.branch} and student context. Be encouraging but honest.
`;
}

export function buildAnomalyDetectionPrompt(
  profile: StudentProfile,
  data: {
    recentTransactions: Array<{
      merchant: string;
      category: string;
      amount: number;
      date: string;
    }>;
    averageTransactionAmount: number;
    monthlyAverage: number;
    dailyAverage: number;
  }
): string {
  const { recentTransactions, averageTransactionAmount, monthlyAverage, dailyAverage } = data;

  const txnSummary = recentTransactions
    .slice(0, 10)
    .map(t => `${t.date}: ${t.merchant} (${t.category}) - ₹${t.amount}`)
    .join("\n");

  return `
You are a financial fraud detection specialist. Analyze these transactions for anomalies:

BASELINE METRICS
================
Average Transaction: ₹${Math.round(averageTransactionAmount)}
Monthly Average Spend: ₹${monthlyAverage}
Daily Average Spend: ₹${Math.round(dailyAverage)}

RECENT TRANSACTIONS
===================
${txnSummary}

ANALYSIS REQUIRED
=================
For each transaction:
1. Is it normal or unusual?
2. If unusual, why? (amount, category, timing, merchant)
3. Confidence level (Low/Medium/High)
4. Action recommended (None/Review/Possible Fraud)

Focus on:
- Unusually large amounts
- Unusual merchant types
- Sudden category changes
- Timing anomalies
- Repeated patterns

Be specific. Suggest student may have made legitimate large purchases.
`;
}
