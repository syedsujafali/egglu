import { BoxIcon, LeafIcon, ScooterIcon, ShieldCheckIcon } from "@/components/Icons";
import { Reveal } from "@/components/Reveal";

const points = [
  {
    title: "Farm Fresh",
    text: "Collected at Home Farms every dawn, never stored in a cold warehouse.",
    Icon: LeafIcon,
  },
  {
    title: "Quality Checked",
    text: "Each egg is candled and graded — cracks and blood spots get rejected.",
    Icon: ShieldCheckIcon,
  },
  {
    title: "Hygienically Packed",
    text: "Sealed in food-safe moulded pulp trays, cushioned for the ride.",
    Icon: BoxIcon,
  },
  {
    title: "Delivered Fresh",
    text: "Ours within hours of laying, at your door before your filter coffee.",
    Icon: ScooterIcon,
  },
];

export function WhyEgglu() {
  return (
    <section id="why" className="relative scroll-mt-28 overflow-hidden bg-sage/45 py-20 sm:py-24">
      <div
        aria-hidden
        className="bg-egglu-grain pointer-events-none absolute inset-0 opacity-50"
      />
      <div className="shell relative">
        <Reveal className="mx-auto max-w-2xl text-center">
          <span className="eyebrow text-accent-deep">
            <span className="h-px w-6 bg-accent/60" />
            Why Egglu
            <span className="h-px w-6 bg-accent/60" />
          </span>
          <h2 className="mt-4 text-[2rem] leading-tight font-semibold sm:text-[2.75rem]">
            The four promises on every carton
          </h2>
        </Reveal>

        <ul className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {points.map(({ title, text, Icon }, i) => (
            <Reveal key={title} as="li" delay={i * 100}>
              <div className="card group h-full p-7">
                <span className="grid h-14 w-14 place-items-center rounded-[1.15rem] bg-cream-bright text-ink ring-1 ring-line transition-all duration-500 group-hover:-translate-y-1 group-hover:bg-accent group-hover:text-ink-deep group-hover:ring-accent">
                  <Icon className="h-6.5 w-6.5" strokeWidth={1.5} />
                </span>
                <h3 className="mt-6 font-display text-[1.35rem] font-semibold">{title}</h3>
                <p className="mt-2 text-[0.88rem] leading-relaxed text-ink/60">{text}</p>
                <span className="mt-6 block h-px w-0 bg-accent transition-all duration-700 ease-[cubic-bezier(.22,1,.36,1)] group-hover:w-16" />
              </div>
            </Reveal>
          ))}
        </ul>
      </div>
    </section>
  );
}
