"use client";

import Link from "next/link";
import { useState, type FormEvent } from "react";
import { Logo } from "@/components/Logo";
import {
  ArrowRightIcon,
  CheckIcon,
  ClockIcon,
  FacebookIcon,
  InstagramIcon,
  MailIcon,
  PhoneIcon,
  PinIcon,
  WhatsappIcon,
  YoutubeIcon,
} from "@/components/Icons";

const quickLinks = [
  { label: "Home", href: "/#home" },
  { label: "Our Eggs", href: "/#eggs" },
  { label: "About", href: "/#about" },
  { label: "Why Egglu", href: "/#why" },
  { label: "How it works", href: "/#how" },
  { label: "Cart & checkout", href: "/cart" },
  { label: "Track order", href: "/track" },
];

const socials = [
  { label: "Instagram", Icon: InstagramIcon, href: "https://instagram.com" },
  { label: "Facebook", Icon: FacebookIcon, href: "https://facebook.com" },
  { label: "WhatsApp", Icon: WhatsappIcon, href: "https://wa.me/914023456789" },
  { label: "YouTube", Icon: YoutubeIcon, href: "https://youtube.com" },
];

export function Footer() {
  const [email, setEmail] = useState("");
  const [state, setState] = useState<"idle" | "sending" | "done" | "error">("idle");
  const [message, setMessage] = useState("");

  async function subscribe(e: FormEvent) {
    e.preventDefault();
    if (!/^\S+@\S+\.\S+$/.test(email)) {
      setState("error");
      setMessage("That email doesn't look right");
      return;
    }
    setState("sending");
    try {
      const res = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = (await res.json()) as { ok?: boolean; error?: string };
      if (!res.ok || !data.ok) throw new Error(data.error ?? "Failed");
      setState("done");
      setMessage("You're on the list — farm notes, twice a month.");
      setEmail("");
    } catch {
      setState("error");
      setMessage("Something went wrong, try again");
    }
  }

  return (
    <footer id="contact" className="scroll-mt-28 bg-ink-deep text-cream">
      <div
        aria-hidden
        className="h-px w-full bg-gradient-to-r from-transparent via-accent/60 to-transparent"
      />
      <div className="shell py-16">
        <div className="grid gap-12 lg:grid-cols-[1.15fr_0.65fr_0.85fr_1.1fr]">
          <div>
            <Logo tone="cream" />
            <p className="mt-5 max-w-xs text-[0.92rem] leading-relaxed text-cream/60">
              Farm-fresh eggs from our own flocks at Home Farms — graded by hand, packed the same
              night, delivered across Hyderabad.
            </p>
            <div className="mt-6 flex gap-2.5">
              {socials.map(({ label, Icon, href }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noreferrer noopener"
                  aria-label={label}
                  className="grid h-10 w-10 place-items-center rounded-full border border-cream/15 text-cream/70 transition-all duration-300 hover:-translate-y-0.5 hover:border-accent hover:bg-accent hover:text-ink-deep"
                >
                  <Icon className="h-4.5 w-4.5" strokeWidth={1.5} />
                </a>
              ))}
            </div>
          </div>

          <nav aria-label="Quick links">
            <h3 className="font-display text-[0.8rem] font-bold tracking-[0.2em] text-cream/45 uppercase">
              Quick links
            </h3>
            <ul className="mt-5 space-y-3">
              {quickLinks.map((l) => (
                <li key={l.label}>
                  <Link
                    href={l.href}
                    className="link-underline text-[0.92rem] font-medium text-cream/75 transition-colors hover:text-accent"
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div>
            <h3 className="font-display text-[0.8rem] font-bold tracking-[0.2em] text-cream/45 uppercase">
              Reach us
            </h3>
            <ul className="mt-5 space-y-4 text-[0.9rem] text-cream/70">
              <li className="flex gap-3">
                <PinIcon className="mt-0.5 h-4.5 w-4.5 shrink-0 text-accent" strokeWidth={1.5} />
                <span>
                  Home Farms, Survey No. 94,
                  <br />
                  Patancheru, Hyderabad 502 307
                </span>
              </li>
              <li className="flex gap-3">
                <PhoneIcon className="mt-0.5 h-4.5 w-4.5 shrink-0 text-accent" strokeWidth={1.5} />
                <a href="tel:+914023456789" className="hover:text-accent">
                  +91 40 2345 6789
                </a>
              </li>
              <li className="flex gap-3">
                <MailIcon className="mt-0.5 h-4.5 w-4.5 shrink-0 text-accent" strokeWidth={1.5} />
                <a href="mailto:hello@egglu.in" className="hover:text-accent">
                  hello@egglu.in
                </a>
              </li>
              <li className="flex gap-3">
                <ClockIcon className="mt-0.5 h-4.5 w-4.5 shrink-0 text-accent" strokeWidth={1.5} />
                <span>Daily · 5–10 AM &amp; 5–8 PM</span>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-display text-[0.8rem] font-bold tracking-[0.2em] text-cream/45 uppercase">
              Farm notes
            </h3>
            <p className="mt-5 text-[0.9rem] leading-relaxed text-cream/60">
              New batches, price drops and the occasional recipe. Twice a month, no spam.
            </p>
            <form onSubmit={subscribe} className="mt-5">
              <div className="flex items-center gap-2 rounded-full border border-cream/15 bg-cream/[0.06] p-1.5 transition-colors focus-within:border-accent">
                <label htmlFor="footer-email" className="sr-only">
                  Email address
                </label>
                <input
                  id="footer-email"
                  type="email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    setState("idle");
                  }}
                  placeholder="you@email.com"
                  className="h-10 min-w-0 flex-1 bg-transparent px-4 text-sm text-cream placeholder:text-cream/35 focus:outline-none"
                />
                <button
                  type="submit"
                  disabled={state === "sending"}
                  aria-label="Subscribe"
                  className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-accent text-ink-deep transition-transform duration-300 hover:scale-105 disabled:opacity-60"
                >
                  {state === "done" ? (
                    <CheckIcon className="h-4 w-4" strokeWidth={2.6} />
                  ) : (
                    <ArrowRightIcon className="h-4 w-4" strokeWidth={2.2} />
                  )}
                </button>
              </div>
              {message && (
                <p
                  className={`mt-2.5 pl-4 text-xs font-semibold ${
                    state === "error" ? "text-accent" : "text-sage-deep"
                  }`}
                >
                  {message}
                </p>
              )}
            </form>
          </div>
        </div>

        <div className="mt-14 flex flex-col items-center justify-between gap-4 border-t border-cream/12 pt-7 text-[0.78rem] text-cream/45 sm:flex-row">
          <p>© {new Date().getFullYear()} Egglu by Home Farms. All rights reserved.</p>
          <p className="flex items-center gap-4">
            <span>FSSAI 11522999000123</span>
            <span className="h-1 w-1 rounded-full bg-cream/25" />
            <a href="/#why" className="transition-colors hover:text-accent">
              Refunds &amp; replacements
            </a>
            <span className="h-1 w-1 rounded-full bg-cream/25" />
            <span>Made in Hyderabad</span>
          </p>
        </div>
      </div>
    </footer>
  );
}
