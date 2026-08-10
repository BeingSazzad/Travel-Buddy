import React, { useState } from "react";
import { Moon, Check, Loader2, RotateCcw, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * ApplePaywall — standalone, presentational subscription paywall for Seluna Plus.
 *
 * This component contains NO payment logic and grants NO premium access.
 * It is intentionally decoupled from Stripe, checkout URLs, and local state so
 * an external mobile developer can connect it to Apple StoreKit or RevenueCat.
 *
 * ─── Prop contract for the mobile/native integration ──────────────────────
 * products:        Array<{ productId, title, priceText, period, badge? }>
 *                  `productId` must match the App Store Connect product IDs
 *                  (seluna_monthly, seluna_annual). `priceText` should be the
 *                  LOCALIZED price string fetched from StoreKit
 *                  (SKProduct.price.localeFormatted) — NOT hardcoded.
 * defaultProductId:String  initially selected productId.
 * purchasing:      Boolean — true while the native purchase sheet is in flight.
 * onPurchase:      (productId: string) => void  — start the StoreKit purchase.
 * onRestore:       () => void                  — call SKPaymentQueue.restoreCompletedTransactions.
 * onTerms:         () => void                  — open Terms of Use.
 * onPrivacy:       () => void                  — open Privacy Policy.
 * ─────────────────────────────────────────────────────────────────────────
 *
 * IMPORTANT: Do NOT activate membership when Continue is pressed from within
 * this component. Entitlement must be derived from a verified App Store
 * receipt server-side (or via RevenueCat's customerInfo), never from this UI.
 */

const DEFAULT_PRODUCTS = [
  {
    productId: "seluna_monthly",
    title: "Monthly membership",
    priceText: "€5.99 per month",
    period: "monthly",
  },
  {
    productId: "seluna_annual",
    title: "Annual membership",
    priceText: "€49.99 per year",
    period: "annual",
    badge: "Save 30%",
    featured: true,
  },
];

export default function ApplePaywall({
  products = DEFAULT_PRODUCTS,
  defaultProductId = "seluna_annual",
  purchasing = false,
  onPurchase,
  onRestore,
  onTerms,
  onPrivacy,
}) {
  const [selected, setSelected] = useState(defaultProductId);
  const [notice, setNotice] = useState("");

  const handleContinue = () => {
    setNotice("");
    // No StoreKit integration connected yet — refuse to grant access.
    if (typeof onPurchase !== "function") {
      setNotice("In-app purchase is not available yet. StoreKit integration is pending.");
      return;
    }
    onPurchase(selected);
  };

  const handleRestore = () => {
    setNotice("");
    if (typeof onRestore !== "function") {
      setNotice("Restore is not available yet. StoreKit integration is pending.");
      return;
    }
    onRestore();
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4 py-10 safe-pt safe-pb">
      <div className="w-full max-w-md">
        {/* Brand */}
        <div className="flex flex-col items-center mb-8">
          <Moon className="w-6 h-6 text-[#A1846B] mb-1" strokeWidth={1.5} />
          <h1 className="font-display font-semibold text-3xl tracking-[0.08em] text-[#A1846B]">SELUNA</h1>
        </div>

        <div className="bg-card rounded-3xl shadow-premium border border-border p-7">
          <div className="flex items-center gap-2 mb-1">
            <Sparkles className="w-5 h-5 text-[#A1846B]" strokeWidth={1.5} />
            <h2 className="font-display font-bold text-lg text-foreground">Seluna Plus</h2>
          </div>
          <p className="text-sm text-muted-foreground">
            Join the members-only travel community for women. Unlock matching, events, chats, deals and more.
          </p>

          {/* Plan selection */}
          <div className="mt-6 space-y-3">
            {products.map((plan) => {
              const active = selected === plan.productId;
              return (
                <button
                  key={plan.productId}
                  type="button"
                  onClick={() => setSelected(plan.productId)}
                  data-product-id={plan.productId}
                  className={cn(
                    "w-full flex items-center justify-between rounded-2xl border p-4 text-left transition card-press",
                    active
                      ? "border-[#A1846B] bg-[#A1846B]/5 ring-1 ring-[#A1846B]/30"
                      : "border-border"
                  )}
                >
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-medium text-foreground">{plan.title}</span>
                      {plan.badge && (
                        <span className="text-[10px] font-semibold bg-accent/30 text-foreground px-2 py-0.5 rounded-full">
                          {plan.badge}
                        </span>
                      )}
                    </div>
                    <span className="text-xs text-muted-foreground capitalize">
                      Renews {plan.period}
                    </span>
                  </div>
                  <div className="flex items-center gap-3 shrink-0">
                    <span className="font-display font-semibold text-base text-foreground">
                      {plan.priceText}
                    </span>
                    <div
                      className={cn(
                        "w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0",
                        active ? "border-[#A1846B] bg-[#A1846B]" : "border-border"
                      )}
                    >
                      {active && <Check className="w-3 h-3 text-white" strokeWidth={3} />}
                    </div>
                  </div>
                </button>
              );
            })}
          </div>

          {notice && (
            <div className="mt-4 p-3 rounded-lg bg-muted text-foreground text-sm text-center">
              {notice}
            </div>
          )}

          {/* Continue — wired to native purchase handler when provided */}
          <button
            type="button"
            onClick={handleContinue}
            disabled={purchasing}
            className="w-full h-12 mt-6 rounded-full bg-[#A1846B] text-white font-medium text-sm flex items-center justify-center disabled:opacity-60 active:scale-[0.99] transition"
          >
            {purchasing ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" /> Confirming with App Store…
              </>
            ) : (
              "Continue"
            )}
          </button>

          {/* Restore Purchases */}
          <button
            type="button"
            onClick={handleRestore}
            disabled={purchasing}
            className="w-full mt-3 flex items-center justify-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition py-2"
          >
            <RotateCcw className="w-3.5 h-3.5" strokeWidth={1.5} /> Restore Purchases
          </button>

          {/* Automatic renewal info */}
          <p className="text-xs leading-relaxed text-muted-foreground text-center mt-4">
            Payment is charged to your Apple ID at confirmation of purchase. Your subscription
            automatically renews unless auto-renew is turned off at least 24 hours before the end of
            the current period. Your account will be charged for renewal within 24 hours prior to
            the end of the current period. You can manage or cancel your subscription in your Apple ID
            account settings at any time.
          </p>

          {/* Legal links */}
          <div className="flex items-center justify-center gap-4 mt-4 text-xs">
            <button
              type="button"
              onClick={onTerms}
              className="text-[#A1846B] underline-offset-2 hover:underline"
            >
              Terms of Use
            </button>
            <span className="w-px h-3 bg-border" />
            <button
              type="button"
              onClick={onPrivacy}
              className="text-[#A1846B] underline-offset-2 hover:underline"
            >
              Privacy Policy
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}