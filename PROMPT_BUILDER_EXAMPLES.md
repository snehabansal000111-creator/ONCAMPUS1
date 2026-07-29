# Prompt Builder - Usage Examples

## Example 1: Basic Question

**Scenario:** Student asks "What should I learn next?"

```typescript
import { buildFullPrompt } from "@/lib/prompt-builder";
import { getStudentProfile } from "@/lib/supabase/profile";

async function handleQuestion(userId: string, question: string) {
  const profile = await getStudentProfile(userId);
  
  const prompt = buildFullPrompt(profile, question);
  
  const response = await anthropic.messages.create({
    model: "claude-opus-5",
    max_tokens: 1024,
    system: prompt.systemPrompt,
    messages: [{ role: "user", content: prompt.userPrompt }],
  });
  
  return response.content[0].text;
}

// Usage
const answer = await handleQuestion("user-123", "What should I learn next?");
// Claude responds with personalized recommendations based on:
// - Skills: Python (basic), HTML/CSS
// - Goal: Frontend Engineer
// - Interests: Web Dev, AI/ML, UI Design
// - Learning style: hands-on
// - Available time: 3 hours/day
```

**Generated System Prompt will include:**
```
You are assisting Riya Sharma, a 1st Year student in Computer Science.

## Student Context
- Career Goal: Frontend Engineer
- Learning Style: hands-on learner who learns by doing
- Current Skills: Python (basic), HTML/CSS
- Interests: Web Development, AI/ML, UI Design
- Study Commitment: 3 hours per day
- Budget: ₹12000/month

## Your Role
- Tailor all explanations to Riya's current skill level
- Prioritize topics aligned with their goal (Frontend Engineer)
- Adapt to their hands-on learning preference
...
```

---

## Example 2: Roadmap Generation

**Scenario:** Create a 3-month web development roadmap

```typescript
import { buildRoadmapPrompt } from "@/lib/prompt-builder";
import { getStudentProfile } from "@/lib/supabase/profile";

async function generateRoadmap(userId: string) {
  const profile = await getStudentProfile(userId);
  
  const prompt = buildRoadmapPrompt(profile, "Web Development", "3-month");
  
  const response = await anthropic.messages.create({
    model: "claude-opus-5",
    max_tokens: 2048,
    system: prompt.systemPrompt,
    messages: [{ role: "user", content: prompt.userPrompt }],
  });
  
  return response.content[0].text;
}

// Usage
const roadmap = await generateRoadmap("user-123");
```

**Generated Prompt Includes:**
```
Custom Instructions:
- Duration: 3-month
- Topic: Web Development
- Align with career goal: Frontend Engineer
- Match learning style: hands-on
- Account for available time: 3 hours/day
- Leverage existing skills: Python (basic), HTML/CSS
- Connect to interests: Web Dev, AI/ML, UI Design

Output Format:
Provide a structured roadmap with:
1. Clear weekly/daily milestones
2. Specific resources (with estimated time)
3. Hands-on projects or practice activities
...
```

**Claude Returns:**
```
# 3-Month Web Development Roadmap for Riya

## Month 1: JavaScript Foundations & React Basics
### Week 1-2: JavaScript Deep Dive
- Learn advanced array methods and ES6 syntax
- Daily practice: 1.5 hours hands-on coding
- Project: Build a simple todo app with vanilla JS

### Week 3-4: React Fundamentals
- JSX, components, props, state
- Hands-on labs: Interactive React exercises
- Mini-project: Create a personal portfolio component

## Month 2: Building Real Projects
...
```

---

## Example 3: Quiz Generation

**Scenario:** Create a medium-difficulty JavaScript quiz

```typescript
import { buildQuizPrompt } from "@/lib/prompt-builder";
import { getStudentProfile } from "@/lib/supabase/profile";

async function createQuiz(userId: string) {
  const profile = await getStudentProfile(userId);
  
  const prompt = buildQuizPrompt(profile, "JavaScript Arrays", "medium");
  
  const response = await anthropic.messages.create({
    model: "claude-opus-5",
    max_tokens: 1024,
    system: prompt.systemPrompt,
    messages: [{ role: "user", content: prompt.userPrompt }],
  });
  
  return response.content[0].text;
}

// Usage
const quiz = await createQuiz("user-123");
```

**Generated Quiz (from Claude):**
```
# JavaScript Arrays - Medium Difficulty Quiz
Created for: Riya Sharma (based on current skills and learning style)

## Question 1: Array Methods
What will this code output?
```javascript
const arr = [1, 2, 3, 4, 5];
const result = arr.map(x => x * 2).filter(x => x > 5);
console.log(result);
```
A) [2, 4, 6, 8, 10]
B) [6, 8, 10]
C) [12, 16, 20]
D) [4, 6, 8, 10]

**Correct Answer:** B) [6, 8, 10]

**Explanation:** 
The map function doubles each value: [2, 4, 6, 8, 10].
Then filter keeps only values > 5: [6, 8, 10].
This aligns with Riya's hands-on learning style with a practical example.

## Question 2-8: ...
```

