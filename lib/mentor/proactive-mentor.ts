import type { StudentProfile } from "@/types";

/**
 * Proactive Mentor System
 * Generates personalized daily guidance based on student profile and progress
 */

export interface TodaysMentor {
  todaysGoal: {
    title: string;
    description: string;
    whyItMatters: string;
    estimatedTime: number; // minutes
  };
  estimatedStudyTime: {
    dailyCommitment: number; // hours
    suggestedSessions: {
      session: string;
      duration: number; // minutes
      topic: string;
    }[];
    totalMinutes: number;
  };
  recommendedTopic: {
    topic: string;
    phase: string;
    whyRecommended: string;
    prerequisites: string[];
    estimatedTimeToMastery: number; // days
    resourceType: "video" | "article" | "tutorial" | "project" | "quiz";
  };
  miniProject: {
    title: string;
    description: string;
    estimatedTime: number; // minutes
    difficulty: "easy" | "medium" | "hard";
    learningObjectives: string[];
    portfolio: boolean;
    resources: string[];
  };
  quizReminder: {
    hasOutstandingQuizzes: boolean;
    topicsToReview: string[];
    averageScore: number;
    nextQuizTopic?: string;
    motivation: string;
  };
  motivationMessage: {
    message: string;
    tone: "encouraging" | "challenging" | "celebrating" | "nudging";
    personalized: boolean;
    reasons: string[];
  };
  summary: {
    dayTheme: string;
    keyFocus: string;
    successMetrics: string[];
    nextCheckIn: string;
  };
}

/**
 * Generate proactive mentor guidance for today
 */
export function generateTodaysMentor(
  profile: StudentProfile,
  roadmap: any,
  progressSummary: any,
  todaysTasks: any[],
  recentQuizzes: any[]
): TodaysMentor {
  const currentLevel = profile.skills.length <= 2
    ? "beginner"
    : profile.skills.length <= 5
    ? "intermediate"
    : "advanced";

  const overallProgress = progressSummary?.overall_completion_percentage || 0;
  const learningStreak = progressSummary?.learning_streak_days || 0;
  const totalCompleted =
    (progressSummary?.total_topics_completed || 0) +
    (progressSummary?.total_quizzes_completed || 0) +
    (progressSummary?.total_projects_completed || 0);

  // Generate today's goal
  const todaysGoal = generateTodaysGoal(
    profile,
    roadmap,
    currentLevel,
    learningStreak,
    todaysTasks
  );

  // Generate study time breakdown
  const estimatedStudyTime = generateStudyTimeBreakdown(
    profile.dailyStudyHours,
    todaysGoal
  );

  // Generate recommended topic
  const recommendedTopic = generateRecommendedTopic(
    profile,
    roadmap,
    currentLevel,
    overallProgress
  );

  // Generate mini project
  const miniProject = generateMiniProject(
    profile,
    recommendedTopic,
    currentLevel,
    profile.interests
  );

  // Generate quiz reminder
  const quizReminder = generateQuizReminder(
    profile,
    recentQuizzes,
    learningStreak,
    totalCompleted
  );

  // Generate motivation message
  const motivationMessage = generateMotivationMessage(
    profile,
    learningStreak,
    overallProgress,
    currentLevel
  );

  // Generate summary
  const summary = generateDaySummary(
    profile,
    learningStreak,
    overallProgress,
    todaysGoal
  );

  return {
    todaysGoal,
    estimatedStudyTime,
    recommendedTopic,
    miniProject,
    quizReminder,
    motivationMessage,
    summary,
  };
}

/**
 * Generate today's specific goal
 */
