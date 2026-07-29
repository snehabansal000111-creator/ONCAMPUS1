import type { SmsDetectedTransaction } from "@/types";

export interface RawSmsMessage {
  sender: string;
  message: string;
  timestamp: number;
}

export interface ParsedSmsData {
  amount: number;
  merchant: string;
  date: string;
  paymentMethod: "UPI" | "Card" | "Bank Transfer" | "Unknown";
  confidence: number; // 0-100
  isTransaction: boolean;
}

// Common bank/UPI app sender IDs (Android shortcodes)
const TRANSACTION_SENDERS = [
  "HDFC", "ICIC", "AXIS", "SBIN", "BKID", "AUBANK",
  "INDUS", "KOTAK", "YESB", "IDBI", "AIRTEL", "AIRTELP",
  "GOOGL", "AMZN", "ZOMATO", "SWIGGY", "DELHIVERY",
  "Paytm", "PhonePe", "GooglePay", "WhatsApp", "Razorpay",
  "ICICI", "HDFC1", "HSBC", "BOM", "SCBL", "ICICIB"
];

// Pattern to identify OTP messages
const OTP_PATTERNS = [
  /\botp\b/i,
  /\bverification code\b/i,
  /\bpin\b/i,
  /\bconfirm.*code\b/i,
  /\b\d{4,6}\b.*valid/i,
  /security code/i,
  /one.*time.*password/i,
];

// Pattern to identify promotional/marketing messages
const PROMO_PATTERNS = [
  /discount/i,
  /offer/i,
  /cashback/i,
  /reward/i,
  /free.*shipping/i,
  /limited.*time/i,
  /buy.*now/i,
  /sale/i,
  /coupon/i,
  /promo/i,
  /subscribe/i,
  /follow.*us/i,
];

// UPI transaction pattern (most reliable)
const UPI_PATTERN = /(?:sent|received|debited|credited|transferred)\s*(?:to|from|by)?\s*([a-zA-Z0-9\s\.@-]+)\s*(?:of|with|amount)?\s*(?:₹|Rs\.?)\s*([\d,]+(?:\.\d{2})?)/i;

// Amount pattern (various formats)
const AMOUNT_PATTERN = /(?:₹|Rs\.?|INR)\s*([\d,]+(?:\.\d{2})?)/i;

