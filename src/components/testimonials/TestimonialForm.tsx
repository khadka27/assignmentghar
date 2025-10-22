"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Star, Loader2 } from "lucide-react";
import { toast } from "sonner";

export function TestimonialForm() {
  const { data: session, status } = useSession();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    displayName: "",
    isAnonymous: false,
    rating: 0,
    message: "",
  });

  const [hoveredRating, setHoveredRating] = useState(0);
  const isLoggedIn = status === "authenticated" && session?.user;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validation
    if (formData.rating === 0) {
      toast.error("Please select a rating");
      return;
    }

    if (formData.message.trim().length < 10) {
      toast.error("Message must be at least 10 characters long");
      return;
    }

    if (formData.message.trim().length > 1000) {
      toast.error("Message must not exceed 1000 characters");
      return;
    }

    // Only validate displayName if user is NOT logged in and NOT anonymous
    if (
      !isLoggedIn &&
      !formData.isAnonymous &&
      formData.displayName.trim().length === 0
    ) {
      toast.error("Please enter your name or choose to submit anonymously");
      return;
    }

    setIsSubmitting(true);

    try {
      const res = await fetch("/api/testimonials/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          // Only send displayName if user is NOT logged in
          displayName: !isLoggedIn
            ? formData.displayName.trim() || undefined
            : undefined,
          isAnonymous: formData.isAnonymous,
          rating: formData.rating,
          message: formData.message.trim(),
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Failed to submit testimonial");
      }

      toast.success(data.message || "Testimonial submitted successfully!");

      // Reset form
      setFormData({
        displayName: "",
        isAnonymous: false,
        rating: 0,
        message: "",
      });
    } catch (error: any) {
      toast.error(error.message || "An error occurred. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRatingClick = (rating: number) => {
    setFormData((prev) => ({ ...prev, rating }));
  };

  const messageLength = formData.message.length;
  const isMessageValid = messageLength >= 10 && messageLength <= 1000;

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-6 bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md border border-gray-200 dark:border-gray-700"
    >
      <div>
        <h3 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">
          Share Your Experience
        </h3>
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-6">
          Your feedback helps us improve our service and helps others make
          informed decisions.
        </p>
      </div>

      {/* Show user info if logged in */}
      {isLoggedIn && !formData.isAnonymous && (
        <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg border border-blue-200 dark:border-blue-800">
          <p className="text-sm text-blue-800 dark:text-blue-300">
            Submitting as:{" "}
            <span className="font-semibold">
              {session?.user?.name || session?.user?.email}
            </span>
          </p>
        </div>
      )}

      {/* Anonymous Toggle */}
      <div className="flex items-center space-x-2">
        <Checkbox
          id="anonymous"
          checked={formData.isAnonymous}
          onCheckedChange={(checked) =>
            setFormData((prev) => ({
              ...prev,
              isAnonymous: checked as boolean,
            }))
          }
        />
        <Label
          htmlFor="anonymous"
          className="text-sm font-medium cursor-pointer text-gray-700 dark:text-gray-300"
        >
          Submit anonymously
        </Label>
      </div>

      {/* Name Input (only show if NOT logged in AND NOT anonymous) */}
      {!isLoggedIn && !formData.isAnonymous && (
        <div className="space-y-2">
          <Label
            htmlFor="displayName"
            className="text-gray-700 dark:text-gray-300"
          >
            Your Name <span className="text-red-500">*</span>
          </Label>
          <Input
            id="displayName"
            type="text"
            placeholder="Enter your name"
            value={formData.displayName}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, displayName: e.target.value }))
            }
            className="bg-white dark:bg-gray-900 border-gray-300 dark:border-gray-600"
          />
        </div>
      )}

      {/* Star Rating */}
      <div className="space-y-2">
        <Label className="text-gray-700 dark:text-gray-300">
          Rating <span className="text-red-500">*</span>
        </Label>
        <div className="flex items-center space-x-1">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              type="button"
              onClick={() => handleRatingClick(star)}
              onMouseEnter={() => setHoveredRating(star)}
              onMouseLeave={() => setHoveredRating(0)}
              className="transition-transform hover:scale-110 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded"
              aria-label={`Rate ${star} stars`}
            >
              <Star
                className={`w-8 h-8 ${
                  star <= (hoveredRating || formData.rating)
                    ? "fill-yellow-400 text-yellow-400"
                    : "text-gray-300 dark:text-gray-600"
                }`}
              />
            </button>
          ))}
          {formData.rating > 0 && (
            <span className="ml-3 text-sm text-gray-600 dark:text-gray-400">
              {formData.rating} {formData.rating === 1 ? "star" : "stars"}
            </span>
          )}
        </div>
      </div>

      {/* Message Textarea */}
      <div className="space-y-2">
        <Label htmlFor="message" className="text-gray-700 dark:text-gray-300">
          Your Feedback <span className="text-red-500">*</span>
        </Label>
        <Textarea
          id="message"
          placeholder="Tell us about your experience... (10-1000 characters)"
          value={formData.message}
          onChange={(e) =>
            setFormData((prev) => ({ ...prev, message: e.target.value }))
          }
          rows={5}
          className="resize-none bg-white dark:bg-gray-900 border-gray-300 dark:border-gray-600"
        />
        <div className="flex items-center justify-between text-sm">
          <span
            className={`${
              isMessageValid
                ? "text-green-600 dark:text-green-400"
                : messageLength > 1000
                ? "text-red-600 dark:text-red-400"
                : "text-gray-500 dark:text-gray-400"
            }`}
          >
            {messageLength} / 1000 characters
          </span>
          {messageLength < 10 && messageLength > 0 && (
            <span className="text-orange-600 dark:text-orange-400">
              Minimum 10 characters required
            </span>
          )}
        </div>
      </div>

      {/* Submit Button */}
      <Button
        type="submit"
        disabled={
          isSubmitting ||
          formData.rating === 0 ||
          !isMessageValid ||
          // Only check displayName if NOT logged in and NOT anonymous
          (!isLoggedIn &&
            !formData.isAnonymous &&
            formData.displayName.trim().length === 0)
        }
        className="w-full bg-blue-600 hover:bg-blue-700 text-white disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isSubmitting ? (
          <>
            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            Submitting...
          </>
        ) : (
          "Submit Testimonial"
        )}
      </Button>

      <p className="text-xs text-gray-500 dark:text-gray-400 text-center">
        Your testimonial will be reviewed before being published.
      </p>
    </form>
  );
}