function generateTodaysGoal(
  profile: StudentProfile,
  roadmap: any,
  currentLevel: string,
  learningStreak: number,
  todaysTasks: any[]
): TodaysMentor["todaysGoal"] {
  const incompleteTasks = todaysTasks?.filter(t => !t.completed) || [];
  const taskTopic = incompleteTasks[0]?.topic || roadmap?.topic || "learning";

  let goal = "";
  let description = "";
  let estimatedTime = 60;
  let whyItMatters = "";

  if (learningStreak === 0) {
    goal = "Rebuild Your Momentum";
    description = `${profile.name}, it looks like you took a break. Let's ease back in today with a focused 30-minute session on ${taskTopic} to rebuild your learning habit.`;
    estimatedTime = 30;
    whyItMatters =
      "Consistency matters. Even a short session today resets your streak and shows your commitment to your goal.";
  } else if (learningStreak === 1) {
    goal = "Build Your Second Day";
    description = `Great! You learned yesterday. Let's make today your second consecutive day. Master one concept in ${taskTopic} to solidify your learning.`;
    estimatedTime = 45;
    whyItMatters = "Two consecutive days builds momentum. You're on your way.";
  } else if (learningStreak < 7) {
    goal = `Keep Your ${learningStreak}-Day Streak Alive`;
    description = `You're ${learningStreak} days in—don't break it now! Today: dive deeper into ${taskTopic} and strengthen your foundation.`;
    estimatedTime = 60;
    whyItMatters =
      "Your streak shows discipline. Every day adds up to mastery.";
  } else if (learningStreak < 30) {
    goal = "Continue Your Winning Streak";
    description = `Impressive! ${learningStreak} days of consistency. Today: practice ${taskTopic} and get closer to your goal.`;
    estimatedTime = 60;
    whyItMatters =
      "You're in the habit-building phase. This is where real progress happens.";
  } else {
    goal = "You're a Learning Machine";
    description = `${learningStreak} days! 🔥 Today: Master an advanced concept in ${taskTopic} to keep leveling up.`;
    estimatedTime = 90;
    whyItMatters =
      "You've proven consistency. Now focus on depth and mastery.";
  }

  return {
    title: goal,
    description,
    whyItMatters,
    estimatedTime,
  };
}

/**
 * Generate study time breakdown
 */
function generateStudyTimeBreakdown(
  dailyHours: number,
  todaysGoal: TodaysMentor["todaysGoal"]
): TodaysMentor["estimatedStudyTime"] {
  const totalMinutes = dailyHours * 60;
  const sessions: TodaysMentor["estimatedStudyTime"]["suggestedSessions"] = [];

  if (totalMinutes <= 30) {
    sessions.push({
      session: "Single Focused Session",
      duration: totalMinutes,
      topic: "Your Goal Topic",
    });
  } else if (totalMinutes <= 60) {
    sessions.push(
      {
        session: "Theory & Concepts",
        duration: Math.floor(totalMinutes * 0.4),
        topic: "Learn the fundamentals",
      },
      {
        session: "Hands-On Practice",
        duration: Math.floor(totalMinutes * 0.6),
        topic: "Apply what you learned",
      }
    );
  } else if (totalMinutes <= 120) {
    sessions.push(
      {
        session: "Morning: Theory",
        duration: Math.floor(totalMinutes * 0.35),
        topic: "New concepts & ideas",
      },
      {
        session: "Afternoon: Practice",
        duration: Math.floor(totalMinutes * 0.35),
        topic: "Build & experiment",
      },
      {
        session: "Evening: Review",
        duration: Math.floor(totalMinutes * 0.3),
        topic: "Consolidate learning",
      }
    );
  } else {
    sessions.push(
      {
        session: "Morning: Deep Learning",
        duration: Math.floor(totalMinutes * 0.3),
        topic: "Difficult concepts",
      },
      {
        session: "Midday: Coding/Building",
        duration: Math.floor(totalMinutes * 0.3),
        topic: "Apply to projects",
      },
      {
        session: "Afternoon: Advanced Concepts",
        duration: Math.floor(totalMinutes * 0.2),
        topic: "Level-up knowledge",
      },
      {
        session: "Evening: Review & Quiz",
        duration: Math.floor(totalMinutes * 0.2),
        topic: "Test your knowledge",
      }
    );
  }

  return {
    dailyCommitment: dailyHours,
    suggestedSessions: sessions,
    totalMinutes,
  };
}

/**
 * Generate recommended topic for today
 */
