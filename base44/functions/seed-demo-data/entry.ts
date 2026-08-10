import { createClientFromRequest } from 'npm:@base44/sdk@0.8.40';

// Known-good Unsplash photo ids (reused from seed-data so every image renders).
const img = (id) => `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=900&q=80`;
const avatar = (n) => `https://i.pravatar.cc/400?img=${n}`;
const D = (s) => s; // identity for clarity

const CAFE_IMG = ["1554118811-1e0d58224f24", "1453614512568-c4034dfb0fa0", "1495474472287-4d71bcdd2085"];
const REST_IMG = ["1414235077428-338989a2e8c0", "1414235077428-338989a2e8c0", "1559339352-11d035aa65de"];
const HOTEL_IMG = ["1566073771259-6a560657f57b", "1540541338287-41700207dee6", "1551882547-ff40c63fe595"];
const TRAVEL_IMG = ["1555881400-74d7acaacd8b", "1537996194471-e657df975ab4", "1507525428034-b723cf961d3e", "1580060839134-75a5edca2e99", "1554118811-1e0d58224f24", "1502602898657-3e91760cbb34", "1414235077428-338989a2e8c0", "1540959733332-eab4deabeeed"];

// 20 fictional female personas — surfaced across matches, chats, reviews & event hosts.
const PERSONAS = [
  { name: "Sofia Almeida", city: "Lisbon", country: "Portugal", bio: "Surf instructor & café hopper. Always chasing golden hour.", avatar: avatar(5) },
  { name: "Amara Okafor", city: "Cape Town", country: "South Africa", bio: "Photographer documenting coastal towns and slow mornings.", avatar: avatar(9) },
  { name: "Yuki Tanaka", city: "Tokyo", country: "Japan", bio: "Designer exploring tea houses and quiet shrines.", avatar: avatar(11) },
  { name: "Elena Rossi", city: "Paris", country: "France", bio: "Pastry lover and gallery wanderer. Solo trips are my therapy.", avatar: avatar(16) },
  { name: "Maya Sharma", city: "Bali", country: "Indonesia", bio: "Yoga teacher. Mornings on the mat, evenings by the sea.", avatar: avatar(20) },
  { name: "Clara Nielsen", city: "Copenhagen", country: "Denmark", bio: "Architect with a soft spot for hygge cafés and canal walks.", avatar: avatar(23) },
  { name: "Inés García", city: "Barcelona", country: "Spain", bio: "Flamenco nights, market lunches and rooftop sunsets.", avatar: avatar(25) },
  { name: "Noor Haddad", city: "Marrakech", country: "Morocco", bio: "Souk explorer and hammam devotee. Colour over everything.", avatar: avatar(26) },
  { name: "Freya Berg", city: "Copenhagen", country: "Denmark", bio: "Cyclist and cold-swim enthusiast. New-ish to solo travel.", avatar: avatar(29) },
  { name: "Lúa Martín", city: "Tulum", country: "Mexico", bio: "Cenote swimmer and mezcal curious. Wellness on a budget.", avatar: avatar(31) },
  { name: "Priya Nair", city: "Bali", country: "Indonesia", bio: "Remote writer working from garden cafés in Ubud.", avatar: avatar(32) },
  { name: "Camille Dubois", city: "Paris", country: "France", bio: "Vintage shopper and natural-wine fan. Loves a long lunch.", avatar: avatar(33) },
  { name: "Thandi Molefe", city: "Cape Town", country: "South Africa", bio: "Hiker. Table Mountain before breakfast, wine after.", avatar: avatar(36) },
  { name: "Hana Park", city: "Tokyo", country: "Japan", bio: "Food writer hunting the best ramen and the quietest parks.", avatar: avatar(40) },
  { name: "Isabel Costa", city: "Lisbon", country: "Portugal", bio: "Tile-spotter and tram rider. Speaks four languages.", avatar: avatar(41) },
  { name: "Mara Lindqvist", city: "Copenhagen", country: "Denmark", bio: "Potter and bakery regular. Collects second-hand books.", avatar: avatar(44) },
  { name: "Aïcha Benali", city: "Marrakech", country: "Morocco", bio: "Textile lover mapping the medina one alley at a time.", avatar: avatar(47) },
  { name: "Bianca Ferreira", city: "Barcelona", country: "Spain", bio: "Beach volleyball and brunch. Two trips a month, minimum.", avatar: avatar(48) },
  { name: "Saanvi Rao", city: "Tulum", country: "Mexico", bio: "Yoga + journaling retreats. Big on solo-female safety.", avatar: avatar(49) },
  { name: "Zoe Walker", city: "Cape Town", country: "South Africa", bio: "Marine biology student. Dives, then tacos. Always.", avatar: avatar(52) },
];

const EXTRA_DESTINATIONS = [
  { city: "Barcelona", country: "Spain", continent: "Europe", weather: "Sunny", image: img(TRAVEL_IMG[0]), description: "Gaudí architecture, beach days and a late-night social scene made for groups.", tags: { beach: true, city: true, budget: true, nightlife: true, wellness: false, solo: true }, counts: { members: 47, cafes: 96, restaurants: 120, hotels: 78, events: 20, deals: 11 } },
  { city: "Sydney", country: "Australia", continent: "Oceania", weather: "Sunny", image: img(TRAVEL_IMG[2]), description: "Harbour walks, ocean pools and a laid-back café culture by the beach.", tags: { beach: true, city: true, budget: false, nightlife: true, wellness: true, solo: true }, counts: { members: 39, cafes: 84, restaurants: 102, hotels: 66, events: 14, deals: 8 } },
];

