import React, { useState } from "react";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { User, MessageCircle, UserMinus, Ban, Loader2 } from "lucide-react";

export default function FriendActionsSheet({
  open,
  onOpenChange,
  friend,
  onViewProfile,
  onMessage,
  onRemove,
  onBlock,
}) {
  const [busy, setBusy] = useState(false);

  if (!friend) return null;

  const run = async (fn) => {
    setBusy(true);
    try {
      await fn();
      onOpenChange(false);
    } finally {
      setBusy(false);
    }
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="bottom" className="rounded-t-3xl pb-6">
        <SheetHeader>
          <SheetTitle className="font-display text-left">{friend.name}</SheetTitle>
        </SheetHeader>
        <div className="px-4 mt-2 space-y-1">
          <button
            type="button"
            disabled={busy}
            onClick={() => run(() => onViewProfile?.(friend))}
            className="w-full flex items-center gap-3 p-3 rounded-2xl hover:bg-muted/40 text-left disabled:opacity-50"
          >
            <User className="w-5 h-5 text-muted-foreground" strokeWidth={1.5} />
            <span className="text-sm">View profile</span>
          </button>
          <button
            type="button"
            disabled={busy}
            onClick={() => run(() => onMessage?.(friend))}
            className="w-full flex items-center gap-3 p-3 rounded-2xl hover:bg-muted/40 text-left disabled:opacity-50"
          >
            <MessageCircle className="w-5 h-5 text-primary" strokeWidth={1.5} />
            <span className="text-sm">Message</span>
          </button>
          <button
            type="button"
            disabled={busy}
            onClick={() => {
              if (!window.confirm(`Remove ${friend.name} from your friends? You can connect again on Match.`)) return;
              run(() => onRemove?.(friend));
            }}
            className="w-full flex items-center gap-3 p-3 rounded-2xl hover:bg-muted/40 text-left disabled:opacity-50"
          >
            <UserMinus className="w-5 h-5 text-muted-foreground" strokeWidth={1.5} />
            <div>
              <p className="text-sm">Remove friend</p>
              <p className="text-xs text-muted-foreground">Unmatch — stops showing as connected</p>
            </div>
          </button>
          <button
            type="button"
            disabled={busy}
            onClick={() => {
              if (!window.confirm(`Block ${friend.name}? They won't be able to contact you.`)) return;
              run(() => onBlock?.(friend));
            }}
            className="w-full flex items-center gap-3 p-3 rounded-2xl hover:bg-muted/40 text-left disabled:opacity-50"
          >
            <Ban className="w-5 h-5 text-primary" strokeWidth={1.5} />
            <div>
              <p className="text-sm">Block</p>
              <p className="text-xs text-muted-foreground">Hide profile and stop messages</p>
            </div>
          </button>
        </div>
        {busy && (
          <div className="flex justify-center pt-3 text-muted-foreground">
            <Loader2 className="w-5 h-5 animate-spin" />
          </div>
        )}
        <Button variant="outline" className="w-full mt-4" onClick={() => onOpenChange(false)} disabled={busy}>
          Cancel
        </Button>
      </SheetContent>
    </Sheet>
  );
}
