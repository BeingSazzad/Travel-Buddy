import React from "react";
import { useNavigate } from "react-router-dom";
import { UserPlus, MapPin, Plane, Loader2 } from "lucide-react";
import { CONNECT_STROKE } from "@/components/common/ConnectIconButton";
import ScreenHeader from "@/components/common/ScreenHeader";
import EmptyState from "@/components/common/EmptyState";
import { useConnectionRequests } from "@/hooks/useConnectionRequests";
import { base44 } from "@/api/base44Client";
import moment from "moment";

export default function ConnectionRequests() {
  const navigate = useNavigate();
  const { requests, loading, reload } = useConnectionRequests();

  const accept = async (member) => {
    try {
      await base44.functions.invoke("record-like", { liked_user_id: member.user_id, action: "like" });
    } catch {
      /* offline */
    }
    reload();
    navigate(`/members/${member.user_id}`);
  };

  const decline = async (member) => {
    try {
      await base44.functions.invoke("record-like", { liked_user_id: member.user_id, action: "pass" });
    } catch {
      /* offline */
    }
    reload();
  };

  return (
    <div className="page-shell pb-4 flex flex-col h-full min-h-0">
      <ScreenHeader
        title="Connection requests"
        subtitle="Women who want to connect with you"
        showBack
        onBack={() => navigate(-1)}
      />

      {loading ? (
        <div className="flex-1 flex items-center justify-center text-muted-foreground">
          <Loader2 className="w-5 h-5 animate-spin mr-2" /> Loading…
        </div>
      ) : requests.length === 0 ? (
        <EmptyState
          icon={UserPlus}
          title="No pending requests"
          description="When someone connects with you on Match, they'll appear here until you connect back."
          actionLabel="Go to Match"
          onAction={() => navigate("/discover")}
        />
      ) : (
        <div className="space-y-3">
          {requests.map((m) => (
            <div
              key={m.user_id}
              className="rounded-2xl border border-border/80 bg-card p-4 shadow-soft flex gap-3"
            >
              <button
                type="button"
                onClick={() => navigate(`/members/${m.user_id}`)}
                className="shrink-0"
              >
                <img
                  src={m.avatar}
                  alt={m.name}
                  className="w-14 h-14 rounded-2xl object-cover border border-border"
                />
              </button>
              <div className="flex-1 min-w-0">
                <button
                  type="button"
                  onClick={() => navigate(`/members/${m.user_id}`)}
                  className="font-display font-semibold text-base text-left truncate w-full"
                >
                  {m.name}
                </button>
                {(m.current_city || m.country) && (
                  <p className="text-xs text-muted-foreground flex items-center gap-1 mt-0.5">
                    <MapPin className="w-3 h-3 text-primary" strokeWidth={1.5} />
                    {[m.current_city, m.country].filter(Boolean).join(", ")}
                  </p>
                )}
                {m.trip && (
                  <p className="text-xs text-primary flex items-center gap-1 mt-1">
                    <Plane className="w-3 h-3" strokeWidth={1.5} />
                    {m.trip.city}{m.trip.country ? `, ${m.trip.country}` : ""}
                  </p>
                )}
                <p className="text-[10px] text-muted-foreground mt-1">
                  {moment(m.created_date).fromNow()}
                </p>
              </div>
              <div className="shrink-0 flex flex-col gap-2">
                <button
                  type="button"
                  onClick={() => accept(m)}
                  className="h-10 px-4 rounded-full gradient-brand-accent text-white text-xs font-bold shadow-md active:scale-95 transition flex items-center justify-center gap-1.5"
                >
                  <UserPlus className="w-3.5 h-3.5" strokeWidth={CONNECT_STROKE} />
                  Connect
                </button>
                <button
                  type="button"
                  onClick={() => decline(m)}
                  className="h-8 px-3 rounded-full border border-border text-xs text-muted-foreground active:scale-95 transition"
                >
                  Decline
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
