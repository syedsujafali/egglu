import type { ReactNode } from "react";

type IconProps = { className?: string; strokeWidth?: number };

const base = "h-6 w-6";

function Svg({
  className = base,
  strokeWidth = 1.6,
  children,
}: IconProps & { children: ReactNode }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      {children}
    </svg>
  );
}

export const EggIcon = (p: IconProps) => (
  <Svg {...p}>
    <path d="M12 3c-3.9 0-7 5.1-7 9.4C5 16.6 8 21 12 21s7-4.4 7-8.6C19 8.1 15.9 3 12 3Z" />
    <path d="M9.4 12.6c0-2 1.1-4 2.6-4.6" opacity={0.6} />
  </Svg>
);

export const LeafIcon = (p: IconProps) => (
  <Svg {...p}>
    <path d="M4 20c0-7.2 4.8-13 14-14 .6 6.6-3 14.4-11 14.4-1 0-2-.1-3-.4Z" />
    <path d="M7.5 18.5C10 15 13 12.6 16.5 11" />
  </Svg>
);

export const ShieldCheckIcon = (p: IconProps) => (
  <Svg {...p}>
    <path d="M12 3l7 2.6v5.6c0 4.3-2.8 7.6-7 9.2-4.2-1.6-7-4.9-7-9.2V5.6L12 3Z" />
    <path d="M8.9 12l2.1 2.2 4.1-4.3" />
  </Svg>
);

export const BoxIcon = (p: IconProps) => (
  <Svg {...p}>
    <path d="M4 8.4L12 4l8 4.4v7.2L12 20l-8-4.4V8.4Z" />
    <path d="M4 8.4L12 12.8l8-4.4M12 12.8V20" />
  </Svg>
);

export const ScooterIcon = (p: IconProps) => (
  <Svg {...p}>
    <path d="M3 16.5h3.2l3.4-8.2h2.9" />
    <path d="M14 6.5h3l2.6 6.3c.6 1.3.9 2.4.9 3.7" />
    <circle cx="7" cy="17.4" r="2.1" />
    <circle cx="18.4" cy="17.4" r="2.1" />
    <path d="M10.2 17.4h6.1" />
  </Svg>
);

export const CartIcon = (p: IconProps) => (
  <Svg {...p}>
    <path d="M3 4h2.2l2.3 10.4h9.6L19 7.2H6.2" />
    <circle cx="9.4" cy="19" r="1.5" />
    <circle cx="16.6" cy="19" r="1.5" />
  </Svg>
);

export const PlusIcon = (p: IconProps) => (
  <Svg {...p}>
    <path d="M12 5.5v13M5.5 12h13" />
  </Svg>
);

export const MinusIcon = (p: IconProps) => (
  <Svg {...p}>
    <path d="M5.5 12h13" />
  </Svg>
);

export const TrashIcon = (p: IconProps) => (
  <Svg {...p}>
    <path d="M4.5 7h15M9 7V5.4c0-.6.5-1.1 1.1-1.1h3.8c.6 0 1.1.5 1.1 1.1V7" />
    <path d="M6.4 7l.8 12.1c0 .6.5 1.1 1.1 1.1h7.4c.6 0 1.1-.5 1.1-1.1L17.6 7" />
    <path d="M10.4 10.8v6M13.6 10.8v6" />
  </Svg>
);

export const ArrowRightIcon = (p: IconProps) => (
  <Svg {...p}>
    <path d="M4.5 12h14M13 6.6l5.5 5.4-5.5 5.4" />
  </Svg>
);

export const CheckIcon = (p: IconProps) => (
  <Svg {...p}>
    <path d="M5 12.8l4.4 4.4L19 7.4" />
  </Svg>
);

export const PinIcon = (p: IconProps) => (
  <Svg {...p}>
    <path d="M12 21c4.2-4.6 6.3-7.9 6.3-10.6A6.3 6.3 0 005.7 10.4C5.7 13.1 7.8 16.4 12 21Z" />
    <circle cx="12" cy="10.2" r="2.3" />
  </Svg>
);

export const PhoneIcon = (p: IconProps) => (
  <Svg {...p}>
    <path d="M6.6 3.8h2.7l1.5 3.9-2 1.4a11.8 11.8 0 005.2 5.2l1.4-2 3.9 1.5v2.7c0 1-.8 1.8-1.8 1.7C10.2 19.7 4.3 13.8 3.8 5.6c0-1 .8-1.8 1.8-1.8Z" />
  </Svg>
);

export const MailIcon = (p: IconProps) => (
  <Svg {...p}>
    <rect x="3.2" y="5.4" width="17.6" height="13.2" rx="2.4" />
    <path d="M4.2 7.4L12 12.8l7.8-5.4" />
  </Svg>
);

export const ClockIcon = (p: IconProps) => (
  <Svg {...p}>
    <circle cx="12" cy="12" r="8.4" />
    <path d="M12 7.4V12l3 1.9" />
  </Svg>
);

export const StarIcon = ({ className = base }: IconProps) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
    <path d="M12 3.6l2.5 5.4 5.9.7-4.4 4 1.2 5.8L12 16.6 6.8 19.5 8 13.7l-4.4-4 5.9-.7L12 3.6Z" />
  </svg>
);

export const SparkIcon = (p: IconProps) => (
  <Svg {...p}>
    <path d="M12 4l1.7 4.3L18 10l-4.3 1.7L12 16l-1.7-4.3L6 10l4.3-1.7L12 4Z" />
    <path d="M18.4 16.2l.8 1.9 1.9.8-1.9.8-.8 1.9-.8-1.9-1.9-.8 1.9-.8.8-1.9Z" opacity={0.7} />
  </Svg>
);

export const InstagramIcon = (p: IconProps) => (
  <Svg {...p}>
    <rect x="4" y="4" width="16" height="16" rx="4.6" />
    <circle cx="12" cy="12" r="3.6" />
    <circle cx="16.6" cy="7.5" r="0.9" fill="currentColor" />
  </Svg>
);

export const FacebookIcon = (p: IconProps) => (
  <Svg {...p}>
    <path d="M14.8 4.6h-2c-2 0-3.2 1.3-3.2 3.3v2.3H7.4v3.1h2.2v6.2h3.2v-6.2h2.3l.5-3.1h-2.8V8.3c0-.7.3-1 1-1h1.6V4.6Z" />
  </Svg>
);

export const WhatsappIcon = (p: IconProps) => (
  <Svg {...p}>
    <path d="M4.4 19.6l1.1-4A7.6 7.6 0 1112 19.6a7.7 7.7 0 01-3.7-.9l-3.9.9Z" />
    <path d="M9.4 9c0 2.4 3.2 5.6 5.6 5.6.6 0 1.2-.7 1.2-1.2l-1.7-.9-1 .8c-1-.4-2.1-1.5-2.5-2.5l.8-1-.9-1.7c-.6 0-1.5.5-1.5 1.2Z" />
  </Svg>
);

export const YoutubeIcon = (p: IconProps) => (
  <Svg {...p}>
    <rect x="3" y="6" width="18" height="12" rx="3.6" />
    <path d="M10.6 9.6l4.2 2.4-4.2 2.4V9.6Z" />
  </Svg>
);

export const MenuIcon = (p: IconProps) => (
  <Svg {...p}>
    <path d="M4 7.5h16M4 12h16M4 16.5h11" />
  </Svg>
);

export const CloseIcon = (p: IconProps) => (
  <Svg {...p}>
    <path d="M6.4 6.4l11.2 11.2M17.6 6.4L6.4 17.6" />
  </Svg>
);
