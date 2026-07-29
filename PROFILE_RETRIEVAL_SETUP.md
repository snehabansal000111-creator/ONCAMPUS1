# Student Profile Retrieval

## Overview

Student profiles are stored in Supabase and retrieved using the `getStudentProfile()` function. Profiles contain all onboarding data and are used throughout the application.

## Setup

### 1. Create Supabase Project

- Go to https://supabase.com
- Create a new project
- Get your `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- Add to `.env.local`:

```bash
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGc...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGc...
```

### 2. Create Database Schema

Run the SQL from `SUPABASE_SCHEMA.sql` in your Supabase SQL Editor:

1. Go to Supabase Dashboard → SQL Editor
2. Create a new query
3. Copy all SQL from `SUPABASE_SCHEMA.sql`
4. Execute

This creates:
- `profiles` table with all required fields
- Row-level security (RLS) policies
- Indexes for performance
- Automatic `updated_at` timestamp

### 3. Enable Authentication

In Supabase Dashboard:

1. Go to Authentication → Providers
2. Enable "Email" provider (or other providers as needed)
3. Configure email templates

## API Reference

### `getStudentProfile(userId: string): Promise<StudentProfile>`

Retrieves the student's profile from Supabase.

**Parameters:**
- `userId` (string, required) - The authenticated user's ID

**Returns:**
```typescript
{
  id: string;
  name: string;
  branch: string;
  year: string;
  skills: string[];
  interests: string[];
  careerGoal: string;
  learningStyle: "visual" | "reading" | "hands-on" | "mixed";
  monthlyBudget: number;
  dailyStudyHours: number;
}
```

**Throws:**
- `"Student profile not found"` - Profile doesn't exist for user
- `"Failed to fetch student profile: {error}"` - Database error

**Example:**

```typescript
import { getStudentProfile } from "@/lib/supabase/profile";

// In a Server Component or Route Handler
async function loadProfile(userId: string) {
  try {
    const profile = await getStudentProfile(userId);
    console.log(`Welcome ${profile.name}`);
  } catch (error) {
    console.error(error.message);
  }
}
```

### `upsertStudentProfile(userId: string, profile): Promise<StudentProfile>`

Creates or updates a student's profile. Use this after onboarding.

**Parameters:**
- `userId` (string, required) - The authenticated user's ID
- `profile` - Object with:
  - `name` (string, required)
  - `branch` (string, required)
  - `year` (string, required)
  - `skills` (string[], required)
  - `interests` (string[], required)
  - `careerGoal` (string, required)
  - `learningStyle` (enum, required)
  - `monthlyBudget` (number, required)
  - `dailyStudyHours` (number, required)
  - `background` (string, optional)

**Returns:**
Same as `getStudentProfile()`

**Example:**

```typescript
import { upsertStudentProfile } from "@/lib/supabase/profile";

async function saveOnboarding(userId: string) {
  const profile = await upsertStudentProfile(userId, {
    name: "Riya Sharma",
    branch: "Computer Science",
    year: "1st Year",
    skills: ["Python (basic)", "HTML/CSS"],
    interests: ["Web Development", "AI/ML", "UI Design"],
    careerGoal: "Frontend Engineer",
    learningStyle: "hands-on",
    monthlyBudget: 12000,
    dailyStudyHours: 3,
  });
  
  return profile;
}
```

## Data Structure

### profiles Table

| Column | Type | Description |
|--------|------|-------------|
| id | UUID | Primary key |
| user_id | UUID | Foreign key to auth.users |
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
| updated_at | TIMESTAMP | Last update time |

## Security

✅ **Row-Level Security (RLS)** - Users can only access their own profile

✅ **Validation** - All fields are validated at database level

✅ **Constraints** - Type checking and value ranges enforced

✅ **Automatic Timestamps** - `updated_at` is managed automatically

## Usage Examples

### In a Server Component

```typescript
import { getStudentProfile } from "@/lib/supabase/profile";

export default async function Dashboard() {
  const userId = "user-id-from-auth"; // Get from auth context
  const profile = await getStudentProfile(userId);

  return <h1>Welcome, {profile.name}!</h1>;
}
```

### In an API Route

```typescript
import { getStudentProfile } from "@/lib/supabase/profile";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  try {
    const userId = request.headers.get("x-user-id"); // From auth middleware
    const profile = await getStudentProfile(userId!);
    return NextResponse.json(profile);
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Unknown error" },
      { status: 400 }
    );
  }
}
```

### In the Assistant (Claude Integration)

```typescript
import { getStudentProfile } from "@/lib/supabase/profile";
import { askAssistant } from "@/lib/claude";

async function askAboutLearning(userId: string, question: string) {
  const profile = await getStudentProfile(userId);
  const response = await askAssistant(profile, question);
  return response;
}
```

## Error Handling

```typescript
import { getStudentProfile } from "@/lib/supabase/profile";

try {
  const profile = await getStudentProfile(userId);
} catch (error) {
  if (error instanceof Error) {
    if (error.message.includes("not found")) {
      // First time user - redirect to onboarding
      redirect("/onboarding");
    } else {
      // Database error
      console.error("Profile fetch failed:", error.message);
    }
  }
}
```

## Testing

You can test the profile retrieval with Supabase's built-in SQL Editor:

```sql
-- Insert test profile
INSERT INTO public.profiles (
  user_id,
  name,
  branch,
  year,
  skills,
  interests,
  career_goal,
  learning_style,
  monthly_budget,
  daily_study_hours
) VALUES (
  'your-test-user-id',
  'Test Student',
  'Computer Science',
  '1st Year',
  ARRAY['Python', 'JavaScript'],
  ARRAY['Web Dev', 'AI/ML'],
  'Software Engineer',
  'hands-on',
  12000,
  3
);

-- Retrieve profile
SELECT * FROM public.profiles 
WHERE user_id = 'your-test-user-id';
```

## Integration Points

- **Onboarding** → Save profile via `upsertStudentProfile()`
- **Dashboard** → Load profile via `getStudentProfile()`
- **Claude API** → Pass profile to `askAssistant()`
- **Roadmap** → Filter based on profile skills/interests
- **Expenses** → Use profile budget for recommendations

## Profile Retrieval Works ✓

The `getStudentProfile()` function is ready to use with Supabase.
