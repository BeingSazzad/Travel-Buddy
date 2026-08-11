import { CITY_IMAGES } from "@/lib/images";

export const DESTINATIONS = [
  {
    city: "Lisbon", country: "Portugal", continent: "Europe", weather: "Mild", featured: true,
    image: CITY_IMAGES.lisbon,
    description: "Sunlit coastline, pastel hills and the friendliest café culture in Europe.",
    tags: { beach: true, city: true, budget: true, nightlife: true, wellness: false, solo: true },
    counts: { members: 42, cafes: 128, restaurants: 96, hotels: 54, events: 18, deals: 12 },
  },
  {
    city: "Bali", country: "Indonesia", continent: "Asia", weather: "Sunny", featured: true,
    image: CITY_IMAGES.bali,
    description: "Jungle retreats, surf mornings and a deep wellness scene built for slow travel.",
    tags: { beach: true, city: false, budget: true, nightlife: false, wellness: true, solo: true },
    counts: { members: 67, cafes: 84, restaurants: 72, hotels: 110, events: 22, deals: 16 },
  },
  {
    city: "Tulum", country: "Mexico", continent: "Americas", weather: "Sunny", featured: true,
    image: CITY_IMAGES.tulum,
    description: "Cenotes, white sand and yoga at sunrise — a solo-traveller favourite.",
    tags: { beach: true, city: false, budget: true, nightlife: false, wellness: true, solo: true },
    counts: { members: 25, cafes: 40, restaurants: 38, hotels: 60, events: 7, deals: 9 },
  },
  {
    city: "Cape Town", country: "South Africa", continent: "Africa", weather: "Warm", featured: true,
    image: CITY_IMAGES.capetown,
    description: "Mountains meet ocean — adventure, wine and a vibrant creative city.",
    tags: { beach: true, city: true, budget: true, nightlife: true, wellness: true, solo: true },
    counts: { members: 33, cafes: 70, restaurants: 65, hotels: 85, events: 11, deals: 8 },
  },
  {
    city: "Copenhagen", country: "Denmark", continent: "Europe", weather: "Cool",
    image: CITY_IMAGES.copenhagen,
    description: "Design-led streets, hygge cafés and bike rides along the canals.",
    tags: { beach: false, city: true, budget: false, nightlife: true, wellness: false, solo: true },
    counts: { members: 38, cafes: 140, restaurants: 88, hotels: 46, events: 24, deals: 10 },
  },
  {
    city: "Paris", country: "France", continent: "Europe", weather: "Mild",
    image: CITY_IMAGES.paris,
    description: "Art, pastries and golden-hour walks — timeless for a girls' trip.",
    tags: { beach: false, city: true, budget: false, nightlife: true, wellness: false, solo: true },
    counts: { members: 54, cafes: 220, restaurants: 180, hotels: 130, events: 31, deals: 14 },
  },
  {
    city: "Marrakech", country: "Morocco", continent: "Africa", weather: "Sunny",
    image: CITY_IMAGES.marrakech,
    description: "Souks, riads and hammam afternoons in a city of colour and warmth.",
    tags: { beach: false, city: true, budget: true, nightlife: false, wellness: true, solo: false },
    counts: { members: 31, cafes: 60, restaurants: 55, hotels: 70, events: 9, deals: 7 },
  },
  {
    city: "Tokyo", country: "Japan", continent: "Asia", weather: "Mild",
    image: CITY_IMAGES.tokyo,
    description: "Neon nights, quiet shrines and the safest solo travel in the world.",
    tags: { beach: false, city: true, budget: false, nightlife: true, wellness: false, solo: true },
    counts: { members: 29, cafes: 90, restaurants: 120, hotels: 80, events: 12, deals: 6 },
  },
];

export const CONTINENTS = ["All", "Europe", "Asia", "Africa", "Americas", "Oceania"];
export const WEATHERS = ["All", "Sunny", "Warm", "Mild", "Cool"];
export const TAG_FILTERS = [
  { key: "beach", label: "Beach" },
  { key: "city", label: "City" },
  { key: "budget", label: "Budget" },
  { key: "nightlife", label: "Nightlife" },
  { key: "wellness", label: "Wellness" },
  { key: "solo", label: "Solo-friendly", shortLabel: "Solo" },
];
