import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Flag, Ban, Loader2 } from "lucide-react";
import SuccessCheck from "@/components/common/SuccessCheck";
import { base44 } from "@/api/base44Client";

export const REPORT_REASONS = [
  { value: "fake_profile", label: "Fake profile" },
  { value: "harassment", label: "Harassment" },
  { value: "inappropriate_content", label: "Inappropriate content" },
  { value: "discrimination", label: "Discrimination" },
  { value: "spam", label: "Spam" },
  { value: "scam", label: "Scam" },
  { value: "safety_concern", label: "Safety concern" },
  { value: "underage", label: "Underage user" },
  { value: "other", label: "Other" },
];

const TYPE_LABEL = {
  profile: "profile",
  message: "conversation",
  event: "event",
  review: "review",
  photo: "photo",
  place: "listing",
};

/**
 * Universal report dialog.
 * target: { type, id, title, ownerId? }
 */
export default function ReportSheet({ open, onOpenChange, target }) {
  const [reason, setReason] = useState("");
  const [explanation, setExplanation] = useState("");
  const [blockToo, setBlockToo] = useState(false);
  const [busy, setBusy] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState("");

  const reset = () => { setReason(""); setExplanation(""); setBlockToo(false); setError(""); setDone(false); };

  const submit = async () => {
    if (!reason) { setError("Please select a reason."); return; }
    setBusy(true);
    setError("");
    try {
      await base44.entities.Report.create({
        reported_type: target.type,
        reported_id: String(target.id),
        reported_title: target.title,
        reported_user_id: target.ownerId || "",
        reason,
        explanation: explanation.trim(),
      });
      if (blockToo && target.ownerId) {
        try {
          await base44.entities.BlockedMember.create({ blocked_user_id: target.ownerId, reason: "block", note: `Reported via ${target.type} report` });
        } catch (e) {}
      }
      setDone(true);
    } catch (e) {
      setError("Could not submit report. Please try again.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(o) => { if (!o) reset(); onOpenChange(o); }}
    >
      <DialogContent className="max-w-sm rounded-3xl">
        {done ? (
          <div className="text-center py-4">
            <SuccessCheck className="mb-3" />
            <p className="font-display font-semibold text-lg">Report submitted</p>
            <p className="text-sm text-muted-foreground mt-1">Our team will review this {TYPE_LABEL[target.type] || "content"} and take action if needed.</p>
            <Button className="w-full h-11 mt-5" onClick={() => onOpenChange(false)}>Done</Button>
          </div>
        ) : (
          <>
            <DialogHeader>
              <DialogTitle className="font-display">Report {TYPE_LABEL[target.type] || "content"}</DialogTitle>
            </DialogHeader>
            <p className="text-sm text-muted-foreground -mt-1 mb-3">
              {target.title ? `“${target.title}”` : ""} Help us keep Seluna safe.
            </p>

            <div className="space-y-2 max-h-[40vh] overflow-y-auto pr-1 -mr-1">
              {REPORT_REASONS.map((r) => (
                <button
                  key={r.value}
                  onClick={() => setReason(r.value)}
                  className={`w-full text-left px-3 py-2.5 rounded-xl border text-sm transition ${reason === r.value ? "border-[#A1846B] bg-[#A1846B]/5" : "border-border"}`}
                >
                  {r.label}
                </button>
              ))}
            </div>

            <textarea
              value={explanation}
              onChange={(e) => setExplanation(e.target.value)}
              placeholder="Add context (optional)"
              rows={3}
              className="w-full rounded-xl border border-border bg-background px-3 py-2 text-sm outline-none resize-none mt-2"
            />

            {target.ownerId && target.type !== "place" && target.type !== "event" && (
              <label className="flex items-center gap-2.5 mt-3 px-1 cursor-pointer">
                <input type="checkbox" checked={blockToo} onChange={(e) => setBlockToo(e.target.checked)} className="accent-[#A1846B]" />
                <span className="text-sm flex items-center gap-1.5"><Ban className="w-3.5 h-3.5 text-muted-foreground" strokeWidth={1.5} /> Also block this member</span>
              </label>
            )}

            {error && <p className="text-xs text-destructive mt-2">{error}</p>}

            <div className="flex gap-2 mt-3">
              <Button variant="outline" className="flex-1" onClick={() => onOpenChange(false)} disabled={busy}>Cancel</Button>
              <Button className="flex-1" onClick={submit} disabled={busy}>
                {busy ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Flag className="w-4 h-4 mr-1.5" strokeWidth={1.5} />} Submit
              </Button>
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}