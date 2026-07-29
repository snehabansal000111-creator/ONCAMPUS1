import type { StudentProfile } from "@/types";

export interface PromptConfig {
  includeProfile?: boolean;
  includeContext?: boolean;
  tone?: "encouraging" | "formal" | "casual" | "friendly";
  detail?: "concise" | "balanced" | "detailed";
}

interface BuiltPrompt {
  systemPrompt: string;
  userPrompt: string;
}

function buildProfileContext(profile: StudentProfile): string {
  const skillsList = profile.skills.length > 0
    ? profile.skills.join(", ")
    : "foundational skills only";

  const interestsList = profile.interests.length > 0
    ? profile.interests.join(", ")
    : "general topics";

  const learningStyleDesc = {
    visual: "visual learner who benefits from diagrams, videos, and mind maps",
    reading: "reader who learns best through documentation and articles",
    "hands-on": "hands-on learner who learns by doing and building projects",
    mixed: "flexible learner who benefits from a mix of approaches",
  }[profile.learningStyle] || "diverse learner";

  return `You are assisting ${profile.name}, a ${profile.year} student in ${profile.branch}.

## Student Context
- **Career Goal:** ${profile.careerGoal}
- **Learning Style:** ${learningStyleDesc}
- **Current Skills:** ${skillsList}
- **Interests:** ${interestsList}
- **Study Commitment:** ${profile.dailyStudyHours} hours per day
- **Budget:** ₹${profile.monthlyBudget}/month${profile.background ? `\n- **Background:** ${profile.background}` : ""}

## Your Role
- Tailor all explanations to ${profile.name}'s current skill level
- Prioritize topics aligned with their career goal (${profile.careerGoal})
- Adapt your teaching style to their preference for ${profile.learningStyle} learning
- Be encouraging and specific in recommendations
- Reference their interests (${interestsList}) when relevant
- Suggest learning approaches that fit their ${profile.dailyStudyHours}-hour daily study commitment`;
}

function buildSystemPrompt(
  profile: StudentProfile,
  customInstructions?: string,
  tone: "encouraging" | "formal" | "casual" | "friendly" = "encouraging"
): string {
  const profileContext = buildProfileContext(profile);

  const toneInstructions = {
    encouraging: "Be supportive, celebrate progress, and provide constructive guidance.",
    formal: "Provide professional, structured, and academic responses.",
    casual: "Keep the tone conversational and relaxed.",
    friendly: "Be warm, approachable, and personable in your responses.",
  }[tone];

  const basePrompt = `${profileContext}

## Communication Guidelines
${toneInstructions}
- Keep explanations concise but thorough
- Use examples when helpful
- Ask clarifying questions if needed
- Suggest resources when appropriate`;

  return customInstructions
    ? `${basePrompt}\n\n## Additional Instructions\n${customInstructions}`
    : basePrompt;
}

function buildUserPrompt(
  profile: StudentProfile,
  userQuestion: string,
  context?: string
): string {
  const contextPart = context ? `\n\nAdditional context:\n${context}` : "";

  return `Question from ${profile.name}:\n\n${userQuestion}${contextPart}`;
}

export function buildFullPrompt(
  profile: StudentProfile,
  userQuestion: string,
  options: {
    customInstructions?: string;
    context?: string;
    tone?: "encouraging" | "formal" | "casual" | "friendly";
  } = {}
): BuiltPrompt {
  const {
    customInstructions,
    context,
    tone = "encouraging",
  } = options;

  const systemPrompt = buildSystemPrompt(profile, customInstructions, tone);
  const userPrompt = buildUserPrompt(profile, userQuestion, context);

  return {
    systemPrompt,
    userPrompt,
  };
}

export function buildSystemPromptOnly(
  profile: StudentProfile,
  customInstructions?: string,
  tone: "encouraging" | "formal" | "casual" | "friendly" = "encouraging"
): string {
  return buildSystemPrompt(profile, customInstructions, tone);
}

export function buildUserPromptOnly(
  profile: StudentProfile,
  userQuestion: string,
  context?: string
): string {
  return buildUserPrompt(profile, userQuestion, context);
}

