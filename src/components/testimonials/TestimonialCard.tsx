"use client";

import { Star, Quote } from "lucide-react";

interface TestimonialCardProps {
  id: string;
  authorName: string;
  authorImage: string | null;
  rating: number;
  message: string;
  date: Date;
}

export function TestimonialCard({
  authorName,
  authorImage,
  rating,
  message,
  date,
}: TestimonialCardProps) {
  // Get initials for avatar fallback
  const getInitials = (name: string) => {
    if (name === "Anonymous") return "A";
    const parts = name.trim().split(" ");
    if (parts.length === 1) return parts[0].charAt(0).toUpperCase();
    return (
      parts[0].charAt(0) + parts[parts.length - 1].charAt(0)
    ).toUpperCase();
  };

  // Format location from name if available (e.g., "S. T." -> "AE UAE")
  const getLocation = () => {
    // This is a placeholder - you can enhance this based on your data structure
    return "";
  };

  return (
    <div className="group relative p-6 sm:p-8 rounded-2xl bg-white dark:bg-[#1E293B] border border-slate-200 dark:border-slate-800 hover:border-[#0E52AC]/30 dark:hover:border-[#60A5FA]/30 transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
      {/* Quote Icon - Top Right */}
      <div className="absolute top-6 right-6 sm:top-8 sm:right-8 text-[#E5E7EB] dark:text-[#334155] opacity-40">
        <Quote className="w-12 h-12 sm:w-16 sm:h-16" strokeWidth={1.5} />
      </div>

      {/* Rating Stars */}
      <div className="flex gap-1 mb-4 sm:mb-5 relative z-10">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`w-5 h-5 sm:w-6 sm:h-6 ${
              star <= rating
                ? "fill-[#FFC107] text-[#FFC107]"
                : "fill-[#E5E7EB] text-[#E5E7EB] dark:fill-[#475569] dark:text-[#475569]"
            }`}
          />
        ))}
      </div>

      {/* Testimonial Message */}
      <blockquote className="text-base sm:text-lg text-[#1E293B] dark:text-[#E2E8F0] leading-relaxed mb-6 sm:mb-8 relative z-10 font-normal">
        &ldquo;{message}&rdquo;
      </blockquote>

      {/* Author Info */}
      <div className="flex items-center gap-3 sm:gap-4 pt-4 sm:pt-6 border-t border-slate-200 dark:border-slate-700">
        {authorImage ? (
          <img
            src={authorImage}
            alt={authorName}
            className="w-12 h-12 sm:w-14 sm:h-14 rounded-full object-cover ring-2 ring-[#0E52AC]/10 dark:ring-[#60A5FA]/10"
          />
        ) : (
          <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-[#0E52AC] dark:bg-[#60A5FA] flex items-center justify-center text-white text-lg sm:text-xl font-bold">
            {getInitials(authorName)}
          </div>
        )}
        <div className="flex-1 min-w-0">
          <div className="font-semibold text-base sm:text-lg text-[#111E2F] dark:text-white">
            {authorName}
          </div>
          {getLocation() && (
            <div className="text-sm text-[#64748B] dark:text-[#94A3B8] flex items-center gap-2 mt-0.5">
              {getLocation()}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