const EXTRA_CAFES = [
  { name: "Saudade Espresso Bar", city: "Lisbon", country: "Portugal", image: img(CAFE_IMG[1]), rating: 4.7, reviews: 142, price: 2, distance: 0.8, tags: { wifi: true, work: true, outdoor: true, seaView: false, vegan: true, solo: true, wheelchair: true, pet: true }, address: "Rua da Boavista 84, 1200 Lisboa", hours: "Mon–Sat 08:00–18:00", phone: "+351 21 348 0011", website: "https://saudadecoffee.pt", gallery: [img(CAFE_IMG[1]), img(CAFE_IMG[0]), img(CAFE_IMG[2])], description: "Nostalgic tiled café pulling sharp espresso and serving vegan pastel de nata. Friendly counter staff and a sunny bench." },
  { name: "Maison Plume", city: "Paris", country: "France", image: img(CAFE_IMG[0]), rating: 4.6, reviews: 98, price: 3, distance: 1.0, tags: { wifi: true, work: false, outdoor: true, seaView: false, vegan: false, solo: true, wheelchair: true, pet: true }, address: "4 Rue Dénoyez, 75020 Paris", hours: "Tue–Sun 09:00–17:00", phone: "+33 1 40 21 90 12", website: "https://maisonplume.fr", gallery: [img(CAFE_IMG[0]), img(CAFE_IMG[1]), img(CAFE_IMG[2])], description: "Feather-light pancakes, filter coffee and a mural-lined terrace in Belleville. Charming and quietly busy." },
  { name: "Kura Kura House", city: "Bali", country: "Indonesia", image: img(CAFE_IMG[2]), rating: 4.8, reviews: 176, price: 2, distance: 1.9, tags: { wifi: true, work: true, outdoor: true, seaView: false, vegan: true, solo: true, wheelchair: false, pet: true }, address: "Jalan Hanoman 22, Ubud", hours: "Mon–Sun 07:30–20:00", phone: "+62 361 971 220", website: "https://kurakurahouse.id", gallery: [img(CAFE_IMG[2]), img(CAFE_IMG[0]), img(CAFE_IMG[1])], description: "Bamboo pavilion café with cascading greens, raw cakes and strong Wi-Fi. A serene spot to work through the afternoon." },
  { name: "The Daily Roast", city: "Cape Town", country: "South Africa", image: img(CAFE_IMG[1]), rating: 4.6, reviews: 87, price: 2, distance: 1.4, tags: { wifi: true, work: true, outdoor: true, seaView: false, vegan: true, solo: true, wheelchair: true, pet: false }, address: "Kloof Street 12, Cape Town", hours: "Mon–Sun 07:00–17:00", phone: "+27 21 424 7711", website: "https://dailyroast.co.za", gallery: [img(CAFE_IMG[1]), img(CAFE_IMG[2]), img(CAFE_IMG[0])], description: "Neighbourhood roastery on Kloof Street with flat whites, vegan muffins and a sunny stoep. Laptop-friendly mornings." },
  { name: "Glow Coffee Tokyo", city: "Tokyo", country: "Japan", image: img(CAFE_IMG[0]), rating: 4.7, reviews: 134, price: 3, distance: 0.5, tags: { wifi: true, work: true, outdoor: false, seaView: false, vegan: true, solo: true, wheelchair: true, pet: false }, address: "2-12-4 Daikanyama, Shibuya, Tokyo", hours: "Mon–Sun 08:00–19:00", phone: "+81 3 5457 1122", website: "https://glowcoffee.jp", gallery: [img(CAFE_IMG[0]), img(CAFE_IMG[1]), img(CAFE_IMG[2])], description: "Light-filled Daikanyama café known for pour-over clarity and matcha lattes. Calm, design-led and very solo-welcoming." },
  { name: "Flor de Sal", city: "Barcelona", country: "Spain", image: img(CAFE_IMG[1]), rating: 4.5, reviews: 76, price: 2, distance: 1.1, tags: { wifi: true, work: false, outdoor: true, seaView: false, vegan: true, solo: true, wheelchair: true, pet: true }, address: "Carrer de Verdi 30, Gràcia, Barcelona", hours: "Mon–Sat 08:30–18:00", phone: "+34 93 218 4412", website: "https://flordesal.es", gallery: [img(CAFE_IMG[1]), img(CAFE_IMG[0]), img(CAFE_IMG[2])], description: "Gràcia neighbourhood spot with tostadas, specialty coffee and a tiny square-side terrace. Pet-friendly and lively." },
  { name: "Pigeon & Pear", city: "Copenhagen", country: "Denmark", image: img(CAFE_IMG[2]), rating: 4.7, reviews: 64, price: 3, distance: 0.9, tags: { wifi: true, work: true, outdoor: true, seaView: false, vegan: true, solo: true, wheelchair: true, pet: true }, address: "Værnedamsvej 8, 1819 København", hours: "Mon–Sun 08:00–18:00", phone: "+45 33 25 66 77", website: "https://pigeonandpear.dk", gallery: [img(CAFE_IMG[2]), img(CAFE_IMG[0]), img(CAFE_IMG[1])], description: "Cosy Vesterbro café with oat lattes, cardamom buns and a leafy patio. Equal parts work spot and catch-up corner." },
  { name: "Mint & Miel", city: "Tulum", country: "Mexico", image: img(CAFE_IMG[0]), rating: 4.6, reviews: 91, price: 2, distance: 2.0, tags: { wifi: true, work: false, outdoor: true, seaView: false, vegan: true, solo: true, wheelchair: false, pet: true }, address: "Centro, Tulum", hours: "Mon–Sun 07:30–15:00", phone: "+52 984 118 2233", website: "https://mintymiel.mx", gallery: [img(CAFE_IMG[0]), img(CAFE_IMG[1]), img(CAFE_IMG[2])], description: "Garden café pouring cold brew and honeyed granola. Open-air tables under palms — slow mornings encouraged." },
  { name: "Le Petit Grain", city: "Paris", country: "France", image: img(CAFE_IMG[1]), rating: 4.8, reviews: 112, price: 3, distance: 0.7, tags: { wifi: true, work: true, outdoor: true, seaView: false, vegan: true, solo: true, wheelchair: false, pet: true }, address: "34 Rue Oberkampf, 75011 Paris", hours: "Tue–Sun 08:00–18:00", phone: "+33 1 48 06 7788", website: "https://lepetitgrain.fr", gallery: [img(CAFE_IMG[1]), img(CAFE_IMG[0]), img(CAFE_IMG[2])], description: "Sourdough bakery-café with naturally leavened pastries and excellent filter. A calm, sunny spot to settle in." },
  { name: "Café Qahwa", city: "Marrakech", country: "Morocco", image: img(CAFE_IMG[2]), rating: 4.5, reviews: 58, price: 1, distance: 0.4, tags: { wifi: false, work: false, outdoor: true, seaView: false, vegan: true, solo: true, wheelchair: true, pet: false }, address: "Rue Mouassine, Marrakech", hours: "Mon–Sun 09:00–19:00", phone: "+212 5 24 38 11 22", website: "https://qahwa.ma", gallery: [img(CAFE_IMG[2]), img(CAFE_IMG[0]), img(CAFE_IMG[1])], description: "Rooftop café overlooking the souks. Spiced coffee, mint tea and orange-blossom cakes. Sunset is the moment." },
];

