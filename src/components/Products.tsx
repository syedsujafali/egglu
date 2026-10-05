"use client";

import Image from "next/image";
import { useState } from "react";
import { products, type Product } from "@/data/products";
import { inr } from "@/lib/money";
import { Reveal } from "@/components/Reveal";
import { useCart } from "@/components/cart/CartProvider";
import { ArrowRightIcon, CartIcon, CheckIcon, MinusIcon, PlusIcon } from "@/components/Icons";
import { cn } from "@/lib/cn";

export function Products() {
  return (
    <section id="eggs" className="relative scroll-mt-28 py-20 sm:py-28">
      <div className="shell">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <Reveal className="max-w-xl">
            <span className="eyebrow text-accent-deep">
              <span className="h-px w-8 bg-accent/60" />
              Our Eggs
            </span>
            <h2 className="mt-4 text-[2.1rem] leading-[1.08] font-semibold sm:text-5xl">
              Four small batches.
              <br />
              <span className="italic font-normal text-ink/55">Zero compromise.</span>
            </h2>
            <p className="mt-4 max-w-md text-[0.98rem] leading-relaxed text-ink/60">
              Choose your pack, we candle, grade and pulp-tray it the same night.
            </p>
          </Reveal>
          <Reveal delay={120}>
            <div className="flex items-center gap-3 rounded-full border border-line bg-cream-bright px-5 py-3 text-sm font-semibold shadow-soft">
              <span className="grid h-7 w-7 place-items-center rounded-full bg-sage/70 text-ink">
                <CheckIcon className="h-4 w-4" strokeWidth={2.4} />
              </span>
              Free delivery over ₹349
            </div>
          </Reveal>
        </div>

        <div className="mt-12 grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
          {products.map((product, i) => (
            <Reveal key={product.id} delay={i * 90} as="div">
              <ProductCard product={product} />
            </Reveal>
          ))}
        </div>

        <Reveal delay={120}>
          <div className="mt-12 flex flex-col items-center justify-between gap-5 rounded-[1.75rem] border border-line bg-ink px-7 py-6 text-cream sm:flex-row">
            <p className="max-w-lg text-[0.95rem] leading-relaxed text-cream/80">
              <span className="font-display text-lg text-cream">Not sure where to start?</span>{" "}
              Most Hyderabad homes begin with the Kolam pack of 12 — then add Omega-3 for
              breakfast days.
            </p>
            <a href="/#eggs" onClick={() => scrollToAdd()} className="btn btn-primary shrink-0">
              Build my basket
              <ArrowRightIcon className="h-4 w-4" strokeWidth={2} />
            </a>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

function scrollToAdd() {
  const el = document.getElementById("eggs");
  el?.scrollIntoView({ behavior: "smooth", block: "start" });
}

function ProductCard({ product }: { product: Product }) {
  const [packIndex, setPackIndex] = useState(product.packs.length > 1 ? 1 : 0);
  const [qty, setQty] = useState(1);
  const { add, lastAdded } = useCart();
  const pack = product.packs[packIndex];
  const variantId = `${product.id}::${pack.id}`;
  const justAdded = lastAdded === variantId;
  const savings = pack.compareAtPaise ? pack.compareAtPaise - pack.pricePaise : 0;

  return (
    <article className="card group flex h-full flex-col overflow-hidden">
      <div className="relative aspect-square overflow-hidden bg-sage/40">
        <Image
          src={product.image}
          alt={product.name}
          fill
          sizes="(max-width: 640px) 92vw, (max-width: 1280px) 45vw, 300px"
          className="object-cover transition-transform duration-[1.1s] ease-[cubic-bezier(.22,1,.36,1)] group-hover:scale-[1.07]"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-ink/18 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
        {product.badge && (
          <span className="absolute top-3.5 left-3.5 rounded-full bg-cream-bright/95 px-3 py-1 text-[0.62rem] font-bold tracking-[0.14em] text-ink uppercase shadow-soft backdrop-blur">
            {product.badge}
          </span>
        )}
        {savings > 0 && (
          <span className="absolute top-3.5 right-3.5 rounded-full bg-accent px-2.5 py-1 text-[0.65rem] font-bold text-ink-deep shadow-soft">
            Save {inr(savings)}
          </span>
        )}
        <span className="absolute bottom-3.5 left-3.5 flex items-center gap-1.5 rounded-full bg-ink/80 px-3 py-1.5 text-[0.68rem] font-semibold text-cream/90 backdrop-blur">
          <span className="h-1.5 w-1.5 rounded-full bg-sage-deep" />
          {product.kicker}
        </span>
      </div>

      <div className="flex flex-1 flex-col p-5">
        <h3 className="font-display text-[1.32rem] leading-snug font-semibold">{product.name}</h3>
        <p className="mt-1.5 text-[0.84rem] leading-relaxed text-ink/58">{product.blurb}</p>

        <dl className="mt-4 flex gap-4 text-[0.7rem]">
          <div className="rounded-xl bg-cream px-3 py-2">
            <dt className="text-ink/45">Protein / egg</dt>
            <dd className="font-bold">{product.proteinPerEgg}</dd>
          </div>
          <div className="rounded-xl bg-cream px-3 py-2">
            <dt className="text-ink/45">Shell</dt>
            <dd className="font-bold">{product.shellColour}</dd>
          </div>
        </dl>

        <div className="mt-5">
          <p className="mb-2 text-[0.68rem] font-bold tracking-[0.16em] text-ink/45 uppercase">
            Pack size
          </p>
          <div className="flex flex-wrap gap-2">
            {product.packs.map((p, i) => (
              <button
                key={p.id}
                type="button"
                onClick={() => setPackIndex(i)}
                aria-pressed={i === packIndex}
                className={cn(
                  "rounded-full border px-3.5 py-1.5 text-xs font-bold transition-all duration-300",
                  i === packIndex
                    ? "border-ink bg-ink text-cream shadow-[0_8px_18px_-12px_rgba(38,59,57,0.9)]"
                    : "border-line bg-cream-bright text-ink/70 hover:border-accent hover:text-ink",
                )}
              >
                {p.label}
              </button>
            ))}
          </div>
        </div>

        <div className="mt-auto flex items-end justify-between gap-3 pt-6">
          <div>
            <p className="font-display text-2xl leading-none font-semibold">{inr(pack.pricePaise)}</p>
            <p className="mt-1 text-[0.72rem] text-ink/45">
              {inr(Math.round(pack.pricePaise / pack.count))} per egg
              {pack.compareAtPaise ? ` · MRP ${inr(pack.compareAtPaise)}` : ""}
            </p>
          </div>
          <div className="inline-flex items-center rounded-full border border-line bg-cream">
            <button
              type="button"
              onClick={() => setQty((q) => Math.max(1, q - 1))}
              aria-label={`Decrease ${product.name} quantity`}
              className="grid h-9 w-9 place-items-center rounded-full transition-colors hover:bg-sage/60 disabled:opacity-30"
              disabled={qty === 1}
            >
              <MinusIcon className="h-3.5 w-3.5" strokeWidth={2.4} />
            </button>
            <span className="w-6 text-center text-sm font-bold tabular-nums">{qty}</span>
            <button
              type="button"
              onClick={() => setQty((q) => Math.min(30, q + 1))}
              aria-label={`Increase ${product.name} quantity`}
              className="grid h-9 w-9 place-items-center rounded-full transition-colors hover:bg-sage/60"
            >
              <PlusIcon className="h-3.5 w-3.5" strokeWidth={2.4} />
            </button>
          </div>
        </div>

        <button
          type="button"
          onClick={() => add(product.id, pack.id, qty)}
          className={cn(
            "btn mt-5 w-full text-[0.85rem]",
            justAdded ? "bg-sage-deep text-ink-deep" : "btn-primary",
          )}
        >
          {justAdded ? (
            <>
              <CheckIcon className="h-4 w-4" strokeWidth={2.6} />
              Added to basket
            </>
          ) : (
            <>
              <CartIcon className="h-4 w-4" strokeWidth={1.9} />
              Add to Cart · {inr(pack.pricePaise * qty)}
            </>
          )}
        </button>
      </div>
    </article>
  );
}
