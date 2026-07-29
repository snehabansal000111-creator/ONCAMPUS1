"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Compass, ArrowRight, ArrowLeft, Check } from "lucide-react";
import Button from "@/components/ui/Button";
import ProgressBar from "@/components/ui/ProgressBar";
import { cn } from "@/lib/utils";
import { useAuth } from "@/hooks/useAuth";
import { useProfile } from "@/hooks/useProfile";

const BRANCHES = ["Computer Science", "Electronics", "Mechanical", "Civil", "Other"];
const SKILLS = ["Python", "JavaScript", "HTML/CSS", "Excel", "Design", "None yet"];
const INTERESTS = ["Web Dev", "AI/ML", "Design", "Robotics", "Finance", "Content", "Gaming", "Product"];
const GOALS = ["Software Engineer", "Data Scientist", "Product Manager", "Designer", "Not sure yet"];
const STYLES = [
  { id: "visual", label: "Visual", desc: "Diagrams, videos, mind maps" },
  { id: "reading", label: "Reading", desc: "Docs, articles, structured notes" },
  { id: "hands-on", label: "Hands-on", desc: "Projects and practice first" },
  { id: "mixed", label: "Mixed", desc: "A bit of everything" },
];

const STEPS = ["Branch", "Skills", "Interests", "Goal", "Learning style", "Budget & time"];

function Chip({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "px-4 py-2 rounded-full text-sm font-medium border transition-all duration-200",
        active
          ? "bg-gradient-primary text-white border-transparent shadow-lift"
          : "bg-white border-border text-muted hover:border-primary-300 hover:text-ink"
      )}
    >
      {children}
    </button>
  );
}

