export function venueGallery(item) {
  const g = (item?.gallery || []).filter(Boolean);
  if (g.length) return g;
  return item?.image ? [item.image] : [];
}

export function formatRating(n) {
  const x = Number(n);
  return Number.isFinite(x) ? x.toFixed(1) : null;
}

export function siteLabel(url) {
  if (!url) return "";
  return String(url).replace(/^https?:\/\//i, "");
}

export async function shareOrCopy({ title, text }) {
  try {
    if (navigator.share) {
      await navigator.share({ title, text, url: window.location.href });
    } else {
      await navigator.clipboard.writeText(window.location.href);
    }
  } catch (e) {
    if (e?.name === "AbortError") return;
  }
}
