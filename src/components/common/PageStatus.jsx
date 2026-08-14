import React from "react";

export function PageLoading() {
  return (
    <p className="text-sm text-muted-foreground text-center pt-24 px-app">Loading…</p>
  );
}

export function PageNotFound({ title, backLabel, onBack }) {
  return (
    <div className="page-shell flex flex-col items-center justify-center min-h-[60vh] gap-3 text-center">
      <p className="page-title">{title}</p>
      <button
        type="button"
        onClick={onBack}
        className="text-sm font-semibold text-primary underline underline-offset-2"
      >
        {backLabel}
      </button>
    </div>
  );
}
