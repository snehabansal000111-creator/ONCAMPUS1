import Sidebar from "@/components/dashboard/Sidebar";
import BottomNav from "@/components/dashboard/BottomNav";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex bg-surface min-h-screen">
      <Sidebar />
      <div className="flex-1 min-w-0">
        <div className="section-pad pb-24 md:pb-10 max-w-6xl mx-auto">{children}</div>
      </div>
      <BottomNav />
    </div>
  );
}
