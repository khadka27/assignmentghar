"use client";

import Link from "next/link";
import Image from "next/image";
import { Check } from "lucide-react";
import React from "react";
import Script from "next/script";

export default function Home() {
  // JSON-LD Structured Data
  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "AssignmentGhar",
    url: "https://assignmentghar.com",
    logo: {
      "@type": "ImageObject",
      url: "https://assignmentghar.com/logo.png",
    },
    description:
      "Professional assignment help and academic writing services for students worldwide.",
    sameAs: [
      "https://twitter.com/assignmentghar",
      "https://facebook.com/assignmentghar",
    ],
    contactPoint: {
      "@type": "ContactPoint",
      contactType: "Customer Service",
      email: "support@assignmentghar.com",
    },
  };

  const websiteSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "AssignmentGhar",
    url: "https://assignmentghar.com",
    description:
      "Get professional assignment help from expert writers. Quality academic writing services for students.",
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: "https://assignmentghar.com/search?q={search_term_string}",
      },
      "query-input": "required name=search_term_string",
    },
  };

  const serviceSchema = {
    "@context": "https://schema.org",
    "@type": "Service",
    name: "Assignment Writing Service",
    description: "Professional assignment help and academic writing services",
    provider: {
      "@type": "Organization",
      name: "AssignmentGhar",
      url: "https://assignmentghar.com",
    },
    serviceType: "Academic Writing Service",
    areaServed: "Worldwide",
  };

  return (
    <div className="min-h-screen relative transition-colors bg-white dark:bg-[#0A0F1E]">
      {/* JSON-LD Structured Data */}
      <Script
        id="organization-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
      />
      <Script
        id="website-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
      />
      <Script
        id="service-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceSchema) }}
      />
      {/* Hero Section */}
      <div className="container mx-auto px-4 sm:px-6 md:px-8 lg:px-12 py-12 sm:py-16 md:py-20 lg:py-24">
        <div className="grid lg:grid-cols-2 gap-8 sm:gap-10 md:gap-12 lg:gap-16 items-center">
          {/* Left Content */}
          <div className="space-y-6 sm:space-y-8 md:space-y-10">
            {/* Brand Name */}
            <div className="inline-block">
              <span className="text-xs sm:text-sm font-semibold tracking-wide uppercase transition-colors text-[#0E52AC] dark:text-[#60A5FA] bg-[#E0EDFD] dark:bg-[#0E52AC]/10 px-3 py-1.5 rounded-full">
                ✨ Assignment Ghar
              </span>
            </div>

            {/* Main Heading */}
            <div className="space-y-3 sm:space-y-4">
              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold leading-tight sm:leading-tight md:leading-tight lg:leading-tight transition-colors text-[#111E2F] dark:text-white">
                A{" "}
                <span className="relative inline-block text-[#0E52AC] dark:text-[#60A5FA]">
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
              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold leading-tight sm:leading-tight md:leading-tight lg:leading-tight transition-colors text-[#111E2F] dark:text-white">
                for your Academic
              </h1>
              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold leading-tight sm:leading-tight md:leading-tight lg:leading-tight">
                <span className="relative inline-block text-[#0E52AC] dark:text-[#60A5FA]">
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
            <div className="space-y-3 sm:space-y-4">
              <FeatureItem text="Get quick and reliable help with your college or university assignments" />

              <FeatureItem text="No matter where you study or how close your deadline is, we connect you directly with expert consultants who understand your subject and your struggles." />

              <FeatureItem text="Chat in real time, share your files securely, and receive personalized guidance that helps you complete your assignments with confidence and quality." />
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 pt-4 sm:pt-6">
              <Link href="/chat" className="w-full sm:w-auto">
                <button className="w-full min-h-[48px] sm:min-h-[52px] px-6 sm:px-8 py-3 sm:py-3.5 rounded-lg sm:rounded-xl font-semibold text-white text-sm sm:text-base transition-all duration-300 hover:opacity-90 hover:shadow-xl hover:scale-105 active:scale-95 bg-[#0E52AC] dark:bg-[#60A5FA] shadow-lg">
                  Start Chat Now
                </button>
              </Link>
              <Link href="/submit" className="w-full sm:w-auto">
                <button className="w-full min-h-[48px] sm:min-h-[52px] px-6 sm:px-8 py-3 sm:py-3.5 rounded-lg sm:rounded-xl font-semibold text-sm sm:text-base border-2 transition-all duration-300 hover:shadow-xl hover:scale-105 active:scale-95 text-[#0E52AC] dark:text-[#60A5FA] border-[#0E52AC] dark:border-[#60A5FA] bg-white dark:bg-[#0A0F1E] hover:bg-[#F8FBFF] dark:hover:bg-[#1E293B]">
                  Submit your Assignment
                </button>
              </Link>
            </div>
          </div>

          {/* Right Image */}
          <div className="relative order-first lg:order-last mt-8 lg:mt-0">
            <div className="relative rounded-2xl sm:rounded-3xl overflow-hidden shadow-2xl h-[300px] sm:h-[400px] md:h-[500px] lg:h-[600px] transition-transform duration-300 hover:shadow-[#0E52AC]/20 hover:shadow-3xl">
              <Image
                src="/Images/landing/hero.png"
                alt="Student studying with laptop"
                fill
                className="object-cover"
                priority
              />
              {/* Overlay gradient for better text visibility on mobile */}
              <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/10 lg:hidden"></div>
            </div>

            {/* Decorative elements */}
            <div className="hidden lg:block absolute -top-4 -right-4 w-24 h-24 rounded-full opacity-20 transition-colors bg-[#0E52AC]"></div>
            <div className="hidden lg:block absolute -bottom-4 -left-4 w-32 h-32 rounded-full opacity-10 transition-colors bg-[#0E52AC]"></div>
          </div>
        </div>
      </div>

      {/* Why Students Trust Us Section */}
      <div className="py-16 sm:py-20 md:py-24 lg:py-28 transition-colors bg-[#F8FBFF] dark:bg-[#1E293B]">
        <div className="container mx-auto px-4 sm:px-6 md:px-8 lg:px-12">
          {/* Section Header */}
          <div className="text-center mb-10 sm:mb-12 md:mb-16">
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-4 sm:mb-5 md:mb-6">
              <span className="transition-colors text-[#111E2F] dark:text-white">
                Why Students{" "}
              </span>
              <span className="relative inline-block text-[#0E52AC] dark:text-[#60A5FA]">
                Trust Us
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
            </h2>
            <p className="text-sm sm:text-base md:text-lg lg:text-xl max-w-4xl mx-auto leading-relaxed transition-colors text-[#284366] dark:text-[#CBD5E1] px-4">
              We built{" "}
              <span className="font-semibold text-[#0E52AC] dark:text-[#60A5FA]">
                Assignment Ghar
              </span>{" "}
              for students who deserve stress-free academic support, not another
              automated service.
              <br className="hidden sm:block" />
              Our system is designed for real connection and real results.
            </p>
          </div>

          {/* Features Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5 md:gap-6 mb-10 sm:mb-12 md:mb-16">
            <FeatureCard
              image="/Images/landing/Why Students Trust Us/Chat System.png"
              title="Chat System"
              description="Real time chat between student and admin"
            />
            <FeatureCard
              image="/Images/landing/Why Students Trust Us/File Sharing.png"
              title="File Sharing"
              description="File and image sharing inside chat window"
            />
            <FeatureCard
              image="/Images/landing/Why Students Trust Us/QR Payment.png"
              title="QR Payment"
              description="QR payment visible in chat for easy scan-and-pay"
            />
            <FeatureCard
              image="/Images/landing/Why Students Trust Us/Consultancy Videos.png"
              title="Consultancy Videos"
              description="Free consultancy videos for students"
            />
          </div>

          {/* Testimonial Card */}
          <div className="max-w-5xl mx-auto">
            <div className="rounded-2xl shadow-lg p-6 md:p-8 lg:p-10 transition-colors bg-white dark:bg-[#1E293B]">
              <div className="flex flex-col lg:flex-row gap-6 lg:gap-8 items-start lg:items-center">
                <div className="flex-1">
                  <p className="text-base md:text-lg mb-4 transition-colors text-[#284366] dark:text-[#CBD5E1]">
                    &quot;I was struggling with my IT assignment while abroad.
                    Assignment Ghar helped me understand the topic, not just
                    finish it.&quot;
                  </p>
                  <div className="flex items-center gap-3">
                    <span className="text-sm transition-colors text-[#284366] dark:text-[#94A3B8]">
                      Student from Canada
                    </span>
                    <div className="flex items-center gap-1 px-3 py-1 rounded-full transition-colors bg-[#FEF3C7] dark:bg-[#422006]">
                      <span className="text-sm">⭐</span>
                      <span className="text-sm font-semibold transition-colors text-[#92400E] dark:text-[#FCD34D]">
                        5.0
                      </span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-4 lg:pl-8 border-l border-[#E5E7EB] dark:border-[#475569]">
                  <div className="w-12 h-12 rounded-full flex items-center justify-center transition-colors bg-[#D1FAE5] dark:bg-[#064E3B]">
                    <svg
                      className="w-7 h-7 transition-colors text-[#059669] dark:text-[#10B981]"
                      viewBox="0 0 24 24"
                      fill="none"
                    >
                      <path
                        d="M9 12L11 14L15 10M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </div>
                  <div>
                    <div className="font-semibold text-base md:text-lg transition-colors text-[#111E2F] dark:text-white">
                      Trusted & Transparent
                    </div>
                    <div className="text-sm transition-colors text-[#284366] dark:text-[#94A3B8]">
                      Public Testimonial
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Our Areas of Expertise Section */}
      <div className="py-12 md:py-16 lg:py-20 transition-colors bg-[#F8FBFF] dark:bg-[#1E293B]">
        <div className="container mx-auto px-6 md:px-8 lg:px-12">
          {/* Section Header */}
          <div className="text-center mb-8 md:mb-12">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4 md:mb-6">
              <span className="transition-colors text-[#111E2F] dark:text-white">
                Our Areas of{" "}
              </span>
              <span className="relative inline-block text-[#0E52AC]">
                Expertise
                <svg
                  className="absolute -bottom-1 left-0 w-full"
                  height="8"
                  viewBox="0 0 250 8"
                  fill="none"
                >
                  <path
                    d="M2 6C83 2 166 2 248 6"
                    stroke="#0E52AC"
                    strokeWidth="3"
                    strokeLinecap="round"
                  />
                </svg>
              </span>
            </h2>
            <p className="text-sm md:text-base lg:text-lg max-w-5xl mx-auto leading-relaxed transition-colors text-[#284366] dark:text-[#CBD5E1]">
              We help students across diverse academic backgrounds achieve
              excellence through expert guidance, subject-focused insights, and
              personalized support. Each subject area is handled by experts who
              understand global university standards, ensuring accuracy,
              originality and academic integrity in every submission.
            </p>
          </div>

          {/* Expertise Grid */}
          <div className="grid md:grid-cols-2 gap-6 md:gap-8 lg:gap-12 max-w-7xl mx-auto">
            <ExpertiseCardVertical
              image="/Images/landing/Our Areas of Expertise/IT & Computer Science.png"
              title="IT & Computer Science"
              description="Coding help, software development, system design, and technical report writing tailored to university standards."
            />
            <ExpertiseCardVertical
              image="/Images/landing/Our Areas of Expertise/Business & Management.png"
              title="Business & Management"
              description="Professional support for reports, case studies, and research assignments with real-world context."
            />
            <ExpertiseCardVertical
              image="/Images/landing/Our Areas of Expertise/Finance & Accounting.png"
              title="Finance & Accounting"
              description="Step-by-step assistance for financial analysis, problem-solving, and accounting coursework."
            />
            <ExpertiseCardVertical
              image="/Images/landing/Our Areas of Expertise/Hospitality & Tourism.png"
              title="Hospitality & Tourism"
              description="Well-structured research papers, project reports, and essays aligned to global trends."
            />
            <ExpertiseCardVertical
              image="/Images/landing/Our Areas of Expertise/Nursing & Healthcare.png"
              title="Nursing & Healthcare"
              description="Accurate care plans, reflective journals, and academic reports built on real-life medical context."
            />
            <ExpertiseCardVertical
              image="/Images/landing/Our Areas of Expertise/Engineering & Technology.png"
              title="Engineering & Technology"
              description="Comprehensive guidance for technical reports, design documentation, and project submissions."
            />
          </div>
        </div>
      </div>

      {/* What Makes Us Different Section */}
      <div className="py-12 md:py-16 lg:py-20 transition-colors bg-white dark:bg-[#0A0F1E]">
        <div className="container mx-auto px-6 md:px-8 lg:px-12">
          {/* Section Header */}
          <div className="text-center mb-12 md:mb-16">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold">
              <span className="transition-colors text-[#111E2F] dark:text-white">
                What Makes Us{" "}
              </span>
              <span className="relative inline-block text-[#0E52AC]">
                Different
                <svg
                  className="absolute -bottom-1 left-0 w-full"
                  height="8"
                  viewBox="0 0 250 8"
                  fill="none"
                >
                  <path
                    d="M2 6C83 2 166 2 248 6"
                    stroke="#0E52AC"
                    strokeWidth="3"
                    strokeLinecap="round"
                  />
                </svg>
              </span>
            </h2>
          </div>

          {/* Content Grid */}
          <div className="grid lg:grid-cols-2 gap-8 lg:gap-16 items-center max-w-6xl mx-auto">
            {/* Left Side - Image */}
            <div className="flex justify-center items-center">
              <div className="relative w-full max-w-lg rounded-2xl overflow-hidden shadow-2xl">
                <Image
                  src="/Images/landing/What Makes Us Different.png"
                  alt="What Makes Us Different"
                  width={600}
                  height={500}
                  className="w-full h-auto object-cover"
                />
              </div>
            </div>

            {/* Right Side - Features List */}
            <div className="space-y-6 md:space-y-8">
              <DifferenceItem
                title="Global Student Support"
                description="Whether you study in Australia, the UK, Canada, or the UAE, we tailor our help to your university's format and grading style."
              />
              <DifferenceItem
                title="Plagiarism-Free Guidance"
                description="Every assignment is crafted uniquely to maintain academic integrity."
              />
              <DifferenceItem
                title="Fast Turnaround"
                description="We work around your schedule, urgent help available."
              />
              <DifferenceItem
                title="Affordable & Transparent"
                description="No hidden charges, no confusion, just clear, student-friendly pricing."
              />
              <DifferenceItem
                title="Expert Consultants"
                description="Our team includes qualified tutors, industry professionals, and academic writers who care about your success."
              />
            </div>
          </div>
        </div>
      </div>

      {/* Our Student Experiences Section */}
      <div className="py-12 md:py-16 lg:py-20 transition-colors bg-[#F8FBFF] dark:bg-[#1E293B]">
        <div className="container mx-auto px-6 md:px-8 lg:px-12">
          {/* Section Header */}
          <div className="text-center mb-12 md:mb-16">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold">
              <span className="transition-colors text-[#111E2F] dark:text-white">
                Our Student{" "}
              </span>
              <span className="relative inline-block text-[#0E52AC]">
                Experiences
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
            </h2>
          </div>

          {/* Testimonials Carousel */}
          <div className="relative max-w-7xl mx-auto">
            <div className="rounded-3xl p-8 md:p-12 lg:p-16 transition-colors bg-[#E8F2FD] dark:bg-[#0F172A]">
              <div className="grid md:grid-cols-3 gap-6 md:gap-8 mb-8">
                <TestimonialCard
                  quote="Assignment Ghar became my academic home I could chat, upload, and get help in one place - it felt personal."
                  name="Your Name"
                  location="Your Locations"
                  rating={5}
                />
                <TestimonialCard
                  quote="Their consultant explained my entire finance case study in plain language. I actually learned while completing my assignment."
                  name="Sara Lee"
                  location="UAE"
                  rating={5}
                />
                <TestimonialCard
                  quote="Affordable, responsive, and trustworthy - I couldn't ask for more."
                  name="Anonymous"
                  location="UK"
                  rating={5}
                />
              </div>

              {/* Carousel Dots */}
              <div className="flex justify-center items-center gap-2">
                <button className="w-2 h-2 rounded-full transition-all bg-[#E0EDFD] dark:bg-[#475569]"></button>
                <button
                  className="w-3 h-3 rounded-full transition-all bg-[#0E52AC]"
                  style={{
                    boxShadow: "0 0 0 2px #FFFFFF, 0 0 0 4px #0E52AC",
                  }}
                ></button>
                <button className="w-2 h-2 rounded-full transition-all bg-[#E0EDFD] dark:bg-[#475569]"></button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section - Start Your Journey */}
      <div className="py-12 md:py-16 lg:py-20 transition-colors bg-white dark:bg-[#0A0F1E]">
        <div className="container mx-auto px-6 md:px-8 lg:px-12">
          <div
            className="relative max-w-6xl mx-auto rounded-3xl overflow-hidden"
            style={{ backgroundColor: "#4A9FF5" }}
          >
            <div className="grid lg:grid-cols-2 items-center">
              {/* Left Content */}
              <div className="p-8 md:p-12 lg:p-16 text-white">
                <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4 md:mb-6 leading-tight">
                  Start Your Journey with Assignment Ghar
                </h2>
                <p className="text-sm md:text-base lg:text-lg mb-6 md:mb-8 opacity-95 leading-relaxed">
                  Your success deserves the right support. With instant chat,
                  secure payments, and expert academic guidance, we make
                  assignment help personal, transparent, and effective.
                </p>
                <div className="flex flex-col sm:flex-row gap-3 md:gap-4">
                  <Link href="/chat">
                    <button
                      className="w-full sm:w-auto px-6 md:px-8 py-3 md:py-3.5 rounded-lg font-semibold bg-white text-sm md:text-base transition-all hover:shadow-xl"
                      style={{ color: "#0E52AC" }}
                    >
                      Start Chat Now
                    </button>
                  </Link>
                  <Link href="/submit">
                    <button className="w-full sm:w-auto px-6 md:px-8 py-3 md:py-3.5 rounded-lg font-semibold text-white text-sm md:text-base border-2 border-white transition-all hover:bg-white/10">
                      Submit your Assignment
                    </button>
                  </Link>
                </div>
              </div>

              {/* Right Image */}
              <div className="relative h-full hidden lg:block overflow-hidden">
                <Image
                  src="/Images/landing/women_with_laptop.png"
                  alt="Professional woman with laptop"
                  width={600}
                  height={500}
                  className="absolute right-0 bottom-0 h-full w-auto object-cover object-left"
                  style={{ maxHeight: "500px" }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Background decorative elements */}
      <div className="fixed top-0 right-0 w-64 md:w-96 h-64 md:h-96 rounded-full blur-3xl opacity-5 pointer-events-none transition-colors bg-[#E0EDFD] dark:bg-[#1E40AF]"></div>
      <div className="fixed bottom-0 left-0 w-64 md:w-96 h-64 md:h-96 rounded-full blur-3xl opacity-5 pointer-events-none transition-colors bg-[#E0EDFD] dark:bg-[#1E40AF]"></div>
    </div>
  );
}

