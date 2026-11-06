import React from "react";

export interface SectionProps {
  id?: string;
  background?: "dark" | "dark-alt" | "maroon" | "cream" | "sand";
  badge?: React.ReactNode;
  title?: React.ReactNode;
  subtitle?: React.ReactNode;
  action?: React.ReactNode;
  headerAlign?: "center" | "left";
  className?: string;
  containerClassName?: string;
  children: React.ReactNode;
}

export function Section({
  id,
  background = "dark",
  badge,
  title,
  subtitle,
  action,
  headerAlign = "left",
  className = "",
  containerClassName = "",
  children,
}: SectionProps) {
  const bgStyles = {
    dark: "bg-[#1A0F0A] text-[#F8EFE6]",
    "dark-alt": "bg-[#241510] text-[#F8EFE6]",
    maroon: "bg-[#3A1410] text-[#F8EFE6]",
    cream: "bg-[#1A0F0A] text-[#F8EFE6]",
    sand: "bg-[#241510] text-[#F8EFE6]",
  };

  const hasHeader = Boolean(badge || title || subtitle || action);

  return (
    <section
      id={id}
      className={`py-16 md:py-24 relative overflow-hidden border-b border-[#D9A441]/20 ${bgStyles[background]} ${className}`}
    >
      <div className={`max-w-[1200px] mx-auto px-6 md:px-12 ${containerClassName}`}>
        {hasHeader && (
          <div
            className={`mb-12 flex flex-col ${
              headerAlign === "center"
                ? "items-center text-center max-w-2xl mx-auto"
                : action
                ? "md:flex-row md:items-end justify-between gap-4"
                : "text-left max-w-2xl"
            }`}
          >
            <div className={headerAlign === "center" ? "space-y-3" : "space-y-3 max-w-xl"}>
              {badge && <div>{badge}</div>}

              {title && (
                <h2 className="text-3xl sm:text-4xl md:text-5xl font-display font-light text-[#F8EFE6] leading-[1.2]">
                  {title}
                </h2>
              )}

              {subtitle && (
                <p className="text-base sm:text-lg text-[#CDB8A6] leading-relaxed">
                  {subtitle}
                </p>
              )}
            </div>

            {action && <div className="mt-4 md:mt-0 shrink-0">{action}</div>}
          </div>
        )}

        {children}
      </div>
    </section>
  );
}
