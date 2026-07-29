import { createClient } from "./server";
import Anthropic from "@anthropic-ai/sdk";
import type { StudentProfile, Quiz, Question, QuizDifficulty } from "@/types";

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY || "",
});

/**
 * Response format from Claude for quiz generation
 */
interface QuizResponse {
  topic: string;
  difficulty: QuizDifficulty;
  questions: Question[];
}

/**
 * Generates a personalized quiz using Claude API.
 * Includes MCQs, Coding Questions, and Short Answer Questions.
 *
 * @param profile - Student's profile from onboarding
 * @param topic - Topic to quiz on
 * @param difficulty - Quiz difficulty (easy, medium, hard)
 * @param roadmapStage - Current roadmap stage (beginner, intermediate, advanced)
 * @returns Generated quiz with mixed question types
 * @throws Error if generation fails
 */
export async function generateQuiz(
  profile: StudentProfile,
  topic: string,
  difficulty: QuizDifficulty,
  roadmapStage?: "beginner" | "intermediate" | "advanced"
): Promise<QuizResponse> {
  if (!topic || topic.trim().length === 0) {
    throw new Error("Topic is required");
  }

  if (!["easy", "medium", "hard"].includes(difficulty)) {
    throw new Error("Invalid difficulty level");
  }

  const systemPrompt = `You are an expert quiz designer creating assessments for students.

Student Profile:
- Name: ${profile.name}
- Year: ${profile.year}
- Branch: ${profile.branch}
- Current Skills: ${profile.skills.join(", ") || "foundational"}
- Learning Style: ${profile.learningStyle}
- Career Goal: ${profile.careerGoal}
- Interests: ${profile.interests.join(", ")}
${roadmapStage ? `- Current Level: ${roadmapStage}` : ""}

Generate a quiz for "${topic}" at "${difficulty}" difficulty level.

Include EXACTLY:
- 3 Multiple Choice Questions (MCQ)
- 2 Coding Questions
- 2 Short Answer Questions

Total: 7 questions

CRITICAL: Return ONLY valid JSON (no markdown, no explanation) with this exact structure:
{
  "topic": "string",
  "difficulty": "easy|medium|hard",
  "questions": [
    {
      "id": "unique-id",
      "type": "mcq",
      "difficulty": "easy|medium|hard",
      "topic": "specific topic",
      "question": "string",
      "options": [
        {"id": "a", "text": "option text", "isCorrect": true},
        {"id": "b", "text": "option text", "isCorrect": false}
      ],
      "explanation": "string explaining correct answer"
    },
    {
      "id": "unique-id",
      "type": "coding",
      "difficulty": "easy|medium|hard",
      "topic": "specific topic",
      "question": "Problem statement",
      "description": "Detailed description of what to solve",
      "examples": [
        {"input": "example input", "output": "expected output"}
      ],
      "testCases": [
        {"input": "test input", "expectedOutput": "expected output"}
      ],
      "boilerplate": "starter code template",
      "explanation": "solution explanation"
    },
    {
      "id": "unique-id",
      "type": "short_answer",
      "difficulty": "easy|medium|hard",
      "topic": "specific topic",
      "question": "Question text",
      "keyPoints": ["key point 1", "key point 2"],
      "sampleAnswer": "complete sample answer",
      "explanation": "why this answer is correct"
    }
  ]
}

Distribution rules:
- EASY: 3 MCQ, 1 Coding, 1 Short Answer
- MEDIUM: 3 MCQ, 2 Coding, 2 Short Answer
- HARD: 3 MCQ, 2 Coding, 2 Short Answer`;

  const userPrompt = `Create a ${difficulty} quiz on "${topic}" for ${profile.name}.

Context:
- They prefer ${profile.learningStyle} learning
- Their goal: ${profile.careerGoal}
- Interests: ${profile.interests.join(", ")}
- Current skills: ${profile.skills.join(", ") || "foundational"}
${roadmapStage ? `- Learning stage: ${roadmapStage} (${roadmapStage === "beginner" ? "foundations" : roadmapStage === "intermediate" ? "advanced concepts" : "expert level"})` : ""}

Make questions:
1. Relevant to their career goal
2. Matching their learning style
3. At the specified difficulty level
4. With clear, actionable answers

Include MCQs with 4 options each, coding challenges with boilerplate code and test cases, and short answer questions with key points.`;

  try {
    const response = await anthropic.messages.create({
      model: "claude-opus-5",
      max_tokens: 8000,
      system: systemPrompt,
      messages: [{ role: "user", content: userPrompt }],
    });

    const textContent = response.content.find((block) => block.type === "text");
    if (!textContent || textContent.type !== "text") {
      throw new Error("No text response from Claude");
    }

    // Parse JSON response
    const jsonText = textContent.text.trim();
    const quizData: QuizResponse = JSON.parse(jsonText);

    // Validate structure
    if (!quizData.questions || !Array.isArray(quizData.questions)) {
      throw new Error("Invalid quiz structure: missing questions");
    }

    if (quizData.questions.length === 0) {
      throw new Error("No questions generated");
    }

    return quizData;
  } catch (error) {
    if (error instanceof SyntaxError) {
      throw new Error(`Failed to parse Claude response as JSON: ${error.message}`);
    }
    if (error instanceof Anthropic.APIError) {
      throw new Error(`Claude API error: ${error.message}`);
    }
    throw error;
  }
}

