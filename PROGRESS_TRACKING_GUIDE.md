# Progress Tracking - Complete Guide

## Overview

The Progress Tracking system monitors and measures student learning across all activities:
- **Topics completed** with time spent
- **Quizzes completed** with scores
- **Projects** with status and timeline
- **Roadmap progress** by learning phase
- **Learning streak** (consecutive days of activity)
- **Weekly progress** analytics

## Key Features

✅ **Multi-Activity Tracking** — Topics, quizzes, projects, roadmap items  
✅ **Learning Streak** — Consecutive days of activity  
✅ **Weekly Analytics** — Progress breakdown by week  
✅ **Completion Percentages** — Overall and by roadmap phase  
✅ **Time Tracking** — Minutes spent per topic  
✅ **Persistent Storage** — All data saved in Supabase  
✅ **Row-Level Security** — Users see only their data  

## Architecture

```
Progress Tracking System
├── Database Layer (Supabase)
│   ├── topic_progress table
│   ├── quiz_progress table
│   ├── project_progress table
│   ├── roadmap_item_progress table
│   └── progress_summary table
├── Service Layer (lib/progress/progress-service.ts)
│   ├── recordTopicCompletion()
│   ├── recordQuizCompletion()
│   ├── recordProjectProgress()
│   ├── recordRoadmapItemCompletion()
│   ├── calculateLearningStreak()
│   ├── getWeeklyProgress()
│   └── getProgressSummary()
└── API Routes
    ├── POST /api/progress/topic
    ├── POST /api/progress/quiz
    ├── POST /api/progress/project
    ├── POST /api/progress/roadmap-item
    └── GET /api/progress/summary
```

## Database Schema

### topic_progress
Tracks completed topics with time spent.

```sql
id                UUID (primary key)
user_id           UUID (foreign key)
topic             VARCHAR(255)
time_spent_minutes INTEGER (default 0)
completed_at      TIMESTAMP (auto set to NOW)
```

**Indexes:** user_id, completed_at  
**RLS:** Users can read/insert own records  

### quiz_progress
Tracks quiz completions with scores.

```sql
id                UUID (primary key)
user_id           UUID (foreign key)
quiz_id           UUID (foreign key)
score             INTEGER (0-100)
completed_at      TIMESTAMP (auto set to NOW)
```

**Indexes:** user_id, completed_at  
**RLS:** Users can read/insert own records  

### project_progress
Tracks project status and completion timeline.

```sql
id                UUID (primary key)
user_id           UUID (foreign key)
project_title     VARCHAR(255)
status            VARCHAR(50) (started|in-progress|completed)
started_at        TIMESTAMP (auto set to NOW)
completed_at      TIMESTAMP (null until completed)
notes             TEXT
```

**Indexes:** user_id, status  
**RLS:** Users can read/insert/update own records  

### roadmap_item_progress
Tracks progress on individual roadmap items.

```sql
id                UUID (primary key)
user_id           UUID (foreign key)
roadmap_id        UUID (foreign key)
item_title        VARCHAR(255)
phase             VARCHAR(50) (beginner|intermediate|advanced)
completed         BOOLEAN (default false)
completed_at      TIMESTAMP (null until completed)
created_at        TIMESTAMP
```

**Indexes:** user_id, roadmap_id  
**RLS:** Users can read/insert/update own records  

### progress_summary
Aggregated progress metrics (one per user).

```sql
id                                UUID (primary key)
user_id                           UUID (unique, foreign key)
total_topics_completed            INTEGER
total_quizzes_completed           INTEGER
total_projects_completed          INTEGER
overall_completion_percentage     DECIMAL(5,2)
roadmap_completion_percentage     DECIMAL(5,2)
learning_streak_days              INTEGER
last_activity_date                TIMESTAMP
created_at                        TIMESTAMP
updated_at                        TIMESTAMP (auto-updated)
```

**Indexes:** user_id  
**RLS:** Users can read own summary  

## API Reference

### Record Topic Completion

**Endpoint:** `POST /api/progress/topic`

**Request:**
```json
{
  "topic": "React Hooks",
  "timeSpentMinutes": 45
}
```

