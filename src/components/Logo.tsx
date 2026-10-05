import Image from "next/image";
import { cn } from "@/lib/cn";

/**
 * Official Egglu by Home Farms brand logo
 */
export function Logo({
  tone = "ink",
  compact = false,
  className,
}: {
  tone?: "ink" | "cream";
  compact?: boolean;
  className?: string;
}) {
  const isCream = tone === "cream";

  return (
    <span className={cn("inline-flex items-center select-none", className)}>
      <Image
        src={isCream ? "/images/logo-light.png" : "/images/logo.png"}
        alt="Egglu by Home Farms"
        width={compact ? 110 : 140}
        height={compact ? 54 : 68}
        priority
        className={cn(
          "h-auto w-auto object-contain transition-transform duration-300 group-hover:scale-103",
          compact ? "max-h-9 max-w-[110px]" : "max-h-12 max-w-[140px] sm:max-h-14 sm:max-w-[155px]"
        )}
      />
    </span>
  );
}