function generateRecommendedTopic(
  profile: StudentProfile,
  roadmap: any,
  currentLevel: string,
  overallProgress: number
): TodaysMentor["recommendedTopic"] {
  const currentRoadmapTopic = roadmap?.topic || "Your Learning Path";
  let phase = "Beginner";
  let topic = "Fundamentals";
  let whyRecommended = "";
  let prerequisite = "";
  let resourceType: "video" | "article" | "tutorial" | "project" | "quiz" =
    "video";

  if (overallProgress < 30) {
    phase = "Beginner Phase";
    const beginnerTopics = roadmap?.beginner?.topics || [
      "Fundamentals",
      "Basics",
      "Introduction",
    ];
    topic = beginnerTopics[0] || "Fundamentals";
    whyRecommended = `You're just starting your journey. Master ${topic} first—it's the foundation for everything else.`;
    resourceType = "video";
  } else if (overallProgress < 60) {
    phase = "Intermediate Phase";
    const intermediateTopics = roadmap?.intermediate?.topics || [
      "Intermediate Concepts",
      "Advanced Basics",
    ];
    topic = intermediateTopics[0] || "Building Skills";
    whyRecommended = `You've mastered the basics. Now dive into ${topic}—this is where you'll build real competence.`;
    resourceType = "tutorial";
  } else {
    phase = "Advanced Phase";
    const advancedTopics = roadmap?.advanced?.topics || ["Advanced Topics"];
    topic = advancedTopics[0] || "Expert Level";
    whyRecommended = `You're in the advanced phase. Focus on ${topic} to become truly expert-level.`;
    resourceType = "project";
  }

  // Determine prerequisites
  const prerequisites =
    profile.skills.slice(0, 3).length > 0
      ? profile.skills.slice(0, 3)
      : ["fundamentals"];

  // Estimate time to mastery
  const estimatedDays =
    currentLevel === "beginner"
      ? 14
      : currentLevel === "intermediate"
      ? 7
      : 5;

  return {
    topic,
    phase,
    whyRecommended,
    prerequisites,
    estimatedTimeToMastery: estimatedDays,
    resourceType,
  };
}

/**
 * Generate mini project for today
 */
function generateMiniProject(
  profile: StudentProfile,
  recommendedTopic: TodaysMentor["recommendedTopic"],
  currentLevel: string,
  interests: string[]
): TodaysMentor["miniProject"] {
  const topicName = recommendedTopic.topic;
  const interest = interests[0] || "technology";

  let title = "";
  let description = "";
  let difficulty: "easy" | "medium" | "hard" = "medium";
  let objectives: string[] = [];
  let portfolio = true;
  let estimatedTime = 60;

  if (currentLevel === "beginner") {
    difficulty = "easy";
    estimatedTime = 30;
    title = `Build a Simple ${topicName} Project`;
    description = `Create a small, focused project that demonstrates ${topicName}. Something you can complete today and feel proud of.`;
    objectives = [
      `Understand ${topicName} concepts`,
      "Build working code",
      "Test and verify it works",
    ];
    portfolio = false;
  } else if (currentLevel === "intermediate") {
    difficulty = "medium";
    estimatedTime = 60;
    title = `Build an Interactive ${topicName} Project`;
    description = `Create a more complex project combining ${topicName} with your interests in ${interest}. This should be portfolio-worthy.`;
    objectives = [
      `Master ${topicName} patterns`,
      "Create something useful",
      "Document your solution",
      "Get feedback or deploy it",
    ];
    portfolio = true;
  } else {
    difficulty = "hard";
    estimatedTime = 120;
    title = `Advanced ${topicName} Project`;
    description = `Design and build a sophisticated project that showcases ${topicName} expertise. Aim for something that demonstrates growth.`;
    objectives = [
      `Apply advanced ${topicName} techniques`,
      "Optimize and refactor",
      "Add creative features",
      "Prepare for interviews or hiring",
    ];
    portfolio = true;
  }

  return {
    title,
    description,
    estimatedTime,
    difficulty,
    learningObjectives: objectives,
    portfolio,
    resources: [
      `Official ${topicName} documentation`,
      "Tutorial for beginners",
      "Code examples and templates",
      "Community solutions",
    ],
  };
}

/**
 * Generate quiz reminder
 */
