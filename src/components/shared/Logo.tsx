import Link from "next/link";

interface LogoProps {
  variant?: "header" | "footer" | "hero" | "compact" | "admin";
  theme?: "dark" | "light";
  showSubtitle?: boolean;
  showEst?: boolean;
  className?: string;
  href?: string | null;
}

export function Logo({
  variant = "header",
  theme = "dark",
  showSubtitle,
  showEst,
  className = "",
  href = "/",
}: LogoProps) {
  const isDark = theme === "dark";
  const textColor = isDark ? "text-[#F8EFE6]" : "text-[#2A1B15]";
  const isFooter = variant === "footer";
  const isHero = variant === "hero";
  const isCompact = variant === "compact";
  const isAdmin = variant === "admin";

  const renderSubtitle =
    showSubtitle ?? (isFooter || isHero);
  const renderEst = showEst ?? isFooter;

  // Sizes based on variant
  const textSize = isFooter
    ? "text-2xl sm:text-3xl md:text-4xl"
    : isHero
    ? "text-2xl sm:text-3xl"
    : isCompact
    ? "text-lg sm:text-xl"
    : isAdmin
    ? "text-xl sm:text-2xl"
    : "text-xl sm:text-2xl md:text-[26px]";

  const content = (
    <div
      className={`inline-flex flex-col items-center select-none text-center ${className}`}
    >
      {/* Wordmark: WICK & WISH */}
      <div
        className={`font-serif ${textSize} font-medium tracking-[0.3em] uppercase leading-none flex items-center justify-center transition-colors ${textColor}`}
        style={{
          fontFamily: "'Cormorant Garamond', Georgia, serif",
        }}
      >
        <span>WICK</span>
        <span
          className="italic text-[#D9A441] font-normal leading-none inline-block mx-2.5 sm:mx-3 text-[1.38em] relative -top-[0.04em]"
          style={{
            fontFamily: "'Cormorant Garamond', Georgia, serif",
          }}
          aria-hidden="true"
        >
          &amp;
        </span>
        <span className="-ml-1">WISH</span>
      </div>

      {/* Thin gold divider & Subtitle for Footer and Hero */}
      {renderSubtitle && (
        <div className="flex flex-col items-center mt-2.5 space-y-1">
          <div className="w-20 sm:w-28 h-[1px] bg-[#D9A441]/40" />
          <span className="text-[8px] sm:text-[9px] tracking-[0.28em] font-medium text-[#D9A441] uppercase">
            HANDPOURED
          </span>
          {renderEst && (
            <span className="text-[8px] sm:text-[9px] tracking-[0.32em] font-normal text-[#D9A441]/80 uppercase pt-0.5">
              EST. 2026
            </span>
          )}
        </div>
      )}
    </div>
  );

  if (href) {
    return (
      <Link
        href={href}
        className="inline-block group focus:outline-none"
        aria-label="Wick &amp; Wish — Home"
      >
        {content}
      </Link>
    );
  }

  return content;
}

