import type React from "react";
import { cn } from "@/lib/utils";

interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  children: React.ReactNode;
  variant?: "default" | "success" | "warning" | "error";
}

export function Badge({
  children,
  variant = "default",
  className,
  ...props
}: BadgeProps) {
  const variants = {
    default:
      "bg-slate-200 text-slate-900 dark:bg-slate-700 dark:text-slate-100",
    success:
      "bg-emerald-100 text-emerald-900 dark:bg-emerald-900 dark:text-emerald-100",
    warning:
      "bg-yellow-100 text-yellow-900 dark:bg-yellow-900 dark:text-yellow-100",
    error: "bg-red-100 text-red-900 dark:bg-red-900 dark:text-red-100",
  };

  return (
    <span
      className={cn(
        "inline-block px-3 py-1 rounded-full text-xs font-medium",
        variants[variant],
        className
      )}
      {...props}
    >
      {children}
    </span>
  );
}
