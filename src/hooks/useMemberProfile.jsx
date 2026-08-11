import { useEffect, useState } from "react";
import { base44 } from "@/api/base44Client";
import { findMockMember, normalizeMemberData } from "@/lib/member-profile";

function mockProfilePayload(userId) {
  const mock = findMockMember(userId);
  if (!mock) return null;
  return { profile: mock, trips: mock.trip ? [mock.trip] : [] };
}

function hasProfilePayload(data) {
  if (!data) return false;
  const normalized = normalizeMemberData(data);
  const p = normalized?.profile;
  return !!(p?.user_id || p?.id || p?.name || p?.main_photo || p?.avatar);
}

export function useMemberProfile(userId) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    if (!userId) {
      setData(null);
      setLoading(false);
      return;
    }

    let active = true;
    setLoading(true);
    setError(false);

    (async () => {
      const mockPayload = mockProfilePayload(userId);

      try {
        const res = await base44.functions.invoke("member-profile", { user_id: userId });
        if (!active) return;
        if (hasProfilePayload(res?.data)) {
          setData(res.data);
        } else if (mockPayload) {
          setData(mockPayload);
        } else {
          setData(null);
          setError(true);
        }
      } catch {
        if (!active) return;
        if (mockPayload) {
          setData(mockPayload);
        } else {
          setData(null);
          setError(true);
        }
      } finally {
        if (active) setLoading(false);
      }
    })();

    return () => {
      active = false;
    };
  }, [userId]);

  return { data, loading, error };
}
