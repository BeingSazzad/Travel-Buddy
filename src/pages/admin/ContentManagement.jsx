import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { base44 } from "@/api/base44Client";
import { SectionHeader } from "@/components/admin/AdminUI";
import { Loader2, ChevronRight, Star, CalendarHeart, Flag, Tag, FileText, Sparkles } from "lucide-react";

export default function ContentManagement() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const res = await base44.functions.invoke("admin-stats", {});
        setStats(res.data.totals);
      } catch (e) {
        setStats(null);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  if (loading) return <div className="flex justify-center py-16"><Loader2 className="w-5 h-5 animate-spin text-muted-foreground" /></div>;

  const links = [
    { to: "/admin/reviews", label: "Reviews", count: stats?.reviews, icon: Star },
    { to: "/admin/events", label: "Events", count: stats?.activeEvents, icon: CalendarHeart },
    { to: "/admin/featured", label: "Featured", count: null, icon: Sparkles },
    { to: "/admin/reports", label: "Reports", count: stats?.reports, icon: Flag },
    { to: "/admin/deals", label: "Deals", count: stats?.deals, icon: Tag },
    { to: "/admin/destinations", label: "Destinations", count: null, icon: FileText },
  ];

  return (
    <div>
      <SectionHeader title="Content Management" subtitle="Overview of moderated and curated content" />
      <div className="space-y-2">
        {links.map((l) => (
          <Link key={l.label} to={l.to} className="flex items-center gap-3 p-3 rounded-2xl border border-border bg-card active:scale-[0.99] transition">
            <div className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center">
              <l.icon className="w-4 h-4 text-brand-strong" strokeWidth={1.5} />
            </div>
            <span className="flex-1 text-sm font-medium">{l.label}</span>
            {typeof l.count === "number" && <span className="text-xs text-muted-foreground">{l.count}</span>}
            <ChevronRight className="w-4 h-4 text-muted-foreground" strokeWidth={1.5} />
          </Link>
        ))}
      </div>
      <p className="text-xs text-muted-foreground mt-4 text-center">
        Static destination, café, restaurant and hotel guides are managed in the curated content library.
      </p>
    </div>
  );
}