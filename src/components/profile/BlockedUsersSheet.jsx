import React, { useEffect, useState } from "react";
import { Trash2, ShieldOff, UserCircle2 } from "lucide-react";
import { base44 } from "@/api/base44Client";
import { useAuth } from "@/lib/AuthContext";
import ProfileSheet from "@/components/profile/ProfileSheet";

export default function BlockedUsersSheet({ onClose }) {
  const { user } = useAuth();
  const [blocked, setBlocked] = useState([]);
  const [profiles, setProfiles] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    base44.entities.BlockedMember.filter({ reason: "block", created_by_id: user.id })
      .then(setBlocked).catch(() => {}).finally(() => setLoading(false));
  }, [user]);

  useEffect(() => {
    (async () => {
      const p = {};
      for (const b of blocked) {
        try { const r = await base44.functions.invoke("member-profile", { user_id: b.blocked_user_id }); p[b.blocked_user_id] = r.data?.profile; } catch (e) {}
      }
      setProfiles(p);
    })();
  }, [blocked]);

  const unblock = async (b) => {
    try { await base44.entities.BlockedMember.delete(b.id); setBlocked((arr) => arr.filter((x) => x.id !== b.id)); }
    catch (e) { alert("Could not unblock."); }
  };

  return (
    <ProfileSheet title="Blocked users" onClose={onClose}>
      {loading ? (
        <p className="text-sm text-muted-foreground">Loading…</p>
      ) : blocked.length === 0 ? (
        <div className="text-center py-10">
          <ShieldOff className="w-8 h-8 text-muted-foreground mx-auto mb-2" strokeWidth={1.5} />
          <p className="font-medium text-sm">No blocked members</p>
          <p className="text-xs text-muted-foreground mt-1">Members you block won't be able to see or contact you.</p>
        </div>
      ) : (
        <div className="space-y-2">
          {blocked.map((b) => {
            const p = profiles[b.blocked_user_id];
            return (
              <div key={b.id} className="flex items-center gap-3 bg-card border border-border rounded-2xl p-3">
                {p?.avatar ? <img src={p.avatar} alt="" className="w-9 h-9 rounded-full object-cover" /> : <UserCircle2 className="w-9 h-9 text-muted-foreground" />}
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{p?.name || "Seluna member"}</p>
                  <p className="text-xs text-muted-foreground truncate">Blocked</p>
                </div>
                <button onClick={() => unblock(b)} className="px-3 py-1.5 rounded-full text-xs border border-border flex items-center gap-1">
                  <Trash2 className="w-3.5 h-3.5" strokeWidth={1.5} /> Unblock
                </button>
              </div>
            );
          })}
        </div>
      )}
    </ProfileSheet>
  );
}