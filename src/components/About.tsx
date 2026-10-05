import Image from "next/image";
import Link from "next/link";
import { ArrowRightIcon, EggIcon, LeafIcon, ShieldCheckIcon } from "@/components/Icons";
import { Reveal } from "@/components/Reveal";

const stats = [
  { value: "42", label: "farm days of trust, every month" },
  { value: "<18h", label: "from nest to doorstep" },
  { value: "100%", label: "candled & graded eggs" },
];

export function About() {
  return (
    <section id="about" className="relative scroll-mt-28 overflow-hidden py-20 sm:py-28">
      <div className="shell grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
        <Reveal className="relative">
          <div className="relative">
            <div className="overflow-hidden rounded-[2rem] rounded-tl-[9rem] border border-line bg-sage/40 shadow-lift">
              <Image
                src="/images/about-farm.jpg"
                alt="Free-range hens on the pasture at Home Farms during golden hour"
                width={1000}
                height={1200}
                sizes="(max-width: 1024px) 92vw, 520px"
                className="h-[22rem] w-full object-cover transition-transform duration-[1.4s] ease-out hover:scale-105 sm:h-[30rem]"
              />
            </div>

            <div className="absolute -right-2 -bottom-10 w-[13.5rem] rounded-[1.6rem] border border-line bg-cream-bright/95 p-5 shadow-soft backdrop-blur sm:-right-8">
              <span className="grid h-10 w-10 place-items-center rounded-full bg-sage/70 text-ink">
                <LeafIcon className="h-5 w-5" strokeWidth={1.6} />
              </span>
              <p className="mt-3 text-[0.95rem] leading-snug font-bold">
                Slow-grown, cage-free flocks
              </p>
              <p className="mt-1 text-xs leading-relaxed text-ink/55">
                Grain &amp; flax feed, open runs, no routine antibiotics.
              </p>
            </div>
          </div>
        </Reveal>

        <Reveal delay={120} className="lg:pl-6">
          <span className="eyebrow text-accent-deep">
            <span className="h-px w-8 bg-accent/60" />
            About Egglu
          </span>
          <h2 className="mt-5 text-[2.05rem] leading-[1.1] font-semibold sm:text-[2.9rem]">
            A small farm&rsquo;s eggs,
            <br />
            <span className="italic font-normal text-ink/55">run like a modern dairy.</span>
          </h2>
          <p className="mt-6 max-w-md text-[1rem] leading-relaxed text-ink/62">
            Egglu is the egg kitchen of Home Farms — a family flock outside Hyderabad, a
            grading table, and riders who leave before sunrise. No cold storage, no middlemen,
            no week-old shells.
          </p>

          <div className="mt-9 grid gap-5 sm:grid-cols-3">
            {stats.map((s) => (
              <div key={s.value} className="rounded-2xl border border-line bg-cream-bright/80 p-4">
                <p className="font-display text-[1.75rem] leading-none font-semibold text-ink">
                  {s.value}
                </p>
                <p className="mt-2 text-[0.72rem] leading-snug text-ink/55">{s.label}</p>
              </div>
            ))}
          </div>

          <div className="mt-9 flex flex-wrap items-center gap-4">
            <Link href="/#eggs" className="btn btn-dark">
              See the range
              <ArrowRightIcon className="h-4 w-4" strokeWidth={2} />
            </Link>
            <p className="flex items-center gap-2 text-sm font-semibold text-ink/60">
              <ShieldCheckIcon className="h-5 w-5 text-sage-deep" strokeWidth={1.6} />
              Traceable batch number on every tray
            </p>
            <p className="flex items-center gap-2 text-sm font-semibold text-ink/60">
              <EggIcon className="h-5 w-5 text-accent" strokeWidth={1.6} />
              Two farms, one standard
            </p>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
