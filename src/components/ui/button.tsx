import * as React from "react";
import type { ReactNode } from "react";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children?: ReactNode;
  variant?: "primary" | "secondary" | "outline" | "ghost" | "gradient";
  size?: "sm" | "md" | "lg" | "icon";
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    { children, variant = "primary", size = "md", className = "", ...props },
    ref
  ) => {
    const baseStyles =
      "font-semibold rounded-xl transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none transform hover:scale-105 active:scale-95";

    const variants = {
      primary:
        "bg-blue-500 text-white hover:bg-blue-600 hover:shadow-lg hover:shadow-blue-500/30 dark:hover:shadow-blue-400/20",
      secondary:
        "bg-purple-500 text-white hover:bg-purple-600 hover:shadow-lg hover:shadow-purple-500/30 dark:hover:shadow-purple-400/20",
      outline:
        "border-2 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-100 hover:bg-gray-50 dark:hover:bg-gray-800 hover:border-blue-500 dark:hover:border-blue-400",
      ghost:
        "text-gray-900 dark:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-800",
      gradient:
        "bg-gradient-to-r from-blue-500 to-purple-500 text-white hover:from-blue-600 hover:to-purple-600 hover:shadow-lg hover:shadow-blue-500/40",
    };

    const sizes = {
      sm: "px-4 py-2 text-sm",
      md: "px-6 py-3 text-base",
      lg: "px-8 py-4 text-lg",
      icon: "p-3",
    };

    return (
      <button
        ref={ref}
        className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
        {...props}
      >
        {children}
      </button>
    );
  }
);

Button.displayName = "Button";