const EXTRA_RESTAURANTS = [
  { name: "Can Solé", city: "Barcelona", country: "Spain", cuisine: "Spanish", image: img(REST_IMG[0]), rating: 4.7, reviews: 244, price: 3, distance: 1.2, tags: { vegetarian: false, vegan: false, glutenFree: false, solo: true, outdoor: true, romantic: true, local: true, reservation: true }, address: "Carrer de Sant Carles 4, Barceloneta", hours: "Mon–Sat 13:00–23:30", phone: "+34 93 221 0303", website: "https://cansole.es", menuUrl: "https://cansole.es/menu", reservationUrl: "https://cansole.es/reserve", gallery: [img(REST_IMG[0]), img(REST_IMG[1]), img(REST_IMG[2])], description: "Barceloneta institution for seafood paella and fried anchovies. Beach-side and worth the wait." },
  { name: "Bills Darlinghurst", city: "Sydney", country: "Australia", cuisine: "Australian", image: img(REST_IMG[1]), rating: 4.5, reviews: 312, price: 2, distance: 0.6, tags: { vegetarian: true, vegan: true, glutenFree: true, solo: true, outdoor: true, romantic: false, local: true, reservation: true }, address: "433 Liverpool St, Darlinghurst, Sydney", hours: "Mon–Sun 07:30–15:00", phone: "+61 2 9360 4762", website: "https://bills.com.au", menuUrl: "https://bills.com.au/menu", reservationUrl: "https://bills.com.au/book", gallery: [img(REST_IMG[1]), img(REST_IMG[0]), img(REST_IMG[2])], description: "Famous ricotta hotcakes and flat whites in a bright, breezy room. The original Sydney brunch." },
  { name: "Yakitori Tori Tori", city: "Tokyo", country: "Japan", cuisine: "Japanese", image: img(REST_IMG[2]), rating: 4.7, reviews: 88, price: 3, distance: 1.3, tags: { vegetarian: false, vegan: false, glutenFree: false, solo: true, outdoor: false, romantic: false, local: true, reservation: true }, address: "1-15-2 Roppongi, Minato, Tokyo", hours: "Mon–Sat 17:00–00:00", phone: "+81 3 5575 4412", website: "https://toritori.tokyo", menuUrl: "https://toritori.tokyo/menu", reservationUrl: "https://toritori.tokyo/reserve", gallery: [img(REST_IMG[2]), img(REST_IMG[0]), img(REST_IMG[1])], description: "Smoke and charcoal counter serving tsukune and chicken oyster. Sake pairings and a convivial chef." },
  { name: "Mama Shelter Bistro", city: "Marrakech", country: "Morocco", cuisine: "Mediterranean", image: img(REST_IMG[0]), rating: 4.4, reviews: 132, price: 3, distance: 0.7, tags: { vegetarian: true, vegan: false, glutenFree: true, solo: true, outdoor: true, romantic: false, local: false, reservation: true }, address: "Avenue de France, Marrakech", hours: "Mon–Sun 12:00–23:00", phone: "+212 5 24 090 900", website: "https://mamashelter.com/marrakech", menuUrl: "https://mamashelter.com/menu", reservationUrl: "https://mamashelter.com/reserve", gallery: [img(REST_IMG[0]), img(REST_IMG[1]), img(REST_IMG[2])], description: "Rooftop mediterranean plates with a view of the Atlas mountains. Shared mezze and a fun, social vibe." },
  { name: "La Petite Cantine", city: "Paris", country: "France", cuisine: "French", image: img(REST_IMG[1]), rating: 4.6, reviews: 74, price: 2, distance: 0.9, tags: { vegetarian: true, vegan: true, glutenFree: true, solo: true, outdoor: true, romantic: false, local: true, reservation: false }, address: "12 Rue des Vignoles, 75020 Paris", hours: "Tue–Sat 12:00–22:00", phone: "+33 1 43 48 0909", website: "https://lapetitecantine.fr", menuUrl: "https://lapetitecantine.fr/menu", reservationUrl: "", gallery: [img(REST_IMG[1]), img(REST_IMG[0]), img(REST_IMG[2])], description: "Cooperative kitchen serving seasonal vegetarian plates at honest prices. Community table, walk-in only." },
  { name: "Izakaya Nonbe", city: "Copenhagen", country: "Denmark", cuisine: "Japanese", image: img(REST_IMG[2]), rating: 4.5, reviews: 56, price: 3, distance: 1.1, tags: { vegetarian: true, vegan: false, glutenFree: false, solo: true, outdoor: false, romantic: false, local: false, reservation: true }, address: "Vesterbrogade 110, 1620 København", hours: "Mon–Sat 17:00–23:00", phone: "+45 33 31 0909", website: "https://izakayanonbe.dk", menuUrl: "https://izakayanonbe.dk/menu", reservationUrl: "https://izakayanonbe.dk/book", gallery: [img(REST_IMG[2]), img(REST_IMG[0]), img(REST_IMG[1])], description: "Nordic-Japanese izakaya with small plates, craft beer and a cozy counter. Easy to dine solo." },
  { name: "Tabule Bali", city: "Bali", country: "Indonesia", cuisine: "Middle Eastern", image: img(REST_IMG[0]), rating: 4.7, reviews: 143, price: 2, distance: 1.6, tags: { vegetarian: true, vegan: true, glutenFree: true, solo: true, outdoor: true, romantic: false, local: false, reservation: true }, address: "Jalan Batu Bolong 48, Canggu", hours: "Mon–Sun 11:00–22:00", phone: "+62 361 873 2200", website: "https://tabulebali.id", menuUrl: "https://tabulebali.id/menu", reservationUrl: "https://tabulebali.id/reserve", gallery: [img(REST_IMG[0]), img(REST_IMG[1]), img(REST_IMG[2])], description: "Mezze, falafel and pomegranate salad in a leafy garden. Sharing plates and sunset cocktails." },
  { name: "Surf & Turf Co", city: "Cape Town", country: "South Africa", cuisine: "Seafood", image: img(REST_IMG[1]), rating: 4.6, reviews: 167, price: 3, distance: 2.2, tags: { vegetarian: false, vegan: false, glutenFree: true, solo: true, outdoor: true, romantic: true, local: true, reservation: true }, address: "Camps Bay, Cape Town", hours: "Mon–Sun 12:00–23:00", phone: "+27 21 438 7788", website: "https://surfnturf.co.za", menuUrl: "https://surfnturf.co.za/menu", reservationUrl: "https://surfnturf.co.za/book", gallery: [img(REST_IMG[1]), img(REST_IMG[0]), img(REST_IMG[2])], description: "Oceanview grill in Camps Bay — line-caught fish, prawn linguine and sunset tables. Reserve for the terrace." },
  { name: "Verita", city: "Barcelona", country: "Spain", cuisine: "Vegan", image: img(REST_IMG[2]), rating: 4.6, reviews: 121, price: 2, distance: 0.8, tags: { vegetarian: true, vegan: true, glutenFree: true, solo: true, outdoor: true, romantic: false, local: false, reservation: true }, address: "Carrer de la Princesa 14, Barcelona", hours: "Mon–Sat 13:00–23:00", phone: "+34 93 319 8822", website: "https://verita.es", menuUrl: "https://verita.es/menu", reservationUrl: "https://verita.es/reserve", gallery: [img(REST_IMG[2]), img(REST_IMG[0]), img(REST_IMG[1])], description: "Plant-based tapas and natural wine in El Born. Vibrant, social and quietly stylish." },
  { name: "The Garden Table", city: "Sydney", country: "Australia", cuisine: "Brunch", image: img(REST_IMG[0]), rating: 4.7, reviews: 198, price: 2, distance: 0.5, tags: { vegetarian: true, vegan: true, glutenFree: true, solo: true, outdoor: true, romantic: false, local: true, reservation: true }, address: "1 Albion St, Surry Hills, Sydney", hours: "Mon–Sun 07:30–15:00", phone: "+61 2 9211 0312", website: "https://thegardentable.com.au", menuUrl: "https://thegardentable.com.au/menu", reservationUrl: "https://thegardentable.com.au/book", gallery: [img(REST_IMG[0]), img(REST_IMG[1]), img(REST_IMG[2])], description: "Garden brunch with green shakshuka, grain bowls and great coffee. A Surry Hills solo-brunch favourite." },
];

