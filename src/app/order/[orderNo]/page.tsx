import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { and, eq, sql } from "drizzle-orm";
import { db } from "@/db";
import { orderItems, orders } from "@/db/schema";
import { products } from "@/data/products";
import { inr } from "@/lib/money";
import {
  ArrowRightIcon,
  BoxIcon,
  CheckIcon,
  ClockIcon,
  PhoneIcon,
  PinIcon,
  ScooterIcon,
  ShieldCheckIcon,
} from "@/components/Icons";
import { Reveal } from "@/components/Reveal";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ orderNo: string }>;
}): Promise<Metadata> {
  const { orderNo } = await params;
  return { title: `Order ${orderNo} confirmed · Egglu by Home Farms` };
}

const methodLabels: Record<string, string> = {
  upi: "UPI",
  card: "Card",
  netbanking: "Net banking",
  cod: "Cash on delivery",
};

export default async function OrderPage({
  params,
}: {
  params: Promise<{ orderNo: string }>;
}) {
  const { orderNo } = await params;
  const [order] = await db.select().from(orders).where(eq(orders.orderNo, orderNo)).limit(1);
  if (!order) notFound();

  const items = await db
    .select()
    .from(orderItems)
    .where(and(eq(orderItems.orderId, order.id)))
    .orderBy(sql`${orderItems.id} asc`);

  const imageFor = (productId: string) =>
    products.find((p) => p.id === productId)?.image ?? "/images/product-brown.jpg";

  const createdAtDate = new Date(order.createdAt);
  const eta = new Date(createdAtDate.getTime() + 12 * 60 * 60 * 1000);

  const etaLabel = eta.toLocaleString("en-IN", {
    weekday: "short",
    hour: "numeric",
    minute: "2-digit",
  });

  const timeline = [
    { label: "Order confirmed", detail: order.createdAt.toLocaleTimeString("en-IN", { hour: "numeric", minute: "2-digit" }), done: true, Icon: CheckIcon },
    { label: "Farm-packed", detail: "Tonight · graded & candled", done: true, Icon: BoxIcon },
    { label: "Out for delivery", detail: `Tomorrow, ${order.deliverySlot}`, done: false, Icon: ScooterIcon },
    { label: "At your door", detail: `By ${etaLabel}`, done: false, Icon: PinIcon },
  ];

  return (
    <div className="relative overflow-hidden py-12 sm:py-16">
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-b from-sage/45 via-cream to-cream" />
        <div className="animate-float absolute -top-20 right-[-8rem] h-[22rem] w-[22rem] rounded-full bg-accent-soft/40 blur-2xl" />
      </div>

      <div className="shell max-w-4xl">
        <Reveal>
          <div className="rounded-[2rem] border border-line bg-cream-bright p-7 shadow-lift sm:p-10">
            <div className="flex flex-wrap items-start justify-between gap-6">
              <div>
                <span className="inline-flex items-center gap-2 rounded-full bg-sage/70 px-3.5 py-1.5 text-[0.68rem] font-bold tracking-[0.14em] text-ink uppercase">
                  <CheckIcon className="h-3.5 w-3.5" strokeWidth={3} />
                  Order confirmed
                </span>
                <h1 className="mt-5 text-[2rem] leading-[1.08] font-semibold sm:text-[2.6rem]">
                  Thanks, {order.customerName.split(" ")[0]}.
                  <br />
                  <span className="italic font-normal text-ink/55">Your eggs are on the farm list.</span>
                </h1>
                <p className="mt-4 max-w-md text-[0.95rem] leading-relaxed text-ink/60">
                  We&rsquo;ve reserved this batch. Our rider will reach {order.locality} before{" "}
                  {order.deliverySlot.includes("morning") ? "8:00 AM" : "7:30 PM"} tomorrow.
                </p>
              </div>
              <div className="rounded-[1.4rem] border border-line bg-cream px-5 py-4">
                <p className="text-[0.66rem] font-bold tracking-[0.16em] text-ink/45 uppercase">
                  Order no.
                </p>
                <p className="font-display mt-1 text-xl font-semibold">{order.orderNo}</p>
                <p className="mt-2 text-xs text-ink/55">
                  {new Date(order.createdAt).toLocaleDateString("en-IN", {
                    day: "2-digit",
                    month: "short",
                    year: "numeric",
                  })}
                </p>
              </div>
            </div>

            {/* Timeline */}
            <ol className="mt-9 grid gap-4 rounded-[1.4rem] bg-cream p-5 sm:grid-cols-4">
              {timeline.map(({ label, detail, done, Icon }, i) => (
                <li key={label} className="relative flex items-start gap-3 sm:block">
                  <div className="flex items-center gap-3">
                    <span
                      className={
                        done
                          ? "grid h-9 w-9 shrink-0 place-items-center rounded-full bg-ink text-cream"
                          : "grid h-9 w-9 shrink-0 place-items-center rounded-full border border-dashed border-ink/25 text-ink/40"
                      }
                    >
                      <Icon className="h-4.5 w-4.5" strokeWidth={1.8} />
                    </span>
                    <span className="hidden h-px flex-1 bg-ink/10 sm:block" aria-hidden />
                  </div>
                  <p className="mt-0 text-[0.85rem] font-bold sm:mt-4">{label}</p>
                  <p className="text-[0.75rem] text-ink/55">{detail}</p>
                  {i === 1 && <span className="sr-only">in progress</span>}
                </li>
              ))}
            </ol>
          </div>
        </Reveal>

        <div className="mt-6 grid gap-6 md:grid-cols-[1.25fr_1fr]">
          <Reveal delay={90}>
            <div className="rounded-[1.75rem] border border-line bg-cream-bright p-6 shadow-soft">
              <h2 className="font-display text-lg font-semibold">What we&rsquo;re packing</h2>
              <ul className="mt-4 divide-y divide-line">
                {items.map((item) => (
                  <li key={item.id} className="flex items-center gap-4 py-3.5">
                    <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-2xl bg-sage/40">
                      <Image
                        src={imageFor(item.productId)}
                        alt={item.name}
                        fill
                        sizes="56px"
                        className="object-cover"
                      />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-[0.92rem] font-bold">{item.name}</p>
                      <p className="text-xs text-ink/55">
                        {item.packSize} · qty {item.quantity}
                      </p>
                    </div>
                    <p className="text-[0.92rem] font-bold">{inr(item.lineTotalPaise)}</p>
                  </li>
                ))}
              </ul>
              <dl className="mt-4 space-y-2 border-t border-line pt-4 text-[0.88rem]">
                <div className="flex justify-between">
                  <dt className="text-ink/60">Subtotal</dt>
                  <dd className="font-bold">{inr(order.subtotalPaise)}</dd>
                </div>
                {order.discountPaise > 0 && (
                  <div className="flex justify-between text-sage-deep">
                    <dt>Weekly plan discount</dt>
                    <dd className="font-bold">− {inr(order.discountPaise)}</dd>
                  </div>
                )}
                <div className="flex justify-between">
                  <dt className="text-ink/60">Delivery</dt>
                  <dd className="font-bold">
                    {order.deliveryFeePaise === 0 ? "Free" : inr(order.deliveryFeePaise)}
                  </dd>
                </div>
                <div className="flex items-end justify-between border-t border-line pt-3">
                  <dt className="text-[0.7rem] font-bold tracking-[0.16em] text-ink/50 uppercase">
                    Paid
                  </dt>
                  <dd className="font-display text-2xl font-semibold">{inr(order.totalPaise)}</dd>
                </div>
              </dl>
            </div>
          </Reveal>

          <Reveal delay={160}>
            <div className="flex h-full flex-col gap-4">
              <div className="rounded-[1.75rem] border border-line bg-cream-bright p-6 shadow-soft">
                <h2 className="flex items-center gap-2 font-display text-lg font-semibold">
                  <PinIcon className="h-5 w-5 text-accent" strokeWidth={1.7} />
                  Delivering to
                </h2>
                <p className="mt-3 text-[0.9rem] leading-relaxed text-ink/70">
                  {order.customerName}
                  <br />
                  {order.address}
                  <br />
                  {order.locality}, Hyderabad {order.pincode}
                </p>
                <p className="mt-3 flex items-center gap-2 text-[0.85rem] font-semibold text-ink/60">
                  <PhoneIcon className="h-4 w-4 text-sage-deep" strokeWidth={1.7} />
                  +91 {order.phone}
                </p>
                {order.note && (
                  <p className="mt-3 rounded-2xl bg-cream px-4 py-3 text-[0.82rem] leading-relaxed text-ink/60">
                    “{order.note}”
                  </p>
                )}
              </div>

              <div className="rounded-[1.75rem] border border-line bg-ink p-6 text-cream">
                <h2 className="flex items-center gap-2 font-display text-lg font-semibold">
                  <ShieldCheckIcon className="h-5 w-5 text-accent" strokeWidth={1.7} />
                  Payment
                </h2>
                <p className="mt-3 text-[0.88rem] leading-relaxed text-cream/70">
                  {methodLabels[order.paymentMethod] ?? order.paymentMethod} ·{" "}
                  <span className="font-bold text-cream">
                    {order.paymentStatus === "cash_on_delivery"
                      ? "pay the rider on delivery"
                      : "paid successfully"}
                  </span>
                </p>
                {order.paymentRef && (
                  <p className="mt-2 text-[0.75rem] text-cream/45">Ref {order.paymentRef}</p>
                )}
                <p className="mt-4 flex items-center gap-2 text-[0.8rem] font-semibold text-accent">
                  <ClockIcon className="h-4 w-4" strokeWidth={1.8} />
                  {order.plan === "weekly"
                    ? "Weekly plan · we'll remind you before the next drop"
                    : "One-time order"}
                </p>
              </div>

              <div className="mt-auto flex flex-wrap gap-3">
                <Link href="/#eggs" className="btn btn-primary flex-1 text-[0.82rem]">
                  Order again
                  <ArrowRightIcon className="h-4 w-4" strokeWidth={2} />
                </Link>
                <a href="tel:+914023456789" className="btn btn-ghost flex-1 text-[0.82rem]">
                  Call the farm
                </a>
              </div>
            </div>
          </Reveal>
        </div>

        <Reveal delay={220}>
          <p className="mt-8 text-center text-[0.8rem] text-ink/50">
            A copy of this receipt has been kept against your mobile number. Change your slot
            before 9 PM by calling us.
          </p>
        </Reveal>
      </div>
    </div>
  );
}
