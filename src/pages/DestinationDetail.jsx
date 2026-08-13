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
import { contentFor } from "@/lib/destination-content";
import { useDestinations } from "@/lib/useContent";
import { eventsForCity } from "@/lib/mock-events";
import { demoVisitorsForCity, memberIdForTripCreator } from "@/lib/mock-trips";
import { findMockMember } from "@/lib/member-profile";
import { DEMO_USER, isSameAppUser } from "@/lib/demo-user";
import { fallbackDestination, FALLBACK_AVATAR_URL } from "@/lib/images";

const AV = FALLBACK_AVATAR_URL;
const today = () => { const d = new Date(); d.setHours(0, 0, 0, 0); return d; };

function Section({ icon: Icon, title, children }) {
  return (
    <section className="mt-6">
      <h2 className="font-display font-semibold text-base mb-2 flex items-center gap-1.5">
        <Icon className="w-4 h-4 text-primary" strokeWidth={1.5} /> {title}
      </h2>
      {children}
    </section>
  );
}

export default function DestinationDetail() {
  const { city } = useParams();
  const navigate = useNavigate();
  const [reportOpen, setReportOpen] = useState(false);
  const { items: destinations, loading } = useDestinations();
  const dest = useMemo(() => {
    const cityKey = decodeURIComponent(city || "").toLowerCase();
    const found = destinations.find((d) => d.city.toLowerCase() === cityKey);
    if (found) return found;
    if (!city) return null;
    const cityName = decodeURIComponent(city);
    const fb = fallbackDestination(cityName);
    return {
      city: cityName,
      country: "Explore",
      continent: "Global",
      image: fb.image,
      description: `Explore top cafes, local restaurants, hotels, and fellow women travel buddies visiting ${cityName}.`,
      weather: "Sunny",
      tags: { solo: true },
      counts: { members: 6, events: 2 }
    };
  }, [destinations, city]);
  const content = useMemo(() => contentFor(dest?.city), [dest?.city]);

  const [trips, setTrips] = useState([]);
  const [profiles, setProfiles] = useState({});
  const [events, setEvents] = useState([]);
  const stats = useMemo(() => ({ members: dest?.counts?.members || 0, events: dest?.counts?.events || 0 }), [dest]);

  useEffect(() => {
    if (!dest) return;
    const mockTrips = demoVisitorsForCity(dest.city);
    base44.entities.Trip.filter({ city: dest.city })
      .then((list) => {
        const ids = new Set((list || []).map((t) => t.id));
        const merged = [...(list || []), ...mockTrips.filter((m) => !ids.has(m.id))];
        setTrips(merged.length ? merged : mockTrips);
      })
      .catch(() => setTrips(mockTrips));
    base44.entities.Event.filter({ city: dest.city })
      .then((list) => {
        const mocks = eventsForCity(dest.city, dest.country);
        const ids = new Set((list || []).map((e) => e.id));
        const merged = [...(list || []), ...mocks.filter((m) => !ids.has(m.id))];
        setEvents(merged.length ? merged : mocks);
      })
      .catch(() => setEvents(eventsForCity(dest.city, dest.country)));
  }, [dest?.city]);

  useEffect(() => {
    const ids = [...new Set(trips.map((t) => t.created_by_id))].slice(0, 8);
    (async () => {
      const p = {};
      for (const id of ids) {
        if (isSameAppUser(id, DEMO_USER.id) || id === "demo_user") {
          p[id] = { name: DEMO_USER.profile_name, avatar: DEMO_USER.main_photo };
          continue;
        }
        const mock = findMockMember(memberIdForTripCreator(id));
        if (mock) {
          p[id] = mock;
          continue;
        }
        try {
          const r = await base44.functions.invoke("member-profile", { user_id: id });
          p[id] = r.data?.profile;
        } catch {
          /* skip */
        }
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

  if (loading) return <p className="text-sm text-muted-foreground text-center pt-20">Loading…</p>;
  if (!dest)
    return (
      <div className="h-screen flex flex-col items-center justify-center gap-3">
        <p className="font-display font-semibold">Destination not found</p>
        <button onClick={() => navigate("/destinations")} className="text-sm text-primary underline">Back to destinations</button>
      </div>
    );

  return (
    <div className="max-w-app mx-auto min-h-dvh flex flex-col bg-background">
      <header className="sticky top-0 z-20 px-app safe-pt pb-3 flex items-center justify-between bg-background/90 backdrop-blur">
        <button onClick={() => navigate(-1)} className="w-9 h-9 rounded-full flex items-center justify-center tap-feedback"><ArrowLeft className="w-5 h-5" strokeWidth={1.5} /></button>
        <div className="flex items-center gap-1">
          <button onClick={() => navigate(`/trips/new?city=${encodeURIComponent(dest.city)}`)} className="w-9 h-9 rounded-full gradient-brand-accent text-white flex items-center justify-center tap-feedback shadow-sm" aria-label="Plan a trip"><Sparkles className="w-5 h-5" strokeWidth={1.5} /></button>
        </div>
      </header>

      <div className="flex-1 overflow-y-auto pb-6">
        {/* Hero */}
        <div className="relative h-72">
          <Image src={dest.image} alt={dest.city} fittingType="fill" className="w-full h-full object-cover" />
          {/* Strong bottom scrim so white type stays readable on bright photos */}
          <div
            className="absolute inset-0 pointer-events-none z-10"
            style={{
              background:
                "linear-gradient(to top, hsl(0 0% 0% / 0.88) 0%, hsl(0 0% 0% / 0.55) 38%, hsl(0 0% 0% / 0.18) 62%, transparent 100%)",
            }}
          />
          <div className="absolute bottom-4 left-5 right-5 z-20">
            <div className="flex items-center gap-1 text-white/90 text-xs mb-1 drop-shadow-[0_1px_3px_rgba(0,0,0,0.75)]">
              <MapPin className="w-3.5 h-3.5 shrink-0" strokeWidth={1.5} />
              {dest.city}, {dest.country}
            </div>
            <h1 className="font-display font-semibold text-3xl text-white drop-shadow-[0_2px_8px_rgba(0,0,0,0.65)]">
              {dest.city}
            </h1>
            <div className="flex flex-wrap items-center gap-2 mt-2.5">
              <span className="text-xs px-2.5 py-1 rounded-full bg-black/45 backdrop-blur-md text-white border border-white/20">
                {dest.continent}
              </span>
              <span className="text-xs px-2.5 py-1 rounded-full bg-black/45 backdrop-blur-md text-white border border-white/20 flex items-center gap-1">
                <Sun className="w-3 h-3" strokeWidth={1.5} /> {dest.weather}
              </span>
              {dest.tags.solo && (
                <span className="text-xs px-2.5 py-1 rounded-full bg-black/45 backdrop-blur-md text-white border border-white/20">
                  Solo-friendly
                </span>
              )}
            </div>
          </div>
        </div>

        <div className="app-px">
          <p className="text-sm text-muted-foreground leading-relaxed mt-4">{dest.description}</p>

          {/* Map */}
          <div className="mt-5">
            <EventMap
              compact
              query={`${dest.city}, ${dest.country}`}
              label={`${dest.city}, ${dest.country}`}
            />
          </div>

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
          <Section icon={Users} title={`Women here (${currently.length || soon.length || stats.members})`}>
            <MemberStack list={currently.length ? currently : soon} />
          </Section>
          {currently.length > 0 && soon.length > 0 && (
            <Section icon={Users} title="Travelling soon">
              <MemberStack list={soon} />
            </Section>
          )}

          {/* Venues */}
          <Section icon={Sparkles} title="Cafés">
            <div className="grid grid-cols-1 gap-2">{content.cafes.map((v) => <VenueRow key={v.name} venue={v} venueType="cafe" />)}</div>
          </Section>
          <Section icon={Sparkles} title="Restaurants">
            <div className="grid grid-cols-1 gap-2">{content.restaurants.map((v) => <VenueRow key={v.name} venue={v} venueType="restaurant" />)}</div>
          </Section>
          <Section icon={BedDouble} title="Hotels">
            <div className="grid grid-cols-1 gap-2">{content.hotels.map((v) => <VenueRow key={v.name} venue={v} venueType="hotel" />)}</div>
          </Section>

          {/* Events (live) */}
          <Section icon={CalendarHeart} title={`Events (${Math.max(events.length, stats.events)})`}>
            {events.length === 0 ? (
              <p className="text-sm text-muted-foreground">No events listed yet for {dest.city}.</p>
            ) : (
              <div className="space-y-4">
                {events.slice(0, 3).map((e) => (
                  <EventCard key={e.id} event={e} />
                ))}
              </div>
            )}
          </Section>

          {/* Deals */}
          <Section icon={Sparkles} title="Deals">
            <div className="grid grid-cols-1 gap-2">{content.deals.map((v) => <VenueRow key={v.name} venue={v} venueType="deal" />)}</div>
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
      <div className="sticky bottom-0 app-px pt-4 safe-pb bg-background/95 backdrop-blur border-t border-border">
        <Button className="w-full h-12" onClick={() => navigate(`/trips/new?city=${encodeURIComponent(dest.city)}`)}>
          Create trip to {dest.city}
        </Button>
      </div>
    </div>
  );
}