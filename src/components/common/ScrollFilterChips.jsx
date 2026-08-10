import { cn } from "@/lib/utils";

/** Horizontal chip row with edge-to-edge scroll inside padded pages */
export default function ScrollFilterChips({
  items,
  active,
  onSelect,
  activeClass = "bg-foreground text-background border-foreground",
  inactiveClass = "border-border text-foreground bg-background/60",
}) {
  return (
    <div className="-mx-5 px-5">
      <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1">
        {items.map((item) => {
          const key = item.key ?? item.value ?? item;
          const label = item.label ?? item;
          const isActive = typeof active === "function" ? active(key) : active === key;

          return (
            <button
              key={key}
              type="button"
              onClick={() => onSelect(key)}
              className={cn(
                "shrink-0 px-3 py-2 rounded-full text-xs font-medium border whitespace-nowrap transition-colors",
                isActive ? activeClass : inactiveClass
              )}
            >
              {label}
            </button>
          );
        })}
      </div>
    </div>
  );
}
