import React, { useEffect, useState, useCallback } from "react";
import { base44 } from "@/api/base44Client";
import AdminUserSheet from "@/components/admin/AdminUserSheet";
import { SectionHeader, SearchBar, ListState } from "@/components/admin/AdminUI";
import { BadgeCheck, Ban } from "lucide-react";

const displayName = (u) =>
  (u && (u.profile_name || u.first_name)) || (u && u.email ? u.email.split("@")[0] : "User");

const STATUS_STYLE = {
  active: "bg-green-100 text-green-700",
  suspended: "bg-amber-100 text-amber-700",
  banned: "bg-red-100 text-red-700",
};

export default function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [q, setQ] = useState("");
  const [selected, setSelected] = useState(null);

  const load = useCallback(async () => {
    try {
      const list = await base44.entities.User.list("-created_date", 500);
      setUsers(list);
    } catch (e) {
      setUsers([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

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
    <div>
      <SectionHeader title="Users" subtitle={`${users.length} members · manage accounts`} />
      <SearchBar value={q} onChange={setQ} placeholder="Search by name, email, city…" />
      <ListState loading={loading} empty={filtered.length === 0} emptyText="No members found.">
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
                  {u.verified && <BadgeCheck className="w-3.5 h-3.5 text-primary" strokeWidth={1.5} />}
                  {(u.account_status === "suspended" || u.account_status === "banned") && <Ban className="w-3.5 h-3.5 text-red-600" strokeWidth={1.5} />}
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
      </ListState>

      <AdminUserSheet open={!!selected} user={selected} onClose={() => setSelected(null)} onChanged={refreshSelected} />
    </div>
  );
}