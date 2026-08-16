import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Upload, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from "@/components/ui/select";
import { Image } from "@/components/ui/image";
import { cn } from "@/lib/utils";
import { base44 } from "@/api/base44Client";
import { useTrips } from "@/hooks/useTrips";
import { imageForCity, formatDates } from "@/lib/trip-utils";
import { COUNTRIES } from "@/lib/profile-options";
import { TRAVEL_STYLES, LOOKING_FOR } from "@/lib/trip-options";
import TripMatches from "@/components/trips/TripMatches";

const TOTAL = 4;
const EMPTY = {
  name: "",
  city: "", country: "", start_date: "", end_date: "",
  travel_style: "", looking_for: [], description: "", visibility: "public",
  cover_image: "",
};

function Chip({ active, onClick, children }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "px-3.5 py-2 rounded-full text-sm border capitalize transition",
        active ? "chip-on" : "border-border text-foreground"
      )}
    >
      {children}
    </button>
  );
}

export default function CreateTrip() {
  const navigate = useNavigate();
  const { trips, user, create } = useTrips();
  const [step, setStep] = useState(1);
  const [data, setData] = useState(EMPTY);
  const [creating, setCreating] = useState(false);
  const [created, setCreated] = useState(null);
  const [uploadingCover, setUploadingCover] = useState(false);

  useEffect(() => {
    const c = new URLSearchParams(window.location.search).get("city");
    if (c) setData((d) => ({ ...d, city: c }));
  }, []);

  const set = (k, v) => setData((d) => ({ ...d, [k]: v }));
  const toggleLooking = (v) =>
    setData((d) => ({
      ...d,
      looking_for: d.looking_for.includes(v)
        ? d.looking_for.filter((x) => x !== v)
        : [...d.looking_for, v],
    }));

  const valid = useMemo(() => {
    if (step === 1) {
      return (
        data.city.trim() &&
        data.country &&
        data.start_date &&
        data.end_date &&
        data.end_date >= data.start_date
      );
    }
    if (step === 2) return !!data.travel_style;
    return true;
  }, [step, data]);

  const days =
    data.start_date && data.end_date
      ? Math.max(1, Math.round((new Date(data.end_date) - new Date(data.start_date)) / 86400000) + 1)
      : 0;

  const back = () => (step === 1 ? navigate(-1) : setStep((s) => s - 1));
  const next = () => setStep((s) => s + 1);

  const coverPreview = data.cover_image || (data.city.trim() ? imageForCity(data.city) : null);

  const onCoverImage = async (e) => {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;
    setUploadingCover(true);
    try {
      const res = await base44.integrations.Core.UploadFile({ file });
      set("cover_image", res.file_url);
    } catch {
      alert("Photo upload failed. Try again, or continue without a custom cover.");
    } finally {
      setUploadingCover(false);
    }
  };

  const finish = async () => {
    setCreating(true);
    const payload = {
      name: data.name.trim() || `Trip to ${data.city.trim()}`,
      city: data.city.trim(),
      country: data.country,
      start_date: data.start_date,
      end_date: data.end_date,
      travel_style: data.travel_style,
      cover_image: data.cover_image || imageForCity(data.city),
      description: data.description.trim(),
      looking_for: data.looking_for,
      visibility: data.visibility,
    };
    const createdTrip = await create(payload);
    setCreated(createdTrip);
    setCreating(false);
  };

  if (created) {
    return (
      <TripMatches
        trip={created}
        allTrips={[...trips, created]}
        userId={user?.id}
        onDone={() => navigate("/trips")}
      />
    );
  }

  return (
    <div className="max-w-app mx-auto min-h-screen flex flex-col bg-background">
      {/* Header */}
      <header className="px-5 safe-pt pb-3 flex items-center gap-3">
        <button onClick={back} className="w-9 h-9 rounded-full flex items-center justify-center">
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div>
          <h1 className="font-display font-semibold text-lg">Create Trip</h1>
          <p className="text-xs text-muted-foreground">Step {step} of {TOTAL}</p>
        </div>
      </header>

      {/* Progress */}
      <div className="px-5 mb-5 flex gap-1.5">
        {Array.from({ length: TOTAL }).map((_, i) => (
          <div
            key={i}
            className={cn("h-1 flex-1 rounded-full", i < step ? "bg-primary" : "bg-border")}
          />
        ))}
      </div>

      {/* Steps */}
      <div className="flex-1 px-5 pb-6">
        {step === 1 && (
          <>
            <h2 className="font-display font-bold text-lg">Where & when?</h2>
            <p className="text-sm text-muted-foreground mb-5">Your destination and travel dates.</p>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>City *</Label>
                <Input value={data.city} onChange={(e) => set("city", e.target.value)} placeholder="Lisbon" className="h-12" />
              </div>
              <div className="space-y-2">
                <Label>Country *</Label>
                <Select value={data.country} onValueChange={(v) => set("country", v)}>
                  <SelectTrigger className="h-12"><SelectValue placeholder="Select country" /></SelectTrigger>
                  <SelectContent>
                    {COUNTRIES.map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-2">
                  <Label>Start date *</Label>
                  <Input type="date" value={data.start_date} onChange={(e) => set("start_date", e.target.value)} className="h-12" />
                </div>
                <div className="space-y-2">
                  <Label>End date *</Label>
                  <Input type="date" value={data.end_date} onChange={(e) => set("end_date", e.target.value)} className="h-12" />
                </div>
              </div>
              {data.start_date && data.end_date && data.end_date >= data.start_date && (
                <p className="text-sm text-muted-foreground">
                  {formatDates(data)} · {days} {days === 1 ? "day" : "days"}
                </p>
              )}
            </div>
          </>
        )}

        {step === 2 && (
          <>
            <h2 className="font-display font-bold text-lg">Travel style</h2>
            <p className="text-sm text-muted-foreground mb-5">How do you like to travel?</p>
            <div className="flex flex-wrap gap-2">
              {TRAVEL_STYLES.map((s) => (
                <Chip key={s} active={data.travel_style === s} onClick={() => set("travel_style", s)}>
                  {s}
                </Chip>
              ))}
            </div>
          </>
        )}

        {step === 3 && (
          <>
            <h2 className="font-display font-bold text-lg">What are you looking for?</h2>
            <p className="text-sm text-muted-foreground mb-5">Select all that apply.</p>
            <div className="flex flex-wrap gap-2">
              {LOOKING_FOR.map((o) => (
                <Chip key={o} active={data.looking_for.includes(o)} onClick={() => toggleLooking(o)}>
                  {o}
                </Chip>
              ))}
            </div>
          </>
        )}

        {step === 4 && (
          <>
            <h2 className="font-display font-bold text-lg">Almost done</h2>
            <p className="text-sm text-muted-foreground mb-5">Add a note and choose who can see your trip.</p>

            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Trip name (optional)</Label>
                <Input
                  value={data.name}
                  onChange={(e) => set("name", e.target.value)}
                  placeholder={`Trip to ${data.city || "..."}`}
                  className="h-12"
                />
              </div>

              <div className="space-y-2">
                <Label>Cover photo (optional)</Label>
                <p className="text-xs text-muted-foreground">
                  Upload your own trip photo, or we&apos;ll use a destination image for {data.city || "your city"}.
                </p>
                {data.cover_image ? (
                  <div className="relative rounded-2xl overflow-hidden h-36 border border-border">
                    <Image src={data.cover_image} alt="Trip cover" fittingType="fill" className="w-full h-full" />
                    <button
                      type="button"
                      onClick={() => set("cover_image", "")}
                      className="absolute top-2 right-2 bg-background/90 backdrop-blur rounded-full px-2.5 py-1 text-xs font-medium"
                    >
                      Remove
                    </button>
                  </div>
                ) : uploadingCover ? (
                  <div className="flex items-center justify-center h-32 rounded-2xl border border-dashed border-border text-muted-foreground">
                    <Loader2 className="w-5 h-5 animate-spin mr-2" /> Uploading…
                  </div>
                ) : (
                  <label className="flex flex-col items-center justify-center h-32 rounded-2xl border border-dashed border-border cursor-pointer text-muted-foreground hover:bg-muted/30 transition">
                    <Upload className="w-5 h-5 mb-1" strokeWidth={1.5} />
                    <span className="text-xs font-medium">Upload cover photo</span>
                    <input type="file" accept="image/*" onChange={onCoverImage} className="hidden" />
                  </label>
                )}
              </div>

              <div className="space-y-2">
                <Label>Description (optional)</Label>
                <Textarea
                  value={data.description}
                  onChange={(e) => set("description", e.target.value)}
                  placeholder="Tell others about your trip..."
                  rows={3}
                />
              </div>

              <div className="flex items-center justify-between rounded-2xl border border-border p-4">
                <div>
                  <p className="font-medium text-sm">
                    {data.visibility === "public" ? "Public trip" : "Hidden trip"}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {data.visibility === "public" ? "Visible to the community" : "Only you can see this trip"}
                  </p>
                </div>
                <Switch
                  checked={data.visibility === "public"}
                  onCheckedChange={(c) => set("visibility", c ? "public" : "hidden")}
                />
              </div>

              <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide mt-2">Review</p>
              <div className="rounded-2xl border border-border bg-card shadow-soft overflow-hidden">
                {coverPreview && (
                  <div className="h-28 relative">
                    <Image src={coverPreview} alt="Trip" fittingType="fill" className="w-full h-full" />
                    {!data.cover_image && (
                      <span className="absolute bottom-2 left-2 text-[10px] px-2 py-0.5 rounded-full bg-black/50 text-white/90 backdrop-blur-sm">
                        Destination photo
                      </span>
                    )}
                  </div>
                )}
                <div className="p-4 space-y-1">
                  <h3 className="font-display font-semibold">
                    {data.name.trim() || `Trip to ${data.city}`}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {data.city}{data.country ? `, ${data.country}` : ""} · {formatDates(data)}
                  </p>
                  {data.travel_style && (
                    <p className="text-xs text-primary capitalize mt-1">{data.travel_style}</p>
                  )}
                  {data.looking_for.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 mt-2">
                      {data.looking_for.map((o) => (
                        <span key={o} className="text-xs capitalize px-2 py-0.5 rounded-full bg-primary/10 text-primary">
                          {o}
                        </span>
                      ))}
                    </div>
                  )}
                  <p className="text-xs mt-2">
                    <span className={cn("px-2 py-0.5 rounded-full text-xs font-medium", data.visibility === "public" ? "bg-success/20 text-success-foreground" : "bg-muted text-muted-foreground")}>
                      {data.visibility === "public" ? "Public" : "Hidden"}
                    </span>
                  </p>
                </div>
              </div>
            </div>
          </>
        )}
      </div>

      {/* Footer */}
      <div className="sticky bottom-0 px-5 py-4 bg-background/90 backdrop-blur border-t border-border flex gap-3">
        <Button variant="outline" className="flex-1" onClick={back}>
          {step === 1 ? "Cancel" : "Back"}
        </Button>
        {step < TOTAL ? (
          <Button className="flex-1" onClick={next} disabled={!valid}>Next</Button>
        ) : (
          <Button className="flex-1" onClick={finish} disabled={creating}>
            {creating ? "Creating…" : "Create trip"}
          </Button>
        )}
      </div>
    </div>
  );
}