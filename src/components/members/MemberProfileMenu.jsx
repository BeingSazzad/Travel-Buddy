import React from "react";
import { MoreVertical, Flag, Ban, UserMinus } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";

export default function MemberProfileMenu({
  isConnected,
  overlay = false,
  onReport,
  onRemoveFriend,
  onBlockMember,
}) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          type="button"
          className={cn(
            "flex items-center justify-center tap-feedback transition active:scale-95 shrink-0",
            overlay
              ? "w-10 h-10 rounded-full bg-black/35 backdrop-blur-md border border-white/20 text-white"
              : "w-9 h-9 rounded-full hover:bg-muted/50"
          )}
          aria-label="Profile options"
        >
          <MoreVertical className={overlay ? "w-4 h-4" : "w-5 h-5"} strokeWidth={1.75} />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        sideOffset={8}
        className="min-w-[11.5rem] rounded-xl p-1.5 z-[250]"
      >
        {onReport && (
          <DropdownMenuItem
            onClick={onReport}
            className="gap-2.5 py-2.5 cursor-pointer rounded-lg"
          >
            <Flag className="w-4 h-4 text-primary" strokeWidth={1.5} />
            Report
          </DropdownMenuItem>
        )}
        {isConnected && onRemoveFriend && (
          <>
            <DropdownMenuSeparator className="my-1" />
            <DropdownMenuItem
              onClick={onRemoveFriend}
              className="gap-2.5 py-2.5 cursor-pointer rounded-lg"
            >
              <UserMinus className="w-4 h-4 text-muted-foreground" strokeWidth={1.5} />
              Remove friend
            </DropdownMenuItem>
          </>
        )}
        {onBlockMember && (
          <DropdownMenuItem
            onClick={onBlockMember}
            className="gap-2.5 py-2.5 cursor-pointer rounded-lg text-destructive focus:text-destructive"
          >
            <Ban className="w-4 h-4" strokeWidth={1.5} />
            Block
          </DropdownMenuItem>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