/**
 * Saves a generated quiz to Supabase.
 *
 * @param userId - Authenticated user's ID
 * @param quiz - Generated quiz to save
 * @param roadmapId - Optional reference to roadmap
 * @returns Saved quiz with ID and timestamps
 * @throws Error if save fails
 */
export async function saveQuiz(
  userId: string,
  quiz: QuizResponse,
  roadmapId?: string
): Promise<Quiz> {
  if (!userId) {
    throw new Error("User ID is required");
  }

  try {
    const supabase = await createClient();

    const { data, error } = await supabase
      .from("quizzes")
      .insert({
        user_id: userId,
        roadmap_id: roadmapId || null,
        topic: quiz.topic,
        difficulty: quiz.difficulty,
        total_questions: quiz.questions.length,
        questions: quiz.questions,
      })
      .select()
      .single();

    if (error) {
      throw new Error(`Failed to save quiz: ${error.message}`);
    }

    if (!data) {
      throw new Error("Failed to save quiz");
    }

    return {
      id: data.id,
      user_id: data.user_id,
      roadmap_id: data.roadmap_id,
      topic: data.topic,
      difficulty: data.difficulty,
      questions: data.questions,
      totalQuestions: data.total_questions,
      created_at: data.created_at,
      updated_at: data.updated_at,
    };
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    }
    throw new Error("Unexpected error saving quiz");
  }
}

/**
 * Retrieves a quiz by ID.
 *
 * @param quizId - Quiz ID
 * @param userId - User ID (for verification)
 * @returns Quiz or null if not found
 * @throws Error if retrieval fails
 */
export async function getQuiz(
  quizId: string,
  userId: string
): Promise<Quiz | null> {
  if (!quizId || !userId) {
    throw new Error("Quiz ID and User ID are required");
  }

  try {
    const supabase = await createClient();

    const { data, error } = await supabase
      .from("quizzes")
      .select("*")
      .eq("id", quizId)
      .eq("user_id", userId)
      .single();

    if (error) {
      if (error.code === "PGRST116") {
        return null;
      }
      throw new Error(`Failed to fetch quiz: ${error.message}`);
    }

    if (!data) {
      return null;
    }

    return {
      id: data.id,
      user_id: data.user_id,
      roadmap_id: data.roadmap_id,
      topic: data.topic,
      difficulty: data.difficulty,
      questions: data.questions,
      totalQuestions: data.total_questions,
      created_at: data.created_at,
      updated_at: data.updated_at,
    };
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    }
    throw new Error("Unexpected error retrieving quiz");
  }
}

/**
 * Gets all quizzes for a user.
 *
 * @param userId - User ID
 * @returns Array of quizzes
 * @throws Error if retrieval fails
 */
export async function getUserQuizzes(userId: string): Promise<Quiz[]> {
  if (!userId) {
    throw new Error("User ID is required");
  }

  try {
    const supabase = await createClient();

    const { data, error } = await supabase
      .from("quizzes")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false });

    if (error) {
      throw new Error(`Failed to fetch quizzes: ${error.message}`);
    }

    if (!data) {
      return [];
    }

    return data.map((q) => ({
      id: q.id,
      user_id: q.user_id,
      roadmap_id: q.roadmap_id,
      topic: q.topic,
      difficulty: q.difficulty,
      questions: q.questions,
      totalQuestions: q.total_questions,
      created_at: q.created_at,
      updated_at: q.updated_at,
    }));
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    }
    throw new Error("Unexpected error retrieving quizzes");
  }
}