// Component Definitions

interface FeatureItemProps {
  text: string;
}

const FeatureItem: React.FC<FeatureItemProps> = ({ text }) => {
  return (
    <div className="flex gap-3 sm:gap-4 group animate-fadeIn">
      <div className="flex-shrink-0 mt-0.5 sm:mt-1">
        <div className="w-6 h-6 sm:w-7 sm:h-7 rounded-full flex items-center justify-center transition-all duration-300 group-hover:scale-110 bg-[#0E52AC] dark:bg-[#60A5FA] shadow-md group-hover:shadow-lg">
          <Check
            className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-white"
            strokeWidth={3}
          />
        </div>
      </div>
      <p className="text-sm sm:text-base lg:text-lg leading-relaxed transition-colors text-[#284366] dark:text-[#CBD5E1]">
        {text}
      </p>
    </div>
  );
};

interface FeatureCardProps {
  image: string;
  title: string;
  description: string;
}

const FeatureCard: React.FC<FeatureCardProps> = ({
  image,
  title,
  description,
}) => {
  return (
    <div className="group rounded-xl sm:rounded-2xl shadow-md overflow-hidden hover:shadow-2xl transition-all duration-500 bg-white dark:bg-[#1E293B] border border-transparent hover:border-[#0E52AC]/20 dark:hover:border-[#60A5FA]/20 transform hover:-translate-y-2">
      <div className="relative h-44 sm:h-48 md:h-56 overflow-hidden">
        <Image
          src={image}
          alt={title}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      </div>
      <div className="p-5 sm:p-6 md:p-8 text-center">
        <h3 className="text-base sm:text-lg md:text-xl font-bold mb-2 sm:mb-3 transition-colors text-[#111E2F] dark:text-white group-hover:text-[#0E52AC] dark:group-hover:text-[#60A5FA]">
          {title}
        </h3>
        <p className="text-sm sm:text-base leading-relaxed transition-colors text-[#284366] dark:text-[#CBD5E1]">
          {description}
        </p>
      </div>
    </div>
  );
};