export function buildRoadmapPrompt(
  profile: StudentProfile,
  topic: string,
  duration: "1-week" | "1-month" | "3-month" | "6-month" = "1-month"
): BuiltPrompt {
  const instructions = `You are creating a personalized learning roadmap for this student.

## Roadmap Requirements
- Duration: ${duration}
- Topic: ${topic}
- Align with their career goal: ${profile.careerGoal}
- Match their learning style: ${profile.learningStyle}
- Account for their available time: ${profile.dailyStudyHours} hours/day
- Leverage their existing skills: ${profile.skills.join(", ") || "foundational"}
- Connect to their interests: ${profile.interests.join(", ")}

## Output Format
Provide a structured roadmap with:
1. Clear weekly/daily milestones
2. Specific resources (with estimated time)
3. Hands-on projects or practice activities
4. Checkpoints to measure progress
5. Alternative paths if they get stuck`;

  return buildFullPrompt(profile, `Create a ${duration} learning roadmap for me on ${topic}`, {
    customInstructions: instructions,
    tone: "encouraging",
  });
}

export function buildQuizPrompt(
  profile: StudentProfile,
  topic: string,
  difficulty: "easy" | "medium" | "hard" = "medium"
): BuiltPrompt {
  const instructions = `You are creating a personalized quiz/assessment for this student.

## Quiz Requirements
- Topic: ${topic}
- Difficulty: ${difficulty}
- Number of questions: ${difficulty === "easy" ? "5" : difficulty === "medium" ? "8" : "10"}
- Adapt to their current skills: ${profile.skills.join(", ") || "foundational"}
- Include practical scenarios relevant to: ${profile.interests.join(", ")}
- Align with their learning style: ${profile.learningStyle}

## Output Format
Provide questions in this format:
1. Question text
2. Multiple choice options (A, B, C, D)
3. Correct answer
4. Explanation of the concept`;

  return buildFullPrompt(profile, `Create a ${difficulty} quiz on ${topic}`, {
    customInstructions: instructions,
    tone: "formal",
  });
}

export function buildBudgetPrompt(
  profile: StudentProfile,
  spendingContext: string
): BuiltPrompt {
  const instructions = `You are providing personalized spending recommendations for this student.

## Context
- Monthly budget: ₹${profile.monthlyBudget}
- Career goal: ${profile.careerGoal}
- Interests: ${profile.interests.join(", ")}
- Study hours: ${profile.dailyStudyHours}h/day

## Recommendations Should
1. Prioritize spending aligned with their career goal
2. Suggest cost-effective resources for their learning style
3. Identify unnecessary spending patterns
4. Recommend budgeting for skill-building resources
5. Balance lifestyle with financial responsibility`;

  return buildFullPrompt(profile, `Help me optimize my spending: ${spendingContext}`, {
    customInstructions: instructions,
    tone: "friendly",
  });
}

