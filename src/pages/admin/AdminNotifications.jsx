import React, { useState } from "react";
import { base44 } from "@/api/base44Client";
import { SectionHeader } from "@/components/admin/AdminUI";
import { Loader2, Send, Megaphone } from "lucide-react";

export default function AdminNotifications() {
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [sending, setSending] = useState(false);
  const [result, setResult] = useState("");

  const send = async () => {
    if (!title.trim()) return;
    setSending(true);
    setResult("");
    try {
      const res = await base44.functions.invoke("admin-notify", { title: title.trim(), body: body.trim(), target: "all" });
      setResult(`Sent to ${res.data.sent} members.`);
      setTitle("");
      setBody("");
    } catch (e) {
      setResult("Failed to send: " + (e.message || "error"));
    } finally {
      setSending(false);
    }
  };

  return (
    <div>
      <SectionHeader title="Notifications" subtitle="Broadcast an announcement to all members" />
      <div className="rounded-2xl border border-border bg-card p-4 space-y-3">
        <div className="flex items-center gap-2 text-[#7a5c44]">
          <Megaphone className="w-4 h-4" strokeWidth={1.5} />
          <span className="text-xs uppercase tracking-wide">Broadcast</span>
        </div>
        <div>
          <label className="text-xs text-muted-foreground">Title</label>
          <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Announcement title"
            className="w-full h-11 rounded-xl border border-border bg-background px-3 text-sm outline-none" />
        </div>
        <div>
          <label className="text-xs text-muted-foreground">Message (optional)</label>
          <textarea value={body} onChange={(e) => setBody(e.target.value)} rows={4} placeholder="Write your message…"
            className="w-full rounded-xl border border-border bg-background px-3 py-2 text-sm outline-none resize-none" />
        </div>
        <button onClick={send} disabled={sending || !title.trim()}
          className="w-full h-11 rounded-xl bg-foreground text-background text-sm flex items-center justify-center gap-2">
          {sending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" strokeWidth={1.5} />}
          Send to all members
        </button>
        {result && <p className="text-xs text-center text-muted-foreground">{result}</p>}
        <p className="text-xs text-muted-foreground text-center">Each member receives a notification in their Notification Center.</p>
      </div>
    </div>
  );
}