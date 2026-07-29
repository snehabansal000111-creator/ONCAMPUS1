# AI Modules Integration Guide

## Overview

All AI modules are integrated into a cohesive learning platform. This guide explains how each module connects and works together.

## Module Flow

```
┌─────────────────────────────────────────────────────────────┐
│                    Student Signs In                          │
└────────────────────────┬────────────────────────────────────┘
                         ▼
┌─────────────────────────────────────────────────────────────┐
│              Load/Complete Student Profile                   │
│    (name, branch, skills, interests, career goal, etc)      │
└────────────────────────┬────────────────────────────────────┘
                         ▼
┌─────────────────────────────────────────────────────────────┐
│               Claude API + Prompt Builder                    │
│         Generate Personalized Responses Using Profile        │
└────────┬──────────────────┬──────────────────┬──────────────┘
         ▼                  ▼                  ▼
    ┌─────────┐      ┌──────────┐      ┌────────────┐
    │   Chat  │      │  Roadmap │      │  Resources │
    │Response │      │Generator │      │Recommend.  │
    └─────────┘      └──────────┘      └────────────┘
                         │
                         ▼
          ┌──────────────────────────┐
          │   Daily Task Planner      │
          │  (Breaks down roadmap)    │
          └──────────────┬────────────┘
                         ▼
          ┌──────────────────────────┐
          │    Daily Task List        │
          │  (Today + Upcoming tasks) │
          └──────────────┬────────────┘
                         ▼
          ┌──────────────────────────┐
          │  Quiz Generator           │
          │  (Adaptive by stage)      │
          └──────────────┬────────────┘
                         ▼
          ┌──────────────────────────┐
          │  Progress Tracking        │
          │  (Streak, %, analytics)   │
          └──────────────────────────┘
```

## 1. Student Profile Module

### Purpose
Stores student information to personalize all AI interactions.

### Data Stored
```typescript
{
  name: string;
  branch: string;
  year: string;
  interests: string[];
  skills: string[];
  careerGoal: string;
  learningStyle: "visual" | "reading" | "hands-on" | "mixed";
  monthlyBudget: number;
  dailyStudyHours: number;
  background?: string;
}
```

### API Endpoints
- `GET /api/profile` — Get student profile
- `POST /api/profile` — Create/update profile

### Used By
All other modules use profile data for personalization.

---

## 2. Claude API + Prompt Builder

### Purpose
Generate personalized responses using Claude with student context.

### How It Works
```
Student Profile → Prompt Builder → System Prompt (contextual)
                                ↓
User Question ──────────────────→ User Prompt
                                ↓
                            Claude API
                                ↓
                      Personalized Response
```

### Key Functions
- `buildFullPrompt()` — Complete system + user prompt
- `buildSystemPromptOnly()` — Just system context
- `buildUserPromptOnly()` — Just user question
- `buildRoadmapPrompt()` — Roadmap-specific prompt
- `buildQuizPrompt()` — Quiz-specific prompt

### Examples
```typescript
// Generate personalized chat response
const prompt = buildFullPrompt(profile, userQuestion, {
  tone: "friendly"
});
const response = await callClaude(prompt);

// Generate roadmap
const roadmapPrompt = buildRoadmapPrompt(profile, "React");
const roadmap = await generateRoadmapWithClaude(roadmapPrompt);
```

### Used By
- Chat module
- Roadmap generator
- Quiz generator
- Resource recommendations (indirectly)

---

## 3. Personalized Chat

### Purpose
Real-time conversation with AI tailored to student profile.

### API Endpoint
`POST /api/chat`

### Request
```json
{
  "message": "What should I learn today?"
}
```

### Response
```json
{
  "reply": "Based on your profile, I recommend focusing on [topic]..."
}
```

### Flow
1. Get authenticated user
2. Load student profile
3. Build personalized prompt using Prompt Builder
4. Send to Claude API
5. Return response

### Integrated With
- Student profile (context)
- Claude API (response generation)

---

## 4. Roadmap Generator

### Purpose
Creates 3-phase learning roadmaps based on student profile and topic.

### API Endpoint
`POST /api/roadmap/generate`

### Request
```json
{
  "topic": "React",
  "roadmapStage": "beginner"
}
```

