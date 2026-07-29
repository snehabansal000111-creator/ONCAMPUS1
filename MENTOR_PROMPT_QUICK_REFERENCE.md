# Mentor Prompt Functions - Quick Reference

## Overview
Enhanced prompt builder with 4 specialized mentor functions for personalized learning guidance.

---

## Function Summary

| Function | Purpose | Response Type |
|----------|---------|---------------|
| `buildMentoringPrompt()` | Main mentor responses | 10-section guidance |
| `buildDailyGoalPrompt()` | Daily learning objectives | Actionable daily plan |
| `buildPracticePrompt()` | Practice exercises | Questions + solutions |
| `buildMiniProjectPrompt()` | Portfolio projects | Full project design |

---

## 1. buildMentoringPrompt() — Main Mentor Function

**Location:** `lib/prompt-builder.ts`

**Usage:**
```typescript
import { buildMentoringPrompt } from "@/lib/prompt-builder";

const prompt = buildMentoringPrompt(
  profile,
  userQuestion,
  {
    recentProgress: "Completed HTML/CSS basics",
    currentlyLearning: "JavaScript fundamentals",
    challenges: ["Async/await", "Event listeners"],
    previousTopics: ["Variables", "Functions", "DOM"]
  }
);
```

**Returns:**
```typescript
{
  systemPrompt: string,    // Mentor system context
  userPrompt: string       // Formatted user question
}
```

**Response Sections:**
```
📌 Current Situation        — Student position analysis
🎯 Recommendation          — What to learn (+ WHY)
📅 Next Steps              — 7-day learning plan
📚 Resources               — 3-5 curated resources
📝 Practice                — Concrete exercises
🚀 Future Goal             — 30-day milestone
```

**Profile Data Used:**
- ✅ name, branch, year
- ✅ skills (skill level determination)
- ✅ interests
- ✅ careerGoal (career alignment)
- ✅ learningStyle (adaptation)
- ✅ dailyStudyHours (time planning)
- ✅ monthlyBudget (resource selection)
- ✅ background

---

## 2. buildDailyGoalPrompt() — Daily Objectives

**Location:** `lib/prompt-builder.ts`

**Usage:**
```typescript
import { buildDailyGoalPrompt } from "@/lib/prompt-builder";

const prompt = buildDailyGoalPrompt(
  profile,
  "React Components",
  2  // Available hours today (default: profile.dailyStudyHours)
);
```

**Returns:** BuiltPrompt with system + user message

**Generated Output:**
```
Today's Goal: [Specific objective for 2 hours]

Breakdown:
- 30 min: [Activity 1]
- 45 min: [Activity 2]
- 45 min: [Activity 3]

Success Metrics:
✅ [Metric 1]
✅ [Metric 2]
✅ [Metric 3]

Reflection Prompt:
[Self-assessment question]
```

**Best For:**
- Daily planning
- Time management
- Progress tracking
- Goal setting

---

## 3. buildPracticePrompt() — Practice Questions

**Location:** `lib/prompt-builder.ts`

**Usage:**
```typescript
import { buildPracticePrompt } from "@/lib/prompt-builder";

const prompt = buildPracticePrompt(
  profile,
  "JavaScript Async Programming",
  "intermediate"  // Options: "beginner" | "intermediate" | "advanced"
);
```

**Returns:** BuiltPrompt with practice questions

**Generated Output:**
```
Practice Questions: JavaScript Async Programming

Question 1: [Question at intermediate level]
Hints:
- [Hint 1]
- [Hint 2]

Solution: [Detailed solution]

Explanation: [Why this is correct]

Time: ~15 minutes
```

**Difficulty Levels:**
```
Beginner (easy):
  - 5-10 min each
  - Foundational concepts
  - Simple implementations

Intermediate:
  - 15-20 min each
  - Real-world applications
  - Problem-solving

Advanced:
  - 20-30 min each
  - Complex scenarios
  - System design
  - Optimization
```

**Question Types Generated:**
- Conceptual questions
- Code writing
- Applied problems
- Debugging challenges

**Best For:**
- Skill verification
- Knowledge reinforcement
- Gap identification
- Self-assessment

---

## 4. buildMiniProjectPrompt() — Portfolio Projects

**Location:** `lib/prompt-builder.ts`

