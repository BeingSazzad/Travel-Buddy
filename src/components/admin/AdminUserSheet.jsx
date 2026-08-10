import React, { useState } from "react";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Image } from "@/components/ui/image";
import { Button } from "@/components/ui/button";
import {
  AlertTriangle, Ban, ShieldCheck, RotateCcw, BadgeCheck, Trash2, StickyNote, Flag, Loader2, FlaskConical,
} from "lucide-react";
import { base44 } from "@/api/base44Client";

const displayName = (u) =>
  (u && (u.profile_name || u.first_name)) || (u && u.email ? u.email.split("@")[0] : "User");

const STATUS_STYLE = {
  active: "bg-green-100 text-green-700",
  suspended: "bg-amber-100 text-amber-700",
  banned: "bg-red-100 text-red-700",
};

function Row({ icon: Icon, label, children, danger, onClick, disabled }) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl border text-sm transition ${danger ? "border-destructive/30 text-destructive" : "border-border"} disabled:opacity-50`}
    >
      <Icon className={`w-4 h-4 ${danger ? "text-destructive" : "text-[#A1846B]"}`} strokeWidth={1.5} />
      <span className="flex-1 text-left">{label}</span>
      {children}
    </button>
  );
}

export default function AdminUserSheet({ open, user, onClose, onChanged }) {
  const [busy, setBusy] = useState("");
  const [note, setNote] = useState("");

  if (!user) return null;
  const name = displayName(user);

  const log = (action, detail) =>
    base44.entities.AdminLog.create({ action, target_user_id: user.id, target_user_name: name, detail: detail || "" });

  const run = async (key, fn) => {
    setBusy(key);
    try { await fn(); await log(key); await onChanged(); }
    finally { setBusy(""); }
  };

  const warn = () => run("warn", async () => {
    await base44.entities.User.update(user.id, { warning_count: (user.warning_count || 0) + 1 });
    if (note.trim()) await base44.entities.User.update(user.id, { admin_notes: appendNote(user.admin_notes, note) });
  });

  const setStatus = (status) => run(status, async () => {
    await base44.entities.User.update(user.id, { account_status: status });
  });

  const toggleVerified = () => run("verify", async () => {
    await base44.entities.User.update(user.id, { verified: !user.verified });
  });

  const toggleTestUser = async () => {
    setBusy("test_user");
    try {
      await base44.entities.User.update(user.id, { is_test_user: !user.is_test_user });
      await log("note", `toggled test user access -> ${!user.is_test_user}`);
      await onChanged();
    } finally {
      setBusy("");
    }
  };

  const removePhoto = (ph) => run("remove_photo", async () => {
    const photos = (user.profile_photos || []).filter((p) => p !== ph);
    const patch = { profile_photos: photos };
    if (user.main_photo === ph) patch.main_photo = photos[0] || "";
    await base44.entities.User.update(user.id, patch);
  }, `photo:${ph.slice(-20)}`);

  const removeReview = async (rev) => {
    setBusy("remove_content");
    try {
      await base44.entities.Review.delete(rev.id);
      await log("remove_content", `review:${rev.id}`);
      await onChanged();
    } finally { setBusy(""); }
  };

  const saveNote = () => run("note", async () => {
    await base44.entities.User.update(user.id, { admin_notes: appendNote(user.admin_notes, note) });
    setNote("");
  });

  return (
    <Sheet open={open} onOpenChange={(o) => !o && onClose()}>
      <SheetContent side="bottom" className="rounded-t-3xl max-h-[92vh] overflow-y-auto">
        <SheetHeader>
          <SheetTitle className="font-display text-xl">{name}</SheetTitle>
        </SheetHeader>

        <div className="px-4 pb-8 space-y-4">
          <div className="flex flex-wrap gap-2 text-xs">
            <span className={`px-2 py-0.5 rounded-full capitalize ${STATUS_STYLE[user.account_status || "active"]}`}>
              {user.account_status || "active"}
            </span>
            {user.verified && (
              <span className="px-2 py-0.5 rounded-full bg-[#A1846B]/10 text-[#7a5c44] flex items-center gap-1">
                <BadgeCheck className="w-3 h-3" strokeWidth={1.5} /> Verified
              </span>
            )}
            {user.is_test_user && (
              <span className="px-2 py-0.5 rounded-full bg-amber-100 text-amber-700 flex items-center gap-1">
                <FlaskConical className="w-3 h-3" strokeWidth={1.5} /> Test user
              </span>
            )}
            <span className="px-2 py-0.5 rounded-full bg-muted text-muted-foreground capitalize">
              {user.subscription_status || "none"}
            </span>
            {user.warning_count > 0 && (
              <span className="px-2 py-0.5 rounded-full bg-amber-100 text-amber-700">
                {user.warning_count} warning{user.warning_count > 1 ? "s" : ""}
              </span>
            )}
          </div>

          <div className="text-xs text-muted-foreground space-y-0.5">
            <p>{user.email}</p>
            <p>Joined {new Date(user.created_date).toLocaleDateString()}</p>
            <p>Email verified: {user.is_email_verified ? "yes" : "no"}</p>
            <p>Profile completed: {user.profile_completed ? "yes" : "no"}</p>
            {(user.current_city || user.country) && <p>Location: {[user.current_city, user.country].filter(Boolean).join(", ")}</p>}
          </div>

          {/* Photos */}
          {(user.profile_photos || []).length > 0 && (
            <div>
              <p className="text-xs uppercase tracking-wide text-muted-foreground mb-2">Profile photos</p>
              <div className="flex gap-2 overflow-x-auto no-scrollbar -mx-4 px-4">
                {user.profile_photos.map((ph, i) => (
                  <div key={i} className="relative w-24 h-32 rounded-xl overflow-hidden border border-border shrink-0">
                    <Image src={ph} alt="" fittingType="fill" className="w-full h-full" />
                    <button
                      onClick={() => removePhoto(ph)}
                      disabled={!!busy}
                      className="absolute top-1 right-1 w-6 h-6 rounded-full bg-black/50 backdrop-blur flex items-center justify-center"
                    >
                      <Trash2 className="w-3 h-3 text-white" strokeWidth={1.5} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Admin note input */}
          <div>
            <p className="text-xs uppercase tracking-wide text-muted-foreground mb-2 flex items-center gap-1">
              <StickyNote className="w-3.5 h-3.5" strokeWidth={1.5} /> Internal admin note
            </p>
            <textarea
              value={note}
              onChange={(e) => setNote(e.target.value)}
              rows={2}
              placeholder="Add a note (saved to the user record)"
              className="w-full rounded-xl border border-border bg-background px-3 py-2 text-sm outline-none resize-none"
            />
            <Button variant="outline" size="sm" className="mt-2" onClick={saveNote} disabled={busy === "note" || !note.trim()}>
              {busy === "note" ? <Loader2 className="w-4 h-4 animate-spin" /> : "Save note"}
            </Button>
            {user.admin_notes && (
              <pre className="mt-2 text-xs text-muted-foreground whitespace-pre-wrap bg-muted/40 rounded-xl p-2 max-h-32 overflow-y-auto">{user.admin_notes}</pre>
            )}
          </div>

          {/* Actions */}
          <div className="space-y-2">
            <Row icon={AlertTriangle} label="Warn user" onClick={warn} disabled={!!busy}>
              {busy === "warn" && <Loader2 className="w-4 h-4 animate-spin" />}
            </Row>
            {user.account_status !== "suspended" ? (
              <Row icon={Ban} label="Suspend user" danger onClick={() => setStatus("suspend")} disabled={!!busy} />
            ) : null}
            {user.account_status !== "banned" ? (
              <Row icon={Ban} label="Ban user" danger onClick={() => setStatus("ban")} disabled={!!busy} />
            ) : null}
            {user.account_status !== "active" && (
              <Row icon={RotateCcw} label="Reactivate user" onClick={() => setStatus("reactivate")} disabled={!!busy}>
                {busy === "reactivate" && <Loader2 className="w-4 h-4 animate-spin" />}
              </Row>
            )}
            <Row icon={BadgeCheck} label={user.verified ? "Remove verified badge" : "Mark profile as verified"} onClick={toggleVerified} disabled={!!busy}>
              {busy === "verify" && <Loader2 className="w-4 h-4 animate-spin" />}
            </Row>
            <Row icon={FlaskConical} label={user.is_test_user ? "Remove test user access" : "Grant test user access"} onClick={toggleTestUser} disabled={!!busy}>
              {busy === "test_user" && <Loader2 className="w-4 h-4 animate-spin" />}
            </Row>
          </div>

          {/* Reports against this user */}
          <ReportsBlock userId={user.id} />
          {/* User's reviews (removable content) */}
          <ReviewsBlock userId={user.id} onRemove={removeReview} busy={busy} />
        </div>
      </SheetContent>
    </Sheet>
  );
}

function appendNote(existing, add) {
  const stamp = new Date().toLocaleString();
  const line = `[${stamp}] ${add.trim()}`;
  return existing ? `${existing}\n${line}` : line;
}

function ReportsBlock({ userId }) {
  const [items, setItems] = useState(null);
  React.useEffect(() => {
    let active = true;
    (async () => {
      try {
        const r = await base44.entities.Report.filter({ reported_user_id: userId }, "-created_date", 50);
        if (active) setItems(r);
      } catch { if (active) setItems([]); }
    })();
    return () => { active = false; };
  }, [userId]);
  return (
    <div>
      <p className="text-xs uppercase tracking-wide text-muted-foreground mb-2 flex items-center gap-1">
        <Flag className="w-3.5 h-3.5" strokeWidth={1.5} /> Reports against this user
      </p>
      {!items ? <p className="text-xs text-muted-foreground">Loading…</p> :
       items.length === 0 ? <p className="text-xs text-muted-foreground">None.</p> : (
        <div className="space-y-1.5">
          {items.map((r) => (
            <div key={r.id} className="text-xs rounded-xl border border-border p-2">
              <p className="font-medium capitalize">{r.reason.replace(/_/g, " ")}</p>
              <p className="text-muted-foreground">{r.reported_title}</p>
              <p className="text-[10px] text-muted-foreground mt-0.5">{new Date(r.created_date).toLocaleString()} · {r.status}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function ReviewsBlock({ userId, onRemove, busy }) {
  const [items, setItems] = useState(null);
  React.useEffect(() => {
    let active = true;
    (async () => {
      try {
        const r = await base44.entities.Review.filter({ created_by_id: userId }, "-created_date", 50);
        if (active) setItems(r);
      } catch { if (active) setItems([]); }
    })();
    return () => { active = false; };
  }, [userId]);
  return (
    <div>
      <p className="text-xs uppercase tracking-wide text-muted-foreground mb-2 flex items-center gap-1">
        <ShieldCheck className="w-3.5 h-3.5" strokeWidth={1.5} /> Member reviews (removable content)
      </p>
      {!items ? <p className="text-xs text-muted-foreground">Loading…</p> :
       items.length === 0 ? <p className="text-xs text-muted-foreground">No reviews.</p> : (
        <div className="space-y-1.5">
          {items.map((r) => (
            <div key={r.id} className="text-xs rounded-xl border border-border p-2">
              <p className="font-medium">{r.item_title} · ★{r.rating}</p>
              <p className="text-muted-foreground line-clamp-2">{r.text}</p>
              <button onClick={() => onRemove(r)} disabled={!!busy} className="text-xs text-destructive mt-1 flex items-center gap-1">
                <Trash2 className="w-3 h-3" strokeWidth={1.5} /> Remove review
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}