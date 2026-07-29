import type {
  StudentProfile,
  RoadmapItem,
  Mentor,
  Transaction,
  SmsDetectedTransaction,
  AlertItem,
} from "@/types";

export const currentStudent: StudentProfile = {
  id: "stu_001",
  name: "Riya Sharma",
  branch: "Computer Science",
  year: "1st Year",
  interests: ["Web Development", "AI/ML", "UI Design"],
  skills: ["Python (basic)", "HTML/CSS"],
  careerGoal: "Frontend Engineer",
  learningStyle: "hands-on",
  monthlyBudget: 12000,
  dailyStudyHours: 3,
};

export const roadmap: RoadmapItem[] = [
  { id: "r1", title: "Git & GitHub basics", status: "done", category: "Tools" },
  { id: "r2", title: "JavaScript fundamentals", status: "done", category: "Core" },
  { id: "r3", title: "React fundamentals", status: "in-progress", category: "Core" },
  { id: "r4", title: "Build a portfolio site", status: "in-progress", category: "Project" },
  { id: "r5", title: "TypeScript basics", status: "upcoming", category: "Core" },
  { id: "r6", title: "DSA — Arrays & Strings", status: "upcoming", category: "Interview Prep" },
];

export const mentors: Mentor[] = [
  {
    id: "m1",
    name: "Arjun Mehta",
    branch: "Computer Science",
    year: "4th Year",
    company: "Incoming SDE @ Atlassian",
    skills: ["React", "System Design", "DSA"],
    compatibility: 92,
    avatarUrl: "https://i.pravatar.cc/150?img=12",
  },
  {
    id: "m2",
    name: "Sneha Iyer",
    branch: "Computer Science",
    year: "3rd Year",
    company: "ML Intern @ Razorpay",
    skills: ["Python", "ML", "Product Sense"],
    compatibility: 87,
    avatarUrl: "https://i.pravatar.cc/150?img=32",
  },
  {
    id: "m3",
    name: "Kabir Nair",
    branch: "Electronics",
    year: "4th Year",
    company: "Design Intern @ Zoho",
    skills: ["UI/UX", "Figma", "Frontend"],
    compatibility: 81,
    avatarUrl: "https://i.pravatar.cc/150?img=51",
  },
];

export const transactions: Transaction[] = [
  { id: "t1", merchant: "Zomato", category: "Food", amount: 340, date: "2026-07-27", paymentMethod: "UPI", aiTagged: true },
  { id: "t2", merchant: "Hostel Mess Fee", category: "Hostel/PG", amount: 3500, date: "2026-07-25", paymentMethod: "Bank Transfer" },
  { id: "t3", merchant: "Uber", category: "Transport", amount: 180, date: "2026-07-24", paymentMethod: "UPI", aiTagged: true },
  { id: "t4", merchant: "Amazon", category: "Shopping", amount: 1250, date: "2026-07-22", paymentMethod: "Card" },
  { id: "t5", merchant: "Udemy Course", category: "Education", amount: 499, date: "2026-07-20", paymentMethod: "Card", aiTagged: true },
  { id: "t6", merchant: "PVR Cinemas", category: "Entertainment", amount: 600, date: "2026-07-18", paymentMethod: "UPI" },
  { id: "t7", merchant: "Apollo Pharmacy", category: "Health", amount: 220, date: "2026-07-16", paymentMethod: "UPI" },
  { id: "t8", merchant: "Swiggy", category: "Food", amount: 410, date: "2026-07-15", paymentMethod: "UPI", aiTagged: true },
];

export const smsDetected: SmsDetectedTransaction[] = [
  { id: "s1", merchant: "Domino's Pizza", category: "Food", amount: 560, date: "2026-07-28", paymentMethod: "UPI", confidence: 96, status: "pending" },
  { id: "s2", merchant: "Metro Card Recharge", category: "Transport", amount: 300, date: "2026-07-28", paymentMethod: "UPI", confidence: 91, status: "pending" },
  { id: "s3", merchant: "Myntra", category: "Shopping", amount: 899, date: "2026-07-27", paymentMethod: "Card", confidence: 88, status: "pending" },
];

export const spendingByCategory = [
  { category: "Food", value: 2800, color: "#2E5EFF" },
  { category: "Shopping", value: 2150, color: "#14C7D8" },
  { category: "Transport", value: 980, color: "#5FE0E9" },
  { category: "Education", value: 1499, color: "#8AACFF" },
  { category: "Entertainment", value: 600, color: "#F59E0B" },
  { category: "Hostel/PG", value: 3500, color: "#1735AD" },
  { category: "Health", value: 220, color: "#16A34A" },
  { category: "Others", value: 350, color: "#94A3B8" },
];

export const monthlyTrend = [
  { label: "Week 1", spend: 2100 },
  { label: "Week 2", spend: 2900 },
  { label: "Week 3", spend: 2400 },
  { label: "Week 4", spend: 3600 },
];

export const alerts: AlertItem[] = [
  { id: "a1", type: "budget", title: "Budget 80% used", detail: "You've used ₹9,600 of your ₹12,000 monthly budget.", severity: "warning" },
  { id: "a2", type: "spending", title: "High spending detected", detail: "Food spending is 35% higher than last week.", severity: "warning" },
  { id: "a3", type: "unusual", title: "Unusual transaction", detail: "₹1,250 at Amazon — larger than your usual order size.", severity: "danger" },
  { id: "a4", type: "subscription", title: "Subscription reminder", detail: "Spotify Premium renews in 2 days (₹119).", severity: "info" },
  { id: "a5", type: "summary", title: "Weekly summary available", detail: "Your spending recap for July 21–27 is ready.", severity: "info" },
];
