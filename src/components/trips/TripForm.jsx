import React, { useEffect, useState } from "react";
import { ArrowLeft, Upload, Loader2, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import {
  Select, SelectTrigger, SelectContent, SelectItem, SelectValue,
} from "@/components/ui/select";
import { Image } from "@/components/ui/image";
import { cn } from "@/lib/utils";
import { base44 } from "@/api/base44Client";
import { COUNTRIES } from "@/lib/profile-options";
import { TRAVEL_STYLES, LOOKING_FOR } from "@/lib/trip-options";
import { imageForCity } from "@/lib/trip-utils";

const EMPTY = {
  name: "",
  city: "",
  country: "",
  start_date: "",
  end_date: "",
  travel_style: "",
  description: "",
  looking_for: [],
  visibility: "public",
  cover_image: "",
};

function Chip({ active, onClick, children }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "px-3 py-1.5 rounded-full text-xs border capitalize transition",
        active ? "chip-on" : "border-border text-foreground"
      )}
    >
      {children}
    </button>
  );
}

export default function TripForm({ initial, onCancel, onSubmit }) {
  const [form, setForm] = useState(EMPTY);
  const [saving, setSaving] = useState(false);
  const [uploadingCover, setUploadingCover] = useState(false);

  useEffect(() => {
    if (!initial) {
      setForm(EMPTY);
      return;
    }
    setForm({
      name: initial.name || "",
      city: initial.city || "",
      country: initial.country || "",
      start_date: initial.start_date || "",
      end_date: initial.end_date || "",
      travel_style: initial.travel_style || "",
      description: initial.description || "",
      looking_for: initial.looking_for || [],
      visibility: initial.visibility || "public",
      cover_image: initial.cover_image || "",
    });
  }, [initial]);

  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }));
  const toggleLooking = (v) =>
    setForm((f) => ({
      ...f,
      looking_for: f.looking_for.includes(v)
        ? f.looking_for.filter((x) => x !== v)
        : [...f.looking_for, v],
    }));

  const valid =
    form.city.trim() &&
    form.country &&
    form.start_date &&
    form.end_date &&
    form.end_date >= form.start_date &&
    form.travel_style;

  const onCoverImage = async (e) => {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;
    setUploadingCover(true);
    try {
      const res = await base44.integrations.Core.UploadFile({ file });
      set("cover_image", res.file_url);
    } catch {
      alert("Photo upload failed. Try again.");
    } finally {
      setUploadingCover(false);
    }
  };

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
        description: form.description.trim(),
        looking_for: form.looking_for,
        visibility: form.visibility,
        cover_image: form.cover_image || imageForCity(form.city),
      });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-app mx-auto min-h-dvh flex flex-col bg-background">
      <header className="sticky top-0 z-20 px-5 safe-pt pb-3 flex items-center gap-3 bg-background/90 backdrop-blur border-b border-border/60">
        <button
          type="button"
          onClick={onCancel}
          className="w-9 h-9 rounded-full flex items-center justify-center tap-feedback"
          aria-label="Back"
        >
          <ArrowLeft className="w-5 h-5" strokeWidth={1.5} />
        </button>
        <h1 className="font-display font-semibold text-lg">
          {initial ? "Edit trip" : "New trip"}
        </h1>
      </header>

      <div className="flex-1 overflow-y-auto px-5 py-5 space-y-4 pb-6">
        <div className="space-y-2">
          <Label>Trip name</Label>
          <Input
            value={form.name}
            onChange={(e) => set("name", e.target.value)}
            placeholder={`Trip to ${form.city || "..."}`}
            className="h-12"
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-2 min-w-0">
            <Label>City *</Label>
            <Input value={form.city} onChange={(e) => set("city", e.target.value)} placeholder="Lisbon" className="h-12" />
          </div>
          <div className="space-y-2 min-w-0">
            <Label>Country *</Label>
            <Select value={form.country} onValueChange={(v) => set("country", v)}>
              <SelectTrigger className="h-12"><SelectValue placeholder="Select" /></SelectTrigger>
              <SelectContent>
                {COUNTRIES.map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-2 min-w-0">
            <Label>Start date *</Label>
            <Input type="date" value={form.start_date} onChange={(e) => set("start_date", e.target.value)} className="h-12" />
          </div>
          <div className="space-y-2 min-w-0">
            <Label>End date *</Label>
            <Input type="date" value={form.end_date} onChange={(e) => set("end_date", e.target.value)} className="h-12" />
          </div>
        </div>

        <div className="space-y-2">
          <Label>Travel style *</Label>
          <Select value={form.travel_style} onValueChange={(v) => set("travel_style", v)}>
            <SelectTrigger className="h-12"><SelectValue placeholder="Select" /></SelectTrigger>
            <SelectContent>
              {TRAVEL_STYLES.map((s) => <SelectItem key={s} value={s} className="capitalize">{s}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label>Looking for</Label>
          <div className="flex flex-wrap gap-1.5">
            {LOOKING_FOR.map((o) => (
              <Chip key={o} active={form.looking_for.includes(o)} onClick={() => toggleLooking(o)}>
                {o}
              </Chip>
            ))}
          </div>
        </div>

        <div className="space-y-2">
          <Label>Description</Label>
          <Textarea
            value={form.description}
            onChange={(e) => set("description", e.target.value)}
            placeholder="Tell others about your trip…"
            rows={4}
          />
        </div>

        <div className="space-y-2">
          <Label>Cover photo</Label>
          {form.cover_image ? (
            <div className="relative rounded-2xl overflow-hidden h-36 border border-border">
              <Image src={form.cover_image} alt="Cover" fittingType="fill" className="w-full h-full" />
              <button
                type="button"
                onClick={() => set("cover_image", "")}
                className="absolute top-2 right-2 w-8 h-8 rounded-full bg-background/90 flex items-center justify-center"
                aria-label="Remove cover"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          ) : uploadingCover ? (
            <div className="flex items-center justify-center h-28 rounded-2xl border border-dashed border-border text-muted-foreground text-xs">
              <Loader2 className="w-4 h-4 animate-spin mr-2" /> Uploading…
            </div>
          ) : (
            <label className="flex flex-col items-center justify-center h-28 rounded-2xl border border-dashed border-border cursor-pointer text-muted-foreground hover:bg-muted/30 transition">
              <Upload className="w-5 h-5 mb-1" strokeWidth={1.5} />
              <span className="text-xs">Upload cover photo</span>
              <input type="file" accept="image/*" onChange={onCoverImage} className="hidden" />
            </label>
          )}
        </div>

        <div className="flex items-center justify-between gap-3 rounded-2xl border border-border p-4">
          <div className="min-w-0">
            <p className="font-medium text-sm">
              {form.visibility === "public" ? "Public trip" : "Hidden trip"}
            </p>
            <p className="text-xs text-muted-foreground">
              {form.visibility === "public" ? "Visible to the community" : "Only you can see this trip"}
            </p>
          </div>
          <Switch
            checked={form.visibility === "public"}
            onCheckedChange={(c) => set("visibility", c ? "public" : "hidden")}
          />
        </div>
      </div>

      <div className="sticky bottom-0 px-5 py-4 bg-background/90 backdrop-blur border-t border-border flex gap-3">
        <Button variant="outline" className="flex-1" onClick={onCancel}>Cancel</Button>
        <Button className="flex-1" onClick={submit} disabled={saving || !valid}>
          {saving ? "Saving…" : "Save trip"}
        </Button>
      </div>
    </div>
  );
}
