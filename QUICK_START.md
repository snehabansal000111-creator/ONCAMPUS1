# Expense Tracker - Quick Start Guide

## TL;DR - Get it running in 5 minutes

### 1. Firebase Setup (2 min)
```bash
# Go to https://console.firebase.google.com
# Create project > Enable Firestore > Set security rules
# Copy config to .env.local
```

### 2. Environment Variables (1 min)
```bash
cp .env.local.example .env.local
# Fill in Firebase credentials from Firebase Console
```

### 3. Install & Run (2 min)
```bash
npm install
npm run dev
# Visit http://localhost:3000/dashboard/expenses
```

---

## What You Get

✅ All backend APIs for expense management  
✅ Real-time Firestore integration  
✅ AI-powered insights via Claude API  
✅ Smart alerts based on spending patterns  
✅ SMS transaction detection framework  
✅ Full CRUD operations (Create, Read, Update, Delete)  

## What You Need to Do

### Phase 1: Backend Setup (15 min)
1. Create Firebase project and Firestore database
2. Set up collections with proper security rules
3. Add environment variables
4. Test API endpoints

### Phase 2: Frontend Integration (30 min)
1. Update components to use hooks (see `COMPONENT_INTEGRATION_GUIDE.md`)
2. Import `useExpenses`, `useExpenseStats`, etc.
3. Replace mock data with real API calls
4. Test with real data

### Phase 3: Authentication (20 min)
1. Enable Firebase Auth in Console
2. Wire up login/signup with Firebase Auth
3. Get userId from authenticated user
4. Update security rules if needed

---

## API Examples

### Create an Expense
```bash
curl -X POST http://localhost:3000/api/expenses \
  -H "Content-Type: application/json" \
  -d '{
    "userId": "user123",
    "merchant": "Zomato",
    "category": "Food",
    "amount": 340,
    "date": "2026-07-27",
    "paymentMethod": "UPI"
  }'
```

### Get Expenses
```bash
curl "http://localhost:3000/api/expenses?userId=user123&month=2026-07"
```

### Get Stats
```bash
curl "http://localhost:3000/api/expenses/stats?userId=user123"
```

### Get AI Insights
```bash
curl "http://localhost:3000/api/expenses/insights?userId=user123"
```

### Get Smart Alerts
```bash
curl "http://localhost:3000/api/expenses/alerts?userId=user123"
```

---

## Component Updates Required

| Component | Import | Hook | Notes |
|-----------|--------|------|-------|
| TransactionList | ✨ NEW | useExpenses | Replace mock import |
| OverviewCards | ✨ NEW | useExpenseStats | Calculate from stats |
| CategoryDonut | ✨ NEW | useExpenseStats | Transform stats data |
| SpendingTrend | ✨ NEW | useExpenseTrends | Use trends data |
| BudgetProgress | ✨ NEW | useExpenseStats | Use budget/spent |
| SmsDetection | ✨ NEW | useSmsTransactions | Persist to API |
| AIInsights | ✨ NEW | useExpenseInsights | Show AI data |
| SmartAlerts | ✨ NEW | useAlerts | Show real alerts |

**Update example:**
```tsx
// Before
import { transactions } from "@/lib/mock-data";

// After
import { useExpenses } from "@/hooks/useExpenses";
import { useAuth } from "@/hooks/useAuth";

export default function TransactionList() {
  const { user } = useAuth();
  const { expenses, loading } = useExpenses(user?.uid);
  // Use expenses instead of transactions
}
```

---

## File Locations

**New Backend Files:**
- `app/api/expenses/route.ts` - Expense CRUD
- `app/api/expenses/[id]/route.ts` - Single expense ops
- `app/api/expenses/stats/route.ts` - Statistics
- `app/api/expenses/trends/route.ts` - Spending trends
- `app/api/expenses/insights/route.ts` - AI insights
- `app/api/expenses/alerts/route.ts` - Smart alerts
- `app/api/sms-transactions/route.ts` - SMS handling
- `app/api/sms-transactions/[id]/route.ts` - SMS status

**New Library Files:**
- `lib/firebase.ts` - Firebase initialization
- `lib/api-client.ts` - API wrapper functions
- `hooks/useExpenses.ts` - React hooks

**New Documentation:**
- `EXPENSE_TRACKER_SETUP.md` - Detailed setup guide
- `COMPONENT_INTEGRATION_GUIDE.md` - Component updates
- `BACKEND_IMPLEMENTATION_SUMMARY.md` - Architecture overview

