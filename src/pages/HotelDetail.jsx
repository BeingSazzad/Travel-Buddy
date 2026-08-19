import React, { useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, MapPin, Star, Globe, Navigation, Bookmark, ShieldCheck, Compass, CalendarCheck, Flag } from "lucide-react";
import { Image } from "@/components/ui/image";
import { Button } from "@/components/ui/button";
import EventMap from "@/components/events/EventMap";
import { FACILITY_LABELS } from "@/lib/hotels";
import { cn } from "@/lib/utils";
import { useSaved } from "@/lib/SavedContext";
import ReviewSection from "@/components/reviews/ReviewSection";
import ReportSheet from "@/components/reports/ReportSheet";
import { useHotels } from "@/lib/useContent";
import { PageLoading, PageNotFound } from "@/components/common/PageStatus";
import { venueGallery, formatRating, siteLabel } from "@/lib/venue-detail";

function HotelStars({ stars }) {
  return (
    <span className="flex items-center gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <Star key={i} className={cn("w-4 h-4", i < stars ? "fill-brand-gold text-brand-gold" : "text-border")} strokeWidth={0} />
      ))}
    </span>
  );
}

export default function HotelDetail() {
  const { name } = useParams();
  const navigate = useNavigate();
  const { isSaved, toggle } = useSaved();
  const { items: hotels, loading } = useHotels();
  const h = useMemo(() => {
    const decoded = decodeURIComponent(name || "");
    return hotels.find((x) => x.name.toLowerCase() === decoded.toLowerCase()) || null;
  }, [hotels, name]);
  const [reportOpen, setReportOpen] = useState(false);

  if (loading) return <PageLoading />;
  if (!h)
    return (
      <PageNotFound title="Hotel not found" backLabel="Back to hotels" onBack={() => navigate("/hotels")} />
    );

  const itemKey = `hotel:${h.name}`;
  const saved = isSaved(itemKey);
  const gallery = venueGallery(h);
  const rating = formatRating(h.memberRating);
  const facilities = Object.entries(h.tags || {}).filter(([, v]) => v).map(([k]) => FACILITY_LABELS[k]).filter(Boolean);
  const directionsUrl = `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent([h.address, h.city, h.country].filter(Boolean).join(", "))}`;

  return (
    <div className="max-w-app mx-auto min-h-dvh flex flex-col bg-background">
      <header className="sticky top-0 z-20 px-app safe-pt pb-3 flex items-center justify-between bg-background/90 backdrop-blur">
        <button onClick={() => navigate(-1)} className="w-9 h-9 rounded-full flex items-center justify-center"><ArrowLeft className="w-5 h-5" strokeWidth={1.5} /></button>
        <div className="flex items-center gap-2">
          <button onClick={() => toggle({ type: "hotel", title: h.name, location: h.city, country: h.country, image: h.image, rating: h.memberRating })} className="w-9 h-9 rounded-full flex items-center justify-center">
            <Bookmark className={cn("w-5 h-5", saved ? "fill-brand-gold text-brand-gold" : "text-foreground")} strokeWidth={1.5} />
          </button>
        </div>
      </header>

      <div className="flex-1 overflow-y-auto pb-6">
        <div className="relative h-64">
          <Image src={gallery[0]} alt={h.name} fittingType="fill" className="w-full h-full" />
        </div>
        <div className="flex gap-2 app-px -mt-6 relative">
          {gallery.map((g, i) => (
            <div key={i} className="w-20 h-20 rounded-xl overflow-hidden border-2 border-background shadow-card">
              <Image src={g} alt="" fittingType="fill" className="w-full h-full" />
            </div>
          ))}
        </div>

        <div className="detail-body">
          <div className="flex items-center gap-2">
            <HotelStars stars={h.stars} />
            <span className="text-xs text-muted-foreground">{h.stars}-star hotel</span>
          </div>
          <h1 className="page-title mt-1">{h.name}</h1>
          <div className="flex items-center gap-1.5 mt-1.5 text-xs text-muted-foreground min-w-0">
            <MapPin className="w-3.5 h-3.5 shrink-0 text-primary/80" strokeWidth={1.5} />
            <span className="truncate">
              {[
                h.address || [h.city, h.country].filter(Boolean).join(", "),
                h.distance != null ? `${h.distance} km from centre` : null,
              ]
                .filter(Boolean)
                .join(" · ")}
            </span>
          </div>

          {rating && (
            <div className="mt-3 flex items-center gap-1.5 text-sm min-w-0">
              <Star className="w-3.5 h-3.5 fill-brand-gold text-brand-gold shrink-0" strokeWidth={0} />
              <span className="font-semibold tabular-nums">{rating}</span>
              {h.reviews != null && (
                <>
                  <span className="text-muted-foreground/50">·</span>
                  <span className="text-muted-foreground">{Number(h.reviews).toLocaleString()} reviews</span>
                </>
              )}
            </div>
          )}

          {h.description && <p className="text-sm text-muted-foreground leading-relaxed mt-4">{h.description}</p>}

          <div className="mt-5 space-y-3">
            <EventMap
              compact
              query={[h.address, h.city, h.country].filter(Boolean).join(", ")}
            />
            <div className="space-y-2">
              {h.website && <a href={h.website} target="_blank" rel="noreferrer" className="flex items-start gap-2 text-sm text-primary"><Globe className="w-4 h-4 mt-0.5 shrink-0" strokeWidth={1.5} /><span className="underline">{siteLabel(h.website)}</span></a>}
              {h.bookingUrl && <a href={h.bookingUrl} target="_blank" rel="noreferrer" className="flex items-start gap-2 text-sm text-primary"><CalendarCheck className="w-4 h-4 mt-0.5 shrink-0" strokeWidth={1.5} /><span className="underline">Book this hotel</span></a>}
            </div>
          </div>

          {facilities.length > 0 && (
            <section className="mt-5">
              <h2 className="section-header mb-2">Facilities</h2>
              <div className="flex flex-wrap gap-2">
                {facilities.map((f) => <span key={f} className="text-xs px-2.5 py-1 rounded-full border border-border">{f}</span>)}
              </div>
            </section>
          )}

          {(h.safetyNote || h.locationNote) && (
            <section className="mt-5">
              <h2 className="section-header mb-2">Safety & location notes</h2>
              <div className="space-y-2">
                {h.safetyNote && (
                  <div className="rounded-2xl border border-border bg-card p-3 flex gap-2">
                    <ShieldCheck className="w-4 h-4 text-primary mt-0.5 shrink-0" strokeWidth={1.5} />
                    <p className="text-sm text-muted-foreground"><span className="font-medium text-foreground">Safety: </span>{h.safetyNote}</p>
                  </div>
                )}
                {h.locationNote && (
                  <div className="rounded-2xl border border-border bg-card p-3 flex gap-2">
                    <Compass className="w-4 h-4 text-primary mt-0.5 shrink-0" strokeWidth={1.5} />
                    <p className="text-sm text-muted-foreground"><span className="font-medium text-foreground">Location: </span>{h.locationNote}</p>
                  </div>
                )}
              </div>
            </section>
          )}

          <ReviewSection itemKey={itemKey} itemType="hotel" itemTitle={h.name} />

          <button onClick={() => setReportOpen(true)} className="mt-4 text-xs text-muted-foreground flex items-center gap-1.5 underline underline-offset-2">
            <Flag className="w-3.5 h-3.5" strokeWidth={1.5} /> Report incorrect information
          </button>
          <ReportSheet open={reportOpen} onOpenChange={setReportOpen} target={{ type: "place", id: itemKey, title: h.name }} />
        </div>
      </div>

      <div className="sticky bottom-0 app-px pt-3 safe-pb bg-background/95 backdrop-blur border-t border-border flex gap-2">
        <a href={directionsUrl} target="_blank" rel="noreferrer" className="flex-1">
          <Button variant="outline" className="w-full">
            <Navigation className="w-4 h-4" strokeWidth={1.5} /> Directions
          </Button>
        </a>
        {h.bookingUrl ? (
          <a href={h.bookingUrl} target="_blank" rel="noreferrer" className="flex-1">
            <Button className="w-full bg-primary text-primary-foreground">
              <CalendarCheck className="w-4 h-4" strokeWidth={1.5} /> Book
            </Button>
          </a>
        ) : null}
      </div>
    </div>
  );
}