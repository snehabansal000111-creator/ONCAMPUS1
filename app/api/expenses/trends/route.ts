import { NextRequest, NextResponse } from "next/server";
import {
  collection,
  query,
  where,
  getDocs,
  Timestamp,
} from "firebase/firestore";
import { db } from "@/lib/firebase";

interface TrendPoint {
  label: string;
  spend: number;
}

/**
 * GET /api/expenses/trends?userId=...&period=weekly|monthly
 * Get spending trends for visualization
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");
    const period = searchParams.get("period") || "weekly";
    const month = searchParams.get("month") || new Date().toISOString().substring(0, 7);

    if (!userId) {
      return NextResponse.json({ error: "userId is required" }, { status: 400 });
    }

    const [year, monthNum] = month.split("-");
    const startDate = new Date(parseInt(year), parseInt(monthNum) - 1, 1);
    const endDate = new Date(parseInt(year), parseInt(monthNum), 0);

    const q = query(
      collection(db, "expenses"),
      where("userId", "==", userId),
      where("date", ">=", Timestamp.fromDate(startDate)),
      where("date", "<=", Timestamp.fromDate(endDate))
    );

    const snapshot = await getDocs(q);
    const expenses: any[] = [];

    snapshot.forEach((doc) => {
      const data = doc.data();
      expenses.push({
        amount: data.amount,
        date: data.date.toDate(),
      });
    });

    const trends: TrendPoint[] = [];

    if (period === "weekly") {
      const weeks: Record<number, number> = {};

      expenses.forEach((exp) => {
        const weekNumber = Math.floor(
          (exp.date.getDate() - 1) / 7
        ) + 1;
        weeks[weekNumber] = (weeks[weekNumber] || 0) + exp.amount;
      });

      for (let week = 1; week <= 4; week++) {
        trends.push({
          label: `Week ${week}`,
          spend: weeks[week] || 0,
        });
      }
    } else if (period === "monthly") {
      // For yearly view, aggregate by month
      const months: Record<number, number> = {};

      expenses.forEach((exp) => {
        const monthKey = exp.date.getMonth();
        months[monthKey] = (months[monthKey] || 0) + exp.amount;
      });

      const monthNames = [
        "Jan", "Feb", "Mar", "Apr", "May", "Jun",
        "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
      ];

      for (let m = 0; m < 12; m++) {
        trends.push({
          label: monthNames[m],
          spend: months[m] || 0,
        });
      }
    }

    return NextResponse.json({ trends, period });
  } catch (error) {
    console.error("GET /api/expenses/trends error:", error);
    return NextResponse.json(
      { error: "Failed to fetch trends" },
      { status: 500 }
    );
  }
}
