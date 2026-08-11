import { ArrowLeft, MapPin } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

import { MOCK_MEMBERS } from '@/lib/member-profile';
import { CAFES } from '@/lib/cafes';
import { RESTAURANTS } from '@/lib/restaurants';
import { HOTELS } from '@/lib/hotels';
import { DESTINATIONS } from '@/lib/destinations';
import { getMockTrips } from '@/lib/mock-trips';
import { MOCK_EVENTS } from '@/lib/mock-events';
import { MOCK_DEALS } from '@/lib/mock-deals';

const memberSamples = MOCK_MEMBERS.slice(0, 3).map((m) => ({
  name: m.name,
  loc: m.current_city,
  img: m.avatar,
  memberId: m.user_id,
}));

const pick = (items, mapFn) => items.slice(0, 3).map(mapFn);

const samples = {
  Cafés: pick(CAFES, (c) => ({ name: c.name, loc: c.city, img: c.image })),
  Restaurants: pick(RESTAURANTS, (r) => ({ name: r.name, loc: r.city, img: r.image })),
  Hotels: pick(HOTELS, (h) => ({ name: h.name, loc: h.city, img: h.image })),
  Trips: pick(getMockTrips(), (t) => ({
    name: t.name,
    loc: t.city,
    img: t.cover_image,
    tripId: t.id,
  })),
  Events: pick(MOCK_EVENTS, (e) => ({
    name: e.title,
    loc: e.city,
    img: e.image,
    eventId: e.id,
  })),
  Friends: memberSamples,
  Reviews: [
    { name: CAFES[0].name, loc: '★ 4.9', img: CAFES[0].image, type: 'cafe' },
    { name: HOTELS[1]?.name || HOTELS[0].name, loc: '★ 4.8', img: HOTELS[1]?.image || HOTELS[0].image, type: 'hotel' },
    { name: RESTAURANTS[0].name, loc: '★ 5.0', img: RESTAURANTS[0].image, type: 'restaurant' },
  ],
  Deals: pick(MOCK_DEALS, (d) => ({
    name: d.title,
    loc: d.city,
    img: d.image,
    dealId: d.id,
  })),
  Destinations: pick(DESTINATIONS, (d) => ({
    name: d.city,
    loc: d.country,
    img: d.image,
  })),
};

const CATEGORY_ROUTES = {
  Cafés: (name) => `/cafes/${encodeURIComponent(name)}`,
  Restaurants: (name) => `/restaurants/${encodeURIComponent(name)}`,
  Hotels: (name) => `/hotels/${encodeURIComponent(name)}`,
  Destinations: (name) => `/destinations/${encodeURIComponent(name)}`,
  Trips: (name, item) => item.tripId ? `/trips/${item.tripId}` : "/trips",
  Events: () => "/events",
  Friends: () => "/friends",
  Deals: (name, item) => item.dealId ? `/deals/${item.dealId}` : "/deals",
};

function itemRoute(category, item) {
  if (category === "Reviews") {
    if (item.type === "cafe") return `/cafes/${encodeURIComponent(item.name)}`;
    if (item.type === "restaurant") return `/restaurants/${encodeURIComponent(item.name)}`;
    if (item.type === "hotel") return `/hotels/${encodeURIComponent(item.name)}`;
    return "/reviews";
  }
  if (item.eventId) return `/events/${item.eventId}`;
  if (item.memberId) return `/members/${item.memberId}`;
  if (item.tripId) return `/trips/${item.tripId}`;
  if (item.dealId) return `/deals/${item.dealId}`;
  const fn = CATEGORY_ROUTES[category];
  return fn ? fn(item.name, item) : null;
}

export default function Category({ category }) {
  const navigate = useNavigate();
  const list = samples[category] || [];

  return (
    <div className="page-shell">
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-1.5 text-sm text-muted-foreground mb-4"
      >
        <ArrowLeft className="w-4 h-4" /> Back
      </button>
      <h1 className="font-display font-bold text-lg mb-1">{category}</h1>
      <p className="text-sm text-muted-foreground mb-5">Curated for women who travel</p>

      <div className="space-y-4">
        {list.map((item) => {
          const route = itemRoute(category, item);
          return (
            <button
              key={item.name}
              type="button"
              onClick={() => route && navigate(route)}
              className="w-full rounded-2xl overflow-hidden border border-border shadow-soft bg-card text-left active:scale-[0.99] transition"
            >
              <div className="h-40">
                <img src={item.img} alt={item.name} className="w-full h-full object-cover" />
              </div>
              <div className="p-4">
                <h3 className="font-semibold text-base">{item.name}</h3>
                <div className="flex items-center gap-1 mt-1 text-sm text-muted-foreground">
                  <MapPin className="w-3.5 h-3.5" />
                  <span>{item.loc}</span>
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
