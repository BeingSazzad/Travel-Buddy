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
        className="px-3 py-1.5 rounded-full text-xs border border-border bg-background inline-flex items-center gap-1"
      >
        {current ? `${title}: ${current.label}` : title}
        <ChevronDown className="w-3 h-3 text-muted-foreground" strokeWidth={1.5} />
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