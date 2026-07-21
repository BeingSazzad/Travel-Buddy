export const EVENT_CATEGORIES = [
  "coffee", "brunch", "dinner", "beach", "nightlife", "coworking",
  "sightseeing", "hiking", "shopping", "yoga", "wellness", "wine", "networking",
];

export const CATEGORY_IMAGES = {
  coffee: "https://images.unsplash.com/photo-1554118811-1e0d58224f24?auto=format&fit=crop&w=800&q=80",
  brunch: "https://images.unsplash.com/photo-1531590892997-c52b3c1e8a6e?auto=format&fit=crop&w=800&q=80",
  dinner: "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?auto=format&fit=crop&w=800&q=80",
  beach: "https://images.unsplash.com/photo-1502680390469-b7593380ba38?auto=format&fit=crop&w=800&q=80",
  nightlife: "https://images.unsplash.com/photo-1516455590571-18256e5bb9ff?auto=format&fit=crop&w=800&q=80",
  coworking: "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=800&q=80",
  sightseeing: "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?auto=format&fit=crop&w=800&q=80",
  hiking: "https://images.unsplash.com/photo-1551632811-561732d1e306?auto=format&fit=crop&w=800&q=80",
  shopping: "https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=800&q=80",
  yoga: "https://images.unsplash.com/photo-1545389336-cf090694435e?auto=format&fit=crop&w=800&q=80",
  wellness: "https://images.unsplash.com/photo-1545205597-3d9d02c29597?auto=format&fit=crop&w=800&q=80",
  wine: "https://images.unsplash.com/photo-1510812434810-52c6415a2d3b?auto=format&fit=crop&w=800&q=80",
  networking: "https://images.unsplash.com/photo-1556761175-5973dc0f32e7?auto=format&fit=crop&w=800&q=80",
};

export const defaultEventImage = (cat) => CATEGORY_IMAGES[cat] || CATEGORY_IMAGES.coffee;

export const capitalize = (s) => (s ? s.charAt(0).toUpperCase() + s.slice(1) : s);

export const fmtEventDate = (d) => {
  if (!d) return "";
  const date = new Date(d + "T00:00:00");
  return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
};