const EXTRA_HOTELS = [
  { name: "Casa Bonay", city: "Barcelona", country: "Spain", image: img(HOTEL_IMG[1]), stars: 4, memberRating: 4.7, reviews: 168, pricePerNight: 210, distance: 1.1, tags: { pool: false, gym: true, spa: false, breakfast: true, beach: false, cityCenter: true, solo: true, womenReviews: true }, address: "Gran Via de les Corts Catalanes 700, Barcelona", website: "https://casabonay.com", bookingUrl: "https://casabonay.com/book", gallery: [img(HOTEL_IMG[1]), img(HOTEL_IMG[0]), img(HOTEL_IMG[2])], description: "Design hotel with a rooftop, in-house coffee roaster and a creative-community feel.", safetyNote: "Central Eixample; well-lit and busy at night.", locationNote: "Walkable to Passeig de Gràcia and the Gothic Quarter." },
  { name: "Ovolo Woolloomooloo", city: "Sydney", country: "Australia", image: img(HOTEL_IMG[0]), stars: 5, memberRating: 4.8, reviews: 214, pricePerNight: 340, distance: 0.8, tags: { pool: true, gym: true, spa: true, breakfast: true, beach: true, cityCenter: true, solo: true, womenReviews: true }, address: "6 Cowper Wharf Rd, Woolloomooloo, Sydney", website: "https://ovolohotels.com", bookingUrl: "https://ovolohotels.com/book", gallery: [img(HOTEL_IMG[0]), img(HOTEL_IMG[2]), img(HOTEL_IMG[1])], description: "Wharf boutique hotel with a rooftop pool, harbour views and a relaxed, inclusive vibe.", safetyNote: "Secure wharf precinct with 24-hour front desk.", locationNote: "Minutes from the Botanic Gardens and the harbour." },
  { name: "Riad Anabel", city: "Marrakech", country: "Morocco", image: img(HOTEL_IMG[2]), stars: 4, memberRating: 4.9, reviews: 96, pricePerNight: 175, distance: 0.5, tags: { pool: true, gym: false, spa: true, breakfast: true, beach: false, cityCenter: true, solo: true, womenReviews: true }, address: "Derb Sidi Bouamar, Marrakech", website: "https://riadanabel.com", bookingUrl: "https://riadanabel.com/reserve", gallery: [img(HOTEL_IMG[2]), img(HOTEL_IMG[1]), img(HOTEL_IMG[0])], description: "Women-run riad with a plunge pool, hammam and rooftop breakfasts. A calm medina sanctuary.", safetyNote: "Staff arrange evening escorts to the square.", locationNote: "5 minutes from Jemaa el-Fnaa." },
  { name: "Trunk Hotel", city: "Tokyo", country: "Japan", image: img(HOTEL_IMG[1]), stars: 4, memberRating: 4.6, reviews: 188, pricePerNight: 240, distance: 0.9, tags: { pool: false, gym: true, spa: false, breakfast: true, beach: false, cityCenter: true, solo: true, womenReviews: true }, address: "5-31 Trunk House, Shibuya, Tokyo", website: "https://trunkhotel.com", bookingUrl: "https://trunkhotel.com/reserve", gallery: [img(HOTEL_IMG[1]), img(HOTEL_IMG[0]), img(HOTEL_IMG[2])], description: "Sustainable boutique hotel in Shibuya with a calm rooftop bar and curated design.", safetyNote: "Shibuya is safe and well-lit; staffed 24/7.", locationNote: "Steps from Shibuya station and the crossing." },
  { name: "Hotel Académie", city: "Paris", country: "France", image: img(HOTEL_IMG[2]), stars: 4, memberRating: 4.8, reviews: 142, pricePerNight: 260, distance: 0.7, tags: { pool: false, gym: false, spa: true, breakfast: true, beach: false, cityCenter: true, solo: true, womenReviews: true }, address: "232 Rue de Rivoli, 75001 Paris", website: "https://hotelacademie.fr", bookingUrl: "https://hotelacademie.fr/reserve", gallery: [img(HOTEL_IMG[2]), img(HOTEL_IMG[1]), img(HOTEL_IMG[0])], description: "Boutique stay steps from the Tuileries with a small spa and refined, quiet rooms.", safetyNote: "Central 1st arr.; busy and well-lit at night.", locationNote: "Between the Louvre and Place Vendôme." },
];

