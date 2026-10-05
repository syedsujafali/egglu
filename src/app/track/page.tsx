"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import { ArrowRightIcon, CheckIcon, ClockIcon, PinIcon, ShieldCheckIcon } from "@/components/Icons";
import { inr } from "@/lib/money";

type Line = { name: string; packSize: string; quantity: number; lineTotalPaise: number };
type Result = {
  ok: boolean;
  order?: {
    orderNo: string;
    customerName: string;
    locality: string;
    pincode: string;
    deliverySlot: string;
    orderStatus: string;
    paymentStatus: string;
    totalPaise: number;
    itemCount: number;
    createdAt: string;
  };
  items?: Line[];
  error?: string;
};

export default function TrackPage() {
  const [orderNo, setOrderNo] = useState("");
  const [state, setState] = useState<"idle" | "loading" | "done" | "error">("idle");
  const [result, setResult] = useState<Result | null>(null);

  async function lookup(e: FormEvent) {
    e.preventDefault();
    const value = orderNo.trim().toUpperCase();
    if (value.length < 6) {
      setState("error");
      setResult({ ok: false, error: "Enter the order number from your receipt, e.g. EGG-V9XJE5V26" });
      return;
    }
    setState("loading");
    const res = await fetch(`/api/orders?orderNo=${encodeURIComponent(value)}`);
    const data = (await res.json()) as Result;
    setResult(data);
    setState(data.ok ? "done" : "error");
  }

  const stages = ["Order confirmed", "Farm-packed tonight", "Out for delivery", "Delivered"];

  return (
    <div className="shell relative max-w-2xl py-16 sm:py-20">
      <span className="eyebrow text-accent-deep">
        <span className="h-px w-6 bg-accent/60" />
        Track order
      </span>
      <h1 className="mt-4 text-[2rem] leading-tight font-semibold sm:text-[2.5rem]">
        Where are my eggs?
      </h1>
      <p className="mt-3 text-[0.95rem] text-ink/60">
        Enter the order number we messaged you after checkout.
      </p>

      <form onSubmit={lookup} className="card mt-8 flex flex-col gap-3 p-4 sm:flex-row sm:items-center">
        <label htmlFor="orderno" className="sr-only">
          Order number
        </label>
        <input
          id="orderno"
          value={orderNo}
          onChange={(e) => {
            setOrderNo(e.target.value.toUpperCase());
            setState("idle");
          }}
          placeholder="EGG-XXXXXXX"
          className="field border-0! bg-transparent! px-3! focus:shadow-none!"
        />
        <button type="submit" disabled={state === "loading"} className="btn btn-primary shrink-0">
          {state === "loading" ? "Checking…" : "Track"}
          <ArrowRightIcon className="h-4 w-4" strokeWidth={2} />
        </button>
      </form>

      {state === "error" && result?.error && (
        <p className="mt-4 rounded-2xl bg-accent/15 px-4 py-3 text-sm font-semibold text-accent-deep">
          {result.error}
        </p>
      )}

      {state === "done" && result?.order && (
        <div className="card mt-6 p-6">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="text-[0.68rem] font-bold tracking-[0.16em] text-ink/45 uppercase">
                Order {result.order.orderNo}
              </p>
              <p className="font-display mt-1 text-xl font-semibold">
                {result.order.orderStatus === "confirmed"
                  ? "Confirmed · packing tonight"
                  : result.order.orderStatus}
              </p>
            </div>
            <span className="flex items-center gap-2 rounded-full bg-sage/60 px-3.5 py-1.5 text-[0.7rem] font-bold tracking-wide uppercase">
              <ShieldCheckIcon className="h-3.5 w-3.5" strokeWidth={2} />
              {result.order.paymentStatus === "cash_on_delivery" ? "Cash on delivery" : "Paid"}
            </span>
          </div>

          <ol className="mt-6 space-y-4">
            {stages.map((stage, i) => (
              <li key={stage} className="flex items-center gap-3">
                <span
                  className={
                    i <= 1
                      ? "grid h-8 w-8 place-items-center rounded-full bg-ink text-cream"
                      : "grid h-8 w-8 place-items-center rounded-full border border-dashed border-ink/25 text-ink/40"
                  }
                >
                  {i <= 1 ? <CheckIcon className="h-4 w-4" strokeWidth={2.6} /> : <ClockIcon className="h-4 w-4" />}
                </span>
                <p className={i <= 1 ? "text-[0.92rem] font-bold" : "text-[0.92rem] text-ink/45"}>
                  {stage}
                </p>
              </li>
            ))}
          </ol>

          <div className="mt-6 flex flex-wrap items-center gap-x-6 gap-y-2 border-t border-line pt-5 text-[0.85rem] text-ink/60">
            <p className="flex items-center gap-2">
              <PinIcon className="h-4 w-4 text-accent" strokeWidth={1.7} />
              {result.order.locality} · {result.order.pincode}
            </p>
            <p className="flex items-center gap-2">
              <ClockIcon className="h-4 w-4 text-accent" strokeWidth={1.7} />
              {result.order.deliverySlot}
            </p>
            <p className="font-bold text-ink">
              {inr(result.order.totalPaise)} · {result.order.itemCount} pack
              {result.order.itemCount === 1 ? "" : "s"}
            </p>
          </div>

          {result.items && result.items.length > 0 && (
            <ul className="mt-5 divide-y divide-line rounded-2xl bg-cream px-4">
              {result.items.map((line) => (
                <li key={`${line.name}-${line.packSize}`} className="flex justify-between py-3 text-[0.88rem]">
                  <span className="font-semibold">
                    {line.name} <span className="text-ink/50">· {line.packSize} × {line.quantity}</span>
                  </span>
                  <span className="font-bold">{inr(line.lineTotalPaise)}</span>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}

      <p className="mt-6 text-sm text-ink/55">
        Lost the number? Call the farm on{" "}
        <a href="tel:+914023456789" className="font-bold text-ink underline decoration-accent decoration-2 underline-offset-4">
          +91 40 2345 6789
        </a>{" "}
        or <Link href="/#eggs" className="font-bold text-ink underline decoration-accent decoration-2 underline-offset-4">go shopping</Link>.
      </p>
    </div>
  );
}
