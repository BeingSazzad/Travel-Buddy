import React, { useEffect, useState } from "react";
import { base44 } from "@/api/base44Client";
import { SectionHeader, ListState } from "@/components/admin/AdminUI";
import ContentEditorSheet from "@/components/admin/ContentEditorSheet";
import { Plus, Pencil, Trash2, Eye, EyeOff, ArrowUp, ArrowDown } from "lucide-react";

const STATUS_STYLE = {
  published: "bg-green-100 text-green-700",
  hidden: "bg-muted text-muted-foreground",
};

export default function AdminContentPage({
  entity, title, subtitle, fields, getTitle, getImage, reorder = false, statusField = "status",
}) {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(null); // null | "new" | item

  const load = async () => {
    try {
      const list = await base44.entities[entity].list(reorder ? "sort_order" : "-created_date", 500);
      setItems(reorder ? list : list);
    } catch (e) {
      setItems([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, [entity]);

  const save = async (data) => {
    if (editing && editing.id) {
      await base44.entities[entity].update(editing.id, data);
    } else {
      await base44.entities[entity].create({ ...data, sort_order: reorder ? items.length : 0 });
    }
    await load();
  };

  const remove = async (id) => {
    if (!confirm("Delete this content? This cannot be undone.")) return;
    await base44.entities[entity].delete(id);
    setItems((prev) => prev.filter((i) => i.id !== id));
  };

  const toggleStatus = async (item) => {
    const patch = statusField === "status"
      ? { status: item.status === "published" ? "hidden" : "published" }
      : { [statusField]: !item[statusField] };
    await base44.entities[entity].update(item.id, patch);
    setItems((prev) => prev.map((i) => (i.id === item.id ? { ...i, ...patch } : i)));
  };

  const move = async (idx, dir) => {
    const j = idx + dir;
    if (j < 0 || j >= items.length) return;
    const a = items[idx], b = items[j];
    await Promise.all([
      base44.entities[entity].update(a.id, { sort_order: b.sort_order }),
      base44.entities[entity].update(b.id, { sort_order: a.sort_order }),
    ]);
    await load();
  };

  return (
    <div>
      <SectionHeader
        title={title}
        subtitle={subtitle}
        right={
          <button onClick={() => setEditing("new")} className="flex items-center gap-1 text-xs px-3 py-1.5 rounded-full bg-foreground text-background">
            <Plus className="w-3.5 h-3.5" strokeWidth={1.5} /> New
          </button>
        }
      />
      <ListState loading={loading} empty={items.length === 0} emptyText="No content yet.">
        <div className="space-y-2">
          {items.map((item, idx) => (
            <div key={item.id} className="flex items-center gap-3 p-3 rounded-2xl border border-border bg-card">
              {getImage(item) ? (
                <img src={getImage(item)} alt="" className="w-12 h-12 rounded-xl object-cover shrink-0" />
              ) : (
                <div className="w-12 h-12 rounded-xl bg-muted shrink-0" />
              )}
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">{getTitle(item)}</p>
                <span className={`text-[10px] px-2 py-0.5 rounded-full ${STATUS_STYLE[(statusField === "status" ? (item.status === "hidden" ? "hidden" : "published") : (item[statusField] ? "published" : "hidden"))]}`}>
                  {statusField === "status" ? (item.status || "published") : (item[statusField] ? "published" : "hidden")}
                </span>
              </div>
              <div className="flex items-center gap-1">
                {reorder && (
                  <>
                    <button onClick={() => move(idx, -1)} disabled={idx === 0} className="w-8 h-8 rounded-full flex items-center justify-center disabled:opacity-30"><ArrowUp className="w-4 h-4" strokeWidth={1.5} /></button>
                    <button onClick={() => move(idx, 1)} disabled={idx === items.length - 1} className="w-8 h-8 rounded-full flex items-center justify-center disabled:opacity-30"><ArrowDown className="w-4 h-4" strokeWidth={1.5} /></button>
                  </>
                )}
                <button onClick={() => toggleStatus(item)} className="w-8 h-8 rounded-full flex items-center justify-center">
                  {item.status === "hidden" ? <Eye className="w-4 h-4" strokeWidth={1.5} /> : <EyeOff className="w-4 h-4" strokeWidth={1.5} />}
                </button>
                <button onClick={() => setEditing(item)} className="w-8 h-8 rounded-full flex items-center justify-center"><Pencil className="w-4 h-4" strokeWidth={1.5} /></button>
                <button onClick={() => remove(item.id)} className="w-8 h-8 rounded-full flex items-center justify-center text-destructive"><Trash2 className="w-4 h-4" strokeWidth={1.5} /></button>
              </div>
            </div>
          ))}
        </div>
      </ListState>

      <ContentEditorSheet
        open={!!editing}
        item={editing === "new" ? null : editing}
        fields={fields}
        title={title}
        onSave={save}
        onClose={() => setEditing(null)}
      />
    </div>
  );
}