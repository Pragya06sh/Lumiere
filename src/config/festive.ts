/** Festive mode configuration.
 *  Master switch set to false for evergreen mode. */

export const festiveConfig = {
  /** Master switch – turns off all festive UI elements */
  enabled: false,

  /** Which festive theme to show */
  theme: "diwali-festive" as const,

  /** Announcement bar */
  announcement: {
    active: false,
    text: "DIWALI CELEBRATION — Flat 20% off with code DIWALI20",
    link: "/shop",
    /** Sale countdown end date (ISO string) */
    countdownEnd: "2026-11-12T23:59:59+05:30",
  },

  /** Sparkle/ember particle animation on hero and key sections */
  particles: {
    enabled: false,
    desktopCount: 0,
    mobileCount: 0,
  },

  /** Product badge text */
  badge: "Signature Collection",

  /** Enable warm glow overlay on hero images */
  warmGlowOverlay: false,

  /** Enable rangoli border patterns */
  rangoliPatterns: false,

  /** Surprise gift inside candle highlight */
  surpriseGiftHighlight: true,
} as const;

export type FestiveConfig = typeof festiveConfig;
