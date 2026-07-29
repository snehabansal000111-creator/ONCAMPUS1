import Link from "next/link";
import { Compass } from "lucide-react";

const columns = [
  {
    title: "Product",
    links: ["Features", "Roadmap", "Mentor Connect", "Expense Tracker"],
  },
  {
    title: "Company",
    links: ["About", "Careers", "Contact"],
  },
  {
    title: "Legal",
    links: ["Privacy", "Terms"],
  },
];

export default function Footer() {
  return (
    <footer className="section-pad py-14 border-t border-border">
      <div className="max-w-6xl mx-auto grid grid-cols-2 md:grid-cols-5 gap-8">
        <div className="col-span-2">
          <Link href="/" className="flex items-center gap-2 font-display font-semibold text-lg">
            <span className="grid h-8 w-8 place-items-center rounded-xl2 bg-gradient-primary text-white">
              <Compass size={18} />
            </span>
            ONCampus
          </Link>
          <p className="mt-3 text-sm text-muted max-w-xs">
            The AI companion that personalizes college from day one.
          </p>
        </div>
        {columns.map((c) => (
          <div key={c.title}>
            <p className="text-sm font-medium text-ink">{c.title}</p>
            <ul className="mt-3 space-y-2">
              {c.links.map((l) => (
                <li key={l}>
                  <a href="#" className="text-sm text-muted hover:text-ink transition-colors">
                    {l}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <div className="max-w-6xl mx-auto mt-10 pt-6 border-t border-border text-xs text-muted flex flex-col md:flex-row justify-between gap-2">
        <span>© 2026 ONCampus. All rights reserved.</span>
        <span>Made for freshers, by people who remember being one.</span>
      </div>
    </footer>
  );
}
