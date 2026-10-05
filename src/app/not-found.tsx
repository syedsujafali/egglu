import Link from "next/link";
import { EggIcon } from "@/components/Icons";

export default function NotFound() {
  return (
    <div className="shell flex min-h-[60vh] flex-col items-center justify-center py-20 text-center">
      <span className="grid h-16 w-16 place-items-center rounded-full bg-sage/60 text-ink">
        <EggIcon className="h-8 w-8" strokeWidth={1.4} />
      </span>
      <h1 className="mt-6 font-display text-4xl font-semibold">This one rolled away</h1>
      <p className="mt-3 max-w-sm text-[0.95rem] leading-relaxed text-ink/60">
        The page or order you were looking for isn&rsquo;t here. Let&rsquo;s get you back to
        fresh eggs.
      </p>
      <Link href="/#eggs" className="btn btn-primary mt-7">
        Shop eggs
      </Link>
    </div>
  );
}
