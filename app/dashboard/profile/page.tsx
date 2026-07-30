"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import TopBar from "@/components/dashboard/TopBar";
import Card from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";
import Button from "@/components/ui/Button";
import { formatINR } from "@/lib/utils";
import { CheckCircle2 } from "lucide-react";

interface ProfileData {
  goal: string;
  branch: string;
  skills: string[];
  interests: string[];
  learningStyle: string;
  dailyStudyHours: number;
  monthlyBudget: number;
}

const GOALS = ["Software Engineer", "Data Scientist", "Product Manager", "Designer", "Not sure yet"];
const BRANCHES = ["Computer Science", "Electronics", "Mechanical", "Civil", "Other"];
const LEARNING_STYLES = ["visual", "reading", "hands-on", "mixed"];
const SKILL_OPTIONS = ["Python", "JavaScript", "Java", "React", "Node.js", "SQL", "Git", "Design"];
const INTEREST_OPTIONS = ["Web Dev", "AI/ML", "Robotics", "Finance", "Design", "Content", "Gaming", "Product"];

export default function ProfilePage() {
  const { user, signOut } = useAuth();
  const router = useRouter();
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [signingOut, setSigningOut] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (!user) return;

    const loadProfile = async () => {
      try {
        const profileRef = doc(db, "profiles", user.uid);
        const snapshot = await getDoc(profileRef);
        if (snapshot.exists()) {
          setProfile(snapshot.data() as ProfileData);
        } else {
          setProfile({
            goal: "",
            branch: "",
            skills: [],
            interests: [],
            learningStyle: "mixed",
            dailyStudyHours: 2,
            monthlyBudget: 10000,
          });
        }
      } catch (error) {
        console.error("Failed to load profile:", error);
      } finally {
        setLoading(false);
      }
    };

    loadProfile();
  }, [user]);

  const handleSave = async () => {
    if (!user || !profile) return;

    setSaving(true);
    try {
      const profileRef = doc(db, "profiles", user.uid);
      await setDoc(profileRef, profile, { merge: true });
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (error) {
      console.error("Failed to save profile:", error);
    } finally {
      setSaving(false);
    }
  };

  const handleSignOut = async () => {
    try {
      setSigningOut(true);
      await signOut();
      router.push("/login");
    } catch (error) {
      console.error("Sign out failed:", error);
      setSigningOut(false);
    }
  };

  if (loading) {
    return (
      <>
        <TopBar title="Profile" />
        <Card>Loading profile...</Card>
      </>
    );
  }

  if (!profile) {
    return (
      <>
        <TopBar title="Profile" />
        <Card>Failed to load profile</Card>
      </>
    );
  }

  return (
    <>
      <TopBar title="Profile" />
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* User Info Card */}
        <Card className="text-center">
          <div className="h-20 w-20 mx-auto rounded-full bg-gradient-primary grid place-items-center text-white text-2xl font-display font-semibold">
            {user?.email?.split("@")[0]?.slice(0, 2).toUpperCase() || "U"}
          </div>
          <p className="mt-4 font-display font-semibold text-lg text-ink">{user?.email}</p>
          <div className="mt-6 space-y-2">
            {saved && (
              <div className="flex items-center justify-center gap-2 text-sm text-success mb-2">
                <CheckCircle2 size={16} />
                Profile saved!
              </div>
            )}
            <Button
              onClick={handleSave}
              disabled={saving}
              size="sm"
              className="w-full"
            >
              {saving ? "Saving..." : "Save Profile"}
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="w-full text-danger"
              onClick={handleSignOut}
              disabled={signingOut}
            >
              {signingOut ? "Signing out..." : "Sign out"}
            </Button>
          </div>
        </Card>

        {/* Learning Profile Form */}
        <Card className="lg:col-span-2">
          <h3 className="font-display font-semibold text-ink mb-6">Learning Profile</h3>
          <div className="space-y-6">
            {/* Career Goal */}
            <div>
              <label className="block text-sm font-medium text-ink mb-2">Career Goal *</label>
              <select
                value={profile.goal}
                onChange={(e) => setProfile({ ...profile, goal: e.target.value })}
                className="w-full px-3 py-2 border border-border rounded-lg text-ink focus:outline-none focus:ring-2 focus:ring-primary-600"
              >
                <option value="">Select your goal...</option>
                {GOALS.map((g) => (
                  <option key={g} value={g}>{g}</option>
                ))}
              </select>
            </div>

            {/* Branch */}
            <div>
              <label className="block text-sm font-medium text-ink mb-2">Branch/Major *</label>
              <select
                value={profile.branch}
                onChange={(e) => setProfile({ ...profile, branch: e.target.value })}
                className="w-full px-3 py-2 border border-border rounded-lg text-ink focus:outline-none focus:ring-2 focus:ring-primary-600"
              >
                <option value="">Select your branch...</option>
                {BRANCHES.map((b) => (
                  <option key={b} value={b}>{b}</option>
                ))}
              </select>
            </div>

            {/* Learning Style */}
            <div>
              <label className="block text-sm font-medium text-ink mb-2">Learning Style</label>
              <select
                value={profile.learningStyle}
                onChange={(e) => setProfile({ ...profile, learningStyle: e.target.value })}
                className="w-full px-3 py-2 border border-border rounded-lg text-ink focus:outline-none focus:ring-2 focus:ring-primary-600"
              >
                {LEARNING_STYLES.map((style) => (
                  <option key={style} value={style} className="capitalize">{style}</option>
                ))}
              </select>
            </div>

            {/* Daily Study Hours */}
            <div>
              <label className="block text-sm font-medium text-ink mb-2">Daily Study Hours</label>
              <input
                type="number"
                min="0"
                max="24"
                value={profile.dailyStudyHours}
                onChange={(e) => setProfile({ ...profile, dailyStudyHours: parseInt(e.target.value) || 0 })}
                className="w-full px-3 py-2 border border-border rounded-lg text-ink focus:outline-none focus:ring-2 focus:ring-primary-600"
              />
            </div>

            {/* Monthly Budget */}
            <div>
              <label className="block text-sm font-medium text-ink mb-2">Monthly Budget (₹)</label>
              <input
                type="number"
                min="0"
                value={profile.monthlyBudget}
                onChange={(e) => setProfile({ ...profile, monthlyBudget: parseInt(e.target.value) || 0 })}
                className="w-full px-3 py-2 border border-border rounded-lg text-ink focus:outline-none focus:ring-2 focus:ring-primary-600"
              />
            </div>

            {/* Skills */}
            <div>
              <label className="block text-sm font-medium text-ink mb-2">Skills (Select all that apply)</label>
              <div className="flex flex-wrap gap-2">
                {SKILL_OPTIONS.map((skill) => (
                  <button
                    key={skill}
                    onClick={() => {
                      if (profile.skills.includes(skill)) {
                        setProfile({ ...profile, skills: profile.skills.filter((s) => s !== skill) });
                      } else {
                        setProfile({ ...profile, skills: [...profile.skills, skill] });
                      }
                    }}
                    className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                      profile.skills.includes(skill)
                        ? "bg-primary-600 text-white"
                        : "bg-primary-50 text-primary-700 hover:bg-primary-100"
                    }`}
                  >
                    {skill}
                  </button>
                ))}
              </div>
            </div>

            {/* Interests */}
            <div>
              <label className="block text-sm font-medium text-ink mb-2">Interests (Select all that apply)</label>
              <div className="flex flex-wrap gap-2">
                {INTEREST_OPTIONS.map((interest) => (
                  <button
                    key={interest}
                    onClick={() => {
                      if (profile.interests.includes(interest)) {
                        setProfile({ ...profile, interests: profile.interests.filter((i) => i !== interest) });
                      } else {
                        setProfile({ ...profile, interests: [...profile.interests, interest] });
                      }
                    }}
                    className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                      profile.interests.includes(interest)
                        ? "bg-primary-600 text-white"
                        : "bg-primary-50 text-primary-700 hover:bg-primary-100"
                    }`}
                  >
                    {interest}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </Card>
      </div>
    </>
  );
}
