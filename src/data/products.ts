export type Pack = {
  id: string;
  label: string;
  count: number;
  pricePaise: number;
  compareAtPaise?: number;
};

export type Product = {
  id: string;
  name: string;
  kicker: string;
  blurb: string;
  image: string;
  badge?: string;
  shellColour: string;
  proteinPerEgg: string;
  packs: Pack[];
};

/** All prices in paise (integer) to keep totals exact. */
export const products: Product[] = [
  {
    id: "kolam-brown",
    name: "Kolam Brown Eggs",
    kicker: "Daily farm pickup",
    blurb: "Grain-fed Kolam hens, thick shells, rich golden yolks.",
    image: "/images/product-brown.jpg",
    badge: "Bestseller",
    shellColour: "Warm brown",
    proteinPerEgg: "6.4 g",
    packs: [
      { id: "6", label: "Pack of 6", count: 6, pricePaise: 7900, compareAtPaise: 9000 },
      { id: "12", label: "Pack of 12", count: 12, pricePaise: 14900, compareAtPaise: 17500 },
      { id: "24", label: "Pack of 24", count: 24, pricePaise: 28900, compareAtPaise: 34000 },
    ],
  },
  {
    id: "white-large",
    name: "Large White Eggs",
    kicker: "Grade A cleaned",
    blurb: "Clean, mild-smelling eggs with firm whites for everyday cooking.",
    image: "/images/product-white.jpg",
    shellColour: "Ivory white",
    proteinPerEgg: "6.1 g",
    packs: [
      { id: "6", label: "Pack of 6", count: 6, pricePaise: 6900, compareAtPaise: 7800 },
      { id: "12", label: "Pack of 12", count: 12, pricePaise: 12900, compareAtPaise: 15200 },
      { id: "24", label: "Pack of 24", count: 24, pricePaise: 24900, compareAtPaise: 29600 },
    ],
  },
  {
    id: "omega-9",
    name: "Omega-3 Enriched Eggs",
    kicker: "Flax & marigold fed",
    blurb: "Deep orange yolks with 3× the omega-3 of standard eggs.",
    image: "/images/product-omega.jpg",
    badge: "Nutrition+",
    shellColour: "Deep brown",
    proteinPerEgg: "7.0 g",
    packs: [
      { id: "6", label: "Pack of 6", count: 6, pricePaise: 9900, compareAtPaise: 11500 },
      { id: "12", label: "Pack of 12", count: 12, pricePaise: 18500, compareAtPaise: 22000 },
    ],
  },
  {
    id: "desi-country",
    name: "Country Desi Eggs",
    kicker: "Free range, small batch",
    blurb: "Small, flavourful farm eggs — perfect for biryani curries and kuzhambu.",
    image: "/images/product-country.jpg",
    badge: "Limited",
    shellColour: "Speckled rust",
    proteinPerEgg: "5.4 g",
    packs: [
      { id: "10", label: "Pack of 10", count: 10, pricePaise: 11900, compareAtPaise: 13500 },
      { id: "20", label: "Pack of 20", count: 20, pricePaise: 21900, compareAtPaise: 26000 },
    ],
  },
];

export const freeDeliveryThresholdPaise = 34900;
export const deliveryFeePaise = 3000;
export const subscriptionDiscountRate = 0.1; // 10% off on weekly plans

export function findVariant(variantId: string) {
  const [productId, packId] = variantId.split("::");
  const product = products.find((p) => p.id === productId);
  if (!product) return null;
  const pack = product.packs.find((p) => p.id === packId);
  if (!pack) return null;
  return { product, pack };
}
