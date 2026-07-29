"use client";

import { useState } from "react";
import { X } from "lucide-react";
import { expensesAPI } from "@/lib/api-client";
import type { ExpenseCategory } from "@/types";

const CATEGORIES: ExpenseCategory[] = [
  "Food",
  "Shopping",
  "Transport",
  "Education",
  "Entertainment",
  "Hostel/PG",
  "Health",
  "Others",
];

const PAYMENT_METHODS = ["UPI", "Card", "Bank Transfer", "Unknown"];

interface Props {
  isOpen: boolean;
  onClose: () => void;
  userId?: string;
  onExpenseAdded?: () => void;
}

export default function AddExpenseModal({ isOpen, onClose, userId, onExpenseAdded }: Props) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    merchant: "",
    category: "Food" as ExpenseCategory,
    amount: "",
    date: new Date().toISOString().split("T")[0],
    paymentMethod: "UPI",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userId) {
      setError("Please log in to add expenses");
      return;
    }

    if (!formData.merchant || !formData.amount) {
      setError("Please fill in all required fields");
      return;
    }

    try {
      setLoading(true);
      setError(null);
      await expensesAPI.create(userId, {
        merchant: formData.merchant,
        category: formData.category,
        amount: parseFloat(formData.amount),
        date: formData.date,
        paymentMethod: formData.paymentMethod,
        aiTagged: false,
      });
      console.log("[AddExpenseModal] Expense created successfully, calling onExpenseAdded");
      onExpenseAdded?.();
      console.log("[AddExpenseModal] onExpenseAdded callback executed");
      onClose();
      setFormData({
        merchant: "",
        category: "Food",
        amount: "",
        date: new Date().toISOString().split("T")[0],
        paymentMethod: "UPI",
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to add expense");
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="relative w-full max-w-md rounded-xl3 bg-white shadow-lift max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 flex items-center justify-between border-b border-border bg-white p-5">
          <h2 className="font-display font-semibold text-ink">Add Expense</h2>
          <button
            onClick={onClose}
            className="grid h-8 w-8 place-items-center rounded hover:bg-slate-100"
          >
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 p-5">
          {error && (
            <div className="rounded-xl2 bg-red-50 p-3 text-sm text-red-700">
              {error}
            </div>
          )}

          <div>
            <label className="block text-xs font-medium text-ink mb-1">
              Merchant *
            </label>
            <input
              type="text"
              value={formData.merchant}
              onChange={(e) =>
                setFormData({ ...formData, merchant: e.target.value })
              }
              className="w-full rounded-xl2 border border-border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
              placeholder="E.g., Starbucks"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-ink mb-1">
              Category *
            </label>
            <select
              value={formData.category}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  category: e.target.value as ExpenseCategory,
                })
              }
              className="w-full rounded-xl2 border border-border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
              {CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-medium text-ink mb-1">
              Amount *
            </label>
            <input
              type="number"
              value={formData.amount}
              onChange={(e) =>
                setFormData({ ...formData, amount: e.target.value })
              }
              className="w-full rounded-xl2 border border-border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
              placeholder="0.00"
              step="0.01"
              min="0"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-ink mb-1">
              Date *
            </label>
            <input
              type="date"
              value={formData.date}
              onChange={(e) =>
                setFormData({ ...formData, date: e.target.value })
              }
              className="w-full rounded-xl2 border border-border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-ink mb-1">
              Payment Method
            </label>
            <select
              value={formData.paymentMethod}
              onChange={(e) =>
                setFormData({ ...formData, paymentMethod: e.target.value })
              }
              className="w-full rounded-xl2 border border-border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
              {PAYMENT_METHODS.map((method) => (
                <option key={method} value={method}>
                  {method}
                </option>
              ))}
            </select>
          </div>

          <div className="flex gap-2 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 rounded-xl2 border border-border px-4 py-2 text-sm font-medium text-ink hover:bg-slate-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 rounded-xl2 bg-primary-600 px-4 py-2 text-sm font-medium text-white hover:bg-primary-700 transition-colors disabled:opacity-50"
            >
              {loading ? "Adding..." : "Add Expense"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