const DEMO_EVENTS = [
  { title: "Sunrise Yoga & Brunch", category: "yoga", date: "2026-08-02", time: "07:30", end_time: "10:00", location: "Canggu Beach", city: "Bali", country: "Indonesia", image: img(TRAVEL_IMG[1]), host_name: PERSONAS[4].name, attendees_count: 12, max_attendees: 15, pricing: "free", languages: ["English", "Bahasa"], description: "Gentle sunrise flow on the sand followed by a long brunch at a beach café. All levels welcome — bring a mat (or borrow one)." },
  { title: "Pastel de Nata Crawl", category: "brunch", date: "2026-08-09", time: "15:00", end_time: "18:00", location: "Belém & Bairro Alto", city: "Lisbon", country: "Portugal", image: img(TRAVEL_IMG[0]), host_name: PERSONAS[0].name, attendees_count: 9, max_attendees: 12, pricing: "free", languages: ["English", "Portuguese"], description: "A sweet afternoon hopping between the city's best bakeries. We end with espresso and river views." },
  { title: "Table Mountain Sunrise Hike", category: "hiking", date: "2026-08-12", time: "06:00", end_time: "11:00", location: "Table Mountain (Platteklip Gorge)", city: "Cape Town", country: "South Africa", image: img(TRAVEL_IMG[3]), host_name: PERSONAS[12].name, attendees_count: 8, max_attendees: 10, pricing: "free", languages: ["English"], description: "Early start to beat the heat and catch the view. Moderate fitness; bring water and a snack." },
  { title: "Hygge Coffee Morning", category: "coffee", date: "2026-08-14", time: "10:00", end_time: "12:00", location: "Pigeon & Pear, Vesterbro", city: "Copenhagen", country: "Denmark", image: img(CAFE_IMG[2]), host_name: PERSONAS[5].name, attendees_count: 7, max_attendees: 10, pricing: "free", languages: ["English", "Danish"], description: "A slow morning of cardamom buns and good company. New in town? This one's for you." },
  { title: "Cenote Swim & Sound Bath", category: "wellness", date: "2026-08-16", time: "08:00", end_time: "11:00", location: "Cenote Dos Ojos", city: "Tulum", country: "Mexico", image: img(TRAVEL_IMG[1]), host_name: PERSONAS[18].name, attendees_count: 6, max_attendees: 8, pricing: "free", languages: ["English", "Spanish"], description: "Morning cenote swim followed by a guided sound bath on the deck. Bring a towel and an open mind." },
  { title: "Belleville Gallery Walk", category: "sightseeing", date: "2026-08-18", time: "14:00", end_time: "17:00", location: " Rue Dénoyez & surrounds", city: "Paris", country: "France", image: img(TRAVEL_IMG[5]), host_name: PERSONAS[11].name, attendees_count: 11, max_attendees: 14, pricing: "free", languages: ["English", "French"], description: "Street art and small galleries through Belleville, ending at a wine bar for natural wine and cheese." },
  { title: "Girls' Sushi Night", category: "dinner", date: "2026-08-20", time: "19:30", end_time: "22:00", location: "Glow Coffee Tokyo (after hours)", city: "Tokyo", country: "Japan", image: img(REST_IMG[2]), host_name: PERSONAS[13].name, attendees_count: 10, max_attendees: 10, pricing: "paid_external", external_link: "https://example.com/tickets", languages: ["English", "Japanese"], description: "A curated omakase-style dinner just for the group. Small, cozy and conversational — booking required." },
  { title: "Souks & Spice Walk", category: "shopping", date: "2026-08-23", time: "10:00", end_time: "13:00", location: "Medina, Marrakech", city: "Marrakech", country: "Morocco", image: img(TRAVEL_IMG[6]), host_name: PERSONAS[16].name, attendees_count: 8, max_attendees: 12, pricing: "free", languages: ["English", "Arabic", "French"], description: "A guided wander through the spice and textile souks, finishing with mint tea on a rooftop." },
  { title: "Barceloneta Beach Brunch", category: "brunch", date: "2026-08-25", time: "11:00", end_time: "14:00", location: "Can Solé", city: "Barcelona", country: "Spain", image: img(REST_IMG[0]), host_name: PERSONAS[17].name, attendees_count: 13, max_attendees: 15, pricing: "free", languages: ["English", "Spanish"], description: "Long seafood brunch by the beach, then a swim. A relaxed way to meet other travellers." },
  { title: "Surry Hills Brunch Club", category: "brunch", date: "2026-08-27", time: "10:30", end_time: "12:30", location: "The Garden Table", city: "Sydney", country: "Australia", image: img(REST_IMG[0]), host_name: PERSONAS[19].name, attendees_count: 9, max_attendees: 12, pricing: "free", languages: ["English"], description: "Plant-based brunch and good coffee. A casual intro to the city for solo arrivals." },
  { title: "Ubud Rice-Field Walk", category: "hiking", date: "2026-08-29", time: "06:30", end_time: "09:00", location: "Campuhan Ridge", city: "Bali", country: "Indonesia", image: img(TRAVEL_IMG[1]), host_name: PERSONAS[10].name, attendees_count: 7, max_attendees: 10, pricing: "free", languages: ["English"], description: "Cool morning walk along the Campuhan Ridge with a café stop. Quiet, green and restorative." },
  { title: "Rooftop Wine & Sunset", category: "wine", date: "2026-09-01", time: "18:00", end_time: "20:30", location: "Mama Shelter Rooftop", city: "Marrakech", country: "Morocco", image: img(REST_IMG[0]), host_name: PERSONAS[7].name, attendees_count: 11, max_attendees: 12, pricing: "free", languages: ["English", "French"], description: "Sunset over the Atlas with a glass in hand. Easy socialising with a view." },
  { title: "Canal Bike Ride & Fika", category: "coworking", date: "2026-09-03", time: "14:00", end_time: "17:00", location: "Nyhavn", city: "Copenhagen", country: "Denmark", image: img(TRAVEL_IMG[4]), host_name: PERSONAS[3].name, attendees_count: 6, max_attendees: 10, pricing: "free", languages: ["English", "Danish"], description: "A leisurely bike loop along the canals, finishing with cinnamon buns and coffee." },
  { title: "Pastries & Printmaking", category: "sightseeing", date: "2026-09-06", time: "13:00", end_time: "16:00", location: "Maison Plume + atelier", city: "Paris", country: "France", image: img(CAFE_IMG[0]), host_name: PERSONAS[15].name, attendees_count: 8, max_attendees: 10, pricing: "free", languages: ["English", "French"], description: "Brunch, then a hands-on linocut workshop in a Belleville studio. Beginners welcome." },
  { title: "Harbour Sunset Swim", category: "beach", date: "2026-09-09", time: "17:30", end_time: "19:30", location: "Bondi Icebergs", city: "Sydney", country: "Australia", image: img(TRAVEL_IMG[2]), host_name: PERSONAS[19].name, attendees_count: 10, max_attendees: 12, pricing: "free", languages: ["English"], description: "An evening ocean-pool swim and fish-and-chips after. A classic Sydney welcome." },
];

