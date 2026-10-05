"use client";

import { useState } from "react";
import { WhatsappIcon } from "@/components/Icons";

export function WhatsAppButton() {
  const [tooltip, setTooltip] = useState(false);

  return (
    <div className="fixed right-5 bottom-6 z-40 hidden sm:block">
      <div className="relative flex items-center">
        {tooltip && (
          <div className="animate-[pop_0.3s_ease] absolute right-16 whitespace-nowrap rounded-2xl border border-line bg-cream-bright px-3.5 py-2 text-xs font-bold text-ink shadow-soft backdrop-blur">
            💬 Chat with farm team on WhatsApp
          </div>
        )}
        <a
          href="https://wa.me/914023456789?text=Hi%20Egglu!%20I%20would%20like%20to%20order%20farm-fresh%20eggs."
          target="_blank"
          rel="noopener noreferrer"
          onMouseEnter={() => setTooltip(true)}
          onMouseLeave={() => setTooltip(false)}
          aria-label="Chat on WhatsApp"
          className="group relative flex h-13 w-13 items-center justify-center rounded-full bg-[#25D366] text-white shadow-[0_12px_28px_-8px_rgba(37,211,102,0.65)] transition-all duration-300 hover:scale-108 hover:shadow-[0_16px_34px_-6px_rgba(37,211,102,0.85)]"
        >
          <span className="absolute -top-1 -right-1 flex h-3.5 w-3.5">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#25D366] opacity-75 motion-reduce:hidden" />
            <span className="relative inline-flex h-3.5 w-3.5 rounded-full border-2 border-cream bg-[#128C7E]" />
          </span>
          <WhatsappIcon className="h-7 w-7 text-white transition-transform group-hover:scale-110" />
        </a>
      </div>
    </div>
  );
}
