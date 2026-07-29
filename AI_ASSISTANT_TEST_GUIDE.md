# AI Financial Assistant - Testing Guide

## Quick Tests with cURL

### 1. Test Budget Analysis

```bash
curl "http://localhost:3000/api/ai-financial-assistant?userId=test-user-123&analysisType=budget"
```

**Expected Response:**
- Status: 200
- Contains: `current` (spent, remaining, percentUsed)
- Contains: `prediction` (projectedMonthlySpend, projectedDeficit, safeRemainingDaily)
- Contains: `analysis` (string with Claude insights)

**Example Output:**
```json
{
  "type": "budget",
  "current": {
    "spent": 9600,
    "remaining": 2400,
    "percentUsed": 80
  },
  "prediction": {
    "projectedMonthlySpend": 13800,
    "projectedDeficit": 1800,
    "safeRemainingDaily": 400
  },
  "analysis": "Based on your current spending... [Claude response]",
  "generatedAt": "2026-07-29T14:30:00Z"
}
```

### 2. Test Savings Analysis

```bash
curl "http://localhost:3000/api/ai-financial-assistant?userId=test-user-123&analysisType=savings"
```

**Expected Response:**
- Status: 200
- Contains: `topSpendingCategories` (array)
- Contains: `suggestions` (array with area, action, monthlySavings, effort)

**Check:**
- Are suggestions specific? (e.g., "reduce food delivery by 2 orders/week")
- Are savings amounts realistic?
- Is effort level accurate (Easy/Medium/Hard)?

### 3. Test Health Score

```bash
curl "http://localhost:3000/api/ai-financial-assistant?userId=test-user-123&analysisType=health"
```

**Expected Response:**
- Status: 200
- `overallScore`: 0-100
- `components`: budgetControl, savingsRate, consistency, organization, discipline

**Verify:**
- Score is reasonable (0-100)
- Components add up logically
- Highest/lowest components make sense

### 4. Test Anomaly Detection

```bash
curl "http://localhost:3000/api/ai-financial-assistant?userId=test-user-123&analysisType=anomalies"
```

**Expected Response:**
- Status: 200
- Contains: `detectedAnomalies` (array)
- Each anomaly has: merchant, amount, severity, date, reason

**Check:**
- Large amounts flagged as anomalies
- Severity levels appropriate (low/medium/high)
- Reasons are explanatory

### 5. Test Full Analysis (All Types)

```bash
curl "http://localhost:3000/api/ai-financial-assistant?userId=test-user-123"
```

**Expected Response:**
- Status: 200
- Contains budget, savings, health, and anomalies insights

**Note:** This makes 4 Claude API calls, so takes longer (8-15 seconds)

---

## Test Cases

### Test 1: Valid User with Expenses
**Setup:** Create test user with 10+ expenses from current month

**Test:**
```bash
curl "http://localhost:3000/api/ai-financial-assistant?userId=test-user-123&analysisType=budget"
```

**Expect:**
- ✅ 200 status
- ✅ spent > 0
- ✅ analysis text is meaningful

### Test 2: Valid User No Expenses
**Setup:** Create test user with no expenses

**Test:**
```bash
curl "http://localhost:3000/api/ai-financial-assistant?userId=test-user-no-expenses&analysisType=budget"
```

**Expect:**
- ✅ 200 status
- ✅ spent = 0
- ✅ remaining = budget
- ✅ analysis handles empty data gracefully

### Test 3: Invalid User
**Test:**
```bash
curl "http://localhost:3000/api/ai-financial-assistant?userId=nonexistent-user&analysisType=budget"
```

**Expect:**
- ✅ 404 status
- ✅ Error message: "User profile not found"

### Test 4: Missing userId
**Test:**
```bash
curl "http://localhost:3000/api/ai-financial-assistant?analysisType=budget"
```

**Expect:**
- ✅ 400 status
- ✅ Error message: "userId is required"

### Test 5: Invalid analysisType
**Test:**
```bash
curl "http://localhost:3000/api/ai-financial-assistant?userId=test-user-123&analysisType=invalid"
```

**Expect:**
- ✅ 400 status
- ✅ Error message about unknown analysis type