interface ExpertiseCardProps {
  image: string;
  title: string;
  description: string;
}

const ExpertiseCardVertical: React.FC<ExpertiseCardProps> = ({
  image,
  title,
  description,
}) => {
  const getExpertiseLink = (title: string) => {
    const linkMap: { [key: string]: string } = {
      "IT & Computer Science": "/expertise/it-computer-science",
      "Business & Management": "/expertise/business-management",
      "Finance & Accounting": "/expertise/finance-accounting",
      "Hospitality & Tourism": "/expertise/hospitality-tourism",
      "Nursing & Healthcare": "/expertise/nursing-healthcare",
      "Engineering & Technology": "/expertise/engineering-technology",
    };
    return linkMap[title] || "/";
  };

  return (
    <div className="group">
      <div className="relative h-56 md:h-64 rounded-2xl overflow-hidden shadow-md group-hover:shadow-xl transition-all duration-300">
        <Image src={image} alt={title} fill className="object-cover" />
      </div>
      <div className="mt-4 md:mt-6">
        <h3 className="text-lg md:text-xl font-bold mb-2 md:mb-3 transition-colors text-[#111E2F] dark:text-white">
          {title}
        </h3>
        <p className="text-sm md:text-base mb-4 md:mb-5 transition-colors text-[#284366] dark:text-[#CBD5E1]">
          {description}
        </p>
        <Link href={getExpertiseLink(title)}>
          <button className="flex items-center gap-2 px-6 py-2.5 rounded-full font-semibold text-white text-sm transition-all hover:opacity-90 hover:gap-3 bg-[#111E2F] dark:bg-white dark:text-[#111E2F]">
            Learn More
            <svg
              width="16"
              height="16"
              viewBox="0 0 16 16"
              fill="none"
              className="transition-transform"
            >
              <path
                d="M6 3L11 8L6 13"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
        </Link>
      </div>
    </div>
  );
};

