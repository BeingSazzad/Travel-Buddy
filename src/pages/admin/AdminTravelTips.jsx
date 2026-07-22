import AdminContentPage from "@/components/admin/AdminContentPage";

const STATUS = [{ value: "published", label: "Published" }, { value: "hidden", label: "Hidden" }];

const fields = [
  { key: "title", label: "Title", type: "text", required: true },
  { key: "category", label: "Category", type: "text", placeholder: "e.g. Packing, Safety, Transport" },
  { key: "image", label: "Image", type: "image" },
  { key: "body", label: "Tip", type: "textarea" },
  { key: "status", label: "Status", type: "select", options: STATUS },
  { key: "sort_order", label: "Sort order", type: "number" },
];

export default function AdminTravelTips() {
  return (
    <AdminContentPage
      entity="TravelTip"
      title="Travel tips"
      subtitle="Create, edit, publish, hide and delete travel tips"
      fields={fields}
      getTitle={(i) => i.title}
      getImage={(i) => i.image}
      reorder
    />
  );
}