import React, { useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, MapPin, Star, Clock, Phone, Globe, Navigation, Share2, Bookmark, UtensilsCrossed, CalendarCheck, Flag } from "lucide-react";
import { Image } from "@/components/ui/image";
import { Button } from "@/components/ui/button";
import EventMap from "@/components/events/EventMap";
import { PRICE_LABELS, FACILITY_LABELS } from "@/lib/restaurants";
import { cn } from "@/lib/utils";
import { useSaved } from "@/lib/SavedContext";
import ReviewSection from "@/components/reviews/ReviewSection";
import ReportSheet from "@/components/reports/ReportSheet";
import { useRestaurants } from "@/lib/useContent";
import { PageLoading, PageNotFound } from "@/components/common/PageStatus";
import { venueGallery, formatRating, siteLabel, shareOrCopy } from "@/lib/venue-detail";

export default function RestaurantDetail() {
  const { name } = useParams();
  const navigate = useNavigate();
  const { isSaved, toggle } = useSaved();
  const { items: restaurants, loading } = useRestaurants();
  const r = useMemo(() => {
    const decoded = decodeURIComponent(name || "");
    return restaurants.find((x) => x.name.toLowerCase() === decoded.toLowerCase()) || null;
  }, [restaurants, name]);
  const [reportOpen, setReportOpen] = useState(false);

  if (loading) return <PageLoading />;
  if (!r)
    return (
      <PageNotFound title="Restaurant not found" backLabel="Back to restaurants" onBack={() => navigate("/restaurants")} />
    );

  const itemKey = `restaurant:${r.name}`;
  const saved = isSaved(itemKey);
  const gallery = venueGallery(r);
  const rating = formatRating(r.rating);
  const facilities = Object.entries(r.tags || {}).filter(([, v]) => v).map(([k]) => FACILITY_LABELS[k]).filter(Boolean);
  const directionsUrl = `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent([r.address, r.city, r.country].filter(Boolean).join(", "))}`;

  const onShare = () => shareOrCopy({ title: r.name, text: r.description });

  return (
    <div className="max-w-app mx-auto min-h-dvh flex flex-col bg-background">
      <header className="sticky top-0 z-20 px-app safe-pt pb-3 flex items-center justify-between bg-background/90 backdrop-blur">
        <button onClick={() => navigate(-1)} className="w-9 h-9 rounded-full flex items-center justify-center"><ArrowLeft className="w-5 h-5" strokeWidth={1.5} /></button>
        <div className="flex items-center gap-2">
          <button onClick={onShare} className="w-9 h-9 rounded-full flex items-center justify-center"><Share2 className="w-5 h-5" strokeWidth={1.5} /></button>
          <button onClick={() => toggle({ type: "restaurant", title: r.name, location: r.city, country: r.country, image: r.image, rating: r.rating })} className="w-9 h-9 rounded-full flex items-center justify-center">
            <Bookmark className={cn("w-5 h-5", saved ? "fill-primary text-primary" : "text-foreground")} strokeWidth={1.5} />
          </button>
        </div>
      </header>

      <div className="flex-1 overflow-y-auto pb-6">
        <div className="relative h-64">
          <Image src={gallery[0]} alt={r.name} fittingType="fill" className="w-full h-full" />
          <span className="absolute top-3 left-3 text-xs px-2 py-0.5 rounded-full bg-white/90 backdrop-blur text-primary font-medium">{PRICE_LABELS[r.price]}</span>
          <span className="absolute bottom-3 left-3 text-xs px-2 py-0.5 rounded-full bg-primary text-white">{r.cuisine}</span>
        </div>
        <div className="flex gap-2 app-px -mt-6 relative">
          {gallery.map((g, i) => (
            <div key={i} className="w-20 h-20 rounded-xl overflow-hidden border-2 border-background shadow-card">
              <Image src={g} alt="" fittingType="fill" className="w-full h-full" />
            </div>
          ))}
        </div>

        <div className="detail-body">
          <h1 className="page-title">{r.name}</h1>
          <div className="flex items-center gap-1.5 mt-1.5 text-xs text-muted-foreground min-w-0">
            <MapPin className="w-3.5 h-3.5 shrink-0 text-primary/80" strokeWidth={1.5} />
            <span className="truncate">{[r.city, r.country].filter(Boolean).join(", ")}{r.distance != null ? ` · ${r.distance} km` : ""}</span>
          </div>

          {rating && (
            <div className="mt-3 flex items-center gap-1.5 text-sm min-w-0">
              <Star className="w-3.5 h-3.5 fill-brand-gold text-brand-gold shrink-0" strokeWidth={0} />
              <span className="font-semibold tabular-nums">{rating}</span>
              {r.reviews != null && (
                <>
                  <span className="text-muted-foreground/50">·</span>
                  <span className="text-muted-foreground">{Number(r.reviews).toLocaleString()} reviews</span>
                </>
              )}
            </div>
          )}

          {r.description && <p className="text-sm text-muted-foreground leading-relaxed mt-4">{r.description}</p>}

          <div className="mt-5 space-y-3">
            <EventMap
              compact
              query={[r.address, r.city, r.country].filter(Boolean).join(", ")}
              label={r.address}
            />
            <div className="space-y-2">
              {r.hours && <div className="flex items-start gap-2 text-sm"><Clock className="w-4 h-4 text-primary mt-0.5 shrink-0" strokeWidth={1.5} /><span>{r.hours}</span></div>}
              {r.phone && <div className="flex items-start gap-2 text-sm"><Phone className="w-4 h-4 text-primary mt-0.5 shrink-0" strokeWidth={1.5} /><span>{r.phone}</span></div>}
              {r.website && <a href={r.website} target="_blank" rel="noreferrer" className="flex items-start gap-2 text-sm text-primary"><Globe className="w-4 h-4 mt-0.5 shrink-0" strokeWidth={1.5} /><span className="underline">{siteLabel(r.website)}</span></a>}
              {r.menuUrl && <a href={r.menuUrl} target="_blank" rel="noreferrer" className="flex items-start gap-2 text-sm text-primary"><UtensilsCrossed className="w-4 h-4 mt-0.5 shrink-0" strokeWidth={1.5} /><span className="underline">View menu</span></a>}
              {r.reservationUrl && <a href={r.reservationUrl} target="_blank" rel="noreferrer" className="flex items-start gap-2 text-sm text-primary"><CalendarCheck className="w-4 h-4 mt-0.5 shrink-0" strokeWidth={1.5} /><span className="underline">Make a reservation</span></a>}
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

          <ReviewSection itemKey={itemKey} itemType="restaurant" itemTitle={r.name} />

          <button onClick={() => setReportOpen(true)} className="mt-4 text-xs text-muted-foreground flex items-center gap-1.5 underline underline-offset-2">
            <Flag className="w-3.5 h-3.5" strokeWidth={1.5} /> Report incorrect information
          </button>
          <ReportSheet open={reportOpen} onOpenChange={setReportOpen} target={{ type: "place", id: itemKey, title: r.name }} />
        </div>
      </div>

      <div className="sticky bottom-0 app-px pt-3 safe-pb bg-background/95 backdrop-blur border-t border-border flex gap-2">
        <a href={directionsUrl} target="_blank" rel="noreferrer" className="flex-1">
          <Button variant="outline" className="w-full">
            <Navigation className="w-4 h-4" strokeWidth={1.5} /> Directions
          </Button>
        </a>
        {r.reservationUrl ? (
          <a href={r.reservationUrl} target="_blank" rel="noreferrer" className="flex-1">
            <Button className="w-full bg-primary text-primary-foreground">
              <CalendarCheck className="w-4 h-4" strokeWidth={1.5} /> Reserve
            </Button>
          </a>
        ) : (
          <Button className="flex-1 bg-primary text-primary-foreground" onClick={onShare}>
            <Share2 className="w-4 h-4" strokeWidth={1.5} /> Share
          </Button>
        )}
      </div>
    </div>
  );
}