**Response (Success):**
```json
{
  "topicProgress": {
    "id": "uuid",
    "user_id": "uuid",
    "topic": "React Hooks",
    "completed_at": "2026-07-29T10:30:00Z",
    "time_spent_minutes": 45
  }
}
```

**Parameters:**
| Name | Type | Required | Notes |
|------|------|----------|-------|
| topic | string | Yes | Non-empty topic name |
| timeSpentMinutes | number | No | Default: 0, must be ≥ 0 |

---

### Record Quiz Completion

**Endpoint:** `POST /api/progress/quiz`

**Request:**
```json
{
  "quizId": "quiz-uuid-123",
  "score": 85
}
```

**Response (Success):**
```json
{
  "quizProgress": {
    "id": "uuid",
    "user_id": "uuid",
    "quiz_id": "quiz-uuid-123",
    "score": 85,
    "completed_at": "2026-07-29T10:30:00Z"
  }
}
```

**Parameters:**
| Name | Type | Required | Notes |
|------|------|----------|-------|
| quizId | string | Yes | UUID of the quiz |
| score | number | Yes | Integer 0-100 |

---

### Record Project Progress

**Endpoint:** `POST /api/progress/project`

**Request (Start Project):**
```json
{
  "projectTitle": "Build E-commerce Store",
  "status": "started"
}
```

**Request (Update Status):**
```json
{
  "projectTitle": "Build E-commerce Store",
  "status": "in-progress",
  "notes": "Working on payment integration"
}
```

**Request (Complete Project):**
```json
{
  "projectTitle": "Build E-commerce Store",
  "status": "completed",
  "notes": "Deployed to production"
}
```

**Response (Success):**
```json
{
  "projectProgress": {
    "id": "uuid",
    "user_id": "uuid",
    "project_title": "Build E-commerce Store",
    "status": "completed",
    "started_at": "2026-07-15T09:00:00Z",
    "completed_at": "2026-07-29T10:30:00Z"
  }
}
```

**Parameters:**
| Name | Type | Required | Notes |
|------|------|----------|-------|
| projectTitle | string | Yes | Non-empty project name |
| status | string | No | "started", "in-progress", or "completed" (default: "started") |
| notes | string | No | Optional progress notes |

---

### Record Roadmap Item Completion

**Endpoint:** `POST /api/progress/roadmap-item`

**Request:**
```json
{
  "roadmapId": "roadmap-uuid-123",
  "itemTitle": "Master JavaScript Fundamentals",
  "phase": "beginner"
}
```

**Response (Success):**
```json
{
  "roadmapItemProgress": {
    "id": "uuid",
    "user_id": "uuid",
    "roadmap_id": "roadmap-uuid-123",
    "item_title": "Master JavaScript Fundamentals",
    "phase": "beginner",
    "completed_at": "2026-07-29T10:30:00Z"
  }
}
```

**Parameters:**
| Name | Type | Required | Notes |
|------|------|----------|-------|
| roadmapId | string | Yes | UUID of the roadmap |
| itemTitle | string | Yes | Non-empty item title |
| phase | string | Yes | "beginner", "intermediate", or "advanced" |

---

### Get Progress Summary

**Endpoint:** `GET /api/progress/summary`

**Response (Success):**
```json
{
  "progressSummary": {
    "user_id": "uuid",
    "total_topics_completed": 12,
    "total_quizzes_completed": 5,
    "total_projects_completed": 2,
    "overall_completion_percentage": 42,
    "roadmap_completion_percentage": 35,
    "learning_streak_days": 7,
    "weekly_progress": [
      {
        "date": "2026-07-22",
        "topics_completed": 2,
        "quizzes_completed": 1,
        "projects_completed": 0,
        "time_spent_minutes": 120
      },
      {
        "date": "2026-07-29",
        "topics_completed": 3,
        "quizzes_completed": 1,
        "projects_completed": 1,
        "time_spent_minutes": 180
      }
    ],
    "last_activity_date": "2026-07-29T10:30:00Z",
    "created_at": "2026-07-15T09:00:00Z"
  }
}
```

