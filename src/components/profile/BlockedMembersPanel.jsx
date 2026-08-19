import React, { useEffect, useState } from "react";
import { Trash2, ShieldOff } from "lucide-react";
import { FALLBACK_AVATAR_URL } from "@/lib/images";
import { base44 } from "@/api/base44Client";
import { useAuth } from "@/lib/AuthContext";
import { useDemoFallbacks } from "@/lib/demo-fallbacks";
import { findMockMember, getMockBlockedMembers } from "@/lib/member-profile";

export default function BlockedMembersPanel({ embedded = false }) {
  const { user } = useAuth();
  const [blocked, setBlocked] = useState([]);
  const [profiles, setProfiles] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    const demo = useDemoFallbacks ? getMockBlockedMembers() : [];
    base44.entities.BlockedMember.filter({ reason: "block", created_by_id: user.id })
      .then((list) => setBlocked(list?.length ? list : demo))
      .catch(() => setBlocked(demo))
      .finally(() => setLoading(false));
  }, [user]);

  useEffect(() => {
    (async () => {
      const p = {};
      for (const b of blocked) {
        const mock = b.profile || findMockMember(b.blocked_user_id);
        if (mock) {
          p[b.blocked_user_id] = mock;
          continue;
        }
        try {
          const r = await base44.functions.invoke("member-profile", { user_id: b.blocked_user_id });
          p[b.blocked_user_id] = r.data?.profile;
        } catch {
          /* skip */
        }
      }
      setProfiles(p);
    })();
  }, [blocked]);

  const unblock = async (b) => {
    if (String(b.id).startsWith("mock_block_")) {
      setBlocked((arr) => arr.filter((x) => x.id !== b.id));
      return;
    }
    try {
      await base44.entities.BlockedMember.delete(b.id);
      setBlocked((arr) => arr.filter((x) => x.id !== b.id));
    } catch {
      alert("Could not unblock.");
    }
  };

  const content = (
    <>
      {loading ? (
        <p className="text-sm text-muted-foreground">Loading…</p>
      ) : blocked.length === 0 ? (
        <div className="text-center py-6">
          <ShieldOff className="w-7 h-7 text-muted-foreground mx-auto mb-2" strokeWidth={1.5} />
          <p className="font-medium text-sm">No blocked members</p>
          <p className="text-sm text-muted-foreground mt-1">Members you block won&apos;t be able to see or contact you.</p>
        </div>
      ) : (
        <div className="space-y-2">
          {blocked.map((b) => {
            const p = profiles[b.blocked_user_id];
            return (
              <div key={b.id} className="flex items-center gap-3 rounded-xl border border-border/80 p-3">
                <img
                  src={p?.avatar || p?.main_photo || FALLBACK_AVATAR_URL}
                  alt=""
                  className="w-9 h-9 rounded-full object-cover object-top shrink-0"
                />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{p?.name || "Seluna member"}</p>
                  <p className="text-sm text-muted-foreground">
                    {[p?.current_city, p?.country].filter(Boolean).join(", ") || "Blocked"}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => unblock(b)}
                  className="px-3 py-1.5 rounded-full text-sm border border-border flex items-center gap-1 shrink-0 active:bg-muted/40 transition"
                >
                  <Trash2 className="w-3.5 h-3.5" strokeWidth={1.5} /> Unblock
                </button>
              </div>
            );
          })}
        </div>
      )}
    </>
  );

  if (embedded) return content;

  return content;
}
