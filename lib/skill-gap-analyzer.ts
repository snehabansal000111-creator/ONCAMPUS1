import type { StudentProfile } from "@/types";

/**
 * Skill Gap Analyzer
 * Compares student's current skills against required skills for their career goal
 * Provides personalized analysis with learning order and timeline
 */

export interface SkillRequirement {
  skill: string;
  importance: "critical" | "important" | "nice-to-have";
  prerequisite?: string;
  estimatedWeeks: number;
  description: string;
}

export interface CareerSkillMap {
  role: string;
  requiredSkills: SkillRequirement[];
  foundationalSkills: SkillRequirement[];
  advancedSkills: SkillRequirement[];
}

export interface SkillGapAnalysis {
  role: string;
  matchPercentage: number;
  currentSkills: string[];
  missingSkills: {
    skill: string;
    importance: "critical" | "important" | "nice-to-have";
    prerequisite?: string;
    estimatedWeeks: number;
  }[];
  recommendedOrder: string[];
  estimatedTimeline: {
    skill: string;
    weeks: number;
    estimatedHours: number;
    startAfter?: string;
  }[];
  totalEstimatedWeeks: number;
  criticalGapsCount: number;
  summary: string;
}

/**
 * Define skill requirements for different career paths
 */
const CAREER_SKILL_MAPS: Record<string, CareerSkillMap> = {
  "Frontend Developer": {
    role: "Frontend Developer",
    foundationalSkills: [
      {
        skill: "HTML",
        importance: "critical",
        estimatedWeeks: 1,
        description: "Markup language for web structure",
      },
      {
        skill: "CSS",
        importance: "critical",
        prerequisite: "HTML",
        estimatedWeeks: 2,
        description: "Styling and layout (Flexbox, Grid)",
      },
      {
        skill: "JavaScript",
        importance: "critical",
        prerequisite: "HTML, CSS",
        estimatedWeeks: 4,
        description: "Core programming language for web",
      },
    ],
    requiredSkills: [
      {
        skill: "React",
        importance: "critical",
        prerequisite: "JavaScript",
        estimatedWeeks: 3,
        description: "Popular component-based framework",
      },
      {
        skill: "State Management",
        importance: "important",
        prerequisite: "React",
        estimatedWeeks: 2,
        description: "Redux, Zustand, or Context API",
      },
      {
        skill: "Responsive Design",
        importance: "critical",
        prerequisite: "CSS",
        estimatedWeeks: 1,
        description: "Mobile-first and responsive layouts",
      },
      {
        skill: "Web APIs",
        importance: "important",
        prerequisite: "JavaScript",
        estimatedWeeks: 2,
        description: "Fetch, DOM manipulation, async patterns",
      },
      {
        skill: "Git & Version Control",
        importance: "important",
        estimatedWeeks: 1,
        description: "GitHub, commits, collaboration",
      },
      {
        skill: "npm & Build Tools",
        importance: "important",
        prerequisite: "JavaScript",
        estimatedWeeks: 1,
        description: "Package management and Webpack/Vite",
      },
    ],
    advancedSkills: [
      {
        skill: "TypeScript",
        importance: "important",
        prerequisite: "JavaScript",
        estimatedWeeks: 2,
        description: "Type-safe JavaScript",
      },
      {
        skill: "Testing (Jest, React Testing Library)",
        importance: "important",
        prerequisite: "React",
        estimatedWeeks: 2,
        description: "Unit and component testing",
      },
      {
        skill: "Performance Optimization",
        importance: "nice-to-have",
        prerequisite: "React",
        estimatedWeeks: 2,
        description: "Lazy loading, code splitting, memoization",
      },
      {
        skill: "NextJS or Remix",
        importance: "nice-to-have",
        prerequisite: "React",
        estimatedWeeks: 3,
        description: "Full-stack frameworks built on React",
      },
    ],
  },

  "Backend Developer": {
    role: "Backend Developer",
    foundationalSkills: [
      {
        skill: "Programming Language (Python/Node/Java)",
        importance: "critical",
        estimatedWeeks: 4,
        description: "Core language for backend development",
      },
      {
        skill: "Data Structures & Algorithms",
        importance: "critical",
        estimatedWeeks: 3,
        description: "Arrays, lists, trees, sorting, searching",
      },
      {
        skill: "SQL",
        importance: "critical",
        estimatedWeeks: 2,
        description: "Relational database queries and design",
      },
      {
        skill: "Git & Version Control",
        importance: "important",
        estimatedWeeks: 1,
        description: "GitHub, commits, collaboration",
      },
    ],
    requiredSkills: [
      {
        skill: "RESTful APIs",
        importance: "critical",
        prerequisite: "Programming Language",
        estimatedWeeks: 2,
        description: "HTTP methods, status codes, design patterns",
      },
      {
        skill: "Web Framework",
        importance: "critical",
        prerequisite: "Programming Language",
        estimatedWeeks: 3,
        description: "Express (Node), Django (Python), Spring (Java)",
      },
      {
        skill: "Databases",
        importance: "critical",
        prerequisite: "SQL",
        estimatedWeeks: 2,
        description: "PostgreSQL, MongoDB, database design",
      },
      {
        skill: "Authentication & Security",
        importance: "important",
        prerequisite: "Web Framework",
        estimatedWeeks: 2,
        description: "JWT, OAuth, encryption, CORS",
      },
      {
        skill: "Middleware & Routing",
        importance: "important",
        prerequisite: "Web Framework",
        estimatedWeeks: 1,
        description: "Request handling, middleware concepts",
      },
      {
        skill: "Testing",
        importance: "important",
        prerequisite: "Programming Language",
        estimatedWeeks: 2,
        description: "Unit tests, integration tests, mocking",
      },
    ],
    advancedSkills: [
      {
        skill: "Caching & Performance",
        importance: "important",
        prerequisite: "Databases",
        estimatedWeeks: 2,
        description: "Redis, caching strategies, optimization",
      },
      {
        skill: "Message Queues",
        importance: "important",
        prerequisite: "Web Framework",
        estimatedWeeks: 2,
        description: "RabbitMQ, Kafka, asynchronous processing",
      },
      {
        skill: "DevOps Basics",
        importance: "nice-to-have",
        estimatedWeeks: 3,
        description: "Docker, CI/CD, deployment",
      },
      {
        skill: "Microservices",
        importance: "nice-to-have",
        prerequisite: "Web Framework",
        estimatedWeeks: 3,
        description: "Service design, communication patterns",
      },
    ],
  },

  "Full Stack Developer": {
    role: "Full Stack Developer",
    foundationalSkills: [
      {
        skill: "HTML",
        importance: "critical",
        estimatedWeeks: 1,
        description: "Web structure and markup",
      },
      {
        skill: "CSS",
        importance: "critical",
        prerequisite: "HTML",
        estimatedWeeks: 2,
        description: "Styling and layouts",
      },
      {
        skill: "JavaScript",
        importance: "critical",
        prerequisite: "HTML, CSS",
        estimatedWeeks: 4,
        description: "Frontend and backend language",
      },
      {
        skill: "SQL",
        importance: "critical",
        estimatedWeeks: 2,
        description: "Database fundamentals",
      },
    ],
    requiredSkills: [
      {
        skill: "React or Vue",
        importance: "critical",
        prerequisite: "JavaScript",
        estimatedWeeks: 3,
        description: "Frontend framework",
      },
      {
        skill: "Node.js & Express",
        importance: "critical",
        prerequisite: "JavaScript",
        estimatedWeeks: 3,
        description: "Backend runtime and framework",
      },
      {
        skill: "Databases",
        importance: "critical",
        prerequisite: "SQL",
        estimatedWeeks: 2,
        description: "PostgreSQL or MongoDB",
      },
      {
        skill: "RESTful APIs",
        importance: "critical",
        prerequisite: "Node.js & Express",
        estimatedWeeks: 2,
        description: "API design and implementation",
      },
      {
        skill: "Git & Version Control",
        importance: "important",
        estimatedWeeks: 1,
        description: "Collaboration and code management",
      },
      {
        skill: "Authentication",
        importance: "important",
        prerequisite: "Node.js & Express",
        estimatedWeeks: 1,
        description: "JWT, sessions, security",
      },
    ],
    advancedSkills: [
      {
        skill: "TypeScript",
        importance: "important",
        prerequisite: "JavaScript",
        estimatedWeeks: 2,
        description: "Type safety across stack",
      },
      {
        skill: "Testing",
        importance: "important",
        estimatedWeeks: 2,
        description: "Unit, integration, E2E tests",
      },
      {
        skill: "Deployment & DevOps",
        importance: "important",
        estimatedWeeks: 2,
        description: "Docker, Heroku, AWS basics",
      },
    ],
  },

  "Mobile Developer": {
    role: "Mobile Developer",
    foundationalSkills: [
      {
        skill: "JavaScript",
        importance: "critical",
        estimatedWeeks: 3,
        description: "Foundation for React Native",
      },
      {
        skill: "Mobile Fundamentals",
        importance: "critical",
        estimatedWeeks: 2,
        description: "App lifecycle, navigation, state",
      },
      {
        skill: "Git & Version Control",
        importance: "important",
        estimatedWeeks: 1,
        description: "Code management and collaboration",
      },
    ],
    requiredSkills: [
      {
        skill: "React Native or Flutter",
        importance: "critical",
        prerequisite: "JavaScript",
        estimatedWeeks: 3,
        description: "Cross-platform mobile development",
      },
      {
        skill: "UI/UX Design Basics",
        importance: "important",
        estimatedWeeks: 2,
        description: "Mobile design principles",
      },
      {
        skill: "APIs Integration",
        importance: "critical",
        prerequisite: "JavaScript",
        estimatedWeeks: 2,
        description: "REST APIs, data fetching",
      },
      {
        skill: "Local Storage",
        importance: "important",
        estimatedWeeks: 1,
        description: "AsyncStorage, SQLite, databases",
      },
      {
        skill: "Testing",
        importance: "important",
        estimatedWeeks: 2,
        description: "Unit and integration tests",
      },
    ],
    advancedSkills: [
      {
        skill: "Native iOS (Swift)",
        importance: "nice-to-have",
        estimatedWeeks: 4,
        description: "Native iOS development",
      },
      {
        skill: "Native Android (Kotlin)",
        importance: "nice-to-have",
        estimatedWeeks: 4,
        description: "Native Android development",
      },
      {
        skill: "Push Notifications",
        importance: "nice-to-have",
        estimatedWeeks: 1,
        description: "Firebase, notification systems",
      },
      {
        skill: "App Store Deployment",
        importance: "important",
        estimatedWeeks: 1,
        description: "Build distribution and publishing",
      },
    ],
  },

  "Data Scientist": {
    role: "Data Scientist",
    foundationalSkills: [
      {
        skill: "Python",
        importance: "critical",
        estimatedWeeks: 3,
        description: "Primary language for data science",
      },
      {
        skill: "SQL",
        importance: "critical",
        estimatedWeeks: 2,
        description: "Data querying and manipulation",
      },
      {
        skill: "Mathematics & Statistics",
        importance: "critical",
        estimatedWeeks: 3,
        description: "Probability, distributions, hypothesis testing",
      },
      {
        skill: "Data Structures",
        importance: "important",
        estimatedWeeks: 2,
        description: "Arrays, lists, dictionaries",
      },
    ],
    requiredSkills: [
      {
        skill: "NumPy & Pandas",
        importance: "critical",
        prerequisite: "Python",
        estimatedWeeks: 2,
        description: "Data manipulation libraries",
      },
      {
        skill: "Data Visualization",
        importance: "critical",
        prerequisite: "Python",
        estimatedWeeks: 2,
        description: "Matplotlib, Seaborn, Plotly",
      },
      {
        skill: "Machine Learning Algorithms",
        importance: "critical",
        prerequisite: "Mathematics & Statistics",
        estimatedWeeks: 4,
        description: "Supervised and unsupervised learning",
      },
      {
        skill: "Scikit-learn",
        importance: "critical",
        prerequisite: "Python",
        estimatedWeeks: 2,
        description: "ML library for classical algorithms",
      },
      {
        skill: "Data Cleaning & EDA",
        importance: "important",
        prerequisite: "Pandas",
        estimatedWeeks: 2,
        description: "Exploratory data analysis",
      },
      {
        skill: "Git & Version Control",
        importance: "important",
        estimatedWeeks: 1,
        description: "Code management",
      },
    ],
    advancedSkills: [
      {
        skill: "Deep Learning (TensorFlow/PyTorch)",
        importance: "important",
        prerequisite: "Machine Learning Algorithms",
        estimatedWeeks: 4,
        description: "Neural networks and deep learning",
      },
      {
        skill: "Big Data (Spark)",
        importance: "important",
        prerequisite: "Python, SQL",
        estimatedWeeks: 3,
        description: "Large-scale data processing",
      },
      {
        skill: "MLOps & Deployment",
        importance: "important",
        estimatedWeeks: 2,
        description: "Model deployment and monitoring",
      },
      {
        skill: "NLP",
        importance: "nice-to-have",
        prerequisite: "Deep Learning",
        estimatedWeeks: 2,
        description: "Natural language processing",
      },
    ],
  },

  "DevOps Engineer": {
    role: "DevOps Engineer",
    foundationalSkills: [
      {
        skill: "Linux Fundamentals",
        importance: "critical",
        estimatedWeeks: 2,
        description: "Command line, file systems, processes",
      },
      {
        skill: "Networking Basics",
        importance: "critical",
        estimatedWeeks: 2,
        description: "TCP/IP, DNS, ports, HTTP",
      },
      {
        skill: "Scripting (Bash/Python)",
        importance: "critical",
        estimatedWeeks: 2,
        description: "Automation scripting",
      },
      {
        skill: "Git & Version Control",
        importance: "important",
        estimatedWeeks: 1,
        description: "Code collaboration",
      },
    ],
    requiredSkills: [
      {
        skill: "Docker",
        importance: "critical",
        prerequisite: "Linux Fundamentals",
        estimatedWeeks: 2,
        description: "Containerization",
      },
      {
        skill: "Kubernetes",
        importance: "critical",
        prerequisite: "Docker",
        estimatedWeeks: 3,
        description: "Orchestration platform",
      },
      {
        skill: "CI/CD Pipelines",
        importance: "critical",
        prerequisite: "Git & Version Control",
        estimatedWeeks: 2,
        description: "Jenkins, GitLab CI, GitHub Actions",
      },
      {
        skill: "Cloud Platforms (AWS/GCP/Azure)",
        importance: "critical",
        estimatedWeeks: 3,
        description: "Cloud infrastructure and services",
      },
      {
        skill: "Infrastructure as Code",
        importance: "important",
        prerequisite: "Scripting",
        estimatedWeeks: 2,
        description: "Terraform, CloudFormation",
      },
      {
        skill: "Monitoring & Logging",
        importance: "important",
        estimatedWeeks: 2,
        description: "Prometheus, ELK, observability",
      },
    ],
    advancedSkills: [
      {
        skill: "Serverless Computing",
        importance: "important",
        prerequisite: "Cloud Platforms",
        estimatedWeeks: 2,
        description: "Lambda, Cloud Functions",
      },
      {
        skill: "Security & Compliance",
        importance: "important",
        estimatedWeeks: 2,
        description: "IAM, encryption, compliance",
      },
      {
        skill: "Service Mesh",
        importance: "nice-to-have",
        prerequisite: "Kubernetes",
        estimatedWeeks: 2,
        description: "Istio, Linkerd",
      },
    ],
  },
};