**Response Fields:**

| Field | Type | Description |
|-------|------|-------------|
| user_id | string | User's UUID |
| total_topics_completed | number | Total topics completed |
| total_quizzes_completed | number | Total quizzes completed |
| total_projects_completed | number | Total projects marked as complete |
| overall_completion_percentage | number | Percentage of total activities (0-100) |
| roadmap_completion_percentage | number | Percentage of roadmap items (0-100) |
| learning_streak_days | number | Consecutive days with activity |
| weekly_progress | array | Week-by-week breakdown (4 weeks) |
| last_activity_date | string | ISO timestamp of last activity |
| created_at | string | When progress tracking started |

---

## Core Functions (Service Layer)

### recordTopicCompletion(userId, topic, timeSpentMinutes)

Records a completed topic.

**Parameters:**
- `userId` (string): User ID from auth
- `topic` (string): Topic name
- `timeSpentMinutes` (number, optional): Minutes spent (default: 0)

**Returns:** TopicProgress object

**Example:**
```typescript
import { recordTopicCompletion } from '@/lib/progress/progress-service';

const progress = await recordTopicCompletion(
  userId,
  'React Hooks',
  45
);
```

---

### recordQuizCompletion(userId, quizId, score)

Records a completed quiz with score.

**Parameters:**
- `userId` (string): User ID from auth
- `quizId` (string): Quiz UUID
- `score` (number): Score 0-100

**Returns:** QuizProgress object

**Example:**
```typescript
const progress = await recordQuizCompletion(
  userId,
  'quiz-abc123',
  85
);
```

---

### recordProjectProgress(userId, projectTitle, status, notes)

Records or updates project progress.

**Parameters:**
- `userId` (string): User ID from auth
- `projectTitle` (string): Project name
- `status` (string, optional): "started" | "in-progress" | "completed"
- `notes` (string, optional): Progress notes

**Returns:** ProjectProgress object

**Example:**
```typescript
const progress = await recordProjectProgress(
  userId,
  'Build E-commerce Site',
  'in-progress',
  'Working on payment integration'
);
```

---

### recordRoadmapItemCompletion(userId, roadmapId, itemTitle, phase)

Records completion of a roadmap item.

**Parameters:**
- `userId` (string): User ID from auth
- `roadmapId` (string): Roadmap UUID
- `itemTitle` (string): Item title
- `phase` (string): "beginner" | "intermediate" | "advanced"

**Returns:** RoadmapItemProgress object

**Example:**
```typescript
const progress = await recordRoadmapItemCompletion(
  userId,
  'roadmap-xyz789',
  'Master JavaScript Fundamentals',
  'beginner'
);
```

---

### calculateLearningStreak(userId)

Calculates consecutive days with activity.

**Parameters:**
- `userId` (string): User ID

**Returns:** Number of consecutive days

**Logic:**
- Queries all activity types (topics, quizzes, projects)
- Deduplicates dates
- Counts consecutive days (today and backwards)
- Breaks at first gap > 1 day

**Example:**
```typescript
const streak = await calculateLearningStreak(userId);
console.log(`${streak} day learning streak`);
```

---

### getWeeklyProgress(userId, weeksBack)

Gets week-by-week breakdown of progress.

**Parameters:**
- `userId` (string): User ID
- `weeksBack` (number, optional): Weeks to retrieve (default: 4)

**Returns:** Array of WeeklyProgressData

**Example:**
```typescript
const weeks = await getWeeklyProgress(userId, 8);
weeks.forEach(week => {
  console.log(`${week.date}: ${week.topics_completed} topics, ${week.quizzes_completed} quizzes`);
});
```

---

### getProgressSummary(userId)

Gets complete progress metrics for a user.

**Parameters:**
- `userId` (string): User ID

**Returns:** ProgressSummary object with all metrics

**What it calculates:**
1. Total activities completed (topics, quizzes, projects)
2. Overall completion percentage
3. Roadmap completion percentage
4. Learning streak
5. 4 weeks of weekly progress
6. Last activity date

