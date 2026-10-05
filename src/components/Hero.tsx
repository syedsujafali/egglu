"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { isServiceable } from "@/data/delivery";
import { ArrowRightIcon, CheckIcon, ClockIcon, LeafIcon, PinIcon, StarIcon } from "@/components/Icons";
import { Reveal } from "@/components/Reveal";
import { cn } from "@/lib/cn";

const marqueeItems = [
  "Kolam brown",
  "Omega-3 enriched",
  "Candled & graded",
  "No antibiotics",
  "Country desi",
  "Moulded pulp packing",
  "6 AM doorstep drop",
  "Hyderabad wide",
];

export function Hero() {
  const [pincode, setPincode] = useState("");
  const [result, setResult] = useState<null | { ok: boolean; text: string }>(null);

  const check = () => {
    const value = pincode.trim();
    if (!/^\d{6}$/.test(value)) {
      setResult({ ok: false, text: "Enter a valid 6-digit pincode" });
      return;
    }
    setResult(
      isServiceable(value)
        ? { ok: true, text: "Delivering to you — order by 9 PM for tomorrow 6 AM" }
        : { ok: false, text: "Not there yet. We're expanding across Hyderabad soon." },
    );
  };

  return (
    <section id="home" className="relative overflow-hidden">
      {/* soft organic background */}
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-b from-cream via-cream to-cream-bright" />
        <div className="bg-egglu-grain absolute inset-0 opacity-60 [mask-image:radial-gradient(70%_60%_at_50%_35%,#000,transparent)]" />
        <div className="animate-float absolute -top-24 -left-28 h-[26rem] w-[22rem] rounded-[50%_50%_48%_52%/60%_58%_42%_40%] bg-sage/60 blur-[2px]" />
        <div
          className="animate-float absolute top-1/3 -right-32 h-[22rem] w-[18rem] rounded-[52%_48%_50%_50%/45%_55%_45%_55%] bg-accent-soft/45"
          style={{ animationDelay: "1.6s" }}
        />
        <svg
          className="animate-float absolute top-24 left-[42%] hidden h-24 w-20 text-sage-deep/45 lg:block"
          viewBox="0 0 80 100"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          style={{ animationDelay: "0.8s" }}
        >
          <path d="M40 4C20 4 6 28 6 52c0 26 15 44 34 44s34-18 34-44C74 28 60 4 40 4Z" strokeDasharray="5 7" />
        </svg>
      </div>

      <div className="shell grid items-center gap-12 pt-14 pb-10 lg:grid-cols-[1.02fr_1fr] lg:gap-8 lg:pt-20 lg:pb-14">
        <div className="relative max-w-xl">
          <Reveal>
            <span className="eyebrow rounded-full border border-line bg-cream-bright/80 px-4 py-2 text-ink/70 shadow-[0_1px_0_rgba(38,59,57,0.04)]">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-sage-deep opacity-70 motion-reduce:hidden" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-accent" />
              </span>
              Home Farms · Hyderabad
            </span>
          </Reveal>

          <Reveal delay={90}>
            <h1 className="mt-6 text-[2.6rem] leading-[1.03] font-semibold text-balance sm:text-6xl lg:text-[4.15rem]">
              Farm Fresh Eggs,
              <br />
              <span className="relative inline-block italic font-normal text-accent-deep">
                Delivered
                <svg
                  aria-hidden
                  viewBox="0 0 220 12"
                  className="absolute -bottom-1 left-0 h-2.5 w-full text-accent/45"
                  preserveAspectRatio="none"
                >
                  <path
                    d="M2 8.5C46 3 92 1.5 140 4.5c28 1.7 52 4 78 2"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="3.4"
                    strokeLinecap="round"
                  />
                </svg>
              </span>{" "}
              to You.
            </h1>
          </Reveal>

          <Reveal delay={170}>
            <p className="mt-6 text-[1.02rem] leading-relaxed text-ink/65 sm:text-lg">
              Fresh, quality eggs from Home Farms, delivered straight to your doorstep.
            </p>
          </Reveal>

          <Reveal delay={240}>
            <div className="mt-8 flex flex-wrap items-center gap-3">
              <Link href="/#eggs" className="btn btn-primary">
                Shop Eggs
                <ArrowRightIcon className="h-4 w-4" strokeWidth={2} />
              </Link>
              <Link href="/#about" className="btn btn-ghost">
                Explore Egglu
              </Link>
            </div>
          </Reveal>

          <Reveal delay={310}>
            <div className="mt-9 flex flex-wrap items-center gap-x-8 gap-y-4 border-t border-line pt-7">
              <div className="flex items-center gap-2.5">
                <div className="flex text-accent">
                  {[0, 1, 2, 3, 4].map((i) => (
                    <StarIcon key={i} className="h-4 w-4" />
                  ))}
                </div>
                <p className="text-sm font-semibold text-ink/70">
                  4.9 · 2,400 Hyderabad homes
                </p>
              </div>
              <p className="flex items-center gap-2 text-sm font-semibold text-ink/70">
                <LeafIcon className="h-4 w-4 text-sage-deep" strokeWidth={1.8} />
                FSSAI 11522999000123
              </p>
            </div>
          </Reveal>

          <Reveal delay={380}>
            <div className="mt-8 max-w-sm rounded-[1.4rem] border border-line bg-cream-bright/90 p-2 shadow-soft backdrop-blur">
              <label htmlFor="hero-pincode" className="sr-only">
                Delivery pincode
              </label>
              <div className="flex items-center gap-2">
                <span className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-sage/60 text-ink">
                  <PinIcon className="h-5 w-5" strokeWidth={1.6} />
                </span>
                <input
                  id="hero-pincode"
                  inputMode="numeric"
                  maxLength={6}
                  value={pincode}
                  onChange={(e) => {
                    setPincode(e.target.value.replace(/[^\d]/g, ""));
                    setResult(null);
                  }}
                  onKeyDown={(e) => e.key === "Enter" && check()}
                  placeholder="Check pincode, e.g. 500081"
                  className="h-11 min-w-0 flex-1 border-0 bg-transparent text-sm font-semibold placeholder:font-medium placeholder:text-ink/40 focus:outline-none"
                />
                <button
                  type="button"
                  onClick={check}
                  className="btn btn-dark px-4! py-2.5! text-xs whitespace-nowrap"
                >
                  Check
                </button>
              </div>
              {result && (
                <p
                  className={cn(
                    "mt-1 flex items-center gap-1.5 px-1 pb-1 text-xs font-semibold",
                    result.ok ? "text-sage-deep" : "text-accent-deep",
                  )}
                >
                  {result.ok ? (
                    <CheckIcon className="h-3.5 w-3.5" strokeWidth={2.4} />
                  ) : (
                    <ClockIcon className="h-3.5 w-3.5" />
                  )}
                  {result.text}
                </p>
              )}
            </div>
          </Reveal>
        </div>

        {/* Hero image: egg-arch frame */}
        <Reveal delay={140} className="relative">
          <div className="relative mx-auto max-w-[34rem]">
            <div className="absolute -inset-4 -z-10 rounded-[16rem_16rem_2.5rem_2.5rem] bg-accent/10 blur-xl" />
            <div className="relative overflow-hidden rounded-t-[16rem] rounded-b-[2.5rem] border border-line bg-sage/40 shadow-lift">
              <Image
                src="/images/hero-eggs.jpg"
                alt="Fresh brown farm eggs in a recycled kraft carton on cream linen"
                width={1200}
                height={1400}
                priority
                sizes="(max-width: 1024px) 92vw, 540px"
                className="animate-kenburns h-[24rem] w-full object-cover sm:h-[30rem] lg:h-[34rem]"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-ink/25 via-transparent to-transparent" />
            </div>

            <div className="animate-float absolute -bottom-6 -left-3 flex items-center gap-3 rounded-3xl border border-line bg-cream-bright/95 px-4 py-3 shadow-soft backdrop-blur sm:-left-8">
              <span className="grid h-10 w-10 place-items-center rounded-2xl bg-sage/70 text-ink">
                <ClockIcon className="h-5 w-5" strokeWidth={1.7} />
              </span>
              <div>
                <p className="text-[0.7rem] font-bold tracking-wide text-ink/50 uppercase">
                  Picked today
                </p>
                <p className="text-sm font-bold">5:40 AM · Home Farms</p>
              </div>
            </div>

            <div
              className="animate-float absolute -top-3 right-0 flex items-center gap-3 rounded-3xl border border-line bg-ink px-4 py-3 text-cream shadow-soft sm:-right-6"
              style={{ animationDelay: "2.1s" }}
            >
              <span className="grid h-9 w-9 place-items-center rounded-full bg-accent text-ink">
                <CheckIcon className="h-4 w-4" strokeWidth={2.4} />
              </span>
              <p className="text-xs leading-tight font-semibold">
                Candled &amp; graded
                <br />
                <span className="font-normal text-cream/65">every single egg</span>
              </p>
            </div>
          </div>
        </Reveal>
      </div>

      {/* marquee */}
      <div className="relative mt-4 overflow-hidden border-y border-ink/10 bg-ink py-3.5">
        <div className="animate-marquee flex w-max gap-10 whitespace-nowrap motion-reduce:animate-none">
          {[0, 1].map((dup) => (
            <div key={dup} className="flex gap-10" aria-hidden={dup === 1}>
              {marqueeItems.map((item) => (
                <span
                  key={item}
                  className="flex items-center gap-10 text-[0.78rem] font-semibold tracking-[0.2em] text-cream/70 uppercase"
                >
                  {item}
                  <span className="h-1.5 w-1.5 rounded-full bg-accent" />
                </span>
              ))}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
