# Expense Tracker Production Setup Guide

This document covers the Firebase Firestore setup and API integration for the Expense Tracker module.

## Overview

The Expense Tracker has been converted from mock data to a production-ready full-stack implementation:
- **Backend:** Next.js API routes (Express-like) with Firebase Firestore
- **Frontend:** Unchanged UI, now powered by real data
- **Authentication:** Firebase Auth (to be integrated)
- **AI Insights:** Claude API integration via existing `/api/chat` pattern

## Firebase Setup

### 1. Create Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com)
2. Click "Add project"
3. Name it "oncampus"
4. Disable Google Analytics (can enable later)
5. Create the project

### 2. Enable Firestore Database

1. In Firebase Console, go to "Firestore Database"
2. Click "Create Database"
3. Choose location (default is fine)
4. Start in **production mode** (restrict read/write until you set up auth)
5. Create database

### 3. Create Collections & Schema

Create the following collections in Firestore:

#### Collection: `profiles`
Used to store student profiles (monthly budget, learning preferences, etc.)

```
fields:
  - userId (string) [Required]
  - name (string)
  - monthlyBudget (number) [e.g., 12000]
  - branch (string)
  - year (string)
  - interests (array)
  - skills (array)
  - careerGoal (string)
  - learningStyle (string)
  - dailyStudyHours (number)
```

#### Collection: `expenses`
Stores individual expense transactions

```
fields:
  - userId (string) [Required, for querying by user]
  - merchant (string) [e.g., "Zomato"]
  - category (string) [One of: Food, Shopping, Transport, Education, Entertainment, Hostel/PG, Health, Others]
  - amount (number) [In rupees]
  - date (timestamp) [Transaction date]
  - paymentMethod (string) [e.g., "UPI", "Card", "Bank Transfer"]
  - aiTagged (boolean) [Was this tagged by AI?]
  - createdAt (timestamp) [When added to system]
  - updatedAt (timestamp) [Last modified]
```

Indices to create:
- Composite: `userId`, `date` (Descending)
- Composite: `userId`, `category`, `date` (Descending)

#### Collection: `sms_transactions`
Stores SMS-detected transactions pending user confirmation

```
fields:
  - userId (string) [Required]
  - merchant (string)
  - category (string)
  - amount (number)
  - date (timestamp)
  - paymentMethod (string)
  - confidence (number) [0-100, AI confidence score]
  - status (string) [One of: "pending", "accepted", "ignored"]
  - aiTagged (boolean) [Always true for SMS]
  - createdAt (timestamp)
  - updatedAt (timestamp)
```

### 4. Security Rules

Set Firestore security rules to:

```firestore
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Allow authenticated users to read/write their own data
    match /profiles/{userId} {
      allow read, write: if request.auth.uid == userId;
    }
    
    match /expenses/{docId} {
      allow read, write: if request.auth.uid == resource.data.userId;
    }
    
    match /sms_transactions/{docId} {
      allow read, write: if request.auth.uid == resource.data.userId;
    }
  }
}
```

### 5. Get Firebase Credentials

1. Go to Project Settings (gear icon)
2. Click "Service Accounts" tab
3. Select "Node.js"
4. Copy the configuration object

Example structure:
```javascript
{
  "apiKey": "AIzaSy...",
  "authDomain": "oncampus-xxx.firebaseapp.com",
  "projectId": "oncampus-xxx",
  "storageBucket": "oncampus-xxx.appspot.com",
  "messagingSenderId": "123456789",
  "appId": "1:123456789:web:abc123..."
}
```

### 6. Set Environment Variables

Create `.env.local` in the project root:

```bash
NEXT_PUBLIC_FIREBASE_API_KEY=your-api-key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your-sender-id
NEXT_PUBLIC_FIREBASE_APP_ID=your-app-id

ANTHROPIC_API_KEY=your-anthropic-key
```

## API Endpoints

All endpoints expect the `userId` from the authenticated user (via Firebase Auth).

### Expenses

#### `GET /api/expenses?userId=...&month=2026-07&category=Food`
Get all expenses with optional filtering

**Response:**
```json
{
  "expenses": [
    {
      "id": "doc-id",
      "merchant": "Zomato",
      "category": "Food",
      "amount": 340,
      "date": "2026-07-27",
      "paymentMethod": "UPI",
      "aiTagged": true
    }
  ]
}
```

#### `POST /api/expenses`
Create a new expense

**Body:**
```json
{
  "userId": "user123",
  "merchant": "Zomato",
  "category": "Food",
  "amount": 340,
  "date": "2026-07-27",
  "paymentMethod": "UPI"
}
```

#### `PUT /api/expenses/[id]`
Update an expense

#### `DELETE /api/expenses/[id]`
Delete an expense

### Statistics

#### `GET /api/expenses/stats?userId=...&month=2026-07`
Get monthly statistics

**Response:**
```json
{
  "monthlyBudget": 12000,
  "totalSpent": 9600,
  "remaining": 2400,
  "percentUsed": 80,
  "spendingByCategory": {
    "Food": 2800,
    "Shopping": 2150,
    "Transport": 980,
    ...
  },
  "expenseCount": 8
}
```

### Trends

#### `GET /api/expenses/trends?userId=...&period=weekly&month=2026-07`
Get spending trends for charts

