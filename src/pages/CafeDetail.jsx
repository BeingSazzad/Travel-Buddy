import React, { useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, MapPin, Star, Clock, Phone, Globe, Navigation, Share2, Bookmark, Flag } from "lucide-react";
import { Image } from "@/components/ui/image";
import { Button } from "@/components/ui/button";
import EventMap from "@/components/events/EventMap";
import { PRICE_LABELS, FACILITY_LABELS } from "@/lib/cafes";
import { cn } from "@/lib/utils";
import { useSaved } from "@/lib/SavedContext";
import ReviewSection from "@/components/reviews/ReviewSection";
import ReportSheet from "@/components/reports/ReportSheet";
import { useCafes } from "@/lib/useContent";
import { PageLoading, PageNotFound } from "@/components/common/PageStatus";
import { venueGallery, formatRating, siteLabel, shareOrCopy } from "@/lib/venue-detail";

export default function CafeDetail() {
  const { name } = useParams();
  const navigate = useNavigate();
  const { isSaved, toggle } = useSaved();
  const { items: cafes, loading } = useCafes();
  const cafe = useMemo(() => {
    const decoded = decodeURIComponent(name || "");
    return cafes.find((c) => c.name.toLowerCase() === decoded.toLowerCase()) || null;
  }, [cafes, name]);
  const [reportOpen, setReportOpen] = useState(false);

  const itemKey = cafe ? `cafe:${cafe.name}` : "";

  if (loading) return <PageLoading />;
  if (!cafe)
    return (
      <PageNotFound
        title="Café not found"
        backLabel="Back to cafés"
        onBack={() => navigate("/cafes")}
      />
    );

  const saved = isSaved(itemKey);
  const gallery = venueGallery(cafe);
  const rating = formatRating(cafe.rating);
  const facilities = Object.entries(cafe.tags || {}).filter(([, v]) => v).map(([k]) => FACILITY_LABELS[k]).filter(Boolean);
  const directionsUrl = `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent([cafe.address, cafe.city, cafe.country].filter(Boolean).join(", "))}`;

  const onShare = () => shareOrCopy({ title: cafe.name, text: cafe.description });

  return (
    <div className="max-w-app mx-auto min-h-dvh flex flex-col bg-background">
      <header className="sticky top-0 z-20 px-app safe-pt pb-3 flex items-center justify-between bg-background/90 backdrop-blur">
        <button onClick={() => navigate(-1)} className="w-9 h-9 rounded-full flex items-center justify-center"><ArrowLeft className="w-5 h-5" strokeWidth={1.5} /></button>
        <div className="flex items-center gap-2">
          <button onClick={onShare} className="w-9 h-9 rounded-full flex items-center justify-center"><Share2 className="w-5 h-5" strokeWidth={1.5} /></button>
          <button onClick={() => toggle({ type: "cafe", title: cafe.name, location: cafe.city, country: cafe.country, image: cafe.image, rating: cafe.rating })} className="w-9 h-9 rounded-full flex items-center justify-center">
            <Bookmark className={cn("w-5 h-5", saved ? "fill-primary text-primary" : "text-foreground")} strokeWidth={1.5} />
          </button>
        </div>
      </header>

      <div className="flex-1 overflow-y-auto pb-6">
        {/* Gallery */}
        <div className="relative h-64">
          {gallery[0] && (
            <Image src={gallery[0]} alt={cafe.name} fittingType="fill" className="w-full h-full" />
          )}
          <span className="absolute top-3 left-3 text-xs px-2 py-0.5 rounded-full bg-white/90 backdrop-blur text-primary font-medium">{PRICE_LABELS[cafe.price]}</span>
        </div>
        <div className="flex gap-2 app-px -mt-6 relative">
          {gallery.map((g, i) => (
            <div key={i} className="w-20 h-20 rounded-xl overflow-hidden border-2 border-background shadow-card">
              <Image src={g} alt="" fittingType="fill" className="w-full h-full" />
            </div>
          ))}
        </div>

        <div className="detail-body">
          <h1 className="page-title">{cafe.name}</h1>
          <div className="flex items-center gap-1.5 mt-1.5 text-xs text-muted-foreground min-w-0">
            <MapPin className="w-3.5 h-3.5 shrink-0 text-primary/80" strokeWidth={1.5} />
            <span className="truncate">{[cafe.city, cafe.country].filter(Boolean).join(", ")}{cafe.distance != null ? ` · ${cafe.distance} km` : ""}</span>
          </div>

          {rating && (
            <div className="mt-3 flex items-center gap-1.5 text-sm min-w-0">
              <Star className="w-3.5 h-3.5 fill-brand-gold text-brand-gold shrink-0" strokeWidth={0} />
              <span className="font-semibold tabular-nums">{rating}</span>
              {cafe.reviews != null && (
                <>
                  <span className="text-muted-foreground/50">·</span>
                  <span className="text-muted-foreground">{Number(cafe.reviews).toLocaleString()} reviews</span>
                </>
              )}
            </div>
          )}

          {cafe.description && <p className="text-sm text-muted-foreground leading-relaxed mt-4">{cafe.description}</p>}

          {/* Location once: map + street address; city already under title */}
          <div className="mt-5 space-y-3">
            <EventMap
              compact
              query={[cafe.address, cafe.city, cafe.country].filter(Boolean).join(", ")}
              label={cafe.address}
            />
            <div className="space-y-2">
              {cafe.hours && <div className="flex items-start gap-2 text-sm"><Clock className="w-4 h-4 text-primary mt-0.5 shrink-0" strokeWidth={1.5} /><span>{cafe.hours}</span></div>}
              {cafe.phone && <div className="flex items-start gap-2 text-sm"><Phone className="w-4 h-4 text-primary mt-0.5 shrink-0" strokeWidth={1.5} /><span>{cafe.phone}</span></div>}
              {cafe.website && <a href={cafe.website} target="_blank" rel="noreferrer" className="flex items-start gap-2 text-sm text-primary"><Globe className="w-4 h-4 mt-0.5 shrink-0" strokeWidth={1.5} /><span className="underline">{siteLabel(cafe.website)}</span></a>}
            </div>
          </div>

          {/* Facilities */}
          {facilities.length > 0 && (
            <section className="mt-5">
              <h2 className="section-header mb-2">Facilities</h2>
              <div className="flex flex-wrap gap-2">
                {facilities.map((f) => <span key={f} className="text-xs px-2.5 py-1 rounded-full border border-border">{f}</span>)}
              </div>
            </section>
          )}

          <ReviewSection itemKey={itemKey} itemType="cafe" itemTitle={cafe.name} />

          <button onClick={() => setReportOpen(true)} className="mt-4 text-xs text-muted-foreground flex items-center gap-1.5 underline underline-offset-2">
            <Flag className="w-3.5 h-3.5" strokeWidth={1.5} /> Report incorrect information
          </button>
          <ReportSheet open={reportOpen} onOpenChange={setReportOpen} target={{ type: "place", id: itemKey, title: cafe.name }} />
        </div>
      </div>

      {/* Action bar — Directions only; save/share live in header */}
      <div className="sticky bottom-0 app-px pt-3 safe-pb bg-background/95 backdrop-blur border-t border-border">
        <a href={directionsUrl} target="_blank" rel="noreferrer">
          <Button className="w-full bg-primary text-primary-foreground">
            <Navigation className="w-4 h-4" strokeWidth={1.5} /> Directions
          </Button>
        </a>
      </div>
    </div>
  );
}