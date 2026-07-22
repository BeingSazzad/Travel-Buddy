import React, { useEffect, useMemo, useState } from "react";
import { base44 } from "@/api/base44Client";
import { SectionHeader, SearchBar, ListState } from "@/components/admin/AdminUI";

const STATUS_STYLE = {
  active: "bg-green-100 text-green-700",
  cancelled_active: "bg-amber-100 text-amber-700",
  expired: "bg-muted text-muted-foreground",
  payment_failed: "bg-red-100 text-red-700",
  none: "bg-muted text-muted-foreground",
  pending: "bg-blue-100 text-blue-700",
};

const name = (u) => u?.profile_name || u?.first_name || (u?.email ? u.email.split("@")[0] : "User");
const planMrr = (p) => (p === "yearly" ? 99 / 12 : 12);

export default function Subscriptions() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [q, setQ] = useState("");
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    (async () => {
      try {
        const list = await base44.entities.User.list("-created_date", 500);
        setUsers(list);
      } catch (e) {
        setUsers([]);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const subs = useMemo(
    () => users.filter((u) => u.subscription_status && u.subscription_status !== "none"),
    [users]
  );
  const filtered = useMemo(() => {
    const query = q.trim().toLowerCase();
    return subs.filter((u) => {
      const matchF = filter === "all" || u.subscription_status === filter;
      const matchQ = !query || [name(u), u.email].filter(Boolean).some((s) => s.toLowerCase().includes(query));
      return matchF && matchQ;
    });
  }, [subs, q, filter]);

  const mrr = subs.filter((u) => ["active", "cancelled_active"].includes(u.subscription_status)).reduce((s, u) => s + planMrr(u.subscription_plan), 0);

  return (
    <div>
      <SectionHeader title="Subscriptions" subtitle={`${subs.length} members with a subscription · est. MRR $${Math.round(mrr)}`} />
      <SearchBar value={q} onChange={setQ} placeholder="Search members…" />
      <div className="flex gap-1.5 overflow-x-auto no-scrollbar pb-2 mb-2">
        {["all", "active", "cancelled_active", "expired", "payment_failed"].map((s) => (
          <button
            key={s}
            onClick={() => setFilter(s)}
            className={`px-3 py-1.5 rounded-full text-xs whitespace-nowrap capitalize ${filter === s ? "bg-foreground text-background" : "bg-muted text-muted-foreground"}`}
          >
            {s.replace(/_/g, " ")}
          </button>
        ))}
      </div>
      <ListState loading={loading} empty={filtered.length === 0} emptyText="No subscriptions match.">
        <div className="space-y-2">
          {filtered.map((u) => (
            <div key={u.id} className="flex items-center gap-3 p-3 rounded-2xl border border-border bg-card">
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">{name(u)}</p>
                <p className="text-xs text-muted-foreground truncate">{u.email}</p>
              </div>
              <div className="text-right text-xs">
                <span className={`px-2 py-0.5 rounded-full capitalize ${STATUS_STYLE[u.subscription_status] || "bg-muted"}`}>
                  {u.subscription_status.replace(/_/g, " ")}
                </span>
                <p className="text-[11px] text-muted-foreground mt-1 capitalize">{u.subscription_plan || "—"}</p>
                {u.subscription_current_period_end && (
                  <p className="text-[10px] text-muted-foreground">{new Date(u.subscription_current_period_end).toLocaleDateString()}</p>
                )}
              </div>
            </div>
          ))}
        </div>
      </ListState>
    </div>
  );
}