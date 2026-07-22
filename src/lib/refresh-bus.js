// Lightweight per-path refresh bus: pages register an async reload fn for their
// route path; the Layout's pull-to-refresh triggers the matching handler.
const handlers = new Map();

export function onRefresh(path, fn) {
  handlers.set(path, fn);
  return () => {
    if (handlers.get(path) === fn) handlers.delete(path);
  };
}

export async function emitRefresh(path) {
  const fn = handlers.get(path);
  if (fn) {
    try {
      await fn();
    } catch (e) {
      /* ignore */
    }
  }
}