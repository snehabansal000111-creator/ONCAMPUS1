# SMS Detection Module - Complete Guide

## Overview

This module automatically detects and parses financial transactions from SMS messages sent by banks and UPI apps on Android devices. It intelligently filters OTPs, promotional messages, and extracts transaction details.

---

## How It Works

### 1. SMS Parsing Flow

```
Android Device (receives SMS)
    ↓
SMS Permission (read SMS)
    ↓
Parse raw SMS in app
    ↓
Send to /api/sms-parse
    ↓
Backend parses & validates
    ↓
Store as "pending" in Firestore
    ↓
User reviews in App
    ↓
Accept → Convert to regular expense
Reject → Mark as ignored
Edit → Update details & accept
```

### 2. Intelligent Filtering

The parser automatically ignores:
- ❌ OTP messages ("verification code", "confirm code", etc.)
- ❌ Promotional messages (discount, offer, cashback, sale, etc.)
- ❌ Non-transaction messages (no amount or known bank sender)
- ❌ Duplicate transactions (same merchant, amount, within 5 min)

Detects as transactions:
- ✅ Bank debit/credit alerts
- ✅ UPI transfers (PhonePe, Google Pay, Paytm)
- ✅ Card payments
- ✅ Online shopping transactions

### 3. Auto-Categorization

Based on merchant name, amounts are automatically sorted into:
- **Food** - Zomato, Swiggy, Domino's, etc.
- **Shopping** - Amazon, Flipkart, Myntra, etc.
- **Transport** - Uber, Ola, Metro, flight bookings
- **Entertainment** - Netflix, Spotify, Disney+, BookMyShow
- **Hostel/PG** - Hotel, Airbnb, Booking.com
- **Education** - Udemy, Coursera, course fees
- **Health** - Pharmacy, Hospital, Apollo, medical
- **Others** - Everything else

---

## Supported SMS Formats

The parser handles SMS from all major Indian banks and UPI apps:

### Bank Formats

**HDFC Bank:**
```
Debit alert on A/C XXXXX6789. Your a/c has been debited for Rs.340/- 
at ZOMATO on 27-Jul-26 19:45:00 IST. Available Balance: Rs.45,678/-.
```

**ICICI Bank:**
```
Dear Valued Customer, Your Debit Card ending with 4567 has been used 
for a transaction of Rs. 180 at UBER on 24-Jul-26 20:15 IST. 
Remaining Balance: Rs. 25,000.
```

**SBI:**
```
Dear Customer, Your A/C XXXXX3456 has been debited with Rs.500 for 
UPI/Google Pay/NEFT txn on 28-Jul-26.
```

**Axis Bank:**
```
Alert! Your Card XXXXXXX1234 is used to swipe Rs.3500 for HOSTEL FEE 
at 25-Jul-26. Your current balance is Rs 28,450.
```

### UPI App Formats

**PhonePe:**
```
₹1250 sent to Amazon Pay at 22-Jul-26. Thank you for using PhonePe!
```

**Google Pay:**
```
₹450 paid to Myntra via Google Pay on 27-Jul-26.
```

**Paytm:**
```
Dear User, ₹899 has been deducted from your account towards Myntra 
on 27-Jul-26 at 05:30 PM. Transaction ID: 123456789.
```

---

## Backend APIs

### 1. Parse & Store Single SMS

**Endpoint:** `POST /api/sms-parse`

**Description:** Send raw SMS from Android, backend parses and stores if valid transaction.

**Request:**
```json
{
  "userId": "user123",
  "sender": "HDFC",
  "message": "Debit alert on A/C XXXXX6789. Your a/c has been debited for Rs.340/- at ZOMATO on 27-Jul-26 19:45:00 IST. Available Balance: Rs.45,678/-.",
  "timestamp": 1722091500000
}
```

**Response (Transaction Detected):**
```json
{
  "detected": true,
  "duplicate": false,
  "id": "sms_doc_123",
  "transaction": {
    "merchant": "Zomato",
    "category": "Food",
    "amount": 340,
    "date": "2026-07-27",
    "paymentMethod": "Card",
    "confidence": 87
  },
  "message": "Transaction detected and stored as pending"
}
```

**Response (Not a Transaction):**
```json
{
  "detected": false,
  "reason": "Not identified as a transaction message",
  "message": "This SMS appears to be promotional, OTP, or unrelated"
}
```

**Response (Duplicate):**
```json
{
  "detected": true,
  "duplicate": true,
  "message": "Similar transaction already detected",
  "existingId": "sms_doc_456"
}
```

### 2. Batch Process SMS Messages

**Endpoint:** `PUT /api/sms-parse`

**Description:** Process multiple SMS messages at once (e.g., on first app launch).