function generateQuizReminder(
  profile: StudentProfile,
  recentQuizzes: any[],
  learningStreak: number,
  totalCompleted: number
): TodaysMentor["quizReminder"] {
  const completedQuizzes = recentQuizzes?.length || 0;
  const averageScore =
    completedQuizzes > 0
      ? Math.round(
          (recentQuizzes?.reduce((sum: number) => sum + 85, 0) || 0) /
          completedQuizzes
        )
      : 0;

  const hasOutstandingQuizzes = completedQuizzes === 0 || totalCompleted < 5;
  const topicsToReview = [
    "Core concepts from last session",
    "Skills with quiz scores below 80%",
    "Prerequisites for next topic",
  ];

  let motivation = "";

  if (completedQuizzes === 0) {
    motivation = `You haven't taken any quizzes yet. A quick 10-minute quiz today will help you understand what you know and what to focus on.`;
  } else if (averageScore >= 90) {
    motivation = `Your average quiz score is ${averageScore}%! 🌟 Take another quiz to maintain your mastery.`;
  } else if (averageScore >= 80) {
    motivation = `You're scoring ${averageScore}%. A quick quiz on challenging topics will boost your confidence.`;
  } else {
    motivation = `Your score is ${averageScore}%. A focused quiz session today could help you identify gaps and improve.`;
  }

  return {
    hasOutstandingQuizzes,
    topicsToReview,
    averageScore,
    nextQuizTopic: "Your recommended topic",
    motivation,
  };
}

/**
 * Generate motivation message
 */
function generateMotivationMessage(
  profile: StudentProfile,
  learningStreak: number,
  overallProgress: number,
  currentLevel: string
): TodaysMentor["motivationMessage"] {
  let message = "";
  let tone: "encouraging" | "challenging" | "celebrating" | "nudging" =
    "encouraging";
  let reasons: string[] = [];

  if (learningStreak === 0) {
    tone = "nudging";
    message = `${profile.name}, I know breaks happen. But today is your chance to start fresh. Just 30 minutes will reset your momentum. You're capable of amazing things—let's prove it today.`;
    reasons = [
      "Consistency matters more than perfection",
      "Every day is a fresh start",
      "You have the skills to succeed",
    ];
  } else if (learningStreak < 7 && learningStreak > 0) {
    tone = "encouraging";
    message = `You're ${learningStreak} days in! That's ${learningStreak} decisions to keep learning. Don't stop now—you're building something real.`;
    reasons = [
      "Your streak proves commitment",
      "Small daily steps lead to big results",
      "You're creating a learning habit",
    ];
  } else if (learningStreak >= 7 && learningStreak < 30) {
    tone = "celebrating";
    message = `${learningStreak} days! 🔥 You've proven you're serious about ${profile.careerGoal}. This consistency is what separates dreamers from doers. Keep it going!`;
    reasons = [
      "You've built unstoppable momentum",
      "You're in the elite group of consistent learners",
      "This habit will transform your career",
    ];
  } else {
    tone = "challenging";
    message = `You're a ${learningStreak}-day streak legend! 💪 But legends don't coast—they push harder. Today: go deeper, tackle harder concepts. Show yourself what you're really capable of.`;
    reasons = [
      "Consistency is your superpower",
      "You're ready for advanced challenges",
      "This is what ${profile.careerGoal} roles require",
    ];
  }

  if (overallProgress >= 75) {
    message += ` You're ${overallProgress}% complete—finishing line is in sight!`;
  } else if (overallProgress >= 50) {
    message += ` You're ${overallProgress}% complete—halfway to your goal!`;
  }

  return {
    message,
    tone,
    personalized: true,
    reasons,
  };
}

/**
 * Generate day summary and theme
 */