export function buildMentoringPrompt(
  profile: StudentProfile,
  userQuestion: string,
  currentContext?: {
    recentProgress?: string;
    currentlyLearning?: string;
    challenges?: string[];
    previousTopics?: string[];
  }
): BuiltPrompt {
  const currentLevel = profile.skills.length <= 2
    ? "beginner"
    : profile.skills.length <= 5
    ? "intermediate"
    : "advanced";

  const learningStyleDetails = {
    visual: "uses diagrams, flowcharts, animations, and video content",
    reading: "learns best through articles, documentation, and written examples",
    "hands-on": "prefers learning by doing, building projects, and experimenting",
    mixed: "benefits from combining multiple learning approaches",
  }[profile.learningStyle] || "diverse approaches";

  const contextSection = currentContext
    ? `
## Current Learning Context
${currentContext.recentProgress ? `- **Recent Progress:** ${currentContext.recentProgress}` : ""}
${currentContext.currentlyLearning ? `- **Currently Learning:** ${currentContext.currentlyLearning}` : ""}
${currentContext.challenges && currentContext.challenges.length > 0
  ? `- **Challenges:** ${currentContext.challenges.join(", ")}`
  : ""}
${currentContext.previousTopics && currentContext.previousTopics.length > 0
  ? `- **Previously Covered:** ${currentContext.previousTopics.join(", ")}`
  : ""}`
    : "";

  const instructions = `You are a highly personalized AI mentor for ${profile.name}.

## Understanding This Student

**Career Trajectory:**
- Target Role: ${profile.careerGoal}
- Current Level: ${currentLevel} (with ${profile.skills.length} key skills)
- Study Commitment: ${profile.dailyStudyHours} hours/day
- Learning Approach: ${learningStyleDetails}
- Budget for Learning: ₹${profile.monthlyBudget}/month
- Academic Background: ${profile.background || "General academic foundation"}

**Key Interests:**
${profile.interests.map(i => `- ${i}`).join("\n")}

**Established Skills:**
${profile.skills.map(s => `- ${s}`).join("\n")}

${contextSection}

## Your Mentoring Approach

When responding to ANY question, ALWAYS structure your response with these sections:

### 📌 Current Situation
Analyze ${profile.name}'s current learning position relative to their goals. Reference their current skill level, what they've already mastered, and why this question matters at THEIR stage.

### 🎯 Recommendation
Provide personalized advice specific to ${profile.name}. Explain:
1. WHAT to learn (aligned with ${profile.careerGoal})
2. WHY this recommendation fits their profile
3. WHAT NOT to learn yet (and why it's premature)

### 📅 Next Steps
Provide a 7-day learning plan considering:
- Their ${profile.dailyStudyHours}-hour daily availability
- Their ${learningStyleDetails} preference
- Manageable progression for their current level

### 📚 Resources
Recommend 3-5 specific resources matching:
- Their learning style (${profile.learningStyle})
- Their budget (₹${profile.monthlyBudget}/month)
- Their skill level (${currentLevel})
- Free/affordable options prioritized

### 📝 Practice
Provide concrete practice activities:
- 2-3 hands-on exercises appropriate for their level
- Mini-projects they can complete in ${profile.dailyStudyHours} hours
- Coding challenges if relevant
- Expected time investment per activity

### 🚀 Future Goal
Suggest a 30-day milestone that:
- Builds on current knowledge
- Moves them closer to their "${profile.careerGoal}" goal
- Is achievable with their ${profile.dailyStudyHours}-hour commitment
- Includes a mini-project they can add to portfolio

## Critical Rules

1. **Never Generic:** Avoid standard advice. Every recommendation must reference their profile.
2. **Why This Fits:** Always explain why this specific guidance is suited to THEM.
3. **Current Level Aware:** Tailor complexity to "${currentLevel}" learner.
4. **Budget Conscious:** Suggest mostly free/affordable resources given ₹${profile.monthlyBudget}/month.
5. **Time Realistic:** All recommendations fit within ${profile.dailyStudyHours} hours/day.
6. **Learning Style Matched:** Deliver content in their preferred format (${profile.learningStyle}).
7. **Career Aligned:** Always connect back to "${profile.careerGoal}" goal.
8. **Detailed & Thorough:** Responses should be mentor-level detailed, NOT brief.
9. **Encourage Progression:** Show how this topic/skill moves them toward their goal.
10. **No Assumptions:** Ask clarifying questions if you need more context about their specific situation.`;

  return buildFullPrompt(profile, userQuestion, {
    customInstructions: instructions,
    tone: "encouraging",
  });
}

export function buildDailyGoalPrompt(
  profile: StudentProfile,
  topic: string,
  availableTime: number = profile.dailyStudyHours
): BuiltPrompt {
  const instructions = `You are creating a personalized daily learning goal for ${profile.name}.

## Student Context
- Career Goal: ${profile.careerGoal}
- Learning Style: ${profile.learningStyle}
- Available Time Today: ${availableTime} hours
- Current Skills: ${profile.skills.join(", ") || "foundational"}
- Interests: ${profile.interests.join(", ")}

## Daily Goal Requirements
1. SPECIFIC & MEASURABLE - What exactly will ${profile.name} accomplish today?
2. TIME REALISTIC - Must fit in ${availableTime} hours
3. PROGRESS TRACKING - How will they know they've succeeded?
4. ENGAGING - Incorporate their ${profile.learningStyle} learning style
5. PORTFOLIO BUILDING - Ideally adds to their career goal portfolio

Generate:
- Clear objective (1-2 sentences)
- Step-by-step breakdown with time allocations
- Specific deliverables (code, document, understanding checkpoint)
- 2-3 success metrics
- Quick reflection prompt for end of day`;

  return buildFullPrompt(profile, `Help me set today's learning goal for: ${topic}`, {
    customInstructions: instructions,
    tone: "encouraging",
  });
}

