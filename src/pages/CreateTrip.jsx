import React, { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from "@/components/ui/select";
import { Image } from "@/components/ui/image";
import { cn } from "@/lib/utils";
import { useTrips } from "@/hooks/useTrips";
import { imageForCity, formatDates } from "@/lib/trip-utils";
import { COUNTRIES } from "@/lib/profile-options";
import { TRAVEL_STYLES, LOOKING_FOR } from "@/lib/trip-options";
import TripMatches from "@/components/trips/TripMatches";

const TOTAL = 5;
const EMPTY = {
  city: "", country: "", start_date: "", end_date: "",
  travel_style: "", looking_for: [], description: "", visibility: "public",
};

function Chip({ active, onClick, children }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "px-3.5 py-2 rounded-full text-sm border capitalize transition",
        active ? "bg-[#A1846B] text-white border-[#A1846B]" : "border-border text-foreground"
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

  const set = (k, v) => setData((d) => ({ ...d, [k]: v }));
  const toggleLooking = (v) =>
    setData((d) => ({
      ...d,
      looking_for: d.looking_for.includes(v)
        ? d.looking_for.filter((x) => x !== v)
        : [...d.looking_for, v],
    }));

  const valid = useMemo(() => {
    if (step === 1) return data.city.trim() && data.country;
    if (step === 2) return data.start_date && data.end_date && data.end_date >= data.start_date;
    if (step === 3) return !!data.travel_style;
    return true;
  }, [step, data]);

  const days =
    data.start_date && data.end_date
      ? Math.max(1, Math.round((new Date(data.end_date) - new Date(data.start_date)) / 86400000) + 1)
      : 0;

  const back = () => (step === 1 ? navigate(-1) : setStep((s) => s - 1));
  const next = () => setStep((s) => s + 1);

  const finish = async () => {
    setCreating(true);
    try {
      const createdTrip = await create({
        name: `Trip to ${data.city.trim()}`,
        city: data.city.trim(),
        country: data.country,
        start_date: data.start_date,
        end_date: data.end_date,
        travel_style: data.travel_style,
        cover_image: imageForCity(data.city),
        description: data.description.trim(),
        looking_for: data.looking_for,
        visibility: data.visibility,
      });
      setCreated(createdTrip);
    } finally {
      setCreating(false);
    }
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
    <div className="max-w-md mx-auto min-h-screen flex flex-col bg-background">
      {/* Header */}
      <header className="px-5 pt-12 pb-3 flex items-center gap-3">
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
            className={cn("h-1 flex-1 rounded-full", i < step ? "bg-[#A1846B]" : "bg-border")}
          />
        ))}
      </div>

      {/* Steps */}
      <div className="flex-1 px-5 pb-6">
        {step === 1 && (
          <>
            <h2 className="font-display font-semibold text-xl">Where to?</h2>
            <p className="text-sm text-muted-foreground mb-5">Tell us your destination.</p>
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
              {data.city && (
                <div className="rounded-2xl overflow-hidden h-32 mt-2 border border-border">
                  <Image src={imageForCity(data.city)} alt="Preview" fittingType="fill" className="w-full h-full" />
                </div>
              )}
            </div>
          </>
        )}

        {step === 2 && (
          <>
            <h2 className="font-display font-semibold text-xl">When?</h2>
            <p className="text-sm text-muted-foreground mb-5">Choose your travel dates.</p>
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
            {data.start_date && data.end_date && (
              <p className="text-sm text-muted-foreground mt-4">
                {formatDates(data)} · {days} {days === 1 ? "day" : "days"}
              </p>
            )}
          </>
        )}

        {step === 3 && (
          <>
            <h2 className="font-display font-semibold text-xl">Travel style</h2>
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

        {step === 4 && (
          <>
            <h2 className="font-display font-semibold text-xl">What are you looking for?</h2>
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

        {step === 5 && (
          <>
            <h2 className="font-display font-semibold text-xl">Almost done</h2>
            <p className="text-sm text-muted-foreground mb-5">Add a note and choose who can see your trip.</p>

            <div className="space-y-4">
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
                <div className="h-28">
                  <Image src={imageForCity(data.city)} alt="Trip" fittingType="fill" className="w-full h-full" />
                </div>
                <div className="p-4 space-y-1">
                  <h3 className="font-display font-semibold">Trip to {data.city}</h3>
                  <p className="text-sm text-muted-foreground">
                    {data.city}{data.country ? `, ${data.country}` : ""} · {formatDates(data)}
                  </p>
                  {data.travel_style && (
                    <p className="text-xs text-[#A1846B] capitalize mt-1">{data.travel_style}</p>
                  )}
                  {data.looking_for.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 mt-2">
                      {data.looking_for.map((o) => (
                        <span key={o} className="text-[11px] capitalize px-2 py-0.5 rounded-full bg-[#A1846B]/10 text-[#A1846B]">
                          {o}
                        </span>
                      ))}
                    </div>
                  )}
                  <p className="text-xs mt-2">
                    <span className={cn("px-2 py-0.5 rounded-full text-[11px] font-medium", data.visibility === "public" ? "bg-success/20 text-success-foreground" : "bg-muted text-muted-foreground")}>
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