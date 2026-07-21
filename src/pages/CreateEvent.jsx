import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Upload, ShieldCheck } from "lucide-react";
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
import { EVENT_CATEGORIES, defaultEventImage, capitalize, fmtEventDate } from "@/lib/event-options";
import { COUNTRIES, LANGUAGES } from "@/lib/profile-options";
import EventCard from "@/components/events/EventCard";

const TOTAL = 6;
const EMPTY = {
  title: "", category: "", description: "", date: "", start_time: "", end_time: "",
  city: "", country: "", location: "", image: "", max_attendees: 10,
  visibility: "public", pricing: "free", external_link: "", age_min: "", age_max: "",
  languages: [], agreed_rules: false,
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

export default function CreateEvent() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [step, setStep] = useState(1);
  const [data, setData] = useState(EMPTY);
  const [creating, setCreating] = useState(false);
  const editId = new URLSearchParams(window.location.search).get("edit");

  useEffect(() => {
    if (!editId) return;
    (async () => {
      try {
        const e = await base44.entities.Event.get(editId);
        setData({
          title: e.title || "", category: e.category || "", description: e.description || "",
          date: e.date || "", start_time: e.time || "", end_time: e.end_time || "",
          city: e.city || "", country: e.country || "", location: e.location || "",
          image: e.image || "", max_attendees: e.max_attendees || 10,
          visibility: e.visibility || "public", pricing: e.pricing || "free",
          external_link: e.external_link || "", age_min: e.age_min || "", age_max: e.age_max || "",
          languages: e.languages || [], agreed_rules: true,
        });
      } catch (err) { /* ignore */ }
    })();
  }, [editId]);

  const set = (k, v) => setData((d) => ({ ...d, [k]: v }));
  const toggleLang = (v) =>
    setData((d) => ({
      ...d,
      languages: d.languages.includes(v) ? d.languages.filter((x) => x !== v) : [...d.languages, v],
    }));

  const valid = useMemo(() => {
    if (step === 1) return data.title.trim() && data.category && data.description.trim();
    if (step === 2) return data.date && data.start_time && data.end_time && data.end_time > data.start_time;
    if (step === 3) return data.city.trim() && data.country && data.location.trim();
    if (step === 4) {
      const maxOk = Number(data.max_attendees) >= 1;
      const langsOk = data.languages.length > 0;
      const paidOk = data.pricing !== "paid_external" || data.external_link.trim();
      const ageOk = !data.age_min || !data.age_max || Number(data.age_max) >= Number(data.age_min);
      return maxOk && langsOk && paidOk && ageOk;
    }
    if (step === 5) return data.agreed_rules;
    return true;
  }, [step, data]);

  const back = () => (step === 1 ? navigate(-1) : setStep((s) => s - 1));
  const next = () => setStep((s) => s + 1);

  const onImage = async (e) => {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;
    const res = await base44.integrations.Core.UploadFile({ file });
    set("image", res.file_url);
  };

  const finish = async () => {
    setCreating(true);
    try {
      const payload = {
        title: data.title.trim(),
        category: data.category,
        description: data.description.trim(),
        date: data.date,
        time: data.start_time,
        end_time: data.end_time,
        city: data.city.trim(),
        country: data.country,
        location: data.location.trim(),
        image: data.image || defaultEventImage(data.category),
        max_attendees: Number(data.max_attendees),
        visibility: data.visibility,
        pricing: data.pricing,
        external_link: data.pricing === "paid_external" ? data.external_link.trim() : "",
        age_min: data.age_min ? Number(data.age_min) : null,
        age_max: data.age_max ? Number(data.age_max) : null,
        languages: data.languages,
        agreed_rules: true,
      };
      if (editId) {
        await base44.entities.Event.update(editId, payload);
      } else {
        await base44.entities.Event.create({ ...payload, host_name: user?.full_name || "Seluna host", host_id: user?.id, attendees_count: 0 });
      }
      navigate("/events");
    } finally {
      setCreating(false);
    }
  };

  const previewEvent = {
    ...data,
    image: data.image || defaultEventImage(data.category),
    time: data.start_time,
    attendees_count: 0,
    host_name: user?.full_name || "You",
  };

  return (
    <div className="max-w-md mx-auto min-h-screen flex flex-col bg-background">
      <header className="px-5 pt-12 pb-3 flex items-center gap-3">
        <button onClick={back} className="w-9 h-9 rounded-full flex items-center justify-center">
          <ArrowLeft className="w-5 h-5" strokeWidth={1.5} />
        </button>
        <div>
          <h1 className="font-display font-semibold text-lg">{editId ? "Edit event" : "Host an event"}</h1>
          <p className="text-xs text-muted-foreground">Step {step} of {TOTAL}</p>
        </div>
      </header>

      <div className="px-5 mb-5 flex gap-1.5">
        {Array.from({ length: TOTAL }).map((_, i) => (
          <div key={i} className={cn("h-1 flex-1 rounded-full", i < step ? "bg-[#A1846B]" : "bg-border")} />
        ))}
      </div>

      <div className="flex-1 px-5 pb-6 overflow-y-auto">
        {step === 1 && (
          <>
            <h2 className="font-display font-semibold text-xl">The basics</h2>
            <p className="text-sm text-muted-foreground mb-5">What's the event about?</p>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Event title *</Label>
                <Input value={data.title} onChange={(e) => set("title", e.target.value)} placeholder="Sunset yoga rooftop meetup" className="h-12" />
              </div>
              <div className="space-y-2">
                <Label>Category *</Label>
                <div className="flex flex-wrap gap-2">
                  {EVENT_CATEGORIES.map((c) => (
                    <Chip key={c} active={data.category === c} onClick={() => set("category", c)}>{capitalize(c)}</Chip>
                  ))}
                </div>
              </div>
              <div className="space-y-2">
                <Label>Description *</Label>
                <Textarea value={data.description} onChange={(e) => set("description", e.target.value)} placeholder="Tell women what to expect…" rows={4} />
              </div>
            </div>
          </>
        )}

        {step === 2 && (
          <>
            <h2 className="font-display font-semibold text-xl">Date & time</h2>
            <p className="text-sm text-muted-foreground mb-5">When does it happen?</p>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Date *</Label>
                <Input type="date" value={data.date} onChange={(e) => set("date", e.target.value)} className="h-12" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-2">
                  <Label>Start time *</Label>
                  <Input type="time" value={data.start_time} onChange={(e) => set("start_time", e.target.value)} className="h-12" />
                </div>
                <div className="space-y-2">
                  <Label>End time *</Label>
                  <Input type="time" value={data.end_time} onChange={(e) => set("end_time", e.target.value)} className="h-12" />
                </div>
              </div>
            </div>
          </>
        )}

        {step === 3 && (
          <>
            <h2 className="font-display font-semibold text-xl">Location</h2>
            <p className="text-sm text-muted-foreground mb-5">Where will you meet?</p>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-2">
                  <Label>City *</Label>
                  <Input value={data.city} onChange={(e) => set("city", e.target.value)} placeholder="Lisbon" className="h-12" />
                </div>
                <div className="space-y-2">
                  <Label>Country *</Label>
                  <Select value={data.country} onValueChange={(v) => set("country", v)}>
                    <SelectTrigger className="h-12"><SelectValue placeholder="Select" /></SelectTrigger>
                    <SelectContent>
                      {COUNTRIES.map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="space-y-2">
                <Label>Venue / meeting location *</Label>
                <Input value={data.location} onChange={(e) => set("location", e.target.value)} placeholder="A general spot — avoid private home addresses" className="h-12" />
                <p className="text-[11px] text-muted-foreground">Share a public meeting point; never a private home address.</p>
              </div>
            </div>
          </>
        )}

        {step === 4 && (
          <>
            <h2 className="font-display font-semibold text-xl">Details</h2>
            <p className="text-sm text-muted-foreground mb-5">Finalise the setup.</p>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Cover image *</Label>
                {data.image ? (
                  <div className="relative rounded-2xl overflow-hidden h-36 border border-border">
                    <Image src={data.image} alt="Cover" fittingType="fill" className="w-full h-full" />
                    <button onClick={() => set("image", "")} className="absolute top-2 right-2 bg-white/90 rounded-full px-2 py-1 text-xs">Remove</button>
                  </div>
                ) : (
                  <label className="flex flex-col items-center justify-center h-32 rounded-2xl border border-dashed border-border cursor-pointer text-muted-foreground">
                    <Upload className="w-5 h-5 mb-1" strokeWidth={1.5} />
                    <span className="text-xs">Upload cover image</span>
                    <input type="file" accept="image/*" onChange={onImage} className="hidden" />
                  </label>
                )}
              </div>

              <div className="space-y-2">
                <Label>Maximum attendees *</Label>
                <Input type="number" min="1" value={data.max_attendees} onChange={(e) => set("max_attendees", e.target.value)} className="h-12" />
              </div>

              <div className="flex items-center justify-between rounded-2xl border border-border p-4">
                <div>
                  <p className="font-medium text-sm">{data.visibility === "public" ? "Open to everyone" : "Approval required"}</p>
                  <p className="text-xs text-muted-foreground">{data.visibility === "public" ? "Anyone can join instantly" : "You approve each request"}</p>
                </div>
                <Switch checked={data.visibility === "public"} onCheckedChange={(c) => set("visibility", c ? "public" : "approval")} />
              </div>

              <div className="flex items-center justify-between rounded-2xl border border-border p-4">
                <div>
                  <p className="font-medium text-sm">{data.pricing === "free" ? "Free event" : "Paid externally"}</p>
                  <p className="text-xs text-muted-foreground">{data.pricing === "free" ? "No cost to join" : "Link to an external ticket page"}</p>
                </div>
                <Switch checked={data.pricing === "free"} onCheckedChange={(c) => set("pricing", c ? "free" : "paid_external")} />
              </div>

              {data.pricing === "paid_external" && (
                <div className="space-y-2">
                  <Label>External booking link *</Label>
                  <Input value={data.external_link} onChange={(e) => set("external_link", e.target.value)} placeholder="https://…" className="h-12" />
                </div>
              )}

              <div className="space-y-2">
                <Label>Age range (optional)</Label>
                <div className="grid grid-cols-2 gap-3">
                  <Input type="number" min="0" value={data.age_min} onChange={(e) => set("age_min", e.target.value)} placeholder="Min" className="h-12" />
                  <Input type="number" min="0" value={data.age_max} onChange={(e) => set("age_max", e.target.value)} placeholder="Max" className="h-12" />
                </div>
              </div>

              <div className="space-y-2">
                <Label>Languages spoken *</Label>
                <div className="flex flex-wrap gap-2">
                  {LANGUAGES.map((l) => (
                    <Chip key={l} active={data.languages.includes(l)} onClick={() => toggleLang(l)}>{l}</Chip>
                  ))}
                </div>
              </div>
            </div>
          </>
        )}

        {step === 5 && (
          <>
            <h2 className="font-display font-semibold text-xl">Community & safety</h2>
            <p className="text-sm text-muted-foreground mb-5">Please agree before publishing.</p>
            <div className="rounded-2xl border border-border bg-card p-4 space-y-3 text-sm">
              <div className="flex items-center gap-2 text-[#A1846B]"><ShieldCheck className="w-4 h-4" /><span className="font-medium">Seluna event guidelines</span></div>
              <ul className="space-y-2 text-muted-foreground list-disc pl-5">
                <li>This event is friendship and travel-focused — no dating, romantic, or commercial soliciting.</li>
                <li>Meet in public spaces; never share private home addresses.</li>
                <li>Be respectful and inclusive of all women in the community.</li>
                <li>Respect attendance limits and cancel your spot if you can't make it.</li>
                <li>You're responsible for the event and can remove attendees who break the rules.</li>
              </ul>
            </div>
            <label className="flex items-start gap-3 mt-4 cursor-pointer">
              <input type="checkbox" checked={data.agreed_rules} onChange={(e) => set("agreed_rules", e.target.checked)} className="mt-1 w-5 h-5 accent-[#A1846B]" />
              <span className="text-sm">I have read and agree to the Seluna community and safety rules.</span>
            </label>
          </>
        )}

        {step === 6 && (
          <>
            <h2 className="font-display font-semibold text-xl">Preview</h2>
            <p className="text-sm text-muted-foreground mb-5">This is how members will see your event.</p>
            <EventCard event={previewEvent} joined={false} onRsvp={() => {}} />
            <div className="rounded-2xl border border-border bg-card p-4 mt-5 space-y-2 text-sm">
              <Row label="Date">{fmtEventDate(data.date)}{data.start_time ? ` · ${data.start_time}` : ""}{data.end_time ? `–${data.end_time}` : ""}</Row>
              <Row label="Location">{[data.location, data.city, data.country].filter(Boolean).join(", ")}</Row>
              <Row label="Category"><span className="capitalize">{data.category}</span></Row>
              <Row label="Spots">{data.max_attendees} max</Row>
              <Row label="Joining">{data.visibility === "public" ? "Open to everyone" : "Approval required"}</Row>
              <Row label="Cost">{data.pricing === "free" ? "Free" : "Paid externally"}</Row>
              {data.age_min || data.age_max ? <Row label="Ages">{[data.age_min, data.age_max].filter(Boolean).join("–")}</Row> : null}
              {data.languages.length > 0 && <Row label="Languages">{data.languages.join(", ")}</Row>}
            </div>
          </>
        )}
      </div>

      <div className="sticky bottom-0 px-5 py-4 bg-background/90 backdrop-blur border-t border-border flex gap-3">
        <Button variant="outline" className="flex-1" onClick={back}>{step === 1 ? "Cancel" : "Back"}</Button>
        {step < TOTAL ? (
          <Button className="flex-1 bg-foreground text-background" onClick={next} disabled={!valid}>Next</Button>
        ) : (
          <Button className="flex-1 bg-foreground text-background" onClick={finish} disabled={creating}>{creating ? "Saving…" : editId ? "Save changes" : "Publish event"}</Button>
        )}
      </div>
    </div>
  );
}

function Row({ label, children }) {
  return (
    <div className="flex justify-between gap-4">
      <span className="text-muted-foreground">{label}</span>
      <span className="text-right font-medium">{children}</span>
    </div>
  );
}