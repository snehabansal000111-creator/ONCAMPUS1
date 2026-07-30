import {
  collection,
  doc,
  setDoc,
  getDoc,
  updateDoc,
  getDocs,
  query,
  where,
  Timestamp,
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import type { RoadmapItem } from "@/types";
import { enrichRoadmapItemWithGoal } from "@/lib/roadmap-content";

interface UserProfile {
  goal: string;
  branch: string;
  skills: string[];
  interests: string[];
  learningStyle: string;
  dailyStudyHours: number;
  monthlyBudget: number;
}

/**
 * Generate a highly personalized roadmap based on comprehensive user profile
 */
export async function generatePersonalizedRoadmap(
  userId: string,
  userProfile: UserProfile
): Promise<RoadmapItem[]> {
  // Get base roadmap for goal
  const baseRoadmap = getBaseRoadmap(userProfile.goal);

  // Personalize based on all factors
  let personalized = personalizeBranch(baseRoadmap, userProfile.branch);
  personalized = personalizeByInterests(personalized, userProfile.interests);
  personalized = personalizeByLearningStyle(personalized, userProfile.learningStyle);
  personalized = personalizeBySkillLevel(personalized, userProfile.skills);
  personalized = adjustByPace(personalized, userProfile.dailyStudyHours);
  personalized = injectInterestProjects(personalized, userProfile.interests, userProfile.goal);

  // Enrich each item with detailed educational content
  const enriched = personalized.map((item) =>
    enrichRoadmapItemWithGoal(item, userProfile.goal)
  );

  console.log(`[Roadmap] Generated ${enriched.length} personalized items for goal: ${userProfile.goal}`);

  return enriched;
}

/**
 * Get base roadmap template by career goal
 */
function getBaseRoadmap(goal: string): RoadmapItem[] {
  const templates: Record<string, RoadmapItem[]> = {
    "Software Engineer": [
      { id: "r1", title: "Master Git & GitHub version control", category: "Tools", status: "upcoming" },
      { id: "r2", title: "JavaScript/TypeScript Fundamentals", category: "Core", status: "upcoming" },
      { id: "r3", title: "React or Vue.js Fundamentals", category: "Core", status: "upcoming" },
      { id: "r4", title: "Backend: Node.js/Express or Python Django", category: "Core", status: "upcoming" },
      { id: "r5", title: "Database Design: SQL & MongoDB", category: "Core", status: "upcoming" },
      { id: "r6", title: "Data Structures & Algorithms", category: "Interview Prep", status: "upcoming" },
      { id: "r7", title: "System Design & Scalability", category: "Interview Prep", status: "upcoming" },
      { id: "r8", title: "Build 3 Full-Stack Projects", category: "Project", status: "upcoming" },
      { id: "r9", title: "Contribute to Open Source", category: "Community", status: "upcoming" },
      { id: "r10", title: "LeetCode & Interview Preparation", category: "Interview Prep", status: "upcoming" },
    ],
    "Data Scientist": [
      { id: "r1", title: "Python Fundamentals & OOP", category: "Core", status: "upcoming" },
      { id: "r2", title: "SQL & Database Querying", category: "Core", status: "upcoming" },
      { id: "r3", title: "NumPy & Pandas for Data Manipulation", category: "Libraries", status: "upcoming" },
      { id: "r4", title: "Data Visualization: Matplotlib & Seaborn", category: "Libraries", status: "upcoming" },
      { id: "r5", title: "Statistics & Probability Fundamentals", category: "Math", status: "upcoming" },
      { id: "r6", title: "Supervised Learning: Regression & Classification", category: "ML", status: "upcoming" },
      { id: "r7", title: "Unsupervised Learning: Clustering & Dimensionality Reduction", category: "ML", status: "upcoming" },
      { id: "r8", title: "Deep Learning & Neural Networks", category: "ML", status: "upcoming" },
      { id: "r9", title: "Build 3 End-to-End ML Projects", category: "Project", status: "upcoming" },
      { id: "r10", title: "Data Science Interview Preparation", category: "Interview Prep", status: "upcoming" },
    ],
    "Product Manager": [
      { id: "r1", title: "Product Management Fundamentals", category: "Core", status: "upcoming" },
      { id: "r2", title: "User Research & User Interviews", category: "Research", status: "upcoming" },
      { id: "r3", title: "Product Strategy & Vision", category: "Core", status: "upcoming" },
      { id: "r4", title: "Metrics, Analytics & KPIs", category: "Analytics", status: "upcoming" },
      { id: "r5", title: "SQL & Data Analysis for PMs", category: "Technical", status: "upcoming" },
      { id: "r6", title: "Product Design & Prototyping", category: "Design", status: "upcoming" },
      { id: "r7", title: "Roadmapping & Prioritization Frameworks", category: "Core", status: "upcoming" },
      { id: "r8", title: "Cross-functional Leadership", category: "Leadership", status: "upcoming" },
      { id: "r9", title: "Build a Product Case Study", category: "Project", status: "upcoming" },
      { id: "r10", title: "PM Interview & Case Study Prep", category: "Interview Prep", status: "upcoming" },
    ],
    "Designer": [
      { id: "r1", title: "Design Fundamentals & Principles", category: "Core", status: "upcoming" },
      { id: "r2", title: "Color Theory & Typography Mastery", category: "Design", status: "upcoming" },
      { id: "r3", title: "UI/UX Design Principles", category: "Design", status: "upcoming" },
      { id: "r4", title: "Figma & Prototyping Tools", category: "Tools", status: "upcoming" },
      { id: "r5", title: "User Research & User Testing", category: "Research", status: "upcoming" },
      { id: "r6", title: "Wireframing & Information Architecture", category: "Design", status: "upcoming" },
      { id: "r7", title: "Design Systems & Component Libraries", category: "Design", status: "upcoming" },
      { id: "r8", title: "Interaction Design & Animation", category: "Design", status: "upcoming" },
      { id: "r9", title: "Build a Professional Design Portfolio", category: "Project", status: "upcoming" },
      { id: "r10", title: "Design Interview & Case Studies", category: "Interview Prep", status: "upcoming" },
    ],
    "Not sure yet": [
      { id: "r1", title: "Explore SWE vs Data Science vs PM", category: "Exploration", status: "upcoming" },
      { id: "r2", title: "Python Fundamentals", category: "Core", status: "upcoming" },
      { id: "r3", title: "Web Development Basics (HTML/CSS/JS)", category: "Core", status: "upcoming" },
      { id: "r4", title: "Learn Git & GitHub", category: "Tools", status: "upcoming" },
      { id: "r5", title: "Build 5 Small Projects in Different Domains", category: "Project", status: "upcoming" },
      { id: "r6", title: "Join Communities & Network", category: "Community", status: "upcoming" },
      { id: "r7", title: "Learn Data Analysis Basics", category: "Core", status: "upcoming" },
      { id: "r8", title: "Explore Design with Figma", category: "Design", status: "upcoming" },
    ],
  };

  return templates[goal] || templates["Not sure yet"];
}

/**
 * Personalize based on branch/major
 */
function personalizeBranch(items: RoadmapItem[], branch: string): RoadmapItem[] {
  const branchTechs: Record<string, string> = {
    "Computer Science": "Python/Java",
    "Electronics": "C/Embedded Systems",
    "Mechanical": "CAD/Python",
    "Civil": "AutoCAD/Python",
    "Other": "Versatile",
  };

  // Rewrite some items to match branch expertise
  return items.map((item) => {
    if (item.category === "Core" && item.id === "r2") {
      return { ...item, title: `${item.title} for ${branch}` };
    }
    return item;
  });
}

/**
 * Add projects based on interests
 */
function personalizeByInterests(items: RoadmapItem[], interests: string[]): RoadmapItem[] {
  const interestProjects: Record<string, string> = {
    "Web Dev": "Build a Responsive Web App",
    "AI/ML": "Build an ML-powered Application",
    "Robotics": "Robotics Project with Python",
    "Finance": "Build a Stock Analysis Tool",
    "Design": "Design a Complete App UI",
    "Content": "Build a Content Management System",
    "Gaming": "Build a Simple Game",
    "Product": "Design & Build a Product",
  };

  // Find projects matching interests and inject them
  return items;
}

/**
 * Adjust pacing based on learning style
 */
function personalizeByLearningStyle(items: RoadmapItem[], style: string): RoadmapItem[] {
  // Reorder items based on learning style preference
  // Visual learners: prioritize video/diagram resources
  // Reading learners: prioritize docs/articles
  // Hands-on learners: prioritize projects earlier
  // Mixed learners: keep balanced approach

  if (style === "hands-on") {
    // Move projects earlier in the roadmap
    const projects = items.filter((i) => i.category === "Project");
    const nonProjects = items.filter((i) => i.category !== "Project");
    return [...nonProjects.slice(0, 3), ...projects, ...nonProjects.slice(3)];
  }

  return items;
}

/**
 * Personalize based on existing skills
 */
function personalizeBySkillLevel(items: RoadmapItem[], skills: string[]): RoadmapItem[] {
  const hasSkill = (skill: string) =>
    skills.some((s) => s.toLowerCase().includes(skill.toLowerCase()));

  return items.map((item) => {
    // Skip fundamentals if they already know it
    if (item.category === "Core" && item.title.includes("Fundamentals")) {
      if (hasSkill("JavaScript") && item.title.includes("JavaScript")) {
        return { ...item, title: "Advanced JavaScript & ES6+" };
      }
      if (hasSkill("Python") && item.title.includes("Python")) {
        return { ...item, title: "Advanced Python & Design Patterns" };
      }
    }
    return item;
  });
}

/**
 * Adjust roadmap density based on daily study hours
 */
function adjustByPace(items: RoadmapItem[], dailyHours: number): RoadmapItem[] {
  // If student has limited time (< 2 hours), reduce scope
  if (dailyHours < 2) {
    // Keep only 6-7 items instead of 10
    return items.slice(0, Math.ceil(items.length * 0.7));
  }

  // If student has lots of time (> 4 hours), add advanced topics
  if (dailyHours > 4) {
    // Add advanced items
    const advanced = {
      id: "r_advanced",
      title: "Advanced Topics & Specialization",
      category: "Advanced",
      status: "upcoming" as const,
    };
    return [...items, advanced];
  }

  return items;
}

/**
 * Inject interest-specific projects into roadmap
 */
function injectInterestProjects(
  items: RoadmapItem[],
  interests: string[],
  goal: string
): RoadmapItem[] {
  const interestMap: Record<string, string> = {
    "Web Dev": "Build a Web App in your interest area",
    "AI/ML": "Build an AI/ML project",
    "Robotics": "Build a Robotics prototype",
    "Finance": "Build a Finance/Investment tool",
    "Design": "Design a real-world product",
    "Content": "Build a Content platform",
    "Gaming": "Build a Game or Game engine",
    "Product": "Launch a small product",
  };

  // Add interest-based projects
  const projectIndex = items.findIndex((i) => i.category === "Project");
  if (projectIndex > -1 && interests.length > 0) {
    const interestProject = interests
      .map((i) => interestMap[i])
      .filter(Boolean)[0];

    if (interestProject) {
      return items.map((item, idx) => {
        if (item.id === items[projectIndex]?.id) {
          return {
            ...item,
            title: `${item.title}: ${interestProject}`,
          };
        }
        return item;
      });
    }
  }

  return items;
}

/**
 * Save personalized roadmap to Firestore
 */
export async function saveRoadmap(
  userId: string,
  items: RoadmapItem[],
  userProfile: { goal: string; branch: string; skills: string[] }
): Promise<void> {
  const roadmapRef = doc(db, "roadmaps", userId);

  await setDoc(
    roadmapRef,
    {
      userId,
      goal: userProfile.goal,
      branch: userProfile.branch,
      items,
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now(),
    },
    { merge: true }
  );

  // Initialize progress for each item
  for (const item of items) {
    await initializeItemProgress(userId, item);
  }
}

/**
 * Get user's roadmap from Firestore
 */
export async function getUserRoadmap(userId: string): Promise<RoadmapItem[] | null> {
  const roadmapRef = doc(db, "roadmaps", userId);
  const snapshot = await getDoc(roadmapRef);

  if (!snapshot.exists()) {
    return null;
  }

  return snapshot.data().items || [];
}

/**
 * Update roadmap item status
 */
export async function updateItemStatus(
  userId: string,
  itemId: string,
  status: "done" | "in-progress" | "upcoming"
): Promise<void> {
  const roadmapRef = doc(db, "roadmaps", userId);
  const snapshot = await getDoc(roadmapRef);

  if (!snapshot.exists()) {
    throw new Error("Roadmap not found");
  }

  const items = snapshot.data().items || [];
  const updatedItems = items.map((item: RoadmapItem) =>
    item.id === itemId ? { ...item, status } : item
  );

  await updateDoc(roadmapRef, {
    items: updatedItems,
    updatedAt: Timestamp.now(),
  });

  // Update progress
  await updateProgressItemStatus(userId, itemId, status);
}

/**
 * Initialize progress tracking for an item
 */
async function initializeItemProgress(
  userId: string,
  item: RoadmapItem
): Promise<void> {
  const progressRef = doc(
    db,
    `roadmapProgress/${userId}/items/${item.id}`
  );

  await setDoc(
    progressRef,
    {
      userId,
      itemId: item.id,
      itemTitle: item.title,
      status: item.status,
      completedAt: item.status === "done" ? Timestamp.now() : null,
      startedAt:
        item.status === "in-progress" ? Timestamp.now() : Timestamp.now(),
      updatedAt: Timestamp.now(),
    },
    { merge: true }
  );
}

/**
 * Update progress item status
 */
async function updateProgressItemStatus(
  userId: string,
  itemId: string,
  status: "done" | "in-progress" | "upcoming"
): Promise<void> {
  const progressRef = doc(
    db,
    `roadmapProgress/${userId}/items/${itemId}`
  );

  await updateDoc(progressRef, {
    status,
    completedAt: status === "done" ? Timestamp.now() : null,
    startedAt:
      status === "in-progress" ? Timestamp.now() : Timestamp.now(),
    updatedAt: Timestamp.now(),
  });
}

/**
 * Get all progress items for a user
 */
export async function getUserProgress(userId: string): Promise<any[]> {
  const progressRef = collection(db, `roadmapProgress/${userId}/items`);
  const snapshot = await getDocs(progressRef);

  return snapshot.docs.map((doc) => doc.data());
}