export function buildPracticePrompt(
  profile: StudentProfile,
  topic: string,
  difficulty: "beginner" | "intermediate" | "advanced" = "intermediate"
): BuiltPrompt {
  const instructions = `You are generating personalized practice questions for ${profile.name}.

## Student Profile
- Name: ${profile.name}
- Current Skills: ${profile.skills.join(", ") || "foundational"}
- Learning Style: ${profile.learningStyle}
- Career Goal: ${profile.careerGoal}
- Interests: ${profile.interests.join(", ")}

## Practice Question Guidelines
1. Difficulty: ${difficulty} level
2. Relevance: Connect to ${profile.careerGoal} where possible
3. Style Match: Use ${profile.learningStyle} approach (${profile.learningStyle === "visual" ? "diagrams, flowcharts" : profile.learningStyle === "reading" ? "explanation-based" : profile.learningStyle === "hands-on" ? "coding/building" : "mixed"})
4. Scaffolding: Build progressively from easier to harder
5. Real-World Context: Use examples from ${profile.interests.join(", ")}

Generate:
- 3 practice questions at "${difficulty}" level for "${topic}"
- Each with: question, hints, solution, explanation
- Variety of question types (conceptual, code, applied)
- Expected time per question`;

  return buildFullPrompt(profile, `Generate practice questions on: ${topic}`, {
    customInstructions: instructions,
    tone: "encouraging",
  });
}

export function buildMiniProjectPrompt(
  profile: StudentProfile,
  topic: string,
  durationHours: number = profile.dailyStudyHours
): BuiltPrompt {
  const instructions = `You are designing a personalized mini-project for ${profile.name}.

## Student Context
- Career Goal: ${profile.careerGoal}
- Current Skills: ${profile.skills.join(", ")}
- Learning Style: ${profile.learningStyle}
- Time Available: ${durationHours} hours
- Budget: ₹${profile.monthlyBudget}/month
- Interests: ${profile.interests.join(", ")}

## Mini-Project Design
1. PORTFOLIO WORTHY - Adds credibility to their ${profile.careerGoal} career path
2. SKILL BUILDING - Focuses on topic: "${topic}"
3. TIME APPROPRIATE - Completable in ${durationHours} hours
4. STYLE ALIGNED - Matches their ${profile.learningStyle} learning style
5. FREE RESOURCES - Uses free tools/libraries where possible

Generate:
- Project title and brief description
- Learning objectives (3-5)
- Step-by-step implementation guide
- Resources needed (all free/freemium)
- Success criteria (how to know it's complete)
- Portfolio presentation tip`;

  return buildFullPrompt(profile, `Design a mini-project on: ${topic}`, {
    customInstructions: instructions,
    tone: "encouraging",
  });
}

export function buildCareerPrompt(
  profile: StudentProfile,
  question: string
): BuiltPrompt {
  const instructions = `You are providing career mentorship for this student.

## Student Profile for Mentoring
- Target Role: ${profile.careerGoal}
- Year: ${profile.year}
- Program: ${profile.branch}
- Current Skills: ${profile.skills.join(", ") || "foundational"}
- Key Interests: ${profile.interests.join(", ")}
- Learning Preference: ${profile.learningStyle}

## Mentoring Approach
1. Provide realistic roadmap to their goal
2. Suggest skill gaps to address
3. Recommend projects to build their portfolio
4. Share resources (free/paid, based on budget)
5. Help them network in their field`;

  return buildFullPrompt(profile, question, {
    customInstructions: instructions,
    tone: "encouraging",
  });
}

export function buildComprehensiveSystemPrompt(): string {
  return `You are an AI learning mentor. Your role is to provide personalized, encouraging guidance.

## Identity
You are a supportive mentor who:
- Adapts explanations to the learner's current level
- Provides practical, actionable advice
- Celebrates progress and encourages persistence
- Asks clarifying questions when needed
- Suggests relevant resources

## Behavior
1. **Personalized:** Always tailor responses to the learner's unique situation, not generic advice
2. **Specific:** Reference concrete details about their goals, skills, and constraints
3. **Why-Focused:** Explain WHY your recommendations fit them specifically
4. **Structured:** Organize responses clearly with distinct sections
5. **Encouraging:** Maintain a supportive, motivating tone throughout

## Reasoning Framework
Before responding, consider:
- **Goal Alignment:** Does this recommendation support their career/learning goals?
- **Skill Building:** How does this build on what they already know?
- **Current Level:** Is the difficulty appropriate for their current progress?
- **Time Realistic:** Does this fit their available study time?
- **Style Match:** Does this align with their preferred learning approach?
- **Resource Quality:** Are suggestions practical, affordable, and high-quality?

## Response Structure
Organize substantial responses with:
- **📌 Current Situation** — Acknowledge their specific position and progress
- **🎯 Recommendation** — What to focus on and WHY it fits them
- **📅 Next Steps** — Actionable plan with time allocations
- **📚 Resources** — Specific tools/materials matching their style and budget
- **📝 Practice** — Exercises appropriate for their level
- **🚀 Future Goal** — How this progresses them toward their target

## Tone
- Encouraging and supportive
- Conversational, not robotic
- Respectful of constraints (time, budget, skill level)
- Confident in guidance but humble about limitations
- Celebrate wins, normalize setbacks`;
}

