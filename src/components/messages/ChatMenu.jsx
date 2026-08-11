import React, { useState } from "react";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { User, Flag, Ban, UserMinus, Trash2, ChevronLeft } from "lucide-react";
import { base44 } from "@/api/base44Client";
import { useAuth } from "@/lib/AuthContext";

import { reasonsForReportType } from "@/components/reports/ReportSheet";

const CHAT_REPORT_REASONS = reasonsForReportType("profile").map((r) => r.label);

export default function ChatMenu({ open, onOpenChange, otherId, otherName, matchId, conversationId, onViewProfile, onDone }) {
  const { user } = useAuth();
  const [view, setView] = useState("menu");
  const [reason, setReason] = useState(CHAT_REPORT_REASONS[0]);
  const [note, setNote] = useState("");
  const [busy, setBusy] = useState(false);

  const reset = () => { setView("menu"); setReason(CHAT_REPORT_REASONS[0]); setNote(""); };

  const close = () => { reset(); onOpenChange(false); };

  const doReport = async () => {
    try {
      setBusy(true);
      await base44.entities.BlockedMember.create({
        blocked_user_id: otherId,
        reason: "report",
        note: `${reason}${note ? ": " + note : ""}`,
      });
      onDone();
    } finally { setBusy(false); }
  };

  const doBlock = async () => {
    try {
      setBusy(true);
      await base44.entities.BlockedMember.create({ blocked_user_id: otherId, reason: "block", note });
      onDone();
    } finally { setBusy(false); }
  };

  const doUnmatch = async () => {
    if (!window.confirm(`Unmatch with ${otherName}?`)) return;
    try {
      setBusy(true);
      if (matchId) await base44.entities.Match.delete(matchId).catch(() => {});
      onDone();
    } finally { setBusy(false); }
  };

  const doDelete = async () => {
    if (!window.confirm("Delete this conversation?")) return;
    try {
      setBusy(true);
      const conv = await base44.entities.Conversation.get(conversationId);
      const hidden = Array.isArray(conv.hidden_for) ? conv.hidden_for : [];
      if (!hidden.includes(user?.id)) {
        await base44.entities.Conversation.update(conversationId, { hidden_for: [...hidden, user.id] });
      }
      onDone();
    } finally { setBusy(false); }
  };

  return (
    <Sheet open={open} onOpenChange={(o) => { if (!o) reset(); onOpenChange(o); }}>
      <SheetContent side="bottom" className="rounded-t-3xl pb-6">
        <SheetHeader>
          <SheetTitle className="font-display">
            {view === "menu" ? "Safety & options" : view === "report" ? "Report user" : "Block user"}
          </SheetTitle>
        </SheetHeader>

        {view === "menu" && (
          <div className="px-4 mt-2 space-y-1">
            <button onClick={() => { close(); onViewProfile?.(otherId); }} className="w-full flex items-center gap-3 p-3 rounded-2xl hover:bg-muted/40 text-left">
              <User className="w-5 h-5 text-muted-foreground" strokeWidth={1.5} />
              <span className="text-sm">View profile</span>
            </button>
            <button onClick={() => setView("report")} className="w-full flex items-center gap-3 p-3 rounded-2xl hover:bg-muted/40 text-left">
              <Flag className="w-5 h-5 text-primary" strokeWidth={1.5} />
              <div><p className="text-sm">Report user</p><p className="text-xs text-muted-foreground">Send to admin review</p></div>
            </button>
            <button onClick={() => setView("block")} className="w-full flex items-center gap-3 p-3 rounded-2xl hover:bg-muted/40 text-left">
              <Ban className="w-5 h-5 text-primary" strokeWidth={1.5} />
              <div><p className="text-sm">Block user</p><p className="text-xs text-muted-foreground">Hide conversation, stop messages</p></div>
            </button>
            <button onClick={doUnmatch} disabled={busy} className="w-full flex items-center gap-3 p-3 rounded-2xl hover:bg-muted/40 text-left disabled:opacity-50">
              <UserMinus className="w-5 h-5 text-muted-foreground" strokeWidth={2} />
              <span className="text-sm">Remove connection</span>
            </button>
            <button onClick={doDelete} disabled={busy} className="w-full flex items-center gap-3 p-3 rounded-2xl hover:bg-muted/40 text-left disabled:opacity-50">
              <Trash2 className="w-5 h-5 text-muted-foreground" strokeWidth={1.5} />
              <span className="text-sm">Delete conversation</span>
            </button>
          </div>
        )}

        {view === "report" && (
          <div className="px-4 mt-2 space-y-2">
            <div className="space-y-2">
              {CHAT_REPORT_REASONS.map((r) => (
                <button key={r} onClick={() => setReason(r)} className={`w-full text-left px-3 py-2 rounded-xl border text-sm ${reason === r ? "border-primary bg-primary/5" : "border-border"}`}>
                  {r}
                </button>
              ))}
            </div>
            <textarea value={note} onChange={(e) => setNote(e.target.value)} placeholder="Additional details (optional)" className="w-full rounded-xl border border-border bg-background px-3 py-2 text-sm outline-none min-h-[80px] resize-none" />
            <div className="flex gap-2 pt-1">
              <Button variant="outline" className="flex-1" onClick={() => setView("menu")} disabled={busy}><ChevronLeft className="w-4 h-4" /> Back</Button>
              <Button className="flex-1" onClick={doReport} disabled={busy}>Report</Button>
            </div>
          </div>
        )}

        {view === "block" && (
          <div className="px-4 mt-2 space-y-3">
            <p className="text-sm text-muted-foreground">{otherName} won't be notified. You won't see each other's profiles or be able to message.</p>
            <textarea value={note} onChange={(e) => setNote(e.target.value)} placeholder="Reason (optional)" className="w-full rounded-xl border border-border bg-background px-3 py-2 text-sm outline-none min-h-[64px] resize-none" />
            <div className="flex gap-2">
              <Button variant="outline" className="flex-1" onClick={() => setView("menu")} disabled={busy}><ChevronLeft className="w-4 h-4" /> Back</Button>
              <Button variant="outline" className="flex-1" onClick={doBlock} disabled={busy}>Block</Button>
            </div>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
}