import { cafeImage, galleryFromPool } from "@/lib/images";

export const CAFES = [
  {
    name: "Café Norden", city: "Copenhagen", country: "Denmark", image: cafeImage(0),
    rating: 4.9, reviews: 312, price: 3, distance: 0.4,
    tags: { wifi: true, work: true, outdoor: true, seaView: false, vegan: true, solo: true, wheelchair: true, pet: false },
    address: "Østergade 34, 1101 København",
    hours: "Mon–Sun 08:00–22:00", phone: "+45 33 12 00 22", website: "https://cafenorden.dk",
    gallery: galleryFromPool(cafeImage, 3, 10),
    description: "A bright Scandinavian café on Strøget serving organic coffee, smørrebrød and seasonal cakes. A favourite for a relaxed morning or a working afternoon.",
  },
  {
    name: "The Tiny Cup", city: "Lisbon", country: "Portugal", image: cafeImage(1),
    rating: 4.7, reviews: 184, price: 2, distance: 1.2,
    tags: { wifi: true, work: false, outdoor: true, seaView: false, vegan: false, solo: true, wheelchair: false, pet: true },
    address: "Rua das Flores 48, 1200-194 Lisboa",
    hours: "Mon–Sat 09:00–19:00", phone: "+351 21 346 2222", website: "https://thetinycup.pt",
    gallery: galleryFromPool(cafeImage, 3, 13),
    description: "A pocket-sized specialty coffee bar tucked in a floral lane. Espresso is precise, pastries are homemade and the outdoor bench is perfect for people-watching.",
  },
  {
    name: "Brew & Bloom", city: "Bali", country: "Indonesia", image: cafeImage(2),
    rating: 4.8, reviews: 221, price: 2, distance: 2.1,
    tags: { wifi: true, work: true, outdoor: true, seaView: false, vegan: true, solo: true, wheelchair: false, pet: true },
    address: "Jalan Pantai Berawa 88, Canggu",
    hours: "Mon–Sun 07:00–18:00", phone: "+62 361 9988776", website: "https://brewbloom.id",
    gallery: galleryFromPool(cafeImage, 3, 16),
    description: "A garden café with floral lattes, plant-based bowls and fast Wi-Fi. Surrounded by greenery, it's a calm spot to work or journal in Canggu.",
  },
  {
    name: "Fabrica Coffee Roasters", city: "Lisbon", country: "Portugal", image: cafeImage(3),
    rating: 4.6, reviews: 142, price: 2, distance: 0.9,
    tags: { wifi: true, work: true, outdoor: false, seaView: false, vegan: false, solo: true, wheelchair: true, pet: false },
    address: "Rua Portas de Santo Antão 86, 1150 Lisboa",
    hours: "Mon–Sat 08:00–19:00", phone: "+351 21 347 0001", website: "https://fabricacoffee.pt",
    gallery: galleryFromPool(cafeImage, 3, 19),
    description: "Minimalist roastery pouring single-origin espresso and flat whites. Communal tables and a focused vibe make it ideal for solo travellers with a laptop.",
  },
  {
    name: "Democratic Coffee", city: "Copenhagen", country: "Denmark", image: cafeImage(4),
    rating: 4.7, reviews: 96, price: 2, distance: 0.7,
    tags: { wifi: true, work: true, outdoor: false, seaView: false, vegan: true, solo: true, wheelchair: true, pet: false },
    address: "Rådhusstræde 8, 1466 København",
    hours: "Mon–Fri 07:30–18:00, Sat–Sun 09:00–17:00", phone: "+45 33 13 11 11", website: "https://democraticcoffee.dk",
    gallery: galleryFromPool(cafeImage, 3, 22),
    description: "Cozy library-adjacent café with excellent beans, vegan cinnamon buns and plenty of power outlets. A local favourite for quiet work sessions.",
  },
  {
    name: "Seniman Coffee", city: "Bali", country: "Indonesia", image: cafeImage(5),
    rating: 4.8, reviews: 175, price: 2, distance: 1.8,
    tags: { wifi: true, work: true, outdoor: true, seaView: false, vegan: true, solo: true, wheelchair: false, pet: true },
    address: "Jalan Suweta, Ubud",
    hours: "Mon–Sun 07:00–20:00", phone: "+62 361 975711", website: "https://senimancoffee.com",
    gallery: galleryFromPool(cafeImage, 3, 25),
    description: "Ubud's specialty pioneer, roasting in-house and serving pour-overs with valley views. Lush outdoor terrace, dog-friendly and quietly productive.",
  },
  {
    name: "Café de Flore", city: "Paris", country: "France", image: cafeImage(6),
    rating: 4.5, reviews: 410, price: 4, distance: 1.5,
    tags: { wifi: false, work: false, outdoor: true, seaView: false, vegan: false, solo: true, wheelchair: true, pet: false },
    address: "172 Boulevard Saint-Germain, 75006 Paris",
    hours: "Mon–Sun 07:30–01:30", phone: "+33 1 45 48 87 26", website: "https://cafedeflore.fr",
    gallery: galleryFromPool(cafeImage, 3, 28),
    description: "An iconic Saint-Germain brasserie and literary haunt. Classic espresso, terrace seating and Parisian people-watching at its finest.",
  },
  {
    name: "Boot Café", city: "Paris", country: "France", image: cafeImage(7),
    rating: 4.6, reviews: 88, price: 2, distance: 1.1,
    tags: { wifi: true, work: false, outdoor: true, seaView: false, vegan: true, solo: true, wheelchair: false, pet: true },
    address: "19 Rue du Caire, 75002 Paris",
    hours: "Mon–Fri 08:00–17:00", phone: "+33 1 40 26 12 34", website: "https://bootcafe.fr",
    gallery: galleryFromPool(cafeImage, 3, 31),
    description: "A tiny Marais espresso bar with a loyal following. Oat-milk lattes, vegan treats and a charming street-side bench. Pet-friendly.",
  },
  {
    name: "Hello, Kristof", city: "Copenhagen", country: "Denmark", image: cafeImage(0),
    rating: 4.8, reviews: 134, price: 3, distance: 0.6,
    tags: { wifi: true, work: true, outdoor: true, seaView: false, vegan: true, solo: true, wheelchair: true, pet: true },
    address: "Gothersgade 111, 1123 København",
    hours: "Mon–Sun 08:00–20:00", phone: "+45 33 11 22 33", website: "https://hellokristof.dk",
    gallery: galleryFromPool(cafeImage, 3, 34),
    description: "A design-forward café with seasonal lattes, a leafy patio and a calm, laptop-friendly atmosphere. Accessible and dog-welcoming.",
  },
  {
    name: "Seaview Roastery", city: "Cape Town", country: "South Africa", image: cafeImage(1),
    rating: 4.7, reviews: 109, price: 3, distance: 3.2,
    tags: { wifi: true, work: true, outdoor: true, seaView: true, vegan: true, solo: true, wheelchair: true, pet: true },
    address: "Beach Road, Sea Point, Cape Town",
    hours: "Mon–Sun 07:00–18:00", phone: "+27 21 433 2211", website: "https://seaviewroastery.co.za",
    gallery: galleryFromPool(cafeImage, 3, 37),
    description: "Oceanfront roastery with panoramic sea views, plant-based brunch and fast Wi-Fi. The terrace is the highlight — bring sunscreen.",
  },
];

export const CAFE_TAG_FILTERS = [
  { key: "wifi", label: "Wi-Fi" },
  { key: "work", label: "Work-friendly", shortLabel: "Work spot" },
  { key: "outdoor", label: "Outdoor seating", shortLabel: "Outdoor" },
  { key: "seaView", label: "Sea view" },
  { key: "vegan", label: "Vegan options", shortLabel: "Vegan" },
  { key: "solo", label: "Solo-friendly", shortLabel: "Solo" },
  { key: "wheelchair", label: "Wheelchair accessible", shortLabel: "Accessible" },
  { key: "pet", label: "Pet friendly", shortLabel: "Pet friendly" },
];

export const PRICE_LABELS = { 1: "€", 2: "€€", 3: "€€€", 4: "€€€€" };

export const FACILITY_LABELS = {
  wifi: "Wi-Fi", work: "Work-friendly", outdoor: "Outdoor seating", seaView: "Sea view",
  vegan: "Vegan options", solo: "Solo-friendly", wheelchair: "Wheelchair accessible", pet: "Pet friendly",
};