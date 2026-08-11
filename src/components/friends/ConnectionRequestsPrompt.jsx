import React from "react";
import { useNavigate } from "react-router-dom";
import { UserPlus, ChevronRight } from "lucide-react";

/** Single entry point CTA — use on Friends only, not duplicated across tabs. */
export default function ConnectionRequestsPrompt({ count, className = "" }) {
  const navigate = useNavigate();
  if (!count || count <= 0) return null;

  return (
    <button
      type="button"
      onClick={() => navigate("/connections")}
      className={`w-full flex items-center gap-3 rounded-2xl border border-primary/25 bg-primary/8 px-4 py-3 active:scale-[0.99] transition text-left ${className}`}
    >
      <div className="w-10 h-10 rounded-full bg-primary/12 flex items-center justify-center shrink-0">
        <UserPlus className="w-5 h-5 text-primary" strokeWidth={2} />
      </div>
      <div className="flex-1 min-w-0">
        <p className="font-display font-semibold text-sm text-foreground">
          {count} connection request{count !== 1 ? "s" : ""}
        </p>
        <p className="text-xs text-muted-foreground">Review and connect back</p>
      </div>
      <ChevronRight className="w-4 h-4 text-muted-foreground shrink-0" strokeWidth={1.5} />
    </button>
  );
}
