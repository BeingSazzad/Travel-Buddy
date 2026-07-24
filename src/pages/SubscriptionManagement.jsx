import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { base44 } from "@/api/base44Client";
import { Button } from "@/components/ui/button";
import { Loader2, Crown, RotateCw, Settings2, Info, ArrowLeft } from "lucide-react";
import { useAuth } from "@/lib/AuthContext";

const MONTHLY_PRICE = "€5.29";

const STATUS = {
  active: { label: "Active", tone: "success" },
  cancelled_active: { label: "Active · cancelling", tone: "accent" },
  payment_failed: { label: "Payment failed", tone: "destructive" },
  expired: { label: "Expired", tone: "muted" },
  none: { label: "No active subscription", tone: "muted" },
};

const PAYMENT = {
  active: "Paid",
  cancelled_active: "Paid · cancellation pending",
  payment_failed: "Payment failed",
  expired: "Inactive",
  none: "—",
};

const fmtDate = (iso) =>
  iso ? new Date(iso).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" }) : "—";

function Row({ label, value }) {
  return (
    <div className="flex items-center justify-between py-3 border-b border-border last:border-0">
      <span className="text-sm text-muted-foreground">{label}</span>
      <span className="text-sm font-medium text-right">{value}</span>
    </div>
  );
}

export default function SubscriptionManagement() {
  const { user, checkUserAuth } = useAuth();
  const navigate = useNavigate();
  const [busy, setBusy] = useState(null);
  const [error, setError] = useState("");

  const status = user?.subscription_status || "none";
  const st = STATUS[status] || STATUS.none;
  const plan = user?.subscription_plan || (status === "none" ? "—" : "Monthly");
  const periodEnd = user?.subscription_current_period_end;
  const isActive = status === "active" || status === "cancelled_active";

  const toneClass = {
    success: "bg-success/15 text-success",
    accent: "bg-accent/20 text-foreground",
    destructive: "bg-destructive/15 text-destructive",
    muted: "bg-muted text-muted-foreground",
  }[st.tone];

  const restore = async () => {
    setError(""); setBusy("restore");
    try {
      await base44.functions.invoke("manage-subscription", { action: "restore" });
      await checkUserAuth();
    } catch (e) { setError(e?.message || "Could not restore purchase"); }
    finally { setBusy(null); }
  };

  const manage = async () => {
    setError(""); setBusy("manage");
    if (window.self !== window.top) {
      setError("Managing your subscription works only from the published app. Please open the app in a new tab.");
      setBusy(null);
      return;
    }
    try {
      const res = await base44.functions.invoke("manage-subscription", { action: "portal" });
      if (res?.data?.url) window.location.href = res.data.url;
      else setError("Could not open subscription management.");
    } catch (e) { setError(e?.message || "Could not open subscription management"); }
    finally { setBusy(null); }
  };

  return (
    <div className="px-5 pt-12 pb-10">
      <div className="flex items-center gap-3 mb-5">
        <button onClick={() => navigate(-1)} className="w-9 h-9 rounded-full border border-border flex items-center justify-center"><ArrowLeft className="w-4 h-4" /></button>
        <h1 className="font-display font-semibold text-2xl">Subscription</h1>
      </div>

      {/* Status card */}
      <div className="rounded-2xl bg-gradient-to-br from-foreground to-foreground/80 text-background p-5">
        <div className="flex items-center gap-2 mb-2">
          <Crown className="w-4 h-4" />
          <span className="text-xs font-semibold uppercase tracking-widest opacity-90">Seluna Plus</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="font-display font-semibold text-2xl">{st.label}</span>
        </div>
        <p className="text-xs opacity-80 mt-1">Members-only community · {plan}</p>
      </div>

      {/* Details */}
      <div className="mt-4 bg-card border border-border shadow-soft rounded-2xl px-4">
        <Row label="Plan" value={plan} />
        <Row label="Monthly price" value={isActive ? `${MONTHLY_PRICE} / month` : MONTHLY_PRICE} />
        <Row label="Next billing date" value={isActive ? fmtDate(periodEnd) : "—"} />
        <Row
          label="Payment status"
          value={<span className={`px-2 py-0.5 rounded-full text-xs ${toneClass}`}>{PAYMENT[status] || "—"}</span>}
        />
      </div>

      {!isActive ? (
        <Button className="w-full h-12 mt-5" onClick={() => navigate("/subscription")}>
          Subscribe to Seluna Plus
        </Button>
      ) : (
        <>
          <Button variant="outline" className="w-full h-12 mt-5" onClick={restore} disabled={busy === "restore"}>
            {busy === "restore" ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <RotateCw className="w-4 h-4 mr-2" strokeWidth={1.5} />}
            Restore purchase
          </Button>
          <Button className="w-full h-12 mt-3" onClick={manage} disabled={busy === "manage"}>
            {busy === "manage" ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Settings2 className="w-4 h-4 mr-2" strokeWidth={1.5} />}
            Manage subscription
          </Button>
        </>
      )}

      {/* Cancellation info */}
      <div className="mt-5 rounded-2xl border border-border bg-[#A1846B]/5 p-4">
        <div className="flex items-start gap-2.5">
          <Info className="w-4 h-4 text-[#A1846B] mt-0.5 shrink-0" strokeWidth={1.5} />
          <div>
            <p className="text-sm font-medium">Cancelling your subscription</p>
            <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
              Cancelling stops automatic renewal — you won't be charged again. Your access to Seluna Plus
              remains fully active until the end of your current paid billing period
              {periodEnd ? ` (${fmtDate(periodEnd)})` : ""}. After that, your membership ends and your account
              moves to the free tier. You can resubscribe anytime.
            </p>
          </div>
        </div>
      </div>

      {error && <p className="text-xs text-destructive mt-4 text-center">{error}</p>}
    </div>
  );
}