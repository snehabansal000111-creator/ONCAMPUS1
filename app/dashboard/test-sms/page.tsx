"use client";

import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useRouter } from "next/navigation";
import TopBar from "@/components/dashboard/TopBar";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import { AlertCircle, CheckCircle2 } from "lucide-react";

const TEST_SMS_SAMPLES = [
  {
    merchant: "Zomato",
    amount: 340,
    message: "Debit alert on A/C XXXXX. Your a/c has been debited for Rs.340/- at ZOMATO on 30Jul2024 22:47 IST. Thank you."
  },
  {
    merchant: "Amazon",
    amount: 2500,
    message: "Your Amazon Pay UPI payment of Rs 2,500 debited on 30-JUL-24 23:45. Transaction ID: XXXX1234"
  },
  {
    merchant: "Starbucks",
    amount: 450,
    message: "Debit alert: Your account has been debited with Rs.450 at STARBUCKS COFFEE on 30Jul2024 14:30"
  },
  {
    merchant: "Uber",
    amount: 320,
    message: "Rs. 320 has been debited from your account for Uber ride. Order ID: XXXXXX"
  },
  {
    merchant: "Swiggy",
    amount: 580,
    message: "Your account has been debited with Rs.580 on 30-JUL-2024 for Swiggy order #123456"
  },
];

export default function TestSmsPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [merchant, setMerchant] = useState("");
  const [amount, setAmount] = useState("");

  const handleAddTestSms = async (testMerchant?: string, testAmount?: number) => {
    const finalMerchant = testMerchant || merchant;
    const finalAmount = testAmount || parseFloat(amount);

    if (!user) {
      setError("User not authenticated");
      return;
    }

    if (!finalMerchant || !finalAmount) {
      setError("Please enter merchant and amount");
      return;
    }

    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      const response = await fetch("/api/sms-test", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: user.uid,
          merchant: finalMerchant,
          amount: finalAmount,
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Failed to create test SMS");
      }

      setSuccess(true);
      setMerchant("");
      setAmount("");
      setTimeout(() => {
        setSuccess(false);
        router.push("/dashboard/expenses");
      }, 2000);
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to add SMS";
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <TopBar title="Test SMS Detection" />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Custom SMS Form */}
        <Card>
          <h3 className="font-display font-semibold text-ink mb-4">Add Custom SMS</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-ink mb-2">Merchant Name</label>
              <input
                type="text"
                value={merchant}
                onChange={(e) => setMerchant(e.target.value)}
                placeholder="e.g., Zomato, Amazon, Starbucks"
                className="w-full px-3 py-2 border border-border rounded-lg text-ink focus:outline-none focus:ring-2 focus:ring-primary-600"
                disabled={loading}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-ink mb-2">Amount (₹)</label>
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="e.g., 340"
                min="1"
                className="w-full px-3 py-2 border border-border rounded-lg text-ink focus:outline-none focus:ring-2 focus:ring-primary-600"
                disabled={loading}
              />
            </div>

            {error && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-lg flex gap-3">
                <AlertCircle size={18} className="text-red-600 shrink-0 mt-0.5" />
                <p className="text-sm text-red-800">{error}</p>
              </div>
            )}

            {success && (
              <div className="p-3 bg-green-50 border border-green-200 rounded-lg flex gap-3">
                <CheckCircle2 size={18} className="text-green-600 shrink-0 mt-0.5" />
                <p className="text-sm text-green-800">SMS added! Redirecting...</p>
              </div>
            )}

            <Button
              onClick={() => handleAddTestSms()}
              disabled={loading || !merchant || !amount}
              className="w-full"
            >
              {loading ? "Adding..." : "Add SMS"}
            </Button>
          </div>
        </Card>

        {/* Quick Add Samples */}
        <Card>
          <h3 className="font-display font-semibold text-ink mb-4">Quick Test Samples</h3>
          <div className="space-y-2">
            {TEST_SMS_SAMPLES.map((sample, i) => (
              <Button
                key={i}
                variant="secondary"
                size="sm"
                onClick={() => handleAddTestSms(sample.merchant, sample.amount)}
                disabled={loading}
                className="w-full justify-between text-left"
              >
                <span className="truncate">{sample.merchant}</span>
                <span className="text-primary-600 font-medium ml-2">₹{sample.amount}</span>
              </Button>
            ))}
          </div>
        </Card>
      </div>

      <Card className="mt-5">
        <h3 className="font-display font-semibold text-ink mb-2">How to Test</h3>
        <ol className="text-sm text-muted space-y-2 list-decimal list-inside">
          <li>Use Quick Test Samples or enter a custom merchant and amount</li>
          <li>Go to Expenses page → scroll to "Auto SMS Detection" section</li>
          <li>You'll see the SMS transaction pending approval</li>
          <li>Click checkmark to accept and convert to expense</li>
          <li>The expense appears in your transaction list</li>
        </ol>
      </Card>
    </>
  );
}
