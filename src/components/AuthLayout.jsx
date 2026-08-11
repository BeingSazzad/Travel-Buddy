import React from "react";
import { Moon } from "lucide-react";
import { Link } from "react-router-dom";

/**
 * Auth screens — matches app shell (warm gradient bg + card form).
 */
export default function AuthLayout({
  icon: Icon,
  title,
  subtitle,
  footer,
  children,
}) {
  return (
    <div className="min-h-screen gradient-app-bg font-body flex flex-col">
      <div className="flex-1 flex flex-col items-center justify-center px-5 py-8 safe-pt safe-pb w-full max-w-app mx-auto">
        <div className="w-full max-w-md">
          <div className="text-center mb-6">
            <div className="w-12 h-12 rounded-2xl gradient-brand-accent flex items-center justify-center mx-auto shadow-soft mb-3">
              <Moon className="w-6 h-6 text-white" strokeWidth={1.5} />
            </div>
            <p className="font-display font-bold text-lg tracking-[0.14em] text-foreground">SELUNA</p>
            <p className="text-[10px] text-muted-foreground tracking-[0.2em] uppercase mt-1">
              Women · Travel · Community
            </p>
          </div>

          <div className="bg-card border border-border/80 rounded-3xl shadow-soft p-6">
            <div className="flex items-start gap-3 mb-5">
              {Icon && (
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                  <Icon className="w-5 h-5 text-primary" strokeWidth={1.75} />
                </div>
              )}
              <div className="min-w-0">
                <h1 className="text-xl font-display font-semibold tracking-tight text-foreground leading-tight">
                  {title}
                </h1>
                {subtitle && (
                  <p className="text-sm text-muted-foreground mt-1 leading-snug">{subtitle}</p>
                )}
              </div>
            </div>

            <div className="gradient-divider mb-5" />

            {children}
          </div>

          {footer && (
            <p className="text-center text-sm text-muted-foreground leading-relaxed mt-6">
              {footer}
            </p>
          )}

          <Link
            to="/welcome"
            className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground mt-4 mx-auto tap-feedback"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
            Back to welcome
          </Link>
        </div>
      </div>
    </div>
  );
}
