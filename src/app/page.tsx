"use client";

import Link from "next/link";
import Image from "next/image";
import { Check } from "lucide-react";
import { useTheme } from "@/hooks/use-theme";

export default function Home() {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  const themeColors = {
    primary: "#0E52AC",
    text1: isDark ? "#FFFFFF" : "#111E2F",
    text2: isDark ? "#CBD5E1" : "#284366",
    text3: "#94A3B8",
    bg1: isDark ? "#0A0F1E" : "#FFFFFF",
    bg2: isDark ? "#1E293B" : "#F8FBFF",
    cardBg: isDark ? "#1E293B" : "#FFFFFF",
    border: isDark ? "#475569" : "#E0EDFD",
  };

  return (
    <div
      className="min-h-screen relative transition-colors"
      style={{ backgroundColor: themeColors.bg1 }}
    >
      {/* Hero Section */}
      <div className="container mx-auto px-6 md:px-8 lg:px-12 py-8 md:py-12 lg:py-16">
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
          {/* Left Content */}
          <div className="space-y-6 md:space-y-8">
            {/* Brand Name */}
            <div
              className="text-sm md:text-base font-medium transition-colors"
              style={{ color: themeColors.text2 }}
            >
              Assignment Ghar
            </div>

            {/* Main Heading */}
            <div className="space-y-2">
              <h1
                className="text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold leading-tight transition-colors"
                style={{ color: themeColors.text1 }}
              >
                A{" "}
                <span
                  style={{ color: themeColors.primary }}
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
                      stroke={themeColors.primary}
                      strokeWidth="3"
                      strokeLinecap="round"
                    />
                  </svg>
                </span>
              </h1>
              <h1
                className="text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold leading-tight transition-colors"
                style={{ color: themeColors.text1 }}
              >
                for your Academic
              </h1>
              <h1 className="text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold leading-tight">
                <span
                  style={{ color: themeColors.primary }}
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
                      stroke={themeColors.primary}
                      strokeWidth="3"
                      strokeLinecap="round"
                    />
                  </svg>
                </span>
              </h1>
            </div>

            {/* Features List */}
            <div className="space-y-4 md:space-y-5">
              <FeatureItem
                text="Get quick and reliable help with your college or university assignments"
                themeColors={themeColors}
              />

              <FeatureItem
                text="No matter where you study or how close your deadline is, we connect you directly with expert consultants who understand your subject and your struggles."
                themeColors={themeColors}
              />

              <FeatureItem
                text="Chat in real time, share your files securely, and receive personalized guidance that helps you complete your assignments with confidence and quality."
                themeColors={themeColors}
              />
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 md:gap-4 pt-2 md:pt-4">
              <Link href="/chat">
                <button
                  className="w-full sm:w-auto px-6 md:px-8 py-3 md:py-3.5 rounded-lg font-semibold text-white text-sm md:text-base transition-all hover:opacity-90 hover:shadow-lg"
                  style={{ backgroundColor: themeColors.primary }}
                >
                  Start Chat Now
                </button>
              </Link>
              <Link href="/submit">
                <button
                  className="w-full sm:w-auto px-6 md:px-8 py-3 md:py-3.5 rounded-lg font-semibold text-sm md:text-base border-2 transition-all hover:shadow-lg"
                  style={{
                    color: themeColors.primary,
                    borderColor: themeColors.primary,
                    backgroundColor: themeColors.bg1,
                  }}
                >
                  Submit your Assignment
                </button>
              </Link>
            </div>
          </div>

          {/* Right Image */}
          <div className="relative order-first lg:order-last">
            <div className="relative rounded-2xl overflow-hidden shadow-2xl h-[400px] md:h-[500px] lg:h-[600px]">
              <Image
                src="/Images/landing/hero.jpg"
                alt="Student studying with laptop"
                fill
                className="object-cover"
                priority
              />
              {/* Overlay gradient for better text visibility on mobile */}
              <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/10 lg:hidden"></div>
            </div>

            {/* Decorative elements */}
            <div
              className="hidden lg:block absolute -top-4 -right-4 w-24 h-24 rounded-full opacity-20 transition-colors"
              style={{ backgroundColor: themeColors.primary }}
            ></div>
            <div
              className="hidden lg:block absolute -bottom-4 -left-4 w-32 h-32 rounded-full opacity-10 transition-colors"
              style={{ backgroundColor: themeColors.primary }}
            ></div>
          </div>
        </div>
      </div>

      {/* Why Students Trust Us Section */}
      <div
        className="py-12 md:py-16 lg:py-20 transition-colors"
        style={{ backgroundColor: themeColors.bg2 }}
      >
        <div className="container mx-auto px-6 md:px-8 lg:px-12">
          {/* Section Header */}
          <div className="text-center mb-8 md:mb-12">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4 md:mb-6">
              <span
                style={{ color: themeColors.text1 }}
                className="transition-colors"
              >
                Why Students{" "}
              </span>
              <span
                style={{ color: themeColors.primary }}
                className="relative inline-block"
              >
                Trust Us
                <svg
                  className="absolute -bottom-1 left-0 w-full"
                  height="8"
                  viewBox="0 0 200 8"
                  fill="none"
                >
                  <path
                    d="M2 6C66 2 133 2 198 6"
                    stroke={themeColors.primary}
                    strokeWidth="3"
                    strokeLinecap="round"
                  />
                </svg>
              </span>
            </h2>
            <p
              className="text-sm md:text-base lg:text-lg max-w-4xl mx-auto transition-colors"
              style={{ color: themeColors.text2 }}
            >
              We built{" "}
              <span
                style={{ color: themeColors.primary }}
                className="font-semibold"
              >
                Assignment Ghar
              </span>{" "}
              for students who deserve stress-free academic support, not another
              automated service.
              <br className="hidden sm:block" />
              Our system is designed for real connection and real results.
            </p>
          </div>

          {/* Features Grid */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-8 md:mb-12">
            <FeatureCard
              image="/Images/landing/1.png"
              title="Chat System"
              description="Real time chat between student and admin"
              themeColors={themeColors}
            />
            <FeatureCard
              image="/Images/landing/2.png"
              title="File Sharing"
              description="File and image sharing inside chat window"
              themeColors={themeColors}
            />
            <FeatureCard
              image="/Images/landing/3.png"
              title="QR Payment"
              description="QR payment visible in chat for easy scan-and-pay"
              themeColors={themeColors}
            />
            <FeatureCard
              image="/Images/landing/4.png"
              title="Consultancy Videos"
              description="Free consultancy videos for students"
              themeColors={themeColors}
            />
          </div>

          {/* Testimonial Card */}
          <div className="max-w-5xl mx-auto">
            <div
              className="rounded-2xl shadow-lg p-6 md:p-8 lg:p-10 transition-colors"
              style={{ backgroundColor: themeColors.cardBg }}
            >
              <div className="flex flex-col lg:flex-row gap-6 lg:gap-8 items-start lg:items-center">
                <div className="flex-1">
                  <p
                    className="text-base md:text-lg mb-4 transition-colors"
                    style={{ color: themeColors.text2 }}
                  >
                    &quot;I was struggling with my IT assignment while abroad.
                    Assignment Ghar helped me understand the topic, not just
                    finish it.&quot;
                  </p>
                  <div className="flex items-center gap-3">
                    <span
                      className="text-sm transition-colors"
                      style={{ color: themeColors.text3 }}
                    >
                      Student from Canada
                    </span>
                    <div
                      className="flex items-center gap-1 px-3 py-1 rounded-full transition-colors"
                      style={{
                        backgroundColor: isDark ? "#422006" : "#FEF3C7",
                      }}
                    >
                      <span className="text-sm">⭐</span>
                      <span
                        className="text-sm font-semibold transition-colors"
                        style={{ color: isDark ? "#FCD34D" : "#92400E" }}
                      >
                        5.0
                      </span>
                    </div>
                  </div>
                </div>
                <div
                  className="flex items-center gap-4 lg:pl-8"
                  style={{
                    borderLeft: isDark
                      ? "1px solid #475569"
                      : "1px solid #E5E7EB",
                  }}
                >
                  <div
                    className="w-12 h-12 rounded-full flex items-center justify-center transition-colors"
                    style={{ backgroundColor: isDark ? "#064E3B" : "#D1FAE5" }}
                  >
                    <svg
                      className="w-7 h-7 transition-colors"
                      style={{ color: isDark ? "#10B981" : "#059669" }}
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
                    <div
                      className="font-semibold text-base md:text-lg transition-colors"
                      style={{ color: themeColors.text1 }}
                    >
                      Trusted & Transparent
                    </div>
                    <div
                      className="text-sm transition-colors"
                      style={{ color: themeColors.text3 }}
                    >
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
      <div
        className="py-12 md:py-16 lg:py-20 transition-colors"
        style={{ backgroundColor: themeColors.bg2 }}
      >
        <div className="container mx-auto px-6 md:px-8 lg:px-12">
          {/* Section Header */}
          <div className="text-center mb-8 md:mb-12">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4 md:mb-6">
              <span
                style={{ color: themeColors.text1 }}
                className="transition-colors"
              >
                Our Areas of{" "}
              </span>
              <span
                style={{ color: themeColors.primary }}
                className="relative inline-block"
              >
                Expertise
                <svg
                  className="absolute -bottom-1 left-0 w-full"
                  height="8"
                  viewBox="0 0 250 8"
                  fill="none"
                >
                  <path
                    d="M2 6C83 2 166 2 248 6"
                    stroke={themeColors.primary}
                    strokeWidth="3"
                    strokeLinecap="round"
                  />
                </svg>
              </span>
            </h2>
            <p
              className="text-sm md:text-base lg:text-lg max-w-5xl mx-auto leading-relaxed transition-colors"
              style={{ color: themeColors.text2 }}
            >
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
              image="https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=400&h=300&fit=crop"
              title="IT & Computer Science"
              description="Coding help, software development, system design, and technical report writing tailored to university standards."
              themeColors={themeColors}
            />
            <ExpertiseCardVertical
              image="https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400&h=300&fit=crop"
              title="Business & Management"
              description="Professional support for reports, case studies, and research assignments with real-world context."
              themeColors={themeColors}
            />
            <ExpertiseCardVertical
              image="https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=400&h=300&fit=crop"
              title="Finance & Accounting"
              description="Step-by-step assistance for financial analysis, problem-solving, and accounting coursework."
              themeColors={themeColors}
            />
            <ExpertiseCardVertical
              image="https://images.unsplash.com/photo-1503220317375-aaad61436b1b?w=400&h=300&fit=crop"
              title="Hospitality & Tourism"
              description="Well-structured research papers, project reports, and essays aligned to global trends."
              themeColors={themeColors}
            />
            <ExpertiseCardVertical
              image="https://images.unsplash.com/photo-1584820927498-cfe5211fd8bf?w=400&h=300&fit=crop"
              title="Nursing & Healthcare"
              description="Accurate care plans, reflective journals, and academic reports built on real-life medical context."
              themeColors={themeColors}
            />
            <ExpertiseCardVertical
              image="https://images.unsplash.com/photo-1581094271901-8022df4466f9?w=400&h=300&fit=crop"
              title="Engineering & Technology"
              description="Comprehensive guidance for technical reports, design documentation, and project submissions."
              themeColors={themeColors}
            />
          </div>
        </div>
      </div>

      {/* What Makes Us Different Section */}
      <div
        className="py-12 md:py-16 lg:py-20 transition-colors"
        style={{ backgroundColor: themeColors.bg1 }}
      >
        <div className="container mx-auto px-6 md:px-8 lg:px-12">
          {/* Section Header */}
          <div className="text-center mb-12 md:mb-16">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold">
              <span
                style={{ color: themeColors.text1 }}
                className="transition-colors"
              >
                What Makes Us{" "}
              </span>
              <span
                style={{ color: themeColors.primary }}
                className="relative inline-block"
              >
                Different
                <svg
                  className="absolute -bottom-1 left-0 w-full"
                  height="8"
                  viewBox="0 0 250 8"
                  fill="none"
                >
                  <path
                    d="M2 6C83 2 166 2 248 6"
                    stroke={themeColors.primary}
                    strokeWidth="3"
                    strokeLinecap="round"
                  />
                </svg>
              </span>
            </h2>
          </div>

          {/* Content Grid */}
          <div className="grid lg:grid-cols-2 gap-8 lg:gap-16 items-center max-w-6xl mx-auto">
            {/* Left Side - Decorative Pattern */}
            <div className="hidden lg:flex justify-center items-center">
              <div className="relative w-full max-w-md">
                {/* Dot Pattern */}
                <div className="grid grid-cols-6 gap-4">
                  {Array.from({ length: 36 }, (_, i) => (
                    <div
                      key={`dot-${i}`}
                      className="rounded-full transition-all duration-300 hover:scale-150"
                      style={{
                        width:
                          i % 6 >= 2 &&
                          i % 6 <= 3 &&
                          Math.floor(i / 6) >= 2 &&
                          Math.floor(i / 6) <= 3
                            ? "20px"
                            : "12px",
                        height:
                          i % 6 >= 2 &&
                          i % 6 <= 3 &&
                          Math.floor(i / 6) >= 2 &&
                          Math.floor(i / 6) <= 3
                            ? "20px"
                            : "12px",
                        backgroundColor:
                          i % 6 >= 2 &&
                          i % 6 <= 3 &&
                          Math.floor(i / 6) >= 2 &&
                          Math.floor(i / 6) <= 3
                            ? themeColors.primary
                            : themeColors.border,
                        opacity:
                          i % 6 >= 2 &&
                          i % 6 <= 3 &&
                          Math.floor(i / 6) >= 2 &&
                          Math.floor(i / 6) <= 3
                            ? 1
                            : 0.5,
                      }}
                    ></div>
                  ))}
                </div>
                {/* Central Card */}
                <div
                  className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 rounded-2xl shadow-2xl p-8"
                  style={{
                    backgroundColor: themeColors.primary,
                    width: "200px",
                    height: "140px",
                  }}
                ></div>
              </div>
            </div>

            {/* Right Side - Features List */}
            <div className="space-y-6 md:space-y-8">
              <DifferenceItem
                title="Global Student Support"
                description="Whether you study in Australia, the UK, Canada, or the UAE, we tailor our help to your university's format and grading style."
                themeColors={themeColors}
              />
              <DifferenceItem
                title="Plagiarism-Free Guidance"
                description="Every assignment is crafted uniquely to maintain academic integrity."
                themeColors={themeColors}
              />
              <DifferenceItem
                title="Fast Turnaround"
                description="We work around your schedule, urgent help available."
                themeColors={themeColors}
              />
              <DifferenceItem
                title="Affordable & Transparent"
                description="No hidden charges, no confusion, just clear, student-friendly pricing."
                themeColors={themeColors}
              />
              <DifferenceItem
                title="Expert Consultants"
                description="Our team includes qualified tutors, industry professionals, and academic writers who care about your success."
                themeColors={themeColors}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Our Student Experiences Section */}
      <div
        className="py-12 md:py-16 lg:py-20 transition-colors"
        style={{ backgroundColor: themeColors.bg2 }}
      >
        <div className="container mx-auto px-6 md:px-8 lg:px-12">
          {/* Section Header */}
          <div className="text-center mb-12 md:mb-16">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold">
              <span
                style={{ color: themeColors.text1 }}
                className="transition-colors"
              >
                Our Student{" "}
              </span>
              <span
                style={{ color: themeColors.primary }}
                className="relative inline-block"
              >
                Experiences
                <svg
                  className="absolute -bottom-1 left-0 w-full"
                  height="8"
                  viewBox="0 0 300 8"
                  fill="none"
                >
                  <path
                    d="M2 6C100 2 200 2 298 6"
                    stroke={themeColors.primary}
                    strokeWidth="3"
                    strokeLinecap="round"
                  />
                </svg>
              </span>
            </h2>
          </div>

          {/* Testimonials Carousel */}
          <div className="relative max-w-7xl mx-auto">
            <div
              className="rounded-3xl p-8 md:p-12 lg:p-16 transition-colors"
              style={{ backgroundColor: isDark ? "#0F172A" : "#E8F2FD" }}
            >
              <div className="grid md:grid-cols-3 gap-6 md:gap-8 mb-8">
                <TestimonialCard
                  quote="Assignment Ghar became my academic home I could chat, upload, and get help in one place - it felt personal."
                  name="John Doe"
                  location="Australia"
                  rating={5}
                  themeColors={themeColors}
                />
                <TestimonialCard
                  quote="Their consultant explained my entire finance case study in plain language. I actually learned while completing my assignment."
                  name="Sara Lee"
                  location="UAE"
                  rating={5}
                  themeColors={themeColors}
                />
                <TestimonialCard
                  quote="Affordable, responsive, and trustworthy - I couldn't ask for more."
                  name="Anonymous"
                  location="UK"
                  rating={5}
                  themeColors={themeColors}
                />
              </div>

              {/* Carousel Dots */}
              <div className="flex justify-center items-center gap-2">
                <button
                  className="w-2 h-2 rounded-full transition-all"
                  style={{ backgroundColor: themeColors.border }}
                ></button>
                <button
                  className="w-3 h-3 rounded-full transition-all"
                  style={{
                    backgroundColor: themeColors.primary,
                    boxShadow: `0 0 0 2px ${themeColors.bg1}, 0 0 0 4px ${themeColors.primary}`,
                  }}
                ></button>
                <button
                  className="w-2 h-2 rounded-full transition-all"
                  style={{ backgroundColor: themeColors.border }}
                ></button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section - Start Your Journey */}
      <div
        className="py-12 md:py-16 lg:py-20 transition-colors"
        style={{ backgroundColor: themeColors.bg1 }}
      >
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
      <div
        className="fixed top-0 right-0 w-64 md:w-96 h-64 md:h-96 rounded-full blur-3xl opacity-5 pointer-events-none transition-colors"
        style={{ backgroundColor: isDark ? "#1E40AF" : "#E0EDFD" }}
      ></div>
      <div
        className="fixed bottom-0 left-0 w-64 md:w-96 h-64 md:h-96 rounded-full blur-3xl opacity-5 pointer-events-none transition-colors"
        style={{ backgroundColor: isDark ? "#1E40AF" : "#E0EDFD" }}
      ></div>
    </div>
  );
}

