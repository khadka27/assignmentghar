"use client";

import Link from "next/link";
import { Check } from "lucide-react";
import React from "react";

export default function Home() {
  return (
    <div className="w-full overflow-hidden">
      {/* Hero Section */}
      <section className="min-h-screen bg-white dark:bg-black">
        <div className="container mx-auto px-4 py-8 md:py-12 lg:py-16">
          <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
            {/* Left Content */}
            <div className="space-y-6 md:space-y-8">
              {/* Brand Name */}
              <div
                className="text-sm md:text-base font-medium"
                style={{ color: "#284366" }}
              >
                Assignment Ghar
              </div>

              {/* Main Heading */}
              <div className="space-y-2">
                <h1
                  className="text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold leading-tight"
                  style={{ color: "#111E2F" }}
                >
                  A{" "}
                  <span
                    style={{ color: "#0E52AC" }}
                    className="relative inline-block"
                  >
                    Trusted Partner
                    <svg
                      className="absolute -bottom-1 left-0 w-full"
                      height="8"
                      viewBox="0 0 300 8"
                      fill="none"
                    >
                      <path
                        d="M2 6C100 2 200 2 298 6"
                        stroke="#0E52AC"
                        strokeWidth="3"
                        strokeLinecap="round"
                      />
                    </svg>
                  </span>
                </h1>
                <h1
                  className="text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold leading-tight"
                  style={{ color: "#111E2F" }}
                >
                  for your Academic
                </h1>
                <h1 className="text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold leading-tight">
                  <span
                    style={{ color: "#0E52AC" }}
                    className="relative inline-block"
                  >
                    Success
                    <svg
                      className="absolute -bottom-1 left-0 w-full"
                      height="8"
                      viewBox="0 0 200 8"
                      fill="none"
                    >
                      <path
                        d="M2 6C66 2 133 2 198 6"
                        stroke="#0E52AC"
                        strokeWidth="3"
                        strokeLinecap="round"
                      />
                    </svg>
                  </span>
                </h1>
              </div>

              {/* Features List */}
              <div className="space-y-4 md:space-y-5">
                <FeatureItem text="Get quick and reliable help with your college or university assignments" />

                <FeatureItem text="No matter where you study or how close your deadline is, we connect you directly with expert consultants who understand your subject and your struggles." />

                <FeatureItem text="Chat in real time, share your files securely, and receive personalized guidance that helps you complete your assignments with confidence and quality." />
              </div>

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-3 md:gap-4 pt-2 md:pt-4">
                <Link href="/chat">
                  <button
                    className="w-full sm:w-auto px-6 md:px-8 py-3 md:py-3.5 rounded-lg font-semibold text-white text-sm md:text-base transition-all hover:opacity-90 hover:shadow-lg"
                    style={{ backgroundColor: "#0E52AC" }}
                  >
                    Start Chat Now
                  </button>
                </Link>
                <Link href="/submit">
                  <button
                    className="w-full sm:w-auto px-6 md:px-8 py-3 md:py-3.5 rounded-lg font-semibold text-sm md:text-base border-2 transition-all hover:shadow-lg"
                    style={{
                      color: "#0E52AC",
                      borderColor: "#0E52AC",
                      backgroundColor: "white",
                    }}
                  >
                    Submit your Assignment
                  </button>
                </Link>
              </div>
            </div>

            {/* Right Image */}
            <div className="relative order-first lg:order-last">
              <div className="relative rounded-2xl overflow-hidden shadow-2xl">
                <img
                  src="https://i.imgur.com/8KQY6Zm.jpeg"
                  alt="Student studying with laptop"
                  className="w-full h-auto object-cover"
                />
                {/* Overlay gradient for better text visibility on mobile */}
                <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/10 lg:hidden"></div>
              </div>

              {/* Decorative elements */}
              <div
                className="hidden lg:block absolute -top-4 -right-4 w-24 h-24 rounded-full opacity-20"
                style={{ backgroundColor: "#0E52AC" }}
              ></div>
              <div
                className="hidden lg:block absolute -bottom-4 -left-4 w-32 h-32 rounded-full opacity-10"
                style={{ backgroundColor: "#0E52AC" }}
              ></div>
            </div>
          </div>
        </div>

        {/* Background decorative elements */}
        <div
          className="fixed top-0 right-0 w-64 md:w-96 h-64 md:h-96 rounded-full blur-3xl opacity-5 pointer-events-none"
          style={{ backgroundColor: "#E0EDFD" }}
        ></div>
        <div
          className="fixed bottom-0 left-0 w-64 md:w-96 h-64 md:h-96 rounded-full blur-3xl opacity-5 pointer-events-none"
          style={{ backgroundColor: "#E0EDFD" }}
        ></div>
      </section>

      {/* Stats Counter Section */}
      <section className="py-20 bg-gray-50 dark:bg-gray-900 border-y border-gray-200 dark:border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              {
                icon: Users,
                count: counters.students,
                label: "Happy Students",
                suffix: "+",
              },
              {
                icon: FileCheck,
                count: counters.assignments,
                label: "Assignments Completed",
                suffix: "+",
              },
              {
                icon: Award,
                count: counters.experts,
                label: "Expert Tutors",
                suffix: "+",
              },
              {
                icon: TrendingUp,
                count: counters.satisfaction,
                label: "Satisfaction Rate",
                suffix: "%",
              },
            ].map((stat, index) => (
              <div key={index} className="text-center space-y-3">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-900">
                  <stat.icon className="w-8 h-8 text-blue-600 dark:text-blue-400" />
                </div>
                <div className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white">
                  {stat.count.toLocaleString()}
                  {stat.suffix}
                </div>
                <div className="text-gray-600 dark:text-gray-400 font-medium">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white dark:bg-black">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Section Header */}
          <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
            <Badge className="bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400 text-sm px-4 py-1 border border-blue-200 dark:border-blue-900">
              Why Choose Us
            </Badge>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white">
              Everything You Need
              <br />
              For Academic Success
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-400">
              Comprehensive tools and expert support to help you excel in your
              studies
            </p>
          </div>

          {/* Features Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: MessageSquare,
                title: "Real-Time Chat",
                description:
                  "Connect instantly with expert tutors through our advanced chat system",
              },
              {
                icon: Brain,
                title: "Expert Guidance",
                description:
                  "Get personalized help from qualified professionals in your field",
              },
              {
                icon: Clock,
                title: "24/7 Support",
                description:
                  "Round-the-clock assistance whenever you need help with assignments",
              },
              {
                icon: Lock,
                title: "Secure Platform",
                description:
                  "Your data and assignments are protected with end-to-end encryption",
              },
              {
                icon: Target,
                title: "Quality Guarantee",
                description:
                  "100% plagiarism-free work with unlimited revisions until you're satisfied",
              },
              {
                icon: TrendingUp,
                title: "Grade Improvement",
                description:
                  "Proven track record of helping students achieve higher grades",
              },
            ].map((feature, index) => (
              <Card
                key={index}
                className="p-8 border border-gray-200 dark:border-gray-800 hover:border-blue-600 dark:hover:border-blue-600 transition-colors"
              >
                <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-900 mb-6">
                  <feature.icon className="w-8 h-8 text-blue-600 dark:text-blue-400" />
                </div>
                <h3 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">
                  {feature.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                  {feature.description}
                </p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-20 bg-gray-50 dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
            <Badge className="bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400 text-sm px-4 py-1 border border-blue-200 dark:border-blue-900">
              Our Services
            </Badge>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white">
              Wide Range of Academic Services
            </h2>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {services.map((service) => (
              <Card
                key={service.title}
                className="p-6 border border-gray-200 dark:border-gray-800 hover:border-blue-600 dark:hover:border-blue-600 transition-colors"
              >
                <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-900 mb-4">
                  <BookOpen className="w-8 h-8 text-blue-600 dark:text-blue-400" />
                </div>
                <h3 className="text-xl font-bold mb-3 text-gray-900 dark:text-white">
                  {service.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-400 mb-4">
                  {service.description}
                </p>
                <Link href="/submit">
                  <Button
                    variant="ghost"
                    className="text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 p-0 h-auto font-medium"
                  >
                    Learn More
                    <ArrowRight className="ml-2 w-4 h-4" />
                  </Button>
                </Link>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 bg-white dark:bg-black border-t border-gray-200 dark:border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
            <Badge className="bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400 text-sm px-4 py-1 border border-blue-200 dark:border-blue-900">
              Simple Process
            </Badge>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white">
              How It Works
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-400">
              Get started in 3 easy steps
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                step: "01",
                title: "Submit Assignment",
                description:
                  "Upload your assignment details and requirements through our easy-to-use platform",
                icon: FileCheck,
              },
              {
                step: "02",
                title: "Connect with Expert",
                description:
                  "Get matched with a qualified tutor who specializes in your subject area",
                icon: Users,
              },
              {
                step: "03",
                title: "Receive Solution",
                description:
                  "Get your completed assignment with detailed explanations and on-time delivery",
                icon: Award,
              },
            ].map((step, index) => (
              <div key={index} className="relative">
                <div className="bg-white dark:bg-gray-900 rounded-lg p-8 border border-gray-200 dark:border-gray-800">
                  {/* Step Number */}
                  <div className="text-5xl font-bold text-gray-200 dark:text-gray-800 mb-4">
                    {step.step}
                  </div>

                  {/* Icon */}
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-900 mb-6">
                    <step.icon className="w-8 h-8 text-blue-600 dark:text-blue-400" />
                  </div>

                  {/* Content */}
                  <h3 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">
                    {step.title}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                    {step.description}
                  </p>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center mt-12">
            <Link href="/submit">
              <Button
                size="lg"
                className="bg-blue-600 hover:bg-blue-700 text-white h-12 px-8"
              >
                Get Started Now
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 bg-gray-50 dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
            <Badge className="bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400 text-sm px-4 py-1 border border-blue-200 dark:border-blue-900">
              Testimonials
            </Badge>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white">
              What Students Say
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-400">
              Real feedback from students who achieved success with our help
            </p>
          </div>

          {/* Featured Testimonial */}
          <div className="relative max-w-4xl mx-auto mb-12">
            <Card className="p-8 md:p-12 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
              <div className="flex flex-col md:flex-row items-center gap-8">
                <div className="flex-shrink-0">
                  <div className="w-24 h-24 bg-blue-600 rounded-full flex items-center justify-center text-white text-3xl font-bold">
                    {testimonials[activeTestimonial]?.initials || "S"}
                  </div>
                </div>
                <div className="flex-1 text-center md:text-left">
                  <div className="flex items-center justify-center md:justify-start gap-1 mb-4">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star
                        key={i}
                        className="w-6 h-6 fill-blue-600 text-blue-600"
                      />
                    ))}
                  </div>
                  <p className="text-xl md:text-2xl text-gray-700 dark:text-gray-300 mb-4">
                    "{testimonials[activeTestimonial]?.text}"
                  </p>
                  <div>
                    <p className="font-bold text-gray-900 dark:text-white text-lg">
                      {testimonials[activeTestimonial]?.initials}
                    </p>
                    <p className="text-gray-600 dark:text-gray-400">
                      {testimonials[activeTestimonial]?.course}
                    </p>
                  </div>
                </div>
              </div>
            </Card>

            {/* Navigation dots */}
            <div className="flex items-center justify-center gap-2 mt-6">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setActiveTestimonial(index)}
                  className={`h-2 rounded-full transition-all ${
                    index === activeTestimonial
                      ? "w-8 bg-blue-600"
                      : "w-2 bg-gray-300 dark:bg-gray-600"
                  }`}
                  aria-label={`View testimonial ${index + 1}`}
                />
              ))}
            </div>
          </div>

          {/* Testimonial Grid */}
          <div className="grid md:grid-cols-3 gap-6">
            {testimonials.slice(0, 3).map((testimonial, index) => (
              <Card
                key={index}
                className="p-6 border border-gray-200 dark:border-gray-800"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold">
                    {testimonial.initials}
                  </div>
                  <div className="flex gap-1">
                    {Array.from({ length: testimonial.rating }).map((_, i) => (
                      <Star
                        key={i}
                        className="w-4 h-4 fill-blue-600 text-blue-600"
                      />
                    ))}
                  </div>
                </div>
                <p className="text-gray-700 dark:text-gray-300 mb-4">
                  "{testimonial.text}"
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {testimonial.course}
                </p>
              </Card>
            ))}
          </div>

          <div className="text-center mt-12">
            <Link href="/testimonials">
              <Button
                variant="outline"
                size="lg"
                className="border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-800"
              >
                View All Testimonials
                <ArrowRight className="ml-2 w-4 h-4" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative py-20 bg-blue-600 text-white border-t border-blue-700">
        <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Ready to Excel in Your Studies?
          </h2>
          <p className="text-xl mb-8 text-blue-100 max-w-3xl mx-auto">
            Join thousands of students who have improved their grades and
            achieved academic success with our expert help.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Link href="/register">
              <Button
                size="lg"
                className="bg-white text-blue-600 hover:bg-gray-100 h-14 px-8 text-lg font-medium"
              >
                Get Started Free
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </Link>
            <Link href="/chat">
              <Button
                variant="outline"
                size="lg"
                className="border-2 border-white text-white hover:bg-blue-700 h-14 px-8 text-lg"
              >
                <MessageSquare className="mr-2 w-5 h-5" />
                Start Chat Now
              </Button>
            </Link>
          </div>

          {/* Trust indicators */}
          <div className="flex flex-wrap items-center justify-center gap-8 pt-8 border-t border-blue-500">
            {[
              "✓ 100% Plagiarism-Free",
              "✓ 24/7 Support",
              "✓ Money-Back Guarantee",
              "✓ Confidential & Secure",
            ].map((item, index) => (
              <div key={index} className="text-blue-100 font-medium">
                {item}
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

// FeatureItem Component
interface FeatureItemProps {
  text: string;
}

const FeatureItem: React.FC<FeatureItemProps> = ({ text }) => {
  return (
    <div className="flex gap-3 md:gap-4">
      <div className="flex-shrink-0 mt-1">
        <div
          className="w-5 h-5 md:w-6 md:h-6 rounded-full flex items-center justify-center"
          style={{ backgroundColor: "#0E52AC" }}
        >
          <Check className="w-3 h-3 md:w-4 md:h-4 text-white" strokeWidth={3} />
        </div>
      </div>
      <p
        className="text-sm md:text-base lg:text-lg"
        style={{ color: "#284366" }}
      >
        {text}
      </p>
    </div>
  );
};
