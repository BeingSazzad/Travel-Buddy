import AdminContentPage from "@/components/admin/AdminContentPage";

const TAGS = [
  { key: "wifi", label: "Wi-Fi" }, { key: "work", label: "Work-friendly" }, { key: "outdoor", label: "Outdoor" },
  { key: "seaView", label: "Sea view" }, { key: "vegan", label: "Vegan" }, { key: "solo", label: "Solo-friendly" },
  { key: "wheelchair", label: "Wheelchair" }, { key: "pet", label: "Pet friendly" },
];
const STATUS = [{ value: "published", label: "Published" }, { value: "hidden", label: "Hidden" }];

const fields = [
  { key: "name", label: "Name", type: "text", required: true },
  { key: "city", label: "City", type: "text", required: true },
  { key: "country", label: "Country", type: "text" },
  { key: "image", label: "Image", type: "image", required: true },
  { key: "gallery", label: "Gallery", type: "gallery" },
  { key: "description", label: "Description", type: "textarea" },
  { key: "rating", label: "Rating (1-5)", type: "number" },
  { key: "reviews", label: "Review count", type: "number" },
  { key: "price", label: "Price (1-4)", type: "number" },
  { key: "distance", label: "Distance (km)", type: "number" },
  { key: "address", label: "Address", type: "text" },
  { key: "hours", label: "Opening hours", type: "text" },
  { key: "phone", label: "Phone", type: "text" },
  { key: "website", label: "Website", type: "text" },
  { key: "tags", label: "Facilities", type: "tags", options: TAGS },
  { key: "status", label: "Status", type: "select", options: STATUS },
  { key: "sort_order", label: "Sort order", type: "number" },
];

export default function AdminCafes() {
  return (
    <AdminContentPage
      entity="Cafe"
      title="Cafés"
      subtitle="Curated cafés — create, edit, publish, hide, delete"
      fields={fields}
      getTitle={(i) => i.name}
      getImage={(i) => i.image}
    />
  );
}