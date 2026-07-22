import React, { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Search, Loader2, ShieldAlert, BadgeCheck, Ban } from "lucide-react";
import { base44 } from "@/api/base44Client";
import { useAuth } from "@/lib/AuthContext";
import AdminUserSheet from "@/components/admin/AdminUserSheet";

const displayName = (u) =>
  (u && (u.profile_name || u.first_name)) || (u && u.email ? u.email.split("@")[0] : "User");

const STATUS_STYLE = {
  active: "bg-green-100 text-green-700",
  suspended: "bg-amber-100 text-amber-700",
  banned: "bg-red-100 text-red-700",
};

export default function AdminUsers() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [q, setQ] = useState("");
  const [selected, setSelected] = useState(null);

  const load = useCallback(async () => {
    try {
      const list = await base44.entities.User.list("-created_date", 200);
      setUsers(list);
    } catch (e) {
      setUsers([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (user?.role !== "admin") { setLoading(false); return; }
    load();
  }, [load, user?.role]);

  if (user?.role !== "admin") {
    return (
      <div className="px-5 pt-20 text-center">
        <ShieldAlert className="w-8 h-8 text-muted-foreground mx-auto mb-3" strokeWidth={1.5} />
        <p className="font-display font-semibold">Admins only</p>
      </div>
    );
  }

  const query = q.trim().toLowerCase();
  const filtered = query
    ? users.filter((u) =>
        [displayName(u), u.email, u.current_city, u.country].filter(Boolean).some((s) => s.toLowerCase().includes(query))
      )
    : users;

  const refreshSelected = async () => {
    if (!selected) return;
    const fresh = await base44.entities.User.get(selected.id);
    setSelected(fresh);
    load();
  };

  return (
    <div className="px-5 pt-12 pb-6 min-h-screen">
      <div className="flex items-center gap-3 mb-4">
        <button onClick={() => navigate(-1)} className="w-9 h-9 rounded-full bg-card border border-border flex items-center justify-center">
          <ArrowLeft className="w-4 h-4" strokeWidth={1.5} />
        </button>
        <div>
          <h1 className="font-display font-semibold text-xl">User management</h1>
          <p className="text-xs text-muted-foreground">{users.length} members · admin tools</p>
        </div>
      </div>

      <div className="relative mb-4">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" strokeWidth={1.5} />
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Search by name, email, city…"
          className="w-full h-11 pl-9 pr-3 rounded-full border border-border bg-card text-sm outline-none"
        />
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-16"><Loader2 className="w-5 h-5 text-muted-foreground animate-spin" /></div>
      ) : filtered.length === 0 ? (
        <p className="text-sm text-muted-foreground text-center mt-16">No members found.</p>
      ) : (
        <div className="space-y-2">
          {filtered.map((u) => (
            <button
              key={u.id}
              onClick={() => setSelected(u)}
              className="w-full flex items-center gap-3 p-3 rounded-2xl border border-border bg-card text-left active:scale-[0.99] transition"
            >
              {u.main_photo || (u.profile_photos && u.profile_photos[0]) ? (
                <img src={u.main_photo || u.profile_photos[0]} alt="" className="w-10 h-10 rounded-full object-cover" />
              ) : (
                <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center text-sm font-medium">{displayName(u)[0]}</div>
              )}
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate flex items-center gap-1">
                  {displayName(u)}
                  {u.verified && <BadgeCheck className="w-3.5 h-3.5 text-[#A1846B]" strokeWidth={1.5} />}
                  {u.account_status === "suspended" && <Ban className="w-3.5 h-3.5 text-amber-600" strokeWidth={1.5} />}
                  {u.account_status === "banned" && <Ban className="w-3.5 h-3.5 text-red-600" strokeWidth={1.5} />}
                </p>
                <p className="text-xs text-muted-foreground truncate">{u.email}</p>
              </div>
              <div className="flex flex-col items-end gap-1">
                <span className={`text-[10px] px-2 py-0.5 rounded-full capitalize ${STATUS_STYLE[u.account_status || "active"]}`}>
                  {u.account_status || "active"}
                </span>
                <span className="text-[10px] text-muted-foreground capitalize">{u.subscription_status || "none"}</span>
              </div>
            </button>
          ))}
        </div>
      )}

      <AdminUserSheet
        open={!!selected}
        user={selected}
        onClose={() => setSelected(null)}
        onChanged={refreshSelected}
      />
    </div>
  );
}