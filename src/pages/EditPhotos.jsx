import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import SettingsPage from "@/components/profile/SettingsPage";
import PhotoManager from "@/components/profile/PhotoManager";
import { useAuth } from "@/lib/AuthContext";
import { base44 } from "@/api/base44Client";

export default function EditPhotos() {
  const navigate = useNavigate();
  const { user, checkUserAuth, patchUser } = useAuth();
  const [photos, setPhotos] = useState([]);
  const [mainPhoto, setMainPhoto] = useState(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!user) return;
    setPhotos(user.profile_photos || []);
    setMainPhoto(user.main_photo || null);
  }, [user]);

  const save = async () => {
    setError("");
    if (photos.length < 2) {
      setError("Add at least 2 photos.");
      return;
    }
    setSaving(true);
    const payload = {
      profile_photos: photos,
      main_photo: mainPhoto || photos[0] || null,
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
    <SettingsPage title="Photos">
      <p className="text-sm text-muted-foreground mb-4 leading-relaxed">
        Add clear photos so other women can recognise you.
      </p>
      <PhotoManager
        photos={photos}
        mainPhoto={mainPhoto}
        onChange={({ photos: next, mainPhoto: main }) => {
          setPhotos(next);
          setMainPhoto(main);
        }}
      />
      {error && <p className="text-sm text-destructive mt-3">{error}</p>}
      <Button className="w-full h-11 rounded-2xl mt-6" onClick={save} disabled={saving}>
        {saving && <Loader2 className="w-4 h-4 mr-2 animate-spin" />} Save photos
      </Button>
    </SettingsPage>
  );
}
