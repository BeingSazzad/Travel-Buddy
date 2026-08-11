import React, { createContext, useContext, useCallback, useEffect, useState } from "react";
import { base44 } from "@/api/base44Client";
import { useAuth } from "@/lib/AuthContext";

import { useDemoFallbacks } from '@/lib/demo-fallbacks';
import { MOCK_SAVED_ITEMS } from '@/lib/mock-saved';
import { savedItemKey } from '@/lib/saved-item-key';

const SavedContext = createContext(null);

export function SavedProvider({ children }) {
  const { isAuthenticated } = useAuth();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);

  const load = useCallback(async () => {
    try {
      setLoading(true);
      const list = await base44.entities.SavedItem.list("-created_date", 200);
      if (list.length === 0 && useDemoFallbacks) {
        setItems(MOCK_SAVED_ITEMS);
      } else {
        setItems(list);
      }
    } catch (e) {
      setItems([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (isAuthenticated) load();
    else setItems([]);
  }, [isAuthenticated, load]);

  useEffect(() => {
    if (!isAuthenticated) return;
    const unsub = base44.entities.SavedItem.subscribe(() => load());
    return unsub;
  }, [isAuthenticated, load]);

  const isSaved = useCallback(
    (itemKey) => items.some((i) => i.item_key === itemKey),
    [items]
  );

  const toggle = useCallback(
    async (item) => {
      const itemKey = savedItemKey(item);
      if (!itemKey) return;
      const existing = items.find((i) => i.item_key === itemKey);
      try {
        if (existing) {
          await base44.entities.SavedItem.delete(existing.id);
        } else {
          await base44.entities.SavedItem.create({
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
        }
      } catch {
        /* offline */
      }
    },
    [items]
  );

  const remove = useCallback(async (id) => {
    if (String(id).startsWith('mock_saved_')) {
      setItems((prev) => prev.filter((i) => i.id !== id));
      return;
    }
    try {
      await base44.entities.SavedItem.delete(id);
    } catch (e) {
      /* ignore */
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