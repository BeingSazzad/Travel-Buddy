import AdminContentPage from "@/components/admin/AdminContentPage";

const TYPES = ["destination", "cafe", "restaurant", "hotel", "event", "deal", "tip", "external"];

const fields = [
  { key: "title", label: "Title", type: "text", required: true },
  { key: "subtitle", label: "Subtitle", type: "text" },
  { key: "image", label: "Image", type: "image", required: true },
  { key: "link", label: "In-app link", type: "text", placeholder: "/destinations/Lisbon" },
  { key: "content_type", label: "Content type", type: "select", options: TYPES.map((t) => ({ value: t, label: t })) },
  { key: "ref_id", label: "Reference id (optional)", type: "text" },
  { key: "active", label: "Active", type: "boolean" },
  { key: "sort_order", label: "Sort order", type: "number" },
];

export default function AdminFeatured() {
  return (
    <AdminContentPage
      entity="FeaturedContent"
      title="Featured content"
      subtitle="Arrange what appears in the Home featured row — reorder with ↑ ↓"
      fields={fields}
      getTitle={(i) => i.title}
      getImage={(i) => i.image}
      reorder
      statusField="active"
    />
  );
}