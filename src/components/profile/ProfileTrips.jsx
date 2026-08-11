import React from "react";
import { useNavigate } from "react-router-dom";
import { ChevronRight } from "lucide-react";
import { useTrips } from "@/hooks/useTrips";
import { useAuth } from "@/lib/AuthContext";
import { isSameAppUser } from "@/lib/demo-user";

const fmt = (d) => (d ? new Date(d).toLocaleDateString("en-GB", { day: "numeric", month: "short" }) : "");
const today = () => new Date().toISOString().slice(0, 10);

export default function ProfileTrips({ embedded = false, onNavigate }) {
  const { trips } = useTrips();
  const { user } = useAuth();
  const navigate = useNavigate();
  const go = (path) => {
    onNavigate?.();
    navigate(path);
  };
  const mine = trips.filter((t) => isSameAppUser(t.created_by_id, user?.id));
  const upcoming = mine.filter((t) => (t.end_date || t.start_date || "") >= today());
  const previous = mine.filter((t) => (t.end_date || t.start_date || "") < today());
  const prevCities = [...new Set(previous.map((t) => t.city).filter(Boolean))];

  const body =
    upcoming.length === 0 && prevCities.length === 0 ? (
      <button
        type="button"
        onClick={() => go("/trips/new")}
        className="w-full rounded-2xl border border-dashed border-border p-4 text-sm text-muted-foreground text-center active:bg-muted/30 transition"
      >
        No trips yet — plan your first one
      </button>
    ) : (
      <div className="space-y-3">
        {upcoming.length > 0 && (
          <div className="space-y-0.5">
            {upcoming.slice(0, 3).map((t) => (
              <button
                key={t.id}
                type="button"
                onClick={() => go(`/trips/${t.id}`)}
                className="w-full flex items-center gap-3 py-2.5 rounded-xl text-left active:bg-muted/40 transition"
              >
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">
                    {t.name || t.city}{t.country ? `, ${t.country}` : ""}
                  </p>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    {fmt(t.start_date)} – {fmt(t.end_date)}
                  </p>
                </div>
                <ChevronRight className="w-4 h-4 text-muted-foreground/60 shrink-0" strokeWidth={1.5} />
              </button>
            ))}
          </div>
        )}
        {prevCities.length > 0 && (
          <div>
            <p className="text-xs text-muted-foreground mb-2">Previous destinations</p>
            <div className="flex flex-wrap gap-2">
              {prevCities.map((c) => (
                <span key={c} className="text-xs px-2.5 py-1 rounded-full bg-muted text-muted-foreground">
                  {c}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
    );

  if (embedded) {
    return (
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">{body}</div>
        <button type="button" onClick={() => go("/trips")} className="text-xs text-primary font-medium shrink-0">
          View all
        </button>
      </div>
    );
  }

  return (
    <div className="mt-6">
      <div className="flex items-center justify-between mb-3">
        <h3 className="section-header">My trips</h3>
        <button type="button" onClick={() => go("/trips")} className="text-xs text-primary font-medium">
          View all
        </button>
      </div>
      {body}
    </div>
  );
}
