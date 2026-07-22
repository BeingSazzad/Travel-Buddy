import React, { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, MapPin, Sun, Sparkles, ShieldCheck, Bus, BedDouble, Users, CalendarHeart, Flag } from "lucide-react";
import { base44 } from "@/api/base44Client";
import { Image } from "@/components/ui/image";
import { Button } from "@/components/ui/button";
import EventMap from "@/components/events/EventMap";
import VenueRow from "@/components/destinations/VenueRow";
import ReviewSection from "@/components/reviews/ReviewSection";
import ReportSheet from "@/components/reports/ReportSheet";
import EventCard from "@/components/events/EventCard";
import { DESTINATIONS } from "@/lib/destinations";
import { contentFor } from "@/lib/destination-content";

const AV = "https://images.unsplash.com/photo-1521119989659-a83eee488004?auto=format&fit=crop&w=120&q=80";
const today = () => { const d = new Date(); d.setHours(0, 0, 0, 0); return d; };

function Section({ icon: Icon, title, children }) {
  return (
    <section className="mt-6">
      <h2 className="font-display font-semibold text-base mb-2 flex items-center gap-1.5">
        <Icon className="w-4 h-4 text-[#A1846B]" strokeWidth={1.5} /> {title}
      </h2>
      {children}
    </section>
  );
}

