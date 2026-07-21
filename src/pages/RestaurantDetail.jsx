import React, { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, MapPin, Star, Clock, Phone, Globe, Navigation, Share2, Bookmark, Pencil, UtensilsCrossed, CalendarCheck } from "lucide-react";
import { base44 } from "@/api/base44Client";
import { Image } from "@/components/ui/image";
import { Button } from "@/components/ui/button";
import EventMap from "@/components/events/EventMap";
import { RESTAURANTS, PRICE_LABELS, FACILITY_LABELS } from "@/lib/restaurants";
import { cn } from "@/lib/utils";
import { useSaved } from "@/lib/SavedContext";

const AV = (id) => `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=120&q=80`;

export default function RestaurantDetail() {
  const { name } = useParams();
  const navigate = useNavigate();
  const { isSaved, toggle } = useSaved();
  const r = useMemo(() => RESTAURANTS.find((x) => x.name.toLowerCase() === name?.toLowerCase()), [name]);

  const [reviews, setReviews] = useState([]);
  const [loadingReviews, setLoadingReviews] = useState(true);
  const [writing, setWriting] = useState(false);
  const [newRating, setNewRating] = useState(5);
  const [newText, setNewText] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const itemKey = r ? `restaurant:${r.name}` : "";

  useEffect(() => {
    if (!r) return;
    setLoadingReviews(true);
    base44.entities.Review.filter({ item_key: itemKey }, "-created_date")
      .then(setReviews).catch(() => {}).finally(() => setLoadingReviews(false));
  }, [r, itemKey]);

  if (!r)
    return (
      <div className="h-screen flex flex-col items-center justify-center gap-3">
        <p className="font-display font-semibold">Restaurant not found</p>
        <button onClick={() => navigate("/restaurants")} className="text-sm text-[#A1846B] underline">Back to restaurants</button>
      </div>
    );

  const saved = isSaved(itemKey);
  const facilities = Object.entries(r.tags).filter(([, v]) => v).map(([k]) => FACILITY_LABELS[k]);
  const directionsUrl = `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(`${r.address}, ${r.city}`)}`;

  const onShare = async () => {
    try {
      if (navigator.share) await navigator.share({ title: r.name, text: r.description, url: window.location.href });
      else { await navigator.clipboard.writeText(window.location.href); alert("Link copied"); }
    } catch (e) {}
  };

  const submitReview = async () => {
    if (!newText.trim()) return;
    setSubmitting(true);
    try {
      const me = await base44.auth.me();
      const review = await base44.entities.Review.create({
        item_key: itemKey, item_type: "restaurant", item_title: r.name,
        rating: newRating, text: newText.trim(),
        author_name: me.full_name || "Seluna member",
        author_avatar: me.avatar || AV("1521119989659-a83eee488004"),
      });
      setReviews((rs) => [review, ...rs]);
      setNewText(""); setNewRating(5); setWriting(false);
    } catch (e) { alert("Please log in to post a review."); }
    finally { setSubmitting(false); }
  };

  return (
    <div className="max-w-md mx-auto min-h-screen flex flex-col bg-background">
      <header className="sticky top-0 z-20 px-4 pt-10 pb-3 flex items-center justify-between bg-background/90 backdrop-blur">
        <button onClick={() => navigate(-1)} className="w-9 h-9 rounded-full flex items-center justify-center"><ArrowLeft className="w-5 h-5" strokeWidth={1.5} /></button>
        <div className="flex items-center gap-2">
          <button onClick={onShare} className="w-9 h-9 rounded-full flex items-center justify-center"><Share2 className="w-5 h-5" strokeWidth={1.5} /></button>
          <button onClick={() => toggle({ type: "restaurant", title: r.name, location: r.city, country: r.country, image: r.image, rating: r.rating })} className="w-9 h-9 rounded-full flex items-center justify-center">
            <Bookmark className={cn("w-5 h-5", saved ? "fill-[#A1846B] text-[#A1846B]" : "text-foreground")} strokeWidth={1.5} />
          </button>
        </div>
      </header>

      <div className="flex-1 overflow-y-auto pb-28">
        <div className="relative h-64">
          <Image src={r.gallery[0]} alt={r.name} fittingType="fill" className="w-full h-full" />
          <span className="absolute top-3 left-3 text-[11px] px-2 py-0.5 rounded-full bg-white/90 backdrop-blur text-[#7a5c44] font-medium">{PRICE_LABELS[r.price]}</span>
          <span className="absolute bottom-3 left-3 text-[11px] px-2 py-0.5 rounded-full bg-[#A1846B] text-white">{r.cuisine}</span>
        </div>
        <div className="flex gap-2 px-5 -mt-6 relative">
          {r.gallery.map((g, i) => (
            <div key={i} className="w-20 h-20 rounded-xl overflow-hidden border-2 border-background shadow-card">
              <Image src={g} alt="" fittingType="fill" className="w-full h-full" />
            </div>
          ))}
        </div>

        <div className="px-5 mt-4">
          <h1 className="font-display font-semibold text-2xl">{r.name}</h1>
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

          <section className="mt-5">
            <div className="flex items-center justify-between mb-2">
              <h2 className="font-display font-semibold text-base">Member reviews ({reviews.length})</h2>
              <button onClick={() => setWriting((w) => !w)} className="text-sm text-[#A1846B] flex items-center gap-1"><Pencil className="w-3.5 h-3.5" strokeWidth={1.5} /> Write review</button>
            </div>

            {writing && (
              <div className="rounded-2xl border border-border bg-card p-3 mb-3 space-y-2">
                <div className="flex items-center gap-1">
                  {[1, 2, 3, 4, 5].map((n) => (
                    <button key={n} onClick={() => setNewRating(n)}>
                      <Star className={cn("w-5 h-5", n <= newRating ? "fill-[#A1846B] text-[#A1846B]" : "text-border")} strokeWidth={0} />
                    </button>
                  ))}
                </div>
                <textarea value={newText} onChange={(e) => setNewText(e.target.value)} placeholder="Share your experience…" rows={3} className="w-full rounded-xl border border-border bg-background p-2 text-sm resize-none" />
                <div className="flex gap-2 justify-end">
                  <button onClick={() => setWriting(false)} className="px-3 py-1.5 text-sm rounded-full border border-border">Cancel</button>
                  <button onClick={submitReview} disabled={submitting || !newText.trim()} className="px-4 py-1.5 text-sm rounded-full bg-foreground text-background disabled:opacity-50">Post</button>
                </div>
              </div>
            )}

            {loadingReviews ? (
              <p className="text-sm text-muted-foreground">Loading reviews…</p>
            ) : reviews.length === 0 ? (
              <p className="text-sm text-muted-foreground">No reviews yet — be the first to review {r.name}.</p>
            ) : (
              <div className="space-y-2">
                {reviews.map((rv) => (
                  <div key={rv.id} className="rounded-2xl border border-border bg-card p-3">
                    <div className="flex items-center gap-2">
                      <img src={rv.author_avatar} alt={rv.author_name} className="w-8 h-8 rounded-full object-cover" />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">{rv.author_name}</p>
                        <span className="flex items-center gap-0.5">
                          {Array.from({ length: 5 }).map((_, i) => (
                            <Star key={i} className={cn("w-3 h-3", i < rv.rating ? "fill-[#A1846B] text-[#A1846B]" : "text-border")} strokeWidth={0} />
                          ))}
                        </span>
                      </div>
                    </div>
                    <p className="text-sm text-muted-foreground mt-2 leading-relaxed">{rv.text}</p>
                  </div>
                ))}
              </div>
            )}
          </section>
        </div>
      </div>

      <div className="sticky bottom-0 px-5 py-3 bg-background/95 backdrop-blur border-t border-border flex gap-2 pb-6">
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