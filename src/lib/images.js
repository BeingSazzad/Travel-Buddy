/** Curated travel imagery — vibrant, distinct shots for Seluna demo data. */

export function unsplash(id, w = 800, h = null) {
  const dims = h ? `w=${w}&h=${h}&fit=crop` : `w=${w}&fit=crop`;
  return `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&${dims}&q=85`;
}

export const FALLBACK_IMAGE_URL = unsplash("1529156069898-49953e39b3ac");
export const FALLBACK_AVATAR_URL = unsplash("1494790108377-be9c29b29330", 120, 120);

/** @deprecated use unsplash() */
export const img = unsplash;

export function avatar(id) {
  return unsplash(id, 120, 120);
}

function hashString(str) {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = (hash << 5) - hash + str.charCodeAt(i);
    hash |= 0;
  }
  return hash;
}

/** Iconic city / destination hero shots */
export const CITY_IMAGES = {
  lisbon: unsplash("1555881400-74d7acaacd8b"),
  ubud: unsplash("1571898179847-31e72916abf9"),
  bali: unsplash("1537996194471-e657df975ab4"),
  paris: unsplash("1502602898657-3e91760cbb34"),
  copenhagen: unsplash("1513622470522-26c3c8a854bc"),
  marrakech: unsplash("1518546301126-ba859914c723"),
  tokyo: unsplash("1540959733332-eab4deabeeed"),
  berlin: unsplash("1560969184-10fe87293504"),
  oslo: unsplash("1513519245088-0e12902e5a38"),
  norway: unsplash("1513519245088-0e12902e5a38"),
  rome: unsplash("1552832230-c0197dd311b5"),
  london: unsplash("1513635269975-59663e0ac1ad"),
  santorini: unsplash("1570077188670-e3a8d69ac5ff"),
  greece: unsplash("1570077188670-e3a8d69ac5ff"),
  tulum: unsplash("1507525428034-b723cf961d3e"),
  capetown: unsplash("1580060839134-75a5edca2e99"),
  "cape town": unsplash("1580060839134-75a5edca2e99"),
  zermatt: unsplash("1464822759023-fed622ff2c3b"),
  switzerland: unsplash("1464822759023-fed622ff2c3b"),
  mexico: unsplash("1507525428034-b723cf961d3e"),
  seminyak: unsplash("1537996194471-e657df975ab4"),
  canggu: unsplash("1559827260-dc22d96326c0"),
};

export const HERO = {
  welcome: unsplash("1529156069898-49953e39b3ac", 1200),
  profileCover: unsplash("1473496169704-955ba7cf9663", 1200),
  onboardMeet: unsplash("1469474968028-56645f2e2e1f", 900),
  onboardEvents: unsplash("1529156069898-49953e39b3ac", 900),
  onboardPlaces: unsplash("1533105079780-92b9be482077", 900),
  featured: unsplash("1513622470522-26c3c8a854bc", 800),
};

const CAFE_IDS = [
  "1554118811-1e0d58224f24",
  "1495474472287-4d71bcdd2085",
  "1453614512568-c4034dfb0fa0",
  "1501339847302-ac426a1a140d",
  "1555507036-ab1f729fb794",
  "1509043031653-410c6704d36f",
  "1445112258185-0d8f847a4e41",
  "1511927259205-e7b2668bc85a",
  "1501339847302-ac426a1a140d",
  "1559494001-36a1c203f0d2",
  "1517248135467-4c7edcad34c4",
  "1509043031653-410c6704d36f",
];

const RESTAURANT_IDS = [
  "1559339352-11d035aa65de",
  "1476127398349-dffc176d4ffb",
  "1579875727078-63cd943c8a10",
  "1544022613-e87ca75a7a5f",
  "1414235077428-338989a2e8c0",
  "1555939594-58d7cb561ad1",
  "1512621776951-a57141f2eefd",
  "1565299624946-b28f40a0ae38",
  "1552566626-52f8b7c9eb8e",
  "1517248135467-4c7edcad34c4",
  "1555396273-367ea4eb4db5",
  "1540189544336-f22e781fa9a2",
];

