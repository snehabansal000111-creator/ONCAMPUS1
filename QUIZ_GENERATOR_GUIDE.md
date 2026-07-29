# Quiz Generator - Complete Guide

## Overview

The Quiz Generator creates personalized, adaptive quizzes using Claude AI. Each quiz includes:
- **3 Multiple Choice Questions (MCQ)**
- **2 Coding Questions**
- **2 Short Answer Questions**

Quizzes are tailored to the student's level, roadmap stage, and career goals.

## Features

✅ **3 Question Types** — MCQ, Coding, Short Answer  
✅ **3 Difficulty Levels** — Easy, Medium, Hard  
✅ **Personalized** — Tailored to student profile  
✅ **Roadmap Integration** — Can reference current roadmap stage  
✅ **Supabase Storage** — Quizzes saved for later access  
✅ **Claude-Powered** — Uses Claude Opus 5 for generation  

## Architecture

```
POST /api/quiz/generate
    ↓
1. Get authenticated user
2. Fetch student profile
3. Call generateQuiz(profile, topic, difficulty, roadmapStage)
    ↓ (Claude generates JSON with 7 questions)
4. Save to Supabase with saveQuiz()
5. Return structured quiz
```

## API Reference

### Generate Quiz

**Endpoint:** `POST /api/quiz/generate`

**Request:**
```json
{
  "topic": "JavaScript",
  "difficulty": "medium",
  "roadmapStage": "beginner",
  "roadmapId": "optional-uuid"
}
```

**Response (Success):**
```json
{
  "quiz": {
    "id": "uuid",
    "user_id": "uuid",
    "topic": "JavaScript",
    "difficulty": "medium",
    "totalQuestions": 7,
    "questions": [
      {
        "id": "q1",
        "type": "mcq",
        "difficulty": "medium",
        "topic": "JavaScript",
        "question": "What is the output?",
        "options": [
          {"id": "a", "text": "option 1", "isCorrect": true},
          {"id": "b", "text": "option 2", "isCorrect": false}
        ],
        "explanation": "..."
      },
      {
        "id": "q2",
        "type": "coding",
        "difficulty": "medium",
        "topic": "Arrays",
        "question": "Write a function...",
        "description": "...",
        "examples": [{"input": "...", "output": "..."}],
        "testCases": [...],
        "boilerplate": "function solution(arr) {\n  // write code\n}",
        "explanation": "..."
      },
      {
        "id": "q3",
        "type": "short_answer",
        "difficulty": "medium",
        "topic": "Concepts",
        "question": "Explain...",
        "keyPoints": ["point 1", "point 2"],
        "sampleAnswer": "...",
        "explanation": "..."
      }
    ],
    "created_at": "2026-07-29T...",
    "updated_at": "2026-07-29T..."
  }
}
```

## Question Types

### Multiple Choice Question (MCQ)

```json
{
  "id": "q1",
  "type": "mcq",
  "difficulty": "medium",
  "topic": "React",
  "question": "What is the correct way to pass data from parent to child?",
  "options": [
    {"id": "a", "text": "Using props", "isCorrect": true},
    {"id": "b", "text": "Using state", "isCorrect": false},
    {"id": "c", "text": "Using context directly", "isCorrect": false},
    {"id": "d", "text": "Using refs", "isCorrect": false}
  ],
  "explanation": "Props are the correct way to pass data from parent to child components in React."
}
```

### Coding Question

```json
{
  "id": "q2",
  "type": "coding",
  "difficulty": "medium",
  "topic": "JavaScript",
  "question": "Reverse an Array",
  "description": "Write a function that reverses an array in place and returns it.",
  "examples": [
    {"input": "[1, 2, 3]", "output": "[3, 2, 1]"},
    {"input": "['a', 'b', 'c']", "output": "['c', 'b', 'a']"}
  ],
  "testCases": [
    {"input": "[1, 2, 3, 4, 5]", "expectedOutput": "[5, 4, 3, 2, 1]"},
    {"input": "[]", "expectedOutput": "[]"}
  ],
  "boilerplate": "function reverseArray(arr) {\n  // Write your solution\n  return arr;\n}",
  "explanation": "The solution uses the built-in reverse() method or a two-pointer approach..."
}
```

