import React from "react";

export interface StepCardProps {
  step: string | number;
  title: string;
  description: string;
  icon?: React.ReactNode;
  variant?: "dark" | "cream";
  className?: string;
}

export function StepCard({
  step,
  title,
  description,
  icon,
  variant = "dark",
  className = "",
}: StepCardProps) {
  const isDark = variant === "dark";

  return (
    <div
      className={`rounded-[24px] p-5 md:p-6 transition-all duration-300 flex flex-col justify-between ${
        isDark
          ? "bg-[#241510] border border-[#D9A441]/25 text-[#F8EFE6] shadow-[0_4px_24px_rgba(0,0,0,0.3)] hover:border-[#D9A441]/50"
          : "bg-[#FAF3EA] border border-[#E6D8C6] text-[#2A1B15] shadow-[0_4px_24px_rgba(0,0,0,0.08)] hover:border-[#D9A441]/40"
      } ${className}`}
    >
      <div>
        <div className="flex items-center justify-between mb-5">
          <span
            className={`inline-flex items-center justify-center w-11 h-11 rounded-full font-serif font-bold text-base tracking-wide border ${
              isDark
                ? "bg-[#F28A3D]/15 border-[#F28A3D]/40 text-[#F28A3D]"
                : "bg-[#F28A3D]/15 border-[#F28A3D]/40 text-[#8C3D00]"
            }`}
          >
            {typeof step === "number" ? String(step).padStart(2, "0") : step}
          </span>
          {icon && (
            <div className={isDark ? "text-[#D9A441]" : "text-[#F28A3D]"}>
              {icon}
            </div>
          )}
        </div>
        <h3
          className={`font-display text-xl md:text-2xl font-normal leading-snug ${
            isDark ? "text-[#F8EFE6]" : "text-[#2A1B15]"
          }`}
        >
          {title}
        </h3>
        <p
          className={`mt-2.5 text-base leading-relaxed ${
            isDark ? "text-[#CDB8A6]" : "text-[#5C463B]"
          }`}
        >
          {description}
        </p>
      </div>
    </div>
  );
}