**Usage:**
```typescript
import { buildMiniProjectPrompt } from "@/lib/prompt-builder";

const prompt = buildMiniProjectPrompt(
  profile,
  "Building REST APIs",
  3  // Duration in hours (default: profile.dailyStudyHours)
);
```

**Returns:** BuiltPrompt with full project design

**Generated Output:**
```
Project: [Title for REST API project]
Duration: 3 hours
Career Goal Alignment: [How it helps Backend Developer goal]

Objectives:
1. [Learning objective 1]
2. [Learning objective 2]
3. [Learning objective 3]

Implementation Steps:
1. [Step 1 with time]
2. [Step 2 with time]
3. [Step 3 with time]

Resources Needed:
- [Tool 1] (Free/Freemium)
- [Tool 2] (Free)
- [Tool 3] (Free)

Success Criteria:
✅ [Criterion 1]
✅ [Criterion 2]
✅ [Criterion 3]

Portfolio Presentation:
[How to showcase this project]
```

**Project Properties:**
- ✅ Career goal aligned
- ✅ Skill-building focused
- ✅ Portfolio-worthy
- ✅ Time-appropriate
- ✅ Uses free tools
- ✅ Budget conscious

**Best For:**
- Portfolio building
- Practical skill development
- Real-world application
- Career preparation
- Motivation (visible progress)

---

## Current Integration

### Chat Endpoint (`/api/chat`)
**Currently Uses:** `buildMentoringPrompt()`

```typescript
// app/api/chat/route.ts
const prompt = buildMentoringPrompt(studentProfile, userMessage);
const response = await anthropic.messages.create({
  model: "claude-opus-5",
  max_tokens: 2048,  // Increased for detailed responses
  system: prompt.systemPrompt,
  messages: [{ role: "user", content: prompt.userPrompt }]
});
```

---

## How to Extend Integration

### New Route: Daily Goals
```typescript
// app/api/daily-goal/route.ts
import { buildDailyGoalPrompt } from "@/lib/prompt-builder";

export async function POST(request: Request) {
  const { topic, availableHours } = await request.json();
  const profile = await getStudentProfile(userId);
  const prompt = buildDailyGoalPrompt(profile, topic, availableHours);
  // Call Claude with prompt...
}
```

### New Route: Practice
```typescript
// app/api/practice/route.ts
import { buildPracticePrompt } from "@/lib/prompt-builder";

export async function POST(request: Request) {
  const { topic, difficulty } = await request.json();
  const profile = await getStudentProfile(userId);
  const prompt = buildPracticePrompt(profile, topic, difficulty);
  // Call Claude with prompt...
}
```

### New Route: Projects
```typescript
// app/api/mini-project/route.ts
import { buildMiniProjectPrompt } from "@/lib/prompt-builder";

export async function POST(request: Request) {
  const { topic, duration } = await request.json();
  const profile = await getStudentProfile(userId);
  const prompt = buildMiniProjectPrompt(profile, topic, duration);
  // Call Claude with prompt...
}
```

---

## Personalization Data Used

### Profile Fields Analyzed
```typescript
interface StudentProfile {
  name: string;                    // Used in greeting
  branch: string;                  // Academic context
  year: string;                    // Year level
  skills: string[];                // Skill level calculation
  interests: string[];             // Interest connection
  careerGoal: string;              // Career alignment
  learningStyle: LearningStyle;    // Style adaptation
  monthlyBudget: number;           // Resource selection
  dailyStudyHours: number;         // Time planning
  background?: string;             // Context awareness
}
```

### Skill Level Calculation
```
1-2 skills  → Beginner level
3-5 skills  → Intermediate level
5+ skills   → Advanced level
```

### Learning Style Mapping
```
visual    → Diagrams, videos, animations, visual examples
reading   → Documentation, articles, detailed explanations
hands-on  → Projects, coding, building, experimentation
mixed     → Combination of all approaches
```

---

## Response Quality Guidelines

### Every Response Should:
1. **Be Personalized** — Use student's name, profile
2. **Explain WHY** — "This fits you because..."
3. **Show Context** — "At your level, you should..."
4. **Honor Constraints** — Time, budget, learning style
5. **Build Confidence** — Encouraging tone
6. **Drive Progress** — Goal-aligned recommendations
7. **Be Actionable** — Specific next steps
8. **Stay Detailed** — Not brief/generic
9. **Connect to Goals** — Always mention career goal
10. **Respect Learning Style** — Adapt format

