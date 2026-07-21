const img = (id) => `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=700&q=80`;

export const CAFES = [
  { name: "Café Norden", city: "Copenhagen", country: "Denmark", image: img("1554118811-1e0d58224f24"), rating: 4.9, reviews: 312, price: 3, distance: 0.4, tags: { wifi: true, work: true, outdoor: true, seaView: false, vegan: true, solo: true, wheelchair: true, pet: false } },
  { name: "The Tiny Cup", city: "Lisbon", country: "Portugal", image: img("1453614512568-c4034dfb0fa0"), rating: 4.7, reviews: 184, price: 2, distance: 1.2, tags: { wifi: true, work: false, outdoor: true, seaView: false, vegan: false, solo: true, wheelchair: false, pet: true } },
  { name: "Brew & Bloom", city: "Bali", country: "Indonesia", image: img("1495474472287-4d71bcdd2085"), rating: 4.8, reviews: 221, price: 2, distance: 2.1, tags: { wifi: true, work: true, outdoor: true, seaView: false, vegan: true, solo: true, wheelchair: false, pet: true } },
  { name: "Fabrica Coffee Roasters", city: "Lisbon", country: "Portugal", image: img("1554118811-1e0d58224f24"), rating: 4.6, reviews: 142, price: 2, distance: 0.9, tags: { wifi: true, work: true, outdoor: false, seaView: false, vegan: false, solo: true, wheelchair: true, pet: false } },
  { name: "Democratic Coffee", city: "Copenhagen", country: "Denmark", image: img("1453614512568-c4034dfb0fa0"), rating: 4.7, reviews: 96, price: 2, distance: 0.7, tags: { wifi: true, work: true, outdoor: false, seaView: false, vegan: true, solo: true, wheelchair: true, pet: false } },
  { name: "Seniman Coffee", city: "Bali", country: "Indonesia", image: img("1495474472287-4d71bcdd2085"), rating: 4.8, reviews: 175, price: 2, distance: 1.8, tags: { wifi: true, work: true, outdoor: true, seaView: false, vegan: true, solo: true, wheelchair: false, pet: true } },
  { name: "Café de Flore", city: "Paris", country: "France", image: img("1554118811-1e0d58224f24"), rating: 4.5, reviews: 410, price: 4, distance: 1.5, tags: { wifi: false, work: false, outdoor: true, seaView: false, vegan: false, solo: true, wheelchair: true, pet: false } },
  { name: "Boot Café", city: "Paris", country: "France", image: img("1453614512568-c4034dfb0fa0"), rating: 4.6, reviews: 88, price: 2, distance: 1.1, tags: { wifi: true, work: false, outdoor: true, seaView: false, vegan: true, solo: true, wheelchair: false, pet: true } },
  { name: "Hello, Kristof", city: "Copenhagen", country: "Denmark", image: img("1495474472287-4d71bcdd2085"), rating: 4.8, reviews: 134, price: 3, distance: 0.6, tags: { wifi: true, work: true, outdoor: true, seaView: false, vegan: true, solo: true, wheelchair: true, pet: true } },
  { name: "Seaview Roastery", city: "Cape Town", country: "South Africa", image: img("1554118811-1e0d58224f24"), rating: 4.7, reviews: 109, price: 3, distance: 3.2, tags: { wifi: true, work: true, outdoor: true, seaView: true, vegan: true, solo: true, wheelchair: true, pet: true } },
];

export const CAFE_TAG_FILTERS = [
  { key: "wifi", label: "Wi-Fi" },
  { key: "work", label: "Work-friendly" },
  { key: "outdoor", label: "Outdoor seating" },
  { key: "seaView", label: "Sea view" },
  { key: "vegan", label: "Vegan options" },
  { key: "solo", label: "Solo-friendly" },
  { key: "wheelchair", label: "Wheelchair accessible" },
  { key: "pet", label: "Pet friendly" },
];

export const PRICE_LABELS = { 1: "€", 2: "€€", 3: "€€€", 4: "€€€€" };