import React from "react";
import { Dialog, DialogContent, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

export default function BlockConfirmDialog({
  open,
  onOpenChange,
  name = "this member",
  onConfirm,
}) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="max-w-[340px] rounded-3xl p-5 z-[400] border-0 shadow-premium"
        overlayClassName="z-[400]"
      >
        <DialogTitle className="font-display text-lg text-left">
          Block {name}?
        </DialogTitle>
        <DialogDescription className="text-sm leading-relaxed text-left">
          They won’t be able to message you, and you won’t see each other on Match. You can unblock later in Profile → Blocked members.
        </DialogDescription>
        <div className="flex flex-col gap-2 mt-3">
          <Button
            variant="destructive"
            className="w-full h-11 rounded-2xl"
            onClick={() => {
              onOpenChange?.(false);
              onConfirm?.();
            }}
          >
            Block
          </Button>
          <Button
            variant="outline"
            className="w-full h-11 rounded-2xl"
            onClick={() => onOpenChange?.(false)}
          >
            Cancel
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
