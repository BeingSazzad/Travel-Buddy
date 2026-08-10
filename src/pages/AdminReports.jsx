import React, { useEffect, useState, useCallback } from "react";
import { base44 } from "@/api/base44Client";
import { REPORT_REASONS } from "@/components/reports/ReportSheet";
import { SectionHeader, ListState } from "@/components/admin/AdminUI";

const TYPE_LABEL = {
  profile: "Profile", message: "Message", event: "Event",
  review: "Review", photo: "Photo", place: "Place",
};
const REASON_LABEL = Object.fromEntries(REPORT_REASONS.map((r) => [r.value, r.label]));
const STATUS_STYLE = {
  pending: "bg-[#A1846B]/10 text-[#7a5c44]",
  reviewing: "bg-amber-100 text-amber-700",
  resolved: "bg-green-100 text-green-700",
  dismissed: "bg-muted text-muted-foreground",
};
const STATUSES = ["pending", "reviewing", "resolved", "dismissed"];

export default function AdminReports() {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("pending");

  const load = useCallback(async () => {
    try {
      const list = await base44.entities.Report.list("-created_date", 200);
      setReports(list);
    } catch (e) {
      setReports([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
    const unsub = base44.entities.Report.subscribe(load);
    return unsub;
  }, [load]);

  const counts = reports.reduce((acc, r) => { acc[r.status] = (acc[r.status] || 0) + 1; return acc; }, {});
  const shown = filter === "all" ? reports : reports.filter((r) => r.status === filter);

  const setStatus = async (id, status) => {
    try { await base44.entities.Report.update(id, { status }); } catch (e) {}
  };

  return (
    <div>
      <SectionHeader title="Reports" subtitle={`${reports.length} total · moderation queue`} />

      <div className="flex gap-2 overflow-x-auto no-scrollbar pb-2 mb-2">
        {[{ k: "pending", l: "Pending" }, { k: "reviewing", l: "Reviewing" }, { k: "resolved", l: "Resolved" }, { k: "dismissed", l: "Dismissed" }, { k: "all", l: "All" }].map((s) => (
          <button
            key={s.k}
            onClick={() => setFilter(s.k)}
            className={`px-3 py-1.5 rounded-full text-xs whitespace-nowrap ${filter === s.k ? "bg-foreground text-background" : "bg-muted text-muted-foreground"}`}
          >
            {s.l} {counts[s.k] ? `· ${counts[s.k]}` : ""}
          </button>
        ))}
      </div>

      <ListState loading={loading} empty={shown.length === 0} emptyText="No reports in this view.">
        <div className="space-y-3">
          {shown.map((r) => (
            <div key={r.id} className="rounded-2xl border border-border bg-card p-4">
              <div className="flex items-center justify-between gap-2">
                <span className="text-[10px] uppercase tracking-wide text-muted-foreground">{TYPE_LABEL[r.reported_type]}</span>
                <span className={`text-[10px] px-2 py-0.5 rounded-full ${STATUS_STYLE[r.status]}`}>{r.status}</span>
              </div>
              <p className="font-medium text-sm mt-1">{r.reported_title}</p>
              <p className="text-xs text-muted-foreground mt-0.5">
                Reason: <span className="text-foreground">{REASON_LABEL[r.reason] || r.reason}</span>
              </p>
              {r.explanation && <p className="text-xs text-muted-foreground mt-1 italic">“{r.explanation}”</p>}
              <p className="text-xs text-muted-foreground mt-2">
                {new Date(r.created_date).toLocaleString()} · by {r.created_by_id?.slice(-6)}
              </p>
              <div className="flex flex-wrap gap-1.5 mt-3">
                {STATUSES.map((s) => (
                  <button
                    key={s}
                    onClick={() => setStatus(r.id, s)}
                    className={`text-xs px-2.5 py-1 rounded-full border transition ${r.status === s ? "bg-foreground text-background border-foreground" : "border-border text-muted-foreground"}`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      </ListState>
    </div>
  );
}