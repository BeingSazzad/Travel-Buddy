import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Switch } from "@/components/ui/switch";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import SettingsPage from "@/components/profile/SettingsPage";
import { useAuth } from "@/lib/AuthContext";
import { base44 } from "@/api/base44Client";

const LOC = [
  { value: "exact_city", label: "Show exact city" },
  { value: "approximate", label: "Show approximate location only" },
  { value: "hidden", label: "Hide current location" },
];

function Toggle({ id, label, desc, checked, onCheck }) {
  return (
    <div className="flex items-start justify-between gap-4 py-3 border-b border-border last:border-0">
      <div className="flex-1">
        <Label htmlFor={id} className="text-sm font-medium">{label}</Label>
        {desc && <p className="text-sm text-muted-foreground mt-0.5 leading-normal">{desc}</p>}
      </div>
      <Switch id={id} checked={checked} onCheckedChange={onCheck} />
    </div>
  );
}

export default function PrivacySettings() {
  const navigate = useNavigate();
  const { user, checkUserAuth, patchUser } = useAuth();
  const [loc, setLoc] = useState(user?.location_visibility || "approximate");
  const [showAge, setShowAge] = useState(user?.show_age !== false);
  const [showTrips, setShowTrips] = useState(user?.show_upcoming_trips !== false);
  const [allowMatches, setAllowMatches] = useState(user?.allow_match_suggestions !== false);
  const [allowInvitations, setAllowInvitations] = useState(user?.allow_event_invitations !== false);
  const [saving, setSaving] = useState(false);

  const save = async () => {
    setSaving(true);
    const payload = {
      location_visibility: loc,
      show_age: showAge,
      show_upcoming_trips: showTrips,
      allow_match_suggestions: allowMatches,
      allow_event_invitations: allowInvitations,
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
    <SettingsPage title="Privacy">
      <p className="text-sm text-muted-foreground mb-5 leading-relaxed">
        Control what other members can see about you.
      </p>
      <div className="space-y-5">
        <div className="space-y-2">
          <Label>Location visibility</Label>
          <RadioGroup value={loc} onValueChange={setLoc} className="gap-2">
            {LOC.map((o) => (
              <label
                key={o.value}
                className={`flex items-center gap-3 p-3 rounded-2xl border cursor-pointer ${loc === o.value ? "border-primary bg-primary/5" : "border-border"}`}
              >
                <RadioGroupItem value={o.value} />
                <span className="text-sm">{o.label}</span>
              </label>
            ))}
          </RadioGroup>
        </div>
        <div>
          <Toggle id="age" label="Show my age" desc="Display your age on your profile" checked={showAge} onCheck={setShowAge} />
          <Toggle id="trips" label="Show upcoming trips" desc="Let others see your planned trips" checked={showTrips} onCheck={setShowTrips} />
          <Toggle id="matches" label="Allow match suggestions" desc="Receive suggested travel companions" checked={allowMatches} onCheck={setAllowMatches} />
          <Toggle id="invitations" label="Allow event invitations" desc="Other members can invite you to events" checked={allowInvitations} onCheck={setAllowInvitations} />
        </div>
        <Button className="w-full h-11 rounded-2xl" onClick={save} disabled={saving}>
          {saving && <Loader2 className="w-4 h-4 mr-2 animate-spin" />} Save changes
        </Button>
      </div>
    </SettingsPage>
  );
}
