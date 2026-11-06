import React from "react";

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  variant?: "cream" | "dark";
  className?: string;
  as?: "div" | "article" | "section";
}

export function Card({
  children,
  variant = "cream",
  className = "",
  as: Component = "div",
  ...props
}: CardProps) {
  const variantStyles = {
    cream: "bg-[#FAF3EA] text-[#2A1B15] border border-[#E6D8C6] shadow-[0_4px_24px_rgba(0,0,0,0.15)]",
    dark: "bg-[#241510] text-[#F8EFE6] border border-[#D9A441]/20 shadow-[0_4px_24px_rgba(0,0,0,0.3)]",
  };

  return (
    <Component
      className={`rounded-[24px] p-5 md:p-6 transition-all duration-300 ${variantStyles[variant]} ${className}`}
      {...props}
    >
      {children}
    </Component>
  );
}