interface DifferenceItemProps {
  title: string;
  description: string;
}

const DifferenceItem: React.FC<DifferenceItemProps> = ({
  title,
  description,
}) => {
  return (
    <div className="flex gap-4">
      <div className="flex-shrink-0 mt-1">
        <div className="w-6 h-6 rounded-full flex items-center justify-center transition-colors bg-[#0E52AC]">
          <Check className="w-4 h-4 text-white" strokeWidth={3} />
        </div>
      </div>
      <div>
        <h3 className="text-lg md:text-xl font-bold mb-2 transition-colors text-[#111E2F] dark:text-white">
          {title}
        </h3>
        <p className="text-sm md:text-base transition-colors text-[#284366] dark:text-[#CBD5E1]">
          {description}
        </p>
      </div>
    </div>
  );
};

interface TestimonialCardProps {
  quote: string;
  name: string;
  location: string;
  rating: number;
}

const TestimonialCard: React.FC<TestimonialCardProps> = ({
  quote,
  name,
  location,
  rating,
}) => {
  return (
    <div className="rounded-2xl p-6 md:p-8 shadow-md hover:shadow-xl transition-all duration-300 bg-white dark:bg-[#1E293B]">
      <div className="mb-6">
        <svg
          width="32"
          height="32"
          viewBox="0 0 32 32"
          fill="none"
          className="mb-4"
        >
          <path
            d="M10 18C10 15.7909 8.20914 14 6 14V12C9.31371 12 12 9.31371 12 6H14C14 10.4183 10.4183 14 6 14C8.20914 14 10 15.7909 10 18ZM24 18C24 15.7909 22.2091 14 20 14V12C23.3137 12 26 9.31371 26 6H28C28 10.4183 24.4183 14 20 14C22.2091 14 24 15.7909 24 18Z"
            className="fill-[#111E2F] dark:fill-white"
          />
        </svg>
        <p className="text-sm md:text-base leading-relaxed transition-colors text-[#284366] dark:text-[#CBD5E1]">
          {quote}
        </p>
      </div>
      <div className="flex items-center justify-between">
        <div>
          <div className="font-semibold text-base md:text-lg transition-colors text-[#111E2F] dark:text-white">
            {name}
          </div>
          <div className="text-xs md:text-sm transition-colors text-[#284366] dark:text-[#94A3B8]">
            {location}
          </div>
        </div>
        <div className="flex gap-0.5">
          {Array.from({ length: rating }, (_, i) => (
            <span key={`star-${i}`} className="text-yellow-400 text-lg">
              ⭐
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};
