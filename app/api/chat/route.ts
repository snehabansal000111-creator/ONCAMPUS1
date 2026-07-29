import { NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";
import { createClient } from "@/lib/supabase/server";
import { getStudentProfile } from "@/lib/supabase/profile";
import { getRoadmap } from "@/lib/supabase/roadmap";
import { getProgressSummary } from "@/lib/progress/progress-service";
import { getDailyPlan, getTodaysTasks } from "@/lib/planner/planner-service";
import {
  getRecentChatHistory,
  formatChatHistoryForPrompt,
  saveChatMessage,
} from "@/lib/supabase/chat-history";
import { buildComprehensiveSystemPrompt, buildComprehensiveUserPrompt } from "@/lib/prompt-builder";
import { analyzeSkillGaps } from "@/lib/skill-gap-analyzer";
import { generateTodaysMentor } from "@/lib/mentor/proactive-mentor";
import { currentStudent } from "@/lib/mock-data";

interface ChatRequest {
  message: string;
}

interface ChatResponse {
  reply?: string;
  error?: string;
}

// Comprehensive student context interface
interface StudentContext {
  profile: any;
  roadmap: any;
  dailyPlan: any;
  todaysTasks: any[];
  progressSummary: any;
  recentQuizzes: any[];
  conversationHistory: string;
  skillGapAnalysis?: any;
  dailyMentorGuidance?: any;
}

// Validate API key exists
if (!process.env.ANTHROPIC_API_KEY) {
  console.error("CRITICAL: ANTHROPIC_API_KEY is not set in environment variables");
}

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY || "",
});

/**
 * Fetches all available student context in parallel
 */
async function fetchStudentContext(userId: string): Promise<StudentContext> {
  const supabase = await createClient();

  try {
    // Fetch quizzes separately with proper error handling
    const fetchQuizzes = async () => {
      try {
        const { data } = await supabase
          .from("quizzes")
          .select("*")
          .eq("user_id", userId)
          .order("created_at", { ascending: false })
          .limit(3);
        return data || [];
      } catch (error) {
        return [];
      }
    };

    // Fetch conversation history
    const fetchConversationHistory = async () => {
      try {
        const history = await getRecentChatHistory(userId, 5);
        return formatChatHistoryForPrompt(history);
      } catch (error) {
        console.log("Could not fetch conversation history:", error);
        return "No previous conversations yet.";
      }
    };

    const [
      profile,
      roadmap,
      dailyPlan,
      todaysTasks,
      progressSummary,
      quizzes,
      conversationHistory,
    ] = await Promise.all([
      getStudentProfile(userId).catch(() => null),
      getRoadmap(userId).catch(() => null),
      getDailyPlan(userId).catch(() => null),
      getTodaysTasks(userId).catch(() => []),
      getProgressSummary(userId).catch(() => null),
      fetchQuizzes(),
      fetchConversationHistory(),
    ]);

    const resolvedProfile = profile || currentStudent;

    // Analyze skill gaps
    let skillGapAnalysis = null;
    try {
      skillGapAnalysis = analyzeSkillGaps(resolvedProfile);
    } catch (error) {
      console.log("Could not analyze skill gaps:", error);
    }

    // Generate daily mentor guidance
    let dailyMentorGuidance = null;
    try {
      dailyMentorGuidance = generateTodaysMentor(
        resolvedProfile,
        roadmap,
        progressSummary,
        todaysTasks || [],
        quizzes || []
      );
    } catch (error) {
      console.log("Could not generate daily mentor guidance:", error);
    }

    return {
      profile: resolvedProfile,
      roadmap,
      dailyPlan,
      todaysTasks: todaysTasks || [],
      progressSummary,
      recentQuizzes: quizzes || [],
      conversationHistory: conversationHistory || "No previous conversations yet.",
      skillGapAnalysis,
      dailyMentorGuidance,
    };
  } catch (error) {
    console.log("Error fetching context, using partial data:", error);
    return {
      profile: currentStudent,
      roadmap: null,
      dailyPlan: null,
      todaysTasks: [],
      progressSummary: null,
      recentQuizzes: [],
      conversationHistory: "No previous conversations yet.",
      skillGapAnalysis: null,
    };
  }
}

