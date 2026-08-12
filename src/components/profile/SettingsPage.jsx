import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import ScrollPage, { ScrollPageHeader, ScrollPageBody } from "@/components/common/ScrollPage";

export default function SettingsPage({ title, children }) {
  const navigate = useNavigate();

  return (
    <ScrollPage>
      <ScrollPageHeader>
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="w-9 h-9 rounded-full flex items-center justify-center active:scale-95 transition shrink-0"
          aria-label="Back"
        >
          <ArrowLeft className="w-5 h-5 text-foreground" strokeWidth={1.75} />
        </button>
        <h1 className="page-title truncate">{title}</h1>
      </ScrollPageHeader>
      <ScrollPageBody>{children}</ScrollPageBody>
    </ScrollPage>
  );
}
