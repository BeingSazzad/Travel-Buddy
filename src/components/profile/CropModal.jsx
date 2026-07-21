import React, { useState, useCallback } from "react";
import Cropper from "react-easy-crop";
import { Button } from "@/components/ui/button";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter,
} from "@/components/ui/dialog";
import { Slider } from "@/components/ui/slider";
import { Loader2 } from "lucide-react";

async function getCroppedImg(imageSrc, pixelCrop) {
  const image = new Image();
  image.src = imageSrc;
  await new Promise((resolve, reject) => {
    image.onload = resolve;
    image.onerror = reject;
  });

  const canvas = document.createElement("canvas");
  canvas.width = 600;
  canvas.height = 600;
  const ctx = canvas.getContext("2d");
  ctx.fillStyle = "#ffffff";
  ctx.fillRect(0, 0, 600, 600);

  const side = Math.min(pixelCrop.width, pixelCrop.height);
  ctx.drawImage(
    image,
    pixelCrop.x, pixelCrop.y, side, side,
    0, 0, 600, 600
  );

  return new Promise((resolve) => {
    canvas.toBlob((blob) => resolve(blob), "image/jpeg", 0.9);
  });
}

export default function CropModal({ imageSrc, onClose, onCropped }) {
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [area, setArea] = useState(null);
  const [busy, setBusy] = useState(false);

  const onCropComplete = useCallback((_, pixels) => setArea(pixels), []);

  const confirm = async () => {
    if (!area || busy) return;
    setBusy(true);
    try {
      const blob = await getCroppedImg(imageSrc, area);
      await onCropped(blob);
      onClose();
    } finally {
      setBusy(false);
    }
  };

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="max-w-sm">
        <DialogHeader>
          <DialogTitle>Crop your photo</DialogTitle>
        </DialogHeader>
        <div className="relative w-full h-64 bg-muted rounded-lg overflow-hidden">
          <Cropper
            image={imageSrc}
            crop={crop}
            zoom={zoom}
            aspect={1}
            onCropChange={setCrop}
            onZoomChange={setZoom}
            onCropComplete={onCropComplete}
          />
        </div>
        <div className="px-1">
          <p className="text-xs text-muted-foreground mb-2">Zoom</p>
          <Slider
            value={[zoom]}
            min={1}
            max={3}
            step={0.1}
            onValueChange={(v) => setZoom(v[0])}
          />
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose} disabled={busy}>Cancel</Button>
          <Button onClick={confirm} disabled={busy || !area}>
            {busy ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : null}
            {busy ? "Saving..." : "Use photo"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}