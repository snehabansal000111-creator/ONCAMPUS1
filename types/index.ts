export type LearningStyle = "visual" | "reading" | "hands-on" | "mixed";

export interface StudentProfile {
  id: string;
  name: string;
  avatarUrl?: string;
  branch: string;
  year: string;
  background?: string;
  interests: string[];
  skills: string[];
  careerGoal: string;
  learningStyle: LearningStyle;
  monthlyBudget: number;
  dailyStudyHours: number;
}

export interface RoadmapItem {
  id: string;
  title: string;
  status: "done" | "in-progress" | "upcoming";
  category: string;
}

export interface Mentor {
  id: string;
  name: string;
  branch: string;
  year: string;
  company?: string;
  skills: string[];
  compatibility: number;
  avatarUrl: string;
}

export type ExpenseCategory =
  | "Food"
  | "Shopping"
  | "Transport"
  | "Education"
  | "Entertainment"
  | "Hostel/PG"
  | "Health"
  | "Others";

export interface Transaction {
  id: string;
  merchant: string;
  category: ExpenseCategory;
  amount: number;
  date: string;
  paymentMethod: string;
  aiTagged?: boolean;
}

export interface SmsDetectedTransaction extends Transaction {
  confidence: number;
  status: "pending" | "accepted" | "ignored";
}

export interface AlertItem {
  id: string;
  type: "budget" | "spending" | "unusual" | "subscription" | "summary";
  title: string;
  detail: string;
  severity: "info" | "warning" | "danger";
}

export interface RoadmapProject {
  title: string;
  description: string;
  duration: string;
}

export interface RoadmapResource {
  title: string;
  type: string;
  url?: string;
  cost?: string;
}

export interface RoadmapPractice {
  activity: string;
  frequency: string;
}

export interface RoadmapPhase {
  name: "Beginner" | "Intermediate" | "Advanced";
  duration: string;
  topics: string[];
  milestones: string[];
  projects: RoadmapProject[];
  resources: RoadmapResource[];
  practice: RoadmapPractice[];
}

export interface Roadmap {
  id: string;
  user_id: string;
  topic: string;
  beginner: RoadmapPhase;
  intermediate: RoadmapPhase;
  advanced: RoadmapPhase;
  created_at: string;
  updated_at: string;
}

export type QuestionType = "mcq" | "coding" | "short_answer";
export type QuizDifficulty = "easy" | "medium" | "hard";

export interface MCQOption {
  id: string;
  text: string;
  isCorrect: boolean;
}

export interface MCQQuestion {
  id: string;
  type: "mcq";
  difficulty: QuizDifficulty;
  topic: string;
  question: string;
  options: MCQOption[];
  explanation: string;
}

export interface CodingQuestion {
  id: string;
  type: "coding";
  difficulty: QuizDifficulty;
  topic: string;
  question: string;
  description: string;
  examples: Array<{ input: string; output: string }>;
  testCases: Array<{ input: string; expectedOutput: string }>;
  boilerplate: string;
  explanation: string;
}

export interface ShortAnswerQuestion {
  id: string;
  type: "short_answer";
  difficulty: QuizDifficulty;
  topic: string;
  question: string;
  keyPoints: string[];
  sampleAnswer: string;
  explanation: string;
}

export type Question = MCQQuestion | CodingQuestion | ShortAnswerQuestion;

export interface Quiz {
  id: string;
  user_id: string;
  roadmap_id?: string;
  topic: string;
  difficulty: QuizDifficulty;
  questions: Question[];
  totalQuestions: number;
  created_at: string;
  updated_at: string;
}

export type ResourceType = "documentation" | "youtube" | "github" | "course" | "practice" | "book";
export type CareerPath = "frontend" | "backend" | "fullstack" | "mobile" | "data-science" | "devops" | "ui-ux" | "general";
export type ResourceLevel = "beginner" | "intermediate" | "advanced";

export interface Resource {
  id: string;
  title: string;
  type: ResourceType;
  url: string;
  description: string;
  cost: "free" | "paid" | "freemium";
  careerPaths: CareerPath[];
  skillLevels: ResourceLevel[];
  roadmapStages: ResourceLevel[]; // Useful at which stages
  topics: string[];
  rating: number;
  reviewed: boolean;
  tags: string[];
  language: string;
}

export interface ResourceRecommendation {
  id: string;
  user_id: string;
  topic: string;
  career_goal: string;
  skill_level: string;
  roadmap_stage: string;
  resources: Resource[];
  created_at: string;
  updated_at: string;
}

export interface TopicProgress {
  id: string;
  user_id: string;
  topic: string;
  completed_at: string;
  time_spent_minutes: number;
}

export interface QuizProgress {
  id: string;
  user_id: string;
  quiz_id: string;
  score: number;
  completed_at: string;
}

export interface ProjectProgress {
  id: string;
  user_id: string;
  project_title: string;
  status: "started" | "in-progress" | "completed";
  started_at: string;
  completed_at?: string;
}

export interface RoadmapItemProgress {
  id: string;
  user_id: string;
  roadmap_id: string;
  item_title: string;
  phase: "beginner" | "intermediate" | "advanced";
  completed: boolean;
  completed_at?: string;
}

export interface WeeklyProgressData {
  date: string;
  topics_completed: number;
  quizzes_completed: number;
  projects_completed: number;
  time_spent_minutes: number;
}

export interface ProgressSummary {
  user_id: string;
  total_topics_completed: number;
  total_quizzes_completed: number;
  total_projects_completed: number;
  overall_completion_percentage: number;
  roadmap_completion_percentage: number;
  learning_streak_days: number;
  weekly_progress: WeeklyProgressData[];
  last_activity_date: string;
  created_at: string;
}
