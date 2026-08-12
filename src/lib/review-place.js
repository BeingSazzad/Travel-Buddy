import { CAFES } from '@/lib/cafes';
import { HOTELS } from '@/lib/hotels';
import { RESTAURANTS } from '@/lib/restaurants';
import { pathForSavedItem } from '@/lib/saved-item-key';

function findVenue(type, title) {
  const key = (title || '').toLowerCase().trim();
  if (!key) return null;
  if (type === 'cafe') return CAFES.find((c) => c.name.toLowerCase() === key);
  if (type === 'hotel') return HOTELS.find((h) => h.name.toLowerCase() === key);
  if (type === 'restaurant') return RESTAURANTS.find((r) => r.name.toLowerCase() === key);
  return null;
}

/** Map API review → home list card (correct venue image + location) */
export function reviewToPlaceCard(review) {
  const venue = findVenue(review.item_type, review.item_title);
  const snippet = (review.text || '').trim();
  return {
    type: review.item_type,
    title: review.item_title,
    location: venue?.city || '',
    rating: review.rating,
    reviewSnippet: snippet.length > 72 ? `${snippet.slice(0, 72)}…` : snippet,
    image: review.photos?.[0] || venue?.image || '',
    item_key: review.item_key,
  };
}

export function pathForReview(review) {
  const card = reviewToPlaceCard(review);
  return pathForSavedItem({
    type: card.type,
    title: card.title,
    item_key: review.item_key,
  });
}

/** Demo fallback when Review API empty — images match venue catalog */
export const FALLBACK_RECENT_PLACES = [
  {
    type: 'cafe',
    title: CAFES[0].name,
    location: CAFES[0].city,
    rating: CAFES[0].rating,
    reviewSnippet: 'Perfect morning latte spot',
    image: CAFES[0].image,
  },
  {
    type: 'hotel',
    title: HOTELS.find((h) => h.name === 'Maison du Parc')?.name || HOTELS[7].name,
    location: 'Paris',
    rating: HOTELS.find((h) => h.name === 'Maison du Parc')?.memberRating || 4.8,
    reviewSnippet: 'Quiet garden views',
    image: HOTELS.find((h) => h.name === 'Maison du Parc')?.image || HOTELS[7].image,
  },
  {
    type: 'hotel',
    title: HOTELS.find((h) => h.name === 'Bambu Indah')?.name || 'Bambu Indah',
    location: 'Ubud',
    rating: HOTELS.find((h) => h.name === 'Bambu Indah')?.memberRating || 4.9,
    reviewSnippet: 'Magical jungle stay',
    image: HOTELS.find((h) => h.name === 'Bambu Indah')?.image || HOTELS[5].image,
  },
  {
    type: 'restaurant',
    title: RESTAURANTS.find((r) => r.name === 'Olive & Vine')?.name || RESTAURANTS[5].name,
    location: 'Paris',
    rating: RESTAURANTS.find((r) => r.name === 'Olive & Vine')?.rating || 4.6,
    reviewSnippet: 'Best wine pairing dinner',
    image: RESTAURANTS.find((r) => r.name === 'Olive & Vine')?.image || RESTAURANTS[5].image,
  },
];

export const FALLBACK_REVIEWS = FALLBACK_RECENT_PLACES.map((p, i) => ({
  id: `demo_review_${i}`,
  item_type: p.type,
  item_title: p.title,
  item_key: `${p.type}:${p.title}`,
  rating: p.rating,
  text: p.reviewSnippet,
  author_name: i % 2 === 0 ? "Ava Laurent" : "Isabella Chen",
  created_date: new Date(Date.now() - (i + 1) * 86400000 * 3).toISOString(),
  photos: p.image ? [p.image] : [],
}));

const REVIEW_SNIPPETS = {
  cafe: [
    "Lovely morning stop — easy to linger with a laptop and a good flat white.",
    "Quiet enough to chat, and the staff were kind.",
  ],
  restaurant: [
    "Came here after a long walk. Food was excellent and I felt comfortable dining as a pair.",
    "Would come back for the wine list alone.",
  ],
  hotel: [
    "Felt safe, well located, and easy to rest after a full day out.",
    "Beautiful stay — would book again with another Seluna member.",
  ],
  destination: [
    "Worth the trip. Easy to meet other women travelling the same week.",
    "Loved the pace here — cafés, walks, and a few events nearby.",
  ],
};

/** Demo reviews for a venue page when the Review API is empty */
export function demoReviewsForVenue({ itemKey, itemType, itemTitle }) {
  const matching = FALLBACK_REVIEWS.filter((r) => r.item_key === itemKey);
  if (matching.length) return matching;

  const authors = [
    { name: "Ava Laurent", id: "mock_2" },
    { name: "Isabella Chen", id: "mock_4" },
  ];
  const texts = REVIEW_SNIPPETS[itemType] || REVIEW_SNIPPETS.destination;
  return authors.map((a, i) => ({
    id: `demo_rv_${itemKey}_${i}`,
    item_type: itemType,
    item_title: itemTitle,
    item_key: itemKey,
    rating: i === 0 ? 5 : 4,
    text: texts[i] || texts[0],
    author_name: a.name,
    created_by_id: a.id,
    created_date: new Date(Date.now() - (i + 2) * 86400000 * 4).toISOString(),
    helpful_count: 2 - i,
    photos: [],
  }));
}
