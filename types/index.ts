export type LearningStyle = "visual" | "reading" | "hands-on" | "mixed";

export interface StudentProfile {
  id: string;
  name: string;
  avatarUrl?: string;
  branch: string;
  year: string;
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
