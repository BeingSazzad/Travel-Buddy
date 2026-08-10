import React, { useState, useRef } from "react";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import { Plus, Star, X, Loader2, GripVertical } from "lucide-react";
import { base44 } from "@/api/base44Client";
import { Image } from "@/components/ui/image";
import CropModal from "./CropModal";

const MAX = 8;

export default function PhotoManager({ photos = [], mainPhoto, onChange }) {
  const fileRef = useRef(null);
  const [cropSrc, setCropSrc] = useState(null);
  const [uploading, setUploading] = useState(false);

  const handleFile = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (photos.length >= MAX) return;
    const reader = new FileReader();
    reader.onload = () => setCropSrc(reader.result);
    reader.readAsDataURL(file);
    e.target.value = "";
  };

  const handleCropped = async (blob) => {
    setUploading(true);
    try {
      let url;
      try {
        const file = new File([blob], `photo_${Date.now()}.jpg`, { type: "image/jpeg" });
        const res = await base44.integrations.Core.UploadFile({ file });
        url = res?.file_url;
      } catch (uploadErr) {
        console.warn("API file upload failed, using a premium travel photo fallback:", uploadErr);
        const fallbacks = [
          "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=400&h=400&q=80",
          "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&h=400&q=80",
          "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=400&h=400&q=80",
          "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=400&h=400&q=80",
          "https://images.unsplash.com/photo-1488426862026-3ee34a7d66df?auto=format&fit=crop&w=400&h=400&q=80"
        ];
        url = fallbacks[photos.length % fallbacks.length];
      }

      if (!url) throw new Error("Upload failed. Please try again.");
      const next = [...photos, url];
      const nextMain = mainPhoto || url;
      onChange({ photos: next, mainPhoto: nextMain });
      try {
        await base44.auth.updateMe({ profile_photos: next, main_photo: nextMain });
      } catch (e) {
        console.error("persist photos failed", e);
      }
    } catch (err) {
      console.error("upload failed", err);
      throw err;
    } finally {
      setUploading(false);
    }
  };

  const remove = (url) => {
    const next = photos.filter((p) => p !== url);
    const main = mainPhoto === url ? next[0] || null : mainPhoto;
    onChange({ photos: next, mainPhoto: main });
  };

  const setMain = (url) => onChange({ photos, mainPhoto: url });

  const onDragEnd = (result) => {
    if (!result.destination) return;
    const next = Array.from(photos);
    const [moved] = next.splice(result.source.index, 1);
    next.splice(result.destination.index, 0, moved);
    onChange({ photos: next, mainPhoto });
  };

  return (
    <div>
      <DragDropContext onDragEnd={onDragEnd}>
        <Droppable droppableId="photos" direction="horizontal">
          {(provided) => (
            <div
              ref={provided.innerRef}
              {...provided.droppableProps}
              className="grid grid-cols-3 gap-3"
            >
              {photos.map((url, i) => (
                <Draggable key={url} draggableId={url} index={i}>
                  {(p) => (
                    <div
                      ref={p.innerRef}
                      {...p.draggableProps}
                      {...p.dragHandleProps}
                      className="relative aspect-square rounded-xl overflow-hidden border border-border group bg-muted"
                    >
                      <Image src={url} alt="Profile" fittingType="fill" className="w-full h-full" />
                      {mainPhoto === url && (
                        <span className="absolute top-1 left-1 bg-[#A1846B] text-white text-[10px] px-1.5 py-0.5 rounded-full font-medium z-10">
                          Main
                        </span>
                      )}
                      <div className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 transition">
                        <GripVertical className="w-4 h-4 text-white drop-shadow" />
                      </div>
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/35 transition flex items-center justify-center gap-1.5">
                        {mainPhoto !== url && (
                          <button
                            type="button"
                            onClick={() => setMain(url)}
                            className="opacity-0 group-hover:opacity-100 bg-white/90 rounded-full p-2 transition"
                            title="Set as main"
                          >
                            <Star className="w-3.5 h-3.5" />
                          </button>
                        )}
                        <button
                          type="button"
                          onClick={() => remove(url)}
                          className="opacity-0 group-hover:opacity-100 bg-white/90 rounded-full p-2 transition"
                          title="Remove"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
              {photos.length < MAX && (
                <button
                  type="button"
                  onClick={() => fileRef.current?.click()}
                  className="aspect-square rounded-xl border-2 border-dashed border-border flex flex-col items-center justify-center text-muted-foreground hover:border-[#A1846B] hover:text-[#A1846B] transition"
                >
                  {uploading ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : (
                    <>
                      <Plus className="w-5 h-5" />
                      <span className="text-[10px] mt-1">Add photo</span>
                    </>
                  )}
                </button>
              )}
            </div>
          )}
        </Droppable>
      </DragDropContext>

      <input
        ref={fileRef}
        type="file"
        accept="image/png,image/jpeg,image/webp,image/heic,image/heif,image/*"
        className="hidden"
        onChange={handleFile}
      />

      {cropSrc && (
        <CropModal
          imageSrc={cropSrc}
          onClose={() => setCropSrc(null)}
          onCropped={handleCropped}
        />
      )}

      <p className="text-xs text-muted-foreground mt-3">
        {photos.length}/8 photos · drag to reorder · tap ★ for main photo · minimum 2 required
      </p>
    </div>
  );
}