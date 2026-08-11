import React from "react";
import { useNavigate } from "react-router-dom";
import { MapPin, ChevronRight, Calendar } from "lucide-react";
import { Image } from "@/components/ui/image";
import { cn } from "@/lib/utils";

function Avatar({ match }) {
  if (match.avatar) {
    return (
      <div className="w-14 h-14 rounded-2xl overflow-hidden border border-border/80 shadow-soft shrink-0">
        <Image src={match.avatar} alt={match.name} fittingType="fill" className="w-full h-full object-cover" />
      </div>
    );
  }
  return (
    <div className="w-14 h-14 rounded-2xl bg-primary/12 border border-primary/20 flex items-center justify-center text-primary font-display text-lg shrink-0">
      {(match.name || "?")[0].toUpperCase()}
    </div>
  );
}

export default function MatchSuggestions({ matches }) {
  const navigate = useNavigate();

  return (
    <div className="space-y-3">
      {matches.map((m) => {
        const memberId = m.user_id || m.memberId || m.id;
        return (
          <button
            key={memberId || m.name}
            type="button"
            onClick={() => memberId && navigate(`/members/${memberId}`)}
            className={cn(
              "w-full rounded-2xl border border-border/80 bg-card shadow-soft",
              "px-4 py-3.5 text-left flex items-center gap-4",
              "tap-feedback active:scale-[0.99] transition hover:border-primary/30 hover:bg-muted/20"
            )}
          >
            <Avatar match={m} />

            <div className="flex-1 min-w-0 py-0.5">
              <h3 className="font-display font-semibold text-base text-foreground truncate leading-snug">
                {m.name}
              </h3>
              <div className="flex items-center gap-1.5 text-xs text-muted-foreground mt-1.5">
                <MapPin className="w-3.5 h-3.5 text-primary shrink-0" strokeWidth={1.75} />
                <span className="truncate">
                  {[m.city, m.country].filter(Boolean).join(", ")}
                </span>
              </div>
              {m.dates && (
                <div className="flex items-center gap-1.5 text-xs text-muted-foreground mt-1">
                  <Calendar className="w-3.5 h-3.5 text-primary/80 shrink-0" strokeWidth={1.75} />
                  <span className="truncate">{m.dates}</span>
                </div>
              )}
            </div>

            <div className="flex flex-col items-center justify-center gap-2 shrink-0 pl-1 self-stretch">
              {m.matchPercent != null && (
                <span className="text-[11px] font-semibold px-2.5 py-1 rounded-full bg-primary/12 text-primary border border-primary/25 tabular-nums">
                  {m.matchPercent}%
                </span>
              )}
              <ChevronRight className="w-4 h-4 text-muted-foreground/50" strokeWidth={1.5} aria-hidden />
            </div>
          </button>
        );
      })}
    </div>
  );
}