/**
 * Analyzes skill gaps for a student
 */
export function analyzeSkillGaps(profile: StudentProfile): SkillGapAnalysis {
  const careerGoal = profile.careerGoal.toLowerCase();

  // Find matching career path (handle variations in naming)
  let skillMap: CareerSkillMap | null = null;

  for (const [key, value] of Object.entries(CAREER_SKILL_MAPS)) {
    if (
      careerGoal.includes(key.split(" ")[0].toLowerCase()) ||
      key.toLowerCase().includes(careerGoal.split(" ")[0])
    ) {
      skillMap = value;
      break;
    }
  }

  // Fallback to closest match or first available
  if (!skillMap) {
    skillMap = CAREER_SKILL_MAPS["Full Stack Developer"];
  }

  const currentSkills = profile.skills.map(s => s.toLowerCase());

  // All required skills for the role
  const allRequiredSkills = [
    ...skillMap.foundationalSkills,
    ...skillMap.requiredSkills,
    ...skillMap.advancedSkills,
  ];

  // Find missing skills
  const missingSkills = allRequiredSkills.filter(skill => {
    const skillLower = skill.skill.toLowerCase();
    return !currentSkills.some(current =>
      current.includes(skillLower.split(" ")[0]) ||
      skillLower.includes(current.split(" ")[0])
    );
  });

  // Prioritize critical gaps first
  const criticalGaps = missingSkills.filter(s => s.importance === "critical");
  const importantGaps = missingSkills.filter(s => s.importance === "important");
  const niceToHaveGaps = missingSkills.filter(s => s.importance === "nice-to-have");

  // Recommended learning order (respect prerequisites)
  const recommendedOrder = buildLearningOrder([
    ...criticalGaps,
    ...importantGaps,
    ...niceToHaveGaps,
  ]);

  // Calculate timeline
  const estimatedTimeline = recommendedOrder.map(skillName => {
    const skillDef = allRequiredSkills.find(
      s => s.skill.toLowerCase() === skillName.toLowerCase()
    );

    return {
      skill: skillName,
      weeks: skillDef?.estimatedWeeks || 2,
      estimatedHours: (skillDef?.estimatedWeeks || 2) * (profile.dailyStudyHours * 5), // 5 days/week
      startAfter: skillDef?.prerequisite,
    };
  });

  const totalWeeks = estimatedTimeline.reduce((sum, item) => sum + item.weeks, 0);

  // Calculate match percentage
  const matchPercentage = Math.round(
    ((currentSkills.length) / allRequiredSkills.length) * 100
  );

  // Build summary
  const summary = buildSkillGapSummary(
    profile.name,
    matchPercentage,
    criticalGaps.length,
    importantGaps.length,
    totalWeeks
  );

  return {
    role: skillMap.role,
    matchPercentage,
    currentSkills: profile.skills,
    missingSkills: missingSkills.map(s => ({
      skill: s.skill,
      importance: s.importance,
      prerequisite: s.prerequisite,
      estimatedWeeks: s.estimatedWeeks,
    })),
    recommendedOrder,
    estimatedTimeline,
    totalEstimatedWeeks: totalWeeks,
    criticalGapsCount: criticalGaps.length,
    summary,
  };
}