// Component Definitions

interface FeatureItemProps {
  text: string;
  themeColors: any;
}

const FeatureItem: React.FC<FeatureItemProps> = ({ text, themeColors }) => {
  return (
    <div className="flex gap-3 md:gap-4">
      <div className="flex-shrink-0 mt-1">
        <div
          className="w-5 h-5 md:w-6 md:h-6 rounded-full flex items-center justify-center transition-colors"
          style={{ backgroundColor: themeColors.primary }}
        >
          <Check className="w-3 h-3 md:w-4 md:h-4 text-white" strokeWidth={3} />
        </div>
      </div>
      <p
        className="text-sm md:text-base lg:text-lg transition-colors"
        style={{ color: themeColors.text2 }}
      >
        {text}
      </p>
    </div>
  );
};

interface FeatureCardProps {
  image: string;
  title: string;
  description: string;
  themeColors: any;
}

const FeatureCard: React.FC<FeatureCardProps> = ({
  image,
  title,
  description,
  themeColors,
}) => {
  return (
    <div
      className="rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-all duration-300"
      style={{ backgroundColor: themeColors.cardBg }}
    >
      <div className="relative h-48 md:h-56 overflow-hidden">
        <Image src={image} alt={title} fill className="object-cover" />
      </div>
      <div className="p-6 md:p-8 text-center">
        <h3
          className="text-lg md:text-xl font-bold mb-2 transition-colors"
          style={{ color: themeColors.text1 }}
        >
          {title}
        </h3>
        <p
          className="text-sm md:text-base transition-colors"
          style={{ color: themeColors.text2 }}
        >
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
  themeColors: any;
}

const ExpertiseCardVertical: React.FC<ExpertiseCardProps> = ({
  image,
  title,
  description,
  themeColors,
}) => {
  return (
    <div className="group">
      <div className="relative h-56 md:h-64 rounded-2xl overflow-hidden shadow-md group-hover:shadow-xl transition-all duration-300">
        <Image src={image} alt={title} fill className="object-cover" />
      </div>
      <div className="mt-4 md:mt-6">
        <h3
          className="text-lg md:text-xl font-bold mb-2 md:mb-3 transition-colors"
          style={{ color: themeColors.text1 }}
        >
          {title}
        </h3>
        <p
          className="text-sm md:text-base mb-4 md:mb-5 transition-colors"
          style={{ color: themeColors.text2 }}
        >
          {description}
        </p>
        <button
          className="flex items-center gap-2 px-6 py-2.5 rounded-full font-semibold text-white text-sm transition-all hover:opacity-90 hover:gap-3"
          style={{ backgroundColor: themeColors.text1 }}
        >
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
      </div>
    </div>
  );
};

interface DifferenceItemProps {
  title: string;
  description: string;
  themeColors: any;
}

const DifferenceItem: React.FC<DifferenceItemProps> = ({
  title,
  description,
  themeColors,
}) => {
  return (
    <div className="flex gap-4">
      <div className="flex-shrink-0 mt-1">
        <div
          className="w-6 h-6 rounded-full flex items-center justify-center transition-colors"
          style={{ backgroundColor: themeColors.primary }}
        >
          <Check className="w-4 h-4 text-white" strokeWidth={3} />
        </div>
      </div>
      <div>
        <h3
          className="text-lg md:text-xl font-bold mb-2 transition-colors"
          style={{ color: themeColors.text1 }}
        >
          {title}
        </h3>
        <p
          className="text-sm md:text-base transition-colors"
          style={{ color: themeColors.text2 }}
        >
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
  themeColors: any;
}

const TestimonialCard: React.FC<TestimonialCardProps> = ({
  quote,
  name,
  location,
  rating,
  themeColors,
}) => {
  return (
    <div
      className="rounded-2xl p-6 md:p-8 shadow-md hover:shadow-xl transition-all duration-300"
      style={{ backgroundColor: themeColors.cardBg }}
    >
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
            fill={themeColors.text1}
          />
        </svg>
        <p
          className="text-sm md:text-base leading-relaxed transition-colors"
          style={{ color: themeColors.text2 }}
        >
          {quote}
        </p>
      </div>
      <div className="flex items-center justify-between">
        <div>
          <div
            className="font-semibold text-base md:text-lg transition-colors"
            style={{ color: themeColors.text1 }}
          >
            {name}
          </div>
          <div
            className="text-xs md:text-sm transition-colors"
            style={{ color: themeColors.text3 }}
          >
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
