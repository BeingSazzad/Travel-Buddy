/** Verified Unsplash URLs — broken ids removed (1517248135467, 1529636798458). */

export const FALLBACK_IMAGE_URL =
  "https://images.unsplash.com/photo-1555881400-74d7acaacd8b?auto=format&fit=crop&w=800&q=80";

export const FALLBACK_AVATAR_URL =
  "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=120&q=80";

export function unsplash(id, w = 800) {
  return `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=${w}&q=80`;
}

/** @deprecated use unsplash() — keeps legacy img(id) call sites working */
export const img = unsplash;
