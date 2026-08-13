import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select, SelectTrigger, SelectContent, SelectItem, SelectValue,
} from "@/components/ui/select";
import { Loader2 } from "lucide-react";
import SettingsPage from "@/components/profile/SettingsPage";
import { useAuth } from "@/lib/AuthContext";
import { base44 } from "@/api/base44Client";
import { COUNTRIES } from "@/lib/profile-options";

function getAge(dob) {
  if (!dob) return null;
  const today = new Date();
  const birth = new Date(dob);
  let age = today.getFullYear() - birth.getFullYear();
  const m = today.getMonth() - birth.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) age--;
  return age;
}

export default function EditPersonalDetails() {
  const navigate = useNavigate();
  const { user, checkUserAuth, patchUser } = useAuth();
  const [profileName, setProfileName] = useState("");
  const [dob, setDob] = useState("");
  const [city, setCity] = useState("");
  const [country, setCountry] = useState("");
  const [bio, setBio] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!user) return;
    setProfileName(user.profile_name || user.full_name || user.first_name || "");
    setDob((user.date_of_birth || "").slice(0, 10));
    setCity(user.current_city || "");
    setCountry(user.country || user.nationality || "");
    setBio(user.biography || "");
  }, [user]);

  const age = dob ? getAge(dob) : null;

  const save = async () => {
    setSaving(true);
    const payload = {
      profile_name: profileName.trim(),
      date_of_birth: dob,
      current_city: city.trim(),
      country,
      nationality: country,
      biography: bio.trim(),
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
    <SettingsPage title="Personal details">
      <p className="text-sm text-muted-foreground mb-4 leading-relaxed">
        Your name, location, and a short intro.
      </p>
      <div className="space-y-4">
        <div className="space-y-1.5">
          <Label htmlFor="profileName" className="text-sm font-medium">Profile name</Label>
          <Input
            id="profileName"
            value={profileName}
            onChange={(e) => setProfileName(e.target.value)}
            className="h-11 rounded-2xl"
            placeholder="How others will see you"
          />
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="dob" className="text-sm font-medium">
            Date of birth{age != null && age >= 0 ? ` · ${age} years old` : ""}
          </Label>
          <Input
            id="dob"
            type="date"
            value={dob}
            onChange={(e) => setDob(e.target.value)}
            className="h-11 rounded-2xl"
          />
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="city" className="text-sm font-medium">Current city</Label>
          <Input
            id="city"
            value={city}
            onChange={(e) => setCity(e.target.value)}
            className="h-11 rounded-2xl"
            placeholder="Where you live now"
          />
        </div>

        <div className="space-y-1.5">
          <Label className="text-sm font-medium">Country</Label>
          <Select value={country} onValueChange={setCountry}>
            <SelectTrigger className="h-11 rounded-2xl"><SelectValue placeholder="Select" /></SelectTrigger>
            <SelectContent>
              {COUNTRIES.map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="bio" className="text-sm font-medium">About</Label>
          <Textarea
            id="bio"
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            rows={4}
            className="rounded-2xl text-sm"
            placeholder="Tell the community a little about yourself…"
          />
        </div>
      </div>

      <Button className="w-full h-11 rounded-2xl mt-6" onClick={save} disabled={saving}>
        {saving && <Loader2 className="w-4 h-4 mr-2 animate-spin" />} Save details
      </Button>
    </SettingsPage>
  );
}