### Test 6: Specific Month
**Test:**
```bash
curl "http://localhost:3000/api/ai-financial-assistant?userId=test-user-123&month=2026-06&analysisType=budget"
```

**Expect:**
- ✅ 200 status
- ✅ Analysis for June (2026-06) not current month
- ✅ Correct date range used

---

## Integration Test Checklist

### Setup
- [ ] Firebase Firestore configured
- [ ] Test user profile created with monthlyBudget
- [ ] Sample expenses added to Firestore
- [ ] `.env.local` has ANTHROPIC_API_KEY
- [ ] Claude API key is valid and has quota

### API Tests
- [ ] Budget analysis returns valid data
- [ ] Savings analysis includes suggestions
- [ ] Health score is 0-100
- [ ] Anomalies detected for large transactions
- [ ] Full analysis works (all 4 types)
- [ ] Error handling for missing user
- [ ] Error handling for missing userId
- [ ] Month parameter works

### Response Validation
- [ ] All responses are valid JSON
- [ ] Response includes generatedAt timestamp
- [ ] Analysis text is not empty
- [ ] Numbers are reasonable

### Hook Tests
```tsx
// Test useBudgetAnalysis
const { insight, loading, error } = useBudgetAnalysis(userId);
// Check: insight.current, insight.prediction populated

// Test useFullFinancialAnalysis
const { analysis, loading } = useFullFinancialAnalysis(userId);
// Check: analysis.budget, analysis.savings, analysis.health all populated

// Test error handling
// Pass invalid userId, expect error state
```

---

## Performance Tests

### Single Analysis
```bash
time curl "http://localhost:3000/api/ai-financial-assistant?userId=test-user-123&analysisType=budget"
```

**Expected:** 2-5 seconds

### Full Analysis
```bash
time curl "http://localhost:3000/api/ai-financial-assistant?userId=test-user-123&analysisType=full"
```

**Expected:** 8-15 seconds (4 Claude API calls)

### Multiple Users
```bash
for i in {1..5}; do
  curl "http://localhost:3000/api/ai-financial-assistant?userId=user-$i&analysisType=budget" &
done
```

**Expected:** All complete within 15 seconds

---

## Data Quality Tests

### Budget Calculation
- [ ] Current spent = sum of all expenses
- [ ] Remaining = budget - spent
- [ ] percentUsed = (spent / budget) * 100
- [ ] Safe daily limit = remaining / days remaining

### Category Breakdown
- [ ] Top category is highest amount
- [ ] All categories from expenses included
- [ ] Sum of categories = total spent

### Anomaly Detection
- [ ] Transactions > 2.5x average flagged
- [ ] Severity: high for >5x average
- [ ] Severity: medium for 2.5-5x average

### Health Score
- [ ] Score between 0-100
- [ ] Components sum to reasonable total
- [ ] Budget control decreases as percentUsed increases

---

## Claude Integration Tests

### Check Prompt Quality
- [ ] Prompt includes all necessary data
- [ ] Student profile context included
- [ ] Numbers are clear and readable

### Response Parsing
- [ ] Claude response is parsed correctly
- [ ] Numbers are extracted accurately
- [ ] Advice is specific and actionable

### Error Scenarios
- [ ] Claude API timeout handled
- [ ] Invalid response handled
- [ ] Rate limit handled

---

## Real Data Tests

Create realistic expense data and verify:

```json
{
  "userId": "test-student",
  "monthlyBudget": 12000,
  "expenses": [
    { "merchant": "Zomato", "category": "Food", "amount": 340 },
    { "merchant": "Amazon", "category": "Shopping", "amount": 1250 },
    { "merchant": "Uber", "category": "Transport", "amount": 180 },
    { "merchant": "Netflix", "category": "Entertainment", "amount": 199 },
    { "merchant": "Udemy", "category": "Education", "amount": 499 }
  ]
}
```

**Test Expectations:**
- Food is identified as top category (if multiple food expenses)
- Total = ₹2468
- Health score should be reasonable
- Savings suggestions should mention all categories

---

## Edge Cases

### Test 1: Very High Spending (100%+ of budget)
**Expenses:** ₹15,000 on ₹12,000 budget

