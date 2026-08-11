import React from "react";
import { useNavigate } from "react-router-dom";
import { CalendarHeart, Users } from "lucide-react";
import { useEvents } from "@/hooks/useEvents";
import { useAuth } from "@/lib/AuthContext";

const fmt = (d) => d ? new Date(d).toLocaleDateString("en-GB", { day: "numeric", month: "short" }) : "";

export default function ProfileEvents({ embedded = false }) {
  const { events, joined } = useEvents();
  const { user } = useAuth();
  const navigate = useNavigate();
  const hosted = events.filter((e) => e.host_id === user?.id || e.created_by_id === user?.id);

  const Row = ({ e }) => (
    <button onClick={() => navigate(`/events/${e.id}`)} className="w-full text-left flex items-center gap-3 bg-card border border-border shadow-soft rounded-2xl p-3">
      <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center"><CalendarHeart className="w-4 h-4 text-primary" strokeWidth={1.5} /></div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium truncate">{e.title}</p>
        <p className="text-xs text-muted-foreground truncate">{fmt(e.date)} · {e.city}</p>
      </div>
    </button>
  );

  return (
    <div className={embedded ? "" : "mt-6"}>
      {!embedded && (
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-display font-semibold text-base flex items-center gap-1.5">
            <Users className="w-4 h-4 text-primary" strokeWidth={1.5} /> My events
          </h3>
          <button onClick={() => navigate("/events")} className="text-xs text-primary">View all</button>
        </div>
      )}
      {hosted.length === 0 && joined.length === 0 ? (
        <button onClick={() => navigate("/events")} className="w-full rounded-2xl border border-dashed border-border p-4 text-sm text-muted-foreground text-center">
          No events yet — discover or host one
        </button>
      ) : (
        <div className="space-y-4">
          {hosted.length > 0 && (
            <div>
              <p className="text-xs text-muted-foreground mb-1.5">Hosted ({hosted.length})</p>
              <div className="space-y-2">{hosted.slice(0, 3).map((e) => <Row key={e.id} e={e} />)}</div>
            </div>
          )}
          {joined.length > 0 && (
            <div>
              <p className="text-xs text-muted-foreground mb-1.5">Joined ({joined.length})</p>
              <div className="space-y-2">{joined.slice(0, 3).map((e) => <Row key={e.id} e={e} />)}</div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}