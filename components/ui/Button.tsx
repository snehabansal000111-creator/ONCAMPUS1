"use client";

import { cn } from "@/lib/utils";
import { ButtonHTMLAttributes, forwardRef } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "ghost" | "outline";
  size?: "sm" | "md" | "lg";
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", size = "md", children, ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(
          "inline-flex items-center justify-center gap-2 font-medium rounded-xl2 transition-all duration-200 disabled:opacity-50 disabled:pointer-events-none",
          variant === "primary" && "btn-gradient",
          variant === "secondary" && "bg-primary-50 text-primary-700 hover:bg-primary-100",
          variant === "outline" && "border border-border bg-white hover:border-primary-300 text-ink",
          variant === "ghost" && "text-muted hover:text-ink hover:bg-slate-100",
          size === "sm" && "px-3.5 py-2 text-sm",
          size === "md" && "px-5 py-2.5 text-sm",
          size === "lg" && "px-7 py-3.5 text-base",
          className
        )}
        {...props}
      >
        {children}
      </button>
    );
  }
);
Button.displayName = "Button";

export default Button;
