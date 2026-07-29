"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import TopBar from "@/components/dashboard/TopBar";
import Card from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";
import Button from "@/components/ui/Button";
import { useAuth } from "@/hooks/useAuth";
import { currentStudent } from "@/lib/mock-data";
import { formatINR } from "@/lib/utils";

export default function ProfilePage() {
  const { signOut } = useAuth();
  const router = useRouter();
  const [signingOut, setSigningOut] = useState(false);
  const s = currentStudent;

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
  return (
    <>
      <TopBar title="Profile" />
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <Card className="md:col-span-1 text-center">
          <div className="h-20 w-20 mx-auto rounded-full bg-gradient-primary grid place-items-center text-white text-2xl font-display font-semibold">
            {s.name.split(" ").map((n) => n[0]).join("")}
          </div>
          <p className="mt-4 font-display font-semibold text-lg text-ink">{s.name}</p>
          <p className="text-sm text-muted">{s.branch} · {s.year}</p>
          <div className="mt-5 space-y-2">
            <Button variant="outline" size="sm" className="w-full">Edit profile</Button>
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

        <Card className="md:col-span-2">
          <h3 className="font-display font-semibold text-ink">Learning profile</h3>
          <dl className="mt-4 grid grid-cols-2 gap-y-4 text-sm">
            <div>
              <dt className="text-muted">Career goal</dt>
              <dd className="text-ink font-medium mt-0.5">{s.careerGoal}</dd>
            </div>
            <div>
              <dt className="text-muted">Learning style</dt>
              <dd className="text-ink font-medium mt-0.5 capitalize">{s.learningStyle}</dd>
            </div>
            <div>
              <dt className="text-muted">Monthly budget</dt>
              <dd className="text-ink font-medium mt-0.5">{formatINR(s.monthlyBudget)}</dd>
            </div>
            <div>
              <dt className="text-muted">Daily study hours</dt>
              <dd className="text-ink font-medium mt-0.5">{s.dailyStudyHours}h</dd>
            </div>
          </dl>

          <div className="mt-5">
            <p className="text-sm text-muted mb-2">Skills</p>
            <div className="flex flex-wrap gap-1.5">
              {s.skills.map((sk) => <Badge key={sk} tone="primary">{sk}</Badge>)}
            </div>
          </div>
          <div className="mt-4">
            <p className="text-sm text-muted mb-2">Interests</p>
            <div className="flex flex-wrap gap-1.5">
              {s.interests.map((it) => <Badge key={it} tone="neutral">{it}</Badge>)}
            </div>
          </div>
        </Card>
      </div>
    </>
  );
}
