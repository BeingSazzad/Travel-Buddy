import {
  CITY_IMAGES,
  unsplash,
  cafeImage,
  restaurantImage,
  hotelImage,
  dealImage,
  eventImage,
  memberAvatar,
  avatar,
} from "@/lib/images";

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

export const SEARCH_CORPUS = [
  // Cities
  { type: "city", title: "Copenhagen", location: "Copenhagen", country: "Denmark", rating: 4.8, interests: ["culture", "food", "shopping"], image: CITY_IMAGES.copenhagen, info: "Capital of Denmark" },
  { type: "city", title: "Lisbon", location: "Lisbon", country: "Portugal", rating: 4.7, interests: ["beach", "food", "culture"], image: CITY_IMAGES.lisbon, info: "Coastal capital" },
  { type: "city", title: "Paris", location: "Paris", country: "France", rating: 4.9, interests: ["culture", "food", "shopping"], image: CITY_IMAGES.paris, info: "City of Light" },
  { type: "city", title: "Berlin", location: "Berlin", country: "Germany", rating: 4.6, interests: ["culture", "nightlife", "food"], image: CITY_IMAGES.berlin, info: "Creative hub" },
  { type: "city", title: "Marrakech", location: "Marrakech", country: "Morocco", rating: 4.7, interests: ["culture", "food", "shopping"], image: CITY_IMAGES.marrakech, info: "Red city" },

  // Countries
  { type: "country", title: "Denmark", location: "Denmark", country: "Denmark", rating: 4.8, interests: ["culture", "food"], image: CITY_IMAGES.copenhagen, info: "Scandinavia" },
  { type: "country", title: "Portugal", location: "Portugal", country: "Portugal", rating: 4.7, interests: ["beach", "food", "culture"], image: CITY_IMAGES.lisbon, info: "Iberian coast" },
  { type: "country", title: "France", location: "France", country: "France", rating: 4.9, interests: ["culture", "food", "wine"], image: CITY_IMAGES.paris, info: "Western Europe" },
  { type: "country", title: "Indonesia", location: "Indonesia", country: "Indonesia", rating: 4.8, interests: ["beach", "wellness", "adventure"], image: CITY_IMAGES.bali, info: "Tropical isles" },
  { type: "country", title: "Morocco", location: "Morocco", country: "Morocco", rating: 4.6, interests: ["culture", "food", "shopping"], image: CITY_IMAGES.marrakech, info: "North Africa" },

  // Destinations
  { type: "destination", title: "Ubud, Bali", location: "Ubud", country: "Indonesia", rating: 4.9, interests: ["wellness", "yoga", "relaxation"], image: CITY_IMAGES.ubud, info: "Jungle retreats" },
  { type: "destination", title: "Lisbon Coast", location: "Lisbon", country: "Portugal", rating: 4.7, interests: ["beach", "food", "relaxation"], image: CITY_IMAGES.lisbon, info: "Sunset coastline" },
  { type: "destination", title: "Marrakech Medina", location: "Marrakech", country: "Morocco", rating: 4.6, interests: ["culture", "shopping", "food"], image: CITY_IMAGES.marrakech, info: "Historic souks" },
  { type: "destination", title: "Copenhagen Castles", location: "Copenhagen", country: "Denmark", rating: 4.8, interests: ["culture", "photography"], image: CITY_IMAGES.copenhagen, info: "Royal history" },

  // Cafes
  { type: "cafe", title: "Café Norden", location: "Copenhagen", country: "Denmark", rating: 4.9, price: "$$", distance: 1.2, interests: ["cafes", "food"], image: cafeImage(0), info: "Cozy central café" },
  { type: "cafe", title: "The Tiny Cup", location: "Lisbon", country: "Portugal", rating: 4.6, price: "$", distance: 3.4, interests: ["cafes"], image: cafeImage(1), info: "Specialty coffee" },
  { type: "cafe", title: "Brew & Bloom", location: "Bali", country: "Indonesia", rating: 4.8, price: "$$", distance: 8.0, interests: ["cafes", "wellness"], image: cafeImage(2), info: "Garden café" },
  { type: "cafe", title: "Olive & Bean", location: "Paris", country: "France", rating: 4.5, price: "$$", distance: 2.0, interests: ["cafes", "food"], image: cafeImage(3), info: "French roastery" },

  // Restaurants
  { type: "restaurant", title: "Olive & Vine", location: "Paris", country: "France", rating: 4.7, price: "$$$", distance: 1.8, interests: ["food", "wine"], image: restaurantImage(0), info: "Fine dining" },
  { type: "restaurant", title: "Saffron Table", location: "Marrakech", country: "Morocco", rating: 4.6, price: "$$", distance: 5.2, interests: ["food", "culture"], image: restaurantImage(3), info: "Moroccan cuisine" },
  { type: "restaurant", title: "Harbor Light", location: "Copenhagen", country: "Denmark", rating: 4.8, price: "$$$", distance: 2.5, interests: ["food"], image: restaurantImage(1), info: "Seaside dining" },
  { type: "restaurant", title: "Bali Spice", location: "Ubud", country: "Indonesia", rating: 4.5, price: "$$", distance: 7.0, interests: ["food"], image: restaurantImage(5), info: "Local flavors" },

  // Hotels
  { type: "hotel", title: "Memmo Alfama", location: "Lisbon", country: "Portugal", rating: 4.8, price: "$$$", distance: 1.0, interests: ["relaxation"], image: hotelImage(0), info: "Boutique stay" },
  { type: "hotel", title: "Maison du Parc", location: "Paris", country: "France", rating: 4.8, price: "$$$", distance: 3.0, interests: ["relaxation", "culture"], image: hotelImage(3), info: "Boutique hotel" },
  { type: "hotel", title: "Bambu Indah", location: "Bali", country: "Indonesia", rating: 4.9, price: "$$", distance: 9.0, interests: ["wellness", "relaxation"], image: hotelImage(2), info: "Jungle villa" },
  { type: "hotel", title: "Hotel Sanders", location: "Copenhagen", country: "Denmark", rating: 4.6, price: "$$", distance: 1.5, interests: ["culture"], image: hotelImage(1), info: "Central rooms" },

  // Events
  { type: "event", eventId: "event_mock_1", title: "Sunset Yoga", location: "Santorini", country: "Greece", rating: 4.8, date: "2026-08-12", distance: 1.0, interests: ["yoga", "wellness"], image: eventImage("yoga"), info: "Free · Aug 12" },
  { type: "event", eventId: "event_mock_3", title: "Wine & Paint", location: "Lisbon", country: "Portugal", rating: 4.7, date: "2026-08-18", distance: 2.0, price: "$$", interests: ["wine", "culture"], image: eventImage("wine"), info: "$25 · Aug 18" },
  { type: "event", eventId: "event_mock_2", title: "Travel Mixer", location: "Paris", country: "France", rating: 4.6, date: "2026-08-20", distance: 3.0, interests: ["culture"], image: eventImage("mixer"), info: "Free · Aug 20" },
  { type: "event", eventId: "event_mock_4", title: "Coffee Crawl", location: "Berlin", country: "Germany", rating: 4.5, date: "2026-08-25", distance: 4.0, price: "$", interests: ["cafes", "food"], image: eventImage("coffee"), info: "$15 · Aug 25" },

  // Deals
  { type: "deal", dealId: "deal_mock_1", title: "Lisbon Stay 20% off", location: "Lisbon", country: "Portugal", date: "2026-08-01", distance: 1.0, interests: ["relaxation"], image: dealImage(0), info: "Save 20%" },
  { type: "deal", dealId: "deal_mock_2", title: "Bali Retreat Deal", location: "Ubud", country: "Indonesia", date: "2026-08-05", distance: 9.0, interests: ["wellness"], image: dealImage(1), info: "Save 15%" },
  { type: "deal", dealId: "deal_mock_3", title: "Paris Dinner 2-for-1", location: "Paris", country: "France", date: "2026-08-10", distance: 2.0, interests: ["food", "wine"], image: dealImage(2), info: "2-for-1" },
  { type: "deal", dealId: "deal_mock_4", title: "Marrakech Spa 30% off", location: "Marrakech", country: "Morocco", date: "2026-08-15", distance: 5.0, interests: ["wellness", "relaxation"], image: dealImage(3), info: "Save 30%" },

  // Members
  { type: "member", memberId: "mock_4", title: "Isabella Chen", location: "Berlin", country: "Germany", interests: ["culture", "food", "photography"], image: memberAvatar("mock_4"), info: "Travelling to Paris · Sep 2" },
  { type: "member", memberId: "mock_1", title: "Maya Rivera", location: "London", country: "UK", interests: ["beach", "yoga", "wellness"], image: memberAvatar("mock_1"), info: "Travelling to Bali · Aug 15" },
  { type: "member", memberId: "mock_2", title: "Ava Laurent", location: "New York", country: "USA", interests: ["wellness", "food"], image: memberAvatar("mock_2"), info: "Travelling to Lisbon · Aug 10" },
  { type: "member", memberId: "mock_3", title: "Sophie Martin", location: "Paris", country: "France", interests: ["culture", "shopping", "food"], image: memberAvatar("mock_3"), info: "Travelling to Santorini · Aug 12" },
];