export default function DestinationDetail() {
  const { city } = useParams();
  const navigate = useNavigate();
  const [reportOpen, setReportOpen] = useState(false);
  const dest = useMemo(() => DESTINATIONS.find((d) => d.city.toLowerCase() === city?.toLowerCase()), [city]);
  const content = useMemo(() => contentFor(dest?.city), [dest?.city]);

  const [trips, setTrips] = useState([]);
  const [profiles, setProfiles] = useState({});
  const [events, setEvents] = useState([]);
  const [stats, setStats] = useState({ members: dest?.counts?.members || 0, events: dest?.counts?.events || 0 });

  useEffect(() => {
    if (!dest) return;
    base44.entities.Trip.filter({ city: dest.city }).then(setTrips).catch(() => {});
    base44.entities.Event.filter({ city: dest.city }).then(setEvents).catch(() => {});
  }, [dest?.city]);

  useEffect(() => {
    const ids = [...new Set(trips.map((t) => t.created_by_id))].slice(0, 8);
    (async () => {
      const p = {};
      for (const id of ids) {
        try { const r = await base44.functions.invoke("member-profile", { user_id: id }); p[id] = r.data?.profile; } catch (e) {}
      }
      setProfiles(p);
    })();
  }, [trips]);

  const t0 = today();
  const currently = trips.filter((t) => new Date(t.start_date) <= t0 && new Date(t.end_date) >= t0);
  const soon = trips.filter((t) => new Date(t.start_date) > t0);

  const MemberStack = ({ list }) => {
    if (list.length === 0) return <p className="text-sm text-muted-foreground">No members yet — be the first!</p>;
    return (
      <div className="space-y-2">
        {list.slice(0, 4).map((t) => {
          const p = profiles[t.created_by_id];
          return (
            <div key={t.id} className="flex items-center gap-3">
              <img src={p?.avatar || AV} alt={p?.name || "Member"} className="w-9 h-9 rounded-full object-cover" />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">{p?.name || "Seluna member"}</p>
                <p className="text-xs text-muted-foreground truncate">{t.start_date} → {t.end_date}</p>
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  if (!dest)
    return (
      <div className="h-screen flex flex-col items-center justify-center gap-3">
        <p className="font-display font-semibold">Destination not found</p>
        <button onClick={() => navigate("/destinations")} className="text-sm text-[#A1846B] underline">Back to destinations</button>
      </div>
    );

  return (
    <div className="max-w-md mx-auto min-h-screen flex flex-col bg-background">
      <header className="sticky top-0 z-20 px-4 pt-10 pb-3 flex items-center justify-between bg-background/90 backdrop-blur">
        <button onClick={() => navigate(-1)} className="w-9 h-9 rounded-full flex items-center justify-center"><ArrowLeft className="w-5 h-5" strokeWidth={1.5} /></button>
        <div className="flex items-center gap-1">
          <button onClick={() => setReportOpen(true)} className="w-9 h-9 rounded-full flex items-center justify-center text-muted-foreground"><Flag className="w-5 h-5" strokeWidth={1.5} /></button>
          <button onClick={() => navigate(`/trips/new?city=${encodeURIComponent(dest.city)}`)} className="w-9 h-9 rounded-full bg-foreground text-background flex items-center justify-center"><Sparkles className="w-5 h-5" strokeWidth={1.5} /></button>
        </div>
      </header>

      <div className="flex-1 overflow-y-auto pb-28">
        {/* Hero */}
        <div className="relative h-72">
          <Image src={dest.image} alt={dest.city} fittingType="fill" className="w-full h-full" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
          <div className="absolute bottom-4 left-5 right-5">
            <div className="flex items-center gap-1 text-white/80 text-xs mb-1"><MapPin className="w-3.5 h-3.5" strokeWidth={1.5} /> {dest.city}, {dest.country}</div>
            <h1 className="font-display font-semibold text-3xl text-white">{dest.city}</h1>
            <div className="flex items-center gap-2 mt-2">
              <span className="text-[11px] px-2 py-0.5 rounded-full bg-white/20 text-white">{dest.continent}</span>
              <span className="text-[11px] px-2 py-0.5 rounded-full bg-white/20 text-white flex items-center gap-1"><Sun className="w-3 h-3" strokeWidth={1.5} /> {dest.weather}</span>
              {dest.tags.solo && <span className="text-[11px] px-2 py-0.5 rounded-full bg-white/20 text-white">Solo-friendly</span>}
            </div>
          </div>
        </div>

        <div className="px-5">
          <p className="text-sm text-muted-foreground leading-relaxed mt-4">{dest.description}</p>

          {/* Weather (curated; no live integration connected) */}
          <Section icon={Sun} title="Weather">
            <div className="rounded-2xl border border-border bg-card p-4 flex items-center gap-3">
              <Sun className="w-6 h-6 text-[#A1846B]" strokeWidth={1.5} />
              <div>
                <p className="font-medium text-sm">{dest.weather} climate</p>
                <p className="text-xs text-muted-foreground">Typical conditions for {dest.city}. Connect a weather service for live forecasts.</p>
              </div>
            </div>
          </Section>

          {/* Map */}
          <Section icon={MapPin} title="On the map">
            <EventMap query={`${dest.city}, ${dest.country}`} />
          </Section>

          {/* Travel tips */}
          <Section icon={Sparkles} title="Travel tips">
            <ul className="text-sm text-muted-foreground space-y-1.5 list-disc pl-5">
              {content.travelTips.map((t, i) => <li key={i}>{t}</li>)}
            </ul>
          </Section>

          {/* Safety */}
          <Section icon={ShieldCheck} title="Safety tips">
            <ul className="text-sm text-muted-foreground space-y-1.5 list-disc pl-5">
              {content.safetyTips.map((t, i) => <li key={i}>{t}</li>)}
            </ul>
          </Section>

          {/* Best areas */}
          <Section icon={BedDouble} title="Best areas to stay">
            <div className="space-y-2">
              {content.bestAreas.map((a) => (
                <div key={a.name} className="rounded-2xl border border-border bg-card p-3">
                  <p className="font-medium text-sm">{a.name}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">{a.note}</p>
                </div>
              ))}
            </div>
          </Section>

          {/* Transport */}
          <Section icon={Bus} title="Getting around">
            <p className="text-sm text-muted-foreground leading-relaxed">{content.transport}</p>
          </Section>

          {/* Women */}
          <Section icon={Users} title={`Women here (${Math.max(currently.length, stats.members)})`}>
            <MemberStack list={currently} />
          </Section>
          <Section icon={Users} title="Travelling soon">
            <MemberStack list={soon} />
          </Section>

          {/* Venues */}
          <Section icon={Sparkles} title="Cafés">
            <div className="grid grid-cols-1 gap-2">{content.cafes.map((v) => <VenueRow key={v.name} venue={v} />)}</div>
          </Section>
          <Section icon={Sparkles} title="Restaurants">
            <div className="grid grid-cols-1 gap-2">{content.restaurants.map((v) => <VenueRow key={v.name} venue={v} />)}</div>
          </Section>
          <Section icon={BedDouble} title="Hotels">
            <div className="grid grid-cols-1 gap-2">{content.hotels.map((v) => <VenueRow key={v.name} venue={v} />)}</div>
          </Section>

          {/* Events (live) */}
          <Section icon={CalendarHeart} title={`Events (${Math.max(events.length, stats.events)})`}>
            {events.length === 0 ? (
              <p className="text-sm text-muted-foreground">No events listed yet for {dest.city}.</p>
            ) : (
              <div className="space-y-4">{events.slice(0, 3).map((e) => <EventCard key={e.id} event={e} joined={false} onRsvp={() => {}} />)}</div>
            )}
          </Section>

          {/* Deals */}
          <Section icon={Sparkles} title="Deals">
            <div className="grid grid-cols-1 gap-2">{content.deals.map((v) => <VenueRow key={v.name} venue={v} />)}</div>
          </Section>

          {/* Reviews */}
          <Section icon={Users} title="Member reviews">
            <ReviewSection itemKey={`destination:${dest.city}`} itemType="destination" itemTitle={dest.city} />
            <button onClick={() => setReportOpen(true)} className="mt-3 text-xs text-muted-foreground flex items-center gap-1.5 underline underline-offset-2">
              <Flag className="w-3.5 h-3.5" strokeWidth={1.5} /> Report incorrect information
            </button>
            <ReportSheet open={reportOpen} onOpenChange={setReportOpen} target={{ type: "place", id: `destination:${dest.city}`, title: dest.city }} />
          </Section>
        </div>
      </div>

      {/* CTA */}
      <div className="sticky bottom-0 px-5 py-4 bg-background/95 backdrop-blur border-t border-border pb-6">
        <Button className="w-full h-12 bg-foreground text-background" onClick={() => navigate(`/trips/new?city=${encodeURIComponent(dest.city)}`)}>
          Create trip to {dest.city}
        </Button>
      </div>
    </div>
  );
}