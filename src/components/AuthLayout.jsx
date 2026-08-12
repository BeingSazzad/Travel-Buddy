import React from "react";
import { Moon, ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";

/**
 * Auth shell — left-stacked hierarchy (icon → title → subtitle).
 * Forms stay left-aligned under the header; never icon-beside-title.
 */
export default function AuthLayout({
  icon: Icon,
  title,
  subtitle,
  footer,
  children,
  onBack,
  backTo = "/welcome",
}) {
  return (
    <div className="min-h-screen gradient-app-bg font-body flex flex-col">
      <div className="w-full max-w-md mx-auto flex-1 flex flex-col px-5 pt-4 pb-8 safe-pt safe-pb">
        <div className="flex items-center justify-between mb-10">
          {onBack ? (
            <button
              type="button"
              onClick={onBack}
              className="w-10 h-10 rounded-full border border-border/80 bg-card/60 flex items-center justify-center text-foreground tap-feedback"
              aria-label="Back"
            >
              <ArrowLeft className="w-4 h-4" strokeWidth={2} />
            </button>
          ) : (
            <Link
              to={backTo}
              className="w-10 h-10 rounded-full border border-border/80 bg-card/60 flex items-center justify-center text-foreground tap-feedback"
              aria-label="Back"
            >
              <ArrowLeft className="w-4 h-4" strokeWidth={2} />
            </Link>
          )}

          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl gradient-brand-accent flex items-center justify-center">
              <Moon className="w-4 h-4 text-white" strokeWidth={1.5} />
            </div>
            <span className="font-display font-bold text-sm tracking-[0.12em] text-foreground">SELUNA</span>
          </div>

          <div className="w-10" aria-hidden="true" />
        </div>

        <header className="mb-8 text-left">
          {Icon && (
            <div className="w-11 h-11 rounded-2xl bg-primary/12 flex items-center justify-center mb-4">
              <Icon className="w-5 h-5 text-primary" strokeWidth={1.75} />
            </div>
          )}
          <h1 className="text-[1.65rem] font-display font-bold tracking-tight text-foreground leading-[1.15]">
            {title}
          </h1>
          {subtitle && (
            <p className="text-sm text-muted-foreground leading-relaxed mt-2.5 max-w-[34ch]">
              {subtitle}
            </p>
          )}
        </header>

        <div className="flex-1">{children}</div>

        {footer && (
          <p className="text-center text-sm text-muted-foreground leading-relaxed mt-8">
            {footer}
          </p>
        )}
      </div>
    </div>
  );
}