/**
 * POST /api/chat
 * Body: { message: string }
 *
 * Returns: { reply: string } — Highly personalized response from Claude
 * Error: { error: string }
 *
 * Enhanced Flow:
 * 1. Get authenticated user ID from Supabase
 * 2. Fetch ALL student context in parallel:
 *    - Profile (career goal, skills, learning style)
 *    - Current Roadmap (learning path)
 *    - Daily Plan (today's tasks)
 *    - Progress Summary (completed topics, streak, etc.)
 *    - Quiz Performance (recent scores)
 * 3. Build comprehensive system prompt with all context
 * 4. Claude analyzes complete student picture before responding
 * 5. Return deeply personalized response
 *
 * Fallback: Uses mock data if not configured (development)
 */
export async function POST(request: Request): Promise<NextResponse<ChatResponse>> {
  try {
    let body: unknown;
    try {
      body = await request.json();
    } catch (error) {
      console.error("JSON parse error:", error);
      return NextResponse.json(
        { error: "Invalid JSON in request body" },
        { status: 400 }
      );
    }

    const { message } = body as ChatRequest;

    if (!message || typeof message !== "string") {
      console.error("Invalid message field:", { message, type: typeof message });
      return NextResponse.json(
        { error: "message field is required and must be a string" },
        { status: 400 }
      );
    }

    if (message.trim().length === 0) {
      return NextResponse.json(
        { error: "message cannot be empty" },
        { status: 400 }
      );
    }

    // Get authenticated user (try Supabase, fallback to null if not configured)
    let user: { id: string } | null = null;
    try {
      const supabase = await createClient();
      const {
        data: { user: authUser },
        error: authError,
      } = await supabase.auth.getUser();

      if (!authError && authUser) {
        user = authUser;
      } else {
        console.log("No authenticated user, using mock data for development");
      }
    } catch (supabaseError) {
      console.log("Supabase not configured, using mock data for development:", supabaseError);
    }

    // Fetch comprehensive student context
    let context: StudentContext = {
      profile: currentStudent,
      roadmap: null,
      dailyPlan: null,
      todaysTasks: [],
      progressSummary: null,
      recentQuizzes: [],
      conversationHistory: "No previous conversations yet.",
      skillGapAnalysis: null,
      dailyMentorGuidance: null,
    };

    if (user?.id) {
      context = await fetchStudentContext(user.id);
    }

    // Build static system prompt (reusable across all users)
    const systemPrompt = buildComprehensiveSystemPrompt();

    // Build user prompt with all dynamic student context
    const userPrompt = buildComprehensiveUserPrompt({
      profile: context.profile,
      roadmap: context.roadmap,
      progressSummary: context.progressSummary,
      todaysTasks: context.todaysTasks,
      conversationHistory: context.conversationHistory,
      userQuestion: message,
    });

    // Validate API key before calling Claude
    if (!process.env.ANTHROPIC_API_KEY) {
      console.error("ANTHROPIC_API_KEY is not set");
      return NextResponse.json(
        { error: "API key not configured. Contact administrator." },
        { status: 500 }
      );
    }

    console.log("Calling Claude with comprehensive student context for user:", user?.id || "anonymous");

    // Call Claude with static system prompt and dynamic user context
    let response;
    try {
      response = await anthropic.messages.create({
        model: "claude-opus-5",
        max_tokens: 2048,
        system: systemPrompt,
        messages: [{ role: "user", content: userPrompt }],
      });
    } catch (claudeError) {
      console.error("Claude API call failed:", claudeError);
      throw claudeError;
    }

    const textContent = response.content.find((block) => block.type === "text");
    if (!textContent || textContent.type !== "text") {
      console.error("No text content in Claude response:", response.content);
      return NextResponse.json(
        { error: "No text response from Claude" },
        { status: 500 }
      );
    }

    const reply = textContent.text;

    // Save conversation to history (if authenticated)
    if (user?.id) {
      try {
        await saveChatMessage(user.id, message, reply);
        console.log("Conversation saved to history for user:", user.id);
      } catch (saveError) {
        console.log("Could not save conversation to history:", saveError);
        // Continue - don't fail the response if history saving fails
      }
    }

    return NextResponse.json({ reply });
  } catch (error) {
    // Handle Anthropic API errors
    if (error instanceof Anthropic.APIError) {
      const statusCode = error.status || 500;
      const message =
        error.status === 401
          ? "Invalid ANTHROPIC_API_KEY"
          : error.status === 429
            ? "Rate limited by Claude API"
            : error.status === 400
              ? "Invalid request to Claude API"
              : `Claude API error: ${error.message}`;

      console.error("Anthropic API error:", message);
      return NextResponse.json({ error: message }, { status: statusCode });
    }

    console.error("Unexpected error in chat route:", error);
    return NextResponse.json(
      { error: "Failed to get response from assistant. Please try again." },
      { status: 500 }
    );
  }
}
