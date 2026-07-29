# Prompt Builder - Reusable Prompt Generation

## Overview

The Prompt Builder combines student profiles, user questions, and system instructions into optimized Claude prompts. It ensures consistent, personalized context across all AI interactions.

## Features

✅ **Profile Integration** — Automatically includes student context (skills, goals, interests, learning style)

✅ **Flexible Customization** — Support for custom instructions and different tones

✅ **Specialized Builders** — Pre-configured prompts for roadmaps, quizzes, budgets, and career advice

✅ **Reusable Prompts** — Build system prompts once, use across multiple messages

✅ **Debug Utilities** — Inspect generated prompts for development

## Core Functions

### `buildFullPrompt(profile, question, options): BuiltPrompt`

Combines profile, question, and system instructions into a complete prompt pair.

**Parameters:**
```typescript
profile: StudentProfile          // Student's profile data
question: string                 // The user's question
options?: {
  customInstructions?: string   // Additional instructions for Claude
  context?: string              // Extra context for the question
  tone?: "encouraging" | "formal" | "casual" | "friendly"
}
```

**Returns:**
```typescript
{
  systemPrompt: string;  // For Claude's system parameter
  userPrompt: string;    // For user message content
}
```

**Example:**

```typescript
import { buildFullPrompt } from "@/lib/prompt-builder";
import { getStudentProfile } from "@/lib/supabase/profile";

const profile = await getStudentProfile(userId);

const prompt = buildFullPrompt(profile, "How should I learn React?", {
  customInstructions: "Prioritize hands-on examples",
  tone: "encouraging",
});

// Use with Claude API
const response = await anthropic.messages.create({
  model: "claude-opus-5",
  max_tokens: 1024,
  system: prompt.systemPrompt,
  messages: [{ role: "user", content: prompt.userPrompt }],
});
```

### `buildSystemPromptOnly(profile, customInstructions?, tone)`

Builds just the system prompt for reuse across multiple messages in a conversation.

**Example:**

```typescript
const systemPrompt = buildSystemPromptOnly(profile);

// Use in a multi-turn conversation
const messages = [
  { role: "user", content: "What should I learn next?" },
];

// First message
let response = await anthropic.messages.create({
  model: "claude-opus-5",
  system: systemPrompt,
  messages: messages,
});

// Continue conversation - systemPrompt stays the same
messages.push({ role: "assistant", content: response.content[0].text });
messages.push({ role: "user", content: "Tell me more about React" });

response = await anthropic.messages.create({
  model: "claude-opus-5",
  system: systemPrompt,
  messages: messages,
});
```

### `buildUserPromptOnly(profile, question, context?)`

Formats a user question with student context.

**Example:**

```typescript
const formattedQuestion = buildUserPromptOnly(
  profile,
  "How should I optimize my study schedule?",
  "I have 3 hours per day available"
);
```

## Specialized Builders

### `buildRoadmapPrompt(profile, topic, duration)`

Generates prompts for creating personalized learning roadmaps.

**Parameters:**
```typescript
profile: StudentProfile
topic: string                              // e.g., "Web Development"
duration?: "1-week" | "1-month" | "3-month" | "6-month"
```

**Example:**

```typescript
import { buildRoadmapPrompt } from "@/lib/prompt-builder";

const prompt = buildRoadmapPrompt(profile, "Web Development", "3-month");

const response = await anthropic.messages.create({
  model: "claude-opus-5",
  max_tokens: 2048,
  system: prompt.systemPrompt,
  messages: [{ role: "user", content: prompt.userPrompt }],
});

// Claude returns a structured 3-month roadmap personalized to the student
```

### `buildQuizPrompt(profile, topic, difficulty)`

Generates prompts for creating personalized quizzes/assessments.

**Parameters:**
```typescript
profile: StudentProfile
topic: string                    // e.g., "JavaScript Arrays"
difficulty?: "easy" | "medium" | "hard"
```

**Example:**

