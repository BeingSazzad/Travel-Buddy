import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import { MapPin, Plane, Compass, Flag, MessageCircle, BadgeCheck, Globe, Sparkles } from "lucide-react";
import { Image } from "@/components/ui/image";
import { Button } from "@/components/ui/button";
import ReportSheet from "@/components/reports/ReportSheet";

function ChipRow({ label, items, tone, icon: Icon }) {
  if (!items?.length) return null;
  return (
    <div className="space-y-1.5">
      <p className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1">
        {Icon && <Icon className="w-3.5 h-3.5 text-[#A1846B]" strokeWidth={1.75} />}
        <span>{label}</span>
      </p>
      <div className="flex flex-wrap gap-1.5">
        {items.map((it) => (
          <span
            key={it}
            className={`text-xs px-3 py-1 rounded-full font-medium capitalize border ${
              tone === "accent"
                ? "bg-[#A1846B]/12 text-[#A1846B] border-[#A1846B]/25"
                : "bg-card border-border/80 text-foreground"
            }`}
          >
            {it}
          </span>
        ))}
      </div>
    </div>
  );
}

export default function MemberProfileSheet({ open, data, loading, onClose }) {
  const navigate = useNavigate();
  const [reportTarget, setReportTarget] = useState(null);

  // Normalize data object so it works whether passed as { profile: {...} } or direct member object
  const p = data?.profile || data;
  const memberId = p?.user_id || p?.id || "";
  const photos = p?.photos || p?.profile_photos || [p?.main_photo || p?.avatar].filter(Boolean);
  const trips = data?.trips || (p?.trip ? [p.trip] : []);

  const reportProfile = () =>
    setReportTarget({ type: "profile", id: memberId, title: p?.name || "Member", ownerId: memberId });

  const reportPhoto = (ph) =>
    setReportTarget({ type: "photo", id: ph, title: `${p?.name || "Member"} — photo`, ownerId: memberId });

  const handleMessage = () => {
    onClose();
    // Use simulated conversation ID for mock users
    const mockConvMap = {
      mock_1: "sim_conv_mock_1",
      mock_2: "sim_conv_mock_2",
      mock_3: "sim_conv_mock_3_sophie",
      mock_4: "sim_conv_mock_3",
      mock_5: "sim_conv_mock_4",
    };
    const convId = mockConvMap[memberId] || `sim_conv_${memberId}`;
    navigate(`/conversations/${convId}`);
  };

  return (
    <>
      <Sheet open={open} onOpenChange={(o) => !o && onClose()}>
        <SheetContent side="bottom" className="rounded-t-[32px] max-h-[90vh] overflow-y-auto px-0">
          {loading || !p ? (
            <div className="p-12 text-center text-muted-foreground font-medium">Loading member profile…</div>
          ) : (
            <div className="flex flex-col min-h-full">
              {/* Photo Carousel Header */}
              {photos.length > 0 && (
                <div className="flex gap-2.5 overflow-x-auto no-scrollbar px-6 pt-1 pb-3">
                  {photos.map((ph, i) => (
                    <div key={i} className="relative w-44 h-60 rounded-2xl overflow-hidden border border-border/80 shrink-0 shadow-soft">
                      <Image src={ph} alt={p.name} fittingType="fill" className="w-full h-full object-cover" />
                      <button
                        onClick={() => reportPhoto(ph)}
                        className="absolute top-2 right-2 w-7 h-7 rounded-full bg-black/40 backdrop-blur-md flex items-center justify-center text-white active:scale-90"
                        aria-label="Report photo"
                      >
                        <Flag className="w-3.5 h-3.5" strokeWidth={1.5} />
                      </button>
                    </div>
                  ))}
                </div>
              )}

              {/* Profile Details Body */}
              <div className="px-6 py-4 space-y-5 flex-1">
                {/* Header Name & Location */}
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="font-display font-bold text-2xl text-foreground">
                      {p.name || p.full_name}{p.age != null ? `, ${p.age}` : ""}
                    </h2>
                    {(p.verified ?? true) && (
                      <div className="w-5 h-5 rounded-full bg-[#A1846B] flex items-center justify-center shadow-sm">
                        <BadgeCheck className="w-3.5 h-3.5 text-white" strokeWidth={2.5} />
                      </div>
                    )}
                  </div>

                  <div className="flex items-center gap-1.5 text-xs text-muted-foreground font-medium mt-1">
                    <MapPin className="w-3.5 h-3.5 text-[#A1846B]" strokeWidth={1.75} />
                    <span>{[p.current_city, p.country].filter(Boolean).join(", ")}</span>
                  </div>
                </div>

                {/* Bio */}
                {p.bio && (
                  <div className="rounded-2xl bg-card border border-border/70 p-4 shadow-soft">
                    <p className="text-xs text-foreground/90 leading-relaxed italic">
                      "{p.bio}"
                    </p>
                  </div>
                )}

                {/* Chips */}
                <ChipRow label="Languages" items={p.languages} icon={Globe} />
                <ChipRow label="Interests" items={p.interests} tone="accent" icon={Sparkles} />
                <ChipRow label="Travel Style" items={p.travel_style} icon={Compass} />

                {/* Upcoming Trips */}
                {trips.length > 0 && (
                  <div className="space-y-2">
                    <p className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1">
                      <Plane className="w-3.5 h-3.5 text-[#A1846B]" strokeWidth={1.75} />
                      <span>Upcoming Trips</span>
                    </p>
                    <div className="space-y-2">
                      {trips.map((t, idx) => (
                        <div key={idx} className="rounded-2xl gradient-brand-soft border border-[#A1846B]/25 p-3.5 shadow-sm">
                          <p className="text-sm font-display font-bold text-foreground">
                            {t.city}{t.country ? `, ${t.country}` : ""}
                          </p>
                          {t.dates && <p className="text-xs text-muted-foreground mt-0.5">{t.dates}</p>}
                          {t.travel_style && (
                            <span className="inline-block text-[10px] font-semibold text-[#A1846B] capitalize px-2 py-0.5 rounded-full bg-[#A1846B]/12 mt-1.5">
                              {t.travel_style}
                            </span>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {trips.length === 0 && (
                  <div className="flex items-center gap-2 text-xs text-muted-foreground py-2">
                    <Compass className="w-4 h-4 text-[#A1846B]" /> No upcoming trips shared yet
                  </div>
                )}

                <button
                  onClick={reportProfile}
                  className="w-full flex items-center justify-center gap-2 py-2.5 rounded-2xl border border-border text-xs text-muted-foreground hover:bg-card active:scale-95 transition"
                >
                  <Flag className="w-3.5 h-3.5" strokeWidth={1.5} /> Report member profile
                </button>
              </div>

              {/* Fixed Bottom Action Bar */}
              <div className="sticky bottom-0 bg-background/95 backdrop-blur-md border-t border-border/60 p-4">
                <Button
                  onClick={handleMessage}
                  className="w-full h-12 rounded-2xl bg-[#A1846B] hover:bg-[#8a6a52] text-white font-bold shadow-md flex items-center justify-center gap-2"
                >
                  <MessageCircle className="w-5 h-5" strokeWidth={2} />
                  <span>Send Message</span>
                </Button>
              </div>
            </div>
          )}
        </SheetContent>
      </Sheet>

      <ReportSheet open={!!reportTarget} onOpenChange={(o) => !o && setReportTarget(null)} target={reportTarget} />
    </>
  );
}