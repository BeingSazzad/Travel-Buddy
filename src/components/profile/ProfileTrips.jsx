import React from "react";
import { useNavigate } from "react-router-dom";
import { Plane, MapPin, Calendar } from "lucide-react";
import { useTrips } from "@/hooks/useTrips";
import { useAuth } from "@/lib/AuthContext";

const fmt = (d) => d ? new Date(d).toLocaleDateString("en-GB", { day: "numeric", month: "short" }) : "";
const today = () => new Date().toISOString().slice(0, 10);

export default function ProfileTrips() {
  const { trips } = useTrips();
  const { user } = useAuth();
  const navigate = useNavigate();
  const mine = trips.filter((t) => t.created_by_id === user?.id);
  const upcoming = mine.filter((t) => (t.end_date || t.start_date || "") >= today());
  const previous = mine.filter((t) => (t.end_date || t.start_date || "") < today());
  const prevCities = [...new Set(previous.map((t) => t.city).filter(Boolean))];

  return (
    <div className="mt-6">
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-display font-semibold text-base flex items-center gap-1.5">
          <Plane className="w-4 h-4 text-[#A1846B]" strokeWidth={1.5} /> My trips
        </h3>
        <button onClick={() => navigate("/trips")} className="text-xs text-[#A1846B]">View all</button>
      </div>

      {upcoming.length === 0 && prevCities.length === 0 ? (
        <button onClick={() => navigate("/trips/new")} className="w-full rounded-2xl border border-dashed border-border p-4 text-sm text-muted-foreground text-center">
          No trips yet — plan your first one
        </button>
      ) : (
        <div className="space-y-4">
          {upcoming.length > 0 && (
            <div>
              <p className="text-xs text-muted-foreground mb-1.5">Upcoming</p>
              <div className="space-y-2">
                {upcoming.slice(0, 3).map((t) => (
                  <div key={t.id} className="flex items-center gap-3 bg-card border border-border shadow-soft rounded-2xl p-3">
                    <div className="w-9 h-9 rounded-full bg-[#A1846B]/10 flex items-center justify-center"><MapPin className="w-4 h-4 text-[#A1846B]" strokeWidth={1.5} /></div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">{t.city}{t.country ? `, ${t.country}` : ""}</p>
                      <p className="text-xs text-muted-foreground flex items-center gap-1"><Calendar className="w-3 h-3" strokeWidth={1.5} /> {fmt(t.start_date)} → {fmt(t.end_date)}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
          {prevCities.length > 0 && (
            <div>
              <p className="text-xs text-muted-foreground mb-1.5">Previous destinations</p>
              <div className="flex flex-wrap gap-2">
                {prevCities.map((c) => <span key={c} className="text-xs px-2.5 py-1 rounded-full bg-muted text-muted-foreground">{c}</span>)}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}