```typescript
import { buildQuizPrompt } from "@/lib/prompt-builder";

const prompt = buildQuizPrompt(profile, "JavaScript Arrays", "medium");

const response = await anthropic.messages.create({
  model: "claude-opus-5",
  max_tokens: 1024,
  system: prompt.systemPrompt,
  messages: [{ role: "user", content: prompt.userPrompt }],
});

// Claude returns a personalized quiz with 8 questions
```

### `buildBudgetPrompt(profile, spendingContext)`

Generates prompts for budget and spending recommendations.

**Parameters:**
```typescript
profile: StudentProfile
spendingContext: string  // e.g., "I'm spending too much on food"
```

**Example:**

```typescript
import { buildBudgetPrompt } from "@/lib/prompt-builder";

const prompt = buildBudgetPrompt(
  profile,
  "I spent ₹4000 on food last week, but my budget is ₹12000/month"
);

const response = await anthropic.messages.create({
  model: "claude-opus-5",
  max_tokens: 1024,
  system: prompt.systemPrompt,
  messages: [{ role: "user", content: prompt.userPrompt }],
});

// Claude provides personalized spending recommendations
```

### `buildCareerPrompt(profile, question)`

Generates prompts for career mentorship and guidance.

**Parameters:**
```typescript
profile: StudentProfile
question: string  // Career-related question
```

**Example:**

```typescript
import { buildCareerPrompt } from "@/lib/prompt-builder";

const prompt = buildCareerPrompt(
  profile,
  "What skills should I focus on to become a frontend engineer?"
);

const response = await anthropic.messages.create({
  model: "claude-opus-5",
  max_tokens: 1024,
  system: prompt.systemPrompt,
  messages: [{ role: "user", content: prompt.userPrompt }],
});

// Claude provides mentorship tailored to their career goal
```

## What's Included in System Prompt

The system prompt automatically includes:

✅ **Student Identity**
- Name
- Year and branch
- Profile summary

✅ **Background Knowledge**
- Current skills
- What they already know

✅ **Career Context**
- Career goal
- Career interests
- Budget for learning

✅ **Learning Preferences**
- Learning style (visual/reading/hands-on/mixed)
- Daily study hours
- Budget constraints

✅ **Communication Style**
- Tailored tone
- Appropriate depth of explanation
- Relevant examples

## Tone Options

| Tone | Usage | Style |
|------|-------|-------|
| `encouraging` | Default, mentoring, learning | Supportive, celebratory, constructive |
| `formal` | Academic content, quizzes | Professional, structured, technical |
| `casual` | General discussion | Conversational, relaxed |
| `friendly` | Budget advice, career chat | Warm, approachable, personable |

## Integration Examples

### With Claude API Route

```typescript
// app/api/chat/route.ts
import { buildFullPrompt } from "@/lib/prompt-builder";
import { getStudentProfile } from "@/lib/supabase/profile";
import { askAssistant } from "@/lib/claude";

export async function POST(request: Request) {
  const { userId, question } = await request.json();

  try {
    const profile = await getStudentProfile(userId);
    const prompt = buildFullPrompt(profile, question);

    const response = await anthropic.messages.create({
      model: "claude-opus-5",
      max_tokens: 1024,
      system: prompt.systemPrompt,
      messages: [{ role: "user", content: prompt.userPrompt }],
    });

    return NextResponse.json({ reply: response.content[0].text });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}
```

### With Assistant Chat Page

```typescript
// In app/dashboard/assistant/page.tsx (Server Action)
"use server"

import { buildFullPrompt } from "@/lib/prompt-builder";
import { getStudentProfile } from "@/lib/supabase/profile";

export async function getAssistantResponse(userId: string, question: string) {
  const profile = await getStudentProfile(userId);
  const prompt = buildFullPrompt(profile, question, {
    tone: "friendly",
  });

  // Send to Claude API...
}
```

### Multi-Turn Conversation

