import React, { useState } from "react";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { MapPin, Plane, Compass, Flag, Ban, UserMinus } from "lucide-react";
import { Image } from "@/components/ui/image";
import { base44 } from "@/api/base44Client";
import ReportSheet from "@/components/reports/ReportSheet";

function ChipRow({ label, items, tone }) {
  if (!items?.length) return null;
  return (
    <div>
      <p className="text-xs uppercase tracking-wide text-muted-foreground mb-1">{label}</p>
      <div className="flex flex-wrap gap-1.5">
        {items.map((it) => (
          <span
            key={it}
            className={`text-xs px-2 py-0.5 rounded-full capitalize ${tone === "accent" ? "bg-primary/10 text-primary" : "bg-muted text-muted-foreground"}`}
          >
            {it}
          </span>
        ))}
      </div>
    </div>
  );
}

export default function MemberProfileSheet({ open, data, loading, matchId, onClose, onChanged }) {
  const p = data?.profile;
  const memberId = p?.user_id || p?.id || "";
  const [reportTarget, setReportTarget] = useState(null);
  const [busy, setBusy] = useState(false);

  const reportProfile = () =>
    setReportTarget({ type: "profile", id: memberId, title: p?.name || "Member", ownerId: memberId });

  const doBlock = async () => {
    if (!memberId || !window.confirm(`Block ${p?.name || "this member"}? You won't see each other anymore.`)) return;
    try {
      setBusy(true);
      await base44.entities.BlockedMember.create({ blocked_user_id: memberId, reason: "block" });
      onClose();
      onChanged?.();
    } catch (e) {
      /* already blocked */
    } finally {
      setBusy(false);
    }
  };

  const doUnmatch = async () => {
    if (!matchId || !window.confirm(`Unmatch with ${p?.name || "this member"}?`)) return;
    try {
      setBusy(true);
      await base44.entities.Match.delete(matchId).catch(() => {});
      onClose();
      onChanged?.();
    } finally {
      setBusy(false);
    }
  };

  return (
    <>
      <Sheet open={open} onOpenChange={(o) => !o && onClose()}>
        <SheetContent side="bottom" className="rounded-t-3xl max-h-[90vh] overflow-y-auto">
          {loading || !p ? (
            <div className="p-10 text-center text-muted-foreground">Loading profile…</div>
          ) : (
            <>
              <SheetHeader>
                <SheetTitle className="font-display text-xl">
                  {p.name}{p.age != null ? `, ${p.age}` : ""}
                </SheetTitle>
              </SheetHeader>

              <div className="px-4 pb-8 space-y-4">
                {p.photos?.length > 0 && (
                  <div className="flex gap-2 overflow-x-auto no-scrollbar -mx-4 px-4">
                    {p.photos.map((ph, i) => (
                      <div key={i} className="w-40 h-52 rounded-2xl overflow-hidden border border-border shrink-0">
                        <Image src={ph} alt={p.name} fittingType="fill" className="w-full h-full" />
                      </div>
                    ))}
                  </div>
                )}

                <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                  <MapPin className="w-4 h-4" strokeWidth={1.5} />
                  {[p.current_city, p.country].filter(Boolean).join(", ")}
                </div>

                {p.bio && <p className="text-sm leading-relaxed">{p.bio}</p>}

                <ChipRow label="Languages" items={p.languages} />
                <ChipRow label="Interests" items={p.interests} tone="accent" />
                <ChipRow label="Travel style" items={p.travel_style} />

                {data.trips?.length > 0 && (
                  <div>
                    <p className="text-xs uppercase tracking-wide text-muted-foreground mb-2">Upcoming trips</p>
                    <div className="space-y-2">
                      {data.trips.map((t) => (
                        <div key={t.id} className="rounded-2xl bg-primary/5 p-3">
                          <div className="flex items-center gap-1.5 text-primary">
                            <Plane className="w-4 h-4" strokeWidth={1.5} />
                            <span className="text-sm font-medium">
                              {t.city}{t.country ? `, ${t.country}` : ""}
                            </span>
                          </div>
                          <p className="text-xs text-muted-foreground">{t.dates}</p>
                          {t.looking_for?.length > 0 && (
                            <ChipRow label="Looking for" items={t.looking_for} tone="accent" />
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {data.trips?.length === 0 && (
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Compass className="w-4 h-4" /> No upcoming trips shared yet
                  </div>
                )}

                <div className="space-y-2 pt-1">
                  {matchId && (
                    <button
                      onClick={doUnmatch}
                      disabled={busy}
                      className="w-full flex items-center justify-center gap-2 py-2.5 rounded-full border border-border text-sm text-muted-foreground active:scale-95 transition disabled:opacity-50"
                    >
                      <UserMinus className="w-4 h-4" strokeWidth={2} /> Remove connection
                    </button>
                  )}
                  <button
                    onClick={doBlock}
                    disabled={busy}
                    className="w-full flex items-center justify-center gap-2 py-2.5 rounded-full border border-border text-sm text-muted-foreground active:scale-95 transition disabled:opacity-50"
                  >
                    <Ban className="w-4 h-4" strokeWidth={1.5} /> Block
                  </button>
                  <button
                    onClick={reportProfile}
                    className="w-full flex items-center justify-center gap-2 py-2.5 rounded-full border border-border text-sm text-muted-foreground active:scale-95 transition"
                  >
                    <Flag className="w-4 h-4" strokeWidth={1.5} /> Report profile
                  </button>
                </div>
              </div>
            </>
          )}
        </SheetContent>
      </Sheet>

      <ReportSheet open={!!reportTarget} onOpenChange={(o) => !o && setReportTarget(null)} target={reportTarget} />
    </>
  );
}