---

## Example 4: Multi-Turn Conversation

**Scenario:** Maintain context across multiple questions

```typescript
import { buildSystemPromptOnly, buildUserPromptOnly } from "@/lib/prompt-builder";
import { getStudentProfile } from "@/lib/supabase/profile";

async function chatSession(userId: string) {
  const profile = await getStudentProfile(userId);
  const systemPrompt = buildSystemPromptOnly(profile, undefined, "friendly");
  
  const messages = [];
  
  // Question 1
  let userPrompt = buildUserPromptOnly(
    profile,
    "How should I optimize my spending?"
  );
  messages.push({ role: "user", content: userPrompt });
  
  let response = await anthropic.messages.create({
    model: "claude-opus-5",
    max_tokens: 1024,
    system: systemPrompt,
    messages: messages,
  });
  
  console.log("Claude:", response.content[0].text);
  messages.push({ role: "assistant", content: response.content[0].text });
  
  // Question 2 (Follow-up) - Same system prompt, maintaining context
  userPrompt = buildUserPromptOnly(
    profile,
    "Can you specifically recommend resources for learning frontend development within my budget?"
  );
  messages.push({ role: "user", content: userPrompt });
  
  response = await anthropic.messages.create({
    model: "claude-opus-5",
    max_tokens: 1024,
    system: systemPrompt,  // ← Reused!
    messages: messages,
  });
  
  console.log("Claude:", response.content[0].text);
  messages.push({ role: "assistant", content: response.content[0].text });
  
  // Question 3 - Still same system prompt
  userPrompt = buildUserPromptOnly(
    profile,
    "I have ₹2000 extra this month, what should I invest in?"
  );
  messages.push({ role: "user", content: userPrompt });
  
  response = await anthropic.messages.create({
    model: "claude-opus-5",
    max_tokens: 1024,
    system: systemPrompt,  // ← Still reused!
    messages: messages,
  });
  
  console.log("Claude:", response.content[0].text);
}

// Usage
await chatSession("user-123");
```

**Benefits:**
- System prompt built once (saves tokens)
- Context maintained across all messages
- Consistent personalization throughout conversation

---

## Example 5: Career Mentorship

**Scenario:** Get career guidance tailored to student's goal

```typescript
import { buildCareerPrompt } from "@/lib/prompt-builder";
import { getStudentProfile } from "@/lib/supabase/profile";

async function careerMentorship(userId: string) {
  const profile = await getStudentProfile(userId);
  
  const prompt = buildCareerPrompt(
    profile,
    "I want to become a frontend engineer. What skills should I focus on first?"
  );
  
  const response = await anthropic.messages.create({
    model: "claude-opus-5",
    max_tokens: 1024,
    system: prompt.systemPrompt,
    messages: [{ role: "user", content: prompt.userPrompt }],
  });
  
  return response.content[0].text;
}

// Usage
const mentorship = await careerMentorship("user-123");
```

**Claude Response (personalized):**
```
Great question, Riya! Here's a structured path to become a frontend engineer:

## Immediate Priority (Next 3 months)
Based on your current skills (Python basics, HTML/CSS) and hands-on learning style:

1. **JavaScript Mastery** (Your foundation)
   - Advanced ES6+ syntax
   - Async/await and Promises
   - Recommended hands-on projects: Build a weather app, Todo app
   - Time commitment: 1.5 hours daily

2. **React Fundamentals** (Aligns with your interests)
   - Components and hooks
   - State management basics
   - Recommended: Build a project portfolio
   - Hands-on exercises (matches your style): 2 hours daily

## Next 3 Months
- TypeScript basics
- Advanced React patterns
- Learn from developers in your interests: web dev and UI design

## Within Your Budget (₹12,000/month)
- Free: Freecodecamp, YouTube (excellent hands-on courses)
- Paid (recommended): Udemy (₹500-1000) + Figma design course (₹0-500)
...
```

---

## Example 6: Budget Recommendations

**Scenario:** Student asks for spending advice

```typescript
import { buildBudgetPrompt } from "@/lib/prompt-builder";
import { getStudentProfile } from "@/lib/supabase/profile";

async function budgetAdvice(userId: string) {
  const profile = await getStudentProfile(userId);
  
  const prompt = buildBudgetPrompt(
    profile,
    "I spent ₹3500 on food last week but my budget is ₹12000/month. How can I optimize?"
  );
  
  const response = await anthropic.messages.create({
    model: "claude-opus-5",
    max_tokens: 1024,
    system: prompt.systemPrompt,
    messages: [{ role: "user", content: prompt.userPrompt }],
  });
  
  return response.content[0].text;
}

// Usage
const advice = await budgetAdvice("user-123");
```

