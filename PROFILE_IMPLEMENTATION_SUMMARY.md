# Student Profile Retrieval - Implementation Summary

## ✅ Completed

### 1. **Reusable Functions Created**

**`lib/supabase/profile.ts`** — Two exported functions:

#### `getStudentProfile(userId: string): Promise<StudentProfile>`
- Retrieves student profile from Supabase
- Validates userId parameter
- Handles missing profiles with helpful error message
- Maps database fields to StudentProfile type
- Throws specific errors for debugging

#### `upsertStudentProfile(userId, profile): Promise<StudentProfile>`
- Creates or updates student profile
- Used after onboarding completion
- Validates all required fields
- Returns saved profile

### 2. **Database Schema**

**`SUPABASE_SCHEMA.sql`** — Complete schema with:

| Field | Type | Purpose |
|-------|------|---------|
| id | UUID | Profile ID |
| user_id | UUID | Unique user identifier (FK to auth.users) |
| name | VARCHAR(255) | Student name |
| branch | VARCHAR(100) | Academic program (CS, Electronics, etc.) |
| year | VARCHAR(50) | Year of study (1st Year, 2nd Year, etc.) |
| background | TEXT | Additional background info |
| skills | TEXT[] | Array of skills |
| interests | TEXT[] | Array of interests |
| career_goal | VARCHAR(255) | Career goal/aspiration |
| learning_style | VARCHAR(50) | One of: visual, reading, hands-on, mixed |
| daily_study_hours | DECIMAL(3,1) | Hours per day (0.5 to 24) |
| monthly_budget | DECIMAL(10,2) | Monthly budget in rupees |
| created_at | TIMESTAMP | Record creation time |
| updated_at | TIMESTAMP | Auto-updated on changes |

**Features:**
- ✅ Row-Level Security (RLS) - users can only access own profile
- ✅ Indexes for performance on user_id
- ✅ Constraints for data validation
- ✅ Auto-updating timestamps
- ✅ Cascade delete when user is deleted

### 3. **Type Updates**

**`types/index.ts`** — Updated StudentProfile interface:
```typescript
export interface StudentProfile {
  id: string;
  name: string;
  avatarUrl?: string;
  branch: string;
  year: string;
  background?: string;  // ← NEW
  interests: string[];
  skills: string[];
  careerGoal: string;
  learningStyle: LearningStyle;
  monthlyBudget: number;
  dailyStudyHours: number;
}
```

### 4. **Data Structure**

All 10 required fields are included:
- ✅ Name
- ✅ Academic Program (year)
- ✅ Branch
- ✅ Background (optional)
- ✅ Skills
- ✅ Interests
- ✅ Career Goal
- ✅ Learning Style
- ✅ Daily Study Hours
- ✅ Monthly Budget

### 5. **Documentation**

**`PROFILE_RETRIEVAL_SETUP.md`** includes:
- Step-by-step Supabase setup instructions
- Complete API reference
- Code examples for different use cases
- Error handling patterns
- Testing instructions
- Integration points with other features

## Setup Instructions

### Quick Start

1. **Create Supabase project** at https://supabase.com

2. **Add environment variables** to `.env.local`:
```bash
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGc...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGc...
```

3. **Run schema SQL** in Supabase SQL Editor:
   - Copy all SQL from `SUPABASE_SCHEMA.sql`
   - Execute in your Supabase project

4. **Enable authentication** in Supabase:
   - Go to Authentication → Providers
   - Enable "Email" provider

### Usage

**In Server Components:**
```typescript
import { getStudentProfile } from "@/lib/supabase/profile";

async function loadProfile(userId: string) {
  const profile = await getStudentProfile(userId);
  return <h1>Welcome, {profile.name}!</h1>;
}
```

**In Route Handlers:**
```typescript
import { getStudentProfile } from "@/lib/supabase/profile";

export async function GET(request: Request) {
  const userId = request.headers.get("x-user-id");
  const profile = await getStudentProfile(userId!);
  return NextResponse.json(profile);
}
```

**After Onboarding:**
```typescript
import { upsertStudentProfile } from "@/lib/supabase/profile";

await upsertStudentProfile(userId, {
  name: "Riya Sharma",
  branch: "Computer Science",
  year: "1st Year",
  skills: ["Python", "JavaScript"],
  interests: ["Web Dev", "AI/ML"],
  careerGoal: "Frontend Engineer",
  learningStyle: "hands-on",
  monthlyBudget: 12000,
  dailyStudyHours: 3,
});
```

## Files Created/Modified

| File | Type | Purpose |
|------|------|---------|
| `lib/supabase/profile.ts` | NEW | Profile retrieval and save functions |
| `SUPABASE_SCHEMA.sql` | NEW | Database schema with RLS |
| `PROFILE_RETRIEVAL_SETUP.md` | NEW | Setup & usage documentation |
| `types/index.ts` | MODIFIED | Added `background` field to StudentProfile |

## Error Handling

| Scenario | Error Message | Action |
|----------|---------------|--------|
| Missing userId | "Valid userId is required" | Validate input |
| Profile not found | "Student profile not found. Please complete onboarding first." | Redirect to onboarding |
| Database error | "Failed to fetch student profile: {error}" | Log and show generic error |
| Save failure | "Failed to save student profile: {error}" | Retry or log error |

## Security

✅ **Server-side only** — Functions only run on server (in `lib/supabase/`)

✅ **Row-Level Security** — Users can only access their own profile

✅ **Input validation** — userId and profile data validated

✅ **Data constraints** — Database enforces type and range validation

✅ **Automatic timestamps** — updated_at managed by database

## Ready to Use ✓

The profile retrieval system is fully implemented and ready for:

1. ✅ Reading student profiles from Supabase
2. ✅ Saving onboarding data to Supabase
3. ✅ Type-safe profile access throughout the app
4. ✅ Integration with Claude API (pass profile to askAssistant)
5. ✅ Integration with other backend features

## Next Steps (Not Implemented)

- Wire onboarding page to save profiles via `upsertStudentProfile()`
- Wire dashboard to load profiles via `getStudentProfile()`
- Implement user authentication routes
- Create middleware to attach userId to requests
