import Anthropic from "@anthropic-ai/sdk";
import type { StudentProfile } from "@/types";

if (!process.env.ANTHROPIC_API_KEY) {
  throw new Error("ANTHROPIC_API_KEY environment variable is not set");
}

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

function buildSystemPrompt(profile: StudentProfile): string {
  return `You are the ONCampus learning assistant for ${profile.name}, a ${profile.year} ${profile.branch} student.
Career goal: ${profile.careerGoal}. Learning style: ${profile.learningStyle}.
Known skills: ${profile.skills.join(", ") || "none yet"}.
Interests: ${profile.interests.join(", ")}.
Always tailor recommendations to this profile. Be specific, concise, and encouraging. When asked what to learn next, sequence it relative to what the student already knows.`;
}

export class AnthropicError extends Error {
  constructor(
    message: string,
    public statusCode: number = 500,
    public originalError?: unknown
  ) {
    super(message);
    this.name = "AnthropicError";
  }
}

export async function askAssistant(
  profile: StudentProfile,
  message: string
): Promise<string> {
  try {
    const response = await anthropic.messages.create({
      model: "claude-opus-5",
      max_tokens: 1024,
      system: buildSystemPrompt(profile),
      messages: [{ role: "user", content: message }],
    });

    const textBlock = response.content.find((block) => block.type === "text");
    if (!textBlock || textBlock.type !== "text") {
      throw new AnthropicError(
        "No text response from Claude API",
        500
      );
    }

    return textBlock.text;
  } catch (error) {
    if (error instanceof AnthropicError) {
      throw error;
    }

    // Handle Anthropic SDK errors
    if (error instanceof Error) {
      const errorMsg = error.message || "Unknown error";

      // Check for common error patterns in message
      if (errorMsg.includes("401") || errorMsg.includes("authentication") || errorMsg.includes("ANTHROPIC_API_KEY")) {
        throw new AnthropicError("Invalid ANTHROPIC_API_KEY", 401, error);
      }

      if (errorMsg.includes("429") || errorMsg.includes("rate_limit")) {
        throw new AnthropicError("Rate limited by Claude API", 429, error);
      }

      if (errorMsg.includes("400") || errorMsg.includes("invalid_request")) {
        throw new AnthropicError("Invalid request to Claude API", 400, error);
      }

      // For any other error from the SDK
      if (errorMsg.includes("Error") || errorMsg.includes("error")) {
        throw new AnthropicError(`Claude API error: ${errorMsg}`, 500, error);
      }
    }

    throw new AnthropicError(
      "Unexpected error calling Claude API",
      500,
      error
    );
  }
}
