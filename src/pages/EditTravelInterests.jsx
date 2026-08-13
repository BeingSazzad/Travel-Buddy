import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Loader2 } from "lucide-react";
import SettingsPage from "@/components/profile/SettingsPage";
import InterestPicker from "@/components/profile/InterestPicker";
import { useAuth } from "@/lib/AuthContext";
import { base44 } from "@/api/base44Client";
import { INTERESTS, LANGUAGES, TRAVEL_STYLES } from "@/lib/profile-options";

export default function EditTravelInterests() {
  const navigate = useNavigate();
  const { user, checkUserAuth, patchUser } = useAuth();
  const [languages, setLanguages] = useState([]);
  const [travelStyle, setTravelStyle] = useState([]);
  const [interests, setInterests] = useState([]);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!user) return;
    setLanguages(user.languages_spoken || []);
    setTravelStyle(user.travel_style || []);
    setInterests(user.interests || []);
  }, [user]);

  const save = async () => {
    setSaving(true);
    const payload = {
      languages_spoken: languages,
      travel_style: travelStyle,
      interests,
    };
    try {
      await base44.auth.updateMe(payload);
      try {
        await checkUserAuth();
      } catch {
        patchUser(payload);
      }
      navigate("/profile");
    } catch {
      patchUser(payload);
      navigate("/profile");
    } finally {
      setSaving(false);
    }
  };

  return (
    <SettingsPage title="Preferences">
      <p className="text-sm text-muted-foreground mb-4 leading-relaxed">
        Languages, travel style, and interests — so the right women find you.
      </p>
      <div className="space-y-5">
        <div className="space-y-2">
          <Label className="text-sm font-medium">Languages</Label>
          <InterestPicker options={LANGUAGES} selected={languages} onToggle={setLanguages} />
        </div>
        <div className="space-y-2">
          <Label className="text-sm font-medium">Travel style</Label>
          <InterestPicker options={TRAVEL_STYLES} selected={travelStyle} onToggle={setTravelStyle} />
        </div>
        <div className="space-y-2">
          <Label className="text-sm font-medium">Interests</Label>
          <InterestPicker options={INTERESTS} selected={interests} onToggle={setInterests} />
        </div>
      </div>
      <Button className="w-full h-11 rounded-2xl mt-6" onClick={save} disabled={saving}>
        {saving && <Loader2 className="w-4 h-4 mr-2 animate-spin" />} Save preferences
      </Button>
    </SettingsPage>
  );
}
