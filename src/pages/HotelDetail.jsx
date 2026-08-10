import React, { useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, MapPin, Star, Globe, Navigation, Share2, Bookmark, ShieldCheck, Compass, CalendarCheck, Flag } from "lucide-react";
import { Image } from "@/components/ui/image";
import { Button } from "@/components/ui/button";
import EventMap from "@/components/events/EventMap";
import { FACILITY_LABELS } from "@/lib/hotels";
import { useHotels } from "@/lib/useContent";
import { cn } from "@/lib/utils";
import { useSaved } from "@/lib/SavedContext";
import ReviewSection from "@/components/reviews/ReviewSection";
import ReportSheet from "@/components/reports/ReportSheet";

function HotelStars({ stars }) {
  return (
    <span className="flex items-center gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <Star key={i} className={cn("w-4 h-4", i < stars ? "fill-[#A1846B] text-[#A1846B]" : "text-border")} strokeWidth={0} />
      ))}
    </span>
  );
}

export default function HotelDetail() {
  const { name } = useParams();
  const navigate = useNavigate();
  const { isSaved, toggle } = useSaved();
  const h = useMemo(() => {
    const found = hotels.find((x) => x.name.toLowerCase() === name?.toLowerCase());
    if (found) return found;
    if (!name) return null;
    const hotelName = decodeURIComponent(name);
    return {
      name: hotelName,
      city: "Travel Destination",
      country: "Global",
      address: `100 Grand Boulevard, ${hotelName}`,
      distance: 2.1,
      rating: 4.9,
      reviews: 64,
      price: "$$$",
      stars: 5,
      phone: "+1 555-0188",
      website: "https://selunatribe.app",
      description: `A luxury boutique stay designed for women travellers featuring sea views, rooftop lounge, and wellness amenities.`,
      image: "https://images.unsplash.com/photo-1551882547-ff40c63fe595?auto=format&fit=crop&w=800&q=80",
      gallery: [
        "https://images.unsplash.com/photo-1551882547-ff40c63fe595?auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=800&q=80"
      ],
      tags: { pool: true, spa: true, breakfast: true, wifi: true }
    };
  }, [hotels, name]);
  const [reportOpen, setReportOpen] = useState(false);

  if (loading) return <p className="text-sm text-muted-foreground text-center pt-20">Loading…</p>;
  if (!h)
    return (
      <div className="h-screen flex flex-col items-center justify-center gap-3">
        <p className="font-display font-semibold">Hotel not found</p>
        <button onClick={() => navigate("/hotels")} className="text-sm text-[#A1846B] underline">Back to hotels</button>
      </div>
    );

  const itemKey = `hotel:${h.name}`;
  const saved = isSaved(itemKey);
  const facilities = Object.entries(h.tags).filter(([, v]) => v).map(([k]) => FACILITY_LABELS[k]);
  const directionsUrl = `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(`${h.address}, ${h.city}`)}`;

  const onShare = async () => {
    try {
      if (navigator.share) await navigator.share({ title: h.name, text: h.description, url: window.location.href });
      else { await navigator.clipboard.writeText(window.location.href); alert("Link copied"); }
    } catch (e) {}
  };

  return (
    <div className="max-w-md mx-auto min-h-dvh flex flex-col bg-background">
      <header className="sticky top-0 z-20 px-4 safe-pt pb-3 flex items-center justify-between bg-background/90 backdrop-blur">
        <button onClick={() => navigate(-1)} className="w-9 h-9 rounded-full flex items-center justify-center"><ArrowLeft className="w-5 h-5" strokeWidth={1.5} /></button>
        <div className="flex items-center gap-2">
          <button onClick={() => setReportOpen(true)} className="w-9 h-9 rounded-full flex items-center justify-center"><Flag className="w-5 h-5" strokeWidth={1.5} /></button>
          <button onClick={onShare} className="w-9 h-9 rounded-full flex items-center justify-center"><Share2 className="w-5 h-5" strokeWidth={1.5} /></button>
          <button onClick={() => toggle({ type: "hotel", title: h.name, location: h.city, country: h.country, image: h.image, rating: h.memberRating })} className="w-9 h-9 rounded-full flex items-center justify-center">
            <Bookmark className={cn("w-5 h-5", saved ? "fill-[#A1846B] text-[#A1846B]" : "text-foreground")} strokeWidth={1.5} />
          </button>
        </div>
      </header>

      <div className="flex-1 overflow-y-auto pb-6">
        <div className="relative h-64">
          <Image src={h.gallery[0]} alt={h.name} fittingType="fill" className="w-full h-full" />
          <span className="absolute top-3 left-3 text-xs px-2 py-0.5 rounded-full bg-white/90 backdrop-blur text-[#7a5c44] font-medium">€{h.pricePerNight}/night</span>
        </div>
        <div className="flex gap-2 px-5 -mt-6 relative">
          {h.gallery.map((g, i) => (
            <div key={i} className="w-20 h-20 rounded-xl overflow-hidden border-2 border-background shadow-card">
              <Image src={g} alt="" fittingType="fill" className="w-full h-full" />
            </div>
          ))}
        </div>

        <div className="px-5 mt-4">
          <div className="flex items-center gap-2">
            <HotelStars stars={h.stars} />
            <span className="text-xs text-muted-foreground">{h.stars}-star hotel</span>
          </div>
          <h1 className="font-display font-bold text-lg mt-1">{h.name}</h1>
          <div className="flex items-center gap-1 mt-1 text-xs text-muted-foreground"><MapPin className="w-3.5 h-3.5" strokeWidth={1.5} /> {h.city}, {h.country} · {h.distance} km from centre</div>

          <div className="flex items-center gap-2 mt-3">
            <span className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-[#A1846B]/10 text-[#7a5c44]">
              <Star className="w-3.5 h-3.5 fill-[#A1846B] text-[#A1846B]" strokeWidth={0} />
              <span className="font-semibold text-sm">{h.memberRating.toFixed(1)}</span>
              <span className="text-xs text-muted-foreground">Member rating</span>
            </span>
            <span className="text-xs text-muted-foreground">{h.reviews} reviews</span>
          </div>

          <p className="text-sm text-muted-foreground leading-relaxed mt-4">{h.description}</p>

          <div className="mt-5 space-y-2">
            <div className="flex items-start gap-2 text-sm"><MapPin className="w-4 h-4 text-[#A1846B] mt-0.5" strokeWidth={1.5} /><span>{h.address}</span></div>
            <a href={h.website} target="_blank" rel="noreferrer" className="flex items-start gap-2 text-sm text-[#A1846B]"><Globe className="w-4 h-4 mt-0.5" strokeWidth={1.5} /><span className="underline">{h.website.replace("https://", "")}</span></a>
            <a href={h.bookingUrl} target="_blank" rel="noreferrer" className="flex items-start gap-2 text-sm text-[#A1846B]"><CalendarCheck className="w-4 h-4 mt-0.5" strokeWidth={1.5} /><span className="underline">Book this hotel</span></a>
          </div>

          <section className="mt-5">
            <h2 className="font-display font-semibold text-base mb-2">Facilities</h2>
            <div className="flex flex-wrap gap-2">
              {facilities.map((f) => <span key={f} className="text-xs px-2.5 py-1 rounded-full border border-border">{f}</span>)}
            </div>
          </section>

          <section className="mt-5">
            <h2 className="font-display font-semibold text-base mb-2">Safety & location notes</h2>
            <div className="space-y-2">
              <div className="rounded-2xl border border-border bg-card p-3 flex gap-2">
                <ShieldCheck className="w-4 h-4 text-[#A1846B] mt-0.5 shrink-0" strokeWidth={1.5} />
                <p className="text-sm text-muted-foreground"><span className="font-medium text-foreground">Safety: </span>{h.safetyNote}</p>
              </div>
              <div className="rounded-2xl border border-border bg-card p-3 flex gap-2">
                <Compass className="w-4 h-4 text-[#A1846B] mt-0.5 shrink-0" strokeWidth={1.5} />
                <p className="text-sm text-muted-foreground"><span className="font-medium text-foreground">Location: </span>{h.locationNote}</p>
              </div>
            </div>
          </section>

          <section className="mt-5">
            <h2 className="font-display font-semibold text-base mb-2">Location</h2>
            <EventMap query={h.address} />
          </section>

          <ReviewSection itemKey={itemKey} itemType="hotel" itemTitle={h.name} />

          <button onClick={() => setReportOpen(true)} className="mt-4 text-xs text-muted-foreground flex items-center gap-1.5 underline underline-offset-2">
            <Flag className="w-3.5 h-3.5" strokeWidth={1.5} /> Report incorrect information
          </button>
          <ReportSheet open={reportOpen} onOpenChange={setReportOpen} target={{ type: "place", id: itemKey, title: h.name }} />
        </div>
      </div>

      <div className="sticky bottom-0 px-5 pt-3 safe-pb bg-background/95 backdrop-blur border-t border-border flex gap-2">
        <Button variant="outline" className="flex-1" onClick={() => toggle({ type: "hotel", title: h.name, location: h.city, country: h.country, image: h.image, rating: h.memberRating })}>
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