import TopBar from "@/components/dashboard/TopBar";
import Card from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";
import ProgressBar from "@/components/ui/ProgressBar";
import Button from "@/components/ui/Button";
import Link from "next/link";
import {
  Sparkles, Map, Users, Wallet, CheckCircle2, Circle, ArrowRight,
  PlusCircle, Scan, MessageSquareText, BarChart3,
} from "lucide-react";
import { roadmap, mentors, transactions, currentStudent } from "@/lib/mock-data";
import { formatINR } from "@/lib/utils";

export default function DashboardHome() {
  const topMentor = mentors[0];
  const recentTx = transactions.slice(0, 4);
  const doneCount = roadmap.filter((r) => r.status === "done").length;

  return (
    <>
      <TopBar title="Home" />

      {/* Today's goals */}
      <Card className="bg-gradient-primary text-white border-none">
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div>
            <p className="text-xs font-medium text-white/80 uppercase tracking-wide">Today's goals</p>
            <h2 className="mt-2 text-xl font-display font-semibold">Finish React fundamentals, module 3</h2>
            <p className="mt-1 text-sm text-white/80">~45 min left based on your pace</p>
          </div>
          <Link href="/dashboard/roadmap">
            <Button variant="outline" size="sm" className="bg-white/10 border-white/30 text-white hover:bg-white/20">
              Open roadmap <ArrowRight size={14} />
            </Button>
          </Link>
        </div>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 mt-5">
        {/* Learning progress + roadmap */}
        <Card className="lg:col-span-2">
          <div className="flex items-center justify-between">
            <h3 className="font-display font-semibold text-ink flex items-center gap-2">
              <Map size={18} className="text-primary-600" /> Current roadmap
            </h3>
            <Badge tone="primary">{doneCount}/{roadmap.length} done</Badge>
          </div>
          <div className="mt-4 space-y-3">
            {roadmap.map((item) => (
              <div key={item.id} className="flex items-center gap-3 py-2 border-b border-border last:border-0">
                {item.status === "done" ? (
                  <CheckCircle2 size={18} className="text-success shrink-0" />
                ) : (
                  <Circle size={18} className={item.status === "in-progress" ? "text-primary-500 shrink-0" : "text-faint shrink-0"} />
                )}
                <div className="flex-1 min-w-0">
                  <p className={`text-sm ${item.status === "done" ? "text-muted line-through" : "text-ink font-medium"}`}>
                    {item.title}
                  </p>
                </div>
                <Badge tone={item.status === "in-progress" ? "primary" : "neutral"}>{item.category}</Badge>
              </div>
            ))}
          </div>
        </Card>

        {/* AI suggestions */}
        <Card>
          <h3 className="font-display font-semibold text-ink flex items-center gap-2">
            <Sparkles size={18} className="text-primary-600" /> AI suggestions
          </h3>
          <div className="mt-4 space-y-3 text-sm">
            <p className="text-ink leading-relaxed">
              You're strong on JS fundamentals — jump straight to React Hooks and skip the class-component chapter.
            </p>
            <p className="text-muted leading-relaxed">
              Your quiz scores dip on async topics. A 20-min focused review on Promises could help before next week's quiz.
            </p>
          </div>
          <Link href="/dashboard/assistant">
            <Button variant="secondary" size="sm" className="mt-4 w-full">Ask the assistant</Button>
          </Link>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 mt-5">
        {/* Recommended mentor */}
        <Card>
          <h3 className="font-display font-semibold text-ink flex items-center gap-2">
            <Users size={18} className="text-primary-600" /> Recommended mentor
          </h3>
          <div className="mt-4 flex items-center gap-3">
            <img src={topMentor.avatarUrl} alt="" className="h-12 w-12 rounded-full object-cover" />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-ink">{topMentor.name}</p>
              <p className="text-xs text-muted truncate">{topMentor.company}</p>
            </div>
            <Badge tone="success">{topMentor.compatibility}%</Badge>
          </div>
          <Link href="/dashboard/mentors">
            <Button variant="outline" size="sm" className="mt-4 w-full">View all mentors</Button>
          </Link>
        </Card>

        {/* Expense summary */}
        <Card>
          <h3 className="font-display font-semibold text-ink flex items-center gap-2">
            <Wallet size={18} className="text-primary-600" /> Expense summary
          </h3>
          <p className="mt-4 text-2xl font-display font-semibold text-ink">{formatINR(9600)}</p>
          <p className="text-xs text-muted">of {formatINR(currentStudent.monthlyBudget)} budget spent</p>
          <ProgressBar value={9600} max={currentStudent.monthlyBudget} tone="warning" className="mt-3" />
          <Link href="/dashboard/expenses">
            <Button variant="outline" size="sm" className="mt-4 w-full">Open expense tracker</Button>
          </Link>
        </Card>

        {/* Recent activity */}
        <Card>
          <h3 className="font-display font-semibold text-ink flex items-center gap-2">
            <BarChart3 size={18} className="text-primary-600" /> Recent activity
          </h3>
          <div className="mt-4 space-y-3">
            {recentTx.map((t) => (
              <div key={t.id} className="flex items-center justify-between text-sm">
                <span className="text-ink">{t.merchant}</span>
                <span className="text-muted font-mono">{formatINR(t.amount)}</span>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Quick actions */}
      <Card className="mt-5">
        <h3 className="font-display font-semibold text-ink">Quick actions</h3>
        <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-3">
          <Button variant="secondary" className="justify-start"><PlusCircle size={16} /> Add expense</Button>
          <Button variant="secondary" className="justify-start"><Scan size={16} /> Scan receipt</Button>
          <Button variant="secondary" className="justify-start"><MessageSquareText size={16} /> Ask assistant</Button>
          <Button variant="secondary" className="justify-start"><BarChart3 size={16} /> View reports</Button>
        </div>
      </Card>
    </>
  );
}
