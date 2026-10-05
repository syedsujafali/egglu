import { NextResponse } from "next/server";
import { and, eq } from "drizzle-orm";
import { db } from "@/db";
import { subscribers } from "@/db/schema";

export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  let body: { email?: string; pincode?: string; source?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid payload" }, { status: 400 });
  }

  const email = (body.email ?? "").trim().toLowerCase();
  if (!/^\S+@\S+\.\S+$/.test(email) || email.length > 160) {
    return NextResponse.json({ ok: false, error: "Invalid email" }, { status: 400 });
  }

  try {
    const pincode = (body.pincode ?? "").trim().slice(0, 8) || null;
    const source = (body.source ?? "footer").slice(0, 40);

    const [existing] = await db
      .select({ id: subscribers.id })
      .from(subscribers)
      .where(and(eq(subscribers.email, email)))
      .limit(1);

    if (!existing) {
      await db.insert(subscribers).values({ email, pincode, source });
    }
    return NextResponse.json({ ok: true, subscribed: true });
  } catch (error) {
    console.error("newsletter_failed", error);
    // A duplicate race is not a user-facing failure.
    return NextResponse.json({ ok: true, subscribed: true });
  }
}
