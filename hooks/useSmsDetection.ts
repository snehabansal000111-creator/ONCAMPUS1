"use client";

import { useState } from "react";
import { smsAPI } from "@/lib/api-client";
import type { SmsDetectedTransaction } from "@/types";

/**
 * Hook for SMS detection operations (review, accept, edit, reject)
 */
export function useSmsDetectionActions() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const accept = async (id: string): Promise<boolean> => {
    try {
      console.log("[useSmsDetection.accept] Starting accept for id:", id);
      setLoading(true);
      setError(null);

      const url = `/api/sms-transactions/${id}?action=accept`;
      console.log("[useSmsDetection.accept] Fetch URL:", url);

      const response = await fetch(url, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          'Cache-Control': 'no-cache, no-store, must-revalidate'
        },
        body: JSON.stringify({}),
        cache: 'no-store',
      });

      console.log("[useSmsDetection.accept] Fetch response received, status:", response.status);

      if (!response.ok) {
        const error = await response.text();
        console.error("[useSmsDetection.accept] Response not ok:", response.status, error);
        throw new Error("Failed to accept SMS transaction");
      }

      const result = await response.json();
      console.log("[useSmsDetection.accept] Response JSON:", result);
      setLoading(false);
      console.log("[useSmsDetection.accept] Returning true");
      return true;
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to accept";
      console.error("[useSmsDetection.accept] Caught error:", message, err);
      setError(message);
      setLoading(false);
      return false;
    }
  };

  const reject = async (id: string, reason?: string): Promise<boolean> => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch(`/api/sms-transactions/${id}?action=reject`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ reason }),
      });

      if (!response.ok) {
        throw new Error("Failed to reject SMS transaction");
      }

      setLoading(false);
      return true;
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to reject";
      setError(message);
      setLoading(false);
      return false;
    }
  };

  const edit = async (
    id: string,
    updates: {
      merchant?: string;
      category?: string;
      amount?: number;
      paymentMethod?: string;
    }
  ): Promise<boolean> => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch(`/api/sms-transactions/${id}?action=edit`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updates),
      });

      if (!response.ok) {
        throw new Error("Failed to edit SMS transaction");
      }

      setLoading(false);
      return true;
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to edit";
      setError(message);
      setLoading(false);
      return false;
    }
  };

  const ignore = async (id: string): Promise<boolean> => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch(`/api/sms-transactions/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "ignored" }),
      });

      if (!response.ok) {
        throw new Error("Failed to ignore SMS transaction");
      }

      setLoading(false);
      return true;
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to ignore";
      setError(message);
      setLoading(false);
      return false;
    }
  };

  return {
    accept,
    reject,
    edit,
    ignore,
    loading,
    error,
  };
}

/**
 * Hook to submit raw SMS data from Android
 */
export function useSmsParser() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const parseAndStore = async (
    userId: string,
    sender: string,
    message: string,
    timestamp: number
  ): Promise<{ detected: boolean; id?: string; error?: string }> => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch("/api/sms-parse", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId,
          sender,
          message,
          timestamp,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to parse SMS");
      }

      setLoading(false);
      return {
        detected: data.detected || false,
        id: data.id,
        error: data.reason,
      };
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to parse SMS";
      setError(message);
      setLoading(false);
      return {
        detected: false,
        error: message,
      };
    }
  };

  const parseAndStoreBatch = async (
    userId: string,
    messages: Array<{ sender: string; message: string; timestamp: number }>
  ): Promise<{
    processed: number;
    detected: number;
    error?: string;
  }> => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch("/api/sms-parse", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId,
          messages,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Batch processing failed");
      }

      setLoading(false);
      return {
        processed: data.summary.processed,
        detected: data.summary.detected,
      };
    } catch (err) {
      const message = err instanceof Error ? err.message : "Batch processing failed";
      setError(message);
      setLoading(false);
      return {
        processed: 0,
        detected: 0,
        error: message,
      };
    }
  };

  return {
    parseAndStore,
    parseAndStoreBatch,
    loading,
    error,
  };
}