const HOTEL_IDS = [
  "1566073771259-6a560657f57b",
  "1540541338287-41700207dee6",
  "1571898179847-31e72916abf9",
  "1551882547-ff40c63fe595",
  "1582719478250-c89cae4dc85b",
  "1520250497591-3fd67d6d7d8f",
  "1564501049412-61c2d30b38d2",
  "1571005380688-ce49a7e97851",
  "1582719507161-0442a29f4472",
  "1566073771259-6a560657f57b",
  "1578683010236-d716f9a95f2d",
  "1520250497591-3fd67d6d7d8f",
];

const EVENT_IDS = {
  yoga: "1544367567-0f2fcb009e68",
  dinner: "1533105079780-92b9be482077",
  wine: "1513364776144-60967b0f800f",
  hiking: "1464822759023-fed622ff2c3b",
  coffee: "1495474472287-4d71bcdd2085",
  mixer: "1529156069898-49953e39b3ac",
  beach: "1502680390469-b7593380ba38",
  wellness: "1545205597-3d9d02c29597",
  santorini: "1570077188670-e3a8d69ac5ff",
  caldera: "1613395875484-2e5c52cdc076",
};

const DEAL_IDS = [
  "1555881400-74d7acaacd8b",
  "1571898179847-31e72916abf9",
  "1504674900245-0877df9cc836",
  "1518546301126-ba859914c723",
  "1414235077428-338989a2e8c0",
  "1540556578150-63d5a2581935",
];

const MEMBER_IDS = {
  clara: {
    main: "1534528741775-53994a69daeb",
    photos: ["1534528741775-53994a69daeb", "1544005313-94ddf0286df2", "1488426862026-3ee34a7d66df"],
  },
  mock_1: {
    main: "1544005313-94ddf0286df2",
    photos: ["1544005313-94ddf0286df2", "1502680390699-9e42c88d3f01", "1529620656603-4bb1d5782a51"],
  },
  mock_2: {
    main: "1534528741775-53994a69daeb",
    photos: ["1534528741775-53994a69daeb", "1524504388940-b1c4a55bb5f5", "1529620656603-4bb1d5782a51"],
  },
  mock_3: {
    main: "1517841905240-472988babdf9",
    photos: ["1517841905240-472988babdf9", "1438761681033-6461ffad8d80", "1524504388940-b1c4a55bb5f5"],
  },
  mock_4: {
    main: "1494790108377-be9c29b29330",
    photos: ["1494790108377-be9c29b29330", "1524504388940-b1c4a55bb5f5", "1534528741775-53994a69daeb"],
  },
  mock_5: {
    main: "1488426862026-3ee34a7d66df",
    photos: ["1488426862026-3ee34a7d66df", "1502680390699-9e42c88d3f01", "1544005313-94ddf0286df2"],
  },
};

export function cafeImage(index = 0, w = 700) {
  return unsplash(CAFE_IDS[index % CAFE_IDS.length], w);
}

export function restaurantImage(index = 0, w = 700) {
  return unsplash(RESTAURANT_IDS[index % RESTAURANT_IDS.length], w);
}

export function hotelImage(index = 0, w = 700) {
  return unsplash(HOTEL_IDS[index % HOTEL_IDS.length], w);
}

export function dealImage(index = 0, w = 700) {
  return unsplash(DEAL_IDS[index % DEAL_IDS.length], w);
}

export function eventImage(key = "coffee", w = 800) {
  const id = EVENT_IDS[key] || EVENT_IDS.coffee;
  return unsplash(id, w);
}

/** Unique gallery URLs from a pool function */
export function galleryFromPool(poolFn, count = 3, start = 0) {
  const out = [];
  const seen = new Set();
  let i = start;
  let guard = 0;
  const max = count * 12;
  while (out.length < count && guard < max) {
    const url = poolFn(i);
    if (!seen.has(url)) {
      seen.add(url);
      out.push(url);
    }
    i += 1;
    guard += 1;
  }
  while (out.length < count) out.push(poolFn(out.length));
  return out;
}

export function memberAvatar(memberId) {
  const m = MEMBER_IDS[memberId];
  return m ? unsplash(m.main, 400, 400) : FALLBACK_AVATAR_URL;
}

export function memberPhotos(memberId) {
  const m = MEMBER_IDS[memberId];
  if (!m) return [FALLBACK_AVATAR_URL];
  return m.photos.map((id) => unsplash(id, 800, 1000));
}

