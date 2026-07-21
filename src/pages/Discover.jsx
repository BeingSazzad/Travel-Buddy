import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Sparkles, Plane } from "lucide-react";
import { useDiscover } from "@/hooks/useDiscover";
import SwipeCard from "@/components/swipe/SwipeCard";
import MemberProfileSheet from "@/components/swipe/MemberProfileSheet";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";

export default function Discover() {
  const navigate = useNavigate();
  const {
    deck, loading, matched, setMatched,
    profile, setProfile, profileLoading, viewProfile,
    swipe, reload,
  } = useDiscover();
  const { toast } = useToast();

  useEffect(() => {
    if (matched) {
      toast({
        title: "It's a travel friendship!",
        description: `You and ${matched.name} can now plan a trip together.`,
      });
      setMatched(null);
    }
  }, [matched, setMatched, toast]);

  const current = deck[0];

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
          <div className="text-center max-w-xs">
            <div className="w-14 h-14 rounded-full bg-[#A1846B]/10 flex items-center justify-center mx-auto mb-3">
              <Plane className="w-6 h-6 text-[#A1846B]" strokeWidth={1.5} />
            </div>
            <p className="font-display font-semibold text-lg">You're all caught up</p>
            <p className="text-sm text-muted-foreground mt-1">
              No more travel friends to discover right now. Check back soon for new members.
            </p>
            <Button className="mt-4" variant="outline" onClick={reload}>
              <Sparkles className="w-4 h-4 mr-1.5" strokeWidth={1.5} /> Refresh
            </Button>
          </div>
        ) : (
          <SwipeCard
            key={current.user_id}
            member={current}
            onSwipe={(dir) => swipe(dir)}
            onProfile={(m) => viewProfile(m)}
          />
        )}
      </div>

      <MemberProfileSheet
        open={!!profile}
        data={profile}
        loading={profileLoading}
        onClose={() => setProfile(null)}
      />
    </div>
  );
}