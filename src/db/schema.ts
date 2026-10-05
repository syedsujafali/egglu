import {
  integer,
  pgTable,
  serial,
  text,
  timestamp,
  varchar,
} from "drizzle-orm/pg-core";

export const orders = pgTable("orders", {
  id: serial("id").primaryKey(),
  orderNo: varchar("order_no", { length: 24 }).notNull().unique(),
  customerName: varchar("customer_name", { length: 120 }).notNull(),
  phone: varchar("phone", { length: 16 }).notNull(),
  address: text("address").notNull(),
  locality: varchar("locality", { length: 120 }).notNull(),
  city: varchar("city", { length: 60 }).notNull().default("Hyderabad"),
  pincode: varchar("pincode", { length: 8 }).notNull(),
  deliverySlot: varchar("delivery_slot", { length: 40 }).notNull(),
  plan: varchar("plan", { length: 24 }).notNull().default("one-time"),
  paymentMethod: varchar("payment_method", { length: 24 }).notNull(),
  paymentStatus: varchar("payment_status", { length: 24 }).notNull().default("paid"),
  paymentRef: varchar("payment_ref", { length: 40 }),
  orderStatus: varchar("order_status", { length: 24 }).notNull().default("confirmed"),
  itemCount: integer("item_count").notNull(),
  subtotalPaise: integer("subtotal_paise").notNull(),
  deliveryFeePaise: integer("delivery_fee_paise").notNull().default(0),
  discountPaise: integer("discount_paise").notNull().default(0),
  totalPaise: integer("total_paise").notNull(),
  note: text("note"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export const orderItems = pgTable("order_items", {
  id: serial("id").primaryKey(),
  orderId: integer("order_id")
    .notNull()
    .references(() => orders.id, { onDelete: "cascade" }),
  productId: varchar("product_id", { length: 48 }).notNull(),
  variantId: varchar("variant_id", { length: 64 }).notNull(),
  name: varchar("name", { length: 120 }).notNull(),
  packSize: varchar("pack_size", { length: 40 }).notNull(),
  unitPricePaise: integer("unit_price_paise").notNull(),
  quantity: integer("quantity").notNull(),
  lineTotalPaise: integer("line_total_paise").notNull(),
});

export const subscribers = pgTable("subscribers", {
  id: serial("id").primaryKey(),
  email: varchar("email", { length: 160 }).notNull().unique(),
  pincode: varchar("pincode", { length: 8 }),
  source: varchar("source", { length: 40 }).notNull().default("footer"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export type Order = typeof orders.$inferSelect;
export type NewOrder = typeof orders.$inferInsert;
export type OrderItemRow = typeof orderItems.$inferSelect;