---

## Testing Checklist

- [ ] Firebase project created
- [ ] Firestore database enabled
- [ ] Collections created with schema
- [ ] `.env.local` configured
- [ ] `npm install` successful
- [ ] `npm run dev` starts without errors
- [ ] `GET /api/expenses` returns 200
- [ ] `POST /api/expenses` creates document
- [ ] `PUT /api/expenses/[id]` updates document
- [ ] `DELETE /api/expenses/[id]` removes document
- [ ] `GET /api/expenses/stats` returns stats
- [ ] `GET /api/expenses/trends` returns trends
- [ ] `GET /api/expenses/insights` generates insights
- [ ] `GET /api/expenses/alerts` returns alerts
- [ ] SMS API endpoints functional
- [ ] Components render with real data

---

## Troubleshooting

**Issue: "Cannot find firebase module"**
```bash
npm install firebase
```

**Issue: "Firestore permission denied"**
- Go to Firebase Console > Firestore
- Click "Security Rules"
- Use rules from `EXPENSE_TRACKER_SETUP.md`

**Issue: "Environment variables not loaded"**
- Restart dev server: `npm run dev`
- Check `.env.local` has no syntax errors
- Verify variable names start with `NEXT_PUBLIC_` for client

**Issue: "Insights not generating"**
- Check `ANTHROPIC_API_KEY` is set
- Verify user profile exists in Firestore
- Check Claude API has available quota

---

## Architecture Diagram

```
┌─────────────────────┐
│   React Components  │
│   (Expense Tracker) │
└──────────┬──────────┘
           │ useExpenses()
           │ useExpenseStats()
           │ etc.
           ↓
┌──────────────────────┐
│   Custom Hooks       │
│ (hooks/useExpenses)  │
└──────────┬───────────┘
           │ expensesAPI.list()
           │ expensesAPI.stats()
           │ etc.
           ↓
┌──────────────────────┐
│   API Routes         │
│   (/api/expenses/*)  │
└──────────┬───────────┘
           │ Firestore queries
           │ Claude API calls
           ↓
┌──────────────────────┐
│  Firebase/Claude     │
│  (Firestore + API)   │
└──────────────────────┘
```

---

## Key Features

| Feature | Status | Endpoint |
|---------|--------|----------|
| Add Expense | ✅ Ready | POST /api/expenses |
| Edit Expense | ✅ Ready | PUT /api/expenses/[id] |
| Delete Expense | ✅ Ready | DELETE /api/expenses/[id] |
| View Transactions | ✅ Ready | GET /api/expenses |
| Monthly Stats | ✅ Ready | GET /api/expenses/stats |
| Category Analytics | ✅ Ready | GET /api/expenses/stats |
| Spending Trends | ✅ Ready | GET /api/expenses/trends |
| AI Insights | ✅ Ready | GET /api/expenses/insights |
| Smart Alerts | ✅ Ready | GET /api/expenses/alerts |
| SMS Detection | ✅ Ready | GET /api/sms-transactions |
| SMS Accept/Ignore | ✅ Ready | PUT /api/sms-transactions/[id] |

---

## Next Phase: Component Integration

Once backend is tested, follow `COMPONENT_INTEGRATION_GUIDE.md` to:
1. Update component imports
2. Add custom hooks
3. Replace mock data with API calls
4. Test with real Firestore data

**Estimated time:** 30-45 minutes for all 8 components

---

## Deploy to Production

### Render (Backend + Frontend)
```bash
git push origin main
# Render auto-deploys on push
# Set env vars in Render dashboard
```

### Separate Deployment
- **Backend:** Deploy to Render/Vercel/Railway
- **Frontend:** Deploy to Netlify/Vercel

---

## Support Resources

- 📚 `EXPENSE_TRACKER_SETUP.md` - Complete Firebase setup
- 📚 `COMPONENT_INTEGRATION_GUIDE.md` - Code integration steps
- 📚 `BACKEND_IMPLEMENTATION_SUMMARY.md` - Architecture & features
- 🔗 [Firebase Docs](https://firebase.google.com/docs)
- 🔗 [Next.js API Routes](https://nextjs.org/docs/api-routes/introduction)
- 🔗 [Claude API Docs](https://docs.anthropic.com)

---

**Ready? Start with Step 1: Firebase Setup** → `EXPENSE_TRACKER_SETUP.md`
