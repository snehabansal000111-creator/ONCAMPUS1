import Anthropic from "@anthropic-ai/sdk";
import type { StudentProfile } from "@/types";

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

/**
 * Builds a system prompt grounded in the student's stored profile so the
 * assistant answers with context instead of generic advice.
 */
function buildSystemPrompt(profile: StudentProfile) {
  return `You are the ONCampus learning assistant for ${profile.name}, a ${profile.year} ${profile.branch} student.
Career goal: ${profile.careerGoal}. Learning style: ${profile.learningStyle}.
Known skills: ${profile.skills.join(", ") || "none yet"}.
Interests: ${profile.interests.join(", ")}.
Always tailor recommendations to this profile. Be specific, concise, and encouraging. When asked what to learn next, sequence it relative to what the student already knows.`;
}

export async function askAssistant(profile: StudentProfile, message: string) {
  const response = await anthropic.messages.create({
    model: "claude-sonnet-4-6",
    max_tokens: 1024,
    system: buildSystemPrompt(profile),
    messages: [{ role: "user", content: message }],
  });

  const textBlock = response.content.find((block) => block.type === "text");
  return textBlock && "text" in textBlock ? textBlock.text : "";
}
