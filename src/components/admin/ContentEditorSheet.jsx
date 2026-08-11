import React, { useState } from "react";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Loader2, Upload, X, Plus } from "lucide-react";
import { base44 } from "@/api/base44Client";

function buildInitial(item, fields) {
  const init = {};
  fields.forEach((f) => {
    if (item && item[f.key] !== undefined) {
      init[f.key] = item[f.key];
    } else if (f.type === "tags") {
      init[f.key] = Object.fromEntries((f.options || []).map((o) => [o.key, false]));
    } else if (f.type === "counts") {
      init[f.key] = Object.fromEntries((f.options || []).map((o) => [o.key, 0]));
    } else if (f.type === "gallery") {
      init[f.key] = [];
    } else if (f.type === "boolean") {
      init[f.key] = false;
    } else if (f.type === "number") {
      init[f.key] = 0;
    } else {
      init[f.key] = "";
    }
  });
  return init;
}

function ImageInput({ value, onChange, label }) {
  const [busy, setBusy] = useState(false);
  const upload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setBusy(true);
    try {
      const { file_url } = await base44.integrations.Core.UploadFile({ file });
      onChange(file_url);
    } catch (err) {
      alert("Upload failed");
    } finally {
      setBusy(false);
    }
  };
  return (
    <div>
      <label className="text-xs text-muted-foreground">{label}</label>
      <div className="flex items-center gap-2 mt-1">
        {value && <img src={value} alt="" className="w-16 h-16 rounded-xl object-cover border border-border" />}
        <label className="flex items-center gap-1.5 px-3 py-2 rounded-xl border border-border bg-background text-xs cursor-pointer">
          {busy ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Upload className="w-3.5 h-3.5" strokeWidth={1.5} />}
          {value ? "Replace" : "Upload"}
          <input type="file" accept="image/*" className="hidden" onChange={upload} />
        </label>
      </div>
    </div>
  );
}

function GalleryInput({ value, onChange, label }) {
  const [busy, setBusy] = useState(false);
  const add = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setBusy(true);
    try {
      const { file_url } = await base44.integrations.Core.UploadFile({ file });
      onChange([...(value || []), file_url]);
    } catch (err) {
      alert("Upload failed");
    } finally {
      setBusy(false);
    }
  };
  return (
    <div>
      <label className="text-xs text-muted-foreground">{label}</label>
      <div className="flex gap-2 flex-wrap mt-1">
        {(value || []).map((g, i) => (
          <div key={i} className="relative w-16 h-16">
            <img src={g} alt="" className="w-16 h-16 rounded-xl object-cover border border-border" />
            <button
              type="button"
              onClick={() => onChange(value.filter((_, j) => j !== i))}
              className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-foreground text-background flex items-center justify-center"
            >
              <X className="w-3 h-3" strokeWidth={1.5} />
            </button>
          </div>
        ))}
        <label className="w-16 h-16 rounded-xl border-2 border-dashed border-border flex items-center justify-center cursor-pointer">
          {busy ? <Loader2 className="w-4 h-4 animate-spin text-muted-foreground" /> : <Plus className="w-4 h-4 text-muted-foreground" strokeWidth={1.5} />}
          <input type="file" accept="image/*" className="hidden" onChange={add} />
        </label>
      </div>
    </div>
  );
}

