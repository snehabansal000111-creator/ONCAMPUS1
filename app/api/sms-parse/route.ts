import { NextRequest, NextResponse } from "next/server";
import { collection, addDoc, Timestamp, query, where, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase";
import {
  parseSmsTransaction,
  categorizeTransaction,
  type RawSmsMessage,
} from "@/lib/sms-parser";

/**
 * POST /api/sms-parse
 *
 * Receive raw SMS from Android app, parse it, and store as pending transaction.
 *
 * Body:
 * {
 *   "userId": "user123",
 *   "sender": "HDFC",
 *   "message": "Debit alert on A/C XXXXX. Your a/c has been debited for Rs.340/- at ZOMATO...",
 *   "timestamp": 1722091500000  // milliseconds since epoch
 * }
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { userId, sender, message, timestamp } = body;

    if (!userId || !sender || !message || !timestamp) {
      return NextResponse.json(
        {
          error: "Missing required fields: userId, sender, message, timestamp",
        },
        { status: 400 }
      );
    }

    // Validate message length
    if (message.length > 1600) {
      return NextResponse.json(
        { error: "Message too long (max 1600 characters)" },
        { status: 400 }
      );
    }

    // Parse SMS
    const rawSms: RawSmsMessage = {
      sender,
      message,
      timestamp: Math.floor(timestamp), // Ensure integer
    };

    const parsed = parseSmsTransaction(rawSms);

    // Skip if not detected as transaction
    if (!parsed.isTransaction) {
      return NextResponse.json(
        {
          detected: false,
          reason: "Not identified as a transaction message",
          message: "This SMS appears to be promotional, OTP, or unrelated",
        },
        { status: 200 }
      );
    }

    // Validate amount
    if (parsed.amount <= 0 || parsed.amount > 1000000) {
      return NextResponse.json(
        {
          detected: false,
          reason: "Invalid amount",
          amount: parsed.amount,
        },
        { status: 200 }
      );
    }

    // Categorize merchant
    const category = categorizeTransaction(parsed.merchant, parsed.amount);

    // Check for duplicate (same amount, merchant, within 5 minutes)
    const fiveMinutesAgo = new Date(timestamp - 5 * 60 * 1000);
    const dupQuery = query(
      collection(db, "sms_transactions"),
      where("userId", "==", userId),
      where("merchant", "==", parsed.merchant),
      where("amount", "==", parsed.amount),
      where("date", "==", parsed.date),
      where("status", "==", "pending")
    );

    const dupSnapshot = await getDocs(dupQuery);

    if (!dupSnapshot.empty) {
      return NextResponse.json(
        {
          detected: true,
          duplicate: true,
          message: "Similar transaction already detected",
          existingId: dupSnapshot.docs[0].id,
        },
        { status: 200 }
      );
    }

    // Store in Firestore
    const docRef = await addDoc(collection(db, "sms_transactions"), {
      userId,
      merchant: parsed.merchant,
      category,
      amount: parsed.amount,
      date: Timestamp.fromDate(new Date(parsed.date)),
      paymentMethod: parsed.paymentMethod,
      confidence: parsed.confidence,
      status: "pending",
      aiTagged: true,
      rawSender: sender,
      rawMessage: message, // Store for debugging/review
      createdAt: Timestamp.now(),
      source: "sms", // Mark as SMS source
    });

    return NextResponse.json({
      detected: true,
      duplicate: false,
      id: docRef.id,
      transaction: {
        merchant: parsed.merchant,
        category,
        amount: parsed.amount,
        date: parsed.date,
        paymentMethod: parsed.paymentMethod,
        confidence: parsed.confidence,
      },
      message: "Transaction detected and stored as pending",
    });
  } catch (error) {
    console.error("POST /api/sms-parse error:", error);
    return NextResponse.json(
      { error: "Failed to parse SMS", details: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 }
    );
  }
}

/**
 * POST /api/sms-parse/batch
 *
 * Process multiple SMS messages in batch (e.g., on first app launch)
 *
 * Body:
 * {
 *   "userId": "user123",
 *   "messages": [
 *     { "sender": "HDFC", "message": "...", "timestamp": 1722091500000 },
 *     { "sender": "ICICI", "message": "...", "timestamp": 1722091600000 }
 *   ]
 * }
 */
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { userId, messages } = body;

    if (!userId || !messages || !Array.isArray(messages)) {
      return NextResponse.json(
        { error: "Missing or invalid messages array" },
        { status: 400 }
      );
    }

    if (messages.length > 100) {
      return NextResponse.json(
        { error: "Maximum 100 messages per batch" },
        { status: 400 }
      );
    }

    const results = {
      processed: 0,
      detected: 0,
      skipped: 0,
      errors: 0,
      transactions: [] as any[],
    };

    for (const msg of messages) {
      try {
        const { sender, message, timestamp } = msg;

        if (!sender || !message || !timestamp) {
          results.errors++;
          continue;
        }

        const rawSms: RawSmsMessage = {
          sender,
          message,
          timestamp: Math.floor(timestamp),
        };

        const parsed = parseSmsTransaction(rawSms);
        results.processed++;

        if (!parsed.isTransaction || parsed.amount <= 0 || parsed.amount > 1000000) {
          results.skipped++;
          continue;
        }

        // Check for duplicate
        const dupQuery = query(
          collection(db, "sms_transactions"),
          where("userId", "==", userId),
          where("merchant", "==", parsed.merchant),
          where("amount", "==", parsed.amount),
          where("date", "==", parsed.date),
          where("status", "==", "pending")
        );

        const dupSnapshot = await getDocs(dupQuery);
        if (!dupSnapshot.empty) {
          results.skipped++;
          continue;
        }

        const category = categorizeTransaction(parsed.merchant, parsed.amount);

        const docRef = await addDoc(collection(db, "sms_transactions"), {
          userId,
          merchant: parsed.merchant,
          category,
          amount: parsed.amount,
          date: Timestamp.fromDate(new Date(parsed.date)),
          paymentMethod: parsed.paymentMethod,
          confidence: parsed.confidence,
          status: "pending",
          aiTagged: true,
          rawSender: sender,
          rawMessage: message,
          createdAt: Timestamp.now(),
          source: "sms",
        });

        results.detected++;
        results.transactions.push({
          id: docRef.id,
          merchant: parsed.merchant,
          category,
          amount: parsed.amount,
          confidence: parsed.confidence,
        });
      } catch (err) {
        console.error("Batch processing error:", err);
        results.errors++;
      }
    }

    return NextResponse.json({
      summary: results,
      message: `Processed ${results.processed} messages, detected ${results.detected} transactions`,
    });
  } catch (error) {
    console.error("PUT /api/sms-parse error:", error);
    return NextResponse.json(
      { error: "Batch processing failed" },
      { status: 500 }
    );
  }
}
