import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { base44 } from "@/api/base44Client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select, SelectTrigger, SelectContent, SelectItem, SelectValue,
} from "@/components/ui/select";
import { Moon, Loader2, LogOut, ArrowRight, ArrowLeft, Save } from "lucide-react";
import { useAuth } from "@/lib/AuthContext";
import {
  COUNTRIES, LANGUAGES, INTERESTS, TRAVEL_STYLES,
} from "@/lib/profile-options";
import InterestPicker from "@/components/profile/InterestPicker";
import PhotoManager from "@/components/profile/PhotoManager";
import ScrollPage, { ScrollPageHeader, ScrollPageBody } from "@/components/common/ScrollPage";

function getAge(dob) {
  if (!dob) return null;
  const today = new Date();
  const birth = new Date(dob);
  let age = today.getFullYear() - birth.getFullYear();
  const m = today.getMonth() - birth.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) age--;
  return age;
}

const INTRO_STEPS = ["Name", "Photos", "Interests"];

export default function ProfileSetup() {
  const { user, logout, checkUserAuth, patchUser } = useAuth();
  const navigate = useNavigate();
  const isEditMode = !!user?.profile_completed;

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

  // Pre-populate when user data is available
  useEffect(() => {
    if (!user) return;
    setProfileName(user.profile_name || user.full_name || user.first_name || "");
    setDob((user.date_of_birth || "").slice(0, 10));
    setCity(user.current_city || "");
    setCountry(user.country || "");
    setNationality(user.nationality || "");
    setLanguages(user.languages_spoken || []);
    setBio(user.biography || "");
    setTravelStyle(user.travel_style || []);
    setInterests(user.interests || []);
    setPhotos(user.profile_photos || []);
    setMainPhoto(user.main_photo || null);
  }, [user]);

  const age = dob ? getAge(dob) : null;

  const finishBasics = async ({ skip = false } = {}) => {
    setError("");
    setSaving(true);
    try {
      const finalMain = mainPhoto || photos[0] || null;
      const payload = {
        profile_name: profileName.trim() || user?.first_name || "Member",
        date_of_birth: dob || undefined,
        current_city: city.trim() || undefined,
        country: country || undefined,
        nationality: nationality || undefined,
        languages_spoken: languages,
        biography: bio.trim() || undefined,
        travel_style: travelStyle,
        interests,
        profile_photos: photos,
        main_photo: finalMain,
        location_visibility: "approximate",
        show_age: true,
        show_upcoming_trips: true,
        allow_match_suggestions: true,
        allow_event_invitations: true,
        allow_notifications: true,
        profile_completed: true,
        profile_basics_skipped: skip,
      };
      try {
        await base44.auth.updateMe(payload);
      } catch (apiErr) {
        console.warn("API updateMe failed during profile setup, applying locally", apiErr);
      }
      patchUser(payload);
      navigate(user?.subscription_status === "active" || user?.subscription_status === "cancelled_active" ? "/" : "/subscription", {
        replace: true,
      });
    } catch (err) {
      setError(err?.message || "Could not save your profile");
    } finally {
      setSaving(false);
    }
  };

  const saveProfile = async () => {
    setError("");
    const finalMain = mainPhoto || photos[0];
    setSaving(true);
    try {
      const payload = {
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
      };
      try {
        await base44.auth.updateMe(payload);
      } catch (apiErr) {
        console.warn("API updateMe failed during profile setup, applying locally", apiErr);
      }
      patchUser(payload);
      try {
        await checkUserAuth();
      } catch {
        /* keep local patch */
      }
      navigate("/profile");
    } catch (err) {
      setError(err?.message || "Could not save your profile");
    } finally {
      setSaving(false);
    }
  };

  /* ─────────────────────────────────────────────────────────────
     EDIT MODE: Clean Single-Page Form (No 1-2-3-4 Stepper!)
   ───────────────────────────────────────────────────────────── */
  if (isEditMode) {
    return (
      <ScrollPage>
        <ScrollPageHeader className="justify-between">
          <div className="flex items-center gap-3 min-w-0">
            <button
              onClick={() => navigate(-1)}
              className="w-9 h-9 rounded-full flex items-center justify-center active:scale-95 transition border border-border bg-card shrink-0"
            >
              <ArrowLeft className="w-5 h-5 text-foreground" strokeWidth={1.75} />
            </button>
            <h1 className="font-display font-bold text-lg truncate">Edit Profile</h1>
          </div>
          <Button
            onClick={saveProfile}
            disabled={saving}
            variant="primary"
            size="sm"
            className="rounded-full px-4 h-9 shrink-0"
          >
            {saving ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Save className="w-3.5 h-3.5 mr-1" />}
            Save
          </Button>
        </ScrollPageHeader>

        <ScrollPageBody className="px-0">
          <div className="px-5 space-y-6 max-w-app mx-auto w-full">
          {error && (
            <div className="p-3 rounded-2xl bg-destructive/10 text-destructive text-xs font-medium leading-relaxed">
              {error}
            </div>
          )}

          {/* Section 1: Photos */}
          <div className="bg-card rounded-2xl border border-border/80 shadow-soft p-5 space-y-3">
            <h2 className="font-display font-semibold text-sm text-foreground">Photos</h2>
            <PhotoManager
              photos={photos}
              mainPhoto={mainPhoto}
              onChange={({ photos, mainPhoto }) => { setPhotos(photos); setMainPhoto(mainPhoto); }}
            />
          </div>

          {/* Section 2: Personal Details */}
          <div className="bg-card rounded-2xl border border-border/80 shadow-soft p-5 space-y-4">
            <h2 className="font-display font-semibold text-sm text-foreground">Personal Details</h2>

            <div className="space-y-1.5">
              <Label htmlFor="profileName" className="text-xs font-medium">Profile name</Label>
              <Input
                id="profileName"
                value={profileName}
                onChange={(e) => setProfileName(e.target.value)}
                className="h-11 rounded-2xl border-border/80"
                placeholder="How others will see you"
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="dob" className="text-xs font-medium">
                Date of birth{age !== null && age >= 0 ? ` · ${age} years old` : ""}
              </Label>
              <Input
                id="dob"
                type="date"
                value={dob}
                onChange={(e) => setDob(e.target.value)}
                className="h-11 rounded-2xl border-border/80"
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="city" className="text-xs font-medium">Current city</Label>
              <Input
                id="city"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                className="h-11 rounded-2xl border-border/80"
                placeholder="Where you live now"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label className="text-xs font-medium">Country</Label>
                <Select value={country} onValueChange={setCountry}>
                  <SelectTrigger className="h-11 rounded-2xl border-border/80"><SelectValue placeholder="Select" /></SelectTrigger>
                  <SelectContent>
                    {COUNTRIES.map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs font-medium">Nationality</Label>
                <Select value={nationality} onValueChange={setNationality}>
                  <SelectTrigger className="h-11 rounded-2xl border-border/80"><SelectValue placeholder="Select" /></SelectTrigger>
                  <SelectContent>
                    {COUNTRIES.map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs font-medium">Languages spoken</Label>
              <InterestPicker options={LANGUAGES} selected={languages} onToggle={setLanguages} />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="bio" className="text-xs font-medium">Biography</Label>
              <Textarea
                id="bio"
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                rows={3}
                className="rounded-2xl border-border/80 text-xs"
                placeholder="Tell the community a little about yourself..."
              />
            </div>
          </div>

          {/* Section 3: Travel & Interests */}
          <div className="bg-card rounded-2xl border border-border/80 shadow-soft p-5 space-y-4">
            <h2 className="font-display font-semibold text-sm text-foreground">Travel Style & Interests</h2>

            <div className="space-y-2">
              <Label className="text-xs font-medium">Travel style</Label>
              <p className="text-[11px] text-muted-foreground">Tap chips to select — change anytime here.</p>
              <InterestPicker options={TRAVEL_STYLES} selected={travelStyle} onToggle={setTravelStyle} />
            </div>

            <div className="space-y-2">
              <Label className="text-xs font-medium">Interests</Label>
              <p className="text-[11px] text-muted-foreground">Choose from the list below.</p>
              <InterestPicker options={INTERESTS} selected={interests} onToggle={setInterests} />
            </div>
          </div>

          {/* Save Button */}
          <Button onClick={saveProfile} disabled={saving} variant="primary" className="w-full">
            {saving ? (
              <><Loader2 className="w-4 h-4 mr-2 animate-spin" />Saving profile...</>
            ) : (
              "Save Changes"
            )}
          </Button>
          </div>
        </ScrollPageBody>
      </ScrollPage>
    );
  }

  /* ─────────────────────────────────────────────────────────────
     POST-SIGNUP BASICS: Photos + Interests — fully skippable
     (Marketing onboarding stays before signup, after splash)
   ───────────────────────────────────────────────────────────── */
  return (
    <div className="min-h-screen gradient-app-bg font-body flex flex-col">
      <div className="w-full max-w-md mx-auto flex-1 flex flex-col px-5 pt-4 pb-8 safe-pt safe-pb">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-2">
            <Moon className="w-5 h-5 text-primary" strokeWidth={1.5} />
            <span className="font-display font-bold text-sm tracking-[0.12em]">SELUNA</span>
          </div>
          <button
            type="button"
            onClick={() => finishBasics({ skip: true })}
            disabled={saving}
            className="text-sm font-medium text-muted-foreground hover:text-foreground"
          >
            Skip
          </button>
        </div>

        <header className="mb-6 text-left">
          <p className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground mb-2">
            {step + 1} / {INTRO_STEPS.length}
          </p>
          <h1 className="text-[1.65rem] font-display font-bold tracking-tight text-foreground leading-tight">
            {step === 0 && "What should we call you?"}
            {step === 1 && "Add a few photos"}
            {step === 2 && "What are you into?"}
          </h1>
          <p className="text-sm text-muted-foreground leading-relaxed mt-2.5 max-w-[34ch]">
            {step === 0 && "A first name is enough. Skip anything and edit later in Profile."}
            {step === 1 && "A clear face photo helps women recognise you. You can skip and add later."}
            {step === 2 && "Pick a few interests — or skip and edit anytime in Profile."}
          </p>
        </header>

        <div className="flex items-center gap-1.5 mb-6">
          {INTRO_STEPS.map((_, i) => (
            <span
              key={i}
              className={`h-1 rounded-full transition-all ${i === step ? "w-7 bg-primary" : i < step ? "w-4 bg-primary/40" : "w-4 bg-border"}`}
            />
          ))}
        </div>

        <div className="flex-1">
          {step === 0 && (
            <div className="space-y-1.5">
              <Label htmlFor="introName" className="text-xs font-semibold text-foreground/85">
                Display name
              </Label>
              <Input
                id="introName"
                value={profileName}
                onChange={(e) => setProfileName(e.target.value)}
                className="auth-input"
                placeholder="Clara"
                autoFocus
              />
            </div>
          )}

          {step === 1 && (
            <PhotoManager
              photos={photos}
              mainPhoto={mainPhoto}
              onChange={({ photos: next, mainPhoto: main }) => {
                setPhotos(next);
                setMainPhoto(main);
              }}
            />
          )}

          {step === 2 && (
            <div className="space-y-5">
              <div className="space-y-2">
                <Label className="text-xs font-semibold text-foreground/85">Travel style</Label>
                <InterestPicker options={TRAVEL_STYLES} selected={travelStyle} onToggle={setTravelStyle} />
              </div>
              <div className="space-y-2">
                <Label className="text-xs font-semibold text-foreground/85">Interests</Label>
                <InterestPicker options={INTERESTS} selected={interests} onToggle={setInterests} />
              </div>
            </div>
          )}

          {error && (
            <div className="mt-4 p-3 rounded-2xl bg-destructive/10 text-destructive text-xs font-medium">
              {error}
            </div>
          )}
        </div>

        <div className="mt-8 space-y-3">
          {step < 2 ? (
            <Button
              type="button"
              variant="primary"
              className="w-full"
              onClick={() => setStep(step + 1)}
            >
              Continue <ArrowRight className="w-4 h-4" />
            </Button>
          ) : (
            <Button
              type="button"
              variant="primary"
              className="w-full"
              disabled={saving}
              onClick={() => finishBasics({ skip: false })}
            >
              {saving ? (
                <><Loader2 className="w-4 h-4 mr-2 animate-spin" />Saving…</>
              ) : (
                "Continue"
              )}
            </Button>
          )}

          <button
            type="button"
            onClick={() => (step < 2 ? setStep(step + 1) : finishBasics({ skip: true }))}
            disabled={saving}
            className="w-full text-center text-sm text-muted-foreground hover:text-foreground py-1"
          >
            {step < 2 ? "Skip" : "Skip for now"}
          </button>
        </div>

        <button
          type="button"
          onClick={() => logout()}
          className="w-full text-center text-xs text-muted-foreground mt-6 hover:text-foreground"
        >
          <LogOut className="w-3.5 h-3.5 inline mr-1.5" />Log out
        </button>
      </div>
    </div>
  );
}