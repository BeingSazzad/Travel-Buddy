import {
  Coffee, UtensilsCrossed, Building2, Compass, CalendarHeart, Users, Star, Tag,
} from "lucide-react";
import {
  unsplash,
  CITY_IMAGES,
  cafeImage,
  restaurantImage,
  hotelImage,
  dealImage,
  eventImageFor,
  memberAvatar,
} from "@/lib/images";

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

export const DEMO_FEATURED = [
  {
    id: "feat_lisbon",
    title: "Lisbon in late summer",
    subtitle: "Pastel hills, café terraces, and golden hour on the Tagus.",
    image: CITY_IMAGES.lisbon,
    link: "/destinations/Lisbon",
    active: true,
  },
  {
    id: "feat_bali",
    title: "Ubud wellness week",
    subtitle: "Jungle mornings and slow travel in Bali.",
    image: CITY_IMAGES.bali,
    link: "/destinations/Bali",
    active: true,
  },
  {
    id: "feat_paris",
    title: "Paris café crawl",
    subtitle: "Art, pastries, and walks at golden hour.",
    image: CITY_IMAGES.paris,
    link: "/destinations/Paris",
    active: true,
  },
];

export const SECTIONS = [
  {
    title: "Recommended for you",
    seeAllPath: "/destinations",
    items: [
      { type: "destination", city: "Paris", image: CITY_IMAGES.paris, title: "Paris", location: "France", info: "★ 4.8" },
      { type: "destination", city: "Lisbon", image: CITY_IMAGES.lisbon, title: "Lisbon", location: "Portugal", info: "★ 4.7" },
      { type: "destination", city: "Copenhagen", image: CITY_IMAGES.copenhagen, title: "Copenhagen", location: "Denmark", info: "★ 4.8" },
      { type: "destination", city: "Tokyo", image: CITY_IMAGES.tokyo, title: "Tokyo", location: "Japan", info: "★ 4.9" },
    ],
  },
  {
    title: "Trending destinations",
    seeAllPath: "/destinations",
    items: [
      { type: "destination", city: "Bali", image: CITY_IMAGES.bali, title: "Bali", location: "Indonesia", info: "★ 4.9" },
      { type: "destination", city: "Marrakech", image: CITY_IMAGES.marrakech, title: "Marrakech", location: "Morocco", info: "★ 4.6" },
      { type: "destination", city: "Tulum", image: CITY_IMAGES.tulum, title: "Tulum", location: "Mexico", info: "★ 4.7" },
      { type: "destination", city: "Cape Town", image: CITY_IMAGES.capetown, title: "Cape Town", location: "South Africa", info: "★ 4.8" },
    ],
  },
  {
    title: "Popular events",
    seeAllPath: "/events",
    items: [
      { type: "event", eventId: "event_mock_1", image: eventImageFor({ city: "Santorini", category: "wellness" }), title: "Sunset Yoga", location: "Santorini", info: "Aug 12" },
      { type: "event", eventId: "event_mock_3", image: eventImageFor({ city: "Lisbon", category: "wine" }), title: "Wine & Paint", location: "Lisbon", info: "Aug 18" },
      { type: "event", eventId: "event_mock_2", image: eventImageFor({ city: "Santorini", category: "dinner" }), title: "Travel Mixer", location: "Paris", info: "Aug 20" },
      { type: "event", eventId: "event_mock_4", image: eventImageFor({ city: "Zermatt", category: "hiking" }), title: "Coffee Crawl", location: "Berlin", info: "Aug 25" },
    ],
  },
  {
    title: "Women travelling soon",
    seeAllPath: "/discover",
    items: [
      { type: "member", memberId: "mock_4", image: memberAvatar("mock_4"), title: "Isabella Chen", location: "Berlin → Paris", info: "Travelling Sep 2" },
      { type: "member", memberId: "mock_1", image: memberAvatar("mock_1"), title: "Maya Rivera", location: "London → Bali", info: "Travelling Aug 15" },
      { type: "member", memberId: "mock_2", image: memberAvatar("mock_2"), title: "Ava Laurent", location: "New York → Lisbon", info: "Travelling Aug 10" },
      { type: "member", memberId: "mock_3", image: memberAvatar("mock_3"), title: "Sophie Martin", location: "Paris → Santorini", info: "Travelling Aug 12" },
    ],
  },
  {
    title: "Exclusive deals",
    seeAllPath: "/deals",
    items: [
      { type: "deal", dealId: "deal_mock_1", image: dealImage(0), title: "Lisbon Stay 20% off", location: "Lisbon", info: "20% off", partner: "Memmo Alfama" },
      { type: "deal", dealId: "deal_mock_2", image: dealImage(1), title: "Bali Retreat Deal", location: "Ubud", info: "15% off", partner: "Ubud Wellness Lodge" },
      { type: "deal", dealId: "deal_mock_3", image: dealImage(2), title: "Paris Dinner 2-for-1", location: "Paris", info: "2-for-1", partner: "Olive & Vine" },
      { type: "deal", dealId: "deal_mock_4", image: dealImage(3), title: "Marrakech Spa 30% off", location: "Marrakech", info: "30% off", partner: "Riad Spa Collective" },
    ],
  },
  {
    title: "Recently reviewed places",
    seeAllPath: "/reviews",
    items: [
      { type: "cafe", image: cafeImage(0), title: "Café Norden", location: "Copenhagen", rating: 4.9, reviewSnippet: "Perfect morning latte spot" },
      { type: "hotel", image: hotelImage(7), title: "Maison du Parc", location: "Paris", rating: 4.8, reviewSnippet: "Quiet garden views" },
      { type: "hotel", image: hotelImage(5), title: "Bambu Indah", location: "Ubud", rating: 4.9, reviewSnippet: "Magical jungle stay" },
      { type: "restaurant", image: restaurantImage(5), title: "Olive & Vine", location: "Paris", rating: 4.6, reviewSnippet: "Best wine pairing dinner" },
    ],
  },
];
