import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Flag, Ban } from "lucide-react";
import { base44 } from "@/api/base44Client";
import { REPORT_REASONS } from "@/components/reports/ReportSheet";

export default function SafetySheet({ open, onOpenChange, otherId, otherName, onDone }) {
  const [mode, setMode] = useState(null);
  const [reason, setReason] = useState(REPORT_REASONS[0].value);
  const [note, setNote] = useState("");
  const [busy, setBusy] = useState(false);

  const reset = () => { setMode(null); setReason(REPORT_REASONS[0].value); setNote(""); };

  const submit = async () => {
    try {
      setBusy(true);
      if (mode === "report") {
        await base44.entities.Report.create({
          reported_type: "message",
          reported_id: otherId,
          reported_title: `Conversation with ${otherName}`,
          reported_user_id: otherId,
          reason,
          explanation: note.trim(),
        });
        await base44.entities.BlockedMember.create({ blocked_user_id: otherId, reason: "report", note });
      } else {
        await base44.entities.BlockedMember.create({ blocked_user_id: otherId, reason: "block", note });
      }
      reset();
      onDone();
    } finally {
      setBusy(false);
    }
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(o) => {
        if (!o) reset();
        onOpenChange(o);
      }}
    >
      <DialogContent className="max-w-sm rounded-3xl">
        {!mode ? (
          <>
            <DialogHeader>
              <DialogTitle className="font-display">Stay safe</DialogTitle>
            </DialogHeader>
            <p className="text-sm text-muted-foreground -mt-1 mb-2">Choose an action for {otherName}.</p>
            <div className="space-y-2">
              <button
                onClick={() => setMode("report")}
                className="w-full flex items-center gap-3 p-3 rounded-2xl border border-border hover:bg-muted/40 text-left"
              >
                <Flag className="w-5 h-5 text-[#A1846B]" strokeWidth={1.5} />
                <div>
                  <p className="text-sm font-medium">Report conversation</p>
                  <p className="text-xs text-muted-foreground">Tell us what happened</p>
                </div>
              </button>
              <button
                onClick={() => setMode("block")}
                className="w-full flex items-center gap-3 p-3 rounded-2xl border border-border hover:bg-muted/40 text-left"
              >
                <Ban className="w-5 h-5 text-[#A1846B]" strokeWidth={1.5} />
                <div>
                  <p className="text-sm font-medium">Block user</p>
                  <p className="text-xs text-muted-foreground">Hide this conversation</p>
                </div>
              </button>
            </div>
          </>
        ) : (
          <>
            <DialogHeader>
              <DialogTitle className="font-display">{mode === "report" ? "Report conversation" : "Block user"}</DialogTitle>
            </DialogHeader>
            {mode === "report" && (
              <div className="space-y-2 max-h-[40vh] overflow-y-auto pr-1 -mr-1">
                {REPORT_REASONS.map((r) => (
                  <button
                    key={r.value}
                    onClick={() => setReason(r.value)}
                    className={`w-full text-left px-3 py-2 rounded-xl border text-sm ${reason === r.value ? "border-[#A1846B] bg-[#A1846B]/5" : "border-border"}`}
                  >
                    {r.label}
                  </button>
                ))}
              </div>
            )}
            <textarea
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="Additional details (optional)"
              className="w-full rounded-xl border border-border bg-background px-3 py-2 text-sm outline-none min-h-[80px] resize-none"
            />
            <div className="flex gap-2 mt-2">
              <Button variant="outline" className="flex-1" onClick={() => setMode(null)} disabled={busy}>
                Back
              </Button>
              <Button className="flex-1 bg-foreground text-background" onClick={submit} disabled={busy}>
                {mode === "report" ? "Report" : "Block"}
              </Button>
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}