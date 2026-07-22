import React, { useEffect, useState } from "react";
import {
  Users, CreditCard, UserPlus, UserMinus, Plane, CalendarHeart, Heart,
  MessageCircle, Star, Flag, Tag, Loader2, TrendingUp,
} from "lucide-react";
import { base44 } from "@/api/base44Client";
import { SectionHeader } from "@/components/admin/AdminUI";

export default function Dashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");

  useEffect(() => {
    (async () => {
      try {
        const res = await base44.functions.invoke("admin-stats", {});
        setStats(res.data);
      } catch (e) {
        setErr(e.message || "Failed to load statistics");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  if (loading) return <div className="flex justify-center py-16"><Loader2 className="w-5 h-5 animate-spin text-muted-foreground" /></div>;
  if (err) return <p className="text-sm text-destructive text-center mt-10">{err}</p>;

  const t = stats.totals;
  const cards = [
    { label: "Total users", value: t.totalUsers, icon: Users },
    { label: "Active subscribers", value: t.activeSubscribers, icon: CreditCard },
    { label: "New users (30d)", value: t.newUsers, icon: UserPlus },
    { label: "Cancelled subs", value: t.cancelledSubscriptions, icon: UserMinus },
    { label: "Active trips", value: t.activeTrips, icon: Plane },
    { label: "Active events", value: t.activeEvents, icon: CalendarHeart },
    { label: "Matches", value: t.matches, icon: Heart },
    { label: "Messages", value: t.messages, icon: MessageCircle },
    { label: "Reviews", value: t.reviews, icon: Star },
    { label: "Reports", value: t.reports, icon: Flag, sub: `${t.pendingReports} pending` },
    { label: "Deals", value: t.deals, icon: Tag },
  ];

  return (
    <div>
      <SectionHeader title="Overview" subtitle="Live platform statistics" />

      <div className="rounded-2xl border border-border bg-gradient-to-br from-[#A1846B]/10 to-[#CBB8A5]/20 p-5 mb-4">
        <div className="flex items-center gap-2 text-[#7a5c44]">
          <TrendingUp className="w-4 h-4" strokeWidth={1.5} />
          <span className="text-xs uppercase tracking-wide">Estimated revenue</span>
        </div>
        <p className="font-display font-semibold text-3xl mt-1">${stats.revenue.mrr.toLocaleString()}<span className="text-base text-muted-foreground font-body">/mo</span></p>
        <p className="text-xs text-muted-foreground mt-1">
          MRR · ~${stats.revenue.arr.toLocaleString()}/yr · {stats.revenue.activeSubscribers} paying members
        </p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {cards.map((c) => (
          <div key={c.label} className="rounded-2xl border border-border bg-card p-4">
            <c.icon className="w-4 h-4 text-[#A1846B] mb-2" strokeWidth={1.5} />
            <p className="font-display font-semibold text-2xl">{c.value.toLocaleString()}</p>
            <p className="text-[11px] text-muted-foreground leading-tight mt-0.5">{c.label}</p>
            {c.sub && <p className="text-[10px] text-amber-600 mt-0.5">{c.sub}</p>}
          </div>
        ))}
      </div>
    </div>
  );
}