### Short Answer Question

```json
{
  "id": "q3",
  "type": "short_answer",
  "difficulty": "medium",
  "topic": "Concepts",
  "question": "What is the difference between 'var' and 'let' in JavaScript?",
  "keyPoints": [
    "var is function-scoped, let is block-scoped",
    "let doesn't allow redeclaration in the same scope",
    "let doesn't hoist to the top of the scope"
  ],
  "sampleAnswer": "var is function-scoped while let is block-scoped. This means let respects boundaries of blocks like { }, if statements, and loops. Additionally, let doesn't allow redeclaration in the same scope and has a 'temporal dead zone' before the declaration.",
  "explanation": "Understanding scope differences is fundamental to modern JavaScript programming."
}
```

## Difficulty Levels

| Level | Characteristics |
|-------|-----------------|
| **Easy** | Fundamental concepts, simple syntax, basic logic |
| **Medium** | Combined concepts, moderate problem-solving, real-world scenarios |
| **Hard** | Advanced topics, complex algorithms, edge cases, optimization |

## Personalization

Each quiz is personalized based on:

| Profile Data | How It's Used |
|--------------|---------------|
| **Skills** | Coding questions use languages/frameworks they know |
| **Learning Style** | MCQs include visual explanations for visual learners |
| **Career Goal** | Questions relevant to their professional path |
| **Interests** | Examples and contexts match their interests |
| **Roadmap Stage** | Questions match current learning phase |

## Usage Examples

### Example 1: Generate Easy JavaScript Quiz

```bash
curl -X POST http://localhost:3000/api/quiz/generate \
  -H "Content-Type: application/json" \
  -d '{
    "topic": "JavaScript Basics",
    "difficulty": "easy"
  }'
```

### Example 2: Medium Level Quiz at Intermediate Stage

```bash
curl -X POST http://localhost:3000/api/quiz/generate \
  -H "Content-Type: application/json" \
  -d '{
    "topic": "React",
    "difficulty": "medium",
    "roadmapStage": "intermediate"
  }'
```

### Example 3: Hard Quiz from Roadmap

```bash
curl -X POST http://localhost:3000/api/quiz/generate \
  -H "Content-Type: application/json" \
  -d '{
    "topic": "System Design",
    "difficulty": "hard",
    "roadmapStage": "advanced",
    "roadmapId": "uuid-of-roadmap"
  }'
```

### Example 4: From Frontend (TypeScript)

```typescript
async function generateQuiz(
  topic: string,
  difficulty: "easy" | "medium" | "hard"
) {
  const response = await fetch('/api/quiz/generate', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ topic, difficulty }),
  });

  const data = await response.json();
  
  if (data.error) {
    console.error('Failed to generate quiz:', data.error);
    return null;
  }

  return data.quiz;
}

// Usage
const quiz = await generateQuiz('React Hooks', 'medium');
console.log(`Generated quiz with ${quiz.totalQuestions} questions`);
```

## Quiz Structure

```typescript
interface Quiz {
  id: string;
  user_id: string;
  roadmap_id?: string;  // Optional reference to roadmap
  topic: string;
  difficulty: "easy" | "medium" | "hard";
  questions: Question[];
  totalQuestions: number;
  created_at: string;
  updated_at: string;
}

type Question = MCQQuestion | CodingQuestion | ShortAnswerQuestion;
```

## Database Schema

Quizzes stored in Supabase `quizzes` table:

```sql
id                UUID (primary key)
user_id           UUID (foreign key to users)
roadmap_id        UUID (optional, foreign key to roadmaps)
topic             VARCHAR(255)
difficulty        VARCHAR(20) - easy|medium|hard
total_questions   INTEGER
questions         JSONB (entire question array)
created_at        TIMESTAMP
updated_at        TIMESTAMP
```

