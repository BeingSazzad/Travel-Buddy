import { dealImageFor } from "@/lib/images";

export const MOCK_DEALS = [
  {
    id: "deal_mock_1",
    title: "Lisbon Stay 20% off",
    partner: "Memmo Alfama",
    category: "hotels",
    image: dealImageFor({ city: "Lisbon", category: "hotels", title: "Lisbon Stay" }),
    discount: "20% off",
    city: "Lisbon",
    country: "Portugal",
    expiration_date: "2026-12-31",
    terms: "Valid for weekday stays booked through Seluna. Show your member code at check-in.",
    code_prefix: "SELUNA",
  },
  {
    id: "deal_mock_2",
    title: "Bali Retreat Deal",
    partner: "Ubud Wellness Lodge",
    category: "hotels",
    image: dealImageFor({ city: "Ubud", category: "hotels", title: "Bali Retreat" }),
    discount: "15% off",
    city: "Ubud",
    country: "Indonesia",
    expiration_date: "2026-11-30",
    terms: "Applies to retreat packages of 3 nights or more.",
    code_prefix: "SELUNA",
  },
  {
    id: "deal_mock_3",
    title: "Paris Dinner 2-for-1",
    partner: "Olive & Vine",
    category: "restaurants",
    image: dealImageFor({ city: "Paris", category: "restaurants", title: "Paris Dinner" }),
    discount: "2-for-1",
    city: "Paris",
    country: "France",
    expiration_date: "2026-10-15",
    terms: "Dine-in only. One redemption per member per month.",
    code_prefix: "SELUNA",
  },
  {
    id: "deal_mock_4",
    title: "Marrakech Spa 30% off",
    partner: "Riad Spa Collective",
    category: "activities",
    image: dealImageFor({ city: "Marrakech", category: "activities", title: "Marrakech Spa" }),
    discount: "30% off",
    city: "Marrakech",
    country: "Morocco",
    expiration_date: "2026-09-30",
    terms: "Valid on hammam and massage treatments.",
    code_prefix: "SELUNA",
  },
];

export function findMockDeal(id) {
  return MOCK_DEALS.find((d) => d.id === id);
}
