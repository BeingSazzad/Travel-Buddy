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

export default function RestaurantDetail() {
  const { name } = useParams();
  const navigate = useNavigate();
  const { isSaved, toggle } = useSaved();
  const r = useMemo(() => {
    const found = restaurants.find((x) => x.name.toLowerCase() === name?.toLowerCase());
    if (found) return found;
    if (!name) return null;
    const restName = decodeURIComponent(name);
    return {
      name: restName,
      city: "Travel Destination",
      country: "Global",
      address: `15 Culinary Way, ${restName}`,
      distance: 1.8,
      rating: 4.9,
      reviews: 48,
      price: "$$$",
      hours: "12:00 PM – 11:00 PM",
      phone: "+1 555-0199",
      website: "https://selunatribe.app",
      description: `An exquisite dining experience featuring local produce, authentic wine, and a warm atmosphere.`,
      image: "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?auto=format&fit=crop&w=800&q=80",
      gallery: [
        "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?auto=format&fit=crop&w=800&q=80"
      ],
      tags: { outdoor: true, reservations: true, vegan: true }
    };
  }, [restaurants, name]);
  const [reportOpen, setReportOpen] = useState(false);

  if (loading) return <p className="text-sm text-muted-foreground text-center pt-20">Loading…</p>;
  if (!r)
    return (
      <div className="h-screen flex flex-col items-center justify-center gap-3">
        <p className="font-display font-semibold">Restaurant not found</p>
        <button onClick={() => navigate("/restaurants")} className="text-sm text-[#A1846B] underline">Back to restaurants</button>
      </div>
    );

  const itemKey = `restaurant:${r.name}`;
  const saved = isSaved(itemKey);
  const facilities = Object.entries(r.tags).filter(([, v]) => v).map(([k]) => FACILITY_LABELS[k]);
  const directionsUrl = `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(`${r.address}, ${r.city}`)}`;

  const onShare = async () => {
    try {
      if (navigator.share) await navigator.share({ title: r.name, text: r.description, url: window.location.href });
      else { await navigator.clipboard.writeText(window.location.href); alert("Link copied"); }
    } catch (e) {}
  };

  return (
    <div className="max-w-app mx-auto min-h-dvh flex flex-col bg-background">
      <header className="sticky top-0 z-20 px-app safe-pt pb-3 flex items-center justify-between bg-background/90 backdrop-blur">
        <button onClick={() => navigate(-1)} className="w-9 h-9 rounded-full flex items-center justify-center"><ArrowLeft className="w-5 h-5" strokeWidth={1.5} /></button>
        <div className="flex items-center gap-2">
          <button onClick={() => setReportOpen(true)} className="w-9 h-9 rounded-full flex items-center justify-center"><Flag className="w-5 h-5" strokeWidth={1.5} /></button>
          <button onClick={onShare} className="w-9 h-9 rounded-full flex items-center justify-center"><Share2 className="w-5 h-5" strokeWidth={1.5} /></button>
          <button onClick={() => toggle({ type: "restaurant", title: r.name, location: r.city, country: r.country, image: r.image, rating: r.rating })} className="w-9 h-9 rounded-full flex items-center justify-center">
            <Bookmark className={cn("w-5 h-5", saved ? "fill-[#A1846B] text-[#A1846B]" : "text-foreground")} strokeWidth={1.5} />
          </button>
        </div>
      </header>

      <div className="flex-1 overflow-y-auto pb-6">
        <div className="relative h-64">
          <Image src={r.gallery[0]} alt={r.name} fittingType="fill" className="w-full h-full" />
          <span className="absolute top-3 left-3 text-xs px-2 py-0.5 rounded-full bg-white/90 backdrop-blur text-[#7a5c44] font-medium">{PRICE_LABELS[r.price]}</span>
          <span className="absolute bottom-3 left-3 text-xs px-2 py-0.5 rounded-full bg-[#A1846B] text-white">{r.cuisine}</span>
        </div>
        <div className="flex gap-2 px-5 -mt-6 relative">
          {r.gallery.map((g, i) => (
            <div key={i} className="w-20 h-20 rounded-xl overflow-hidden border-2 border-background shadow-card">
              <Image src={g} alt="" fittingType="fill" className="w-full h-full" />
            </div>
          ))}
        </div>

        <div className="px-5 mt-4">
          <h1 className="font-display font-bold text-lg">{r.name}</h1>
          <div className="flex items-center gap-1 mt-1 text-xs text-muted-foreground"><MapPin className="w-3.5 h-3.5" strokeWidth={1.5} /> {r.city}, {r.country} · {r.distance} km</div>

          <div className="flex items-center gap-2 mt-3">
            <span className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-[#A1846B]/10 text-[#7a5c44]">
              <Star className="w-3.5 h-3.5 fill-[#A1846B] text-[#A1846B]" strokeWidth={0} />
              <span className="font-semibold text-sm">{r.rating.toFixed(1)}</span>
              <span className="text-xs text-muted-foreground">Seluna rating</span>
            </span>
            <span className="text-xs text-muted-foreground">{r.reviews} reviews</span>
          </div>

          <p className="text-sm text-muted-foreground leading-relaxed mt-4">{r.description}</p>

          <div className="mt-5 space-y-2">
            <div className="flex items-start gap-2 text-sm"><MapPin className="w-4 h-4 text-[#A1846B] mt-0.5" strokeWidth={1.5} /><span>{r.address}</span></div>
            <div className="flex items-start gap-2 text-sm"><Clock className="w-4 h-4 text-[#A1846B] mt-0.5" strokeWidth={1.5} /><span>{r.hours}</span></div>
            <div className="flex items-start gap-2 text-sm"><Phone className="w-4 h-4 text-[#A1846B] mt-0.5" strokeWidth={1.5} /><span>{r.phone}</span></div>
            <a href={r.website} target="_blank" rel="noreferrer" className="flex items-start gap-2 text-sm text-[#A1846B]"><Globe className="w-4 h-4 mt-0.5" strokeWidth={1.5} /><span className="underline">{r.website.replace("https://", "")}</span></a>
            {r.menuUrl && <a href={r.menuUrl} target="_blank" rel="noreferrer" className="flex items-start gap-2 text-sm text-[#A1846B]"><UtensilsCrossed className="w-4 h-4 mt-0.5" strokeWidth={1.5} /><span className="underline">View menu</span></a>}
            {r.reservationUrl && <a href={r.reservationUrl} target="_blank" rel="noreferrer" className="flex items-start gap-2 text-sm text-[#A1846B]"><CalendarCheck className="w-4 h-4 mt-0.5" strokeWidth={1.5} /><span className="underline">Make a reservation</span></a>}
          </div>

          <section className="mt-5">
            <h2 className="font-display font-semibold text-base mb-2">Facilities</h2>
            <div className="flex flex-wrap gap-2">
              {facilities.map((f) => <span key={f} className="text-xs px-2.5 py-1 rounded-full border border-border">{f}</span>)}
            </div>
          </section>

          <section className="mt-5">
            <h2 className="font-display font-semibold text-base mb-2">Location</h2>
            <EventMap query={r.address} />
          </section>

          <ReviewSection itemKey={itemKey} itemType="restaurant" itemTitle={r.name} />

          <button onClick={() => setReportOpen(true)} className="mt-4 text-xs text-muted-foreground flex items-center gap-1.5 underline underline-offset-2">
            <Flag className="w-3.5 h-3.5" strokeWidth={1.5} /> Report incorrect information
          </button>
          <ReportSheet open={reportOpen} onOpenChange={setReportOpen} target={{ type: "place", id: itemKey, title: r.name }} />
        </div>
      </div>

      <div className="sticky bottom-0 px-5 pt-3 safe-pb bg-background/95 backdrop-blur border-t border-border flex gap-2">
        <Button variant="outline" className="flex-1" onClick={() => toggle({ type: "restaurant", title: r.name, location: r.city, country: r.country, image: r.image, rating: r.rating })}>
          <Bookmark className={cn("w-4 h-4", saved ? "fill-[#A1846B] text-[#A1846B]" : "")} strokeWidth={1.5} /> {saved ? "Saved" : "Save"}
        </Button>
        <Button variant="outline" className="flex-1" onClick={onShare}><Share2 className="w-4 h-4" strokeWidth={1.5} /> Share</Button>
        <a href={directionsUrl} target="_blank" rel="noreferrer" className="flex-1">
          <Button className="w-full bg-foreground text-background"><Navigation className="w-4 h-4" strokeWidth={1.5} /> Directions</Button>
        </a>
      </div>
    </div>
  );
}