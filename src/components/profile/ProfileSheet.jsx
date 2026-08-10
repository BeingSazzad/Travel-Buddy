import React from "react";
import { X } from "lucide-react";

export default function ProfileSheet({ title, onClose, children, footer }) {
  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/60 backdrop-blur-xs left-1/2 -translate-x-1/2 w-full max-w-md" onClick={onClose}>
      <div className="w-full bg-background rounded-t-3xl max-h-[90vh] flex flex-col border-t border-border" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between px-5 pt-4 pb-3 border-b border-border">
          <h3 className="font-display font-semibold text-lg">{title}</h3>
          <button onClick={onClose} className="w-8 h-8 rounded-full flex items-center justify-center"><X className="w-4 h-4" /></button>
        </div>
        <div className="flex-1 overflow-y-auto px-5 py-4">{children}</div>
        {footer && <div className="px-5 py-3 border-t border-border">{footer}</div>}
      </div>
    </div>
  );
}