/** Event category → cover image */
export const CATEGORY_EVENT_IMAGES = {
  coffee: eventImage("coffee"),
  brunch: unsplash("1531590892997-c52b3c1e8a6e"),
  dinner: eventImage("dinner"),
  beach: eventImage("beach"),
  nightlife: unsplash("1516455590571-18256e5bb9ff"),
  coworking: unsplash("1497366216548-37526070297c"),
  sightseeing: unsplash("1469854523086-cc02fe5d8800"),
  hiking: eventImage("hiking"),
  shopping: unsplash("1483985988355-763728e1935b"),
  yoga: eventImage("yoga"),
  wellness: eventImage("wellness"),
  wine: eventImage("wine"),
  networking: unsplash("1556761175-5973dc0f32e7"),
};

export function defaultEventImage(cat) {
  return CATEGORY_EVENT_IMAGES[cat] || eventImage("coffee");
}

/** Resolve a city name to a hero image */
export function cityImage(city) {
  const key = (city || "").trim().toLowerCase();
  for (const [k, img] of Object.entries(CITY_IMAGES)) {
    if (key.includes(k)) return img;
  }
  const defaults = [CITY_IMAGES.lisbon, CITY_IMAGES.paris, CITY_IMAGES.bali, FALLBACK_IMAGE_URL];
  return defaults[Math.abs(hashString(key)) % defaults.length];
}

/** Event cover — prefer city context, then category */
export function eventImageFor(event = {}) {
  const city = (event.city || "").toLowerCase();
  if (city.includes("santorini")) return EVENT_IDS.caldera ? eventImage("caldera") : CITY_IMAGES.santorini;
  if (city.includes("lisbon")) return CITY_IMAGES.lisbon;
  if (city.includes("paris")) return CITY_IMAGES.paris;
  if (city.includes("zermatt") || city.includes("switzerland")) return CITY_IMAGES.zermatt;
  if (city.includes("berlin")) return CITY_IMAGES.berlin;
  if (city.includes("bali") || city.includes("ubud")) return CITY_IMAGES.ubud;
  return defaultEventImage(event.category);
}

/** Deal cover — match category and city */
export function dealImageFor(deal = {}) {
  const city = (deal.city || "").toLowerCase();
  const cat = (deal.category || "").toLowerCase();
  if (cat === "restaurants" || cat === "restaurant") return restaurantImage(hashString(deal.title || city) % RESTAURANT_IDS.length);
  if (cat === "hotels" || cat === "hotel") return hotelImage(hashString(deal.title || city) % HOTEL_IDS.length);
  if (city.includes("marrakech")) return CITY_IMAGES.marrakech;
  if (city.includes("lisbon")) return CITY_IMAGES.lisbon;
  if (city.includes("ubud") || city.includes("bali")) return CITY_IMAGES.ubud;
  if (city.includes("paris")) return CITY_IMAGES.paris;
  return dealImage(hashString(deal.title || city) % DEAL_IDS.length);
}

export function fallbackCafe(seed = "") {
  const i = Math.abs(hashString(seed)) % CAFE_IDS.length;
  return {
    image: cafeImage(i, 800),
    gallery: galleryFromPool((idx) => cafeImage(idx, 800), 3, i),
  };
}

export function fallbackRestaurant(seed = "") {
  const i = Math.abs(hashString(seed)) % RESTAURANT_IDS.length;
  return {
    image: restaurantImage(i, 800),
    gallery: galleryFromPool((idx) => restaurantImage(idx, 800), 3, i),
  };
}

export function fallbackHotel(seed = "") {
  const i = Math.abs(hashString(seed)) % HOTEL_IDS.length;
  return {
    image: hotelImage(i, 800),
    gallery: galleryFromPool((idx) => hotelImage(idx, 800), 3, i),
  };
}

export function fallbackDestination(city = "") {
  return { image: cityImage(city) };
}

/** Share sheet trip mocks — saved items live in mock-saved.js */
export const SHARE_MOCK_TRIPS = [
  {
    id: "mock_t1",
    name: "Lisbon Getaway",
    city: "Lisbon",
    country: "Portugal",
    start_date: "2026-08-10",
    end_date: "2026-08-17",
    cover_image: cityImage("Lisbon"),
  },
  {
    id: "mock_t2",
    name: "Bali Retreat",
    city: "Bali",
    country: "Indonesia",
    start_date: "2026-08-20",
    end_date: "2026-08-28",
    cover_image: cityImage("Ubud"),
  },
];
