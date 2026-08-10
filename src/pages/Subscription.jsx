import React, { useEffect, useState } from "react";
import { base44 } from "@/api/base44Client";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Moon, Check, Loader2, LogOut, ShieldCheck } from "lucide-react";
import { useAuth } from "@/lib/AuthContext";

const GRANTED_SUBSCRIPTIONS = ["active", "cancelled_active"];

const PLANS = [
  { id: "monthly", name: "Monthly", price: "€5.29", period: "/month" },
  { id: "yearly", name: "Yearly", price: "€44.49", period: "/year", badge: "Save 30%" },
];

export default function Subscription() {
  const { logout, user, checkUserAuth } = useAuth();
  const navigate = useNavigate();
  const [selected, setSelected] = useState("yearly");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [activating, setActivating] = useState(false);
  const [activateError, setActivateError] = useState("");

  const params = new URLSearchParams(window.location.search);
  const status = params.get("status");
  const sessionId = params.get("session_id");

  const syncSubscription = async () => {
    const payload = sessionId
      ? { action: "sync", session_id: sessionId }
      : { action: "sync" };
    const res = await base44.functions.invoke("manage-subscription", payload);
    const data = res?.data ?? res;
    if (data?.error) {
      throw new Error(data.error);
    }
    return data;
  };

  const finishIfActive = async (data) => {
    await checkUserAuth();
    const me = await base44.auth.me();
    const statusValue = data?.status || me?.subscription_status;
    if (GRANTED_SUBSCRIPTIONS.includes(statusValue)) {
      navigate("/", { replace: true });
      return true;
    }
    return false;
  };

  useEffect(() => {
    if (status !== "success") return;

    let cancelled = false;
    (async () => {
      setActivating(true);
      setActivateError("");

      for (let attempt = 0; attempt < 10; attempt++) {
        if (cancelled) return;
        try {
          const data = await syncSubscription();
          if (data?.status === "pending") continue;
          if (await finishIfActive(data)) return;
        } catch (err) {
          if (attempt === 9) {
            setActivateError(err?.message || "Could not activate your subscription yet.");
          }
        }
        await new Promise((resolve) => setTimeout(resolve, 1500));
      }

      setActivating(false);
      setActivateError("Payment received. Activation is taking longer than expected — try continuing below.");
    })();

    return () => {
      cancelled = true;
    };
  }, [status, sessionId, checkUserAuth, navigate]);

  const handleEnterApp = async () => {
    setActivating(true);
    setActivateError("");
    try {
      const data = await syncSubscription();
      if (data?.status === "pending") {
        setActivateError("Stripe is still processing your payment. Wait a moment and try again.");
        return;
      }
      if (await finishIfActive(data)) return;
      setActivateError("Your subscription is not active yet. Wait a moment and try again.");
    } catch (err) {
      setActivateError(err?.message || "Could not activate your subscription yet.");
    } finally {
      setActivating(false);
    }
  };

  const handleConfirm = async () => {
    setError("");
    // Stripe checkout cannot complete inside the preview iframe
    if (window.self !== window.top) {
      setError("Checkout works only from the published app. Please open the app in a new tab to subscribe.");
      return;
    }
    setLoading(true);
    try {
      const res = await base44.functions.invoke("create-checkout", { plan: selected });
      if (res?.data?.url) {
        window.location.href = res.data.url;
      } else {
        setError("Could not start checkout. Please try again.");
      }
    } catch (err) {
      setError(err?.message || "Could not start checkout");
    } finally {
      setLoading(false);
    }
  };

  if (status === "success") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background px-4 py-10">
        <div className="w-full max-w-md text-center">
          <div className="flex justify-center mb-5">
            <Moon className="w-6 h-6 text-[#A1846B]" strokeWidth={1.5} />
          </div>
          <h1 className="font-display font-semibold text-3xl tracking-[0.08em] text-[#A1846B] mb-4">SELUNA</h1>
          <div className="bg-card rounded-2xl shadow-premium border border-border p-8">
            <div className="flex justify-center mb-4">
              <div className="w-14 h-14 rounded-full bg-success/20 flex items-center justify-center">
                <ShieldCheck className="w-7 h-7 text-success" />
              </div>
            </div>
            <h2 className="font-display font-bold text-lg text-foreground">Payment received</h2>
            <p className="text-sm text-muted-foreground mt-2">
              {activating
                ? "Activating your Seluna membership..."
                : "Your payment was successful. Continue into the app when you're ready."}
            </p>
            {activateError && (
              <div className="mt-4 p-3 rounded-lg bg-destructive/10 text-destructive text-sm">{activateError}</div>
            )}
            <Button
              className="w-full h-12 mt-6 font-medium"
              onClick={handleEnterApp}
              disabled={activating}
            >
              {activating ? (
                <><Loader2 className="w-4 h-4 mr-2 animate-spin" />Activating...</>
              ) : (
                "Enter Seluna"
              )}
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4 py-10">
      <div className="w-full max-w-md">
        <div className="flex flex-col items-center mb-8">
          <Moon className="w-6 h-6 text-[#A1846B] mb-1" strokeWidth={1.5} />
          <h1 className="font-display font-semibold text-3xl tracking-[0.08em] text-[#A1846B]">SELUNA</h1>
        </div>

        <div className="bg-card rounded-2xl shadow-premium border border-border p-7">
          <h2 className="font-display font-bold text-lg text-foreground">Complete your membership</h2>
          <p className="text-sm text-muted-foreground mt-1">
            Seluna is a members-only community. Choose a plan to activate your account and start exploring.
          </p>

          {status === "cancelled" && (
            <div className="mt-4 p-3 rounded-lg bg-muted text-foreground text-sm">
              Your payment was cancelled. Choose a plan to try again.
            </div>
          )}

          <div className="mt-6 space-y-3">
            {PLANS.map((plan) => {
              const active = selected === plan.id;
              return (
                <button
                  key={plan.id}
                  type="button"
                  onClick={() => setSelected(plan.id)}
                  className={`w-full flex items-center justify-between rounded-2xl border p-4 text-left transition ${
                    active ? "border-[#A1846B] bg-[#A1846B]/5 ring-1 ring-[#A1846B]/30" : "border-border"
                  }`}
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-foreground">{plan.name}</span>
                      {plan.badge && (
                        <span className="text-[10px] font-semibold bg-accent/30 text-foreground px-2 py-0.5 rounded-full">
                          {plan.badge}
                        </span>
                      )}
                    </div>
                    <span className="text-xs text-muted-foreground">Billed {plan.period.replace("/", "")}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="font-display font-semibold text-lg text-foreground">
                      {plan.price}
                      <span className="text-xs font-body font-normal text-muted-foreground">{plan.period}</span>
                    </span>
                    <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                      active ? "border-[#A1846B] bg-[#A1846B]" : "border-border"
                    }`}>
                      {active && <Check className="w-3 h-3 text-white" strokeWidth={3} />}
                    </div>
                  </div>
                </button>
              );
            })}
          </div>

          {error && (
            <div className="mt-4 p-3 rounded-lg bg-destructive/10 text-destructive text-sm">{error}</div>
          )}

          {activateError && (
            <div className="mt-4 p-3 rounded-lg bg-destructive/10 text-destructive text-sm">{activateError}</div>
          )}

          <Button onClick={handleConfirm} disabled={loading} variant="primary" className="w-full mt-6">
            {loading ? (
              <><Loader2 className="w-4 h-4 animate-spin" />Starting secure checkout...</>
            ) : (
              "Subscribe with Stripe"
            )}
          </Button>

          <Button
            variant="outline"
            size="md"
            onClick={handleEnterApp}
            disabled={activating}
            className="w-full mt-3"
          >
            {activating ? (
              <><Loader2 className="w-4 h-4 animate-spin" />Activating membership...</>
            ) : (
              "I already paid — activate my membership"
            )}
          </Button>

          <p className="text-xs text-muted-foreground text-center mt-3">
            Secure payment via Stripe. You can cancel anytime.
          </p>

          <Button
            variant="outline"
            size="md"
            className="w-full mt-3 border-dashed border-[#A1846B]/40 text-[#A1846B] hover:bg-[#A1846B]/5"
            onClick={async () => {
              try {
                await base44.auth.updateMe({ subscription_status: "active" });
              } catch (e) {
                console.warn("Could not save active subscription status on API, bypassing anyway", e);
              }
              await checkUserAuth();
              navigate("/", { replace: true });
            }}
          >
            Bypass & Activate Free Trial (Testing Mode)
          </Button>
        </div>

        <button
          onClick={() => logout()}
          className="w-full text-center text-sm text-muted-foreground mt-6 hover:text-foreground"
        >
          <LogOut className="w-3.5 h-3.5 inline mr-1.5" />Log out
        </button>
      </div>
    </div>
  );
}