**Example:**
```typescript
const summary = await getProgressSummary(userId);
console.log(`Progress: ${summary.overall_completion_percentage}%`);
console.log(`Streak: ${summary.learning_streak_days} days`);
```

---

## Frontend Integration Examples

### React Hook: Use Progress Summary

```typescript
import { useEffect, useState } from 'react';
import type { ProgressSummary } from '@/types';

export function useProgressSummary() {
  const [summary, setSummary] = useState<ProgressSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchProgressSummary();
  }, []);

  const fetchProgressSummary = async () => {
    try {
      const res = await fetch('/api/progress/summary');
      const data = await res.json();
      
      if (data.error) {
        setError(data.error);
      } else {
        setSummary(data.progressSummary);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch progress');
    } finally {
      setLoading(false);
    }
  };

  return { summary, loading, error, refetch: fetchProgressSummary };
}
```

### Component: Record Topic Completion

```typescript
async function completeTopicHandler(topic: string, minutes: number) {
  try {
    const res = await fetch('/api/progress/topic', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        topic,
        timeSpentMinutes: minutes,
      }),
    });

    const data = await res.json();
    
    if (data.error) {
      console.error('Error:', data.error);
      return null;
    }

    console.log('Topic completed:', data.topicProgress);
    return data.topicProgress;
  } catch (error) {
    console.error('Request failed:', error);
    return null;
  }
}
```

### Component: Record Quiz Completion

```typescript
async function completeQuizHandler(quizId: string, score: number) {
  try {
    const res = await fetch('/api/progress/quiz', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ quizId, score }),
    });

    const data = await res.json();
    
    if (data.error) {
      console.error('Error:', data.error);
      return null;
    }

    return data.quizProgress;
  } catch (error) {
    console.error('Request failed:', error);
    return null;
  }
}
```

### Component: Display Progress Summary

```typescript
export function ProgressDashboard() {
  const { summary, loading, error } = useProgressSummary();

  if (loading) return <div>Loading progress...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!summary) return <div>No progress data</div>;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-4">
        <div className="p-4 bg-blue-50 rounded">
          <h3 className="font-semibold">Overall Progress</h3>
          <p className="text-2xl font-bold">{summary.overall_completion_percentage}%</p>
        </div>
        <div className="p-4 bg-green-50 rounded">
          <h3 className="font-semibold">Learning Streak</h3>
          <p className="text-2xl font-bold">{summary.learning_streak_days} days</p>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div className="text-center">
          <p className="text-gray-600">Topics</p>
          <p className="text-3xl font-bold">{summary.total_topics_completed}</p>
        </div>
        <div className="text-center">
          <p className="text-gray-600">Quizzes</p>
          <p className="text-3xl font-bold">{summary.total_quizzes_completed}</p>
        </div>
        <div className="text-center">
          <p className="text-gray-600">Projects</p>
          <p className="text-3xl font-bold">{summary.total_projects_completed}</p>
        </div>
      </div>

      <div>
        <h3 className="font-semibold mb-3">Weekly Progress</h3>
        {summary.weekly_progress.map((week) => (
          <div key={week.date} className="flex justify-between py-2 border-b">
            <span>{week.date}</span>
            <span>{week.topics_completed} topics, {week.quizzes_completed} quizzes</span>
          </div>
        ))}
      </div>
    </div>
  );
}
```

---

## Setup Instructions

### 1. Run Supabase Schema

Copy the SQL from `PROGRESS_SCHEMA.sql`:

```bash
# In Supabase Dashboard:
# 1. SQL Editor
# 2. New Query
# 3. Paste contents of PROGRESS_SCHEMA.sql
# 4. Execute
```

### 2. Test the API

