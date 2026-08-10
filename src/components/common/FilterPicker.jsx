import React, { useState } from "react";
import { ChevronDown } from "lucide-react";
import PickerSheet from "@/components/common/PickerSheet";

export default function FilterPicker({ title, value, options, onChange }) {
  const [open, setOpen] = useState(false);
  const current = options.find((o) => String(o.value) === String(value));
  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="w-full px-3 py-2 rounded-full text-xs border border-border bg-background inline-flex items-center justify-between gap-2 min-w-0"
      >
        <span className="flex items-center gap-1 min-w-0 truncate">
          <span className="text-muted-foreground shrink-0">{title}</span>
          <span className="font-medium truncate">{current?.label ?? "Any"}</span>
        </span>
        <ChevronDown className="w-3.5 h-3.5 text-muted-foreground shrink-0" strokeWidth={1.5} />
      </button>
      <PickerSheet
        open={open}
        onOpenChange={setOpen}
        title={title}
        options={options}
        value={value}
        onChange={onChange}
      />
    </>
  );
}