---

## Testing Mentoring Prompts

### Test Chat Endpoint
```bash
curl -X POST http://localhost:3000/api/chat \
  -H "Content-Type: application/json" \
  -d '{"message": "How do I learn React?"}'
```

### Expected Response Format
```
📌 Current Situation
[Analysis of student's current position]

🎯 Recommendation
[Personalized advice with specific reasons]

📅 Next Steps
[7-day plan with time allocations]

📚 Resources
[3-5 curated resources with links]

📝 Practice
[Hands-on exercises and challenges]

🚀 Future Goal
[30-day milestone toward career goal]
```

---

## Token Usage

| Function | Typical Tokens | Notes |
|----------|---|---|
| buildMentoringPrompt | 800-1200 | Detailed mentor response |
| buildDailyGoalPrompt | 400-600 | Daily plan generation |
| buildPracticePrompt | 600-900 | Questions + solutions |
| buildMiniProjectPrompt | 700-1000 | Full project design |

---

## Common Patterns

### Pattern 1: Full Learning Flow
```typescript
// Day start
const dailyGoal = buildDailyGoalPrompt(profile, topic, 3);

// During learning
const practice = buildPracticePrompt(profile, topic, "intermediate");

// Project application
const project = buildMiniProjectPrompt(profile, topic, 3);

// Mentoring support
const mentor = buildMentoringPrompt(profile, studentQuestion);
```

### Pattern 2: Quick Mentor Check-In
```typescript
const mentor = buildMentoringPrompt(profile, "How am I progressing?");
```

### Pattern 3: Practice Session
```typescript
const practice = buildPracticePrompt(profile, topic, "beginner");
// Then after practice:
const mentor = buildMentoringPrompt(profile, "How did I do?");
```

---

## Customization Options

### Add Current Context
```typescript
buildMentoringPrompt(profile, question, {
  recentProgress: "Just finished arrays",
  currentlyLearning: "Objects and loops",
  challenges: ["Nested objects"],
  previousTopics: ["Variables", "Functions"]
});
```

### Adjust Available Time
```typescript
buildDailyGoalPrompt(profile, "React", 2); // 2 hours instead of default
buildMiniProjectPrompt(profile, "API", 5); // 5 hours instead of default
```

### Target Difficulty
```typescript
buildPracticePrompt(profile, "JavaScript", "advanced");
```

---

## Best Practices

### DO ✅
- Always fetch fresh profile from Supabase
- Include context when available
- Use mentor prompts for all educational guidance
- Respect student's time constraints
- Honor learning style preferences
- Acknowledge budget limitations

### DON'T ❌
- Use generic prompts (always mentor)
- Ignore student profile
- Assume one-size-fits-all
- Recommend expensive resources without checking budget
- Use learning methods student dislikes
- Generate responses without personalization

---

## Files & Locations

```
lib/prompt-builder.ts
├── buildMentoringPrompt()      [NEW ⭐]
├── buildDailyGoalPrompt()       [NEW ⭐]
├── buildPracticePrompt()        [NEW ⭐]
├── buildMiniProjectPrompt()     [NEW ⭐]
├── buildFullPrompt()            [existing]
├── buildRoadmapPrompt()         [existing]
└── buildQuizPrompt()            [existing]

app/api/chat/route.ts
└── Uses buildMentoringPrompt()  [UPDATED ✅]
```

---

## Summary

**4 new mentor functions** providing:
- ✅ Personalized responses
- ✅ Career-goal alignment
- ✅ Learning-style adaptation
- ✅ Time-aware planning
- ✅ Budget-conscious recommendations
- ✅ Detailed, actionable guidance
- ✅ Mentor-level mentorship

**Currently integrated:** Chat endpoint (`/api/chat`)

**Ready to extend:** New routes for daily goals, practice, projects

**Quality level:** Production-ready, highly personalized mentoring

---

**Status:** ✅ COMPLETE  
**Personalization:** Maximum  
**Mentor Experience:** Authentic  
**Ready to Use:** YES  
