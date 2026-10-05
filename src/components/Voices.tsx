import Image from "next/image";
import { StarIcon } from "@/components/Icons";
import { Reveal } from "@/components/Reveal";

const quotes = [
  {
    text: "The yolk colour is the real thing — my kids can tell the difference between Egglu and supermarket eggs.",
    name: "Sneha R.",
    place: "Kondapur",
  },
  {
    text: "Ordered at 10 PM, tray was at my door before the milk. Not one crack in six months.",
    name: "Imran K.",
    place: "Tolichowki",
  },
  {
    text: "We switched our café breakfast menu to the Omega-3 pack. Guests ask which farm it's from.",
    name: "Divya S.",
    place: "Railway Quarter",
  },
];

export function Voices() {
  return (
    <section className="relative overflow-hidden py-20 sm:py-24">
      <div className="shell grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
        <Reveal>
          <span className="eyebrow text-accent-deep">
            <span className="h-px w-8 bg-accent/60" />
            From Hyderabad kitchens
          </span>
          <h2 className="mt-4 text-[2rem] leading-tight font-semibold sm:text-[2.5rem]">
            1,900 carts a week,
            <br />
            <span className="italic font-normal text-ink/55">one steady habit.</span>
          </h2>
          <div className="mt-8 overflow-hidden rounded-[1.5rem] rounded-br-[6rem] border border-line shadow-soft">
            <Image
              src="/images/packing.jpg"
              alt="Gloved hands closing a kraft Egglu carton over a moulded pulp tray"
              width={900}
              height={620}
              sizes="(max-width: 1024px) 92vw, 460px"
              className="h-52 w-full object-cover transition-transform duration-[1.3s] hover:scale-105 sm:h-60"
            />
          </div>
        </Reveal>

        <ul className="grid gap-5">
          {quotes.map((q, i) => (
            <Reveal key={q.name} as="li" delay={i * 110}>
              <figure className="card flex h-full flex-col gap-4 p-6 sm:flex-row sm:items-start">
                <blockquote className="flex-1">
                  <p className="font-display text-[1.05rem] leading-relaxed text-ink/85 italic">
                    &ldquo;{q.text}&rdquo;
                  </p>
                  <figcaption className="mt-3 text-[0.78rem] font-bold tracking-wide text-ink/55 uppercase">
                    {q.name} · {q.place}
                  </figcaption>
                </blockquote>
                <div className="flex shrink-0 gap-1 text-accent sm:flex-col">
                  {[0, 1, 2].map((s) => (
                    <StarIcon key={s} className="h-3.5 w-3.5" />
                  ))}
                </div>
              </figure>
            </Reveal>
          ))}
        </ul>
      </div>
    </section>
  );
}