**Expected:**
- percentUsed = 125
- remaining = negative (but shown as 0)
- projectedDeficit = significant
- Analysis mentions exceeding budget

### Test 2: Very Low Spending (<20%)
**Expenses:** ₹2,000 on ₹12,000 budget

**Expected:**
- Health score high
- Savings rate excellent
- Analysis mentions discipline

### Test 3: Single Large Expense
**Expenses:** One transaction for ₹10,000

**Expected:**
- Flagged as anomaly (>2.5x average)
- Severity: high
- Explanation provided

### Test 4: No Category Spending
**Expenses:** All in one category

**Expected:**
- topSpendingCategories shows concentration
- Savings suggestions mention diversification

---

## Frontend Integration Tests

### Test AIInsights Component
```tsx
// Before
const insights = [hardcoded values];

// After
const { insight } = useFinancialAnalysis(userId);
// Render: insight.analysis
```

**Verify:** Text renders correctly, Claude response is readable

### Test OverviewCards
```tsx
// Before
const cards = [{ amount: 12000 }, { amount: 9600 }, ...];

// After
const { insight } = useBudgetAnalysis(userId);
const cards = [
  { amount: insight.current.spent },
  ...
];
```

**Verify:** Numbers update from API

### Test BudgetProgress
```tsx
// Use safe daily limit from budget analysis
const dailyLimit = insight.prediction.safeRemainingDaily;
```

**Verify:** Correct limit shown

### Test HealthScore
```tsx
const { insight } = useFinancialHealthScore(userId);
// Render: insight.overallScore and insight.components
```

**Verify:** Score and breakdown display correctly

---

## Browser Testing

### Test Full Flow
1. Open Dashboard
2. Wait for all analyses to load
3. Verify no loading spinners stuck
4. Verify no errors in console
5. Click on components to verify links work

### Test Error States
1. Break Firebase connection
2. Verify error message shown
3. Verify graceful degradation

### Test Performance
1. Open Network tab
2. Verify API calls complete in expected time
3. Check response sizes are reasonable

---

## Test Data Generator

Create sample data script:

```typescript
// Create 20 expenses across 8 categories
const categories = ["Food", "Shopping", "Transport", "Entertainment", "Education", "Health", "Hostel/PG", "Others"];

for (let i = 0; i < 20; i++) {
  const expense = {
    merchant: generateMerchant(),
    category: categories[i % 8],
    amount: Math.round(Math.random() * 2000) + 100,
    date: generateDateInMonth(),
  };
  // Add to Firestore
}
```

---

## Success Criteria

✅ **All API endpoints respond 200**  
✅ **No undefined or null values**  
✅ **Claude integration working**  
✅ **Response times acceptable**  
✅ **Error handling proper**  
✅ **React hooks functional**  
✅ **Data accuracy verified**  
✅ **No UI regressions**  

---

## Common Issues & Solutions

### Issue: "User profile not found" (404)
**Solution:** Ensure test user profile exists in Firestore `profiles` collection

### Issue: "Failed to perform financial analysis" (500)
**Solution:** 
- Check ANTHROPIC_API_KEY is set
- Check Claude API has quota
- Check Firestore connection
- Check logs for specific error

### Issue: Analysis takes >15 seconds
**Solution:**
- Check network latency
- Check Claude API response time
- Try single analysis (not full)

### Issue: Incorrect health score
**Solution:**
- Verify spending data exists
- Check component calculations
- Add debug logs to see component scores

---

## Test Report Template

```
Date: 2026-07-29
Tester: [Your name]

API Tests:
- [ ] Budget analysis: PASS/FAIL
- [ ] Savings analysis: PASS/FAIL
- [ ] Health score: PASS/FAIL
- [ ] Anomalies: PASS/FAIL

Integration Tests:
- [ ] React hooks: PASS/FAIL
- [ ] Frontend components: PASS/FAIL
- [ ] Error handling: PASS/FAIL

Performance:
- Single analysis: __ seconds
- Full analysis: __ seconds

Issues Found:
1. [Issue]
2. [Issue]

Recommendations:
1. [Recommendation]
```

---

**Status: Ready for Testing**

All test cases defined and ready to execute.

