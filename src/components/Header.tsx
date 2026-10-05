"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Logo } from "@/components/Logo";
import { CartIcon, CloseIcon, MenuIcon, PhoneIcon, SparkIcon } from "@/components/Icons";
import { useCart } from "@/components/cart/CartProvider";
import { cn } from "@/lib/cn";

const nav = [
  { label: "Home", href: "/#home" },
  { label: "Our Eggs", href: "/#eggs" },
  { label: "About", href: "/#about" },
  { label: "Contact", href: "/#contact" },
];

const ticker = [
  "Free delivery across Hyderabad over ₹349",
  "Order by 9 PM · delivered before 7 AM",
  "No antibiotics · graded & candled daily",
];

export function Header() {
  const pathname = usePathname();
  const { count, open, ready } = useCart();
  const [scrolled, setScrolled] = useState(false);
  const [progress, setProgress] = useState(0);
  const [menu, setMenu] = useState(false);
  const [tick, setTick] = useState(0);

  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY;
      setScrolled(y > 24);
      const height = document.documentElement.scrollHeight - window.innerHeight;
      setProgress(height > 0 ? Math.min(y / height, 1) : 0);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) return;
    const id = window.setInterval(() => setTick((t) => (t + 1) % ticker.length), 4200);
    return () => window.clearInterval(id);
  }, []);

  useEffect(() => setMenu(false), [pathname]);

  return (
    <header className="sticky top-0 z-50">
      <div className="bg-ink text-cream">
        <div className="shell flex h-9 items-center justify-between gap-4 text-[0.68rem] sm:text-[0.72rem]">
          <a
            href="tel:+914023456789"
            className="hidden items-center gap-2 font-semibold tracking-wide text-cream/80 transition-colors hover:text-accent sm:inline-flex"
          >
            <PhoneIcon className="h-3.5 w-3.5" />
            +91 40 2345 6789
          </a>
          <p className="relative mx-auto h-4 flex-1 overflow-hidden text-center sm:flex-none sm:w-[34rem]">
            {ticker.map((msg, i) => (
              <span
                key={msg}
                className="absolute inset-0 flex items-center justify-center gap-2 whitespace-nowrap font-medium tracking-[0.06em] text-cream/85 transition-all duration-700 ease-[cubic-bezier(.22,1,.36,1)]"
                style={{
                  opacity: i === tick ? 1 : 0,
                  transform: `translateY(${(i - tick) * 100}%)`,
                }}
              >
                <SparkIcon className="h-3.5 w-3.5 text-accent" strokeWidth={1.4} />
                {msg}
              </span>
            ))}
          </p>
          <Link
            href="/track"
            className="hidden font-semibold tracking-wide text-accent transition-opacity hover:opacity-80 sm:block"
          >
            Track order
          </Link>
        </div>
      </div>

      <div
        className={cn(
          "relative transition-all duration-500 ease-[cubic-bezier(.22,1,.36,1)]",
          scrolled
            ? "border-b border-line/80 bg-cream-bright/90 backdrop-blur-xl shadow-[0_10px_30px_-24px_rgba(38,59,57,0.5)]"
            : "border-b border-transparent bg-cream/70 backdrop-blur-md",
        )}
      >
        <div
          className={cn(
            "shell flex items-center justify-between transition-all duration-500",
            scrolled ? "h-16" : "h-20",
          )}
        >
          <Link href="/#home" aria-label="Egglu home" className="group">
            <Logo />
          </Link>

          <nav className="hidden items-center gap-9 lg:flex">
            {nav.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                className="link-underline text-[0.82rem] font-semibold tracking-wide text-ink/75 transition-colors hover:text-ink"
              >
                {item.label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-2 sm:gap-3">
            <Link
              href="/#eggs"
              className="btn btn-primary hidden px-5! py-2.5! text-[0.8rem] sm:inline-flex"
            >
              Shop Now
            </Link>
            <button
              type="button"
              onClick={open}
              aria-label={`Open cart, ${count} item${count === 1 ? "" : "s"}`}
              className="relative grid h-11 w-11 place-items-center rounded-full border border-line bg-cream-bright text-ink transition-all duration-300 hover:-translate-y-0.5 hover:border-accent hover:text-accent-deep"
            >
              <CartIcon className="h-5 w-5" />
              {ready && count > 0 && (
                <span className="animate-[pop_0.35s_cubic-bezier(0.34,1.56,0.64,1)] absolute -top-1 -right-1 grid h-5 min-w-5 place-items-center rounded-full bg-ink px-1 text-[0.65rem] font-bold text-cream">
                  {count}
                </span>
              )}
            </button>
            <button
              type="button"
              onClick={() => setMenu((m) => !m)}
              aria-label={menu ? "Close menu" : "Open menu"}
              aria-expanded={menu}
              className="grid h-11 w-11 place-items-center rounded-full border border-line bg-cream-bright text-ink transition-colors hover:border-accent lg:hidden"
            >
              {menu ? <CloseIcon className="h-5 w-5" /> : <MenuIcon className="h-5 w-5" />}
            </button>
          </div>
        </div>
        <div
          aria-hidden
          className="absolute bottom-0 left-0 h-[2px] bg-accent transition-[width] duration-150 ease-out"
          style={{ width: `${progress * 100}%` }}
        />
      </div>

      {/* Mobile sheet */}
      <div
        className={cn(
          "absolute inset-x-0 top-full origin-top px-4 pt-3 transition-all duration-500 ease-[cubic-bezier(.22,1,.36,1)] lg:hidden",
          menu ? "pointer-events-auto translate-y-0 opacity-100" : "pointer-events-none -translate-y-3 opacity-0",
        )}
      >
        <nav className="card overflow-hidden bg-cream-bright! p-2">
          {nav.map((item) => (
            <Link
              key={item.label}
              href={item.href}
              onClick={() => setMenu(false)}
              className="flex items-center justify-between rounded-2xl px-4 py-3.5 text-[0.95rem] font-semibold text-ink transition-colors hover:bg-sage/60"
            >
              {item.label}
              <span className="text-accent">↗</span>
            </Link>
          ))}
          <Link
            href="/#eggs"
            onClick={() => setMenu(false)}
            className="btn btn-primary mt-1 w-full"
          >
            Shop Eggs
          </Link>
        </nav>
      </div>
    </header>
  );
}
