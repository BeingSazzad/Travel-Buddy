import React from "react";
import { useNavigate } from "react-router-dom";
import { UserPlus, Loader2, X } from "lucide-react";
import ScreenHeader from "@/components/common/ScreenHeader";
import EmptyState from "@/components/common/EmptyState";
import { useConnectionRequests } from "@/hooks/useConnectionRequests";
import { base44 } from "@/api/base44Client";
import { FALLBACK_AVATAR_URL } from "@/lib/images";

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
        <div className="-mx-1">
          {requests.map((m) => (
            <div key={m.user_id} className="flex gap-3 px-1 py-3">
              <button
                type="button"
                onClick={() => navigate(`/members/${m.user_id}`)}
                className="shrink-0 self-start"
              >
                <img
                  src={m.avatar || FALLBACK_AVATAR_URL}
                  alt=""
                  className="w-[68px] h-[68px] rounded-full object-cover object-top"
                />
              </button>
              <div className="flex-1 min-w-0 pt-0.5">
                <button
                  type="button"
                  onClick={() => navigate(`/members/${m.user_id}`)}
                  className="block w-full text-left"
                >
                  <p className="font-semibold text-[15px] leading-tight truncate">{m.name}</p>
                  {(m.current_city || m.country) && (
                    <p className="text-[13px] text-muted-foreground truncate mt-0.5">
                      {[m.current_city, m.country].filter(Boolean).join(", ")}
                    </p>
                  )}
                </button>
                <div className="flex gap-2 mt-2.5">
                  <button
                    type="button"
                    onClick={() => accept(m)}
                    className="flex-1 h-9 rounded-lg gradient-brand-button text-white text-[13px] font-semibold active:opacity-90 transition inline-flex items-center justify-center gap-1.5"
                  >
                    <UserPlus className="w-3.5 h-3.5" strokeWidth={2} />
                    Connect
                  </button>
                  <button
                    type="button"
                    onClick={() => decline(m)}
                    className="flex-1 h-9 rounded-lg bg-white/15 text-white text-[13px] font-semibold active:bg-white/20 transition inline-flex items-center justify-center gap-1.5"
                  >
                    <X className="w-3.5 h-3.5" strokeWidth={2} />
                    Decline
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
