import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Users } from "lucide-react";
import confetti from "canvas-confetti";
import { Image } from "@/components/ui/image";
import { Button } from "@/components/ui/button";
import SuccessCheck from "@/components/common/SuccessCheck";
import TripCard from "@/components/trips/TripCard";
import { tripsOverlap, imageForCity, formatDates } from "@/lib/trip-utils";
import { memberIdForTripCreator, cityKeyMatch } from "@/lib/mock-trips";
import { isSameAppUser } from "@/lib/demo-user";

export default function TripMatches({ trip, allTrips, userId, onDone }) {
  const navigate = useNavigate();

  useEffect(() => {
    confetti({
      particleCount: 70,
      spread: 68,
      origin: { y: 0.26 },
      colors: ["#C9A96A", "#F5E6C8", "#2A2A2A"],
    });
  }, []);

  const others = allTrips.filter(
    (t) => t.id !== trip.id && !isSameAppUser(t.created_by_id, userId)
  );

  const byWoman = {};
  others.forEach((t) => {
    if (cityKeyMatch(t.city, trip.city) && tripsOverlap(trip, t)) {
      const key = t.created_by_id;
      if (!byWoman[key]) {
        byWoman[key] = {
          handle: typeof t.created_by === "object"
            ? t.created_by?.name || "traveler"
            : (t.created_by || "traveler").split("@")[0],
          creatorId: key,
          trips: [],
        };
      }
      byWoman[key].trips.push(t);
    }
  });
  const women = Object.values(byWoman);
  const tripTitle = trip.name || `Trip to ${trip.city}`;

  return (
    <div className="max-w-app mx-auto min-h-screen app-px safe-pt pb-8">
      <div className="text-center pt-8">
        <SuccessCheck size="w-16 h-16" iconSize="w-8 h-8" />
        <h1 className="font-display font-bold text-xl mt-4">Trip created</h1>
        <p className="text-sm text-muted-foreground mt-1.5">
          {tripTitle} is now on your calendar.
        </p>
      </div>

      <div className="mt-6">
        <TripCard trip={trip} onPress={() => navigate(`/trips/${trip.id}`)} />
      </div>

      <div className="mt-7">
        <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-3">
          Women travelling to {trip.city}
        </p>

        {women.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-border p-6 text-center">
            <Users className="w-6 h-6 text-muted-foreground mx-auto mb-2" strokeWidth={1.5} />
            <p className="font-medium">No matches yet</p>
            <p className="text-sm text-muted-foreground mt-1">
              No other women are travelling to {trip.city} during your dates. Check back later.
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {women.map((w, i) => (
              <div key={i} className="rounded-2xl border border-border bg-card shadow-soft p-3">
                <button
                  type="button"
                  onClick={() => navigate(`/members/${memberIdForTripCreator(w.creatorId)}`)}
                  className="flex items-center gap-2 mb-3 tap-feedback text-left w-full"
                >
                  <div className="w-8 h-8 rounded-full bg-primary/15 flex items-center justify-center text-primary font-medium text-sm">
                    {(w.handle || "?")[0].toUpperCase()}
                  </div>
                  <p className="text-sm font-medium">{w.handle}</p>
                </button>
                <div className="space-y-2">
                  {w.trips.map((t) => (
                    <button
                      key={t.id}
                      type="button"
                      onClick={() => navigate(`/trips/${t.id}`)}
                      className="w-full flex items-center gap-3 tap-feedback text-left rounded-xl p-1 -mx-1"
                    >
                      <div className="w-12 h-12 rounded-xl overflow-hidden border border-border shrink-0">
                        <Image src={t.cover_image || imageForCity(t.city)} alt={t.name} fittingType="fill" className="w-full h-full" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">{t.name}</p>
                        <p className="text-xs text-muted-foreground">{formatDates(t)}</p>
                        {t.travel_style && (
                          <span className="text-xs text-primary capitalize">{t.travel_style}</span>
                        )}
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <Button className="w-full h-12 mt-7" onClick={() => navigate(`/trips/${trip.id}`)}>
        View your trip
      </Button>
      <Button variant="outline" className="w-full h-12 mt-2" onClick={onDone}>
        Done
      </Button>
    </div>
  );
}
