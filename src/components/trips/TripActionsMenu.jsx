import React from "react";
import { MoreVertical, Pencil, Trash2 } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";

export default function TripActionsMenu({
  onEdit,
  onDelete,
  disabled = false,
  overlay = false,
  align = "start",
}) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          type="button"
          onClick={(e) => e.stopPropagation()}
          disabled={disabled}
          className={cn(
            "flex items-center justify-center tap-feedback transition active:scale-95",
            overlay
              ? "w-8 h-8 rounded-full bg-black/50 backdrop-blur-md border border-white/20 text-white hover:bg-black/70"
              : "w-9 h-9 rounded-full hover:bg-muted/50"
          )}
          aria-label="Trip options"
        >
          <MoreVertical className="w-4 h-4" strokeWidth={1.75} />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align={align} className="min-w-[11rem] rounded-xl">
        <DropdownMenuItem
          onClick={(e) => {
            e.stopPropagation();
            onEdit?.();
          }}
          className="gap-2 cursor-pointer"
        >
          <Pencil className="w-4 h-4" strokeWidth={1.5} />
          Edit trip
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={(e) => {
            e.stopPropagation();
            onDelete?.();
          }}
          className="gap-2 cursor-pointer text-destructive focus:text-destructive"
        >
          <Trash2 className="w-4 h-4" strokeWidth={1.5} />
          Delete trip
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