const DEMO_DEALS = [
  { title: "20% off Surf Lessons", partner: "Bali Surf Co", category: "activities", image: img(TRAVEL_IMG[1]), discount: "20% off", city: "Bali", country: "Indonesia", expiration_date: "2026-12-31", terms: "Valid for Seluna members on weekdays. Mention code at booking.", code_prefix: "SELUNA" },
  { title: "Free Breakfast at Memmo Alfama", partner: "Memmo Alfama", category: "hotels", image: img(HOTEL_IMG[0]), discount: "Free breakfast", city: "Lisbon", country: "Portugal", expiration_date: "2026-11-30", terms: "One free breakfast per stay, direct bookings only.", code_prefix: "SELUNA" },
  { title: "15% off Brunch", partner: "Bills Darlinghurst", category: "restaurants", image: img(REST_IMG[1]), discount: "15% off", city: "Sydney", country: "Australia", expiration_date: "2026-10-31", terms: "Weekday brunch only. Show the in-app deal screen to staff.", code_prefix: "SELUNA" },
  { title: "2-for-1 Yoga Classes", partner: "Bloom Yoga", category: "activities", image: img(TRAVEL_IMG[1]), discount: "2-for-1 classes", city: "Tulum", country: "Mexico", expiration_date: "2026-12-15", terms: "First-time visitors. Redeem two drop-in classes for the price of one.", code_prefix: "SELUNA" },
  { title: "10% off Roastery Beans", partner: "Fabrica Coffee Roasters", category: "cafes", image: img(CAFE_IMG[0]), discount: "10% off beans", city: "Lisbon", country: "Portugal", expiration_date: "2026-09-30", terms: "On retail bean bags. One per member per month.", code_prefix: "SELUNA" },
  { title: "Free Hammam Session", partner: "Riad Anabel", category: "activities", image: img(HOTEL_IMG[2]), discount: "Free hammam", city: "Marrakech", country: "Morocco", expiration_date: "2026-11-30", terms: "One complimentary hammam per stay of 2+ nights.", code_prefix: "SELUNA" },
  { title: "Sunset Cruise 25% off", partner: "Cape Bay Cruises", category: "activities", image: img(TRAVEL_IMG[3]), discount: "25% off", city: "Cape Town", country: "South Africa", expiration_date: "2026-10-31", terms: "Select sunset departures. Book online with code.", code_prefix: "SELUNA" },
  { title: "Day Pass — Coworking Canggu", partner: "Outpost Canggu", category: "coworking", image: img(CAFE_IMG[2]), discount: "Day pass $12", city: "Bali", country: "Indonesia", expiration_date: "2026-12-31", terms: "Member rate day pass, normally $18. Includes coffee and Wi-Fi.", code_prefix: "SELUNA" },
  { title: "Free Airport Pickup", partner: "Casa Bonay", category: "hotels", image: img(HOTEL_IMG[1]), discount: "Free airport pickup", city: "Barcelona", country: "Spain", expiration_date: "2026-11-15", terms: "On stays of 3+ nights. Mention code at booking.", code_prefix: "SELUNA" },
  { title: "20% off Omakase", partner: "Glow Coffee Tokyo", category: "restaurants", image: img(REST_IMG[2]), discount: "20% off omakase", city: "Tokyo", country: "Japan", expiration_date: "2026-10-15", terms: "Weeknight omakase only. Reservation required, mention code.", code_prefix: "SELUNA" },
];

