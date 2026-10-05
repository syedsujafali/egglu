import Image from "next/image";
import Link from "next/link";
import { ArrowRightIcon } from "@/components/Icons";
import { Reveal } from "@/components/Reveal";

export function FinalCta() {
  return (
    <section className="relative overflow-hidden">
      <div className="shell pb-20 sm:pb-24">
        <Reveal>
          <div className="relative isolate overflow-hidden rounded-[2.25rem] border border-ink/10 bg-ink shadow-lift">
            <Image
              src="/images/cta-banner.jpg"
              alt="Brown and white eggs on a dark green surface lit with warm amber light"
              width={1600}
              height={800}
              priority
              sizes="(max-width: 1280px) 100vw, 1216px"
              className="animate-kenburns absolute inset-0 -z-10 h-full w-full object-cover opacity-70"
            />
            <div
              aria-hidden
              className="absolute inset-0 -z-10 bg-gradient-to-r from-ink via-ink/85 to-ink/25"
            />
            <div className="grid gap-8 px-7 py-14 sm:px-12 sm:py-16 lg:grid-cols-[1.1fr_0.9fr] lg:items-center lg:py-20">
              <div>
                <span className="eyebrow text-accent">
                  <span className="h-px w-6 bg-accent/60" />
                  Egglu · Home Farms
                </span>
                <h2 className="mt-5 text-[2.35rem] leading-[1.05] font-semibold text-cream text-balance sm:text-[3.4rem]">
                  Fresh Eggs.
                  <br />
                  <span className="italic font-normal text-accent">Simple Choice.</span>
                </h2>
                <p className="mt-5 max-w-sm text-[0.95rem] leading-relaxed text-cream/70">
                  One carton from Home Farms and it&rsquo;s hard to go back to the tray in the
                  fridge aisle.
                </p>
              </div>
              <div className="flex flex-wrap items-center gap-4 lg:justify-end">
                <Link href="/#eggs" className="btn btn-primary text-[0.95rem]">
                  Shop Now
                  <ArrowRightIcon className="h-4.5 w-4.5" strokeWidth={2} />
                </Link>
                <Link
                  href="/cart"
                  className="btn border border-cream/25 text-cream hover:bg-cream/10"
                >
                  View basket
                </Link>
                <p className="w-full text-[0.75rem] font-semibold tracking-wide text-cream/50 lg:text-right">
                  Free delivery over ₹349 · Pay by UPI, card or cash
                </p>
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
