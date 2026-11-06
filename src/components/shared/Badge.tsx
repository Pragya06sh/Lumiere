import React from "react";

export interface BadgeProps {
  children: React.ReactNode;
  variant?: "orange" | "surprise" | "gold" | "neutral" | "verified" | "bestseller" | "discount";
  className?: string;
}

export function Badge({
  children,
  variant = "neutral",
  className = "",
}: BadgeProps) {
  const variantStyles = {
    orange: "bg-[#F28A3D]/15 text-[#F28A3D] border-[#F28A3D]/40 font-medium",
    surprise: "bg-[#F28A3D]/20 text-[#F8EFE6] border-[#F28A3D]/50 font-medium",
    gold: "bg-[#D9A441]/15 text-[#D9A441] border-[#D9A441]/40 font-medium",
    bestseller: "bg-[#D9A441]/20 text-[#D9A441] border-[#D9A441]/50 font-medium",
    discount: "bg-[#F28A3D] text-[#1A0F0A] border-[#F28A3D] font-bold",
    neutral: "bg-white/10 text-[#F8EFE6] border-white/20 font-normal",
    verified: "bg-[#1B5E20]/40 text-[#A5D6A7] border-[#81C784]/40 font-medium",
  };

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full text-xs leading-none border tracking-wide transition-colors ${variantStyles[variant]} ${className}`}
    >
      {children}
    </span>
  );
}