export function buildComprehensiveUserPrompt(context: {
  profile: StudentProfile;
  roadmap?: any;
  progressSummary?: any;
  todaysTasks?: any[];
  conversationHistory?: string;
  userQuestion: string;
}): string {
  const { profile, roadmap, progressSummary, todaysTasks, conversationHistory, userQuestion } = context;

  let userMessage = "";

  userMessage += `## Student Profile\n`;
  userMessage += `- **Name:** ${profile.name}\n`;
  userMessage += `- **Year:** ${profile.year}\n`;
  userMessage += `- **Branch:** ${profile.branch}\n`;
  userMessage += `- **Career Goal:** ${profile.careerGoal}\n`;
  userMessage += `- **Learning Style:** ${profile.learningStyle}\n`;
  userMessage += `- **Current Skills:** ${profile.skills.length > 0 ? profile.skills.join(", ") : "Foundational"}\n`;
  userMessage += `- **Interests:** ${profile.interests.length > 0 ? profile.interests.join(", ") : "General"}\n`;
  userMessage += `- **Daily Study Hours:** ${profile.dailyStudyHours} hours\n`;
  userMessage += `- **Monthly Budget:** ₹${profile.monthlyBudget}\n`;
  if (profile.background) {
    userMessage += `- **Background:** ${profile.background}\n`;
  }

  if (roadmap) {
    userMessage += `\n## Learning Roadmap\n`;
    userMessage += `- **Topic:** ${roadmap.topic || "General"}\n`;
    if (roadmap.beginner?.topics) {
      userMessage += `- **Beginner Topics:** ${roadmap.beginner.topics.slice(0, 3).join(", ")}\n`;
    }
    if (roadmap.intermediate?.topics) {
      userMessage += `- **Intermediate Topics:** ${roadmap.intermediate.topics.slice(0, 3).join(", ")}\n`;
    }
    if (roadmap.advanced?.topics) {
      userMessage += `- **Advanced Topics:** ${roadmap.advanced.topics.slice(0, 3).join(", ")}\n`;
    }
  }

  if (progressSummary) {
    userMessage += `\n## Progress Summary\n`;
    userMessage += `- **Overall Completion:** ${progressSummary.overall_completion_percentage || 0}%\n`;
    if (roadmap) {
      userMessage += `- **Roadmap Progress:** ${progressSummary.roadmap_completion_percentage || 0}%\n`;
    }
    userMessage += `- **Learning Streak:** ${progressSummary.learning_streak_days || 0} days\n`;
    userMessage += `- **Topics Completed:** ${progressSummary.total_topics_completed || 0}\n`;
    userMessage += `- **Quizzes Completed:** ${progressSummary.total_quizzes_completed || 0}\n`;
    userMessage += `- **Projects Completed:** ${progressSummary.total_projects_completed || 0}\n`;
    if (progressSummary.last_activity_date) {
      userMessage += `- **Last Activity:** ${new Date(progressSummary.last_activity_date).toLocaleDateString()}\n`;
    }
  }

  if (todaysTasks && todaysTasks.length > 0) {
    userMessage += `\n## Today's Tasks\n`;
    const completed = todaysTasks.filter(t => t.completed).length;
    userMessage += `- **Status:** ${completed}/${todaysTasks.length} completed\n`;
    todaysTasks.forEach(task => {
      const status = task.completed ? "✓" : "○";
      userMessage += `- [${status}] ${task.title || task.name}\n`;
    });
  }

  if (conversationHistory) {
    userMessage += `\n## Conversation Memory\n`;
    userMessage += conversationHistory;
  }

  userMessage += `\n## Question\n`;
  userMessage += userQuestion;

  return userMessage;
}

export function inspectPrompt(prompt: BuiltPrompt): void {
  console.log("=== SYSTEM PROMPT ===");
  console.log(prompt.systemPrompt);
  console.log("\n=== USER PROMPT ===");
  console.log(prompt.userPrompt);
  console.log("\n=== FULL PROMPT FOR CLAUDE ===");
  console.log("POST /api/messages");
  console.log(JSON.stringify(
    {
      model: "claude-opus-5",
      max_tokens: 1024,
      system: prompt.systemPrompt,
      messages: [{ role: "user", content: prompt.userPrompt }],
    },
    null,
    2
  ));
}
