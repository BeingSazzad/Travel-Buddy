import React, { useState, useEffect } from "react";
import { useNavigate, Navigate } from "react-router-dom";
import { base44 } from "@/api/base44Client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Moon, Loader2, LogOut, ArrowRight } from "lucide-react";
import { useAuth } from "@/lib/AuthContext";
import { INTERESTS, TRAVEL_STYLES } from "@/lib/profile-options";
import InterestPicker from "@/components/profile/InterestPicker";
import PhotoManager from "@/components/profile/PhotoManager";

const INTRO_STEPS = ["Name", "Photos", "Interests"];

export default function ProfileSetup() {
  const { user, logout, patchUser } = useAuth();
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

  /* Edit is split into Settings-style pages under /profile/edit/* */
  if (isEditMode) {
    return <Navigate to="/profile" replace />;
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