**Claude Response:**
```
Let me break down your spending and suggest optimizations, Riya:

## Current Situation
- Monthly budget: ₹12,000
- Weekly food spend: ₹3,500 (pace: ₹14,000/month)
- You're 17% over budget on food alone

## Recommendations (Aligned with your goals)

1. **Meal Planning Strategy**
   - Prepare meals at home (saves 60% vs eating out)
   - Batch cook on Sundays (fits your 3-hour study routine)
   - Budget allocation: ₹1,500/week for healthy meals

2. **Learning Investment** (Your priority)
   - Allocate: ₹3,000/month for courses/resources
   - Free: YouTube, Freecodecamp (excellent for hands-on learning)
   - Paid: Udemy courses (₹500-1000 on sale)

3. **Tech Tools** (For frontend development)
   - Allocate: ₹500/month
   - Essential: Github, VSCode (free), Figma (free tier covers UI learning)

4. **Entertainment & Self-care**
   - Allocate: ₹2,000/month
   - Balance learning with relaxation

## Optimized Budget Breakdown
- Food: ₹6,000 (6000 vs current 14000)
- Learning: ₹3,000 (aligns with your Frontend Engineer goal)
- Tech: ₹500
- Entertainment: ₹2,000
- Buffer: ₹500

This keeps you at ₹12,000 while investing in your career goal.
```

---

## Example 7: Custom Instructions

**Scenario:** Add specific custom requirements to a prompt

```typescript
import { buildFullPrompt } from "@/lib/prompt-builder";
import { getStudentProfile } from "@/lib/supabase/profile";

async function customGuidance(userId: string) {
  const profile = await getStudentProfile(userId);
  
  const prompt = buildFullPrompt(profile, "Create a study plan for next week", {
    customInstructions: `
    Additional context:
    - Focus on weak areas: async programming
    - Avoid: Complex system design (not relevant yet)
    - Include: At least 2 hands-on projects
    - Time: 3 hours per day, flexible schedule
    - Format: Daily breakdown with specific tasks
    `,
    tone: "formal",
  });
  
  const response = await anthropic.messages.create({
    model: "claude-opus-5",
    max_tokens: 1024,
    system: prompt.systemPrompt,
    messages: [{ role: "user", content: prompt.userPrompt }],
  });
  
  return response.content[0].text;
}

// Usage
const plan = await customGuidance("user-123");
```

---

## Integration with API Route

**Example:** Update `/api/chat` to use Prompt Builder

```typescript
// app/api/chat/route.ts
import { NextResponse } from "next/server";
import { buildFullPrompt } from "@/lib/prompt-builder";
import { getStudentProfile } from "@/lib/supabase/profile";
import Anthropic from "@anthropic-ai/sdk";

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

interface ChatRequest {
  userId: string;
  message: string;
  tone?: "encouraging" | "formal" | "casual" | "friendly";
  context?: string;
}

export async function POST(request: Request) {
  try {
    const body = await request.json() as ChatRequest;
    const { userId, message, tone = "encouraging", context } = body;

    // Get student profile
    const profile = await getStudentProfile(userId);

    // Build optimized prompt
    const prompt = buildFullPrompt(profile, message, {
      tone,
      context,
    });

    // Call Claude with built prompt
    const response = await anthropic.messages.create({
      model: "claude-opus-5",
      max_tokens: 1024,
      system: prompt.systemPrompt,
      messages: [{ role: "user", content: prompt.userPrompt }],
    });

    const reply = response.content[0].type === "text" 
      ? response.content[0].text 
      : "";

    return NextResponse.json({ reply });
  } catch (error) {
    console.error("Chat error:", error);
    return NextResponse.json(
      { error: "Failed to process request" },
      { status: 500 }
    );
  }
}
```

---

## Quick Reference

| Use Case | Function | Best For |
|----------|----------|----------|
| General Q&A | `buildFullPrompt()` | Any student question |
| Learning Plan | `buildRoadmapPrompt()` | Structured learning paths |
| Assessment | `buildQuizPrompt()` | Testing knowledge |
| Budget Help | `buildBudgetPrompt()` | Spending advice |
| Career Advice | `buildCareerPrompt()` | Goal-related guidance |
| Conversations | `buildSystemPromptOnly()` | Multi-turn chats |
| Question Only | `buildUserPromptOnly()` | Formatting questions |

---

## Performance Tips

1. **Fetch profile once** - Get profile at session start, reuse
2. **Reuse system prompt** - For conversations, build system once
3. **Specialize builders** - Use `buildRoadmapPrompt()` instead of custom instructions
4. **Add context** - Better answers with specific context
5. **Choose tone wisely** - Formal for quizzes, friendly for mentoring

---

## Troubleshooting

**Q: Prompt is too long**
A: Use `buildSystemPromptOnly()` for multi-turn conversations to reuse the system prompt

**Q: Response not personalized enough**
A: Add `context` parameter with more details: `{ context: "I have exams next month..." }`

**Q: Need different tone**
A: Pass tone option: `{ tone: "formal" }` for quizzes, `{ tone: "friendly" }` for mentoring

**Q: Want custom instructions**
A: Use `customInstructions` parameter: `{ customInstructions: "Focus on practical examples" }`
