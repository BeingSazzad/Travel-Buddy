import AdminContentPage from "@/components/admin/AdminContentPage";

const TAGS = [
  { key: "pool", label: "Pool" }, { key: "gym", label: "Gym" }, { key: "spa", label: "Spa" },
  { key: "breakfast", label: "Breakfast" }, { key: "beach", label: "Beach access" }, { key: "cityCenter", label: "City centre" },
  { key: "solo", label: "Solo-friendly" }, { key: "womenReviews", label: "Women-friendly" },
];
const STATUS = [{ value: "published", label: "Published" }, { value: "hidden", label: "Hidden" }];

const fields = [
  { key: "name", label: "Name", type: "text", required: true },
  { key: "city", label: "City", type: "text", required: true },
  { key: "country", label: "Country", type: "text" },
  { key: "image", label: "Image", type: "image", required: true },
  { key: "gallery", label: "Gallery", type: "gallery" },
  { key: "description", label: "Description", type: "textarea" },
  { key: "stars", label: "Stars (1-5)", type: "number" },
  { key: "memberRating", label: "Member rating", type: "number" },
  { key: "reviews", label: "Review count", type: "number" },
  { key: "pricePerNight", label: "Price per night", type: "number" },
  { key: "distance", label: "Distance (km)", type: "number" },
  { key: "address", label: "Address", type: "text" },
  { key: "website", label: "Website", type: "text" },
  { key: "bookingUrl", label: "Booking URL", type: "text" },
  { key: "safetyNote", label: "Safety note", type: "textarea" },
  { key: "locationNote", label: "Location note", type: "textarea" },
  { key: "tags", label: "Facilities", type: "tags", options: TAGS },
  { key: "status", label: "Status", type: "select", options: STATUS },
  { key: "sort_order", label: "Sort order", type: "number" },
];

export default function AdminHotels() {
  return (
    <AdminContentPage
      entity="Hotel"
      title="Hotels"
      subtitle="Curated hotels — create, edit, publish, hide, delete"
      fields={fields}
      getTitle={(i) => i.name}
      getImage={(i) => i.image}
    />
  );
}