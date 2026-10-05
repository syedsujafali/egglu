"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMemo, useState, type ReactNode } from "react";
import {
  ArrowRightIcon,
  CartIcon,
  CheckIcon,
  ClockIcon,
  EggIcon,
  MinusIcon,
  PinIcon,
  PlusIcon,
  ShieldCheckIcon,
  TrashIcon,
} from "@/components/Icons";
import { useCart } from "@/components/cart/CartProvider";
import { hyderabadAreas } from "@/data/delivery";
import { freeDeliveryThresholdPaise } from "@/data/products";
import { inr } from "@/lib/money";
import { cn } from "@/lib/cn";

const steps = ["Basket", "Delivery", "Payment"] as const;
const SLOTS = ["6–8 AM (morning)", "5–7 PM (evening)"];

type PaymentMethod = "upi" | "card" | "netbanking" | "cod";

export default function CartPage() {
  const router = useRouter();
  const { lines, setQty, remove, plan, setPlan, subtotalPaise, discountPaise, deliveryPaise, totalPaise, freeDeliveryGapPaise, ready, clear, count } =
    useCart();

  const [step, setStep] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const [failure, setFailure] = useState<string | null>(null);
  const [couponInput, setCouponInput] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState<string | null>(null);
  const [couponError, setCouponError] = useState<string | null>(null);

  const [form, setForm] = useState({
    customerName: "",
    phone: "",
    address: "",
    locality: "",
    pincode: "",
    deliverySlot: SLOTS[0],
    note: "",
    paymentMethod: "upi" as PaymentMethod,
    upiId: "",
    cardName: "",
    cardNumber: "",
    expiry: "",
    cvv: "",
    bank: "HDFC Bank",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const set = (key: keyof typeof form, value: string) => {
    setForm((f) => ({ ...f, [key]: value }));
    setErrors((e) => ({ ...e, [key]: "" }));
  };

  const handlePincode = (raw: string) => {
    const p = raw.replace(/\D/g, "").slice(0, 6);
    const found = hyderabadAreas.find((a) => a.pincode === p);
    setForm((f) => ({
      ...f,
      pincode: p,
      locality: found ? found.area : f.locality,
    }));
    setErrors((e) => ({ ...e, pincode: "", locality: found ? "" : e.locality }));
  };

  const applyPromo = (code: string) => {
    const c = code.trim().toUpperCase();
    if (c === "FIRSTEGG" || c === "FARM10" || c === "HYDFREE") {
      setAppliedCoupon(c);
      setCouponError(null);
      setCouponInput("");
    } else {
      setCouponError("Invalid code. Try FIRSTEGG or FARM10");
    }
  };

  const promoDiscountPaise = useMemo(() => {
    if (!appliedCoupon) return 0;
    if (appliedCoupon === "FIRSTEGG") return Math.min(5000, subtotalPaise);
    if (appliedCoupon === "FARM10") return Math.round(subtotalPaise * 0.1);
    return 0;
  }, [appliedCoupon, subtotalPaise]);

  const effectiveDeliveryPaise = appliedCoupon === "HYDFREE" ? 0 : deliveryPaise;
  const effectiveTotalPaise = Math.max(
    0,
    subtotalPaise - discountPaise - promoDiscountPaise + effectiveDeliveryPaise,
  );

  const eggs = useMemo(
    () => lines.reduce((n, l) => n + l.qty * l.packCount, 0),
    [lines],
  );

  const gapPercent = Math.min(
    100,
    Math.round(((freeDeliveryThresholdPaise - freeDeliveryGapPaise) / freeDeliveryThresholdPaise) * 100),
  );

  function validateDelivery() {
    const next: Record<string, string> = {};
    if (form.customerName.trim().length < 2) next.customerName = "Please tell us your name";
    if (!/^[6-9]\d{9}$/.test(form.phone.replace(/\D/g, "")))
      next.phone = "Enter a valid 10-digit Indian mobile number";
    if (form.address.trim().length < 10) next.address = "House/flat and street help our rider";
    if (!form.locality) next.locality = "Select your area";
    if (!/^\d{6}$/.test(form.pincode.trim())) next.pincode = "6-digit pincode";
    if (!SLOTS.includes(form.deliverySlot)) next.deliverySlot = "Pick a slot";
    setErrors(next);
    return Object.keys(next).length === 0;
  }

  function validatePayment() {
    const next: Record<string, string> = {};
    if (form.paymentMethod === "upi") {
      if (!/^[\w.\-]{2,}@[a-zA-Z]{2,}$/.test(form.upiId.trim()))
        next.upiId = "Enter a UPI ID like name@okhdfcbank";
    }
    if (form.paymentMethod === "card") {
      const digits = form.cardNumber.replace(/\D/g, "");
      if (digits.length < 15) next.cardNumber = "Enter the 16-digit card number";
      if (form.cardName.trim().length < 3) next.cardName = "Name as printed on the card";
      if (!/^(0[1-9]|1[0-2])\/\d{2}$/.test(form.expiry)) next.expiry = "MM/YY";
      if (!/^\d{3,4}$/.test(form.cvv)) next.cvv = "CVV";
    }
    setErrors(next);
    return Object.keys(next).length === 0;
  }


  async function placeOrder() {
    if (!validatePayment()) return;
    setSubmitting(true);
    setFailure(null);
    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customerName: form.customerName.trim(),
          phone: form.phone.replace(/\D/g, ""),
          address: form.address.trim(),
          locality:
            hyderabadAreas.find((a) => a.pincode === form.pincode.trim())?.area ?? form.locality,
          pincode: form.pincode.trim(),
          deliverySlot: form.deliverySlot,
          plan,
          paymentMethod: form.paymentMethod,
          note: form.note.trim(),
          items: lines.map((l) => ({ variantId: l.variantId, qty: l.qty })),
        }),
      });
      const data = (await res.json()) as {
        ok?: boolean;
        orderNo?: string;
        errors?: string[];
        error?: string;
      };
      if (!res.ok || !data.ok || !data.orderNo) {
        throw new Error(data.errors?.[0] ?? data.error ?? "Payment could not be completed");
      }
      clear();
      router.push(`/order/${data.orderNo}`);
    } catch (err) {
      setFailure(err instanceof Error ? err.message : "Something went wrong. Please try again.");
      setSubmitting(false);
    }
  }

  if (!ready) {
    return (
      <div className="shell flex min-h-[60vh] items-center justify-center">
        <p className="flex items-center gap-3 text-sm font-semibold text-ink/50">
          <EggIcon className="h-5 w-5 animate-pulse text-accent" />
          Loading your basket…
        </p>
      </div>
    );
  }

  if (lines.length === 0) {
    return (
      <div className="shell py-20 sm:py-28">
        <div className="mx-auto max-w-lg rounded-[2rem] border border-line bg-cream-bright p-10 text-center shadow-soft">
          <span className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-sage/60 text-ink">
            <CartIcon className="h-7 w-7" strokeWidth={1.5} />
          </span>
          <h1 className="mt-6 font-display text-3xl font-semibold">Your basket is empty</h1>
          <p className="mx-auto mt-3 max-w-xs text-[0.95rem] leading-relaxed text-ink/60">
            Pick a pack and we&rsquo;ll farm-pack it tonight for tomorrow-morning delivery.
          </p>
          <Link href="/#eggs" className="btn btn-primary mt-7">
            Shop eggs
            <ArrowRightIcon className="h-4 w-4" strokeWidth={2} />
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="relative overflow-hidden py-10 pb-28 sm:py-14 lg:pb-14">
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute -top-24 right-[-10rem] h-[26rem] w-[26rem] rounded-full bg-sage/40 blur-3xl" />
        <div className="absolute top-1/2 left-[-12rem] h-[22rem] w-[22rem] rounded-full bg-accent-soft/30 blur-3xl" />
      </div>

      <div className="shell">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <span className="eyebrow text-accent-deep">
              <span className="h-px w-6 bg-accent/60" />
              Checkout
            </span>
            <h1 className="mt-3 text-[2rem] leading-tight font-semibold sm:text-[2.6rem]">
              Your basket
            </h1>
            <p className="mt-2 text-sm text-ink/58">
              {count} pack{count === 1 ? "" : "s"} · {eggs} eggs · Hyderabad delivery
            </p>
          </div>
          <Link href="/#eggs" className="btn btn-ghost py-2.5! text-[0.8rem]">
            Keep shopping
          </Link>
        </div>

        {/* Stepper */}
        <ol className="mt-8 flex items-center gap-2 sm:gap-4">
          {steps.map((label, i) => (
            <li key={label} className="flex flex-1 items-center gap-2 sm:gap-3">
              <button
                type="button"
                onClick={() => i < step && setStep(i)}
                className={cn(
                  "flex items-center gap-2.5 rounded-full border px-3 py-2 text-[0.72rem] font-bold tracking-wide uppercase transition-all duration-300 sm:px-4",
                  i === step
                    ? "border-ink bg-ink text-cream"
                    : i < step
                      ? "border-sage-deep/50 bg-sage/50 text-ink hover:border-ink"
                      : "border-line bg-cream-bright text-ink/40",
                )}
              >
                <span
                  className={cn(
                    "grid h-5 w-5 place-items-center rounded-full text-[0.62rem]",
                    i < step ? "bg-sage-deep text-ink-deep" : i === step ? "bg-accent text-ink-deep" : "bg-ink/10 text-ink/45",
                  )}
                >
                  {i < step ? <CheckIcon className="h-3 w-3" strokeWidth={3} /> : i + 1}
                </span>
                {label}
              </button>
              {i < steps.length - 1 && (
                <span className="hidden h-px flex-1 bg-line sm:block" aria-hidden />
              )}
            </li>
          ))}
        </ol>

        <div className="mt-8 grid gap-8 lg:grid-cols-[1.35fr_1fr] lg:items-start">
          <div className="space-y-6">
            {step === 0 && (
              <section className="card p-5 sm:p-6">
                <h2 className="font-display text-xl font-semibold">Review your packs</h2>
                <ul className="mt-5 space-y-3">
                  {lines.map((line) => (
                    <li
                      key={line.variantId}
                      className="group flex gap-4 rounded-[1.35rem] border border-line bg-cream/60 p-3 transition-colors hover:border-accent-soft"
                    >
                      <div className="relative h-[5.5rem] w-[5.5rem] shrink-0 overflow-hidden rounded-2xl bg-sage/40">
                        <Image
                          src={line.image}
                          alt={line.name}
                          fill
                          sizes="88px"
                          className="object-cover transition-transform duration-700 group-hover:scale-110"
                        />
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-start justify-between gap-3">
                          <div>
                            <p className="text-[0.98rem] font-bold">{line.name}</p>
                            <p className="mt-0.5 text-xs text-ink/55">
                              {line.packLabel} · {inr(line.unitPricePaise)}
                            </p>
                          </div>
                          <button
                            type="button"
                            onClick={() => remove(line.variantId)}
                            aria-label={`Remove ${line.name}`}
                            className="grid h-8 w-8 place-items-center rounded-full text-ink/35 transition-colors hover:bg-cream hover:text-accent-deep"
                          >
                            <TrashIcon className="h-4 w-4" />
                          </button>
                        </div>
                        <div className="mt-3 flex items-center justify-between gap-3">
                          <div className="inline-flex items-center rounded-full border border-line bg-cream-bright">
                            <button
                              type="button"
                              onClick={() => setQty(line.variantId, line.qty - 1)}
                              aria-label="Decrease quantity"
                              className="grid h-9 w-9 place-items-center rounded-full transition-colors hover:bg-sage/60"
                            >
                              <MinusIcon className="h-3.5 w-3.5" strokeWidth={2.4} />
                            </button>
                            <span className="w-7 text-center text-sm font-bold tabular-nums">
                              {line.qty}
                            </span>
                            <button
                              type="button"
                              onClick={() => setQty(line.variantId, line.qty + 1)}
                              aria-label="Increase quantity"
                              className="grid h-9 w-9 place-items-center rounded-full transition-colors hover:bg-sage/60"
                            >
                              <PlusIcon className="h-3.5 w-3.5" strokeWidth={2.4} />
                            </button>
                          </div>
                          <p className="font-display text-lg font-semibold">
                            {inr(line.unitPricePaise * line.qty)}
                          </p>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>

                <div className="mt-6 rounded-[1.35rem] border border-line bg-cream/70 p-4">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div>
                      <p className="text-[0.95rem] font-bold">Weekly subscription</p>
                      <p className="mt-0.5 text-xs text-ink/58">
                        Skip or pause anytime · 10% off every pack
                      </p>
                    </div>
                    <div className="flex gap-2">
                      {(["one-time", "weekly"] as const).map((p) => (
                        <button
                          key={p}
                          type="button"
                          onClick={() => setPlan(p)}
                          aria-pressed={plan === p}
                          className={cn(
                            "rounded-full border px-4 py-2 text-xs font-bold transition-all duration-300",
                            plan === p
                              ? "border-ink bg-ink text-cream"
                              : "border-line bg-cream-bright text-ink/65 hover:border-accent",
                          )}
                        >
                          {p === "one-time" ? "One-time" : "Weekly · −10%"}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                <button type="button" onClick={() => setStep(1)} className="btn btn-primary mt-6 w-full">
                  Continue to delivery
                  <ArrowRightIcon className="h-4 w-4" strokeWidth={2} />
                </button>
              </section>
            )}

            {step === 1 && (
              <section className="card p-5 sm:p-6">
                <h2 className="font-display text-xl font-semibold">Where should we drop it?</h2>
                <div className="mt-5 grid gap-4 sm:grid-cols-2">
                  <Field label="Full name" error={errors.customerName} className="sm:col-span-2">
                    <input
                      className="field"
                      value={form.customerName}
                      onChange={(e) => set("customerName", e.target.value)}
                      placeholder="Ananya Reddy"
                      autoComplete="name"
                    />
                  </Field>
                  <Field label="Mobile number" error={errors.phone}>
                    <div className="relative">
                      <span className="absolute top-1/2 left-3.5 -translate-y-1/2 text-sm font-bold text-ink/45">
                        +91
                      </span>
                      <input
                        className="field pl-14"
                        inputMode="numeric"
                        maxLength={10}
                        value={form.phone}
                        onChange={(e) => set("phone", e.target.value.replace(/\D/g, ""))}
                        placeholder="98765 43210"
                        autoComplete="tel-national"
                      />
                    </div>
                  </Field>
                  <Field label="Hyderabad area" error={errors.locality}>
                    <span className="relative block">
                      <select
                        className="field appearance-none pr-10"
                        value={form.locality ? `${form.locality}` : ""}
                        onChange={(e) => {
                          const found = hyderabadAreas.find((a) => a.area === e.target.value);
                          set("locality", e.target.value);
                          if (found) set("pincode", found.pincode);
                        }}
                      >
                        <option value="">Select your area</option>
                        {hyderabadAreas.map((a) => (
                          <option key={a.pincode} value={a.area}>
                            {a.area} · {a.pincode}
                          </option>
                        ))}
                      </select>
                      <Chevron />
                    </span>
                  </Field>
                  <Field label="Door / flat address" error={errors.address} className="sm:col-span-2">
                    <textarea
                      className="field min-h-[5.5rem] resize-y"
                      value={form.address}
                      onChange={(e) => set("address", e.target.value)}
                      placeholder="Flat 402, Aparna Cyber Life, Nanakramguda Main Rd, landmark"
                      autoComplete="street-address"
                    />
                  </Field>
                  <Field label="Pincode" error={errors.pincode}>
                    <div className="relative">
                      <PinIcon className="absolute top-1/2 left-3.5 h-4 w-4 -translate-y-1/2 text-ink/40" />
                      <input
                        className="field pl-10"
                        inputMode="numeric"
                        maxLength={6}
                        value={form.pincode}
                        onChange={(e) => handlePincode(e.target.value)}
                        placeholder="500081"
                        autoComplete="postal-code"
                      />
                    </div>
                  </Field>
                  <Field label="Delivery slot" error={errors.deliverySlot}>
                    <div className="grid grid-cols-2 gap-2">
                      {SLOTS.map((slot) => (
                        <button
                          key={slot}
                          type="button"
                          onClick={() => set("deliverySlot", slot)}
                          className={cn(
                            "flex items-center justify-center gap-1.5 rounded-2xl border px-3 py-3 text-xs font-bold transition-all duration-300",
                            form.deliverySlot === slot
                              ? "border-accent bg-accent/12 text-ink"
                              : "border-line bg-cream-bright text-ink/60 hover:border-accent/60",
                          )}
                        >
                          <ClockIcon className="h-4 w-4" strokeWidth={1.7} />
                          {slot.split(" (")[0]}
                        </button>
                      ))}
                    </div>
                  </Field>
                  <Field label="Note for the rider (optional)" className="sm:col-span-2">
                    <input
                      className="field"
                      value={form.note}
                      onChange={(e) => set("note", e.target.value)}
                      placeholder="Ring the bell twice, leave at the gate"
                    />
                  </Field>
                </div>
                <div className="mt-6 flex flex-wrap gap-3">
                  <button type="button" onClick={() => setStep(0)} className="btn btn-ghost">
                    Back
                  </button>
                  <button
                    type="button"
                    onClick={() => validateDelivery() && setStep(2)}
                    className="btn btn-primary flex-1"
                  >
                    Continue to payment
                    <ArrowRightIcon className="h-4 w-4" strokeWidth={2} />
                  </button>
                </div>
              </section>
            )}

            {step === 2 && (
              <section className="card p-5 sm:p-6">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <h2 className="font-display text-xl font-semibold">Payment</h2>
                  <span className="flex items-center gap-2 rounded-full bg-sage/60 px-3 py-1.5 text-[0.68rem] font-bold tracking-wide text-ink uppercase">
                    <ShieldCheckIcon className="h-3.5 w-3.5" strokeWidth={2} />
                    Razorpay ready
                  </span>
                </div>

                <div className="mt-5 grid grid-cols-2 gap-2.5 sm:grid-cols-4">
                  {(
                    [
                      { id: "upi", label: "UPI" },
                      { id: "card", label: "Card" },
                      { id: "netbanking", label: "Net banking" },
                      { id: "cod", label: "Cash on delivery" },
                    ] as { id: PaymentMethod; label: string }[]
                  ).map((m) => (
                    <button
                      key={m.id}
                      type="button"
                      onClick={() => {
                        set("paymentMethod", m.id);
                        setFailure(null);
                      }}
                      className={cn(
                        "rounded-2xl border px-3 py-3.5 text-[0.8rem] font-bold transition-all duration-300",
                        form.paymentMethod === m.id
                          ? "border-ink bg-ink text-cream shadow-[0_10px_24px_-16px_rgba(38,59,57,0.9)]"
                          : "border-line bg-cream-bright text-ink/65 hover:border-accent",
                      )}
                    >
                      {m.label}
                    </button>
                  ))}
                </div>

                <div className="mt-5 grid gap-4 sm:grid-cols-2">
                  {form.paymentMethod === "upi" && (
                    <Field label="UPI ID" error={errors.upiId} className="sm:col-span-2">
                      <input
                        className="field"
                        value={form.upiId}
                        onChange={(e) => set("upiId", e.target.value.trim())}
                        placeholder="ananya@okhdfcbank"
                      />
                    </Field>
                  )}
                  {form.paymentMethod === "card" && (
                    <>
                      <Field label="Card number" error={errors.cardNumber} className="sm:col-span-2">
                        <input
                          className="field tracking-[0.16em]"
                          inputMode="numeric"
                          value={form.cardNumber}
                          onChange={(e) =>
                            set(
                              "cardNumber",
                              e.target.value
                                .replace(/\D/g, "")
                                .slice(0, 16)
                                .replace(/(.{4})/g, "$1 ")
                                .trim(),
                            )
                          }
                          placeholder="4111 1111 1111 1111"
                        />
                      </Field>
                      <Field label="Name on card" error={errors.cardName}>
                        <input
                          className="field"
                          value={form.cardName}
                          onChange={(e) => set("cardName", e.target.value)}
                          placeholder="ANANYA REDDY"
                        />
                      </Field>
                      <div className="grid grid-cols-2 gap-4">
                        <Field label="Expiry" error={errors.expiry}>
                          <input
                            className="field"
                            inputMode="numeric"
                            value={form.expiry}
                            onChange={(e) => {
                              const digits = e.target.value.replace(/\D/g, "").slice(0, 4);
                              set("expiry", digits.length > 2 ? `${digits.slice(0, 2)}/${digits.slice(2)}` : digits);
                            }}
                            placeholder="09/28"
                          />
                        </Field>
                        <Field label="CVV" error={errors.cvv}>
                          <input
                            className="field"
                            inputMode="numeric"
                            type="password"
                            maxLength={4}
                            value={form.cvv}
                            onChange={(e) => set("cvv", e.target.value.replace(/\D/g, ""))}
                            placeholder="•••"
                          />
                        </Field>
                      </div>
                    </>
                  )}
                  {form.paymentMethod === "netbanking" && (
                    <Field label="Choose your bank" className="sm:col-span-2">
                      <span className="relative block">
                        <select
                          className="field appearance-none pr-10"
                          value={form.bank}
                          onChange={(e) => set("bank", e.target.value)}
                        >
                          {["HDFC Bank", "ICICI Bank", "State Bank of India", "Axis Bank", "Kotak Mahindra Bank"].map(
                            (b) => (
                              <option key={b}>{b}</option>
                            ),
                          )}
                        </select>
                        <Chevron />
                      </span>
                    </Field>
                  )}
                  {form.paymentMethod === "cod" && (
                    <p className="sm:col-span-2 rounded-2xl bg-cream px-4 py-3.5 text-sm leading-relaxed text-ink/65">
                      Pay the rider in cash or by UPI at your door. Keep exact change handy — they
                      carry limited change.
                    </p>
                  )}
                </div>

                <p className="mt-4 text-[0.72rem] leading-relaxed text-ink/45">
                  Demo checkout: no live gateway keys are configured, so no card data is sent or
                  stored. Swap in your Razorpay / Cashfree key on the server to go live.
                </p>

                {failure && (
                  <p className="mt-4 rounded-2xl bg-accent/15 px-4 py-3 text-sm font-semibold text-accent-deep">
                    {failure}
                  </p>
                )}

                <div className="mt-6 flex flex-wrap gap-3">
                  <button type="button" onClick={() => setStep(1)} className="btn btn-ghost">
                    Back
                  </button>
                  <button
                    type="button"
                    onClick={placeOrder}
                    disabled={submitting}
                    className="btn btn-primary flex-1 disabled:opacity-70"
                  >
                    {submitting ? (
                      <>
                        <span className="h-4 w-4 animate-[spin_0.9s_linear_infinite] rounded-full border-2 border-ink/30 border-t-ink" />
                        Processing {inr(totalPaise)}…
                      </>
                    ) : (
                      <>
                        {form.paymentMethod === "cod" ? "Place order" : `Pay ${inr(totalPaise)}`}
                        <ArrowRightIcon className="h-4 w-4" strokeWidth={2} />
                      </>
                    )}
                  </button>
                </div>
              </section>
            )}
          </div>

          {/* Summary */}
          <aside className="lg:sticky lg:top-32">
            <div className="rounded-[1.75rem] border border-line bg-cream-bright p-6 shadow-soft">
              <h2 className="font-display text-lg font-semibold">Order summary</h2>

              <div className="mt-4 rounded-2xl bg-cream p-4">
                <p className="text-[0.72rem] leading-snug font-bold tracking-wide text-ink/55 uppercase">
                  {freeDeliveryGapPaise > 0
                    ? `Add ${inr(freeDeliveryGapPaise)} more for free delivery`
                    : "Free delivery unlocked"}
                </p>
                <div className="mt-2.5 h-1.5 overflow-hidden rounded-full bg-sage/60">
                  <div
                    className="h-full rounded-full bg-accent transition-[width] duration-700 ease-[cubic-bezier(.22,1,.36,1)]"
                    style={{ width: `${gapPercent}%` }}
                  />
                </div>
              </div>

              {/* Promo Code Box */}
              <div className="mt-4 rounded-2xl border border-line bg-cream/70 p-3.5">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-ink/75">Have a coupon code?</span>
                  {appliedCoupon && (
                    <button
                      type="button"
                      onClick={() => setAppliedCoupon(null)}
                      className="text-[0.68rem] font-bold text-accent-deep hover:underline"
                    >
                      Remove
                    </button>
                  )}
                </div>

                {appliedCoupon ? (
                  <div className="mt-2 flex items-center justify-between rounded-xl bg-sage/60 px-3 py-2 text-xs font-bold text-ink">
                    <span>🎉 {appliedCoupon} applied</span>
                    <span className="text-sage-deep">
                      {appliedCoupon === "HYDFREE" ? "Free Delivery" : `− ${inr(promoDiscountPaise)}`}
                    </span>
                  </div>
                ) : (
                  <>
                    <div className="mt-2 flex gap-2">
                      <input
                        value={couponInput}
                        onChange={(e) => {
                          setCouponInput(e.target.value.toUpperCase());
                          setCouponError(null);
                        }}
                        placeholder="FIRSTEGG / FARM10"
                        className="field py-1.5! text-xs font-semibold uppercase"
                      />
                      <button
                        type="button"
                        onClick={() => applyPromo(couponInput)}
                        className="btn btn-dark px-3! py-1.5! text-xs shrink-0"
                      >
                        Apply
                      </button>
                    </div>
                    <div className="mt-2 flex flex-wrap gap-1.5 text-[0.68rem]">
                      <button
                        type="button"
                        onClick={() => applyPromo("FIRSTEGG")}
                        className="rounded-lg border border-line bg-cream-bright px-2 py-0.5 font-bold text-ink/65 transition-colors hover:border-accent"
                      >
                        🏷️ FIRSTEGG (₹50 off)
                      </button>
                      <button
                        type="button"
                        onClick={() => applyPromo("FARM10")}
                        className="rounded-lg border border-line bg-cream-bright px-2 py-0.5 font-bold text-ink/65 transition-colors hover:border-accent"
                      >
                        🏷️ FARM10 (10% off)
                      </button>
                    </div>
                  </>
                )}
                {couponError && (
                  <p className="mt-1.5 text-[0.72rem] font-semibold text-accent-deep">
                    {couponError}
                  </p>
                )}
              </div>

              <dl className="mt-5 space-y-2.5 text-[0.9rem]">
                <Row label={`Subtotal (${count} pack${count === 1 ? "" : "s"})`} value={inr(subtotalPaise)} />
                {discountPaise > 0 && (
                  <Row label="Weekly plan −10%" value={`− ${inr(discountPaise)}`} accent />
                )}
                {promoDiscountPaise > 0 && (
                  <Row label={`Coupon (${appliedCoupon})`} value={`− ${inr(promoDiscountPaise)}`} accent />
                )}
                <Row
                  label="Delivery"
                  value={effectiveDeliveryPaise === 0 ? "Free" : inr(effectiveDeliveryPaise)}
                  accent={effectiveDeliveryPaise === 0}
                />
                <div className="mt-4! flex items-end justify-between border-t border-line pt-4">
                  <dt className="text-[0.72rem] font-bold tracking-[0.16em] text-ink/50 uppercase">
                    To pay
                  </dt>
                  <dd className="font-display text-[1.85rem] leading-none font-semibold">
                    {inr(effectiveTotalPaise)}
                  </dd>
                </div>
              </dl>

              <ul className="mt-6 space-y-3 border-t border-line pt-5 text-[0.82rem] text-ink/60">
                {[
                  "Farm-packed the same night you order",
                  "Any cracked egg replaced on the spot",
                  "Cold-chain free, kraft pulp trays",
                ].map((point) => (
                  <li key={point} className="flex items-start gap-2.5">
                    <CheckIcon className="mt-0.5 h-4 w-4 shrink-0 text-sage-deep" strokeWidth={2.4} />
                    {point}
                  </li>
                ))}
              </ul>
            </div>

            <div className="mt-4 flex items-center gap-3 rounded-[1.4rem] border border-line bg-ink px-5 py-4 text-cream">
              <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-accent text-ink-deep">
                <ClockIcon className="h-5 w-5" strokeWidth={1.7} />
              </span>
              <p className="text-[0.8rem] leading-snug">
                Order before <span className="font-bold text-accent">9:00 PM</span> and your eggs
                arrive tomorrow by 7:00 AM.
              </p>
            </div>
          </aside>
        </div>
      </div>

      {/* Mobile action bar */}
      <div className="fixed inset-x-0 bottom-0 z-40 border-t border-line bg-cream-bright/95 px-4 pt-3 pb-[calc(0.75rem+env(safe-area-inset-bottom,0px))] backdrop-blur-xl lg:hidden">
        <div className="flex items-center justify-between gap-4">
          <div className="min-w-0">
            <p className="text-[0.65rem] font-bold tracking-[0.14em] text-ink/45 uppercase">
              {steps[step]} · to pay
            </p>
            <p className="font-display truncate text-xl font-semibold">{inr(effectiveTotalPaise)}</p>
          </div>
          {step < 2 ? (
            <button
              type="button"
              onClick={() => (step === 0 ? setStep(1) : validateDelivery() && setStep(2))}
              className="btn btn-primary shrink-0 py-3! text-[0.82rem]"
            >
              {step === 0 ? "Delivery details" : "Payment"}
              <ArrowRightIcon className="h-4 w-4" strokeWidth={2} />
            </button>
          ) : (
            <button
              type="button"
              onClick={placeOrder}
              disabled={submitting}
              className="btn btn-primary shrink-0 py-3! text-[0.82rem]"
            >
              {submitting ? "Processing…" : "Place order"}
              <ArrowRightIcon className="h-4 w-4" strokeWidth={2} />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

function Chevron() {
  return (
    <svg
      aria-hidden
      viewBox="0 0 24 24"
      className="pointer-events-none absolute top-1/2 right-3.5 h-4 w-4 -translate-y-1/2 text-ink/45"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M6 9.5l6 5.5 6-5.5" />
    </svg>
  );
}

function Row({ label, value, accent }: { label: string; value: string; accent?: boolean }) {
  return (
    <div className="flex items-center justify-between">
      <dt className="text-ink/60">{label}</dt>
      <dd className={cn("font-bold", accent ? "text-sage-deep" : "text-ink")}>{value}</dd>
    </div>
  );
}

function Field({
  label,
  error,
  children,
  className,
}: {
  label: string;
  error?: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <label className={cn("block", className)}>
      <span className="mb-1.5 block text-[0.7rem] font-bold tracking-[0.12em] text-ink/55 uppercase">
        {label}
      </span>
      {children}
      {error && <span className="mt-1.5 block text-xs font-semibold text-accent-deep">{error}</span>}
    </label>
  );
}