/**
 * Build learning order respecting prerequisites
 */
function buildLearningOrder(skills: SkillRequirement[]): string[] {
  const ordered: string[] = [];
  const processed = new Set<string>();
  let iterations = 0;
  const maxIterations = skills.length * 2;

  while (processed.size < skills.length && iterations < maxIterations) {
    for (const skill of skills) {
      if (processed.has(skill.skill)) continue;

      // Check if prerequisites are met
      const prereqs = skill.prerequisite?.split(",").map(p => p.trim()) || [];
      const allPrereqsMet = prereqs.every(
        p => !p || ordered.some(s => s.toLowerCase().includes(p.toLowerCase()))
      );

      if (allPrereqsMet) {
        ordered.push(skill.skill);
        processed.add(skill.skill);
      }
    }
    iterations++;
  }

  return ordered;
}

/**
 * Generate summary text
 */
function buildSkillGapSummary(
  name: string,
  matchPercentage: number,
  criticalGaps: number,
  importantGaps: number,
  totalWeeks: number
): string {
  if (matchPercentage >= 80) {
    return `${name}, you're almost there! You've mastered most of the required skills. Focus on closing ${criticalGaps} critical gaps in the next ${totalWeeks} weeks to fully qualify for your goal role.`;
  } else if (matchPercentage >= 50) {
    return `${name}, you have a solid foundation with half the required skills. You need to close ${criticalGaps} critical gaps and ${importantGaps} important gaps over the next ${totalWeeks} weeks to reach your goal.`;
  } else if (matchPercentage >= 25) {
    return `${name}, you're building your skillset. You have ${matchPercentage}% of required skills. Prioritize the ${criticalGaps} critical gaps first, which are foundational for your ${totalWeeks}-week learning journey.`;
  } else {
    return `${name}, you're starting your journey. You have ${matchPercentage}% of required skills. Focus on foundational skills first. With dedicated effort over ${totalWeeks} weeks, you can reach your goal.`;
  }
}

