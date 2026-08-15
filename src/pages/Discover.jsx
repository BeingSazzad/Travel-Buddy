import React, { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Plane, SlidersHorizontal, X } from "lucide-react";
import { useAuth } from "@/lib/AuthContext";
import { useDiscover } from "@/hooks/useDiscover";
import SwipeCard from "@/components/swipe/SwipeCard";
import MatchModal from "@/components/swipe/MatchModal";
import MatchFilterSheet, { countMatchFilters } from "@/components/match/MatchFilterSheet";
import ScreenHeader from "@/components/common/ScreenHeader";
import ReportSheet from "@/components/reports/ReportSheet";
import EmptyState from "@/components/common/EmptyState";
import { memberAvatar } from "@/lib/images";

const DEFAULT_FILTERS = {
  ageMin: "",
  ageMax: "",
  location: "",
  destination: "",
  dateFrom: "",
  dateTo: "",
  interests: [],
  languages: [],
};

function norm(s) {
  return String(s || "").trim().toLowerCase();
}

function matchesFilters(m, f) {
  if (f.ageMin && (m.age == null || m.age < Number(f.ageMin))) return false;
  if (f.ageMax && (m.age == null || m.age > Number(f.ageMax))) return false;
  if (f.location) {
    const q = norm(f.location);
    const hay = `${m.current_city || ""} ${m.country || ""}`.toLowerCase();
    if (!hay.includes(q)) return false;
  }
  if (f.destination) {
    if (!m.trip) return false;
    const q = norm(f.destination);
    const hay = `${m.trip.city || ""} ${m.trip.country || ""}`.toLowerCase();
    if (!hay.includes(q)) return false;
  }
  if ((f.dateFrom || f.dateTo) && (!m.trip || !m.trip.start_date || !m.trip.end_date)) return false;
  if (m.trip && f.dateFrom && new Date(m.trip.end_date) < new Date(f.dateFrom)) return false;
  if (m.trip && f.dateTo && new Date(m.trip.start_date) > new Date(f.dateTo)) return false;
  if (f.interests?.length) {
    const memberSet = new Set((m.interests || []).map(norm));
    if (!f.interests.some((i) => memberSet.has(norm(i)))) return false;
  }
  if (f.languages?.length) {
    const memberSet = new Set((m.languages || []).map(norm));
    if (!f.languages.some((l) => memberSet.has(norm(l)))) return false;
  }
  return true;
}

export default function Discover() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const {
    deck, loading, matched, setMatched,
    decide, reload, unmatch, block,
  } = useDiscover();

  const [filters, setFilters] = useState(DEFAULT_FILTERS);
  const [filterOpen, setFilterOpen] = useState(false);
  const [reportTarget, setReportTarget] = useState(null);

  const myAvatar = user?.main_photo || user?.profile_photos?.[0] || memberAvatar("clara");
  const filtered = useMemo(() => deck.filter((m) => matchesFilters(m, filters)), [deck, filters]);
  const current = filtered[0];
  const activeFilterCount = countMatchFilters(filters);

  const openProfile = (member) => {
    const id = member?.user_id || member?.match_user_id;
    if (id) navigate(`/members/${id}`);
  };

  const handleProfile = () => {
    if (!matched) return;
    setMatched(null);
    openProfile(matched);
  };

  const handleKeepExploring = () => setMatched(null);

  const handleUnmatch = async () => {
    if (!matched?.id) return;
    await unmatch(matched.id);
    setMatched(null);
  };

  const handleBlock = async () => {
    if (!matched?.match_user_id) return;
    await block(matched.match_user_id);
    setMatched(null);
  };

  const handleReport = () => {
    if (!matched?.match_user_id) return;
    setReportTarget({
      type: "profile",
      id: matched.match_user_id,
      title: matched.name || "Member",
      ownerId: matched.match_user_id,
    });
    setMatched(null);
  };

  const resetFilters = () => setFilters(DEFAULT_FILTERS);

  return (
    <div className="page-shell flex flex-col flex-1 min-h-0 safe-pt pb-1">
      <ScreenHeader
        className="mb-3"
        title="Match"
        subtitle="Find your next travel connection"
        extraActions={
          <button
            onClick={() => setFilterOpen(true)}
            className="relative w-9 h-9 rounded-full bg-card border border-border shadow-soft flex items-center justify-center active:scale-95 transition"
            aria-label="Filters"
          >
            <SlidersHorizontal className="w-4 h-4" strokeWidth={1.75} />
            {activeFilterCount > 0 && (
              <span className="absolute -top-1 -right-1 min-w-4 h-4 px-1 rounded-full bg-primary text-white text-[10px] font-medium flex items-center justify-center">
                {activeFilterCount}
              </span>
            )}
          </button>
        }
      />

      {activeFilterCount > 0 && (
        <button
          onClick={resetFilters}
          className="self-start mb-3 flex items-center gap-1 text-xs text-primary active:scale-95 transition"
        >
          <X className="w-3.5 h-3.5" strokeWidth={1.75} /> Clear filters
        </button>
      )}

      <div className="flex-1 min-h-0 flex flex-col w-full">
        {loading ? (
          <p className="text-sm text-muted-foreground text-center py-8">Loading travel connections…</p>
        ) : !current ? (
          <div className="flex-1 flex items-center justify-center">
            <EmptyState
              icon={Plane}
              title={activeFilterCount ? "No connections match your filters" : "You're all caught up"}
              description={
                activeFilterCount
                  ? "Try widening your filters to meet more women."
                  : "No more travel connections right now. Check back soon for new members."
              }
              actionLabel={activeFilterCount ? "Clear filters" : "Refresh"}
              onAction={activeFilterCount ? resetFilters : reload}
            />
          </div>
        ) : (
          <SwipeCard
            key={current.user_id}
            member={current}
            onSwipe={(dir) => decide(current, dir === "right" ? "connect" : "skip")}
            onProfile={openProfile}
          />
        )}
      </div>

      <MatchModal
        open={!!matched}
        myAvatar={myAvatar}
        theirAvatar={matched?.avatar || ""}
        theirName={matched?.name}
        onMessage={() => matched?.conversation_id && navigate(`/conversations/${matched.conversation_id}`)}
        onProfile={handleProfile}
        onKeepExploring={handleKeepExploring}
        onUnmatch={handleUnmatch}
        onBlock={handleBlock}
        onReport={handleReport}
      />

      <MatchFilterSheet
        open={filterOpen}
        onOpenChange={setFilterOpen}
        filters={filters}
        onChange={setFilters}
        onReset={resetFilters}
      />

      <ReportSheet
        open={!!reportTarget}
        onOpenChange={(o) => !o && setReportTarget(null)}
        target={reportTarget}
      />
    </div>
  );
}