**Request:**
```json
{
  "userId": "user123",
  "messages": [
    {
      "sender": "HDFC",
      "message": "Debit alert...",
      "timestamp": 1722091500000
    },
    {
      "sender": "ICICI",
      "message": "Dear Valued Customer...",
      "timestamp": 1722091600000
    }
  ]
}
```

**Response:**
```json
{
  "summary": {
    "processed": 2,
    "detected": 1,
    "skipped": 1,
    "errors": 0,
    "transactions": [
      {
        "id": "sms_doc_123",
        "merchant": "Zomato",
        "category": "Food",
        "amount": 340,
        "confidence": 87
      }
    ]
  },
  "message": "Processed 2 messages, detected 1 transactions"
}
```

### 3. Get Pending SMS Transactions

**Endpoint:** `GET /api/sms-transactions?userId=...&status=pending`

**Response:**
```json
{
  "transactions": [
    {
      "id": "sms_doc_123",
      "merchant": "Zomato",
      "category": "Food",
      "amount": 340,
      "date": "2026-07-27",
      "paymentMethod": "Card",
      "confidence": 87,
      "status": "pending",
      "aiTagged": true
    }
  ]
}
```

### 4. Accept SMS Transaction

**Endpoint:** `PUT /api/sms-transactions/[id]?action=accept`

**Description:** Convert SMS transaction to regular expense and mark as accepted.

**Request:**
```json
{}
```

**Response:**
```json
{
  "message": "SMS transaction accepted and converted to expense",
  "expenseId": "expense_doc_789"
}
```

### 5. Reject/Ignore SMS Transaction

**Endpoint:** `PUT /api/sms-transactions/[id]?action=reject`

**Description:** Mark SMS transaction as ignored with optional reason.

**Request:**
```json
{
  "reason": "Not a real expense"
}
```

**Response:**
```json
{
  "message": "SMS transaction rejected"
}
```

### 6. Edit SMS Transaction

**Endpoint:** `PUT /api/sms-transactions/[id]?action=edit`

**Description:** Correct merchant, category, amount, or payment method before accepting.

**Request:**
```json
{
  "merchant": "Zomato (Corrected)",
  "category": "Food",
  "amount": 350,
  "paymentMethod": "UPI"
}
```

**Response:**
```json
{
  "message": "SMS transaction edited successfully",
  "updated": {
    "merchant": "Zomato (Corrected)",
    "category": "Food",
    "amount": 350
  }
}
```

### 7. Delete SMS Transaction

**Endpoint:** `DELETE /api/sms-transactions/[id]`

**Description:** Delete a pending SMS transaction (only pending can be deleted).

**Response:**
```json
{
  "message": "SMS transaction deleted"
}
```

---

## Android Integration Guide

### Requirements

- Android 6.0 or higher
- SMS permission (`android.permission.READ_SMS`)
- Internet permission (`android.permission.INTERNET`)
- Firebase Authentication (for userId)

### 1. Request SMS Permission

**AndroidManifest.xml:**
```xml
<uses-permission android:name="android.permission.READ_SMS" />
<uses-permission android:name="android.permission.RECEIVE_SMS" />
<uses-permission android:name="android.permission.INTERNET" />
```

**Runtime Permission (Android 6.0+):**
```kotlin
import android.Manifest
import androidx.core.app.ActivityCompat

private val permissions = arrayOf(Manifest.permission.READ_SMS)

fun requestSmsPermission() {
    ActivityCompat.requestPermissions(this, permissions, REQUEST_CODE_SMS)
}

override fun onRequestPermissionsResult(
    requestCode: Int, 
    permissions: Array<String>, 
    grantResults: IntArray
) {
    super.onRequestPermissionsResult(requestCode, permissions, grantResults)
    if (requestCode == REQUEST_CODE_SMS && grantResults.isNotEmpty()) {
        if (grantResults[0] == PackageManager.PERMISSION_GRANTED) {
            scanSmsMessages()
        }
    }
}
```

### 2. Read SMS Messages

```kotlin
import android.content.ContentResolver
import android.provider.Telephony.Sms

fun readSmsMessages(): List<SmsMessage> {
    val messages = mutableListOf<SmsMessage>()
    val cursor = contentResolver.query(
        Telephony.Sms.CONTENT_URI,
        arrayOf(
            Telephony.Sms._ID,
            Telephony.Sms.ADDRESS,    // sender/number
            Telephony.Sms.BODY,       // message content
            Telephony.Sms.DATE        // timestamp in milliseconds
        ),
        null, null,
        "${Telephony.Sms.DATE} DESC"  // latest first
    )

    cursor?.use {
        while (it.moveToNext()) {
            val sender = it.getString(1)  // Column 1: ADDRESS
            val body = it.getString(2)    // Column 2: BODY
            val date = it.getLong(3)      // Column 3: DATE

            messages.add(
                SmsMessage(
                    sender = sender,
                    message = body,
                    timestamp = date
                )
            )
        }
    }

    return messages
}

data class SmsMessage(
    val sender: String,
    val message: String,
    val timestamp: Long
)
```

