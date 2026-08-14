import { cn } from "@/lib/utils";

export default function TagFilterChips({
  items,
  active,
  onToggle,
  activeClass = "chip-on",
  inactiveClass = "border-border text-foreground bg-background/60",
}) {
  return (
    <div className="flex flex-wrap gap-2">
      {items.map((item) => {
        const key = item.key ?? item.value ?? item;
        const label = item.shortLabel ?? item.label ?? item;
        const isActive = typeof active === "function" ? active(key) : active?.[key] ?? active === key;

        return (
          <button
            key={key}
            type="button"
            onClick={() => onToggle(key)}
            className={cn(
              "shrink-0 px-3 py-2 rounded-full text-xs font-medium border transition-colors",
              isActive ? activeClass : inactiveClass
            )}
          >
            {label}
          </button>
        );
      })}
    </div>
  );
}
