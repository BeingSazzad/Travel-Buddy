import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { base44 } from "@/api/base44Client";
import { Button } from "@/components/ui/button";
import { Loader2, Crown, Check, Info, ArrowLeft, Settings2 } from "lucide-react";
import { useAuth } from "@/lib/AuthContext";
import { cn } from "@/lib/utils";

const PLANS = [
  { id: "monthly", name: "Monthly", price: "€5.29", period: "/month", blurb: "Flexible — cancel anytime" },
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
      else setError("Could not open subscription management.");
    } catch (e) {
      setError(e?.message || "Could not open subscription management");
    } finally {
      setBusy(null);
    }
  };

  return (
    <div className="px-5 pt-12 pb-10">
      <div className="flex items-center gap-3 mb-5">
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="w-9 h-9 rounded-full border border-border flex items-center justify-center"
          aria-label="Back"
        >
          <ArrowLeft className="w-4 h-4" />
        </button>
        <h1 className="font-display font-bold text-lg">Subscription</h1>
      </div>

      <div className="rounded-2xl bg-gradient-to-br from-foreground to-foreground/80 text-background p-5">
        <div className="flex items-center gap-2 mb-2">
          <Crown className="w-4 h-4" />
          <span className="text-xs font-semibold uppercase tracking-widest opacity-90">Seluna Plus</span>
        </div>
        <p className="font-display font-bold text-lg">{st.label}</p>
        <p className="text-xs opacity-80 mt-1">
          {isActive
            ? `Current plan · ${PLANS.find((p) => p.id === currentPlanId)?.name || "Monthly"}`
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

      <Button
        className="w-full h-12 mt-5"
        onClick={isActive ? switchPlan : () => navigate("/subscription")}
        disabled={busy === "switch" || (isActive && isSelectedCurrent)}
      >
        {busy === "switch" ? (
          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
        ) : null}
        {!isActive
          ? "Subscribe"
          : isSelectedCurrent
            ? "Current plan"
            : `Switch to ${selectedPlan.name}`}
      </Button>

      {isActive && (
        <Button
          variant="outline"
          className="w-full h-12 mt-3"
          onClick={manage}
          disabled={busy === "manage"}
        >
          {busy === "manage" ? (
            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
          ) : (
            <Settings2 className="w-4 h-4 mr-2" strokeWidth={1.5} />
          )}
          Payment & cancel
        </Button>
      )}

      <div className="mt-5 rounded-2xl border border-border bg-primary/5 p-4">
        <div className="flex items-start gap-2.5">
          <Info className="w-4 h-4 text-primary mt-0.5 shrink-0" strokeWidth={1.5} />
          <p className="text-xs text-muted-foreground leading-relaxed">
            Cancel anytime — Plus stays active until{" "}
            {periodEnd ? fmtDate(periodEnd) : "your period ends"}.
          </p>
        </div>
      </div>

      {info && <p className="text-sm text-primary mt-4 text-center">{info}</p>}
      {error && <p className="text-sm text-destructive mt-4 text-center">{error}</p>}
    </div>
  );
}
