import React, { useState } from "react";
import { Dialog, DialogContent, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

export default function DeleteEventDialog({ open, onOpenChange, event, onConfirm }) {
  const [busy, setBusy] = useState(false);
  const title = event?.title || "this event";
  const going = event?.attendees_count || event?.attendees?.length || 0;

  const confirm = async () => {
    setBusy(true);
    try {
      await onConfirm?.(event);
      onOpenChange?.(false);
    } finally {
      setBusy(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={busy ? undefined : onOpenChange}>
      <DialogContent
        className="max-w-[340px] rounded-3xl p-5 z-[400] border-0 shadow-premium"
        overlayClassName="z-[400]"
      >
        <DialogTitle className="font-display text-lg text-left pr-6">Delete this event?</DialogTitle>
        <DialogDescription className="text-sm leading-relaxed text-left space-y-2">
          <span className="block">
            Are you sure you want to delete <span className="font-semibold text-foreground">“{title}”</span>?
          </span>
          <span className="block">
            {going > 0
              ? `It will be removed for everyone who’s going (${going}). They won’t see it on Going or Discover.`
              : "It will disappear from My events and Discover."}{" "}
            This can’t be undone.
          </span>
        </DialogDescription>
        <div className="flex flex-col gap-2 mt-3">
          <Button
            variant="destructive"
            className="w-full h-11 rounded-2xl"
            onClick={confirm}
            disabled={busy}
          >
            {busy ? "Deleting…" : "Yes, delete event"}
          </Button>
          <Button
            variant="outline"
            className="w-full h-11 rounded-2xl"
            onClick={() => onOpenChange?.(false)}
            disabled={busy}
          >
            Keep event
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