// Merchant pattern
const MERCHANT_PATTERN = /(?:to|from|at|merchant|account|store)\s*([A-Z][A-Za-z\s\d\.'-]*?)(?:\s*(?:of|for|on|at|with|in|\.|,|$))/i;

export function isTransactionSms(message: string, sender: string): boolean {
  // Check if sender is known transaction source
  const knownSender = TRANSACTION_SENDERS.some(s =>
    sender.toUpperCase().includes(s.toUpperCase())
  );

  if (!knownSender) return false;

  // Check for OTP pattern
  if (OTP_PATTERNS.some(pattern => pattern.test(message))) {
    return false;
  }

  // Must have amount indicator
  if (!AMOUNT_PATTERN.test(message)) {
    return false;
  }

  return true;
}

export function isPromotionalSms(message: string): boolean {
  // If message is mostly promo keywords, filter it
  const promoMatches = PROMO_PATTERNS.filter(p => p.test(message)).length;
  return promoMatches >= 2; // At least 2 promo indicators
}

export function parseSmsTransaction(sms: RawSmsMessage): ParsedSmsData {
  const message = sms.message;
  const sender = sms.sender;

  // Default response for non-transactions
  const defaultResponse: ParsedSmsData = {
    amount: 0,
    merchant: sender,
    date: new Date(sms.timestamp).toISOString().split("T")[0],
    paymentMethod: "Unknown",
    confidence: 0,
    isTransaction: false,
  };

  // Check if it's a transaction
  if (!isTransactionSms(message, sender)) {
    return defaultResponse;
  }

  // Check if promotional
  if (isPromotionalSms(message)) {
    return { ...defaultResponse, isTransaction: false };
  }

  let confidence = 50; // Base confidence

  // Extract amount
  let amount = 0;
  const amountMatch = message.match(AMOUNT_PATTERN);
  if (amountMatch) {
    const amountStr = amountMatch[1].replace(/,/g, "");
    amount = parseFloat(amountStr);
    confidence += 20;
  }

  // Extract merchant
  let merchant = extractMerchant(message, sender);
  if (merchant && merchant.length > 2) {
    confidence += 15;
  }

  // Detect payment method
  const paymentMethod = detectPaymentMethod(message);
  if (paymentMethod !== "Unknown") {
    confidence += 10;
  }

  // Extract date (use current date if not found)
  const date = new Date(sms.timestamp).toISOString().split("T")[0];

  // Adjust confidence based on message structure
  if (message.includes("debit") || message.includes("credit")) {
    confidence += 5;
  }

  // Cap confidence at 99 (never 100% sure without manual review)
  confidence = Math.min(confidence, 99);

  return {
    amount,
    merchant: merchant || sender,
    date,
    paymentMethod,
    confidence: Math.max(confidence, 40), // Minimum 40% if passed filters
    isTransaction: true,
  };
}

function extractMerchant(message: string, sender: string): string {
  // Try UPI pattern first (most specific)
  let match = message.match(UPI_PATTERN);
  if (match && match[1]) {
    const merchant = match[1].trim();
    if (merchant.length > 1) {
      return capitalizeMerchant(merchant);
    }
  }

  // Try general merchant pattern
  match = message.match(MERCHANT_PATTERN);
  if (match && match[1]) {
    const merchant = match[1].trim();
    if (merchant.length > 1) {
      return capitalizeMerchant(merchant);
    }
  }

  // Extract from known patterns
  if (message.includes("Zomato")) return "Zomato";
  if (message.includes("Swiggy")) return "Swiggy";
  if (message.includes("Amazon") || message.includes("AMZN")) return "Amazon";
  if (message.includes("Flipkart")) return "Flipkart";
  if (message.includes("Paytm")) return "Paytm";
  if (message.includes("PhonePe") || message.includes("GOOGL")) return "PhonePe";
  if (message.includes("Uber")) return "Uber";
  if (message.includes("Ola")) return "Ola";
  if (message.includes("Myntra")) return "Myntra";
  if (message.includes("Ajio")) return "Ajio";
  if (message.includes("Netflix")) return "Netflix";
  if (message.includes("Spotify")) return "Spotify";
  if (message.includes("Hotstar")) return "Disney+ Hotstar";
  if (message.includes("BookMyShow")) return "BookMyShow";
  if (message.includes("Booking")) return "Booking.com";
  if (message.includes("MakeMyTrip")) return "MakeMyTrip";

  // Use sender as fallback
  return sender;
}

function capitalizeMerchant(text: string): string {
  return text
    .trim()
    .split(/\s+/)
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(" ")
    .substring(0, 50); // Max 50 chars
}

function detectPaymentMethod(message: string): ParsedSmsData["paymentMethod"] {
  const lowerMsg = message.toLowerCase();

  if (
    lowerMsg.includes("upi") ||
    lowerMsg.includes("googlepay") ||
    lowerMsg.includes("phonepe") ||
    lowerMsg.includes("paytm") ||
    lowerMsg.includes("sent to") ||
    lowerMsg.includes("sent via")
  ) {
    return "UPI";
  }

  if (
    lowerMsg.includes("card") ||
    lowerMsg.includes("credit") ||
    lowerMsg.includes("debit card")
  ) {
    return "Card";
  }

  if (
    lowerMsg.includes("bank transfer") ||
    lowerMsg.includes("neft") ||
    lowerMsg.includes("rtgs") ||
    lowerMsg.includes("imps") ||
    lowerMsg.includes("transfer") ||
    lowerMsg.includes("cleared")
  ) {
    return "Bank Transfer";
  }

  return "Unknown";
}

// Categorize transaction based on merchant and amount
export function categorizeTransaction(merchant: string, amount: number): string {
  const lowerMerchant = merchant.toLowerCase();

  // Food delivery
  if (
    lowerMerchant.includes("zomato") ||
    lowerMerchant.includes("swiggy") ||
    lowerMerchant.includes("domino") ||
    lowerMerchant.includes("pizza")
  ) {
    return "Food";
  }

  // Shopping
  if (
    lowerMerchant.includes("amazon") ||
    lowerMerchant.includes("flipkart") ||
    lowerMerchant.includes("myntra") ||
    lowerMerchant.includes("ajio") ||
    lowerMerchant.includes("shop")
  ) {
    return "Shopping";
  }

  // Transport
  if (
    lowerMerchant.includes("uber") ||
    lowerMerchant.includes("ola") ||
    lowerMerchant.includes("metro") ||
    lowerMerchant.includes("bus") ||
    lowerMerchant.includes("flight")
  ) {
    return "Transport";
  }

  // Entertainment
  if (
    lowerMerchant.includes("netflix") ||
    lowerMerchant.includes("spotify") ||
    lowerMerchant.includes("hotstar") ||
    lowerMerchant.includes("bookmyshow") ||
    lowerMerchant.includes("cinema")
  ) {
    return "Entertainment";
  }

  // Accommodation
  if (
    lowerMerchant.includes("hotel") ||
    lowerMerchant.includes("hostel") ||
    lowerMerchant.includes("airbnb") ||
    lowerMerchant.includes("booking") ||
    lowerMerchant.includes("pg")
  ) {
    return "Hostel/PG";
  }

  // Education
  if (
    lowerMerchant.includes("udemy") ||
    lowerMerchant.includes("coursera") ||
    lowerMerchant.includes("education") ||
    lowerMerchant.includes("school") ||
    lowerMerchant.includes("university")
  ) {
    return "Education";
  }

  // Health
  if (
    lowerMerchant.includes("pharmacy") ||
    lowerMerchant.includes("apollo") ||
    lowerMerchant.includes("hospital") ||
    lowerMerchant.includes("clinic") ||
    lowerMerchant.includes("medical")
  ) {
    return "Health";
  }

  // Default to Others
  return "Others";
}

// Example SMS formats this parser handles:
/*
HDFC Bank: Debit alert on A/C XXXXX6789. Your a/c has been debited for Rs.340/- at ZOMATO on 27-Jul-26 19:45:00 IST. Available Balance: Rs.45,678/-. For SMS alerts call 1860-425-4332.

ICICI Bank: Dear Valued Customer, Your Debit Card ending with 4567 has been used for a transaction of Rs. 180 at UBER on 24-Jul-26 20:15 IST. Remaining Balance: Rs. 25,000. Keep it secure. Do not share OTP with anyone.

PhonePe: ₹1250 sent to Amazon Pay at 22-Jul-26. Thank you for using PhonePe!

Google Pay: ₹450 paid to Myntra via Google Pay on 27-Jul-26.

Paytm: Dear User, ₹899 has been deducted from your account towards Myntra on 27-Jul-26 at 05:30 PM. Transaction ID: 123456789. Remaining Balance: ₹5,000.

SBI: Dear Customer, Your A/C XXXXX3456 has been debited with Rs.500 for UPI/Google Pay/NEFT txn on 28-Jul-26.

Axis Bank: Alert! Your Card XXXXXXX1234 is used to swipe Rs.3500 for HOSTEL FEE at 25-Jul-26. Your current balance is Rs 28,450.
*/