### Output
```typescript
{
  beginner: {
    topics: string[];
    milestones: string[];
    projects: RoadmapProject[];
    resources: RoadmapResource[];
    practice: RoadmapPractice[];
  },
  intermediate: { ... },
  advanced: { ... }
}
```

### Flow
1. Get user profile
2. Build roadmap-specific prompt
3. Call Claude to generate roadmap
4. Parse and save to Supabase
5. Return roadmap structure

### Integrated With
- Student profile (personalization)
- Claude API (generation)
- Planner (converts to daily tasks)
- Prompt Builder (specialized prompts)

---

## 5. Daily Task Planner

### Purpose
Breaks down roadmap into manageable daily tasks.

### API Endpoints
- `POST /api/planner/generate` — Create daily plan from roadmap
- `GET /api/planner/today` — Get today's tasks
- `GET /api/planner/upcoming` — Get next N days of tasks
- `POST /api/planner/task` — Complete a task
- `GET /api/planner/task` — Get task statistics

### Sample Tasks Generated
```
- Study: JavaScript Fundamentals (60 min)
- Practice: Build a calculator (45 min)
- Project: Create a todo app (120 min)
- Quiz: JavaScript Basics (30 min)
- Milestone: Complete beginner phase (celebration)
```

### Flow
1. Get user's roadmap
2. Break down into daily chunks
3. Create tasks for each phase
4. Store in daily_plans table
5. Return task list

### Integrated With
- Roadmap (breaks down into tasks)
- Progress tracking (task completion)

---

## 6. Quiz Generator

### Purpose
Generates adaptive quizzes based on roadmap stage and topic.

### API Endpoint
`POST /api/quiz/generate`

### Request
```json
{
  "topic": "React",
  "difficulty": "medium",
  "roadmapStage": "intermediate"
}
```

### Question Types
- **MCQ** (multiple choice)
- **Coding** (programming challenges)
- **Short Answer** (text response)

### Flow
1. Get user profile
2. Build quiz-specific prompt
3. Call Claude to generate questions
4. Parse into structured format
5. Save quiz to Supabase
6. Return quiz with questions

### Integrated With
- Student profile (personalization)
- Roadmap (stage context)
- Prompt Builder (specialized prompts)
- Claude API (generation)
- Progress tracking (records scores)

---

## 7. Resource Recommendation Engine

### Purpose
Recommends high-quality resources based on student context.

### API Endpoint
`POST /api/resources/recommend`

### Request
```json
{
  "topic": "React",
  "roadmapStage": "intermediate"
}
```

### Resource Types
- Official Documentation
- YouTube Channels
- GitHub Repositories
- Courses (free/paid)
- Practice Websites
- Books

### Filtering
Resources filtered by:
1. Career goal (required)
2. Skill level (required)
3. Roadmap stage (required)
4. Topic (fuzzy match)

### Flow
1. Get user profile (career goal, skill level)
2. Query curated resource database
3. Filter by all criteria
4. Sort by rating and cost
5. Return top resources

### Integrated With
- Student profile (career goal, skill level)
- Curated database (30+ resources)

---

## 8. Progress Tracking

### Purpose
Monitors and measures learning across all activities.

### Tracks
- Topics completed (with time)
- Quizzes completed (with scores)
- Projects (status + timeline)
- Roadmap items (by phase)
- Learning streak (consecutive days)
- Weekly breakdown
- Completion percentages

### API Endpoints
- `POST /api/progress/topic` — Record topic
- `POST /api/progress/quiz` — Record quiz
- `POST /api/progress/project` — Record project
- `POST /api/progress/roadmap-item` — Record roadmap item
- `GET /api/progress/summary` — Get all metrics

### Metrics Calculated
```typescript
{
  overall_completion_percentage: 42,
  roadmap_completion_percentage: 35,
  learning_streak_days: 7,
  total_topics_completed: 12,
  total_quizzes_completed: 5,
  total_projects_completed: 2,
  weekly_progress: [...]
}
```

### Flow
1. Activities recorded when completed
2. Counts aggregated automatically
3. Streak calculated from activity dates
4. Weekly data grouped by week
5. Summary returned on-demand

### Integrated With
- Daily tasks (task completion)
- Quizzes (quiz scores)
- Projects (status changes)
- Roadmap items (progress)

---

## Complete Integration Flow

### Day 1: Setup
```
1. Student Signs In
   ↓
2. Complete Profile (if new)
   ↓
3. Chat Responds With Personalization
```

