import { cn } from "@/lib/utils";

/** Full-height page shell — sticky header + scrollable body (mobile shell safe). */
export default function ScrollPage({ children, className }) {
  return (
    <div className={cn("h-full min-h-0 flex flex-col bg-background max-w-app mx-auto w-full", className)}>
      {children}
    </div>
  );
}

export function ScrollPageHeader({ children, className }) {
  return (
    <header
      className={cn(
        "sticky top-0 z-20 shrink-0 px-app safe-pt pb-3 flex items-center gap-3 bg-background/90 backdrop-blur border-b border-border",
        className,
      )}
    >
      {children}
    </header>
  );
}

export function ScrollPageBody({ children, className }) {
  return (
    <div
      className={cn(
        "flex-1 min-h-0 overflow-y-auto overscroll-contain app-scroll px-5 py-6 pb-[calc(1.5rem+env(safe-area-inset-bottom))]",
        className,
      )}
    >
      {children}
    </div>
  );
}
