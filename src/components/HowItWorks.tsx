import { ClockIcon, EggIcon, ScooterIcon } from "@/components/Icons";
import { Reveal } from "@/components/Reveal";

const steps = [
  {
    n: "01",
    title: "Choose your eggs",
    text: "Pick a breed and a pack of 6, 12, 20 or 24.",
    Icon: EggIcon,
  },
  {
    n: "02",
    title: "Place your order",
    text: "Add your Hyderabad address and a delivery slot.",
    Icon: ClockIcon,
  },
  {
    n: "03",
    title: "Get them delivered",
    text: "Farm-packed overnight, at your door by 7 AM.",
    Icon: ScooterIcon,
  },
];

export function HowItWorks() {
  return (
    <section id="how" className="relative scroll-mt-28 overflow-hidden bg-ink py-20 text-cream sm:py-24">
      <div aria-hidden className="pointer-events-none absolute inset-0">
        <div className="bg-egglu-grain absolute inset-0 opacity-[0.16]" />
        <div className="absolute -top-28 left-1/2 h-[24rem] w-[24rem] -translate-x-1/2 rounded-full bg-sage-deep/12 blur-3xl" />
        <div className="absolute right-[8%] bottom-[-6rem] h-[18rem] w-[18rem] rounded-full bg-accent/12 blur-3xl" />
      </div>

      <div className="shell relative">
        <div className="grid gap-10 lg:grid-cols-[0.85fr_1.15fr] lg:items-end">
          <Reveal>
            <span className="eyebrow text-accent">
              <span className="h-px w-6 bg-accent/50" />
              How it works
            </span>
            <h2 className="mt-4 text-[2rem] leading-tight font-semibold text-cream sm:text-[2.6rem]">
              Three taps between
              <br />
              <span className="italic font-normal text-cream/60">you and breakfast.</span>
            </h2>
          </Reveal>
          <Reveal delay={120} className="lg:pb-2">
            <p className="max-w-md text-[0.95rem] leading-relaxed text-cream/60 lg:ml-auto">
              No app download, no minimum order, no walk-in pick-ups. Our riders start loading at
              Home Farms at 4:30 AM.
            </p>
          </Reveal>
        </div>

        <ol className="relative mt-14 grid gap-5 sm:grid-cols-3">
          <span
            aria-hidden
            className="absolute top-[3.6rem] right-8 left-8 hidden h-px bg-[repeating-linear-gradient(90deg,rgba(245,244,234,0.28)_0_8px,transparent_8px_18px)] sm:block"
          />
          {steps.map(({ n, title, text, Icon }, i) => (
            <Reveal key={n} as="li" delay={i * 130}>
              <div className="group relative h-full rounded-[1.6rem] border border-cream/12 bg-cream/[0.045] p-6 backdrop-blur-sm transition-all duration-500 hover:-translate-y-1.5 hover:border-accent/45 hover:bg-cream/[0.08]">
                <div className="flex items-center justify-between">
                  <span className="grid h-11 w-11 place-items-center rounded-full bg-accent text-ink-deep transition-transform duration-500 group-hover:rotate-6">
                    <Icon className="h-5.5 w-5.5" strokeWidth={1.7} />
                  </span>
                  <span className="font-display text-[2.1rem] leading-none font-semibold text-cream/20 transition-colors duration-500 group-hover:text-accent/60">
                    {n}
                  </span>
                </div>
                <h3 className="mt-6 font-display text-[1.3rem] font-semibold text-cream">
                  {title}
                </h3>
                <p className="mt-2 text-[0.88rem] leading-relaxed text-cream/58">{text}</p>
              </div>
            </Reveal>
          ))}
        </ol>

        <Reveal delay={200}>
          <div className="mt-10 flex flex-wrap items-center justify-center gap-x-8 gap-y-3 text-center text-[0.8rem] font-semibold tracking-wide text-cream/55">
            <span className="flex items-center gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-accent" /> Order by 9 PM, eat by 8 AM
            </span>
            <span className="flex items-center gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-sage-deep" /> Replace any cracked egg,
              no questions
            </span>
            <span className="flex items-center gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-accent" /> Pause a weekly plan anytime
            </span>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
