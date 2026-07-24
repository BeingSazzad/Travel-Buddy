import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Plane, SlidersHorizontal } from "lucide-react";
import { useAuth } from "@/lib/AuthContext";
import { useDiscover } from "@/hooks/useDiscover";
import MatchCard from "@/components/match/MatchCard";
import MatchModal from "@/components/match/MatchModal";
import MemberProfileSheet from "@/components/match/MemberProfileSheet";
import MatchFilters from "@/components/match/MatchFilters";
import EmptyState from "@/components/common/EmptyState";

export default function Discover() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const {
    deck, loading, matched, setMatched,
    profile, setProfile, profileLoading, profileMatchId, viewProfile,
    decide, reload,
    filters, setFilters, resetFilters, activeFilterCount,
  } = useDiscover();

  const [filtersOpen, setFiltersOpen] = useState(false);

  const myAvatar = user?.main_photo || user?.profile_photos?.[0] || "";
  const current = deck[0];

  const handleProfile = () => {
    if (!matched) return;
    const m = { user_id: matched.match_user_id, name: matched.name };
    const matchId = matched.id || null;
    setMatched(null);
    viewProfile(m, matchId);
  };

  const handleKeepExploring = () => setMatched(null);

  return (
    <div className="px-5 pt-12 pb-24 min-h-screen flex flex-col">
      <header className="flex items-center gap-3 mb-3">
        <button
          onClick={() => navigate("/friends")}
          className="w-9 h-9 rounded-full flex items-center justify-center"
          aria-label="Back"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div className="flex-1">
          <h1 className="font-display font-semibold text-2xl">Match</h1>
          <p className="text-sm text-muted-foreground">Find your next travel connection</p>
        </div>
        <button
          onClick={() => setFiltersOpen(true)}
          className="relative w-9 h-9 rounded-full bg-card border border-border shadow-soft flex items-center justify-center"
          aria-label="Filters"
        >
          <SlidersHorizontal className="w-4 h-4" strokeWidth={1.75} />
          {activeFilterCount > 0 && (
            <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-[#A1846B] text-white text-[9px] font-semibold flex items-center justify-center">
              {activeFilterCount}
            </span>
          )}
        </button>
      </header>

      <div className="flex-1 flex flex-col items-center justify-center">
        {loading ? (
          <p className="text-sm text-muted-foreground">Loading travel connections…</p>
        ) : !current ? (
          <EmptyState
            icon={Plane}
            title={activeFilterCount > 0 ? "No connections match your filters" : "You're all caught up"}
            description={
              activeFilterCount > 0
                ? "Try adjusting your filters to discover more women heading your way."
                : "No more travel connections to discover right now. Check back soon for new members."
            }
            actionLabel={activeFilterCount > 0 ? "Reset filters" : "Refresh"}
            onAction={activeFilterCount > 0 ? resetFilters : reload}
          />
        ) : (
          <MatchCard
            key={current.user_id}
            member={current}
            onDecide={(dir) => decide(current, dir)}
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
        matchId={profileMatchId}
        onClose={() => setProfile(null)}
      />

      <MatchFilters
        open={filtersOpen}
        onOpenChange={setFiltersOpen}
        filters={filters}
        onChange={setFilters}
        onReset={resetFilters}
      />
    </div>
  );
}