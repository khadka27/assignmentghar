"use client";

import Link from "next/link";
import {
  Check,
  Clock,
  Shield,
  MessageCircle,
  DollarSign,
  FileText,
  Upload,
  Download,
  CreditCard,
  BookOpen,
  Users,
  Award,
} from "lucide-react";

export default function ServicesPage() {
  const features = [
    {
      icon: <Clock className="w-6 h-6" />,
      title: "Fast Turnaround",
      description: "Get your assignment done within the deadline you choose.",
    },
    {
      icon: <Award className="w-6 h-6" />,
      title: "Experienced Academic Helpers",
      description:
        "Our team understands popular UK courses like Hospitality, IT, Accounting, Event Management, and Cookery.",
    },
    {
      icon: <Shield className="w-6 h-6" />,
      title: "Confidential & Secure",
      description: "Your personal details and files are never shared.",
    },
    {
      icon: <MessageCircle className="w-6 h-6" />,
      title: "Direct Chat Support",
      description: "No bots — talk directly with a human admin anytime.",
    },
    {
      icon: <DollarSign className="w-6 h-6" />,
      title: "Fair Pricing",
      description: "Transparent cost before you pay. No surprise charges.",
    },
  ];

  const steps = [
    {
      number: "01",
      icon: <MessageCircle className="w-8 h-8" />,
      title: "Chat with Our Admin",
      description:
        "Get an instant response from our support team. Share your course details, topic, and deadline.",
    },
    {
      number: "02",
      icon: <Upload className="w-8 h-8" />,
      title: "Share Your Assignment",
      description:
        "Upload your files or instructions directly. We'll confirm details before starting.",
    },
    {
      number: "03",
      icon: <FileText className="w-8 h-8" />,
      title: "Get Your Work Done",
      description:
        "Our team prepares a tailored, plagiarism-free assignment written for your academic level.",
    },
    {
      number: "04",
      icon: <CreditCard className="w-8 h-8" />,
      title: "Pay Securely & Receive File",
      description:
        "Once your assignment is ready, review it and pay through our trusted, secure payment gateway.",
    },
  ];

  const subjects = [
    "Hospitality Management",
    "Hotel Management",
    "Cookery & Culinary Arts",
    "Business & Event Management",
    "Information Technology",
    "Accounting & Finance",
    "General Coursework & Reflective Essays",
  ];

  const quality = [
    {
      icon: <Check className="w-5 h-5" />,
      title: "100% Original",
      description: "Checked with plagiarism tools before delivery.",
    },
    {
      icon: <Check className="w-5 h-5" />,
      title: "Custom-Written",
      description: "Tailored to your topic, requirements, and course level.",
    },
    {
      icon: <Check className="w-5 h-5" />,
      title: "Reference-Ready",
      description: "Properly cited in APA, Harvard, or MLA format.",
    },
  ];

  const faqs = [
    {
      question: "Is this service safe and private?",
      answer:
        "Absolutely. We use encrypted systems and keep all communications confidential.",
    },
    {
      question: "Can I talk to someone before paying?",
      answer:
        "Yes! You can chat with our admin anytime before confirming your order.",
    },
    {
      question: "How fast can I get my assignment?",
      answer:
        "Turnaround times depend on your deadline — from 12 hours to several days. We always match your urgency.",
    },
    {
      question: "What payment options are available?",
      answer:
        "We support major online payment methods. You'll receive an invoice before processing.",
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
                Professional Academic Support
              </span>
            </div>

            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-6 sm:mb-8 text-[#111E2F] dark:text-white">
              Professional Assignment Help for{" "}
              <span className="relative inline-block text-[#0E52AC] dark:text-[#60A5FA]">
                International Students
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

            <p className="text-base sm:text-lg md:text-xl text-[#284366] dark:text-[#CBD5E1] leading-relaxed mb-8 sm:mb-10 max-w-3xl mx-auto">
              Struggling to manage coursework deadlines, part-time jobs, and
              academic writing all at once? At Assignment Ghar, we specialize in
              helping international students complete their assignments on time
              with precision, originality, and total confidentiality.
            </p>

            <p className="text-sm sm:text-base md:text-lg text-[#284366] dark:text-[#CBD5E1] leading-relaxed mb-10 sm:mb-12">
              Our platform lets you chat directly with an admin, share your
              assignment files, receive the completed work, and pay securely —
              all in one streamlined system.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/chat" className="w-full sm:w-auto">
                <button className="w-full min-h-[52px] px-8 py-3.5 rounded-xl font-semibold text-white text-base transition-all duration-300 hover:shadow-xl hover:scale-105 active:scale-95 bg-[#0E52AC] dark:bg-[#60A5FA] shadow-lg">
                  Start Chat Now
                </button>
              </Link>
              <Link href="/pricing" className="w-full sm:w-auto">
                <button className="w-full min-h-[52px] px-8 py-3.5 rounded-xl font-semibold text-base border-2 transition-all duration-300 hover:shadow-xl hover:scale-105 active:scale-95 text-[#0E52AC] dark:text-[#60A5FA] border-[#0E52AC] dark:border-[#60A5FA] bg-white dark:bg-[#0A0F1E] hover:bg-[#F8FBFF] dark:hover:bg-[#1E293B]">
                  View Pricing
                </button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section className="py-16 sm:py-20 md:py-24 lg:py-28">
        <div className="container mx-auto px-4 sm:px-6 md:px-8 lg:px-12">
          <div className="max-w-3xl mx-auto text-center mb-12 sm:mb-16">
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-4 sm:mb-6 text-[#111E2F] dark:text-white">
              Why Choose{" "}
              <span className="text-[#0E52AC] dark:text-[#60A5FA]">
                Assignment Ghar
              </span>{" "}
              for Your Assignments?
            </h2>
            <p className="text-base sm:text-lg text-[#284366] dark:text-[#CBD5E1] leading-relaxed">
              At Assignment Ghar, we understand the real challenges faced by
              students abroad — tight schedules, cultural adjustment, and
              complex coursework requirements. That's why our service is
              designed for simplicity, speed, and trust.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 mb-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className="group p-6 sm:p-8 rounded-2xl bg-white dark:bg-[#1E293B] border border-slate-200 dark:border-slate-800 hover:border-[#0E52AC]/30 dark:hover:border-[#60A5FA]/30 transition-all duration-300 hover:shadow-xl hover:-translate-y-1"
              >
                <div className="w-14 h-14 rounded-xl bg-[#0E52AC]/10 dark:bg-[#60A5FA]/10 flex items-center justify-center mb-5 text-[#0E52AC] dark:text-[#60A5FA] group-hover:scale-110 transition-transform duration-300">
                  {feature.icon}
                </div>
                <h3 className="text-lg sm:text-xl font-bold mb-3 text-[#111E2F] dark:text-white">
                  {feature.title}
                </h3>
                <p className="text-sm sm:text-base text-[#284366] dark:text-[#CBD5E1] leading-relaxed">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>

          <div className="text-center">
            <p className="text-lg sm:text-xl font-semibold text-[#111E2F] dark:text-white">
              We don't just deliver documents — we deliver{" "}
              <span className="text-[#0E52AC] dark:text-[#60A5FA]">
                peace of mind
              </span>
              .
            </p>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-16 sm:py-20 md:py-24 lg:py-28 bg-[#F8FBFF] dark:bg-[#1E293B]">
        <div className="container mx-auto px-4 sm:px-6 md:px-8 lg:px-12">
          <div className="max-w-3xl mx-auto text-center mb-12 sm:mb-16">
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-4 sm:mb-6 text-[#111E2F] dark:text-white">
              How the Assignment Ghar Process{" "}
              <span className="text-[#0E52AC] dark:text-[#60A5FA]">Works</span>
            </h2>
            <p className="text-base sm:text-lg text-[#284366] dark:text-[#CBD5E1] leading-relaxed">
              Getting your assignment help is simple and quick.
            </p>
          </div>

          <div className="max-w-5xl mx-auto">
            {steps.map((step, index) => (
              <div key={index} className="relative mb-8 sm:mb-12 last:mb-0">
                <div className="flex flex-col sm:flex-row gap-6 sm:gap-8">
                  {/* Number & Icon */}
                  <div className="flex sm:flex-col items-center sm:items-start gap-4 sm:gap-0">
                    <div className="relative">
                      <div className="text-6xl sm:text-7xl font-bold text-[#0E52AC]/10 dark:text-[#60A5FA]/10">
                        {step.number}
                      </div>
                      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-16 h-16 rounded-full bg-[#0E52AC] dark:bg-[#60A5FA] flex items-center justify-center text-white shadow-lg">
                        {step.icon}
                      </div>
                    </div>

                    {index < steps.length - 1 && (
                      <div className="hidden sm:block w-0.5 h-20 bg-gradient-to-b from-[#0E52AC] to-[#0E52AC]/20 dark:from-[#60A5FA] dark:to-[#60A5FA]/20 ml-8 mt-4" />
                    )}
                  </div>

                  {/* Content */}
                  <div className="flex-1 pt-0 sm:pt-4">
                    <h3 className="text-xl sm:text-2xl font-bold mb-3 text-[#111E2F] dark:text-white">
                      {step.title}
                    </h3>
                    <p className="text-base sm:text-lg text-[#284366] dark:text-[#CBD5E1] leading-relaxed">
                      {step.description}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center mt-12 sm:mt-16">
            <p className="text-lg sm:text-xl font-semibold text-[#111E2F] dark:text-white">
              You stay in control from start to finish — with full{" "}
              <span className="text-[#0E52AC] dark:text-[#60A5FA]">
                transparency
              </span>{" "}
              at every step.
            </p>
          </div>
        </div>
      </section>

      {/* Subjects Section */}
      <section className="py-16 sm:py-20 md:py-24 lg:py-28">
        <div className="container mx-auto px-4 sm:px-6 md:px-8 lg:px-12">
          <div className="max-w-3xl mx-auto text-center mb-12 sm:mb-16">
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-4 sm:mb-6 text-[#111E2F] dark:text-white">
              Subjects and Courses We{" "}
              <span className="text-[#0E52AC] dark:text-[#60A5FA]">Cover</span>
            </h2>
            <p className="text-base sm:text-lg text-[#284366] dark:text-[#CBD5E1] leading-relaxed">
              We focus on the most common courses pursued by international
              students in the UK — no overly specialized or technical fields.
            </p>
          </div>

          <div className="max-w-4xl mx-auto">
            <h3 className="text-xl sm:text-2xl font-bold mb-6 sm:mb-8 text-center text-[#111E2F] dark:text-white">
              Popular Areas We Support:
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
              {subjects.map((subject, index) => (
                <div
                  key={index}
                  className="group flex items-center gap-4 p-5 sm:p-6 rounded-xl bg-white dark:bg-[#1E293B] border border-slate-200 dark:border-slate-800 hover:border-[#0E52AC] dark:hover:border-[#60A5FA] transition-all duration-300 hover:shadow-lg hover:-translate-y-1"
                >
                  <div className="flex-shrink-0 w-10 h-10 rounded-full bg-[#0E52AC]/10 dark:bg-[#60A5FA]/10 flex items-center justify-center text-[#0E52AC] dark:text-[#60A5FA] group-hover:scale-110 transition-transform">
                    <BookOpen className="w-5 h-5" />
                  </div>
                  <span className="text-base sm:text-lg font-medium text-[#111E2F] dark:text-white">
                    {subject}
                  </span>
                </div>
              ))}
            </div>

            <div className="mt-10 sm:mt-12 p-6 sm:p-8 rounded-2xl bg-[#F8FBFF] dark:bg-[#1E293B] border-l-4 border-[#0E52AC] dark:border-[#60A5FA]">
              <p className="text-base sm:text-lg text-[#284366] dark:text-[#CBD5E1] leading-relaxed">
                If your subject isn't listed, simply{" "}
                <Link
                  href="/chat"
                  className="font-semibold text-[#0E52AC] dark:text-[#60A5FA] hover:underline"
                >
                  chat with us
                </Link>{" "}
                — our admin will confirm if we can take it on.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Quality Commitment Section */}
      <section className="py-16 sm:py-20 md:py-24 lg:py-28 bg-[#F8FBFF] dark:bg-[#1E293B]">
        <div className="container mx-auto px-4 sm:px-6 md:px-8 lg:px-12">
          <div className="max-w-3xl mx-auto text-center mb-12 sm:mb-16">
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-4 sm:mb-6 text-[#111E2F] dark:text-white">
              Our Commitment to Quality &{" "}
              <span className="text-[#0E52AC] dark:text-[#60A5FA]">
                Academic Integrity
              </span>
            </h2>
            <p className="text-base sm:text-lg text-[#284366] dark:text-[#CBD5E1] leading-relaxed">
              We believe in ethical academic assistance. All assignments from
              Assignment Ghar are:
            </p>
          </div>

          <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 mb-12">
            {quality.map((item, index) => (
              <div
                key={index}
                className="p-6 sm:p-8 rounded-2xl bg-white dark:bg-[#0A0F1E] border border-slate-200 dark:border-slate-800 text-center"
              >
                <div className="w-12 h-12 rounded-full bg-[#0E52AC] dark:bg-[#60A5FA] flex items-center justify-center mx-auto mb-4 text-white">
                  {item.icon}
                </div>
                <h3 className="text-lg sm:text-xl font-bold mb-3 text-[#111E2F] dark:text-white">
                  {item.title}
                </h3>
                <p className="text-sm sm:text-base text-[#284366] dark:text-[#CBD5E1] leading-relaxed">
                  {item.description}
                </p>
              </div>
            ))}
          </div>

          <div className="text-center max-w-3xl mx-auto">
            <p className="text-base sm:text-lg text-[#284366] dark:text-[#CBD5E1] leading-relaxed">
              We guide students to understand their coursework better through
              model answers and study materials — not academic misconduct.
            </p>
          </div>
        </div>
      </section>

      {/* FAQs Section */}
      <section className="py-16 sm:py-20 md:py-24 lg:py-28">
        <div className="container mx-auto px-4 sm:px-6 md:px-8 lg:px-12">
          <div className="max-w-3xl mx-auto text-center mb-12 sm:mb-16">
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-4 sm:mb-6 text-[#111E2F] dark:text-white">
              FAQs —{" "}
              <span className="text-[#0E52AC] dark:text-[#60A5FA]">
                Quick Answers
              </span>{" "}
              Before You Start
            </h2>
          </div>

          <div className="max-w-3xl mx-auto space-y-4 sm:space-y-6">
            {faqs.map((faq, index) => (
              <div
                key={index}
                className="p-6 sm:p-8 rounded-2xl bg-white dark:bg-[#1E293B] border border-slate-200 dark:border-slate-800 hover:border-[#0E52AC]/30 dark:hover:border-[#60A5FA]/30 transition-all duration-300"
              >
                <h3 className="text-lg sm:text-xl font-bold mb-3 text-[#111E2F] dark:text-white">
                  {faq.question}
                </h3>
                <p className="text-base sm:text-lg text-[#284366] dark:text-[#CBD5E1] leading-relaxed">
                  {faq.answer}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 sm:py-20 md:py-24 lg:py-28 bg-gradient-to-br from-[#0E52AC] to-[#0A3D7A] dark:from-[#60A5FA] dark:to-[#0E52AC]">
        <div className="container mx-auto px-4 sm:px-6 md:px-8 lg:px-12">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-6 sm:mb-8 text-white">
              Get Started Today
            </h2>

            <p className="text-lg sm:text-xl md:text-2xl mb-8 sm:mb-10 text-white/90 leading-relaxed">
              You've got enough on your plate — let's make your assignments
              stress-free.
            </p>

            <p className="text-base sm:text-lg mb-10 sm:mb-12 text-white/80 leading-relaxed">
              Chat with our admin now, upload your assignment, and get it done
              right. Whether you need help with hospitality, IT, or accounting
              coursework, Assignment Ghar is your trusted study companion
              abroad.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-10 sm:mb-12">
              <Link href="/chat" className="w-full sm:w-auto">
                <button className="w-full min-h-[52px] px-8 py-3.5 rounded-xl font-semibold text-[#0E52AC] dark:text-[#1E293B] text-base transition-all duration-300 hover:shadow-xl hover:scale-105 active:scale-95 bg-white shadow-lg">
                  Start Chat Now
                </button>
              </Link>
              <Link href="/submit" className="w-full sm:w-auto">
                <button className="w-full min-h-[52px] px-8 py-3.5 rounded-xl font-semibold text-base border-2 transition-all duration-300 hover:shadow-xl hover:scale-105 active:scale-95 text-white border-white hover:bg-white/10">
                  Submit Assignment
                </button>
              </Link>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-6 sm:gap-8 text-white text-base sm:text-lg font-semibold">
              <div className="flex items-center gap-2">
                <Clock className="w-6 h-6" />
                <span>Fast</span>
              </div>
              <div className="flex items-center gap-2">
                <Shield className="w-6 h-6" />
                <span>Reliable</span>
              </div>
              <div className="flex items-center gap-2">
                <Award className="w-6 h-6" />
                <span>Plagiarism-Free</span>
              </div>
            </div>

            <p className="mt-8 text-lg sm:text-xl text-white/90">
              That's the <span className="font-bold">Assignment Ghar</span>{" "}
              promise.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
