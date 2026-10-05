"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect } from "react";
import { ArrowRightIcon, CloseIcon, EggIcon, TrashIcon } from "@/components/Icons";
import { MinusIcon, PlusIcon } from "@/components/Icons";
import { useCart } from "@/components/cart/CartProvider";
import { inr } from "@/lib/money";
import { cn } from "@/lib/cn";

export function CartDrawer() {
  const { isOpen, close, lines, setQty, remove, totalPaise, count } = useCart();

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [close]);

  return (
    <div
      className={cn(
        "fixed inset-0 z-[70] transition-opacity duration-300",
        isOpen ? "opacity-100" : "pointer-events-none opacity-0",
      )}
      aria-hidden={!isOpen}
    >
      <button
        type="button"
        tabIndex={isOpen ? 0 : -1}
        aria-label="Close cart"
        onClick={close}
        className="absolute inset-0 h-full w-full cursor-default bg-ink/45 backdrop-blur-[2px]"
      />
      <aside
        role="dialog"
        aria-label="Your cart"
        className={cn(
          "absolute top-0 right-0 flex h-full w-full max-w-[26.5rem] flex-col bg-cream-bright shadow-[-30px_0_60px_-30px_rgba(38,59,57,0.4)] transition-transform duration-500 ease-[cubic-bezier(.22,1,.36,1)]",
          isOpen ? "translate-x-0" : "translate-x-full",
        )}
      >
        <div className="flex items-center justify-between border-b border-line px-6 py-5">
          <div>
            <p className="font-display text-xl font-semibold">Your basket</p>
            <p className="text-xs font-medium tracking-wide text-ink/55">
              {count} item{count === 1 ? "" : "s"} · farm packed this morning
            </p>
          </div>
          <button
            type="button"
            onClick={close}
            aria-label="Close cart"
            className="grid h-10 w-10 place-items-center rounded-full border border-line text-ink transition-colors hover:border-accent hover:text-accent-deep"
          >
            <CloseIcon className="h-4.5 w-4.5" />
          </button>
        </div>

        {lines.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center gap-4 px-8 text-center">
            <span className="grid h-16 w-16 place-items-center rounded-full bg-sage/70 text-ink">
              <EggIcon className="h-7 w-7" />
            </span>
            <div>
              <p className="font-display text-xl">Your basket is empty</p>
              <p className="mt-1 text-sm text-ink/60">
                Add a pack and we&rsquo;ll farm-pack it for tomorrow morning.
              </p>
            </div>
            <button type="button" onClick={close} className="btn btn-dark mt-1">
              Browse eggs
            </button>
          </div>
        ) : (
          <>
            <ul className="flex-1 space-y-3 overflow-y-auto px-5 py-5">
              {lines.map((line) => (
                <li
                  key={line.variantId}
                  className="flex gap-4 rounded-3xl border border-line bg-cream/70 p-3"
                >
                  <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-2xl bg-sage/50">
                    <Image
                      src={line.image}
                      alt={line.name}
                      fill
                      sizes="80px"
                      className="object-cover"
                    />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-start justify-between gap-2">
                      <p className="truncate text-sm font-bold">{line.name}</p>
                      <button
                        type="button"
                        onClick={() => remove(line.variantId)}
                        aria-label={`Remove ${line.name}`}
                        className="text-ink/40 transition-colors hover:text-accent-deep"
                      >
                        <TrashIcon className="h-4 w-4" />
                      </button>
                    </div>
                    <p className="mt-0.5 text-xs text-ink/55">
                      {line.packLabel} · {inr(line.unitPricePaise)}
                    </p>
                    <div className="mt-2.5 flex items-center justify-between">
                      <QtyStepper
                        qty={line.qty}
                        onDec={() => setQty(line.variantId, line.qty - 1)}
                        onInc={() => setQty(line.variantId, line.qty + 1)}
                      />
                      <p className="text-sm font-bold">{inr(line.unitPricePaise * line.qty)}</p>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
            <div className="border-t border-line bg-cream/60 px-6 py-5">
              <div className="flex items-end justify-between">
                <p className="text-xs font-semibold tracking-[0.14em] text-ink/55 uppercase">
                  Total
                </p>
                <p className="font-display text-2xl font-semibold">{inr(totalPaise)}</p>
              </div>
              <Link href="/cart" onClick={close} className="btn btn-primary mt-4 w-full">
                Checkout
                <ArrowRightIcon className="h-4 w-4" />
              </Link>
              <button
                type="button"
                onClick={close}
                className="mt-2 w-full text-xs font-semibold tracking-wide text-ink/55 transition-colors hover:text-ink"
              >
                Continue shopping
              </button>
            </div>
          </>
        )}
      </aside>
    </div>
  );
}

function QtyStepper({
  qty,
  onDec,
  onInc,
}: {
  qty: number;
  onDec: () => void;
  onInc: () => void;
}) {
  return (
    <div className="inline-flex items-center rounded-full border border-line bg-cream-bright">
      <button
        type="button"
        onClick={onDec}
        aria-label="Decrease quantity"
        className="grid h-8 w-8 place-items-center rounded-full text-ink transition-colors hover:bg-sage/60"
      >
        <MinusIcon className="h-3.5 w-3.5" strokeWidth={2.2} />
      </button>
      <span className="w-7 text-center text-sm font-bold tabular-nums">{qty}</span>
      <button
        type="button"
        onClick={onInc}
        aria-label="Increase quantity"
        className="grid h-8 w-8 place-items-center rounded-full text-ink transition-colors hover:bg-sage/60"
      >
        <PlusIcon className="h-3.5 w-3.5" strokeWidth={2.2} />
      </button>
    </div>
  );
}
