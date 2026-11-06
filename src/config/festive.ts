/** Festive mode configuration.
 *  Set `enabled` to false after the festive season to remove all Diwali elements. */

export const festiveConfig = {
  /** Master switch – turns off all festive UI elements */
  enabled: true,

  /** Which festive theme to show */
  theme: "diwali-festive" as const,

  /** Announcement bar */
  announcement: {
    active: true,
    text: "🪔 DIWALI MEGA SALE — Flat 20% off on all hampers! Use code DIWALI20 🪔",
    link: "/shop?collection=diwali-hampers",
    /** Sale countdown end date (ISO string) */
    countdownEnd: "2026-11-12T23:59:59+05:30",
  },

  /** Sparkle/ember particle animation on hero and key sections */
  particles: {
    enabled: true,
    /** Reduced count for mobile performance */
    desktopCount: 40,
    mobileCount: 15,
  },

  /** Diwali-specific product badge text */
  badge: "Diwali Special",

  /** Enable warm glow overlay on hero images */
  warmGlowOverlay: true,

  /** Enable rangoli border patterns */
  rangoliPatterns: true,

  /** Surprise gift inside candle highlight */
  surpriseGiftHighlight: true,
} as const;

export type FestiveConfig = typeof festiveConfig;
