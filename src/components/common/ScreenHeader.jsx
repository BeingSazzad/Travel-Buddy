import React from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

export default function ScreenHeader({
  title,
  subtitle,
  showBack = false,
  onBack,
  extraActions = null,
  className = "mb-4",
}) {
  const navigate = useNavigate();

  return (
    <header className={`flex items-center justify-between gap-3 shrink-0 ${className}`}>
      <div className="flex items-center gap-2 min-w-0">
        {showBack && (
          <button
            type="button"
            onClick={onBack || (() => navigate(-1))}
            className="w-9 h-9 rounded-full flex items-center justify-center active:scale-95 transition shrink-0"
            aria-label="Back"
          >
            <ArrowLeft className="w-5 h-5" strokeWidth={1.5} />
          </button>
        )}
        <div className="min-w-0">
          <h1 className="font-display font-bold text-lg truncate">{title}</h1>
          {subtitle && <p className="text-sm text-muted-foreground truncate">{subtitle}</p>}
        </div>
      </div>
      {extraActions && (
        <div className="flex items-center gap-2 shrink-0">
          {extraActions}
        </div>
      )}
    </header>
  );
}