const DEMO_TRIPS = [
  { name: "Slow Lisbon", city: "Lisbon", country: "Portugal", start_date: "2026-08-08", end_date: "2026-08-15", travel_style: "Slow & café-focused", cover_image: img(TRAVEL_IMG[0]), description: "A week of tram rides, pastel de nata and golden-hour rooftop hangs.", looking_for: ["Café buddy", "Photo walks", "Sunset chats"], visibility: "public" },
  { name: "Bali Wellness Reset", city: "Bali", country: "Indonesia", start_date: "2026-08-12", end_date: "2026-08-22", travel_style: "Wellness & yoga", cover_image: img(TRAVEL_IMG[1]), description: "Two weeks of sunrise yoga, smoothie bowls and jungle cafés in Ubud & Canggu.", looking_for: ["Yoga partner", "Wellness buddy", "Healthy eats"], visibility: "public" },
  { name: "Cape Town Adventure", city: "Cape Town", country: "South Africa", start_date: "2026-08-10", end_date: "2026-08-20", travel_style: "Adventure & hiking", cover_image: img(TRAVEL_IMG[3]), description: "Hikes, ocean swims and wine country — the full Cape Town stack.", looking_for: ["Hiking buddy", "Road-trip pal", "Surf partner"], visibility: "public" },
  { name: "Paris in Bloom", city: "Paris", country: "France", start_date: "2026-08-18", end_date: "2026-08-25", travel_style: "Culture & food", cover_image: img(TRAVEL_IMG[5]), description: "Gallery mornings, pastry afternoons and natural-wine nights.", looking_for: ["Gallery buddy", "Foodie", "Market walks"], visibility: "public" },
  { name: "Tokyo Quiet Corners", city: "Tokyo", country: "Japan", start_date: "2026-09-02", end_date: "2026-09-10", travel_style: "Slow & design-led", cover_image: img(TRAVEL_IMG[7]), description: "Shrines, tea houses and design shops — Tokyo at a considered pace.", looking_for: ["Design lover", "Food explorer", "Café crawler"], visibility: "public" },
  { name: "Copenhagen Cozy", city: "Copenhagen", country: "Denmark", start_date: "2026-08-14", end_date: "2026-08-20", travel_style: "Design & slow mornings", cover_image: img(TRAVEL_IMG[4]), description: "Hygge cafés, canal rides and cold swims. Pack a cardigan.", looking_for: ["Café buddy", "Cyclist", "Cold-water swim"], visibility: "public" },
  { name: "Tulum Reset", city: "Tulum", country: "Mexico", start_date: "2026-08-16", end_date: "2026-08-23", travel_style: "Beach & wellness", cover_image: img(TRAVEL_IMG[1]), description: "Cenotes, tacos and sunrise yoga by the beach.", looking_for: ["Yoga partner", "Beach buddy", "Taco tours"], visibility: "public" },
  { name: "Marrakech Colour", city: "Marrakech", country: "Morocco", start_date: "2026-08-23", end_date: "2026-08-29", travel_style: "Culture & markets", cover_image: img(TRAVEL_IMG[6]), description: "Souks, hammam and rooftop dinners under the stars.", looking_for: ["Market buddy", "Photographer", "Tea & chats"], visibility: "public" },
  { name: "Barcelona Beach Days", city: "Barcelona", country: "Spain", start_date: "2026-08-25", end_date: "2026-09-01", travel_style: "Beach & social", cover_image: img(TRAVEL_IMG[0]), description: "Brunch, beach and late tapas nights with a friendly group.", looking_for: ["Brunch buddy", "Beach days", "Tapas nights"], visibility: "public" },
  { name: "Sydney Harbour Week", city: "Sydney", country: "Australia", start_date: "2026-09-04", end_date: "2026-09-11", travel_style: "Coastal & brunch", cover_image: img(TRAVEL_IMG[2]), description: "Coastal walks, ocean pools and good coffee from Bondi to Manly.", looking_for: ["Walking buddy", "Brunch crew", "Surf-curious"], visibility: "public" },
];

const DEMO_REVIEWS = [
  { item_type: "cafe", item_key: "cafe:Café Norden", item_title: "Café Norden", rating: 5, text: "The flat white was perfect and the staff were so welcoming to a solo traveller. I worked all afternoon without feeling rushed.", visit_date: "2026-07-02", author_name: PERSONAS[3].name, author_avatar: PERSONAS[3].avatar },
  { item_type: "cafe", item_key: "cafe:The Tiny Cup", item_title: "The Tiny Cup", rating: 5, text: "Tucked away on a floral lane — the best espresso I had in Lisbon and the bench is ideal for people-watching.", visit_date: "2026-06-28", author_name: PERSONAS[0].name, author_avatar: PERSONAS[0].avatar },
  { item_type: "cafe", item_key: "cafe:Brew & Bloom", item_title: "Brew & Bloom", rating: 4, text: "Garden setting, plant-based bowls and fast Wi-Fi. My go-to work spot in Canggu.", visit_date: "2026-07-10", author_name: PERSONAS[4].name, author_avatar: PERSONAS[4].avatar },
  { item_type: "restaurant", item_key: "restaurant:Cervejaria Ramiro", item_title: "Cervejaria Ramiro", rating: 5, text: "Loud, bustling and the seafood is unreal. Go early or expect a queue — totally worth it.", visit_date: "2026-07-04", author_name: PERSONAS[0].name, author_avatar: PERSONAS[0].avatar },
  { item_type: "restaurant", item_key: "restaurant:Casa Jaguar", item_title: "Casa Jaguar", rating: 5, text: "Jungle setting and the vegan mole surprised me. Candle-lit and magical at night.", visit_date: "2026-06-30", author_name: PERSONAS[9].name, author_avatar: PERSONAS[9].avatar },
  { item_type: "hotel", item_key: "hotel:Memmo Alfama", item_title: "Memmo Alfama", rating: 5, text: "Felt completely safe as a solo traveller. The rooftop pool and river views sold it for me.", visit_date: "2026-07-01", author_name: PERSONAS[3].name, author_avatar: PERSONAS[3].avatar },
  { item_type: "hotel", item_key: "hotel:Habitas Tulum", item_title: "Habitas Tulum", rating: 5, text: "The wellness programming is excellent and I met other solo women here instantly. Beach yoga at sunrise is a memory now.", visit_date: "2026-06-22", author_name: PERSONAS[9].name, author_avatar: PERSONAS[9].avatar },
  { item_type: "destination", item_key: "destination:Lisbon", item_title: "Lisbon", rating: 5, text: "Lisbon is the friendliest city I've travelled solo. Walkable, safe and the café culture is everything.", visit_date: "2026-07-05", author_name: PERSONAS[0].name, author_avatar: PERSONAS[0].avatar },
  { item_type: "destination", item_key: "destination:Cape Town", item_title: "Cape Town", rating: 5, text: "Adventure and beauty in equal measure. Did the Table Mountain sunrise hike and met the loveliest group.", visit_date: "2026-07-08", author_name: PERSONAS[12].name, author_avatar: PERSONAS[12].avatar },
  { item_type: "destination", item_key: "destination:Tokyo", item_title: "Tokyo", rating: 5, text: "The safest I've ever felt travelling alone. Quiet shrines in the morning, ramen at night — perfect.", visit_date: "2026-06-18", author_name: PERSONAS[13].name, author_avatar: PERSONAS[13].avatar },
  { item_type: "cafe", item_key: "cafe:Saudade Espresso Bar", item_title: "Saudade Espresso Bar", rating: 5, text: "Vegan pastel de nata that actually tastes like the original? Yes. Sharp espresso and a sunny bench too.", visit_date: "2026-07-11", author_name: PERSONAS[14].name, author_avatar: PERSONAS[14].avatar },
  { item_type: "restaurant", item_key: "restaurant:Can Solé", item_title: "Can Solé", rating: 5, text: "Beach-side paella done right. We stayed for the sunset and a second round of anchovies.", visit_date: "2026-07-13", author_name: PERSONAS[17].name, author_avatar: PERSONAS[17].avatar },
];

