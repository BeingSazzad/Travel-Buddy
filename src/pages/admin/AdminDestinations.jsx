import AdminContentPage from "@/components/admin/AdminContentPage";

const TAGS = [
  { key: "beach", label: "Beach" }, { key: "city", label: "City" }, { key: "budget", label: "Budget" },
  { key: "nightlife", label: "Nightlife" }, { key: "wellness", label: "Wellness" }, { key: "solo", label: "Solo-friendly" },
];
const COUNTS = [
  { key: "members", label: "Members" }, { key: "cafes", label: "Cafés" }, { key: "restaurants", label: "Restaurants" },
  { key: "hotels", label: "Hotels" }, { key: "events", label: "Events" }, { key: "deals", label: "Deals" },
];
const CONTINENTS = ["Europe", "Asia", "Africa", "Americas", "Oceania"];
const WEATHERS = ["Sunny", "Warm", "Mild", "Cool"];
const STATUS = [{ value: "published", label: "Published" }, { value: "hidden", label: "Hidden" }];

const fields = [
  { key: "city", label: "City", type: "text", required: true },
  { key: "country", label: "Country", type: "text" },
  { key: "continent", label: "Continent", type: "select", options: CONTINENTS.map((c) => ({ value: c, label: c })) },
  { key: "weather", label: "Weather", type: "select", options: WEATHERS.map((w) => ({ value: w, label: w })) },
  { key: "image", label: "Image", type: "image", required: true },
  { key: "description", label: "Description", type: "textarea" },
  { key: "featured", label: "Featured", type: "boolean" },
  { key: "tags", label: "Tags", type: "tags", options: TAGS },
  { key: "counts", label: "Curated counts", type: "counts", options: COUNTS },
  { key: "status", label: "Status", type: "select", options: STATUS },
  { key: "sort_order", label: "Sort order", type: "number" },
];

export default function AdminDestinations() {
  return (
    <AdminContentPage
      entity="Destination"
      title="Destinations"
      subtitle="Curated cities — create, edit, publish, hide, delete"
      fields={fields}
      getTitle={(i) => i.city}
      getImage={(i) => i.image}
    />
  );
}