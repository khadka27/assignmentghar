"use client";

import { Star } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

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
  // Format date to relative time (e.g., "2 days ago")
  const formatDate = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - new Date(date).getTime();
    const seconds = Math.floor(diff / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);
    const months = Math.floor(days / 30);
    const years = Math.floor(days / 365);

    if (years > 0) return `${years} ${years === 1 ? "year" : "years"} ago`;
    if (months > 0) return `${months} ${months === 1 ? "month" : "months"} ago`;
    if (days > 0) return `${days} ${days === 1 ? "day" : "days"} ago`;
    if (hours > 0) return `${hours} ${hours === 1 ? "hour" : "hours"} ago`;
    if (minutes > 0)
      return `${minutes} ${minutes === 1 ? "minute" : "minutes"} ago`;
    return "Just now";
  };

  // Get initials for avatar fallback
  const getInitials = (name: string) => {
    if (name === "Anonymous") return "A";
    const parts = name.trim().split(" ");
    if (parts.length === 1) return parts[0].charAt(0).toUpperCase();
    return (
      parts[0].charAt(0) + parts[parts.length - 1].charAt(0)
    ).toUpperCase();
  };

  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md border border-gray-200 dark:border-gray-700 hover:shadow-lg transition-shadow duration-300">
      {/* Rating Stars */}
      <div className="flex items-center mb-4">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`w-5 h-5 ${
              star <= rating
                ? "fill-yellow-400 text-yellow-400"
                : "text-gray-300 dark:text-gray-600"
            }`}
          />
        ))}
        <span className="ml-2 text-sm text-gray-600 dark:text-gray-400">
          {rating}.0
        </span>
      </div>

      {/* Message */}
      <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
        &ldquo;{message}&rdquo;
      </p>

      {/* Author Info */}
      <div className="flex items-center justify-between pt-4 border-t border-gray-200 dark:border-gray-700">
        <div className="flex items-center space-x-3">
          <Avatar className="w-10 h-10">
            <AvatarImage src={authorImage || undefined} alt={authorName} />
            <AvatarFallback className="bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-300 font-semibold">
              {getInitials(authorName)}
            </AvatarFallback>
          </Avatar>
          <div>
            <p className="font-medium text-gray-900 dark:text-white">
              {authorName}
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              {formatDate(date)}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
