/**
 * Stable keys for saved items — prefer entity id over title.
 */
export function savedItemKey(item) {
  if (item?.item_key) return item.item_key;
  if (item?.type === "event" && item.eventId) return `event:${item.eventId}`;
  if (item?.type === "deal" && item.dealId) return `deal:${item.dealId}`;
  if (item?.id) return `${item.type}:${item.id}`;
  if (item?.type && item?.title) return `${item.type}:${item.title}`;
  return "";
}

export function pathForSavedItem(item) {
  const key = item.item_key || savedItemKey(item);
  if (key.startsWith("event:")) return `/events/${key.slice(6)}`;
  if (key.startsWith("deal:")) return `/deals/${key.slice(5)}`;
  const enc = encodeURIComponent(item.title);
  if (item.type === "cafe") return `/cafes/${enc}`;
  if (item.type === "restaurant") return `/restaurants/${enc}`;
  if (item.type === "hotel") return `/hotels/${enc}`;
  if (item.type === "destination") {
    return `/destinations/${encodeURIComponent(item.location || item.title)}`;
  }
  if (item.type === "event") return "/events";
  if (item.type === "deal") return "/deals";
  return null;
}
