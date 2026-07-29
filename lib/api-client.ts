import type { Transaction, SmsDetectedTransaction, AlertItem } from "@/types";

const API_BASE = "/api";

// Expenses API
export const expensesAPI = {
  list: async (
    userId: string,
    options?: { month?: string; category?: string }
  ): Promise<Transaction[]> => {
    const params = new URLSearchParams({ userId });
    if (options?.month) params.append("month", options.month);
    if (options?.category) params.append("category", options.category);

    const res = await fetch(`${API_BASE}/expenses?${params}`, {
      cache: 'no-store',
      headers: { 'Cache-Control': 'no-cache, no-store, must-revalidate' }
    });
    if (!res.ok) throw new Error("Failed to fetch expenses");
    const { expenses } = await res.json();
    return expenses;
  },

  get: async (id: string): Promise<Transaction> => {
    const res = await fetch(`${API_BASE}/expenses/${id}`);
    if (!res.ok) throw new Error("Failed to fetch expense");
    return res.json();
  },

  create: async (
    userId: string,
    expense: Omit<Transaction, "id">
  ): Promise<{ id: string }> => {
    const res = await fetch(`${API_BASE}/expenses`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId, ...expense }),
    });
    if (!res.ok) throw new Error("Failed to create expense");
    return res.json();
  },

  update: async (id: string, data: Partial<Transaction>): Promise<void> => {
    const res = await fetch(`${API_BASE}/expenses/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error("Failed to update expense");
  },

  delete: async (id: string): Promise<void> => {
    const res = await fetch(`${API_BASE}/expenses/${id}`, {
      method: "DELETE",
    });
    if (!res.ok) throw new Error("Failed to delete expense");
  },

  stats: async (
  userId: string,
  month?: string
) => {
  const params = new URLSearchParams({ userId });
  if (month) params.append("month", month);

  console.log("[API] Fetching stats with params:", { userId, month });

  const res = await fetch(`${API_BASE}/expenses/stats?${params}`, {
    cache: 'no-store',
    headers: { 'Cache-Control': 'no-cache, no-store, must-revalidate' }
  });

  if (!res.ok) {
    const error = await res.text();
    console.error("[API] Stats request failed:", res.status, error);
    throw new Error("Failed to fetch stats");
  }

  const data = await res.json();

  console.log("[API] Stats response received:", data);

  return data;
},

  insights: async (userId: string, month?: string): Promise<{
    summary: string;
    insights: string[];
    rawResponse: string;
  }> => {
    const params = new URLSearchParams({ userId });
    if (month) params.append("month", month);

    const res = await fetch(`${API_BASE}/expenses/insights?${params}`);
    if (!res.ok) throw new Error("Failed to fetch insights");
    return res.json();
  },

  trends: async (
    userId: string,
    options?: { period?: "weekly" | "monthly"; month?: string }
  ): Promise<{ trends: { label: string; spend: number }[]; period: string }> => {
    const params = new URLSearchParams({ userId });
    if (options?.period) params.append("period", options.period);
    if (options?.month) params.append("month", options.month);

    const res = await fetch(`${API_BASE}/expenses/trends?${params}`, {
      cache: 'no-store',
      headers: { 'Cache-Control': 'no-cache, no-store, must-revalidate' }
    });
    if (!res.ok) throw new Error("Failed to fetch trends");
    return res.json();
  },

  alerts: async (userId: string): Promise<AlertItem[]> => {
    const params = new URLSearchParams({ userId });

    const res = await fetch(`${API_BASE}/expenses/alerts?${params}`, {
      cache: 'no-store',
      headers: { 'Cache-Control': 'no-cache, no-store, must-revalidate' }
    });
    if (!res.ok) {
      console.error("Failed to fetch alerts");
      return [];
    }
    const { alerts } = await res.json();
    return alerts;
  },
};

// SMS Transactions API
export const smsAPI = {
  list: async (
    userId: string,
    status?: string
  ): Promise<SmsDetectedTransaction[]> => {
    const params = new URLSearchParams({ userId });
    if (status) params.append("status", status);

    const res = await fetch(`${API_BASE}/sms-transactions?${params}`);
    if (!res.ok) throw new Error("Failed to fetch SMS transactions");
    const { transactions } = await res.json();
    return transactions;
  },

  create: async (
    userId: string,
    transaction: Omit<SmsDetectedTransaction, "id">
  ): Promise<{ id: string }> => {
    const res = await fetch(`${API_BASE}/sms-transactions`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId, ...transaction }),
    });
    if (!res.ok) throw new Error("Failed to create SMS transaction");
    return res.json();
  },

  updateStatus: async (
    id: string,
    status: "pending" | "accepted" | "ignored"
  ): Promise<void> => {
    const res = await fetch(`${API_BASE}/sms-transactions/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    if (!res.ok) throw new Error("Failed to update SMS transaction");
  },
};
