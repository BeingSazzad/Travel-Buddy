import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Users, ChevronRight } from 'lucide-react';
import { formatDates } from '@/lib/trip-utils';
import { memberIdForTripCreator } from '@/lib/mock-trips';

export default function TripOverlapMatches({ matches, city }) {
  const navigate = useNavigate();

  if (!matches?.length) return null;

  return (
    <section>
      <h2 className="font-display font-semibold text-base mb-3 flex items-center gap-1.5">
        <Users className="w-4 h-4 text-primary" strokeWidth={1.5} />
        Women on overlapping dates
      </h2>
      <div className="space-y-2">
        {matches.map((m) => (
          <button
            key={m.creatorId}
            type="button"
            onClick={() => navigate(`/members/${memberIdForTripCreator(m.creatorId)}`)}
            className="w-full flex items-center gap-3 rounded-2xl border border-border bg-card p-3 tap-feedback text-left"
          >
            {m.photo ? (
              <img src={m.photo} alt="" className="w-11 h-11 rounded-full object-cover border border-border shrink-0" />
            ) : (
              <div className="w-11 h-11 rounded-full bg-primary/15 flex items-center justify-center text-primary font-medium shrink-0">
                {(m.name || '?')[0]}
              </div>
            )}
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold truncate">{m.name}</p>
              <p className="text-xs text-muted-foreground truncate">
                {m.trips[0]?.name || `Trip to ${city}`} · {formatDates(m.trips[0])}
              </p>
              {m.trips.length > 1 && (
                <p className="text-[11px] text-primary mt-0.5">{m.trips.length} overlapping trips</p>
              )}
            </div>
            <ChevronRight className="w-4 h-4 text-muted-foreground shrink-0" strokeWidth={1.5} />
          </button>
        ))}
      </div>
    </section>
  );
}
