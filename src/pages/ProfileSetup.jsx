import React, { useState } from "react";
import { base44 } from "@/api/base44Client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select, SelectTrigger, SelectContent, SelectItem, SelectValue,
} from "@/components/ui/select";
import { Moon, Loader2, LogOut, ArrowRight, ArrowLeft, Check } from "lucide-react";
import { useAuth } from "@/lib/AuthContext";
import {
  COUNTRIES, LANGUAGES, INTERESTS, TRAVEL_STYLES,
} from "@/lib/profile-options";
import InterestPicker from "@/components/profile/InterestPicker";
import PhotoManager from "@/components/profile/PhotoManager";

function getAge(dob) {
  const today = new Date();
  const birth = new Date(dob);
  let age = today.getFullYear() - birth.getFullYear();
  const m = today.getMonth() - birth.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) age--;
  return age;
}

const STEPS = ["About you", "Your travel", "Photos"];

export default function ProfileSetup() {
  const { logout } = useAuth();
  const [step, setStep] = useState(0);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const [profileName, setProfileName] = useState("");
  const [dob, setDob] = useState("");
  const [city, setCity] = useState("");
  const [country, setCountry] = useState("");
  const [nationality, setNationality] = useState("");
  const [languages, setLanguages] = useState([]);
  const [bio, setBio] = useState("");
  const [travelStyle, setTravelStyle] = useState([]);
  const [interests, setInterests] = useState([]);
  const [photos, setPhotos] = useState([]);
  const [mainPhoto, setMainPhoto] = useState(null);

  const age = dob ? getAge(dob) : null;

  const goNext = () => {
    setError("");
    if (step === 0) {
      if (!profileName.trim()) return setError("Enter your profile name");
      if (!dob) return setError("Enter your date of birth");
      if (age < 18) return setError("You must be 18 or older");
      if (!city.trim()) return setError("Enter your current city");
      if (!country) return setError("Select your country");
      if (!nationality) return setError("Select your nationality");
      if (languages.length === 0) return setError("Select at least one language");
      if (!bio.trim()) return setError("Write a short biography");
      setStep(1);
    } else if (step === 1) {
      if (travelStyle.length === 0) return setError("Select at least one travel style");
      if (interests.length === 0) return setError("Select at least one interest");
      setStep(2);
    }
  };

  const complete = async () => {
    setError("");
    if (photos.length < 2) return setError("Upload at least 2 photos");
    const finalMain = mainPhoto || photos[0];
    setSaving(true);
    try {
      await base44.auth.updateMe({
        profile_name: profileName.trim(),
        date_of_birth: dob,
        current_city: city.trim(),
        country,
        nationality,
        languages_spoken: languages,
        biography: bio.trim(),
        travel_style: travelStyle,
        interests,
        profile_photos: photos,
        main_photo: finalMain,
        profile_completed: true,
      });
      window.location.href = "/";
    } catch (err) {
      setError(err?.message || "Could not save your profile");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-md mx-auto px-5 py-8">
        {/* Header */}
        <div className="flex flex-col items-center mb-6">
          <Moon className="w-6 h-6 text-[#A1846B] mb-1" strokeWidth={1.5} />
          <h1 className="font-display font-semibold text-3xl tracking-[0.08em] text-[#A1846B]">SELUNA</h1>
        </div>

        {/* Stepper */}
        <div className="flex items-center justify-between mb-6">
          {STEPS.map((label, i) => (
            <div key={label} className="flex-1 flex items-center">
              <div className="flex flex-col items-center flex-1">
                <div
                  className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-medium transition ${
                    i < step
                      ? "bg-[#A1846B] text-white"
                      : i === step
                        ? "bg-[#A1846B] text-white ring-4 ring-[#A1846B]/20"
                        : "bg-muted text-muted-foreground"
                  }`}
                >
                  {i < step ? <Check className="w-3.5 h-3.5" /> : i + 1}
                </div>
                <span className={`text-[10px] mt-1 ${i === step ? "text-foreground font-medium" : "text-muted-foreground"}`}>
                  {label}
                </span>
              </div>
              {i < STEPS.length - 1 && (
                <div className={`h-0.5 flex-1 -mt-4 rounded ${i < step ? "bg-[#A1846B]" : "bg-muted"}`} />
              )}
            </div>
          ))}
        </div>

        <div className="bg-card rounded-2xl shadow-premium border border-border p-6">
          <h2 className="font-display font-semibold text-xl text-foreground mb-1">{STEPS[step]}</h2>

          {step === 0 && (
            <div className="space-y-4 mt-4">
              <div className="space-y-2">
                <Label htmlFor="profileName">Profile name</Label>
                <Input id="profileName" value={profileName} onChange={(e) => setProfileName(e.target.value)} className="h-11" placeholder="How others will see you" />
              </div>

              <div className="space-y-2">
                <Label htmlFor="dob">Date of birth{age !== null && age >= 0 ? ` · ${age} years old` : ""}</Label>
                <Input id="dob" type="date" value={dob} onChange={(e) => setDob(e.target.value)} className="h-11" />
              </div>

              <div className="space-y-2">
                <Label htmlFor="city">Current city</Label>
                <Input id="city" value={city} onChange={(e) => setCity(e.target.value)} className="h-11" placeholder="Where you live now" />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-2">
                  <Label>Country</Label>
                  <Select value={country} onValueChange={setCountry}>
                    <SelectTrigger className="h-11"><SelectValue placeholder="Select" /></SelectTrigger>
                    <SelectContent>
                      {COUNTRIES.map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Nationality</Label>
                  <Select value={nationality} onValueChange={setNationality}>
                    <SelectTrigger className="h-11"><SelectValue placeholder="Select" /></SelectTrigger>
                    <SelectContent>
                      {COUNTRIES.map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label>Languages spoken</Label>
                <InterestPicker options={LANGUAGES} selected={languages} onToggle={setLanguages} />
              </div>

              <div className="space-y-2">
                <Label htmlFor="bio">Short biography</Label>
                <Textarea id="bio" value={bio} onChange={(e) => setBio(e.target.value)} rows={4} placeholder="Tell the community a little about yourself..." />
              </div>
            </div>
          )}

          {step === 1 && (
            <div className="space-y-5 mt-4">
              <div className="space-y-2">
                <Label>Travel style</Label>
                <InterestPicker options={TRAVEL_STYLES} selected={travelStyle} onToggle={setTravelStyle} />
              </div>
              <div className="space-y-2">
                <Label>Interests</Label>
                <InterestPicker options={INTERESTS} selected={interests} onToggle={setInterests} />
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="mt-4">
              <PhotoManager
                photos={photos}
                mainPhoto={mainPhoto}
                onChange={({ photos, mainPhoto }) => { setPhotos(photos); setMainPhoto(mainPhoto); }}
              />
            </div>
          )}

          {error && (
            <div className="mt-4 p-3 rounded-lg bg-destructive/10 text-destructive text-sm">{error}</div>
          )}

          {/* Nav */}
          <div className="flex items-center gap-3 mt-6">
            {step > 0 && (
              <Button variant="outline" className="h-11" onClick={() => { setError(""); setStep(step - 1); }} disabled={saving}>
                <ArrowLeft className="w-4 h-4" /> Back
              </Button>
            )}
            {step < 2 ? (
              <Button className="h-11 flex-1" onClick={goNext}>
                Continue <ArrowRight className="w-4 h-4" />
              </Button>
            ) : (
              <Button className="h-11 flex-1" onClick={complete} disabled={saving}>
                {saving ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : null}
                {saving ? "Saving..." : "Complete profile"}
              </Button>
            )}
          </div>
        </div>

        <button
          onClick={() => logout()}
          className="w-full text-center text-sm text-muted-foreground mt-6 hover:text-foreground"
        >
          <LogOut className="w-3.5 h-3.5 inline mr-1.5" />Log out
        </button>
      </div>
    </div>
  );
}