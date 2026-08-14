import { cn } from "@/lib/utils";

/** Page with sticky header. Parent (Layout / AppScroll) owns vertical scroll. */
export default function ScrollPage({ children, className }) {
  return (
    <div className={cn("w-full max-w-app mx-auto min-w-0", className)}>
      {children}
    </div>
  );
}

export function ScrollPageHeader({ children, className }) {
  return (
    <header
      className={cn(
        "sticky top-0 z-20 px-app safe-pt pb-3 flex items-center gap-3 bg-background/90 backdrop-blur border-b border-border/80",
        className,
      )}
    >
      {children}
    </header>
  );
}

export function ScrollPageBody({ children, className }) {
  return (
    <div className={cn("px-app pt-5 pb-6", className)}>
      {children}
    </div>
  );
}
