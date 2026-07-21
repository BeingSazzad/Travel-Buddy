import React from "react";
import { MapPin, Sparkles, Ban, Flag } from "lucide-react";
import { Image } from "@/components/ui/image";

function cap(s) {
  return s ? s.charAt(0).toUpperCase() + s.slice(1) : s;
}

function Avatar({ match }) {
  if (match.avatar) {
    return (
      <div className="w-16 h-16 rounded-full overflow-hidden border border-border shrink-0">
        <Image src={match.avatar} alt={match.name} fittingType="fill" className="w-full h-full" />
      </div>
    );
  }
  return (
    <div className="w-16 h-16 rounded-full bg-[#A1846B]/15 flex items-center justify-center text-[#A1846B] font-display text-xl shrink-0">
      {(match.name || "?")[0].toUpperCase()}
    </div>
  );
}

export default function MatchSuggestions({ matches, onBlock }) {
  return (
    <div className="space-y-4">
      {matches.map((m) => (
        <div key={m.user_id} className="rounded-2xl border border-border bg-card shadow-soft overflow-hidden">
          <div className="flex gap-3 p-4">
            <Avatar match={m} />
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between gap-2">
                <h3 className="font-display font-semibold truncate">{m.name}</h3>
                <span className="text-[11px] font-medium px-2 py-0.5 rounded-full bg-[#A1846B]/10 text-[#A1846B] shrink-0">
                  {m.matchPercent}% match
                </span>
              </div>
              <div className="flex items-center gap-1 text-xs text-muted-foreground mt-0.5">
                <MapPin className="w-3 h-3 shrink-0" strokeWidth={1.5} />
                <span className="truncate">
                  {[m.locationText, m.city, m.country].filter(Boolean).join(" · ")}
                </span>
              </div>
              <p className="text-xs text-muted-foreground mt-0.5">
                {m.dates}{m.age != null ? ` · ${m.age} yrs` : ""}
              </p>
            </div>
          </div>

          <div className="px-4">
            <div className="flex items-start gap-2 rounded-xl bg-[#A1846B]/5 p-3">
              <Sparkles className="w-4 h-4 text-[#A1846B] shrink-0 mt-0.5" strokeWidth={1.5} />
              <p className="text-sm leading-snug">{m.explanation}</p>
            </div>
          </div>

          <div className="flex flex-wrap gap-1.5 px-4 mt-3">
            {m.reasons.map((r, i) => (
              <span
                key={i}
                className="text-[11px] px-2 py-0.5 rounded-full bg-muted text-muted-foreground capitalize"
              >
                {cap(r.label)}
              </span>
            ))}
          </div>

          <div className="flex gap-2 px-4 py-4">
            <button
              onClick={() => onBlock(m.user_id, "block")}
              className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground px-3 py-1.5 rounded-full border border-border transition"
            >
              <Ban className="w-3.5 h-3.5" strokeWidth={1.5} /> Block
            </button>
            <button
              onClick={() => onBlock(m.user_id, "report")}
              className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground px-3 py-1.5 rounded-full border border-border transition"
            >
              <Flag className="w-3.5 h-3.5" strokeWidth={1.5} /> Report
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}