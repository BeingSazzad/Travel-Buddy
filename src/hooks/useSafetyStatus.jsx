import { useCallback, useEffect, useState } from "react";
import { base44 } from "@/api/base44Client";
import { useAuth } from "@/lib/AuthContext";

export function useSafetyStatus() {
  const { isAuthenticated } = useAuth();
  const [blockedByMe, setBlockedByMe] = useState([]);
  const [blockedMe, setBlockedMe] = useState([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    try {
      setLoading(true);
      const res = await base44.functions.invoke("block-status", {});
      setBlockedByMe(res.data?.blockedByMe || []);
      setBlockedMe(res.data?.blockedMe || []);
    } catch (e) {
      setBlockedByMe([]);
      setBlockedMe([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (isAuthenticated) load();
  }, [isAuthenticated, load]);

  const hiddenIds = new Set([...blockedByMe, ...blockedMe]);
  return { blockedByMe, blockedMe, hiddenIds, loading, reload: load };
}