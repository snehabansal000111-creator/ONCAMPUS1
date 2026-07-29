"use client";

import { useState, useEffect } from "react";
import { expensesAPI, smsAPI } from "@/lib/api-client";
import type { Transaction, SmsDetectedTransaction, AlertItem } from "@/types";

export function useExpenses(userId?: string, month?: string, refreshKey?: number) {
  const [expenses, setExpenses] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!userId) {
      setLoading(false);
      setExpenses([]);
      return;
    }

    const fetchExpenses = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await expensesAPI.list(userId, { month });
        // Force new reference to ensure React detects the change
        setExpenses([...data]);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load expenses");
        setExpenses([]);
      } finally {
        setLoading(false);
      }
    };

    fetchExpenses();
  }, [userId, month, refreshKey]);

  return { expenses, loading, error };
}

export function useExpenseStats(userId?: string, month?: string, refreshKey?: number) {
  const [stats, setStats] = useState<{
    monthlyBudget: number;
    totalSpent: number;
    remaining: number;
    percentUsed: number;
    spendingByCategory: Record<string, number>;
    expenseCount: number;
  } | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    console.log("[useExpenseStats] useEffect triggered - userId:", userId, "month:", month, "refreshKey:", refreshKey);

    if (!userId) {
      console.log("[useExpenseStats] No userId, clearing stats");
      setLoading(false);
      setStats(null);
      return;
    }

    const fetchStats = async () => {
      try {
        console.log("[useExpenseStats] Starting fetch with userId:", userId, "refreshKey:", refreshKey);
        setLoading(true);
        setError(null);
        const data = await expensesAPI.stats(userId, month);
        console.log("[useExpenseStats] Fetch complete. Data received:", JSON.stringify(data));
        console.log("[useExpenseStats] Setting stats with new object: totalSpent =", data.totalSpent);
        // Force new reference to ensure React detects the change
        setStats({ ...data });
        console.log("[useExpenseStats] Stats set completed");
      } catch (err) {
        const message = err instanceof Error ? err.message : "Failed to load stats";
        console.error("[useExpenseStats] Error:", message);
        setError(message);
        setStats(null);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, [userId, month, refreshKey]);

  useEffect(() => {
    console.log("[useExpenseStats] Stats updated:", stats);
  }, [stats]);

  return { stats, loading, error };
}

export function useExpenseInsights(userId?: string, month?: string) {
  const [insights, setInsights] = useState<{
    summary: string;
    insights: string[];
  } | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!userId) {
      setLoading(false);
      setInsights(null);
      return;
    }

    const fetchInsights = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await expensesAPI.insights(userId, month);
        setInsights({ summary: data.summary, insights: data.insights });
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load insights");
        setInsights(null);
      } finally {
        setLoading(false);
      }
    };

    fetchInsights();
  }, [userId, month]);

  return { insights, loading, error };
}

export function useExpenseTrends(
  userId?: string,
  period: "weekly" | "monthly" = "weekly",
  month?: string,
  refreshKey?: number
) {
  const [trends, setTrends] = useState<{ label: string; spend: number }[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!userId) {
      setLoading(false);
      setTrends([]);
      return;
    }

    const fetchTrends = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await expensesAPI.trends(userId, { period, month });
        // Force new reference to ensure React detects the change
        setTrends([...data.trends]);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load trends");
        setTrends([]);
      } finally {
        setLoading(false);
      }
    };

    fetchTrends();
  }, [userId, period, month, refreshKey]);

  return { trends, loading, error };
}

export function useAlerts(userId?: string, refreshKey?: number) {
  const [alerts, setAlerts] = useState<AlertItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!userId) {
      setLoading(false);
      setAlerts([]);
      return;
    }

    const fetchAlerts = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await expensesAPI.alerts(userId);
        // Force new reference to ensure React detects the change
        setAlerts([...data]);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load alerts");
        setAlerts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchAlerts();
  }, [userId, refreshKey]);

  return { alerts, loading, error };
}

export function useSmsTransactions(userId?: string, status?: string) {
  const [transactions, setTransactions] = useState<SmsDetectedTransaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    console.log("[useSmsTransactions] Hook called with userId:", userId, "status:", status);

    if (!userId) {
      console.log("[useSmsTransactions] No userId, clearing transactions");
      setLoading(false);
      setTransactions([]);
      return;
    }

    const fetchTransactions = async () => {
      try {
        console.log("[useSmsTransactions] Fetching SMS transactions");
        setLoading(true);
        setError(null);
        const data = await smsAPI.list(userId, status);
        console.log("[useSmsTransactions] Received data:", data);
        setTransactions([...data]);
      } catch (err) {
        const message = err instanceof Error ? err.message : "Failed to load SMS transactions";
        console.error("[useSmsTransactions] Error:", message);
        setError(message);
        setTransactions([]);
      } finally {
        setLoading(false);
      }
    };

    fetchTransactions();
  }, [userId, status]);

  return { transactions, loading, error };
}