export default function OnboardingPage() {
  const router = useRouter();
  const { user } = useAuth();
  const { saveProfile } = useProfile();
  const [step, setStep] = useState(0);
  const [branch, setBranch] = useState("");
  const [skills, setSkills] = useState<string[]>([]);
  const [interests, setInterests] = useState<string[]>([]);
  const [goal, setGoal] = useState("");
  const [style, setStyle] = useState("");
  const [budget, setBudget] = useState(10000);
  const [hours, setHours] = useState(2);
  const [saving, setSaving] = useState(false);

  const toggle = (arr: string[], setArr: (v: string[]) => void, item: string) =>
    setArr(arr.includes(item) ? arr.filter((i) => i !== item) : [...arr, item]);

  const canProceed = [
    !!branch,
    skills.length > 0,
    interests.length > 0,
    !!goal,
    !!style,
    true,
  ][step];

  const next = async () => {
    if (step < STEPS.length - 1) {
      setStep(step + 1);
    } else {
      try {
        setSaving(true);
        if (user?.uid) {
          await saveProfile(user.uid, {
            branch,
            skills,
            interests,
            goal,
            learningStyle: style,
            monthlyBudget: budget,
            dailyStudyHours: hours,
          });
        }
        router.push("/dashboard");
      } catch (error) {
        console.error("Failed to save profile:", error);
        setSaving(false);
      }
    }
  };

  return (
    <main className="min-h-screen bg-gradient-radiant flex flex-col items-center section-pad py-12">
      <div className="flex items-center gap-2 font-display font-semibold text-lg">
        <span className="grid h-8 w-8 place-items-center rounded-xl2 bg-gradient-primary text-white">
          <Compass size={18} />
        </span>
        ONCampus
      </div>

      <div className="w-full max-w-xl mt-10">
        <div className="flex items-center justify-between text-xs text-muted mb-2">
          <span>Step {step + 1} of {STEPS.length}</span>
          <span>{STEPS[step]}</span>
        </div>
        <ProgressBar value={step + 1} max={STEPS.length} />

        <div className="glass-card mt-8 p-8 min-h-[340px] flex flex-col">
          <AnimatePresence mode="wait">
            <motion.div
              key={step}
              initial={{ opacity: 0, x: 24 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -24 }}
              transition={{ duration: 0.3 }}
              className="flex-1"
            >
              {step === 0 && (
                <>
                  <h2 className="text-xl font-display font-semibold text-ink">What's your branch?</h2>
                  <p className="text-sm text-muted mt-1">This shapes the roadmap and mentor matches.</p>
                  <div className="mt-6 flex flex-wrap gap-2.5">
                    {BRANCHES.map((b) => (
                      <Chip key={b} active={branch === b} onClick={() => setBranch(b)}>{b}</Chip>
                    ))}
                  </div>
                </>
              )}

              {step === 1 && (
                <>
                  <h2 className="text-xl font-display font-semibold text-ink">What do you already know?</h2>
                  <p className="text-sm text-muted mt-1">Pick everything that applies — this helps us skip what you know.</p>
                  <div className="mt-6 flex flex-wrap gap-2.5">
                    {SKILLS.map((s) => (
                      <Chip key={s} active={skills.includes(s)} onClick={() => toggle(skills, setSkills, s)}>{s}</Chip>
                    ))}
                  </div>
                </>
              )}

              {step === 2 && (
                <>
                  <h2 className="text-xl font-display font-semibold text-ink">What are you curious about?</h2>
                  <p className="text-sm text-muted mt-1">Pick a few — these shape roadmap suggestions and mentor matches.</p>
                  <div className="mt-6 flex flex-wrap gap-2.5">
                    {INTERESTS.map((i) => (
                      <Chip key={i} active={interests.includes(i)} onClick={() => toggle(interests, setInterests, i)}>{i}</Chip>
                    ))}
                  </div>
                </>
              )}

              {step === 3 && (
                <>
                  <h2 className="text-xl font-display font-semibold text-ink">Where are you headed?</h2>
                  <p className="text-sm text-muted mt-1">A rough direction is enough — you can change this anytime.</p>
                  <div className="mt-6 flex flex-wrap gap-2.5">
                    {GOALS.map((g) => (
                      <Chip key={g} active={goal === g} onClick={() => setGoal(g)}>{g}</Chip>
                    ))}
                  </div>
                </>
              )}

              {step === 4 && (
                <>
                  <h2 className="text-xl font-display font-semibold text-ink">How do you learn best?</h2>
                  <p className="text-sm text-muted mt-1">The assistant adapts its explanations to this.</p>
                  <div className="mt-6 grid grid-cols-2 gap-3">
                    {STYLES.map((s) => (
                      <button
                        key={s.id}
                        onClick={() => setStyle(s.id)}
                        className={cn(
                          "text-left p-4 rounded-xl2 border transition-all duration-200",
                          style === s.id
                            ? "border-primary-500 bg-primary-50"
                            : "border-border bg-white hover:border-primary-300"
                        )}
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-medium text-sm text-ink">{s.label}</span>
                          {style === s.id && <Check size={16} className="text-primary-600" />}
                        </div>
                        <p className="text-xs text-muted mt-1">{s.desc}</p>
                      </button>
                    ))}
                  </div>
                </>
              )}

              {step === 5 && (
                <>
                  <h2 className="text-xl font-display font-semibold text-ink">Budget & study time</h2>
                  <p className="text-sm text-muted mt-1">Rough numbers are fine — the AI refines these over time.</p>
                  <div className="mt-7 space-y-8">
                    <div>
                      <div className="flex justify-between text-sm">
                        <span className="text-ink font-medium">Monthly budget</span>
                        <span className="text-primary-600 font-mono font-semibold">₹{budget.toLocaleString("en-IN")}</span>
                      </div>
                      <input
                        type="range"
                        min={2000}
                        max={30000}
                        step={500}
                        value={budget}
                        onChange={(e) => setBudget(Number(e.target.value))}
                        className="w-full mt-3 accent-primary-600"
                      />
                    </div>
                    <div>
                      <div className="flex justify-between text-sm">
                        <span className="text-ink font-medium">Daily study hours</span>
                        <span className="text-primary-600 font-mono font-semibold">{hours}h</span>
                      </div>
                      <input
                        type="range"
                        min={0.5}
                        max={8}
                        step={0.5}
                        value={hours}
                        onChange={(e) => setHours(Number(e.target.value))}
                        className="w-full mt-3 accent-primary-600"
                      />
                    </div>
                  </div>
                </>
              )}
            </motion.div>
          </AnimatePresence>

          <div className="flex items-center justify-between mt-8 pt-6 border-t border-border">
            <Button variant="ghost" onClick={() => setStep(Math.max(0, step - 1))} disabled={step === 0 || saving}>
              <ArrowLeft size={16} /> Back
            </Button>
            <Button variant="primary" onClick={next} disabled={!canProceed || saving}>
              {saving ? "Saving..." : step === STEPS.length - 1 ? "Build my roadmap" : "Continue"}
              <ArrowRight size={16} />
            </Button>
          </div>
        </div>
      </div>
    </main>
  );
}
