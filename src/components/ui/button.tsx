import * as React from "react";
import type { ReactNode } from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "font-semibold rounded-xl transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2563eb] dark:focus-visible:ring-[#60a5fa] focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none transform hover:scale-105 active:scale-95",
  {
    variants: {
      variant: {
        primary:
          "bg-[#2563eb] text-white hover:bg-[#1d4ed8] hover:shadow-lg hover:shadow-blue-500/30 dark:bg-[#60a5fa] dark:text-[#0f172a] dark:hover:bg-[#3b82f6] dark:hover:shadow-blue-400/30",
        secondary:
          "bg-[#7c3aed] text-white hover:bg-[#6d28d9] hover:shadow-lg hover:shadow-purple-500/30 dark:bg-[#a78bfa] dark:text-[#0f172a] dark:hover:bg-[#818cf8] dark:hover:shadow-purple-400/30",
        outline:
          "border-2 border-[#e2e8f0] dark:border-[#334155] text-[#0f172a] dark:text-[#f1f5f9] hover:bg-[#f8fafc] dark:hover:bg-[#1e293b] hover:border-[#2563eb] dark:hover:border-[#60a5fa]",
        ghost:
          "text-[#0f172a] dark:text-[#f1f5f9] hover:bg-[#f1f5f9] dark:hover:bg-[#1e293b]",
        gradient:
          "bg-gradient-to-r from-[#2563eb] to-[#7c3aed] text-white hover:from-[#1d4ed8] hover:to-[#6d28d9] hover:shadow-lg hover:shadow-blue-500/40 dark:from-[#60a5fa] dark:to-[#a78bfa] dark:text-[#0f172a] dark:hover:from-[#3b82f6] dark:hover:to-[#818cf8]",
      },
      size: {
        sm: "px-4 py-2 text-sm",
        md: "px-6 py-3 text-base",
        lg: "px-8 py-4 text-lg",
        icon: "p-3",
        default: "px-6 py-3 text-base",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "default",
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  children?: ReactNode;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ children, variant, size, className, ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(buttonVariants({ variant, size, className }))}
        {...props}
      >
        {children}
      </button>
    );
  }
);

Button.displayName = "Button";

export { buttonVariants };