```typescript
// Maintain conversation history with same system prompt
const profile = await getStudentProfile(userId);
const systemPrompt = buildSystemPromptOnly(profile);

const messages = [];

// First question
let userPrompt = buildUserPromptOnly(profile, "What should I learn?");
messages.push({ role: "user", content: userPrompt });

let response = await claudeAPI(systemPrompt, messages);
messages.push({ role: "assistant", content: response });

// Follow-up question - same systemPrompt
userPrompt = buildUserPromptOnly(profile, "Can you give me a specific roadmap?");
messages.push({ role: "user", content: userPrompt });

response = await claudeAPI(systemPrompt, messages);
// systemPrompt stays consistent throughout conversation
```

## Debug Utilities

### `inspectPrompt(prompt)`

Prints the complete prompt structure for inspection.

**Example:**

```typescript
import { buildFullPrompt, inspectPrompt } from "@/lib/prompt-builder";

const prompt = buildFullPrompt(profile, "How do I learn React?");
inspectPrompt(prompt);

// Output:
// === SYSTEM PROMPT ===
// You are assisting Riya Sharma, a 1st Year student in Computer Science.
// ...
//
// === USER PROMPT ===
// Question from Riya Sharma:
// How do I learn React?
//
// === FULL PROMPT FOR CLAUDE ===
// POST /api/messages
// {
//   "model": "claude-opus-5",
//   ...
// }
```

## Best Practices

### 1. **Fetch Profile Once**
```typescript
// ✅ Good: Fetch profile once, reuse for multiple prompts
const profile = await getStudentProfile(userId);
const prompt1 = buildFullPrompt(profile, question1);
const prompt2 = buildFullPrompt(profile, question2);

// ❌ Bad: Fetching profile for each prompt
const prompt1 = buildFullPrompt(await getStudentProfile(userId), question1);
const prompt2 = buildFullPrompt(await getStudentProfile(userId), question2);
```

### 2. **Reuse System Prompt in Conversations**
```typescript
// ✅ Good: Build once, use for multi-turn conversation
const systemPrompt = buildSystemPromptOnly(profile);
messages.push({ role: "user", content: userQuestion });
const response1 = await claude(systemPrompt, messages);
messages.push({ role: "assistant", content: response1 });
messages.push({ role: "user", content: followUpQuestion });
const response2 = await claude(systemPrompt, messages);

// ❌ Bad: Rebuilding system prompt each time
const response1 = await claude(buildSystemPromptOnly(profile), [message1]);
const response2 = await claude(buildSystemPromptOnly(profile), [message1, message2]);
```

### 3. **Use Specialized Builders for Complex Prompts**
```typescript
// ✅ Good: Use specialized builder for roadmap
const prompt = buildRoadmapPrompt(profile, "Web Development", "3-month");

// Less ideal: Writing custom instructions every time
const prompt = buildFullPrompt(profile, "Create a roadmap...", {
  customInstructions: "You are creating a personalized learning roadmap...",
});
```

### 4. **Add Context for Better Responses**
```typescript
// ✅ Better: Provide additional context
const prompt = buildFullPrompt(profile, "Help me optimize my study schedule", {
  context: "I have exams next month and need to balance web dev with DSA",
  tone: "encouraging",
});

// Less effective: Generic question
const prompt = buildFullPrompt(profile, "Help me optimize my study schedule");
```

## Type Definitions

```typescript
interface PromptConfig {
  includeProfile?: boolean;      // Always true by default
  includeContext?: boolean;      // Include question context
  tone?: "encouraging" | "formal" | "casual" | "friendly";
  detail?: "concise" | "balanced" | "detailed";
}

interface BuiltPrompt {
  systemPrompt: string;  // For Claude's system parameter
  userPrompt: string;    // For user message content
}
```

## Performance Notes

- **System Prompt Size**: ~500-800 tokens per prompt (includes full profile context)
- **User Prompt Size**: Varies based on question (typically 100-500 tokens)
- **Total Tokens**: Plan for ~1500+ tokens total when using full profile context
- **Reuse**: Use `buildSystemPromptOnly()` to avoid rebuilding for multi-turn conversations

## Next Steps

The Prompt Builder is ready to use in:
- Claude API integration
- Chat interface
- Roadmap generation
- Quiz creation
- Budget recommendations
- Career mentorship
