import React, { useEffect, useState } from "react";
import { base44 } from "@/api/base44Client";
import { SectionHeader, ListState } from "@/components/admin/AdminUI";
import { Plus, Trash2, Loader2, Tag } from "lucide-react";
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from "@/components/ui/select";

const CATEGORIES = ["hotels", "restaurants", "cafes", "tours", "activities", "beach_clubs", "travel_insurance", "coworking", "transport"];

const empty = { title: "", partner: "", category: "cafes", discount: "", city: "", expiration_date: "", image: "", terms: "", code_prefix: "" };

export default function AdminDeals() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(empty);
  const [saving, setSaving] = useState(false);

  const load = async () => {
    try {
      const list = await base44.entities.Deal.list("-created_date", 500);
      setItems(list);
    } catch (e) {
      setItems([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const create = async () => {
    if (!form.title || !form.partner || !form.discount || !form.city || !form.expiration_date) {
      alert("Title, partner, discount, city and expiration date are required.");
      return;
    }
    setSaving(true);
    try {
      await base44.entities.Deal.create({ ...form, country: "" });
      setForm(empty);
      setShowForm(false);
      await load();
    } catch (e) {
      alert("Could not create deal.");
    } finally {
      setSaving(false);
    }
  };

  const remove = async (id) => {
    if (!confirm("Delete this deal?")) return;
    try {
      await base44.entities.Deal.delete(id);
      setItems((prev) => prev.filter((d) => d.id !== id));
    } catch (e) {
      alert("Could not delete deal.");
    }
  };

  return (
    <div>
      <SectionHeader
        title="Deals"
        subtitle={`${items.length} exclusive member deals`}
        right={
          <button onClick={() => setShowForm((s) => !s)} className="flex items-center gap-1 text-xs px-3 py-1.5 rounded-full bg-foreground text-background">
            <Plus className="w-3.5 h-3.5" strokeWidth={1.5} /> New
          </button>
        }
      />

      {showForm && (
        <div className="rounded-2xl border border-border bg-card p-4 mb-4 space-y-2">
          <div className="grid grid-cols-2 gap-2">
            <Field label="Title" value={form.title} onChange={(v) => setForm({ ...form, title: v })} />
            <Field label="Partner" value={form.partner} onChange={(v) => setForm({ ...form, partner: v })} />
            <Field label="Discount" value={form.discount} onChange={(v) => setForm({ ...form, discount: v })} placeholder="20% off" />
            <Field label="City" value={form.city} onChange={(v) => setForm({ ...form, city: v })} />
            <Field label="Image URL" value={form.image} onChange={(v) => setForm({ ...form, image: v })} />
            <Field label="Expires" type="date" value={form.expiration_date} onChange={(v) => setForm({ ...form, expiration_date: v })} />
            <Field label="Code prefix" value={form.code_prefix} onChange={(v) => setForm({ ...form, code_prefix: v })} placeholder="SELUNA" />
            <div>
              <label className="text-xs text-muted-foreground">Category</label>
              <Select value={form.category} onValueChange={(v) => setForm({ ...form, category: v })}>
                <SelectTrigger className="w-full h-10 rounded-xl border border-border bg-background px-3 text-sm">
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent>
                  {CATEGORIES.map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
          </div>
          <Field label="Terms" value={form.terms} onChange={(v) => setForm({ ...form, terms: v })} textarea />
          <button onClick={create} disabled={saving} className="w-full h-11 rounded-xl bg-foreground text-background text-sm flex items-center justify-center gap-2">
            {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : "Create deal"}
          </button>
        </div>
      )}

      <ListState loading={loading} empty={items.length === 0} emptyText="No deals yet.">
        <div className="space-y-2">
          {items.map((d) => (
            <div key={d.id} className="flex gap-3 p-3 rounded-2xl border border-border bg-card">
              {d.image ? <img src={d.image} alt="" className="w-12 h-12 rounded-xl object-cover shrink-0" /> : <div className="w-12 h-12 rounded-xl bg-muted flex items-center justify-center"><Tag className="w-4 h-4 text-muted-foreground" strokeWidth={1.5} /></div>}
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">{d.title}</p>
                <p className="text-xs text-muted-foreground">{d.partner} · {d.city}</p>
                <p className="text-xs text-[#A1846B] mt-0.5">{d.discount} · expires {d.expiration_date}</p>
              </div>
              <button onClick={() => remove(d.id)} className="text-destructive self-start"><Trash2 className="w-4 h-4" strokeWidth={1.5} /></button>
            </div>
          ))}
        </div>
      </ListState>
    </div>
  );
}

function Field({ label, value, onChange, placeholder, type = "text", textarea }) {
  return (
    <div>
      <label className="text-xs text-muted-foreground">{label}</label>
      {textarea ? (
        <textarea value={value} onChange={(e) => onChange(e.target.value)} rows={2} placeholder={placeholder}
          className="w-full rounded-xl border border-border bg-background px-3 py-2 text-sm outline-none resize-none" />
      ) : (
        <input type={type} value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder}
          className="w-full h-10 rounded-xl border border-border bg-background px-3 text-sm outline-none" />
      )}
    </div>
  );
}