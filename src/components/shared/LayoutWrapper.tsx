import React from "react";

export interface LayoutWrapperProps {
  children: React.ReactNode;
  className?: string;
  as?: "div" | "main" | "section" | "article";
}

export function LayoutWrapper({
  children,
  className = "",
  as: Component = "div",
}: LayoutWrapperProps) {
  return (
    <Component className={`max-w-[1200px] mx-auto px-6 md:px-12 ${className}`}>
      {children}
    </Component>
  );
}

// Alias for convenience
export const Container = LayoutWrapper;

