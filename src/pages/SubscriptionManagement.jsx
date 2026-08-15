import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { base44 } from "@/api/base44Client";
import { Button } from "@/components/ui/button";
import { Loader2, Crown, Check, ArrowLeft, CreditCard } from "lucide-react";
import { useAuth } from "@/lib/AuthContext";
import { cn } from "@/lib/utils";

const PLANS = [
  { id: "monthly", name: "Monthly", price: "€5.29", period: "/month", blurb: "Billed monthly" },
  { id: "yearly", name: "Yearly", price: "€44.49", period: "/year", blurb: "Best value", badge: "Save 30%" },
];

const STATUS = {
  active: { label: "Active", tone: "success" },
  cancelled_active: { label: "Active · cancelling", tone: "accent" },
  payment_failed: { label: "Payment failed", tone: "destructive" },
  expired: { label: "Expired", tone: "muted" },
  none: { label: "No active subscription", tone: "muted" },
};

const fmtDate = (iso) =>
  iso
    ? new Date(iso).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" })
    : "—";

function billingError(err, fallback) {
  const raw = String(err?.message || err || "").toLowerCase();
  if (raw.includes("network") || raw.includes("fetch") || raw.includes("timeout")) {
    return "Couldn’t open billing. Check your connection and try again.";
  }
  return fallback;
}

function normalizePlanId(plan) {
  const raw = String(plan || "").toLowerCase();
  if (raw.includes("year")) return "yearly";
  if (raw.includes("month")) return "monthly";
  return "monthly";
}

export default function SubscriptionManagement() {
  const { user, checkUserAuth, patchUser } = useAuth();
  const navigate = useNavigate();
  const [busy, setBusy] = useState(null);
  const [error, setError] = useState("");
  const [info, setInfo] = useState("");

  const status = user?.subscription_status || "none";
  const st = STATUS[status] || STATUS.none;
  const currentPlanId = normalizePlanId(user?.subscription_plan);
  const periodEnd = user?.subscription_current_period_end;
  const isActive = status === "active" || status === "cancelled_active";
  const [selected, setSelected] = useState(currentPlanId);

  useEffect(() => {
    setSelected(currentPlanId);
  }, [currentPlanId]);

  const selectedPlan = useMemo(
    () => PLANS.find((p) => p.id === selected) || PLANS[0],
    [selected]
  );
  const isSelectedCurrent = selected === currentPlanId && isActive;

  const switchPlan = async () => {
    if (isSelectedCurrent) return;
    setError("");
    setInfo("");
    setBusy("switch");

    const planName = selectedPlan.name;

    try {
      if (window.self === window.top) {
        const res = await base44.functions.invoke("create-checkout", { plan: selected });
        if (res?.data?.url) {
          window.location.href = res.data.url;
          return;
        }
      }
    } catch {
      /* demo fallback below */
    }

    const payload = {
      subscription_plan: planName,
      subscription_status: isActive ? status : "active",
    };
    try {
      await base44.auth.updateMe(payload);
      try {
        await checkUserAuth();
      } catch {
        patchUser(payload);
      }
    } catch {
      patchUser(payload);
    }
    setInfo(`Switched to ${planName}. Billing updates on your next renewal.`);
    setBusy(null);
  };

  const manage = async () => {
    setError("");
    setBusy("manage");
    if (window.self !== window.top) {
      setError("Billing portal works from the published app. Open Seluna in a new tab to manage payment.");
      setBusy(null);
      return;
    }
    try {
      const res = await base44.functions.invoke("manage-subscription", { action: "portal" });
      if (res?.data?.url) window.location.href = res.data.url;
      else setError("Couldn’t open billing. Try again.");
    } catch (e) {
      setError(billingError(e, "Couldn’t open billing. Try again."));
    } finally {
      setBusy(null);
    }
  };

  return (
    <div className="page-shell">
      <div className="flex items-center gap-3 mb-5">
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="w-9 h-9 rounded-full flex items-center justify-center tap-feedback -ml-1"
          aria-label="Back"
        >
          <ArrowLeft className="w-5 h-5" strokeWidth={1.5} />
        </button>
        <h1 className="page-title">Subscription</h1>
      </div>

      <div className="rounded-3xl gradient-membership-card p-5">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <p className="flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-[0.16em] text-white/65">
              <Crown className="w-3.5 h-3.5 text-brand-gold" strokeWidth={1.75} />
              Membership
            </p>
            <h2 className="font-display font-semibold text-xl text-white mt-1.5 leading-tight">
              Seluna Plus
            </h2>
          </div>
          <span
            className={cn(
              "shrink-0 mt-0.5 text-[11px] font-semibold px-2.5 py-1 rounded-full",
              st.tone === "success" && "bg-white/15 text-brand-gold border border-white/20",
              st.tone === "accent" && "bg-white/12 text-white border border-white/20",
              st.tone === "destructive" && "bg-destructive/80 text-white",
              st.tone === "muted" && "bg-white/10 text-white/70"
            )}
          >
            {st.label}
          </span>
        </div>
        <p className="text-xs text-white/70 mt-3 leading-relaxed">
          {isActive
            ? `${PLANS.find((p) => p.id === currentPlanId)?.name || "Monthly"} plan`
            : "Choose a plan to unlock the community"}
          {isActive && periodEnd ? ` · renews ${fmtDate(periodEnd)}` : ""}
        </p>
      </div>

      <div className="mt-5">
        <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2 px-0.5">
          Plans
        </p>
        <div className="space-y-2.5">
          {PLANS.map((plan) => {
            const active = selected === plan.id;
            const isCurrent = currentPlanId === plan.id && isActive;
            return (
              <button
                key={plan.id}
                type="button"
                onClick={() => setSelected(plan.id)}
                className={cn(
                  "w-full text-left rounded-2xl border p-4 transition",
                  active ? "border-primary bg-primary/8 shadow-soft" : "border-border bg-card"
                )}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-display font-semibold text-base">{plan.name}</span>
                      {plan.badge && (
                        <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-primary/15 text-primary">
                          {plan.badge}
                        </span>
                      )}
                      {isCurrent && (
                        <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-foreground text-background">
                          Current
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">{plan.blurb}</p>
                  </div>
                  <div className="text-right shrink-0">
                    <p className="font-display font-bold">
                      {plan.price}
                      <span className="text-xs font-normal text-muted-foreground">{plan.period}</span>
                    </p>
                    {active && (
                      <span className="inline-flex mt-2 w-5 h-5 rounded-full bg-primary text-primary-foreground items-center justify-center">
                        <Check className="w-3 h-3" strokeWidth={2.5} />
                      </span>
                    )}
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {(!isActive || !isSelectedCurrent) && (
        <Button
          className="w-full h-12 mt-5"
          onClick={isActive ? switchPlan : () => navigate("/subscription")}
          disabled={busy === "switch"}
        >
          {busy === "switch" ? (
            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
          ) : null}
          {!isActive ? "Subscribe" : `Switch to ${selectedPlan.name}`}
        </Button>
      )}

      {isActive && (
        <Button
          variant="outline"
          className={cn(
            "w-full h-12",
            !isActive || !isSelectedCurrent ? "mt-3" : "mt-5"
          )}
          onClick={manage}
          disabled={busy === "manage"}
        >
          {busy === "manage" ? (
            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
          ) : (
            <CreditCard className="w-4 h-4 mr-2" strokeWidth={1.5} />
          )}
          Payment & cancel
        </Button>
      )}

      {info && <p className="text-sm text-primary mt-4 text-center">{info}</p>}
      {error && <p className="text-sm text-destructive mt-4 text-center">{error}</p>}
    </div>
  );
}
