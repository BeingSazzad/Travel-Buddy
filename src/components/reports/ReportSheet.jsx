import React, { useState, useMemo } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Flag, Ban, Loader2 } from "lucide-react";
import SuccessCheck from "@/components/common/SuccessCheck";
import { base44 } from "@/api/base44Client";

/** Labels for admin + legacy stored reason values */
export const REPORT_REASON_LABELS = {
  fake_profile: "Fake or misleading profile",
  harassment: "Harassment or abuse",
  inappropriate_content: "Inappropriate content",
  spam_scam: "Spam or scam",
  spam: "Spam or scam",
  scam: "Spam or scam",
  discrimination: "Inappropriate content",
  safety_concern: "Safety concern",
  underage: "Safety concern",
  other: "Other",
};

const CORE_REASONS = [
  { value: "harassment", label: "Harassment or abuse" },
  { value: "inappropriate_content", label: "Inappropriate content" },
  { value: "spam_scam", label: "Spam or scam" },
  { value: "safety_concern", label: "Safety concern" },
  { value: "other", label: "Other" },
];

const PROFILE_REASON = { value: "fake_profile", label: "Fake or misleading profile" };

/** Common report reasons shown in UI — 5 core, + fake profile for people/photos */
export function reasonsForReportType(type) {
  if (type === "profile" || type === "photo") {
    return [PROFILE_REASON, ...CORE_REASONS];
  }
  return CORE_REASONS;
}

/** All selectable reasons (admin reference) */
export const REPORT_REASONS = [PROFILE_REASON, ...CORE_REASONS];

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
  const reasonOptions = useMemo(
    () => (target ? reasonsForReportType(target.type) : CORE_REASONS),
    [target]
  );
  const [reason, setReason] = useState("");
  const [explanation, setExplanation] = useState("");
  const [blockToo, setBlockToo] = useState(false);
  const [busy, setBusy] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState("");

  const reset = () => {
    setReason("");
    setExplanation("");
    setBlockToo(false);
    setError("");
    setDone(false);
  };

  if (!target) return null;

  const submit = async () => {
    if (!reason) {
      setError("Please select a reason.");
      return;
    }
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
          await base44.entities.BlockedMember.create({
            blocked_user_id: target.ownerId,
            reason: "block",
            note: `Reported via ${target.type} report`,
          });
        } catch {
          /* ignore */
        }
      }
      setDone(true);
    } catch {
      if (import.meta.env.DEV) {
        setDone(true);
        return;
      }
      setError("Could not submit report. Please try again.");
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
        {done ? (
          <div className="text-center py-4">
            <SuccessCheck className="mb-3" />
            <p className="font-display font-semibold text-lg">Report submitted</p>
            <p className="text-sm text-muted-foreground mt-1">
              Our team will review this {TYPE_LABEL[target.type] || "content"} and take action if needed.
            </p>
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

            <div className="space-y-2">
              {reasonOptions.map((r) => (
                <button
                  key={r.value}
                  type="button"
                  onClick={() => setReason(r.value)}
                  className={`w-full text-left px-3 py-2.5 rounded-xl border text-sm transition ${
                    reason === r.value ? "border-primary bg-primary/5" : "border-border"
                  }`}
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
              className="w-full rounded-xl border border-border bg-background px-3 py-2 text-sm outline-none resize-none mt-3"
            />

            {target.ownerId && target.type !== "place" && target.type !== "event" && (
              <label className="flex items-center gap-2.5 mt-3 px-1 cursor-pointer">
                <input
                  type="checkbox"
                  checked={blockToo}
                  onChange={(e) => setBlockToo(e.target.checked)}
                  className="accent-primary"
                />
                <span className="text-sm flex items-center gap-1.5">
                  <Ban className="w-3.5 h-3.5 text-muted-foreground" strokeWidth={1.5} /> Also block this member
                </span>
              </label>
            )}

            {error && <p className="text-xs text-destructive mt-2">{error}</p>}

            <div className="flex gap-2 mt-4">
              <Button variant="outline" className="flex-1" onClick={() => onOpenChange(false)} disabled={busy}>
                Cancel
              </Button>
              <Button className="flex-1" onClick={submit} disabled={busy}>
                {busy ? (
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                ) : (
                  <Flag className="w-4 h-4 mr-1.5" strokeWidth={1.5} />
                )}
                Submit
              </Button>
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
