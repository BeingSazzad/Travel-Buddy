import React, { useState } from "react";
import { Switch } from "@/components/ui/switch";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import ProfileSheet from "@/components/profile/ProfileSheet";
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
        <Label className="text-sm font-medium">{label}</Label>
        {desc && <p className="text-xs text-muted-foreground mt-0.5">{desc}</p>}
      </div>
      <Switch id={id} checked={checked} onCheckedChange={onCheck} />
    </div>
  );
}

export default function PrivacySheet({ onClose }) {
  const { user, checkUserAuth } = useAuth();
  const [loc, setLoc] = useState(user?.location_visibility || "approximate");
  const [showAge, setShowAge] = useState(!!user?.show_age);
  const [showTrips, setShowTrips] = useState(!!user?.show_upcoming_trips);
  const [saving, setSaving] = useState(false);

  const save = async () => {
    setSaving(true);
    try {
      await base44.auth.updateMe({ location_visibility: loc, show_age: showAge, show_upcoming_trips: showTrips });
      await checkUserAuth();
      onClose();
    } catch {
      alert("Could not save settings.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <ProfileSheet title="Privacy" onClose={onClose}>
      <div className="space-y-4">
        <div className="space-y-2">
          <Label>Location visibility</Label>
          <RadioGroup value={loc} onValueChange={setLoc} className="gap-2">
            {LOC.map((o) => (
              <label
                key={o.value}
                className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer ${loc === o.value ? "border-primary bg-primary/5" : "border-border"}`}
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
        </div>
        <Button className="w-full h-11" onClick={save} disabled={saving}>
          {saving && <Loader2 className="w-4 h-4 mr-2 animate-spin" />} Save changes
        </Button>
      </div>
    </ProfileSheet>
  );
}
