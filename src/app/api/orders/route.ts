import { NextResponse } from "next/server";
import { eq, sql } from "drizzle-orm";
import { db } from "@/db";
import { orderItems, orders } from "@/db/schema";
import { findVariant, freeDeliveryThresholdPaise, deliveryFeePaise, subscriptionDiscountRate } from "@/data/products";
import { isServiceable } from "@/data/delivery";

export const dynamic = "force-dynamic";

const SLOTS = ["6–8 AM (morning)", "5–7 PM (evening)"];
const METHODS = ["upi", "card", "netbanking", "cod"];
const PLANS = ["one-time", "weekly"];

type Payload = {
  customerName?: string;
  phone?: string;
  address?: string;
  locality?: string;
  pincode?: string;
  deliverySlot?: string;
  plan?: string;
  paymentMethod?: string;
  note?: string;
  items?: { variantId?: string; qty?: number }[];
};

function makeOrderNo() {
  const stamp = Date.now().toString(36).toUpperCase().slice(-6);
  const rand = Math.floor(Math.random() * 46656)
    .toString(36)
    .toUpperCase()
    .padStart(3, "0");
  return `EGG-${stamp}${rand}`;
}

export async function POST(req: Request) {
  let body: Payload;
  try {
    body = (await req.json()) as Payload;
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid request body" }, { status: 400 });
  }

  const name = (body.customerName ?? "").trim();
  const phone = (body.phone ?? "").replace(/\D/g, "");
  const address = (body.address ?? "").trim();
  const locality = (body.locality ?? "").trim();
  const pincode = (body.pincode ?? "").trim();
  const slot = body.deliverySlot ?? "";
  const plan = body.plan ?? "one-time";
  const method = body.paymentMethod ?? "";
  const note = (body.note ?? "").trim().slice(0, 220);

  const errors: string[] = [];
  if (name.length < 2 || name.length > 70) errors.push("Enter your full name");
  if (!/^[6-9]\d{9}$/.test(phone)) errors.push("Enter a valid 10-digit mobile number");
  if (address.length < 10) errors.push("Delivery address looks too short");
  if (!locality) errors.push("Select your area");
  if (!/^\d{6}$/.test(pincode)) errors.push("Enter a 6-digit pincode");
  else if (!isServiceable(pincode)) errors.push("We don't deliver to this pincode yet");
  if (!SLOTS.includes(slot)) errors.push("Pick a delivery slot");
  if (!PLANS.includes(plan)) errors.push("Unknown delivery plan");
  if (!METHODS.includes(method)) errors.push("Choose a payment method");

  const rawItems = Array.isArray(body.items) ? body.items : [];
  const lines: {
    variantId: string;
    productId: string;
    name: string;
    packSize: string;
    unitPricePaise: number;
    quantity: number;
    lineTotalPaise: number;
  }[] = [];

  for (const item of rawItems.slice(0, 20)) {
    const found = typeof item.variantId === "string" ? findVariant(item.variantId) : null;
    if (!found) {
      errors.push("One of the items is no longer available");
      break;
    }
    const qty = Math.floor(Number(item.qty ?? 1));
    if (!Number.isFinite(qty) || qty < 1 || qty > 30) {
      errors.push("Quantities must be between 1 and 30");
      break;
    }
    lines.push({
      variantId: `${found.product.id}::${found.pack.id}`,
      productId: found.product.id,
      name: found.product.name,
      packSize: found.pack.label,
      unitPricePaise: found.pack.pricePaise,
      quantity: qty,
      lineTotalPaise: found.pack.pricePaise * qty,
    });
  }

  if (lines.length === 0 && !errors.some((e) => e.includes("items"))) {
    errors.push("Your basket is empty");
  }
  if (errors.length) {
    return NextResponse.json({ ok: false, errors: [...new Set(errors)] }, { status: 400 });
  }

  const subtotalPaise = lines.reduce((sum, l) => sum + l.lineTotalPaise, 0);
  const discountPaise = plan === "weekly" ? Math.round(subtotalPaise * subscriptionDiscountRate) : 0;
  const afterDiscount = subtotalPaise - discountPaise;
  const shippingPaise = afterDiscount >= freeDeliveryThresholdPaise ? 0 : deliveryFeePaise;
  const totalPaise = afterDiscount + shippingPaise;

  const orderNo = makeOrderNo();
  const isCod = method === "cod";

  try {
    const created = await db.transaction(async (tx) => {
      const [order] = await tx
        .insert(orders)
        .values({
          orderNo,
          customerName: name,
          phone,
          address,
          locality,
          pincode,
          deliverySlot: slot,
          plan,
          paymentMethod: method,
          paymentStatus: isCod ? "cash_on_delivery" : "paid",
          paymentRef: isCod ? null : `pay_${orderNo.replace(/[^A-Z0-9]/gi, "").toLowerCase()}`,
          orderStatus: "confirmed",
          itemCount: lines.reduce((n, l) => n + l.quantity, 0),
          subtotalPaise,
          deliveryFeePaise: shippingPaise,
          discountPaise,
          totalPaise,
          note: note || null,
        })
        .returning();

      await tx.insert(orderItems).values(
        lines.map((l) => ({
          orderId: order.id,
          productId: l.productId,
          variantId: l.variantId,
          name: l.name,
          packSize: l.packSize,
          unitPricePaise: l.unitPricePaise,
          quantity: l.quantity,
          lineTotalPaise: l.lineTotalPaise,
        })),
      );

      return order;
    });

    return NextResponse.json({
      ok: true,
      orderNo: created.orderNo,
      totalPaise: created.totalPaise,
      paymentStatus: created.paymentStatus,
      statusUrl: `/order/${created.orderNo}`,
    });
  } catch (error) {
    console.error("order_create_failed", error);
    return NextResponse.json(
      { ok: false, error: "We couldn't place your order. Please try again." },
      { status: 500 },
    );
  }
}

export async function GET(req: Request) {
  // Simple order lookup for support/debug: /api/orders?orderNo=EGG-XXXX
  const url = new URL(req.url);
  const orderNo = url.searchParams.get("orderNo");
  if (!orderNo) {
    const recent = await db
      .select({
        orderNo: orders.orderNo,
        customerName: orders.customerName,
        totalPaise: orders.totalPaise,
        createdAt: orders.createdAt,
      })
      .from(orders)
      .orderBy(sql`${orders.createdAt} desc`)
      .limit(5);
    return NextResponse.json({ ok: true, recent });
  }
  const [order] = await db.select().from(orders).where(eq(orders.orderNo, orderNo)).limit(1);
  if (!order) return NextResponse.json({ ok: false, error: "Not found" }, { status: 404 });
  const items = await db.select().from(orderItems).where(eq(orderItems.orderId, order.id));
  return NextResponse.json({ ok: true, order, items });
}
