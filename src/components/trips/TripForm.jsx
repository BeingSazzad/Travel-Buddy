import React, { useEffect, useState } from "react";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  Select, SelectTrigger, SelectContent, SelectItem, SelectValue,
} from "@/components/ui/select";
import { COUNTRIES } from "@/lib/profile-options";
import { TRAVEL_STYLES } from "@/lib/trip-options";
import { imageForCity } from "@/lib/trip-utils";

const EMPTY = { name: "", city: "", country: "", start_date: "", end_date: "", travel_style: "" };

export default function TripForm({ open, onOpenChange, initial, onSubmit }) {
  const [form, setForm] = useState(EMPTY);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (open) {
      setForm(
        initial
          ? {
              name: initial.name || "",
              city: initial.city || "",
              country: initial.country || "",
              start_date: initial.start_date || "",
              end_date: initial.end_date || "",
              travel_style: initial.travel_style || "",
            }
          : EMPTY
      );
    }
  }, [open, initial]);

  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  const valid = form.city.trim() && form.start_date && form.end_date && form.end_date >= form.start_date;

  const submit = async () => {
    if (!valid) return;
    setSaving(true);
    try {
      await onSubmit({
        name: form.name.trim() || `Trip to ${form.city.trim()}`,
        city: form.city.trim(),
        country: form.country,
        start_date: form.start_date,
        end_date: form.end_date,
        travel_style: form.travel_style,
        cover_image: imageForCity(form.city),
      });
      onOpenChange(false);
    } finally {
      setSaving(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-app rounded-2xl">
        <DialogHeader>
          <DialogTitle>{initial ? "Edit trip" : "New trip"}</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label>Trip name</Label>
            <Input value={form.name} onChange={(e) => set("name", e.target.value)} placeholder={`Trip to ${form.city || "..."}`} className="h-10" />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2">
              <Label>City *</Label>
              <Input value={form.city} onChange={(e) => set("city", e.target.value)} placeholder="Lisbon" className="h-10" />
            </div>
            <div className="space-y-2">
              <Label>Country</Label>
              <Select value={form.country} onValueChange={(v) => set("country", v)}>
                <SelectTrigger className="h-10"><SelectValue placeholder="Select" /></SelectTrigger>
                <SelectContent>
                  {COUNTRIES.map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2">
              <Label>Start date *</Label>
              <Input type="date" value={form.start_date} onChange={(e) => set("start_date", e.target.value)} className="h-10" />
            </div>
            <div className="space-y-2">
              <Label>End date *</Label>
              <Input type="date" value={form.end_date} onChange={(e) => set("end_date", e.target.value)} className="h-10" />
            </div>
          </div>

          <div className="space-y-2">
            <Label>Travel style</Label>
            <Select value={form.travel_style} onValueChange={(v) => set("travel_style", v)}>
              <SelectTrigger className="h-10"><SelectValue placeholder="Select" /></SelectTrigger>
              <SelectContent>
                {TRAVEL_STYLES.map((s) => <SelectItem key={s} value={s} className="capitalize">{s}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button onClick={submit} disabled={saving || !valid}>{saving ? "Saving…" : "Save trip"}</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}