function generateDaySummary(
  profile: StudentProfile,
  learningStreak: number,
  overallProgress: number,
  todaysGoal: TodaysMentor["todaysGoal"]
): TodaysMentor["summary"] {
  let dayTheme = "";
  let keyFocus = "";
  let successMetrics: string[] = [];
  let nextCheckIn = "";

  if (learningStreak === 0) {
    dayTheme = "🌅 Fresh Start";
    keyFocus = "Rebuild momentum with a focused, achievable session";
  } else if (learningStreak < 7) {
    dayTheme = "📈 Building Consistency";
    keyFocus = `Keep your ${learningStreak}-day streak alive`;
  } else if (learningStreak < 30) {
    dayTheme = "🚀 Accelerating Progress";
    keyFocus = "You're in the zone—push deeper today";
  } else {
    dayTheme = "💎 Expert in Progress";
    keyFocus = "Master advanced concepts and teach others";
  }

  if (overallProgress < 30) {
    successMetrics = [
      "Complete 1 focused learning session",
      "Take a quick quiz to verify knowledge",
      "Do 1 mini practice exercise",
    ];
    nextCheckIn = "Check in tonight to see what stuck";
  } else if (overallProgress < 60) {
    successMetrics = [
      "Master 1 intermediate concept",
      "Complete 1 mini project",
      "Score 80%+ on a quiz",
    ];
    nextCheckIn = "Review your project and get feedback tomorrow";
  } else {
    successMetrics = [
      "Tackle 1 advanced challenge",
      "Build something portfolio-worthy",
      "Identify gaps and plan next steps",
    ];
    nextCheckIn = "Reflect on your progress this week";
  }

  return {
    dayTheme,
    keyFocus,
    successMetrics,
    nextCheckIn,
  };
}

/**
 * Format mentor guidance for display
 */
export function formatMentorGuidance(mentor: TodaysMentor): string {
  return `
## 🎯 Your Mentor's Guidance for Today

### ${mentor.todaysGoal.title}
${mentor.todaysGoal.description}

**Why It Matters:** ${mentor.todaysGoal.whyItMatters}
**Estimated Time:** ${mentor.todaysGoal.estimatedTime} minutes

### ⏱️ Study Time Breakdown
**Your Daily Commitment:** ${mentor.estimatedStudyTime.dailyCommitment} hours

${mentor.estimatedStudyTime.suggestedSessions
  .map(
    (s, i) => `
${i + 1}. **${s.session}** — ${s.duration} min
   - Focus: ${s.topic}
`
  )
  .join("")}

**Total:** ${mentor.estimatedStudyTime.totalMinutes} minutes

### 📚 Recommended Topic
**Topic:** ${mentor.recommendedTopic.topic}
**Phase:** ${mentor.recommendedTopic.phase}
**Why:** ${mentor.recommendedTopic.whyRecommended}

**Prerequisites:** ${mentor.recommendedTopic.prerequisites.join(", ")}
**Time to Mastery:** ~${mentor.recommendedTopic.estimatedTimeToMastery} days
**Best Format:** ${mentor.recommendedTopic.resourceType} content

### 💡 Mini Project for Today
**Project:** ${mentor.miniProject.title}
**Difficulty:** ${mentor.miniProject.difficulty.toUpperCase()}
**Time:** ${mentor.miniProject.estimatedTime} minutes

**Description:**
${mentor.miniProject.description}

**What You'll Learn:**
${mentor.miniProject.learningObjectives.map(obj => `- ${obj}`).join("\n")}

**Portfolio Worthy:** ${mentor.miniProject.portfolio ? "✅ Yes" : "❌ No"}

**Resources:**
${mentor.miniProject.resources.map(r => `- ${r}`).join("\n")}

### 📋 Quiz Reminder
${
  mentor.quizReminder.hasOutstandingQuizzes
    ? `**Action Needed:** You should take a quiz today`
    : `**Great!** You're keeping up with quizzes`
}

**Topics to Review:**
${mentor.quizReminder.topicsToReview.map(t => `- ${t}`).join("\n")}

**Your Score:** ${mentor.quizReminder.averageScore}%
**Message:** ${mentor.quizReminder.motivation}

### 💪 Today's Motivation
> ${mentor.motivationMessage.message}

**Why This Matters:**
${mentor.motivationMessage.reasons.map(r => `- ${r}`).join("\n")}

### 📊 Today's Theme
**${mentor.summary.dayTheme}**

**Key Focus:** ${mentor.summary.keyFocus}

**Success Looks Like:**
${mentor.summary.successMetrics.map(m => `✓ ${m}`).join("\n")}

**Next Check-in:** ${mentor.summary.nextCheckIn}

---

**You've got this! 🚀**
`;
}