## Implementation Details

### File: `lib/supabase/quiz.ts`

**Functions:**

1. **`generateQuiz(profile, topic, difficulty, roadmapStage?)`**
   - Takes student profile, topic, difficulty level
   - Calls Claude to generate 7 questions
   - Returns structured quiz with mixed question types

2. **`saveQuiz(userId, quiz, roadmapId?)`**
   - Saves quiz to Supabase
   - Links to roadmap if provided
   - Returns saved quiz with ID and timestamps

3. **`getQuiz(quizId, userId)`**
   - Retrieves specific quiz
   - Verifies user ownership
   - Returns quiz or null

4. **`getUserQuizzes(userId)`**
   - Gets all quizzes for user
   - Sorted by creation date (newest first)
   - Returns array of quizzes

### File: `app/api/quiz/generate/route.ts`

POST endpoint that:
- Validates topic and difficulty
- Gets authenticated user
- Fetches student profile
- Generates quiz with Claude
- Saves to Supabase
- Returns quiz

## Setup Instructions

### 1. Update Supabase Schema

Run SQL from `QUIZ_SCHEMA.sql`:

```bash
# Copy all SQL from QUIZ_SCHEMA.sql
# Paste in Supabase → SQL Editor
# Execute
```

### 2. Test the API

```bash
curl -X POST http://localhost:3000/api/quiz/generate \
  -H "Content-Type: application/json" \
  -d '{"topic": "JavaScript", "difficulty": "easy"}'
```

### 3. Verify

- Response includes `quiz` object
- Quiz has `totalQuestions` and `questions` array
- Questions include MCQs, coding, and short answer types
- Can view in Supabase dashboard

## Error Handling

| Error | Cause | Fix |
|-------|-------|-----|
| "topic cannot be empty" | Empty topic | Provide non-empty topic |
| "difficulty must be: easy, medium, or hard" | Invalid difficulty | Use valid difficulty |
| "Failed to generate quiz" | Claude API error | Check API key, rate limits |
| "Failed to save quiz" | Supabase error | Check Supabase connection |

## Question Distribution

### Easy Difficulty
- 3 MCQ (basic concepts)
- 1 Coding (simple algorithm)
- 1 Short Answer (definition)
- Total: 5 questions

### Medium Difficulty
- 3 MCQ (combined concepts)
- 2 Coding (moderate problems)
- 2 Short Answer (explanations)
- Total: 7 questions

### Hard Difficulty
- 3 MCQ (advanced scenarios)
- 2 Coding (complex algorithms)
- 2 Short Answer (deep understanding)
- Total: 7 questions

## Token Usage

Per quiz generation:
- System prompt: ~1500 tokens
- User prompt: ~600 tokens
- Claude response: ~3000-4000 tokens
- **Total:** ~5100-6100 tokens per quiz

## What Gets Generated

Claude generates quizzes with:

✅ **Accurate MCQs**
- 4 options per question
- Clear correct answer
- Educational explanations

✅ **Functional Coding Problems**
- Clear problem statement
- Multiple test cases
- Boilerplate code
- Solution explanations

✅ **Thoughtful Short Answers**
- Key points for grading
- Sample complete answer
- Why it matters

## Limitations

❌ Does NOT grade quizzes automatically  
❌ Does NOT provide progress tracking (separate feature)  
❌ Does NOT generate hints  
❌ Does NOT modify frontend UI  

## Future Enhancements

- Adaptive difficulty based on performance
- Quiz feedback and scoring system
- Hint system for coding questions
- Spaced repetition based on performance
- Quiz history and analytics

## Status

✅ Quiz generation complete  
✅ Multiple question types working  
✅ Difficulty levels implemented  
✅ Supabase storage ready  
✅ API route functional  
✅ Error handling in place  

**Ready for use!** 🚀
