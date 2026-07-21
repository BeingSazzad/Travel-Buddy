import React, { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, MapPin, Star, Clock, Phone, Globe, Navigation, Share2, Bookmark, Pencil } from "lucide-react";
import { base44 } from "@/api/base44Client";
import { Image } from "@/components/ui/image";
import { Button } from "@/components/ui/button";
import EventMap from "@/components/events/EventMap";
import { CAFES, PRICE_LABELS, FACILITY_LABELS } from "@/lib/cafes";
import { cn } from "@/lib/utils";
import { useSaved } from "@/lib/SavedContext";

const AV = (id) => `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=120&q=80`;

export default function CafeDetail() {
  const { name } = useParams();
  const navigate = useNavigate();
  const { isSaved, toggle } = useSaved();
  const cafe = useMemo(() => CAFES.find((c) => c.name.toLowerCase() === name?.toLowerCase()), [name]);

  const [reviews, setReviews] = useState([]);
  const [loadingReviews, setLoadingReviews] = useState(true);
  const [writing, setWriting] = useState(false);
  const [newRating, setNewRating] = useState(5);
  const [newText, setNewText] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const itemKey = cafe ? `cafe:${cafe.name}` : "";

  useEffect(() => {
    if (!cafe) return;
    setLoadingReviews(true);
    base44.entities.Review.filter({ item_key: itemKey }, "-created_date")
      .then(setReviews)
      .catch(() => {})
      .finally(() => setLoadingReviews(false));
  }, [cafe, itemKey]);

  if (!cafe)
    return (
      <div className="h-screen flex flex-col items-center justify-center gap-3">
        <p className="font-display font-semibold">Café not found</p>
        <button onClick={() => navigate("/cafes")} className="text-sm text-[#A1846B] underline">Back to cafés</button>
      </div>
    );

  const saved = isSaved(itemKey);
  const facilities = Object.entries(cafe.tags).filter(([, v]) => v).map(([k]) => FACILITY_LABELS[k]);
  const directionsUrl = `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(`${cafe.address}, ${cafe.city}`)}`;

  const onShare = async () => {
    try {
      if (navigator.share) await navigator.share({ title: cafe.name, text: cafe.description, url: window.location.href });
      else { await navigator.clipboard.writeText(window.location.href); alert("Link copied"); }
    } catch (e) {}
  };

  const submitReview = async () => {
    if (!newText.trim()) return;
    setSubmitting(true);
    try {
      const me = await base44.auth.me();
      const review = await base44.entities.Review.create({
        item_key: itemKey, item_type: "cafe", item_title: cafe.name,
        rating: newRating, text: newText.trim(),
        author_name: me.full_name || "Seluna member",
        author_avatar: me.avatar || AV("1521119989659-a83eee488004"),
      });
      setReviews((r) => [review, ...r]);
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
          <button onClick={() => toggle({ type: "cafe", title: cafe.name, location: cafe.city, country: cafe.country, image: cafe.image, rating: cafe.rating })} className="w-9 h-9 rounded-full flex items-center justify-center">
            <Bookmark className={cn("w-5 h-5", saved ? "fill-[#A1846B] text-[#A1846B]" : "text-foreground")} strokeWidth={1.5} />
          </button>
        </div>
      </header>

      <div className="flex-1 overflow-y-auto pb-28">
        {/* Gallery */}
        <div className="relative h-64">
          <Image src={cafe.gallery[0]} alt={cafe.name} fittingType="fill" className="w-full h-full" />
          <span className="absolute top-3 left-3 text-[11px] px-2 py-0.5 rounded-full bg-white/90 backdrop-blur text-[#7a5c44] font-medium">{PRICE_LABELS[cafe.price]}</span>
        </div>
        <div className="flex gap-2 px-5 -mt-6 relative">
          {cafe.gallery.map((g, i) => (
            <div key={i} className="w-20 h-20 rounded-xl overflow-hidden border-2 border-background shadow-card">
              <Image src={g} alt="" fittingType="fill" className="w-full h-full" />
            </div>
          ))}
        </div>

        <div className="px-5 mt-4">
          <h1 className="font-display font-semibold text-2xl">{cafe.name}</h1>
          <div className="flex items-center gap-1 mt-1 text-xs text-muted-foreground"><MapPin className="w-3.5 h-3.5" strokeWidth={1.5} /> {cafe.city}, {cafe.country} · {cafe.distance} km</div>

          <div className="flex items-center gap-2 mt-3">
            <span className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-[#A1846B]/10 text-[#7a5c44]">
              <Star className="w-3.5 h-3.5 fill-[#A1846B] text-[#A1846B]" strokeWidth={0} />
              <span className="font-semibold text-sm">{cafe.rating.toFixed(1)}</span>
              <span className="text-xs text-muted-foreground">Seluna rating</span>
            </span>
            <span className="text-xs text-muted-foreground">{cafe.reviews} reviews</span>
          </div>

          <p className="text-sm text-muted-foreground leading-relaxed mt-4">{cafe.description}</p>

          {/* Info */}
          <div className="mt-5 space-y-2">
            <div className="flex items-start gap-2 text-sm"><MapPin className="w-4 h-4 text-[#A1846B] mt-0.5" strokeWidth={1.5} /><span>{cafe.address}</span></div>
            <div className="flex items-start gap-2 text-sm"><Clock className="w-4 h-4 text-[#A1846B] mt-0.5" strokeWidth={1.5} /><span>{cafe.hours}</span></div>
            <div className="flex items-start gap-2 text-sm"><Phone className="w-4 h-4 text-[#A1846B] mt-0.5" strokeWidth={1.5} /><span>{cafe.phone}</span></div>
            <a href={cafe.website} target="_blank" rel="noreferrer" className="flex items-start gap-2 text-sm text-[#A1846B]"><Globe className="w-4 h-4 mt-0.5" strokeWidth={1.5} /><span className="underline">{cafe.website.replace("https://", "")}</span></a>
          </div>

          {/* Facilities */}
          <section className="mt-5">
            <h2 className="font-display font-semibold text-base mb-2">Facilities</h2>
            <div className="flex flex-wrap gap-2">
              {facilities.map((f) => <span key={f} className="text-xs px-2.5 py-1 rounded-full border border-border">{f}</span>)}
            </div>
          </section>

          {/* Map */}
          <section className="mt-5">
            <h2 className="font-display font-semibold text-base mb-2">Location</h2>
            <EventMap query={cafe.address} />
          </section>

          {/* Reviews */}
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
              <p className="text-sm text-muted-foreground">No reviews yet — be the first to review {cafe.name}.</p>
            ) : (
              <div className="space-y-2">
                {reviews.map((r) => (
                  <div key={r.id} className="rounded-2xl border border-border bg-card p-3">
                    <div className="flex items-center gap-2">
                      <img src={r.author_avatar} alt={r.author_name} className="w-8 h-8 rounded-full object-cover" />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">{r.author_name}</p>
                        <span className="flex items-center gap-0.5">
                          {Array.from({ length: 5 }).map((_, i) => (
                            <Star key={i} className={cn("w-3 h-3", i < r.rating ? "fill-[#A1846B] text-[#A1846B]" : "text-border")} strokeWidth={0} />
                          ))}
                        </span>
                      </div>
                    </div>
                    <p className="text-sm text-muted-foreground mt-2 leading-relaxed">{r.text}</p>
                  </div>
                ))}
              </div>
            )}
          </section>
        </div>
      </div>

      {/* Action bar */}
      <div className="sticky bottom-0 px-5 py-3 bg-background/95 backdrop-blur border-t border-border flex gap-2 pb-6">
        <Button variant="outline" className="flex-1" onClick={() => toggle({ type: "cafe", title: cafe.name, location: cafe.city, country: cafe.country, image: cafe.image, rating: cafe.rating })}>
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