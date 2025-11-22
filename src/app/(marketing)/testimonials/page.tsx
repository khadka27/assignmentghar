"use client";

import { useState, useEffect } from "react";
import { TestimonialForm } from "@/components/testimonials/TestimonialForm";
import { TestimonialCard } from "@/components/testimonials/TestimonialCard";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";

interface Testimonial {
  id: string;
  authorName: string;
  authorImage: string | null;
  rating: number;
  message: string;
  date: Date;
}

interface FetchResponse {
  testimonials: Testimonial[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export default function TestimonialsPage() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);

  const fetchTestimonials = async (
    page: number = 1,
    append: boolean = false
  ) => {
    try {
      if (append) {
        setIsLoadingMore(true);
      } else {
        setIsLoading(true);
      }

      const res = await fetch(`/api/testimonials/list?page=${page}&limit=9`);

      if (!res.ok) {
        throw new Error("Failed to fetch testimonials");
      }

      const data: FetchResponse = await res.json();

      if (append) {
        setTestimonials((prev) => [...prev, ...data.testimonials]);
      } else {
        setTestimonials(data.testimonials);
      }

      setCurrentPage(data.page);
      setTotalPages(data.totalPages);
      setTotal(data.total);
    } catch (error: any) {
      toast.error(error.message || "Failed to load testimonials");
    } finally {
      setIsLoading(false);
      setIsLoadingMore(false);
    }
  };

  useEffect(() => {
    fetchTestimonials(1, false);
  }, []);

  const handleLoadMore = () => {
    if (currentPage < totalPages) {
      fetchTestimonials(currentPage + 1, true);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FBFF] dark:bg-[#0A0F1E] py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-[#111E2F] dark:text-white mb-4">
            What Our Users Say
          </h1>
          <p className="text-lg text-[#284366] dark:text-[#CBD5E1] max-w-2xl mx-auto">
            Real feedback from real users. See why thousands of students trust
            us with their assignments.
          </p>
        </div>

        {/* Submission Form */}
        <div className="max-w-3xl mx-auto mb-16">
          <TestimonialForm />
        </div>

        {/* Stats */}
        {total > 0 && (
          <div className="text-center mb-8">
            <p className="text-[#284366] dark:text-[#CBD5E1]">
              Showing{" "}
              <span className="font-semibold">{testimonials.length}</span> of{" "}
              <span className="font-semibold">{total}</span> testimonials
            </p>
          </div>
        )}

        {/* Loading State */}
        {isLoading && (
          <div className="flex justify-center items-center py-20">
            <Loader2 className="w-8 h-8 animate-spin text-[#0E52AC]" />
            <span className="ml-3 text-[#284366] dark:text-[#CBD5E1]">
              Loading testimonials...
            </span>
          </div>
        )}

        {/* Testimonials Grid */}
        {!isLoading && testimonials.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {testimonials.map((testimonial) => (
              <TestimonialCard
                key={testimonial.id}
                id={testimonial.id}
                authorName={testimonial.authorName}
                authorImage={testimonial.authorImage}
                rating={testimonial.rating}
                message={testimonial.message}
                date={testimonial.date}
              />
            ))}
          </div>
        )}

        {/* Empty State */}
        {!isLoading && testimonials.length === 0 && (
          <div className="text-center py-20">
            <div className="mb-4">
              <svg
                className="w-16 h-16 mx-auto text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"
                />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              No testimonials yet
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              Be the first to share your experience!
            </p>
          </div>
        )}

        {/* Load More Button */}
        {!isLoading && currentPage < totalPages && (
          <div className="text-center">
            <Button
              onClick={handleLoadMore}
              disabled={isLoadingMore}
              variant="outline"
              className="px-8"
            >
              {isLoadingMore ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Loading more...
                </>
              ) : (
                <>
                  Load More
                  <span className="ml-2 text-sm text-gray-500">
                    ({testimonials.length} of {total})
                  </span>
                </>
              )}
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
