import type { Metadata } from "next";
import { About } from "@/components/About";
import { FinalCta } from "@/components/FinalCta";
import { Hero } from "@/components/Hero";
import { HowItWorks } from "@/components/HowItWorks";
import { Products } from "@/components/Products";
import { Voices } from "@/components/Voices";
import { WhyEgglu } from "@/components/WhyEgglu";
import { products } from "@/data/products";

export const metadata: Metadata = {
  title: "Egglu by Home Farms — Farm Fresh Eggs, Delivered in Hyderabad",
  description:
    "Fresh, quality-checked eggs from Home Farms, hygienically packed and delivered to your Hyderabad doorstep by 7 AM. UPI, card or cash on delivery.",
  alternates: { canonical: "/" },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Store",
      name: "Egglu by Home Farms",
      description: "Farm-fresh eggs delivered across Hyderabad.",
      telephone: "+91-40-2345-6789",
      email: "hello@egglu.in",
      priceRange: "₹₹",
      image: "/images/hero-eggs.jpg",
      address: {
        "@type": "PostalAddress",
        addressLocality: "Hyderabad",
        addressRegion: "Telangana",
        postalCode: "502307",
        addressCountry: "IN",
      },
      aggregateRating: { "@type": "AggregateRating", ratingValue: "4.9", reviewCount: "1284" },
    },
    ...products.map((product) => ({
      "@type": "Product",
      name: product.name,
      description: product.blurb,
      image: product.image,
      brand: { "@type": "Brand", name: "Egglu by Home Farms" },
      offers: {
        "@type": "Offer",
        priceCurrency: "INR",
        price: product.packs[0].pricePaise / 100,
        availability: "https://schema.org/InStock",
        areaServed: "Hyderabad",
      },
    })),
  ],
};

export default function HomePage() {
  return (
    <>
      <script
        type="application/ld+json"
        // eslint-disable-next-line react/no-danger
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Hero />
      <Products />
      <WhyEgglu />
      <About />
      <HowItWorks />
      <Voices />
      <FinalCta />
    </>
  );
}
