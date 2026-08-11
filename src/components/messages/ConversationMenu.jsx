import React, { useState } from "react";
import { MoreVertical, User, Flag, Ban, Trash2, UserMinus } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { base44 } from "@/api/base44Client";
import { useAuth } from "@/lib/AuthContext";
import SafetySheet from "@/components/messages/SafetySheet";

export default function ConversationMenu({
  otherId,
  otherName,
  conversationId,
  matchId,
  onViewProfile,
  onDone,
}) {
  const { user } = useAuth();
  const [safetyOpen, setSafetyOpen] = useState(false);
  const [safetyMode, setSafetyMode] = useState(null);
  const [busy, setBusy] = useState(false);

  const openSafety = (mode) => {
    setSafetyMode(mode);
    setSafetyOpen(true);
  };

  const deleteConversation = async () => {
    if (!window.confirm("Delete this conversation? Messages will be removed from your inbox.")) return;
    try {
      setBusy(true);
      if (conversationId?.startsWith("sim_conv_")) {
        onDone?.();
        return;
      }
      const conv = await base44.entities.Conversation.get(conversationId);
      const hidden = Array.isArray(conv.hidden_for) ? conv.hidden_for : [];
      if (!hidden.includes(user?.id)) {
        await base44.entities.Conversation.update(conversationId, { hidden_for: [...hidden, user.id] });
      }
      onDone?.();
    } finally {
      setBusy(false);
    }
  };

  const unmatch = async () => {
    if (!window.confirm(`Unmatch with ${otherName}?`)) return;
    try {
      setBusy(true);
      if (matchId) await base44.entities.Match.delete(matchId).catch(() => {});
      onDone?.();
    } finally {
      setBusy(false);
    }
  };

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button
            type="button"
            disabled={busy}
            className="w-9 h-9 shrink-0 flex items-center justify-center rounded-full hover:bg-muted/50 tap-feedback transition active:scale-95 disabled:opacity-50"
            aria-label="Conversation options"
          >
            <MoreVertical className="w-5 h-5" strokeWidth={1.75} />
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" sideOffset={6} className="min-w-[11.5rem] rounded-xl p-1.5">
          <DropdownMenuItem
            onClick={() => onViewProfile?.(otherId)}
            className="gap-2.5 py-2.5 cursor-pointer rounded-lg"
          >
            <User className="w-4 h-4 text-muted-foreground" strokeWidth={1.5} />
            View profile
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => openSafety("report")}
            className="gap-2.5 py-2.5 cursor-pointer rounded-lg"
          >
            <Flag className="w-4 h-4 text-primary" strokeWidth={1.5} />
            Report
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => openSafety("block")}
            className="gap-2.5 py-2.5 cursor-pointer rounded-lg"
          >
            <Ban className="w-4 h-4 text-primary" strokeWidth={1.5} />
            Block person
          </DropdownMenuItem>
          {matchId && (
            <DropdownMenuItem
              onClick={unmatch}
              className="gap-2.5 py-2.5 cursor-pointer rounded-lg"
            >
              <UserMinus className="w-4 h-4 text-muted-foreground" strokeWidth={2} />
              Remove connection
            </DropdownMenuItem>
          )}
          <DropdownMenuSeparator className="my-1" />
          <DropdownMenuItem
            onClick={deleteConversation}
            className="gap-2.5 py-2.5 cursor-pointer rounded-lg text-destructive focus:text-destructive"
          >
            <Trash2 className="w-4 h-4" strokeWidth={1.5} />
            Delete conversation
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <SafetySheet
        open={safetyOpen}
        onOpenChange={(open) => {
          if (!open) setSafetyMode(null);
          setSafetyOpen(open);
        }}
        otherId={otherId}
        otherName={otherName}
        defaultMode={safetyMode}
        onDone={() => {
          setSafetyOpen(false);
          setSafetyMode(null);
          onDone?.();
        }}
      />
    </>
  );
}
