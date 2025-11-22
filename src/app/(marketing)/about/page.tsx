import Link from "next/link";
import type { Metadata } from "next";
import {
  GraduationCap,
  Heart,
  Shield,
  Clock,
  Award,
  Users,
  Globe,
  Target,
  Lightbulb,
  TrendingUp,
  CheckCircle,
  Star,
  MessageCircle,
  Zap,
  BookOpen,
} from "lucide-react";

export const metadata: Metadata = {
  title: "About Us | Assignment Ghar - Your Trusted Academic Partner",
  description:
    "Learn about Assignment Ghar's mission to help international students succeed. Trusted by thousands worldwide for quality assignment assistance, 24/7 support, and guaranteed results.",
  keywords: [
    "about assignment ghar",
    "our mission",
    "academic assistance",
    "student success",
    "assignment help company",
    "our story",
    "our values",
  ],
  openGraph: {
    title: "About Us | Assignment Ghar - Your Trusted Academic Partner",
    description:
      "Discover how Assignment Ghar helps students worldwide achieve academic excellence with expert guidance and support.",
    type: "website",
    url: "https://assignmentghar.com/about",
  },
};

export default function AboutPage() {
  const stats = [
    {
      icon: <Users className="w-6 h-6" />,
      value: "10,000+",
      label: "Happy Students",
    },
    {
      icon: <Award className="w-6 h-6" />,
      value: "98%",
      label: "Success Rate",
    },
    {
      icon: <Globe className="w-6 h-6" />,
      value: "50+",
      label: "Countries Served",
    },
    {
      icon: <Clock className="w-6 h-6" />,
      value: "24/7",
      label: "Support Available",
    },
  ];

  const values = [
    {
      icon: <GraduationCap className="w-8 h-8" />,
      title: "Student-First Approach",
      description:
        "Your success is our success. We prioritize your academic goals and work tirelessly to help you achieve the grades you deserve.",
    },
    {
      icon: <Shield className="w-8 h-8" />,
      title: "100% Confidentiality",
      description:
        "Your privacy matters. All conversations, files, and personal information are encrypted and kept strictly confidential.",
    },
    {
      icon: <Heart className="w-8 h-8" />,
      title: "Quality Commitment",
      description:
        "We deliver original, well-researched, and properly formatted assignments that meet your university's standards.",
    },
    {
      icon: <Clock className="w-8 h-8" />,
      title: "On-Time Delivery",
      description:
        "Deadlines are sacred. We ensure your assignments are delivered on time, every time, with buffer time for revisions.",
    },
    {
      icon: <Zap className="w-8 h-8" />,
      title: "Instant Communication",
      description:
        "Chat with us anytime, anywhere. Get instant quotes, progress updates, and direct communication with our experts.",
    },
    {
      icon: <Award className="w-8 h-8" />,
      title: "Academic Excellence",
      description:
        "Our team consists of subject matter experts with advanced degrees who understand academic standards and requirements.",
    },
  ];

  const journey = [
    {
      year: "2018",
      title: "The Beginning",
      description:
        "Founded by a group of university graduates who understood the challenges international students face.",
    },
    {
      year: "2020",
      title: "Global Expansion",
      description:
        "Expanded our services to over 30 countries, helping thousands of students succeed in their academic journey.",
    },
    {
      year: "2022",
      title: "Innovation & Growth",
      description:
        "Launched our real-time chat platform and QR payment system for seamless, secure transactions.",
    },
    {
      year: "2024",
      title: "Trusted Leader",
      description:
        "Became one of the most trusted assignment assistance platforms with 98% student satisfaction rate.",
    },
  ];

  const whyChooseUs = [
    {
      icon: <BookOpen className="w-6 h-6" />,
      title: "Expert Writers",
      description: "PhD and Masters-qualified subject specialists",
    },
    {
      icon: <CheckCircle className="w-6 h-6" />,
      title: "Plagiarism-Free",
      description: "100% original content with free plagiarism reports",
    },
    {
      icon: <Star className="w-6 h-6" />,
      title: "Quality Guaranteed",
      description: "Free unlimited revisions until you're satisfied",
    },
    {
      icon: <MessageCircle className="w-6 h-6" />,
      title: "24/7 Support",
      description: "Round-the-clock assistance via live chat",
    },
    {
      icon: <Shield className="w-6 h-6" />,
      title: "Secure Payments",
      description: "Safe and encrypted payment processing",
    },
    {
      icon: <TrendingUp className="w-6 h-6" />,
      title: "Grade Improvement",
      description: "Average grade improvement of 15-20%",
    },
  ];

  return (
    <div className="min-h-screen bg-white dark:bg-[#0A0F1E] transition-colors">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-[#F8FBFF] via-white to-[#E0EDFD] dark:from-[#0A0F1E] dark:via-[#1E293B] dark:to-[#0E52AC]/10 py-16 sm:py-20 md:py-24 lg:py-28">
        <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
        <div className="container mx-auto px-4 sm:px-6 md:px-8 lg:px-12 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-block mb-6">
              <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-[#0E52AC]/10 dark:bg-[#60A5FA]/10 flex items-center justify-center mx-auto mb-4">
                <Heart className="w-8 h-8 sm:w-10 sm:h-10 text-[#0E52AC] dark:text-[#60A5FA]" />
              </div>
            </div>

            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-6 sm:mb-8 text-[#111E2F] dark:text-white">
              Your Partner in{" "}
              <span className="relative inline-block text-[#0E52AC] dark:text-[#60A5FA]">
                Academic Success
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

            <p className="text-base sm:text-lg md:text-xl text-[#284366] dark:text-[#CBD5E1] leading-relaxed max-w-3xl mx-auto mb-8">
              We're more than just an assignment help service. We're your
              dedicated academic partner, committed to helping you achieve
              excellence in your educational journey.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/chat" className="w-full sm:w-auto">
                <button className="w-full min-h-[52px] px-8 py-3.5 rounded-xl font-semibold text-white text-base transition-all duration-300 hover:shadow-xl hover:scale-105 active:scale-95 bg-[#0E52AC] dark:bg-[#60A5FA] shadow-lg">
                  Start Free Consultation
                </button>
              </Link>
              <Link href="/services" className="w-full sm:w-auto">
                <button className="w-full min-h-[52px] px-8 py-3.5 rounded-xl font-semibold text-base border-2 transition-all duration-300 hover:shadow-xl hover:scale-105 active:scale-95 text-[#0E52AC] dark:text-[#60A5FA] border-[#0E52AC] dark:border-[#60A5FA] bg-white dark:bg-[#0A0F1E] hover:bg-[#F8FBFF] dark:hover:bg-[#1E293B]">
                  Our Services
                </button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-12 sm:py-16 bg-white dark:bg-[#0A0F1E]">
        <div className="container mx-auto px-4 sm:px-6 md:px-8 lg:px-12">
          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
              {stats.map((stat, index) => (
                <div
                  key={index}
                  className="text-center p-6 rounded-xl bg-[#F8FBFF] dark:bg-[#1E293B] border border-slate-200 dark:border-slate-800 hover:border-[#0E52AC] dark:hover:border-[#60A5FA] transition-all duration-300 hover:-translate-y-1"
                >
                  <div className="w-12 h-12 rounded-full bg-[#0E52AC]/10 dark:bg-[#60A5FA]/10 flex items-center justify-center mx-auto mb-4 text-[#0E52AC] dark:text-[#60A5FA]">
                    {stat.icon}
                  </div>
                  <div className="text-3xl sm:text-4xl font-bold text-[#0E52AC] dark:text-[#60A5FA] mb-2">
                    {stat.value}
                  </div>
                  <div className="text-sm sm:text-base text-[#284366] dark:text-[#CBD5E1] font-medium">
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Our Story */}
      <section className="py-16 sm:py-20 md:py-24 bg-[#F8FBFF] dark:bg-[#1E293B]">
        <div className="container mx-auto px-4 sm:px-6 md:px-8 lg:px-12">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12 sm:mb-16">
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 sm:mb-6 text-[#111E2F] dark:text-white">
                Our{" "}
                <span className="text-[#0E52AC] dark:text-[#60A5FA]">
                  Story
                </span>
              </h2>
              <p className="text-base sm:text-lg text-[#284366] dark:text-[#CBD5E1] max-w-3xl mx-auto leading-relaxed">
                Assignment Ghar was born from a simple observation:
                international students often struggle with assignments not
                because they lack intelligence, but because they face unique
                challenges—language barriers, unfamiliar academic formats,
                cultural adjustments, and overwhelming workloads.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
              <div className="p-6 sm:p-8 rounded-2xl bg-white dark:bg-[#0A0F1E] border border-slate-200 dark:border-slate-800">
                <Target className="w-10 h-10 sm:w-12 sm:h-12 text-[#0E52AC] dark:text-[#60A5FA] mb-4" />
                <h3 className="text-xl sm:text-2xl font-bold mb-4 text-[#111E2F] dark:text-white">
                  Our Mission
                </h3>
                <p className="text-base text-[#284366] dark:text-[#CBD5E1] leading-relaxed">
                  To empower students worldwide with expert academic guidance,
                  helping them overcome obstacles and achieve their full
                  potential. We believe every student deserves access to quality
                  support, regardless of their background or location.
                </p>
              </div>

              <div className="p-6 sm:p-8 rounded-2xl bg-white dark:bg-[#0A0F1E] border border-slate-200 dark:border-slate-800">
                <Lightbulb className="w-10 h-10 sm:w-12 sm:h-12 text-[#0E52AC] dark:text-[#60A5FA] mb-4" />
                <h3 className="text-xl sm:text-2xl font-bold mb-4 text-[#111E2F] dark:text-white">
                  Our Vision
                </h3>
                <p className="text-base text-[#284366] dark:text-[#CBD5E1] leading-relaxed">
                  To become the world's most trusted academic assistance
                  platform, known for our integrity, quality, and genuine
                  commitment to student success. We envision a world where no
                  student has to struggle alone with their academic challenges.
                </p>
              </div>
            </div>

            {/* Journey Timeline */}
            <div className="space-y-8">
              <h3 className="text-2xl sm:text-3xl font-bold text-center mb-8 text-[#111E2F] dark:text-white">
                Our Journey
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {journey.map((milestone, index) => (
                  <div
                    key={index}
                    className="relative p-6 rounded-xl bg-white dark:bg-[#0A0F1E] border-2 border-[#0E52AC]/20 dark:border-[#60A5FA]/20 hover:border-[#0E52AC] dark:hover:border-[#60A5FA] transition-all duration-300"
                  >
                    <div className="text-2xl font-bold text-[#0E52AC] dark:text-[#60A5FA] mb-2">
                      {milestone.year}
                    </div>
                    <h4 className="text-lg font-bold mb-2 text-[#111E2F] dark:text-white">
                      {milestone.title}
                    </h4>
                    <p className="text-sm text-[#284366] dark:text-[#CBD5E1]">
                      {milestone.description}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Core Values */}
      <section className="py-16 sm:py-20 md:py-24 bg-white dark:bg-[#0A0F1E]">
        <div className="container mx-auto px-4 sm:px-6 md:px-8 lg:px-12">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12 sm:mb-16">
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 sm:mb-6 text-[#111E2F] dark:text-white">
                Our Core{" "}
                <span className="text-[#0E52AC] dark:text-[#60A5FA]">
                  Values
                </span>
              </h2>
              <p className="text-base sm:text-lg text-[#284366] dark:text-[#CBD5E1] max-w-3xl mx-auto">
                These principles guide every decision we make and every service
                we provide.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
              {values.map((value, index) => (
                <div
                  key={index}
                  className="p-6 sm:p-8 rounded-2xl bg-[#F8FBFF] dark:bg-[#1E293B] border border-slate-200 dark:border-slate-800 hover:border-[#0E52AC] dark:hover:border-[#60A5FA] transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
                >
                  <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-[#0E52AC]/10 dark:bg-[#60A5FA]/10 flex items-center justify-center mb-4 sm:mb-6 text-[#0E52AC] dark:text-[#60A5FA]">
                    {value.icon}
                  </div>
                  <h3 className="text-xl sm:text-2xl font-bold mb-3 sm:mb-4 text-[#111E2F] dark:text-white">
                    {value.title}
                  </h3>
                  <p className="text-base text-[#284366] dark:text-[#CBD5E1] leading-relaxed">
                    {value.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-16 sm:py-20 md:py-24 bg-[#F8FBFF] dark:bg-[#1E293B]">
        <div className="container mx-auto px-4 sm:px-6 md:px-8 lg:px-12">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12 sm:mb-16">
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 sm:mb-6 text-[#111E2F] dark:text-white">
                Why Students{" "}
                <span className="text-[#0E52AC] dark:text-[#60A5FA]">
                  Choose Us
                </span>
              </h2>
              <p className="text-base sm:text-lg text-[#284366] dark:text-[#CBD5E1] max-w-3xl mx-auto">
                Join thousands of successful students who trust us with their
                academic goals.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {whyChooseUs.map((item, index) => (
                <div
                  key={index}
                  className="p-6 rounded-xl bg-white dark:bg-[#0A0F1E] border border-slate-200 dark:border-slate-800 hover:border-[#0E52AC] dark:hover:border-[#60A5FA] transition-all duration-300"
                >
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0 w-10 h-10 rounded-full bg-[#0E52AC]/10 dark:bg-[#60A5FA]/10 flex items-center justify-center text-[#0E52AC] dark:text-[#60A5FA]">
                      {item.icon}
                    </div>
                    <div>
                      <h3 className="text-lg font-bold mb-2 text-[#111E2F] dark:text-white">
                        {item.title}
                      </h3>
                      <p className="text-sm text-[#284366] dark:text-[#CBD5E1]">
                        {item.description}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 sm:py-20 md:py-24 bg-gradient-to-br from-[#0E52AC] to-[#0A3D7A] dark:from-[#60A5FA] dark:to-[#0E52AC] text-white">
        <div className="container mx-auto px-4 sm:px-6 md:px-8 lg:px-12">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 sm:mb-6">
              Ready to Start Your Success Story?
            </h2>
            <p className="text-base sm:text-lg md:text-xl mb-8 sm:mb-10 text-white/90 leading-relaxed">
              Join 10,000+ students who have improved their grades with
              Assignment Ghar. Get instant support, expert guidance, and
              guaranteed results.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/chat" className="w-full sm:w-auto">
                <button className="w-full min-h-[52px] px-8 py-3.5 rounded-xl font-semibold text-base transition-all duration-300 hover:shadow-2xl hover:scale-105 active:scale-95 bg-white text-[#0E52AC] dark:text-[#0E52AC] hover:bg-[#F8FBFF]">
                  Get Free Consultation
                </button>
              </Link>
              <Link href="/testimonials" className="w-full sm:w-auto">
                <button className="w-full min-h-[52px] px-8 py-3.5 rounded-xl font-semibold text-base border-2 border-white transition-all duration-300 hover:shadow-2xl hover:scale-105 active:scale-95 text-white hover:bg-white/10">
                  Read Success Stories
                </button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
