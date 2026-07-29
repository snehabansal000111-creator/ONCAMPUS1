"use client";

import { useState, useEffect } from "react";

export interface FinancialInsight {
  type: string;
  [key: string]: any;
}

export function useFinancialAnalysis(userId?: string, analysisType: string = "full") {
  const [insight, setInsight] = useState<FinancialInsight | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!userId) {
      setLoading(false);
      return;
    }

    const fetchAnalysis = async () => {
      try {
        setLoading(true);
        setError(null);

        const params = new URLSearchParams({
          userId,
          analysisType,
        });

        const response = await fetch(`/api/ai-financial-assistant?${params}`);

        if (!response.ok) {
          throw new Error("Failed to fetch financial analysis");
        }

        const data = await response.json();
        setInsight(data);
      } catch (err) {
        const message = err instanceof Error ? err.message : "Failed to fetch analysis";
        setError(message);
        setInsight(null);
      } finally {
        setLoading(false);
      }
    };

    fetchAnalysis();
  }, [userId, analysisType]);

  return { insight, loading, error };
}

export function useBudgetAnalysis(userId?: string) {
  return useFinancialAnalysis(userId, "budget");
}

export function useSavingsAnalysis(userId?: string) {
  return useFinancialAnalysis(userId, "savings");
}

export function useFinancialHealthScore(userId?: string) {
  return useFinancialAnalysis(userId, "health");
}

export function useAnomalyDetection(userId?: string) {
  return useFinancialAnalysis(userId, "anomalies");
}

/**
 * Hook to fetch full financial analysis
 */
export function useFullFinancialAnalysis(userId?: string) {
  const [analysis, setAnalysis] = useState<{
    budget: FinancialInsight | null;
    savings: FinancialInsight | null;
    health: FinancialInsight | null;
    anomalies: FinancialInsight | null;
  } | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!userId) {
      setLoading(false);
      return;
    }

    const fetchAll = async () => {
      try {
        setLoading(true);
        setError(null);

        const [budgetRes, savingsRes, healthRes, anomaliesRes] = await Promise.all([
          fetch(`/api/ai-financial-assistant?userId=${userId}&analysisType=budget`),
          fetch(`/api/ai-financial-assistant?userId=${userId}&analysisType=savings`),
          fetch(`/api/ai-financial-assistant?userId=${userId}&analysisType=health`),
          fetch(`/api/ai-financial-assistant?userId=${userId}&analysisType=anomalies`),
        ]);

        if (!budgetRes.ok || !savingsRes.ok || !healthRes.ok || !anomaliesRes.ok) {
          throw new Error("Failed to fetch some analyses");
        }

        const [budgetData, savingsData, healthData, anomaliesData] = await Promise.all([
          budgetRes.json(),
          savingsRes.json(),
          healthRes.json(),
          anomaliesRes.json(),
        ]);

        setAnalysis({
          budget: budgetData,
          savings: savingsData,
          health: healthData,
          anomalies: anomaliesData,
        });
      } catch (err) {
        const message = err instanceof Error ? err.message : "Failed to fetch analyses";
        setError(message);
        setAnalysis(null);
      } finally {
        setLoading(false);
      }
    };

    fetchAll();
  }, [userId]);

  return { analysis, loading, error };
}
