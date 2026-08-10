export const SEARCH_TYPES = [
  { value: "city", label: "Cities" },
  { value: "country", label: "Countries" },
  { value: "destination", label: "Destinations" },
  { value: "cafe", label: "Cafes" },
  { value: "restaurant", label: "Restaurants" },
  { value: "hotel", label: "Hotels" },
  { value: "event", label: "Events" },
  { value: "deal", label: "Deals" },
  { value: "member", label: "Members" },
];

const img = (id) => `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=400&q=80`;

export const SEARCH_CORPUS = [
  // Cities
  { type: "city", title: "Copenhagen", location: "Copenhagen", country: "Denmark", rating: 4.8, interests: ["culture", "food", "shopping"], image: img("1554118811-1e0d58224f24"), info: "Capital of Denmark" },
  { type: "city", title: "Lisbon", location: "Lisbon", country: "Portugal", rating: 4.7, interests: ["beach", "food", "culture"], image: img("1555881400-74d7acaacd8b"), info: "Coastal capital" },
  { type: "city", title: "Paris", location: "Paris", country: "France", rating: 4.9, interests: ["culture", "food", "shopping"], image: img("1502602898657-3e91760cbb34"), info: "City of Light" },
  { type: "city", title: "Berlin", location: "Berlin", country: "Germany", rating: 4.6, interests: ["culture", "nightlife", "food"], image: img("1560969184-10fe87293504"), info: "Creative hub" },
  { type: "city", title: "Marrakech", location: "Marrakech", country: "Morocco", rating: 4.7, interests: ["culture", "food", "shopping"], image: img("1414235077428-338989a2e8c0"), info: "Red city" },

  // Countries
  { type: "country", title: "Denmark", location: "Denmark", country: "Denmark", rating: 4.8, interests: ["culture", "food"], image: img("1513622470522-26c3c8a854bc"), info: "Scandinavia" },
  { type: "country", title: "Portugal", location: "Portugal", country: "Portugal", rating: 4.7, interests: ["beach", "food", "culture"], image: img("1555881400-74d7acaacd8b"), info: "Iberian coast" },
  { type: "country", title: "France", location: "France", country: "France", rating: 4.9, interests: ["culture", "food", "wine"], image: img("1502602898657-3e91760cbb34"), info: "Western Europe" },
  { type: "country", title: "Indonesia", location: "Indonesia", country: "Indonesia", rating: 4.8, interests: ["beach", "wellness", "adventure"], image: img("1537996194471-e657df975ab4"), info: "Tropical isles" },
  { type: "country", title: "Morocco", location: "Morocco", country: "Morocco", rating: 4.6, interests: ["culture", "food", "shopping"], image: img("1414235077428-338989a2e8c0"), info: "North Africa" },

  // Destinations
  { type: "destination", title: "Ubud, Bali", location: "Ubud", country: "Indonesia", rating: 4.9, interests: ["wellness", "yoga", "relaxation"], image: img("1537996194471-e657df975ab4"), info: "Jungle retreats" },
  { type: "destination", title: "Lisbon Coast", location: "Lisbon", country: "Portugal", rating: 4.7, interests: ["beach", "food", "relaxation"], image: img("1555881400-74d7acaacd8b"), info: "Sunset coastline" },
  { type: "destination", title: "Marrakech Medina", location: "Marrakech", country: "Morocco", rating: 4.6, interests: ["culture", "shopping", "food"], image: img("1414235077428-338989a2e8c0"), info: "Historic souks" },
  { type: "destination", title: "Copenhagen Castles", location: "Copenhagen", country: "Denmark", rating: 4.8, interests: ["culture", "photography"], image: img("1554118811-1e0d58224f24"), info: "Royal history" },

  // Cafes
  { type: "cafe", title: "Café Norden", location: "Copenhagen", country: "Denmark", rating: 4.9, price: "$$", distance: 1.2, interests: ["cafes", "food"], image: img("1554118811-1e0d58224f24"), info: "Cozy central café" },
  { type: "cafe", title: "The Tiny Cup", location: "Lisbon", country: "Portugal", rating: 4.6, price: "$", distance: 3.4, interests: ["cafes"], image: img("1453614512568-c4034dfb0fa0"), info: "Specialty coffee" },
  { type: "cafe", title: "Brew & Bloom", location: "Ubud", country: "Indonesia", rating: 4.8, price: "$$", distance: 8.0, interests: ["cafes", "wellness"], image: img("1495474472287-4d71bcdd2085"), info: "Garden café" },
  { type: "cafe", title: "Olive & Bean", location: "Paris", country: "France", rating: 4.5, price: "$$", distance: 2.0, interests: ["cafes", "food"], image: img("1554118811-1e0d58224f24"), info: "French roastery" },

  // Restaurants
  { type: "restaurant", title: "Olive & Vine", location: "Paris", country: "France", rating: 4.7, price: "$$$", distance: 1.8, interests: ["food", "wine"], image: img("1414235077428-338989a2e8c0"), info: "Fine dining" },
  { type: "restaurant", title: "Saffron Table", location: "Marrakech", country: "Morocco", rating: 4.6, price: "$$", distance: 5.2, interests: ["food", "culture"], image: img("1414235077428-338989a2e8c0"), info: "Moroccan cuisine" },
  { type: "restaurant", title: "Harbor Light", location: "Copenhagen", country: "Denmark", rating: 4.8, price: "$$$", distance: 2.5, interests: ["food"], image: img("1559339352-11d035aa65de"), info: "Seaside dining" },
  { type: "restaurant", title: "Bali Spice", location: "Ubud", country: "Indonesia", rating: 4.5, price: "$$", distance: 7.0, interests: ["food"], image: img("1414235077428-338989a2e8c0"), info: "Local flavors" },

  // Hotels
  { type: "hotel", title: "Sandhouse Hotel", location: "Lisbon", country: "Portugal", rating: 4.8, price: "$$$", distance: 1.0, interests: ["relaxation"], image: img("1566073771259-6a560657f57b"), info: "Beachfront stay" },
  { type: "hotel", title: "Maison du Parc", location: "Paris", country: "France", rating: 4.8, price: "$$$", distance: 3.0, interests: ["relaxation", "culture"], image: img("1551882547-ff40c63fe595"), info: "Boutique hotel" },
  { type: "hotel", title: "Bali Hideaway", location: "Ubud", country: "Indonesia", rating: 4.9, price: "$$", distance: 9.0, interests: ["wellness", "relaxation"], image: img("1540541338287-41700207dee6"), info: "Jungle villa" },
  { type: "hotel", title: "Copenhagen Stay", location: "Copenhagen", country: "Denmark", rating: 4.6, price: "$$", distance: 1.5, interests: ["culture"], image: img("1554118811-1e0d58224f24"), info: "Central rooms" },

  // Events
  { type: "event", title: "Sunset Yoga", location: "Copenhagen", country: "Denmark", rating: 4.8, date: "2026-08-12", distance: 1.0, interests: ["yoga", "wellness"], image: img("1545389336-cf090694435e"), info: "Free · Aug 12" },
  { type: "event", title: "Wine & Paint", location: "Lisbon", country: "Portugal", rating: 4.7, date: "2026-08-18", distance: 2.0, price: "$$", interests: ["wine", "culture"], image: img("1513569771920-c9e1d31714ba"), info: "$25 · Aug 18" },
  { type: "event", title: "Travel Mixer", location: "Paris", country: "France", rating: 4.6, date: "2026-08-20", distance: 3.0, interests: ["culture"], image: img("1530103862676-de8c9debad1d"), info: "Free · Aug 20" },
  { type: "event", title: "Coffee Crawl", location: "Berlin", country: "Germany", rating: 4.5, date: "2026-08-25", distance: 4.0, price: "$", interests: ["cafes", "food"], image: img("1495474472287-4d71bcdd2085"), info: "$15 · Aug 25" },

  // Deals
  { type: "deal", title: "Lisbon Stay 20% off", location: "Lisbon", country: "Portugal", date: "2026-08-01", distance: 1.0, interests: ["relaxation"], image: img("1555881400-74d7acaacd8b"), info: "Save 20%" },
  { type: "deal", title: "Bali Retreat Deal", location: "Ubud", country: "Indonesia", date: "2026-08-05", distance: 9.0, interests: ["wellness"], image: img("1537996194471-e657df975ab4"), info: "Save 15%" },
  { type: "deal", title: "Paris Dinner 2-for-1", location: "Paris", country: "France", date: "2026-08-10", distance: 2.0, interests: ["food", "wine"], image: img("1414235077428-338989a2e8c0"), info: "2-for-1" },
  { type: "deal", title: "Marrakech Spa 30% off", location: "Marrakech", country: "Morocco", date: "2026-08-15", distance: 5.0, interests: ["wellness", "relaxation"], image: img("1414235077428-338989a2e8c0"), info: "Save 30%" },

  // Members
  { type: "member", title: "Aria K.", location: "Berlin", country: "Germany", interests: ["culture", "food", "photography"], image: img("1494790108377-be9c29b29330"), info: "Travelling to Lisbon · Aug 10" },
  { type: "member", title: "Maya R.", location: "Lisbon", country: "Portugal", interests: ["beach", "yoga", "wellness"], image: img("1438761681033-6461ffad8d80"), info: "Travelling to Bali · Aug 15" },
  { type: "member", title: "Sofia L.", location: "Ubud", country: "Indonesia", interests: ["wellness", "food"], image: img("1534528741775-53994a69daeb"), info: "Travelling to Paris · Sep 1" },
  { type: "member", title: "Nora J.", location: "Paris", country: "France", interests: ["culture", "shopping", "food"], image: img("1517841905240-472988babdf9"), info: "Travelling to Tokyo · Sep 5" },
];