export default function ContentEditorSheet({ open, item, fields, title, onSave, onClose }) {
  const [form, setForm] = useState(() => buildInitial(item, fields));
  const [saving, setSaving] = useState(false);

  React.useEffect(() => {
    if (open) setForm(buildInitial(item, fields));
  }, [open, item]);

  const set = (key, val) => setForm((f) => ({ ...f, [key]: val }));

  const save = async () => {
    for (const f of fields) {
      if (f.required && !form[f.key]) {
        alert(`${f.label} is required`);
        return;
      }
    }
    setSaving(true);
    try {
      await onSave(form);
      onClose();
    } catch (e) {
      alert("Could not save: " + (e.message || "error"));
    } finally {
      setSaving(false);
    }
  };

  return (
    <Sheet open={open} onOpenChange={(o) => !o && onClose()}>
      <SheetContent side="bottom" className="rounded-t-3xl max-h-[92vh] overflow-y-auto">
        <SheetHeader>
          <SheetTitle className="font-display text-xl">{item ? "Edit" : "New"} {title}</SheetTitle>
        </SheetHeader>
        <div className="px-4 pb-8 space-y-3">
          {fields.map((f) => {
            if (f.type === "text" || f.type === "string") {
              return (
                <div key={f.key}>
                  <label className="text-xs text-muted-foreground">{f.label}{f.required ? " *" : ""}</label>
                  <input value={form[f.key] || ""} onChange={(e) => set(f.key, e.target.value)} placeholder={f.placeholder}
                    className="w-full h-10 rounded-xl border border-border bg-background px-3 text-sm outline-none mt-1" />
                </div>
              );
            }
            if (f.type === "textarea") {
              return (
                <div key={f.key}>
                  <label className="text-xs text-muted-foreground">{f.label}{f.required ? " *" : ""}</label>
                  <textarea value={form[f.key] || ""} onChange={(e) => set(f.key, e.target.value)} rows={3} placeholder={f.placeholder}
                    className="w-full rounded-xl border border-border bg-background px-3 py-2 text-sm outline-none resize-none mt-1" />
                </div>
              );
            }
            if (f.type === "number") {
              return (
                <div key={f.key}>
                  <label className="text-xs text-muted-foreground">{f.label}</label>
                  <input type="number" value={form[f.key] ?? 0} onChange={(e) => set(f.key, Number(e.target.value))}
                    className="w-full h-10 rounded-xl border border-border bg-background px-3 text-sm outline-none mt-1" />
                </div>
              );
            }
            if (f.type === "select") {
              return (
                <div key={f.key}>
                  <label className="text-xs text-muted-foreground">{f.label}</label>
                  <select value={form[f.key] || ""} onChange={(e) => set(f.key, e.target.value)}
                    className="w-full h-10 rounded-xl border border-border bg-background px-3 text-sm outline-none mt-1">
                    <option value="">—</option>
                    {f.options.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
                  </select>
                </div>
              );
            }
            if (f.type === "boolean") {
              return (
                <div key={f.key} className="flex items-center justify-between py-1">
                  <label className="text-sm">{f.label}</label>
                  <Switch checked={!!form[f.key]} onCheckedChange={(v) => set(f.key, v)} />
                </div>
              );
            }
            if (f.type === "image") {
              return <ImageInput key={f.key} label={f.label + (f.required ? " *" : "")} value={form[f.key]} onChange={(v) => set(f.key, v)} />;
            }
            if (f.type === "gallery") {
              return <GalleryInput key={f.key} label={f.label} value={form[f.key]} onChange={(v) => set(f.key, v)} />;
            }
            if (f.type === "tags") {
              return (
                <div key={f.key}>
                  <label className="text-xs text-muted-foreground">{f.label}</label>
                  <div className="flex flex-wrap gap-1.5 mt-1">
                    {(f.options || []).map((o) => {
                      const on = !!form[f.key]?.[o.key];
                      return (
                        <button key={o.key} type="button" onClick={() => set(f.key, { ...form[f.key], [o.key]: !on })}
                          className={`px-2.5 py-1 rounded-full text-xs border ${on ? "bg-primary text-white border-primary" : "border-border text-foreground"}`}>
                          {o.label}
                        </button>
                      );
                    })}
                  </div>
                </div>
              );
            }
            if (f.type === "counts") {
              return (
                <div key={f.key}>
                  <label className="text-xs text-muted-foreground">{f.label}</label>
                  <div className="grid grid-cols-3 gap-2 mt-1">
                    {(f.options || []).map((o) => (
                      <div key={o.key}>
                        <span className="text-[10px] text-muted-foreground">{o.label}</span>
                        <input type="number" value={form[f.key]?.[o.key] ?? 0} onChange={(e) => set(f.key, { ...form[f.key], [o.key]: Number(e.target.value) })}
                          className="w-full h-9 rounded-lg border border-border bg-background px-2 text-sm outline-none" />
                      </div>
                    ))}
                  </div>
                </div>
              );
            }
            return null;
          })}
          <Button onClick={save} disabled={saving} className="w-full h-11 mt-2">
            {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : "Save"}
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
}