```bash
# Record a topic completion
curl -X POST http://localhost:3000/api/progress/topic \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"topic": "React", "timeSpentMinutes": 30}'

# Get progress summary
curl -X GET http://localhost:3000/api/progress/summary \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### 3. Verify

- Check Supabase tables are populated
- Verify progress_summary has one record per user
- Check weekly_progress calculation is correct
- Verify learning_streak counts consecutive days

---

## Calculations & Logic

### Overall Completion Percentage

```
percentage = (total_activities / (total_activities + 10)) * 100
```

Rationale: Assumes student will complete ~10 more activities in future. Adjustable.

### Roadmap Completion Percentage

```
percentage = (completed_items / total_items) * 100
```

Based on actual roadmap items marked as completed.

### Learning Streak

```
1. Collect dates from all activity types
2. Deduplicate and sort descending
3. Count consecutive days where gap ≤ 1 day
4. Break at first gap > 1 day
```

Resets if no activity for > 1 day.

### Weekly Progress

```
1. Initialize last N weeks as empty
2. For each activity type (topics, quizzes, projects):
   - Group by week
   - Increment counters for that week
3. Sum time_spent_minutes from topics
4. Return sorted by date
```

---

## Error Handling

| Error | Status | Fix |
|-------|--------|-----|
| "Unauthorized" | 401 | User not authenticated |
| "Topic is required" | 400 | Provide non-empty topic |
| "Score must be 0-100" | 400 | Provide valid score |
| "Phase must be..." | 400 | Use valid phase |
| "Internal server error" | 500 | Check logs |

---

## Data Retention & Privacy

- **RLS Enabled:** Users can only access their own data
- **Auto-deletion:** Records cascade-delete when user deleted
- **Timestamps:** All records timestamped in UTC
- **No Aggregation:** Raw data stored, aggregated on-demand

---

## Performance Considerations

**Indexes:**
- `(user_id)` on all tables for filtering by user
- `(completed_at DESC)` on activity tables for recent queries
- `(status)` on project_progress for status queries

**Query Pattern:**
- Summary fetches counts via `count: "exact"` queries
- Weekly progress groups by date (client-side)
- Streak calculation is O(n) but typically n < 365

**Optimization Ideas:**
- Materialize progress_summary daily (currently on-demand)
- Cache summaries (5-minute TTL)
- Archive old activity records quarterly

---

## Type Definitions

See [types/index.ts](types/index.ts) for TypeScript interfaces:

```typescript
interface TopicProgress {
  id: string;
  user_id: string;
  topic: string;
  completed_at: string;
  time_spent_minutes: number;
}

interface QuizProgress {
  id: string;
  user_id: string;
  quiz_id: string;
  score: number;
  completed_at: string;
}

interface ProjectProgress {
  id: string;
  user_id: string;
  project_title: string;
  status: "started" | "in-progress" | "completed";
  started_at: string;
  completed_at?: string;
}

interface RoadmapItemProgress {
  id: string;
  user_id: string;
  roadmap_id: string;
  item_title: string;
  phase: "beginner" | "intermediate" | "advanced";
  completed: boolean;
  completed_at?: string;
}

interface WeeklyProgressData {
  date: string;
  topics_completed: number;
  quizzes_completed: number;
  projects_completed: number;
  time_spent_minutes: number;
}

interface ProgressSummary {
  user_id: string;
  total_topics_completed: number;
  total_quizzes_completed: number;
  total_projects_completed: number;
  overall_completion_percentage: number;
  roadmap_completion_percentage: number;
  learning_streak_days: number;
  weekly_progress: WeeklyProgressData[];
  last_activity_date: string;
  created_at: string;
}
```

---

## Status

✅ **COMPLETE AND READY**

All components implemented:
- ✅ Database schema with RLS
- ✅ Service layer with 7 functions
- ✅ 5 API routes
- ✅ TypeScript types
- ✅ Error handling
- ✅ Documentation

**Ready for use!** 🚀

---

## Files

| File | Purpose |
|------|---------|
| `PROGRESS_SCHEMA.sql` | Database tables, indexes, RLS, permissions |
| `lib/progress/progress-service.ts` | Core tracking functions |
| `app/api/progress/topic/route.ts` | Record topic completion |
| `app/api/progress/quiz/route.ts` | Record quiz completion |
| `app/api/progress/project/route.ts` | Record project progress |
| `app/api/progress/roadmap-item/route.ts` | Record roadmap item |
| `app/api/progress/summary/route.ts` | Get progress summary |
| `types/index.ts` | TypeScript interfaces |