### 3. Send to Backend

```kotlin
import okhttp3.OkHttpClient
import okhttp3.MediaType.Companion.toMediaType
import okhttp3.RequestBody.Companion.toRequestBody
import org.json.JSONObject

suspend fun submitSmsToBackend(
    userId: String,
    sender: String,
    message: String,
    timestamp: Long
) {
    val client = OkHttpClient()
    val url = "https://your-backend.com/api/sms-parse"
    
    val json = JSONObject().apply {
        put("userId", userId)
        put("sender", sender)
        put("message", message)
        put("timestamp", timestamp)
    }
    
    val body = json.toString()
        .toRequestBody("application/json".toMediaType())
    
    val request = okhttp3.Request.Builder()
        .url(url)
        .post(body)
        .build()
    
    client.newCall(request).execute().use { response ->
        if (response.isSuccessful) {
            val responseBody = response.body?.string()
            val result = JSONObject(responseBody)
            
            if (result.getBoolean("detected")) {
                showNotification("Transaction detected: ${result.getString("id")}")
            }
        }
    }
}
```

### 4. Batch Import (First Launch)

```kotlin
suspend fun batchImportSms(userId: String, days: Int = 30) {
    val allMessages = readSmsMessages()
    val cutoffDate = System.currentTimeMillis() - (days * 24 * 60 * 60 * 1000)
    
    val recentMessages = allMessages
        .filter { it.timestamp >= cutoffDate }
        .map { 
            mapOf(
                "sender" to it.sender,
                "message" to it.message,
                "timestamp" to it.timestamp
            )
        }
    
    val json = JSONObject().apply {
        put("userId", userId)
        put("messages", org.json.JSONArray(recentMessages))
    }
    
    val client = OkHttpClient()
    val request = okhttp3.Request.Builder()
        .url("https://your-backend.com/api/sms-parse")
        .put(json.toString()
            .toRequestBody("application/json".toMediaType()))
        .build()
    
    client.newCall(request).execute().use { response ->
        val result = JSONObject(response.body?.string() ?: "")
        val detected = result.getJSONObject("summary").getInt("detected")
        showNotification("Imported $detected transactions")
    }
}
```

### 5. Listen for New SMS

```kotlin
import android.content.BroadcastReceiver
import android.content.Context
import android.content.Intent
import android.provider.Telephony

class SmsReceiver : BroadcastReceiver() {
    override fun onReceive(context: Context, intent: Intent) {
        if (intent.action == Telephony.Sms.Intents.SMS_RECEIVED_ACTION) {
            val messages = Telephony.Sms.Intents.getMessagesFromIntent(intent)
            
            for (sms in messages) {
                val sender = sms.originatingAddress ?: return
                val message = sms.messageBody
                val timestamp = sms.timestampMillis
                
                // Send to backend
                CoroutineScope(Dispatchers.Main).launch {
                    submitSmsToBackend(userId, sender, message, timestamp)
                }
            }
        }
    }
}
```

**AndroidManifest.xml:**
```xml
<receiver android:name=".SmsReceiver">
    <intent-filter>
        <action android:name="android.provider.Telephony.SMS_RECEIVED" />
    </intent-filter>
</receiver>
```

---

## Frontend Integration (Web)

### Using React Hooks

```tsx
import { useSmsDetection } from "@/hooks/useSmsDetection";

export default function SmsReview() {
  const { accept, reject, edit, ignore, loading } = useSmsDetectionActions();

  const handleAccept = async (id: string) => {
    const success = await accept(id);
    if (success) {
      // Refresh list
      mutate();
    }
  };

  const handleEdit = async (id: string) => {
    const success = await edit(id, {
      merchant: "Corrected Name",
      amount: 500,
    });
    if (success) {
      mutate();
    }
  };

  const handleReject = async (id: string) => {
    const success = await reject(id, "Not a real expense");
    if (success) {
      mutate();
    }
  };

  return (
    <div>
      {/* Transaction cards with buttons */}
      <button onClick={() => handleAccept(id)}>Accept</button>
      <button onClick={() => handleEdit(id)}>Edit</button>
      <button onClick={() => handleReject(id)}>Reject</button>
    </div>
  );
}
```

### SmsDetection Component Updates

