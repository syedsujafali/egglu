import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";
import "./globals.css";
import { CartProvider } from "@/components/cart/CartProvider";
import { CartDrawer } from "@/components/cart/CartDrawer";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { WhatsAppButton } from "@/components/WhatsAppButton";

export const metadata: Metadata = {
  metadataBase: new URL("https://egglu.in"),
  title: "Egglu by Home Farms — Farm Fresh Eggs, Delivered in Hyderabad",
  description:
    "Fresh, quality-checked eggs from Home Farms, hygienically packed and delivered to your doorstep across Hyderabad. Order by 9 PM for next-morning delivery.",
  applicationName: "Egglu by Home Farms",
  keywords: [
    "farm fresh eggs Hyderabad",
    "egg delivery",
    "brown eggs",
    "omega 3 eggs",
    "desi eggs Hyderabad",
    "Egglu",
    "Home Farms",
  ],
  openGraph: {
    title: "Egglu by Home Farms — Farm Fresh Eggs, Delivered to You",
    description:
      "Fresh, quality eggs from Home Farms, delivered straight to your doorstep in Hyderabad.",
    images: [{ url: "/images/hero-eggs.jpg" }],
    locale: "en_IN",
    type: "website",
  },
};

export const viewport: Viewport = {
  themeColor: "#F5F4EA",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,300..700;1,9..144,400&family=Manrope:wght@400;500;600;700;800&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="bg-cream text-ink antialiased">
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[100] focus:rounded-full focus:bg-ink focus:px-5 focus:py-2 focus:text-cream"
        >
          Skip to content
        </a>
        <CartProvider>
          <Header />
          <main id="main">{children}</main>
          <Footer />
          <CartDrawer />
          <WhatsAppButton />
        </CartProvider>
      </body>
    </html>
  );
}