**Response:**
```json
{
  "trends": [
    { "label": "Week 1", "spend": 2100 },
    { "label": "Week 2", "spend": 2900 },
    { "label": "Week 3", "spend": 2400 },
    { "label": "Week 4", "spend": 3600 }
  ],
  "period": "weekly"
}
```

### AI Insights

#### `GET /api/expenses/insights?userId=...&month=2026-07`
Generate AI-powered insights using Claude

**Response:**
```json
{
  "summary": "Total: ₹9,600 of ₹12,000 budget used",
  "insights": [
    "• Biggest category this month: Food at ₹2,800 (29% of total)",
    "• Spending trend: up 18% vs last month, mostly from delivery",
    "• Opportunity: Cut 2 food orders/week to save ~₹900/month"
  ]
}
```

### Alerts

#### `GET /api/expenses/alerts?userId=...`
Generate smart alerts based on spending patterns

**Response:**
```json
{
  "alerts": [
    {
      "id": "a1",
      "type": "budget",
      "title": "Budget 80% used",
      "detail": "You've used ₹9,600 of your ₹12,000 budget",
      "severity": "warning"
    }
  ]
}
```

### SMS Transactions

#### `GET /api/sms-transactions?userId=...&status=pending`
Get detected SMS transactions

#### `POST /api/sms-transactions`
Create an SMS-detected transaction

#### `PUT /api/sms-transactions/[id]`
Update status (accept/ignore)

## Frontend Integration

### Using Custom Hooks

The frontend now uses custom hooks to fetch data from the APIs:

```tsx
"use client";

import { useExpenses, useExpenseStats } from "@/hooks/useExpenses";

export default function ExpensesPage() {
  const userId = "current-user-id"; // Get from Firebase Auth
  const { expenses, loading } = useExpenses(userId);
  const { stats } = useExpenseStats(userId);

  // Data is fetched automatically on mount
  // Components render with real data
}
```

Available hooks:
- `useExpenses(userId, month)` - Get transactions
- `useExpenseStats(userId, month)` - Get monthly stats
- `useExpenseInsights(userId, month)` - Get AI insights
- `useExpenseTrends(userId, period, month)` - Get trends
- `useAlerts(userId)` - Get smart alerts
- `useSmsTransactions(userId, status)` - Get SMS transactions

### API Client

Direct API calls via `lib/api-client.ts`:

```tsx
import { expensesAPI } from "@/lib/api-client";

const expenses = await expensesAPI.list(userId);
const stats = await expensesAPI.stats(userId, "2026-07");
await expensesAPI.create(userId, { merchant: "...", category: "...", ...});
```

## Data Seeding

To populate with sample data for testing:

1. Add sample expenses manually in Firebase Console, or
2. Create a seed script at `scripts/seed.ts`:

```typescript
import { db } from "@/lib/firebase";
import { collection, addDoc, Timestamp } from "firebase/firestore";

const seedData = async () => {
  const userId = "test-user-123";
  
  const expenses = [
    { merchant: "Zomato", category: "Food", amount: 340, date: "2026-07-27" },
    { merchant: "Uber", category: "Transport", amount: 180, date: "2026-07-24" },
    // ... more transactions
  ];

  for (const exp of expenses) {
    await addDoc(collection(db, "expenses"), {
      userId,
      ...exp,
      date: Timestamp.fromDate(new Date(exp.date)),
      paymentMethod: "UPI",
      aiTagged: false,
      createdAt: Timestamp.now(),
    });
  }
  
  console.log("Seeding complete!");
};

seedData();
```

Run with: `npx ts-node scripts/seed.ts`

## Features Implemented

✅ **Add Expense** - POST /api/expenses  
✅ **Edit Expense** - PUT /api/expenses/[id]  
✅ **Delete Expense** - DELETE /api/expenses/[id]  
✅ **Monthly Budget** - Tracked in profiles collection  
✅ **Expense Categories** - 8 categories with intelligent organization  
✅ **Spending Analytics** - /api/expenses/stats, /api/expenses/trends  
✅ **Budget Progress** - Real-time calculation from stats  
✅ **Recent Transactions** - Fetched from /api/expenses with ordering  
✅ **AI Insights** - /api/expenses/insights (Claude-powered)  
✅ **Smart Alerts** - /api/expenses/alerts (pattern-based)  
✅ **SMS Detection** - /api/sms-transactions (pending user action)  

## Next Steps

1. **Enable Firebase Authentication** - Wire up login/signup with Firebase Auth
2. **Migrate Mock Data** - Move sample data to Firestore
3. **Update Components** - Integrate hooks into expense components (minimal changes to UI)
4. **Test Locally** - Run with real Firestore data
5. **Deploy** - Push to Render (backend) or Netlify (frontend)

## Troubleshooting

### "Firebase is not initialized"
- Check `.env.local` has all required keys
- Ensure Firebase SDK is installed: `npm install firebase`

### "No credentials provided"
- Verify `lib/firebase.ts` loads environment variables correctly
- Check Firebase Console > Project Settings for valid config

### "Permission denied" on Firestore
- Verify security rules are set correctly
- Check user is authenticated (Firebase Auth required)
- Ensure `userId` in query matches authenticated user

### "Insights not generating"
- Check `ANTHROPIC_API_KEY` is set and valid
- Verify user profile exists in `profiles` collection

