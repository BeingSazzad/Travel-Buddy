import React from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Sparkles, Plane } from "lucide-react";
import { useAuth } from "@/lib/AuthContext";
import { useDiscover } from "@/hooks/useDiscover";
import SwipeCard from "@/components/swipe/SwipeCard";
import MatchModal from "@/components/swipe/MatchModal";
import MemberProfileSheet from "@/components/swipe/MemberProfileSheet";
import { Button } from "@/components/ui/button";
import EmptyState from "@/components/common/EmptyState";

export default function Discover() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const {
    deck, loading, matched, setMatched,
    profile, setProfile, profileLoading, viewProfile,
    swipe, reload,
  } = useDiscover();

  const myAvatar = user?.main_photo || user?.profile_photos?.[0] || "";
  const current = deck[0];

  const handleProfile = () => {
    if (!matched) return;
    const m = { user_id: matched.match_user_id, name: matched.name };
    setMatched(null);
    viewProfile(m);
  };

  const handleKeepExploring = () => setMatched(null);

  return (
    <div className="px-5 pt-12 pb-24 min-h-screen flex flex-col">
      <header className="flex items-center gap-3 mb-4">
        <button
          onClick={() => navigate("/friends")}
          className="w-9 h-9 rounded-full flex items-center justify-center"
          aria-label="Back"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div>
          <h1 className="font-display font-semibold text-2xl">Find travel friends</h1>
          <p className="text-sm text-muted-foreground">Swipe to connect with women heading your way</p>
        </div>
      </header>

      <div className="flex-1 flex flex-col items-center justify-center">
        {loading ? (
          <p className="text-sm text-muted-foreground">Loading travel friends…</p>
        ) : !current ? (
          <EmptyState
            icon={Plane}
            title="You're all caught up"
            description="No more travel friends to discover right now. Check back soon for new members."
            actionLabel="Refresh"
            onAction={reload}
          />
        ) : (
          <SwipeCard
            key={current.user_id}
            member={current}
            onSwipe={(dir) => swipe(dir)}
            onProfile={(m) => viewProfile(m)}
          />
        )}
      </div>

      <MatchModal
        open={!!matched}
        myAvatar={myAvatar}
        theirAvatar={matched?.avatar || ""}
        onMessage={() => matched?.conversation_id && navigate(`/conversations/${matched.conversation_id}`)}
        onProfile={handleProfile}
        onKeepExploring={handleKeepExploring}
      />

      <MemberProfileSheet
        open={!!profile}
        data={profile}
        loading={profileLoading}
        onClose={() => setProfile(null)}
      />
    </div>
  );
}