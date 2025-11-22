"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import axios from "axios";
import {
  Star,
  Quote,
  Shield,
  CheckCircle,
  Globe,
  Users,
  Loader2,
} from "lucide-react";
import { TestimonialForm } from "@/components/testimonials/TestimonialForm";
import { TestimonialCard } from "@/components/testimonials/TestimonialCard";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

interface DatabaseTestimonial {
  id: string;
  authorName: string;
  authorImage: string | null;
  rating: number;
  message: string;
  date: Date;
}

interface FetchResponse {
  testimonials: DatabaseTestimonial[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export default function TestimonialsPage() {
  // Static featured testimonials with context
  const featuredTestimonials = [
    {
      quote:
        "I found Assignment Ghar when I was searching for some trusted assignment help website. Their expert literally walked me through my IT report step by step. Honestly, I learned more from them than my class notes lol.",
      author: "Anonymous Student",
      location: "Australia",
      flag: "🇦🇺",
      rating: 5,
    },
    {
      quote:
        "I was almost out of time and just googled someone to do my assignment. Assignment Ghar not only helped me submit before deadline but also explained everything so nicely. Seriously, best assignment help I've used so far.",
      author: "R. S.",
      location: "Canada",
      flag: "🇨🇦",
      rating: 5,
    },
    {
      quote:
        "Tried few assignment helper apps before but nothing felt personal like Assignment Ghar. The chat and file sharing made things super easy. My university assignment went smooth, no stress at all.",
      author: "Anonymous Student",
      location: "UK",
      flag: "🇬🇧",
      rating: 5,
    },
    {
      quote:
        "Didn't wanna go with free AI sites coz they don't make sense half the time. I needed real people who get how college works. Assignment Ghar gave me that — real guidance that made me write better too.",
      author: "Anonymous Student",
      location: "USA",
      flag: "🇺🇸",
      rating: 5,
    },
    {
      quote:
        "Their process was so chill and professional same time. I could just chat, upload my stuff, and pay with that QR thing. My college assignment came perfect with all clear steps. No hidden anything.",
      author: "S. T.",
      location: "UAE",
      flag: "🇦🇪",
      rating: 5,
    },
  ];

  // Database testimonials state
  const [dbTestimonials, setDbTestimonials] = useState<DatabaseTestimonial[]>(
    []
  );
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);

  // Fetch testimonials from database using axios
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

      const { data } = await axios.get<FetchResponse>(
        `/api/testimonials/list?page=${page}&limit=9`
      );

      if (append) {
        setDbTestimonials((prev) => [...prev, ...data.testimonials]);
      } else {
        setDbTestimonials(data.testimonials);
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

  const stats = [
    {
      icon: <Users className="w-6 h-6" />,
      value: "500+",
      label: "Happy Students",
    },
    {
      icon: <Globe className="w-6 h-6" />,
      value: "15+",
      label: "Countries Served",
    },
    {
      icon: <CheckCircle className="w-6 h-6" />,
      value: "1000+",
      label: "Assignments Completed",
    },
    {
      icon: <Star className="w-6 h-6" />,
      value: "4.9/5",
      label: "Average Rating",
    },
  ];

  return (
    <div className="min-h-screen bg-white dark:bg-[#0A0F1E] transition-colors">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-[#F8FBFF] via-white to-[#E0EDFD] dark:from-[#0A0F1E] dark:via-[#1E293B] dark:to-[#0E52AC]/10 py-16 sm:py-20 md:py-24 lg:py-32">
        <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
        <div className="container mx-auto px-4 sm:px-6 md:px-8 lg:px-12 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-block mb-6">
              <span className="text-xs sm:text-sm font-semibold tracking-wide uppercase text-[#0E52AC] dark:text-[#60A5FA] bg-[#0E52AC]/10 dark:bg-[#60A5FA]/10 px-4 py-2 rounded-full">
                Student Reviews & Testimonials
              </span>
            </div>

            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-6 sm:mb-8 text-[#111E2F] dark:text-white">
              What Our Students Say About{" "}
              <span className="relative inline-block text-[#0E52AC] dark:text-[#60A5FA]">
                Assignment Ghar
                <svg
                  className="absolute -bottom-2 left-0 w-full"
                  height="12"
                  viewBox="0 0 300 12"
                  fill="none"
                >
                  <path
                    d="M2 8C100 3 200 3 298 8"
                    stroke="currentColor"
                    strokeWidth="4"
                    strokeLinecap="round"
                  />
                </svg>
              </span>
            </h1>

            <p className="text-base sm:text-lg md:text-xl text-[#284366] dark:text-[#CBD5E1] leading-relaxed max-w-3xl mx-auto">
              At Assignment Ghar, every success story starts with a student who
              simply needed the right guidance. From late-night deadlines to
              complex university projects, our students trust us as their go-to
              assignment helper for reliable, plagiarism-free, and affordable
              support.
            </p>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-12 sm:py-16 bg-white dark:bg-[#0A0F1E] border-y border-slate-200 dark:border-slate-800">
        <div className="container mx-auto px-4 sm:px-6 md:px-8 lg:px-12">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
            {stats.map((stat, index) => (
              <div
                key={index}
                className="text-center p-4 sm:p-6 rounded-xl bg-[#F8FBFF] dark:bg-[#1E293B] border border-slate-200 dark:border-slate-800 hover:border-[#0E52AC] dark:hover:border-[#60A5FA] transition-all duration-300"
              >
                <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-[#0E52AC]/10 dark:bg-[#60A5FA]/10 flex items-center justify-center mx-auto mb-3 sm:mb-4 text-[#0E52AC] dark:text-[#60A5FA]">
                  {stat.icon}
                </div>
                <div className="text-2xl sm:text-3xl md:text-4xl font-bold text-[#111E2F] dark:text-white mb-1 sm:mb-2">
                  {stat.value}
                </div>
                <div className="text-xs sm:text-sm text-[#284366] dark:text-[#CBD5E1]">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Testimonials Section */}
      <section className="py-16 sm:py-20 md:py-24 lg:py-28">
        <div className="container mx-auto px-4 sm:px-6 md:px-8 lg:px-12">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12 sm:mb-16">
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4 text-[#111E2F] dark:text-white">
                Featured{" "}
                <span className="text-[#0E52AC] dark:text-[#60A5FA]">
                  Student Stories
                </span>
              </h2>
              <p className="text-base sm:text-lg text-[#284366] dark:text-[#CBD5E1]">
                Real experiences from students who trusted us with their
                assignments
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8">
              {featuredTestimonials.map((testimonial, index) => (
                <div
                  key={index}
                  className="group relative p-6 sm:p-8 rounded-2xl bg-white dark:bg-[#1E293B] border border-slate-200 dark:border-slate-800 hover:border-[#0E52AC]/30 dark:hover:border-[#60A5FA]/30 transition-all duration-300 hover:shadow-xl hover:-translate-y-1"
                >
                  {/* Quote Icon */}
                  <div className="absolute top-6 right-6 sm:top-8 sm:right-8 text-[#0E52AC]/10 dark:text-[#60A5FA]/10 group-hover:text-[#0E52AC]/20 dark:group-hover:text-[#60A5FA]/20 transition-colors">
                    <Quote className="w-12 h-12 sm:w-16 sm:h-16" />
                  </div>

                  {/* Rating Stars */}
                  <div className="flex gap-1 mb-4 sm:mb-5">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star
                        key={i}
                        className="w-4 h-4 sm:w-5 sm:h-5 fill-[#FFC107] text-[#FFC107]"
                      />
                    ))}
                  </div>

                  {/* Testimonial Quote */}
                  <blockquote className="text-base sm:text-lg text-[#284366] dark:text-[#CBD5E1] leading-relaxed mb-6 sm:mb-8 relative z-10">
                    "{testimonial.quote}"
                  </blockquote>

                  {/* Author Info */}
                  <div className="flex items-center gap-3 sm:gap-4 pt-4 sm:pt-6 border-t border-slate-200 dark:border-slate-700">
                    <div className="flex-shrink-0 w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-gradient-to-br from-[#0E52AC] to-[#60A5FA] flex items-center justify-center text-white text-lg sm:text-xl font-bold">
                      {testimonial.author.charAt(0)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="font-semibold text-sm sm:text-base text-[#111E2F] dark:text-white truncate">
                        {testimonial.author}
                      </div>
                      <div className="text-xs sm:text-sm text-[#284366] dark:text-[#CBD5E1] flex items-center gap-2">
                        <span className="text-base sm:text-lg">
                          {testimonial.flag}
                        </span>
                        <span>{testimonial.location}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Submission Form Section */}
      <section className="py-16 sm:py-20 md:py-24 lg:py-28 bg-white dark:bg-[#0A0F1E]">
        <div className="container mx-auto px-4 sm:px-6 md:px-8 lg:px-12">
          <div className="max-w-3xl mx-auto">
            <div className="text-center mb-10 sm:mb-12">
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4 text-[#111E2F] dark:text-white">
                Share Your{" "}
                <span className="text-[#0E52AC] dark:text-[#60A5FA]">
                  Experience
                </span>
              </h2>
              <p className="text-base sm:text-lg text-[#284366] dark:text-[#CBD5E1]">
                Help other students by sharing your experience with Assignment
                Ghar
              </p>
            </div>
            <TestimonialForm />
          </div>
        </div>
      </section>

      {/* Database Testimonials Section */}
      {!isLoading && dbTestimonials.length > 0 && (
        <section className="py-16 sm:py-20 md:py-24 lg:py-28 bg-[#F8FBFF] dark:bg-[#1E293B]">
          <div className="container mx-auto px-4 sm:px-6 md:px-8 lg:px-12">
            <div className="max-w-6xl mx-auto">
              <div className="text-center mb-12 sm:mb-16">
                <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4 text-[#111E2F] dark:text-white">
                  More{" "}
                  <span className="text-[#0E52AC] dark:text-[#60A5FA]">
                    Student Reviews
                  </span>
                </h2>
                {total > 0 && (
                  <p className="text-base sm:text-lg text-[#284366] dark:text-[#CBD5E1]">
                    Showing {dbTestimonials.length} of {total} testimonials
                  </p>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
                {dbTestimonials.map((testimonial) => (
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

              {/* Load More Button */}
              {currentPage < totalPages && (
                <div className="text-center mt-10 sm:mt-12">
                  <Button
                    onClick={handleLoadMore}
                    disabled={isLoadingMore}
                    variant="outline"
                    className="px-8 min-h-[52px] border-2 border-[#0E52AC] dark:border-[#60A5FA] text-[#0E52AC] dark:text-[#60A5FA] hover:bg-[#0E52AC] hover:text-white dark:hover:bg-[#60A5FA] dark:hover:text-[#111E2F] transition-all duration-300"
                  >
                    {isLoadingMore ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Loading more...
                      </>
                    ) : (
                      <>
                        Load More
                        <span className="ml-2 text-sm">
                          ({dbTestimonials.length} of {total})
                        </span>
                      </>
                    )}
                  </Button>
                </div>
              )}
            </div>
          </div>
        </section>
      )}

      {/* Loading State */}
      {isLoading && (
        <section className="py-20">
          <div className="flex flex-col items-center justify-center gap-4">
            <Loader2 className="w-8 h-8 animate-spin text-[#0E52AC] dark:text-[#60A5FA]" />
            <span className="text-[#284366] dark:text-[#CBD5E1]">
              Loading testimonials...
            </span>
          </div>
        </section>
      )}

      {/* Trust & Authenticity Section */}
      <section className="py-16 sm:py-20 md:py-24 lg:py-28 bg-[#F8FBFF] dark:bg-[#1E293B]">
        <div className="container mx-auto px-4 sm:px-6 md:px-8 lg:px-12">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-10 sm:mb-12">
              <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-[#0E52AC]/10 dark:bg-[#60A5FA]/10 flex items-center justify-center mx-auto mb-6 text-[#0E52AC] dark:text-[#60A5FA]">
                <Shield className="w-8 h-8 sm:w-10 sm:h-10" />
              </div>
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4 sm:mb-6 text-[#111E2F] dark:text-white">
                Verified & Authentic{" "}
                <span className="text-[#0E52AC] dark:text-[#60A5FA]">
                  Student Reviews
                </span>
              </h2>
            </div>

            <div className="space-y-6 sm:space-y-8">
              <div className="p-6 sm:p-8 rounded-2xl bg-white dark:bg-[#0A0F1E] border border-slate-200 dark:border-slate-800">
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-[#0E52AC]/10 dark:bg-[#60A5FA]/10 flex items-center justify-center text-[#0E52AC] dark:text-[#60A5FA]">
                    <CheckCircle className="w-5 h-5 sm:w-6 sm:h-6" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg sm:text-xl font-bold mb-2 text-[#111E2F] dark:text-white">
                      Every Testimonial is Verified
                    </h3>
                    <p className="text-sm sm:text-base text-[#284366] dark:text-[#CBD5E1] leading-relaxed">
                      We value every piece of feedback our students share. Each
                      testimonial is verified and reviewed by our admin team
                      before publication to ensure authenticity and privacy.
                    </p>
                  </div>
                </div>
              </div>

              <div className="p-6 sm:p-8 rounded-2xl bg-white dark:bg-[#0A0F1E] border border-slate-200 dark:border-slate-800">
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-[#0E52AC]/10 dark:bg-[#60A5FA]/10 flex items-center justify-center text-[#0E52AC] dark:text-[#60A5FA]">
                    <Shield className="w-5 h-5 sm:w-6 sm:h-6" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg sm:text-xl font-bold mb-2 text-[#111E2F] dark:text-white">
                      Student Privacy Protected
                    </h3>
                    <p className="text-sm sm:text-base text-[#284366] dark:text-[#CBD5E1] leading-relaxed">
                      Student names remain hidden for confidentiality, but their
                      experiences reflect the real impact of our assignment
                      writing services across the globe.
                    </p>
                  </div>
                </div>
              </div>

              <div className="p-6 sm:p-8 rounded-2xl bg-white dark:bg-[#0A0F1E] border border-slate-200 dark:border-slate-800">
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-[#0E52AC]/10 dark:bg-[#60A5FA]/10 flex items-center justify-center text-[#0E52AC] dark:text-[#60A5FA]">
                    <Globe className="w-5 h-5 sm:w-6 sm:h-6" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg sm:text-xl font-bold mb-2 text-[#111E2F] dark:text-white">
                      Global Student Community
                    </h3>
                    <p className="text-sm sm:text-base text-[#284366] dark:text-[#CBD5E1] leading-relaxed">
                      Read what our students say about our assignment help
                      service — and see why Assignment Ghar has become the most
                      trusted assignment website for students worldwide.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 sm:py-20 md:py-24 lg:py-28">
        <div className="container mx-auto px-4 sm:px-6 md:px-8 lg:px-12">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-6 sm:mb-8 text-[#111E2F] dark:text-white">
              Ready to Join Our{" "}
              <span className="text-[#0E52AC] dark:text-[#60A5FA]">
                Success Stories
              </span>
              ?
            </h2>

            <p className="text-base sm:text-lg md:text-xl text-[#284366] dark:text-[#CBD5E1] leading-relaxed mb-10 sm:mb-12">
              Experience the same quality assignment help that thousands of
              students trust. Start your journey with Assignment Ghar today.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/chat" className="w-full sm:w-auto">
                <button className="w-full min-h-[52px] px-8 py-3.5 rounded-xl font-semibold text-white text-base transition-all duration-300 hover:shadow-xl hover:scale-105 active:scale-95 bg-[#0E52AC] dark:bg-[#60A5FA] shadow-lg">
                  Chat with Us Now
                </button>
              </Link>
              <Link href="/submit" className="w-full sm:w-auto">
                <button className="w-full min-h-[52px] px-8 py-3.5 rounded-xl font-semibold text-base border-2 transition-all duration-300 hover:shadow-xl hover:scale-105 active:scale-95 text-[#0E52AC] dark:text-[#60A5FA] border-[#0E52AC] dark:border-[#60A5FA] bg-white dark:bg-[#0A0F1E] hover:bg-[#F8FBFF] dark:hover:bg-[#1E293B]">
                  Submit Your Assignment
                </button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