/**
 * Format analysis for display
 */
export function formatSkillGapAnalysis(analysis: SkillGapAnalysis): string {
  return `
## 🎯 Skill Gap Analysis for ${analysis.role}

### 📊 Current Status
- **Skill Match: ${analysis.matchPercentage}%** (${analysis.currentSkills.length} of ${analysis.currentSkills.length + analysis.missingSkills.length} skills)
- **Critical Gaps: ${analysis.criticalGapsCount}**
- **Total Timeline: ${analysis.totalEstimatedWeeks} weeks**

### 🟢 Current Skills
${analysis.currentSkills.length > 0
  ? analysis.currentSkills.map(s => `- ${s}`).join("\n")
  : "- No skills yet (starting from fundamentals)"}

### 🔴 Critical Missing Skills
${analysis.missingSkills
  .filter(s => s.importance === "critical")
  .map(s => `- **${s.skill}** (${s.estimatedWeeks} weeks)`)
  .join("\n")}

### 🟡 Important Missing Skills
${analysis.missingSkills
  .filter(s => s.importance === "important")
  .slice(0, 3)
  .map(s => `- ${s.skill} (${s.estimatedWeeks} weeks)`)
  .join("\n")}

### 📚 Recommended Learning Order
${analysis.recommendedOrder
  .slice(0, 8)
  .map((skill, i) => {
    const timeline = analysis.estimatedTimeline.find(t => t.skill === skill);
    return `${i + 1}. **${skill}** — ${timeline?.weeks} weeks`;
  })
  .join("\n")}

### ⏱️ Estimated Timeline
- **Total Duration:** ${analysis.totalEstimatedWeeks} weeks
- **Daily Commitment:** Adjust based on your study hours

### 📝 Summary
${analysis.summary}
`;
}
