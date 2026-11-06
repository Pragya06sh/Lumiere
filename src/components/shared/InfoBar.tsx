import React from "react";
import { ShieldAlert, AlertCircle, Info, Sparkles } from "lucide-react";

export interface InfoBarProps {
  children: React.ReactNode;
  title?: string;
  variant?: "safety" | "info" | "gold" | "maroon";
  icon?: React.ReactNode;
  className?: string;
}

export function InfoBar({
  children,
  title,
  variant = "safety",
  icon,
  className = "",
}: InfoBarProps) {
  const variantStyles = {
    safety: "bg-[#241510] border-[#D9A441]/40 text-[#F8EFE6]",
    info: "bg-[#241510] border-[#D9A441]/20 text-[#F8EFE6]",
    gold: "bg-[#241510] border-[#D9A441]/50 text-[#F8EFE6]",
    maroon: "bg-[#3A1410] border-[#D9A441]/30 text-[#F8EFE6]",
  };

  const defaultIcons = {
    safety: <ShieldAlert className="w-5 h-5 text-[#F28A3D] shrink-0 mt-0.5" />,
    info: <Info className="w-5 h-5 text-[#D9A441] shrink-0 mt-0.5" />,
    gold: <Sparkles className="w-5 h-5 text-[#D9A441] shrink-0 mt-0.5" />,
    maroon: <AlertCircle className="w-5 h-5 text-[#F28A3D] shrink-0 mt-0.5" />,
  };

  return (
    <div
      role="region"
      aria-label={title || "Important notice"}
      className={`mt-12 p-5 md:p-6 rounded-[24px] border flex items-start gap-4 shadow-[0_4px_24px_rgba(0,0,0,0.25)] ${variantStyles[variant]} ${className}`}
    >
      {icon ?? defaultIcons[variant]}
      <div className="flex-1 space-y-1.5">
        {title && (
          <h4 className="font-semibold text-base text-[#F8EFE6] tracking-wide">
            {title}
          </h4>
        )}
        <div className="text-sm md:text-base leading-relaxed text-[#CDB8A6]">
          {children}
        </div>
      </div>
    </div>
  );
}
