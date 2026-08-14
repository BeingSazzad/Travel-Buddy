import React, { createContext, useContext, useCallback, useEffect, useState } from "react";
import { base44 } from "@/api/base44Client";
import { useAuth } from "@/lib/AuthContext";
import { useDemoFallbacks } from "@/lib/demo-fallbacks";
import { MOCK_SAVED_ITEMS } from "@/lib/mock-saved";
import { savedItemKey } from "@/lib/saved-item-key";

const SavedContext = createContext(null);
const STORAGE_KEY = "seluna_saved_items";

function readLocal() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

function writeLocal(items) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  } catch {
    /* quota */
  }
}

function isRemoteId(id) {
  if (!id) return false;
  const s = String(id);
  return !s.startsWith("mock_saved_") && !s.startsWith("local_saved_");
}

export function SavedProvider({ children }) {
  const { isAuthenticated } = useAuth();
  const [items, setItems] = useState(() => readLocal() || []);
  const [loading, setLoading] = useState(false);

  const load = useCallback(async () => {
    const local = readLocal();
    try {
      setLoading(true);
      const list = await base44.entities.SavedItem.list("-created_date", 200);
      if (Array.isArray(list) && list.length > 0) {
        setItems(list);
        writeLocal(list);
      } else if (local?.length) {
        setItems(local);
      } else if (useDemoFallbacks) {
        setItems(MOCK_SAVED_ITEMS);
        writeLocal(MOCK_SAVED_ITEMS);
      } else {
        setItems([]);
      }
    } catch {
      if (local?.length) setItems(local);
      else setItems(useDemoFallbacks ? MOCK_SAVED_ITEMS : []);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (isAuthenticated) load();
    else {
      const local = readLocal();
      setItems(local?.length ? local : useDemoFallbacks ? MOCK_SAVED_ITEMS : []);
    }
  }, [isAuthenticated, load]);

  const isSaved = useCallback(
    (itemKey) => Boolean(itemKey) && items.some((i) => i.item_key === itemKey),
    [items]
  );

  const toggle = useCallback(async (item) => {
    const itemKey = savedItemKey(item);
    if (!itemKey) return;

    const existing = items.find((i) => i.item_key === itemKey);

    if (existing) {
      setItems((prev) => {
        const next = prev.filter((i) => i.item_key !== itemKey);
        writeLocal(next);
        return next;
      });
      if (isRemoteId(existing.id)) {
        try {
          await base44.entities.SavedItem.delete(existing.id);
        } catch {
          /* keep local unsaved */
        }
      }
      return;
    }

    const optimistic = {
      id: `local_saved_${Date.now()}`,
      item_key: itemKey,
      type: item.type,
      title: item.title,
      location: item.location || "",
      country: item.country || "",
      image: item.image || "",
      info: item.info || "",
      rating: item.rating ?? null,
      price: item.price || "",
      date: item.date || "",
      distance: item.distance ?? null,
      interests: item.interests || [],
    };

    setItems((prev) => {
      const next = [optimistic, ...prev];
      writeLocal(next);
      return next;
    });

    try {
      const created = await base44.entities.SavedItem.create({
        item_key: itemKey,
        type: item.type,
        title: item.title,
        location: item.location || "",
        country: item.country || "",
        image: item.image || "",
        info: item.info || "",
        rating: item.rating ?? null,
        price: item.price || "",
        date: item.date || "",
        distance: item.distance ?? null,
        interests: item.interests || [],
      });
      if (created?.id) {
        setItems((prev) => {
          const next = prev.map((i) => (i.id === optimistic.id ? { ...optimistic, ...created, item_key: itemKey } : i));
          writeLocal(next);
          return next;
        });
      }
    } catch {
      /* optimistic local save stays */
    }
  }, [items]);

  const remove = useCallback(async (id) => {
    setItems((prev) => {
      const next = prev.filter((i) => i.id !== id);
      writeLocal(next);
      return next;
    });
    if (isRemoteId(id)) {
      try {
        await base44.entities.SavedItem.delete(id);
      } catch {
        /* ignore */
      }
    }
  }, []);

  return (
    <SavedContext.Provider value={{ items, loading, isSaved, toggle, remove }}>
      {children}
    </SavedContext.Provider>
  );
}

export function useSaved() {
  const ctx = useContext(SavedContext);
  if (!ctx) return { items: [], loading: false, isSaved: () => false, toggle: () => {}, remove: () => {} };
  return ctx;
}
