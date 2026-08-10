import {
  Coffee, UtensilsCrossed, Building2, Compass, CalendarHeart, Users, Star, Tag,
} from "lucide-react";

export const CATEGORIES = [
  { label: "Cafes", icon: Coffee, to: "/cafes" },
  { label: "Restaurants", icon: UtensilsCrossed, to: "/restaurants" },
  { label: "Hotels", icon: Building2, to: "/hotels" },
  { label: "Destinations", icon: Compass, to: "/destinations" },
  { label: "Events", icon: CalendarHeart, to: "/events" },
  { label: "Travel Friends", icon: Users, to: "/friends" },
  { label: "Reviews", icon: Star, to: "/reviews" },
  { label: "Deals", icon: Tag, to: "/deals" },
];

const img = (id) => `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=600&q=80`;

export const SECTIONS = [
  {
    title: "Recommended for you",
    items: [
      { type: "trip", image: img("1530103862676-de8c9debad1d"), title: "Girls' weekend in Copenhagen", location: "Copenhagen", info: "18 attending", badge: "Featured" },
      { type: "destination", image: img("1537996194471-e657df975ab4"), title: "Bali wellness retreat", location: "Ubud", info: "★ 4.9" },
      { type: "destination", image: img("1414235077428-338989a2e8c0"), title: "Paris art & cafés", location: "Paris", info: "★ 4.8" },
      { type: "destination", image: img("1555881400-74d7acaacd8b"), title: "Lisbon coastal escape", location: "Lisbon", info: "★ 4.7" },
    ],
  },
  {
    title: "Trending destinations",
    items: [
      { type: "destination", image: img("1555881400-74d7acaacd8b"), title: "Lisbon", location: "Portugal", info: "Trending", badge: "🔥" },
      { type: "destination", image: img("1537996194471-e657df975ab4"), title: "Bali", location: "Indonesia", info: "★ 4.9" },
      { type: "destination", image: img("1414235077428-338989a2e8c0"), title: "Marrakech", location: "Morocco", info: "Hot" },
      { type: "destination", image: img("1554118811-1e0d58224f24"), title: "Copenhagen", location: "Denmark", info: "Popular" },
    ],
  },
  {
    title: "Popular events",
    items: [
      { type: "event", image: img("1545389336-cf090694435e"), title: "Sunset Yoga", location: "Copenhagen", info: "Aug 12" },
      { type: "event", image: img("1513569771920-c9e1d31714ba"), title: "Wine & Paint", location: "Lisbon", info: "Aug 18" },
      { type: "event", image: img("1530103862676-de8c9debad1d"), title: "Travel Mixer", location: "Paris", info: "Aug 20" },
      { type: "event", image: img("1495474472287-4d71bcdd2085"), title: "Coffee Crawl", location: "Berlin", info: "Aug 25" },
    ],
  },
  {
    title: "Women travelling soon",
    items: [
      { type: "member", image: img("1494790108377-be9c29b29330"), title: "Aria K.", location: "Berlin → Lisbon", info: "Travelling Aug 10" },
      { type: "member", image: img("1438761681033-6461ffad8d80"), title: "Maya R.", location: "Lisbon → Bali", info: "Travelling Aug 15" },
      { type: "member", image: img("1534528741775-53994a69daeb"), title: "Sofia L.", location: "Bali → Paris", info: "Travelling Sep 1" },
      { type: "member", image: img("1517841905240-472988babdf9"), title: "Nora J.", location: "Paris → Tokyo", info: "Travelling Sep 5" },
    ],
  },
  {
    title: "Exclusive deals",
    items: [
      { type: "deal", image: img("1555881400-74d7acaacd8b"), title: "Lisbon Stay 20% off", location: "Lisbon", info: "Save 20%", badge: "Deal" },
      { type: "deal", image: img("1537996194471-e657df975ab4"), title: "Bali Retreat Deal", location: "Ubud", info: "Save 15%", badge: "Deal" },
      { type: "deal", image: img("1414235077428-338989a2e8c0"), title: "Paris Dinner 2-for-1", location: "Paris", info: "2-for-1", badge: "Deal" },
      { type: "deal", image: img("1414235077428-338989a2e8c0"), title: "Marrakech Spa 30% off", location: "Marrakech", info: "Save 30%", badge: "Deal" },
    ],
  },
  {
    title: "Recently reviewed places",
    items: [
      { type: "cafe", image: img("1554118811-1e0d58224f24"), title: "Café Norden", location: "Copenhagen", info: "★ 4.9" },
      { type: "hotel", image: img("1551882547-ff40c63fe595"), title: "Maison du Parc", location: "Paris", info: "★ 4.8" },
      { type: "hotel", image: img("1537996194471-e657df975ab4"), title: "Bali Retreat", location: "Ubud", info: "★ 5.0" },
      { type: "restaurant", image: img("1414235077428-338989a2e8c0"), title: "Olive & Vine", location: "Paris", info: "★ 4.7" },
    ],
  },
];