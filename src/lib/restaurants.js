import { restaurantImage, galleryFromPool } from "@/lib/images";

export const CUISINES = ["Italian", "Japanese", "Portuguese", "French", "Mexican", "Thai", "Mediterranean", "South African", "Indian", "Vegan"];

export const RESTAURANTS = [
  {
    name: "Cervejaria Ramiro", city: "Lisbon", country: "Portugal", cuisine: "Portuguese", image: restaurantImage(0),
    rating: 4.7, reviews: 528, price: 3, distance: 1.0,
    tags: { vegetarian: false, vegan: false, glutenFree: false, solo: true, outdoor: false, romantic: false, local: true, reservation: true },
    address: "Av. Almirante Reis 1H, 1150 Lisboa", hours: "Tue–Sun 12:00–00:30", phone: "+351 21 885 1024", website: "https://cervejariaramiro.pt",
    menuUrl: "https://cervejariaramiro.pt/menu", reservationUrl: "https://cervejariaramiro.pt/reserve",
    gallery: galleryFromPool(restaurantImage, 3, 10),
    description: "Legendary seafood institution serving tiger prawns, garlic clams and fresh crab. Loud, bustling and unmistakably local.",
  },
  {
    name: "Osteria della Piazza", city: "Copenhagen", country: "Denmark", cuisine: "Italian", image: restaurantImage(1),
    rating: 4.8, reviews: 142, price: 3, distance: 0.8,
    tags: { vegetarian: true, vegan: false, glutenFree: true, solo: true, outdoor: true, romantic: true, local: false, reservation: true },
    address: "Sankt Hans Torv 10, 2200 København", hours: "Mon–Sat 17:00–23:00", phone: "+45 35 39 00 11", website: "https://osteriadellapiazza.dk",
    menuUrl: "https://osteriadellapiazza.dk/menu", reservationUrl: "https://osteriadellapiazza.dk/book",
    gallery: galleryFromPool(restaurantImage, 3, 13),
    description: "Hand-rolled pasta and a curated Italian wine list on a cozy square. Candle-lit and perfect for a slow, romantic dinner.",
  },
  {
    name: "Sushi Saito", city: "Paris", country: "France", cuisine: "Japanese", image: restaurantImage(2),
    rating: 4.9, reviews: 76, price: 4, distance: 1.6,
    tags: { vegetarian: false, vegan: false, glutenFree: false, solo: true, outdoor: false, romantic: false, local: false, reservation: true },
    address: "23 Rue de la Tombe Issoire, 75014 Paris", hours: "Mon–Sat 19:00–22:30", phone: "+33 1 45 22 88 12", website: "https://sushisaito.fr",
    menuUrl: "https://sushisaito.fr/omakase", reservationUrl: "https://sushisaito.fr/reserve",
    gallery: galleryFromPool(restaurantImage, 3, 16),
    description: "An intimate omakase counter with Edomae-style nigiri. Reservation-only; a serene solo or duo experience.",
  },
  {
    name: "Casa Jaguar", city: "Tulum", country: "Mexico", cuisine: "Mexican", image: restaurantImage(3),
    rating: 4.7, reviews: 203, price: 3, distance: 2.4,
    tags: { vegetarian: true, vegan: true, glutenFree: true, solo: true, outdoor: true, romantic: true, local: false, reservation: true },
    address: "Centauro Sur 7, 77780 Tulum", hours: "Mon–Sun 18:00–23:30", phone: "+52 984 137 2233", website: "https://casajaguar.mx",
    menuUrl: "https://casajaguar.mx/menu", reservationUrl: "https://casajaguar.mx/reserve",
    gallery: galleryFromPool(restaurantImage, 3, 19),
    description: "Jungle-set kitchen blending Mayan and contemporary Mexican flavours. Candle-lit terrace, mezcal flights and a standout vegan mole.",
  },
  {
    name: "Som Tum & Co", city: "Cape Town", country: "South Africa", cuisine: "Thai", image: restaurantImage(4),
    rating: 4.6, reviews: 119, price: 2, distance: 1.9,
    tags: { vegetarian: true, vegan: true, glutenFree: false, solo: true, outdoor: true, romantic: false, local: true, reservation: false },
    address: "Long Street 88, Cape Town", hours: "Mon–Sat 11:00–22:00", phone: "+27 21 424 1199", website: "https://somtum.co.za",
    menuUrl: "https://somtum.co.za/menu", reservationUrl: "https://somtum.co.za/reserve",
    gallery: galleryFromPool(restaurantImage, 3, 22),
    description: "Bustling Thai street-food spot with fragrant curries and a legendary som tum. Outdoor seating and a local favourite for lunch.",
  },
  {
    name: "Olive & Vine", city: "Paris", country: "France", cuisine: "Mediterranean", image: restaurantImage(5),
    rating: 4.6, reviews: 88, price: 2, distance: 1.1,
    tags: { vegetarian: true, vegan: true, glutenFree: true, solo: true, outdoor: true, romantic: false, local: false, reservation: true },
    address: "20 Rue du Caire, 75002 Paris", hours: "Tue–Sun 12:00–22:30", phone: "+33 1 40 26 99 88", website: "https://oliveandvine.fr",
    menuUrl: "https://oliveandvine.fr/menu", reservationUrl: "https://oliveandvine.fr/book",
    gallery: galleryFromPool(restaurantImage, 3, 25),
    description: "Mediterranean mezze, grilled fish and natural wine. Generous vegan options and a sunny terrace for a solo lunch.",
  },
  {
    name: "Mzansi", city: "Cape Town", country: "South Africa", cuisine: "South African", image: restaurantImage(6),
    rating: 4.8, reviews: 156, price: 3, distance: 2.8,
    tags: { vegetarian: false, vegan: false, glutenFree: false, solo: true, outdoor: true, romantic: true, local: true, reservation: true },
    address: "7 Beach Road, Bo-Kaap, Cape Town", hours: "Mon–Sat 18:00–23:00", phone: "+27 21 447 2298", website: "https://mzansi.co.za",
    menuUrl: "https://mzansi.co.za/menu", reservationUrl: "https://mzansi.co.za/reserve",
    gallery: galleryFromPool(restaurantImage, 3, 28),
    description: "Rainbow cuisine in a Bo-Kaap heritage home — bobotie, malva pudding and a township soundtrack. Reservation recommended.",
  },
  {
    name: "Taberna da Rua das Flores", city: "Lisbon", country: "Portugal", cuisine: "Portuguese", image: restaurantImage(7),
    rating: 4.8, reviews: 312, price: 2, distance: 0.7,
    tags: { vegetarian: false, vegan: false, glutenFree: false, solo: true, outdoor: true, romantic: false, local: true, reservation: false },
    address: "Rua das Flores 52, 1200 Lisboa", hours: "Mon–Sat 19:00–00:00", phone: "+351 21 346 7110", website: "https://tabernaruadasflores.pt",
    menuUrl: "https://tabernaruadasflores.pt/menu", reservationUrl: "",
    gallery: galleryFromPool(restaurantImage, 3, 31),
    description: "Tiny no-reservation tasca pouring natural wine and seasonal petiscos. Queue early; it's a beloved local gem.",
  },
  {
    name: "Green Bowl", city: "Bali", country: "Indonesia", cuisine: "Vegan", image: restaurantImage(0),
    rating: 4.7, reviews: 98, price: 2, distance: 1.4,
    tags: { vegetarian: true, vegan: true, glutenFree: true, solo: true, outdoor: true, romantic: false, local: false, reservation: true },
    address: "Jalan Batu Bolong 12, Canggu", hours: "Mon–Sun 08:00–21:00", phone: "+62 361 220 1190", website: "https://greenbowl.id",
    menuUrl: "https://greenbowl.id/menu", reservationUrl: "https://greenbowl.id/reserve",
    gallery: galleryFromPool(restaurantImage, 3, 34),
    description: "Plant-powered bowls, raw desserts and cold-pressed juices in a leafy garden. A wellness staple in Canggu.",
  },
  {
    name: "Le Petit Bistro", city: "Paris", country: "France", cuisine: "French", image: restaurantImage(1),
    rating: 4.5, reviews: 210, price: 3, distance: 1.3,
    tags: { vegetarian: false, vegan: false, glutenFree: false, solo: true, outdoor: true, romantic: true, local: true, reservation: true },
    address: "14 Rue des Martyrs, 75009 Paris", hours: "Tue–Sat 19:00–23:30", phone: "+33 1 48 78 00 22", website: "https://lepetitbistro.fr",
    menuUrl: "https://lepetitbistro.fr/menu", reservationUrl: "https://lepetitbistro.fr/reserve",
    gallery: galleryFromPool(restaurantImage, 3, 37),
    description: "Classic French bistro with steak frites, a fine wine list and a warm, romantic room. Reservations essential.",
  },
];

export const RESTAURANT_TAG_FILTERS = [
  { key: "vegetarian", label: "Vegetarian" },
  { key: "vegan", label: "Vegan" },
  { key: "glutenFree", label: "Gluten-free", shortLabel: "Gluten-free" },
  { key: "solo", label: "Solo-friendly", shortLabel: "Solo" },
  { key: "outdoor", label: "Outdoor seating", shortLabel: "Outdoor" },
  { key: "romantic", label: "Romantic" },
  { key: "local", label: "Local favorite", shortLabel: "Local" },
  { key: "reservation", label: "Reservation available", shortLabel: "Reservation" },
];

export const PRICE_LABELS = { 1: "€", 2: "€€", 3: "€€€", 4: "€€€€" };

export const FACILITY_LABELS = {
  vegetarian: "Vegetarian", vegan: "Vegan", glutenFree: "Gluten-free", solo: "Solo-friendly",
  outdoor: "Outdoor seating", romantic: "Romantic", local: "Local favorite", reservation: "Reservation available",
};