async function topUp(svc, entity, existing, pool, target, matchField, extraFields) {
  const need = Math.max(0, target - existing.length);
  if (need === 0) return 0;
  const taken = new Set(existing.map((e) => String(e[matchField]).toLowerCase()));
  const toAdd = pool.filter((p) => !taken.has(String(p[matchField]).toLowerCase())).slice(0, need);
  if (toAdd.length === 0) return 0;
  await svc.entities[entity].bulkCreate(toAdd.map((p, i) => ({ ...p, ...extraFields, status: "published", sort_order: existing.length + i })));
  return toAdd.length;
}

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    if (!user) return Response.json({ error: "Unauthorized" }, { status: 401 });
    if (user.role !== "admin") return Response.json({ error: "Forbidden" }, { status: 403 });
    const svc = base44; // admin client so created_by_id = admin and RLS permits social-graph writes
    const result = { added: {}, skipped: [] };

    // --- Content top-ups (idempotent by name/city) ---
    const [dests, cafes, rests, hotels] = await Promise.all([
      svc.entities.Destination.list(500),
      svc.entities.Cafe.list(500),
      svc.entities.Restaurant.list(500),
      svc.entities.Hotel.list(500),
    ]);
    result.added.destinations = await topUp(svc, "Destination", dests, EXTRA_DESTINATIONS, 10, "city", {});
    result.added.cafes = await topUp(svc, "Cafe", cafes, EXTRA_CAFES, 20, "name", {});
    result.added.restaurants = await topUp(svc, "Restaurant", rests, EXTRA_RESTAURANTS, 20, "name", {});
    result.added.hotels = await topUp(svc, "Hotel", hotels, EXTRA_HOTELS, 15, "name", {});

    // --- Events (top up to 15) ---
    const events = await svc.entities.Event.list(500);
    const eventNeed = Math.max(0, 15 - events.length);
    if (eventNeed > 0) {
      const eventTitles = new Set(events.map((e) => e.title));
      const newEvents = DEMO_EVENTS.filter((e) => !eventTitles.has(e.title)).slice(0, eventNeed).map((e, i) => ({
        ...e, host_id: `demo-${i}`, visibility: "public", agreed_rules: true, sort_order: events.length + i,
      }));
      if (newEvents.length) await svc.entities.Event.bulkCreate(newEvents);
      result.added.events = newEvents.length;
    } else result.added.events = 0;

    // --- Deals (top up to 10) ---
    const deals = await svc.entities.Deal.list(500);
    const dealNeed = Math.max(0, 10 - deals.length);
    if (dealNeed > 0) {
      const dealTitles = new Set(deals.map((d) => d.title));
      const newDeals = DEMO_DEALS.filter((d) => !dealTitles.has(d.title)).slice(0, dealNeed);
      if (newDeals.length) await svc.entities.Deal.bulkCreate(newDeals);
      result.added.deals = newDeals.length;
    } else result.added.deals = 0;

    // --- Trips (top up to 10) ---
    const trips = await svc.entities.Trip.list(500);
    {
      const tripNeed = Math.max(0, 10 - trips.length);
      const tripNames = new Set(trips.map((t) => t.name));
      const newTrips = DEMO_TRIPS.filter((t) => !tripNames.has(t.name)).slice(0, tripNeed);
      if (tripNeed > 0 && newTrips.length) await svc.entities.Trip.bulkCreate(newTrips);
      result.added.trips = newTrips.length;
    }

    // --- Matches (only if none yet) — admin is matched by each persona ---
    const matches = await svc.entities.Match.list(500);
    if (matches.length === 0) {
      await svc.entities.Match.bulkCreate(PERSONAS.map((p, i) => ({
        match_user_id: `demo-persona-${i}`, match_name: p.name, match_avatar: p.avatar,
        city: p.city, dates: "This month",
      })));
      result.added.matches = PERSONAS.length;
    } else result.added.matches = 0;

    // --- Conversations + messages (only if none yet) ---
    const convos = await svc.entities.Conversation.list(500);
    if (convos.length === 0) {
      const chatPartners = PERSONAS.slice(0, 6);
      const now = new Date();
      for (let i = 0; i < chatPartners.length; i++) {
        const p = chatPartners[i];
        const personaId = `demo-persona-${i}`;
        const convo = await svc.entities.Conversation.create({
          participant_ids: [user.id, personaId],
          participant_names: [p.name, user.full_name || "You"],
          participant_avatars: [p.avatar, ""],
          last_message: "Can't wait to meet up! ☀️",
          last_message_at: now.toISOString(),
          unread: { [user.id]: 1 },
        });
        const msgs = [
          { conversation_id: convo.id, participant_ids: [user.id, personaId], sender_id: personaId, type: "text", text: `Hi! Saw we both love ${p.city} ☀️`, read: true },
          { conversation_id: convo.id, participant_ids: [user.id, personaId], sender_id: personaId, type: "text", text: `I'm there the same week — want to grab coffee?`, read: true },
          { conversation_id: convo.id, participant_ids: [user.id, personaId], sender_id: user.id, type: "text", text: "Yes! That sounds perfect 😊", read: true },
          { conversation_id: convo.id, participant_ids: [user.id, personaId], sender_id: personaId, type: "text", text: "Can't wait to meet up! ☀️", read: false },
        ];
        await svc.entities.Message.bulkCreate(msgs);
      }
      result.added.conversations = chatPartners.length;
    } else result.added.conversations = 0;

    // --- Reviews (top up to 12) ---
    const reviews = await svc.entities.Review.list(500);
    {
      const reviewNeed = Math.max(0, 12 - reviews.length);
      const keys = new Set(reviews.map((r) => `${r.item_key}::${r.author_name}`));
      const newReviews = DEMO_REVIEWS.filter((r) => !keys.has(`${r.item_key}::${r.author_name}`)).slice(0, reviewNeed);
      if (reviewNeed > 0 && newReviews.length)
        await svc.entities.Review.bulkCreate(newReviews.map((r) => ({ ...r, helpful_count: Math.floor(Math.random() * 12) })));
      result.added.reviews = newReviews.length;
    }

    return Response.json({ ok: true, result });
  } catch (error) {
    console.error("seed-demo-data error:", error);
    return Response.json({ error: error.message, stack: error.stack }, { status: 500 });
  }
});