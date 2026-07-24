import React, { useState } from "react";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { MapPin, Plane, Compass, Flag } from "lucide-react";
import { Image } from "@/components/ui/image";
import ReportSheet from "@/components/reports/ReportSheet";

function ChipRow({ label, items, tone }) {
  if (!items?.length) return null;
  return (
    <div>
      <p className="text-[11px] uppercase tracking-wide text-muted-foreground mb-1">{label}</p>
      <div className="flex flex-wrap gap-1.5">
        {items.map((it) => (
          <span
            key={it}
            className={`text-xs px-2 py-0.5 rounded-full capitalize ${tone === "accent" ? "bg-[#A1846B]/10 text-[#A1846B]" : "bg-muted text-muted-foreground"}`}
          >
            {it}
          </span>
        ))}
      </div>
    </div>
  );
}

export default function MemberProfileSheet({ open, data, loading, onClose }) {
  const p = data?.profile;
  const memberId = p?.user_id || p?.id || "";
  const [reportTarget, setReportTarget] = useState(null);

  const reportProfile = () =>
    setReportTarget({ type: "profile", id: memberId, title: p?.name || "Member", ownerId: memberId });

  const reportPhoto = (ph) =>
    setReportTarget({ type: "photo", id: ph, title: `${p?.name || "Member"} — photo`, ownerId: memberId });

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
                      <div key={i} className="relative w-40 h-52 rounded-2xl overflow-hidden border border-border shrink-0">
                        <Image src={ph} alt={p.name} fittingType="fill" className="w-full h-full" />
                        <button
                          onClick={() => reportPhoto(ph)}
                          className="absolute top-1.5 right-1.5 w-7 h-7 rounded-full bg-black/40 backdrop-blur flex items-center justify-center"
                          aria-label="Report photo"
                        >
                          <Flag className="w-3.5 h-3.5 text-white" strokeWidth={1.5} />
                        </button>
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
                    <p className="text-[11px] uppercase tracking-wide text-muted-foreground mb-2">Upcoming trips</p>
                    <div className="space-y-2">
                      {data.trips.map((t) => (
                        <div key={t.id} className="rounded-2xl bg-[#A1846B]/5 p-3">
                          <div className="flex items-center gap-1.5 text-[#A1846B]">
                            <Plane className="w-4 h-4" strokeWidth={1.5} />
                            <span className="text-sm font-medium">
                              {t.city}{t.country ? `, ${t.country}` : ""}
                            </span>
                          </div>
                          <p className="text-xs text-muted-foreground">{t.dates}</p>
                          {t.travel_style && (
                            <p className="text-xs capitalize text-[#A1846B] mt-0.5">{t.travel_style}</p>
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

                <button
                  onClick={reportProfile}
                  className="w-full flex items-center justify-center gap-2 py-2.5 rounded-full border border-border text-sm text-muted-foreground active:scale-95 transition"
                >
                  <Flag className="w-4 h-4" strokeWidth={1.5} /> Report profile
                </button>
              </div>
            </>
          )}
        </SheetContent>
      </Sheet>

      <ReportSheet open={!!reportTarget} onOpenChange={(o) => !o && setReportTarget(null)} target={reportTarget} />
    </>
  );
}