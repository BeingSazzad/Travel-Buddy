import AdminContentPage from "@/components/admin/AdminContentPage";

const STATUS = [{ value: "published", label: "Published" }, { value: "hidden", label: "Hidden" }];

const fields = [
  { key: "title", label: "Title", type: "text", required: true },
  { key: "icon", label: "Icon (emoji or lucide name)", type: "text", placeholder: "e.g. 🛡️" },
  { key: "body", label: "Safety tip", type: "textarea" },
  { key: "status", label: "Status", type: "select", options: STATUS },
  { key: "sort_order", label: "Sort order", type: "number" },
];

export default function AdminSafetyTips() {
  return (
    <AdminContentPage
      entity="SafetyTip"
      title="Safety tips"
      subtitle="Create, edit, publish, hide and delete safety tips"
      fields={fields}
      getTitle={(i) => i.title}
      getImage={(i) => null}
      reorder
    />
  );
}