The existing `SmsDetection.tsx` component already uses:
```tsx
const { transactions } = useSmsTransactions(user?.uid, "pending");
```

To add the action handlers:
```tsx
const { accept, reject, edit } = useSmsDetectionActions();

const handleAccept = async (id: string) => {
  if (await accept(id)) {
    // Transaction moved to expenses
    setStatus(id, "accepted");
  }
};

const handleReject = async (id: string) => {
  if (await reject(id)) {
    setStatus(id, "ignored");
  }
};
```

---

## Firestore Schema

### SMS Transactions Collection

```
{
  id: "sms_doc_123",
  userId: "user123",
  merchant: "Zomato",
  category: "Food",
  amount: 340,
  date: Timestamp(2026-07-27),
  paymentMethod: "Card",
  confidence: 87,
  status: "pending" | "accepted" | "ignored",
  aiTagged: true,
  rawSender: "HDFC",
  rawMessage: "Debit alert on A/C XXXXX...",
  createdAt: Timestamp(2026-07-28T10:15:00Z),
  updatedAt: Timestamp(2026-07-28T10:16:00Z),
  source: "sms",
  linkedExpenseId: "expense_doc_789",      // After accepting
  manuallyEdited: true,                     // If user edited
  rejectionReason: "Not a real expense"     // If rejected
}
```

---

## Confidence Scoring

The parser assigns confidence (0-100) based on:

- **Base**: 50% (passed filters)
- **Amount found**: +20%
- **Merchant identified**: +15%
- **Payment method detected**: +10%
- **Structure quality**: +5%
- **Maximum**: 99% (always leaves room for manual review)
- **Minimum**: 40% (if barely passed filters)

### Confidence Levels

- **90-99%**: Very high confidence, safe to auto-accept
- **75-89%**: High confidence, should review
- **60-74%**: Medium confidence, recommend review
- **40-59%**: Low confidence, definitely review before accepting

---

## Best Practices

### 1. Always Request Permission First
```kotlin
if (ContextCompat.checkSelfPermission(
    this, Manifest.permission.READ_SMS
) != PackageManager.PERMISSION_GRANTED) {
    ActivityCompat.requestPermissions(this, arrayOf(Manifest.permission.READ_SMS), 1)
}
```

### 2. Handle Failed Requests Gracefully
```kotlin
try {
    submitSmsToBackend(...)
} catch (e: Exception) {
    showError("Failed to sync SMS: ${e.message}")
    // Queue for retry
}
```

### 3. Privacy: Minimize Data Sent
- Don't send account numbers or card details
- Remove sensitive info from raw message before storing
- Only send necessary SMS to backend

### 4. Rate Limiting
- Batch SMS processing on initial sync
- After that, sync only new SMS (from last 24 hours)
- Don't sync every 5 minutes

### 5. Deduplication
- Backend auto-detects duplicates (same amount/merchant/date)
- Don't send same SMS twice

---

## Troubleshooting

### Issue: Permission Denied

**Solution:**
- Check `AndroidManifest.xml` has SMS permission
- Request runtime permission on Android 6.0+
- Check Settings > Apps > YourApp > Permissions > SMS

### Issue: SMS Not Detected

**Possible Causes:**
- SMS format not recognized (add to `TRANSACTION_SENDERS`)
- OTP or promotional (check filters)
- No valid amount found

**Solution:**
- Share raw SMS in GitHub issue
- Can add custom parser for that bank

### Issue: High False Positives

**Solution:**
- Review confidence scores
- Adjust `PROMO_PATTERNS` if filtering too much

### Issue: Merchant Not Recognized

**Solution:**
- Edit transaction to correct merchant
- Parser will learn and improve

---

## Testing

### Test SMS Messages

**HDFC Bank:**
```
Debit alert on A/C XXXXX6789. Your a/c has been debited for Rs.340/- at ZOMATO on 27-Jul-26 19:45:00 IST. Available Balance: Rs.45,678/-.
```

**OTP (Should Filter):**
```
Your OTP is 123456. Valid for 10 minutes. Do not share with anyone.
```

**Promotional (Should Filter):**
```
ZOMATO: Get 50% OFF on your next order! Limited time offer. Use code ZOMATO50.
```

---

## Summary

| Feature | Status |
|---------|--------|
| SMS Parsing | ✅ Complete |
| OTP Filtering | ✅ Complete |
| Promotional Filtering | ✅ Complete |
| Auto-categorization | ✅ Complete |
| Duplicate Detection | ✅ Complete |
| Accept/Reject/Edit | ✅ Complete |
| Android Integration Guide | ✅ Complete |
| Batch Import | ✅ Complete |
| Confidence Scoring | ✅ Complete |

---

**Status:** Ready for Android implementation and testing

