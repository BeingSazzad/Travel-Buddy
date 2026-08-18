import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Upload, ShieldCheck, Loader2, MapPin, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from "@/components/ui/select";
import { Image } from "@/components/ui/image";
import { cn } from "@/lib/utils";
import { base44 } from "@/api/base44Client";
import { useAuth } from "@/lib/AuthContext";
import { EVENT_CATEGORIES, defaultEventImage, capitalize, fmtEventDate, fmtEventTime } from "@/lib/event-options";
import { COUNTRIES, LANGUAGES } from "@/lib/profile-options";
import InterestPicker from "@/components/profile/InterestPicker";
import EventCard from "@/components/events/EventCard";
import EventMap from "@/components/events/EventMap";
import {
  findMockEvent,
  isLocalEventId,
  saveLocalEvent,
  updateLocalEvent,
} from "@/lib/mock-events";
import { findMeetingPlaces } from "@/lib/place-search";

/** 3 steps — only what a host must decide to publish a meetup. */
const TOTAL = 3;

const EMPTY = {
  title: "",
  category: "",
  description: "",
  date: "",
  start_time: "",
  end_time: "",
  city: "",
  country: "",
  location: "",
  lat: null,
  lng: null,
  image: "",
  max_attendees: 12,
  visibility: "public",
  agreed_rules: false,
  pricing: "free",
  external_link: "",
  age_min: "",
  age_max: "",
  languages: [],
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

function fromEntity(e) {
  return {
    title: e.title || "",
    category: e.category || "",
    description: e.description || "",
    date: e.date || "",
    start_time: e.time || "",
    end_time: e.end_time || "",
    city: e.city || "",
    country: e.country || "",
    location: e.location || "",
    lat: e.lat != null ? Number(e.lat) : null,
    lng: e.lng != null ? Number(e.lng) : e.lon != null ? Number(e.lon) : null,
    image: e.image || "",
    max_attendees: e.max_attendees || 12,
    visibility: e.visibility || "public",
    agreed_rules: true,
    pricing: e.pricing || "free",
    external_link: e.external_link || "",
    age_min: e.age_min ?? "",
    age_max: e.age_max ?? "",
    languages: e.languages || [],
  };
}

export default function CreateEvent() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [step, setStep] = useState(1);
  const [data, setData] = useState(EMPTY);
  const [creating, setCreating] = useState(false);
  const [placeResults, setPlaceResults] = useState([]);
  const [searchingPlace, setSearchingPlace] = useState(false);
  const [placeError, setPlaceError] = useState("");
  const editId = new URLSearchParams(window.location.search).get("edit");

  useEffect(() => {
    if (!editId) return;
    (async () => {
      const local = isLocalEventId(editId) ? findMockEvent(editId) : null;
      if (local) {
        setData(fromEntity(local));
        return;
      }
      try {
        const e = await base44.entities.Event.get(editId);
        setData(fromEntity(e));
      } catch {
        const mock = findMockEvent(editId);
        if (mock) setData(fromEntity(mock));
      }
    })();
  }, [editId]);

  const set = (k, v) => setData((d) => ({ ...d, [k]: v }));

  const setMeetingPoint = (value) => {
    setData((d) => ({ ...d, location: value, lat: null, lng: null }));
    setPlaceResults([]);
    setPlaceError("");
  };

  const setCityOrCountry = (k, v) => {
    setData((d) => ({ ...d, [k]: v, lat: null, lng: null }));
    setPlaceResults([]);
    setPlaceError("");
  };

  const placeConfirmed =
    data.lat != null &&
    data.lng != null &&
    Number.isFinite(Number(data.lat)) &&
    Number.isFinite(Number(data.lng));

  const searchMeetingPlace = async () => {
    const meeting = data.location.trim();
    const city = data.city.trim();
    const country = data.country;
    if (!meeting || !city || !country) {
      setPlaceError("Add city, country, and meeting point first.");
      return;
    }

    setSearchingPlace(true);
    setPlaceError("");

    const results = await findMeetingPlaces(meeting, { city, country });

    setSearchingPlace(false);

    if (!results.length) {
      setPlaceResults([]);
      setPlaceError("Couldn’t find that place — try a café or landmark name, then tap the map pin.");
      return;
    }

    setPlaceResults(results);
    const first = results[0];
    setData((d) => ({ ...d, lat: first.lat, lng: first.lon }));
  };

  const pickPlace = (r) => {
    setData((d) => ({
      ...d,
      lat: r.lat,
      lng: r.lon,
      location: r.name && r.name.length < 80 ? r.name : d.location,
    }));
    setPlaceError("");
  };

  const pickMapPin = ([lat, lng]) => {
    setData((d) => ({ ...d, lat, lng }));
    setPlaceError("");
  };

  useEffect(() => {
    const meeting = data.location.trim();
    const city = data.city.trim();
    if (!meeting || meeting.length < 3 || !city || !data.country) return;
    if (placeConfirmed) return;

    const t = setTimeout(() => {
      searchMeetingPlace();
    }, 450);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps -- search when typed query changes
  }, [data.location, data.city, data.country]);

  const valid = useMemo(() => {
    if (step === 1) return data.title.trim() && data.category && data.description.trim();
    if (step === 2) {
      const timesOk =
        data.date &&
        data.start_time &&
        (!data.end_time || data.end_time > data.start_time);
      const maxPeople = Number(data.max_attendees);
      const peopleOk = Number.isFinite(maxPeople) && maxPeople >= 2 && maxPeople <= 200;
      return (
        timesOk &&
        peopleOk &&
        data.city.trim() &&
        data.country &&
        data.location.trim() &&
        placeConfirmed
      );
    }
    if (step === 3) return data.agreed_rules;
    return true;
  }, [step, data, placeConfirmed]);

  const back = () => (step === 1 ? navigate(-1) : setStep((s) => s - 1));
  const next = () => setStep((s) => s + 1);

  const onImage = async (e) => {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;
    try {
      const res = await base44.integrations.Core.UploadFile({ file });
      set("image", res.file_url);
    } catch {
      alert("Photo upload failed. You can publish without a custom cover.");
    }
  };

  const finish = async () => {
    if (!valid) return;
    setCreating(true);
    const hostId = user?.id;
    const hostName = user?.full_name || user?.profile_name || "You";
    const payload = {
      title: data.title.trim(),
      category: data.category,
      description: data.description.trim(),
      date: data.date,
      time: data.start_time,
      end_time: data.end_time || "",
      city: data.city.trim(),
      country: data.country,
      location: data.location.trim(),
      lat: Number(data.lat),
      lng: Number(data.lng),
      image: data.image || defaultEventImage(data.category),
      max_attendees: Number(data.max_attendees) || 12,
      visibility: data.visibility || "public",
      agreed_rules: true,
      pricing: data.pricing || "free",
      external_link: data.pricing === "paid_external" ? (data.external_link || "").trim() : "",
      age_min: data.age_min !== "" && data.age_min != null ? Number(data.age_min) : null,
      age_max: data.age_max !== "" && data.age_max != null ? Number(data.age_max) : null,
      languages: data.languages || [],
      host_id: hostId,
      host_name: hostName,
    };
    const withHost = (event) => ({
      ...event,
      name: event.title || payload.title,
      host_id: event.host_id || hostId,
      created_by_id: event.created_by_id || hostId,
      host_name: event.host_name || hostName,
    });
    try {
      if (editId) {
        if (isLocalEventId(editId)) {
          updateLocalEvent(editId, withHost({ ...payload, id: editId })) || saveLocalEvent(withHost({ ...payload, id: editId }));
        } else {
          try {
            await base44.entities.Event.update(editId, payload);
          } catch {
            /* keep a local copy so the edit still shows */
          }
          const localPatch = withHost({ ...payload, id: editId });
          updateLocalEvent(editId, localPatch) || saveLocalEvent(localPatch);
        }
        navigate(`/events/${editId}`);
      } else {
        let created = null;
        try {
          created = await base44.entities.Event.create({
            ...payload,
            attendees_count: 0,
          });
        } catch {
          created = null;
        }
        const event = created?.id
          ? withHost({ attendees_count: 0, ...created })
          : withHost({
              ...payload,
              id: `event_local_${Date.now()}`,
              attendees_count: 0,
            });
        saveLocalEvent(event);
        navigate(`/events/${event.id}`);
      }
    } finally {
      setCreating(false);
    }
  };

  const previewEvent = {
    ...data,
    id: "preview",
    image: data.image || defaultEventImage(data.category),
    time: data.start_time,
    attendees_count: 0,
    host_name: user?.full_name || "You",
  };

  const canSearchPlace =
    data.location.trim() && data.city.trim() && data.country && !searchingPlace;

  return (
    <div className="max-w-app mx-auto min-h-screen flex flex-col bg-background">
      <header className="px-5 safe-pt pb-3 flex items-center gap-3">
        <button type="button" onClick={back} className="w-9 h-9 rounded-full flex items-center justify-center" aria-label="Back">
          <ArrowLeft className="w-5 h-5" strokeWidth={1.5} />
        </button>
        <div>
          <h1 className="font-display font-semibold text-lg">{editId ? "Edit event" : "Host an event"}</h1>
          <p className="text-xs text-muted-foreground">Step {step} of {TOTAL}</p>
        </div>
      </header>

      <div className="px-5 mb-5 flex gap-1.5">
        {Array.from({ length: TOTAL }).map((_, i) => (
          <div key={i} className={cn("h-1 flex-1 rounded-full", i < step ? "bg-primary" : "bg-border")} />
        ))}
      </div>

      <div className="flex-1 px-5 pb-6 overflow-y-auto">
        {step === 1 && (
          <>
            <h2 className="font-display font-bold text-lg">What is the meetup?</h2>
            <p className="text-sm text-muted-foreground mb-5">Keep it clear — women decide in seconds.</p>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Title *</Label>
                <Input
                  value={data.title}
                  onChange={(e) => set("title", e.target.value)}
                  placeholder="Sunset yoga at the caldera"
                  className="h-12"
                />
              </div>
              <div className="space-y-2">
                <Label>Category *</Label>
                <div className="flex flex-wrap gap-2">
                  {EVENT_CATEGORIES.map((c) => (
                    <Chip key={c} active={data.category === c} onClick={() => set("category", c)}>
                      {capitalize(c)}
                    </Chip>
                  ))}
                </div>
              </div>
              <div className="space-y-2">
                <Label>About *</Label>
                <Textarea
                  value={data.description}
                  onChange={(e) => set("description", e.target.value)}
                  placeholder="What you will do, who it is for, what to bring…"
                  rows={4}
                />
              </div>
            </div>
          </>
        )}

        {step === 2 && (
          <>
            <h2 className="font-display font-bold text-lg">When & where</h2>
            <p className="text-sm text-muted-foreground mb-5">Public spot only — never a private home.</p>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Date *</Label>
                <Input type="date" value={data.date} onChange={(e) => set("date", e.target.value)} className="h-12" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-2">
                  <Label>Starts *</Label>
                  <Input type="time" value={data.start_time} onChange={(e) => set("start_time", e.target.value)} className="h-12" />
                </div>
                <div className="space-y-2">
                  <Label>Ends</Label>
                  <Input type="time" value={data.end_time} onChange={(e) => set("end_time", e.target.value)} className="h-12" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-2">
                  <Label>City *</Label>
                  <Input
                    value={data.city}
                    onChange={(e) => setCityOrCountry("city", e.target.value)}
                    placeholder="Lisbon"
                    className="h-12"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Country *</Label>
                  <Select value={data.country} onValueChange={(v) => setCityOrCountry("country", v)}>
                    <SelectTrigger className="h-12"><SelectValue placeholder="Select" /></SelectTrigger>
                    <SelectContent>
                      {COUNTRIES.map((c) => (
                        <SelectItem key={c} value={c}>{c}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="space-y-2">
                <Label>Meeting point *</Label>
                <Input
                  value={data.location}
                  onChange={(e) => setMeetingPoint(e.target.value)}
                  placeholder="e.g. Café de Flore"
                  className="h-12"
                />
                <p className="text-xs text-muted-foreground">
                  Type a café or landmark — we’ll search the map as you type. Tap the pin to fine-tune.
                </p>
              </div>

              <Button
                type="button"
                variant="outline"
                className="w-full h-11"
                onClick={searchMeetingPlace}
                disabled={!canSearchPlace}
              >
                {searchingPlace ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" /> Searching map…
                  </>
                ) : (
                  <>
                    <MapPin className="w-4 h-4 mr-2" strokeWidth={1.5} /> Find on map
                  </>
                )}
              </Button>

              {placeError && (
                <p className="text-sm text-destructive">{placeError}</p>
              )}

              {placeResults.length > 0 && (
                <div className="space-y-2">
                  <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    Pick the right place
                  </p>
                  {placeResults.map((r, i) => {
                    const selected =
                      placeConfirmed &&
                      Number(data.lat) === Number(r.lat) &&
                      Number(data.lng) === Number(r.lon);
                    return (
                      <button
                        key={`${r.lat}-${r.lon}-${i}`}
                        type="button"
                        onClick={() => pickPlace(r)}
                        className={cn(
                          "w-full text-left rounded-2xl border p-3 transition",
                          selected
                            ? "border-primary bg-primary/8"
                            : "border-border bg-card hover:bg-muted/40"
                        )}
                      >
                        <div className="flex items-start gap-2">
                          {selected ? (
                            <Check className="w-4 h-4 text-primary shrink-0 mt-0.5" strokeWidth={2.5} />
                          ) : (
                            <MapPin className="w-4 h-4 text-muted-foreground shrink-0 mt-0.5" strokeWidth={1.5} />
                          )}
                          <span className="text-sm leading-snug line-clamp-2">{r.display}</span>
                        </div>
                      </button>
                    );
                  })}
                </div>
              )}

              {data.city.trim() && data.country && (
                <div className="space-y-2">
                  {placeConfirmed ? (
                    <p className="text-xs font-medium text-primary flex items-center gap-1.5">
                      <Check className="w-3.5 h-3.5" strokeWidth={2.5} />
                      Meeting point pinned — Directions will use this spot
                    </p>
                  ) : (
                    <p className="text-xs text-muted-foreground">
                      Tap the map to drop the meeting pin.
                    </p>
                  )}
                  <EventMap
                    compact
                    coords={placeConfirmed ? [Number(data.lat), Number(data.lng)] : undefined}
                    query={[data.location, data.city, data.country].filter(Boolean).join(", ")}
                    label={data.location || [data.city, data.country].join(", ")}
                    onPick={pickMapPin}
                    zoom={placeConfirmed ? 16 : 13}
                  />
                </div>
              )}

              <div className="space-y-2">
                <Label>How many can join? *</Label>
                <Input
                  type="number"
                  min="2"
                  max="200"
                  inputMode="numeric"
                  value={data.max_attendees}
                  onChange={(e) => set("max_attendees", e.target.value === "" ? "" : Number(e.target.value))}
                  placeholder="e.g. 8"
                  className="h-12"
                />
                <p className="text-xs text-muted-foreground">
                  Your number — guests will see “X going · max {Number(data.max_attendees) || "…" }”.
                </p>
              </div>
            </div>
          </>
        )}

        {step === 3 && (
          <>
            <h2 className="font-display font-bold text-lg">Ready to publish?</h2>
            <p className="text-sm text-muted-foreground mb-5">One last check — then you are live.</p>

            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Cover photo</Label>
                <p className="text-xs text-muted-foreground">Optional — we will use a category image if you skip.</p>
                {data.image ? (
                  <div className="relative rounded-2xl overflow-hidden h-36 border border-border">
                    <Image src={data.image} alt="Cover" fittingType="fill" className="w-full h-full" />
                    <button type="button" onClick={() => set("image", "")} className="absolute top-2 right-2 bg-white/90 rounded-full px-2 py-1 text-xs">
                      Remove
                    </button>
                  </div>
                ) : (
                  <label className="flex flex-col items-center justify-center h-28 rounded-2xl border border-dashed border-border cursor-pointer text-muted-foreground">
                    <Upload className="w-5 h-5 mb-1" strokeWidth={1.5} />
                    <span className="text-xs">Upload photo</span>
                    <input type="file" accept="image/*" onChange={onImage} className="hidden" />
                  </label>
                )}
              </div>

              <div className="space-y-2">
                <Label>Languages</Label>
                <InterestPicker options={LANGUAGES} selected={data.languages || []} onToggle={(v) => set("languages", v)} />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-2">
                  <Label>Min age</Label>
                  <Input
                    type="number"
                    min="18"
                    max="99"
                    value={data.age_min}
                    onChange={(e) => set("age_min", e.target.value)}
                    placeholder="18"
                    className="h-12"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Max age</Label>
                  <Input
                    type="number"
                    min="18"
                    max="99"
                    value={data.age_max}
                    onChange={(e) => set("age_max", e.target.value)}
                    placeholder="Any"
                    className="h-12"
                  />
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-sm">Paid tickets</p>
                    <p className="text-xs text-muted-foreground">Free meetup unless you add a ticket link</p>
                  </div>
                  <Switch
                    checked={data.pricing === "paid_external"}
                    onCheckedChange={(c) => set("pricing", c ? "paid_external" : "free")}
                  />
                </div>
                {data.pricing === "paid_external" && (
                  <Input
                    value={data.external_link}
                    onChange={(e) => set("external_link", e.target.value)}
                    placeholder="https://"
                    className="h-12"
                  />
                )}
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-sm">
                    {data.visibility === "public" ? "Open to join" : "Approve each request"}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {data.visibility === "public"
                      ? "Anyone can join instantly"
                      : "You review before they join"}
                  </p>
                </div>
                <Switch
                  checked={data.visibility === "public"}
                  onCheckedChange={(c) => set("visibility", c ? "public" : "approval")}
                />
              </div>

              <div className="rounded-2xl border border-border bg-card/60 p-4">
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">Preview</p>
                <div className="pointer-events-none">
                  <EventCard event={previewEvent} />
                </div>
                <p className="text-xs text-muted-foreground mt-3">
                  {fmtEventDate(data.date)}
                  {data.start_time ? ` · ${fmtEventTime(data.start_time)}` : ""}
                  {data.end_time ? `–${fmtEventTime(data.end_time)}` : ""}
                  {" · "}
                  {[data.location, data.city].filter(Boolean).join(", ")}
                </p>
              </div>

              <label className="flex items-start gap-3 cursor-pointer rounded-2xl border border-border p-4">
                <input
                  type="checkbox"
                  checked={data.agreed_rules}
                  onChange={(e) => set("agreed_rules", e.target.checked)}
                  className="mt-1 w-5 h-5 accent-primary shrink-0"
                />
                <span className="text-sm text-muted-foreground leading-relaxed">
                  <span className="inline-flex items-center gap-1.5 text-foreground font-medium">
                    <ShieldCheck className="w-4 h-4 text-primary" strokeWidth={1.5} />
                    Safety rules
                  </span>
                  <br />
                  Public meetup, friendship-focused — no dating or private home addresses.
                </span>
              </label>
            </div>
          </>
        )}
      </div>

      <div className="sticky bottom-0 px-5 py-4 bg-background/90 backdrop-blur border-t border-border flex gap-3">
        <Button variant="outline" className="flex-1" onClick={back}>
          {step === 1 ? "Cancel" : "Back"}
        </Button>
        {step < TOTAL ? (
          <Button className="flex-1" onClick={next} disabled={!valid}>
            Next
          </Button>
        ) : (
          <Button className="flex-1" onClick={finish} disabled={creating || !valid}>
            {creating ? "Publishing…" : editId ? "Save changes" : "Publish"}
          </Button>
        )}
      </div>
    </div>
  );
}
