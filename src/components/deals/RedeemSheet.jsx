import React, { useEffect, useState } from "react";
import { X, Copy, Check, Sparkles, ShieldCheck } from "lucide-react";
import { base44 } from "@/api/base44Client";
import SuccessCheck from "@/components/common/SuccessCheck";

export default function RedeemSheet({ deal, onClose }) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [result, setResult] = useState(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!deal) return;
    setLoading(true);
    setError("");
    setResult(null);
    base44.functions.invoke("redeem-deal", { deal_id: deal.id })
      .then((res) => setResult(res.data))
      .catch((e) => setError(e?.response?.data?.error || "Could not redeem this deal."))
      .finally(() => setLoading(false));
  }, [deal]);

  if (!deal) return null;

  const copy = async () => {
    try { await navigator.clipboard.writeText(result.code); setCopied(true); setTimeout(() => setCopied(false), 2000); } catch (e) {}
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/50 backdrop-blur-sm" onClick={onClose}>
      <div className="w-full max-w-app bg-background rounded-t-3xl sm:rounded-3xl p-5 pb-8" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-1.5 text-primary"><Sparkles className="w-4 h-4" strokeWidth={1.5} /><span className="text-sm font-medium">Seluna member deal</span></div>
          <button onClick={onClose} className="w-8 h-8 rounded-full flex items-center justify-center"><X className="w-4 h-4" /></button>
        </div>

        <h2 className="font-display font-bold text-lg">{deal.title}</h2>
        <p className="text-sm text-muted-foreground mt-0.5">{deal.partner} · {deal.city}</p>
        <p className="text-sm mt-2"><span className="px-2.5 py-1 rounded-full bg-primary/10 text-brand-strong font-semibold">{deal.discount}</span></p>

        {loading && <p className="text-sm text-muted-foreground mt-4">Generating your redeem code…</p>}

        {error && (
          <div className="mt-4 rounded-2xl border border-destructive/30 bg-destructive/5 p-3">
            <p className="text-sm text-destructive">{error}</p>
          </div>
        )}

        {result && (
          <div className="mt-4 space-y-3">
            <SuccessCheck />
            <div className="rounded-2xl border-2 border-dashed border-primary p-4 text-center">
              <p className="text-xs uppercase tracking-wide text-muted-foreground mb-1">Your redeem code</p>
              <p className="font-mono text-2xl font-semibold tracking-wider text-foreground">{result.code}</p>
              <button onClick={copy} className="mt-3 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-foreground text-background text-xs">
                {copied ? <Check className="w-3.5 h-3.5" strokeWidth={1.5} /> : <Copy className="w-3.5 h-3.5" strokeWidth={1.5} />} {copied ? "Copied" : "Copy code"}
              </button>
            </div>

            {result.terms && (
              <div>
                <p className="text-xs font-medium mb-1">Terms</p>
                <p className="text-xs text-muted-foreground leading-relaxed">{result.terms}</p>
              </div>
            )}

            <div className="flex items-start gap-2 rounded-2xl border border-border bg-card p-3">
              <ShieldCheck className="w-4 h-4 text-primary mt-0.5 shrink-0" strokeWidth={1.5} />
              <p className="text-xs text-muted-foreground">Show this code at {result.partner} or enter it at checkout to claim your benefit. This code is unique to you.</p>
            </div>
          </div>
        )}

        <button onClick={onClose} className="w-full mt-4 h-11 rounded-full border border-border text-sm">Done</button>
      </div>
    </div>
  );
}