**Endpoints:**
- `POST /api/auth/signup`
- `POST /api/profile`
- `POST /api/chat`

---

### Day 2-3: Planning
```
1. Request Roadmap
   ↓ (Uses: Profile + Claude + Prompt Builder)
2. Roadmap Generated and Saved
   ↓
3. Create Daily Plan
   ↓ (Uses: Roadmap + Planner)
4. Daily Tasks Created
```

**Endpoints:**
- `POST /api/roadmap/generate`
- `POST /api/planner/generate`
- `GET /api/planner/today`

---

### Day 4+: Learning
```
1. Get Today's Tasks
   ↓
2. Study Topics (recorded in Progress)
   ↓
3. Take Quiz (generated by Claude)
   ↓
4. Quiz Score Recorded in Progress
   ↓
5. See Recommended Resources
   ↓
6. Dashboard Shows Updated Progress
```

**Endpoints:**
- `GET /api/planner/today`
- `POST /api/progress/topic`
- `POST /api/quiz/generate`
- `POST /api/progress/quiz`
- `POST /api/resources/recommend`
- `GET /api/progress/summary`

---

## Integration Endpoints

### Check System Status
`GET /api/integration/status`

Returns which modules are ready:
```json
{
  "status": {
    "profile_loaded": true,
    "roadmap_generated": true,
    "daily_plan_created": true,
    "quizzes_taken": true,
    "progress_tracked": true,
    "all_systems_ready": true,
    "recommendations": ["Keep building momentum"]
  }
}
```

### Get Dashboard Data
`GET /api/integration/dashboard`

Returns everything needed for dashboard:
```json
{
  "learning_state": {
    "profile": {...},
    "roadmap": {...},
    "dailyPlan": {...},
    "todaysTasks": [...],
    "recentQuizzes": [...],
    "progressSummary": {...}
  },
  "progress_view": {
    "overall_progress_percentage": 42,
    "learning_streak_days": 7,
    "todays_task_count": 5,
    "todays_completed_count": 3,
    "quiz_average_score": 82
  },
  "next_step": {
    "step": "Complete Daily Tasks",
    "action": "Finish 2 remaining tasks",
    "reason": "Daily consistency builds momentum"
  }
}
```

---

## Error Handling & Fallbacks

### If Profile Missing
- Use default/mock profile
- Prompt user to complete profile
- Fallback to generic responses

### If Roadmap Not Generated
- Suggest generating roadmap first
- Guide user with prompts

### If Daily Plan Not Created
- Auto-generate from roadmap
- Or provide manual task entry

### If Resources Unavailable
- Use curated database
- No random recommendations
- Guaranteed quality

### If Progress API Down
- Cache recent progress
- Show offline data
- Sync when available

---

## Data Flow Diagram

```
┌────────────────────────────────────┐
│    Student Profile Storage         │
│  (Supabase: student_profiles)     │
└────────────┬─────────────────────┘
             │
      ┌──────┴──────┐
      ▼             ▼
┌──────────┐   ┌──────────────┐
│  Claude  │   │ Prompt       │
│  API     │   │ Builder      │
└──────┬───┘   └──────────────┘
       │
    ┌──┴──┬─────────┬───────────┐
    ▼     ▼         ▼           ▼
  Chat  Roadmap   Quiz      Resources
  ▼     │         │         │
Responses
        ▼         ▼         │
    ┌─────────────┬─────────┘
    ▼             ▼
  Planner ← Profile Context
    ▼
Daily Tasks ──→ Progress Tracker
    ▼                ▲
  Quiz ─────────────┘
    ▼
Resources ──────────→ Dashboard
    ▼
 Progress ──────────→ Next Steps
```

---

## Production Checklist

- [x] All modules created
- [x] All API routes implemented
- [x] Database schemas created
- [x] Error handling in place
- [x] RLS policies configured
- [x] Type safety verified
- [x] Integration tested
- [x] Documentation complete

---

## Environment Variables

Required for full integration:

```bash
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

# Claude API
ANTHROPIC_API_KEY=sk-ant-...
```

---

## Future Enhancements

- Real-time collaboration
- Mentor matching
- Peer learning groups
- Advanced analytics
- Mobile app
- Offline support
- Community resources
- Leaderboards
- Certifications
