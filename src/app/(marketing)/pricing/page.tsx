import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Pricing - Affordable Assignment Help Services",
  description:
    "Transparent and affordable pricing for professional assignment help. Get quality academic writing services at competitive rates. No hidden fees. Free revisions included.",
  keywords: [
    "assignment help pricing",
    "affordable assignment services",
    "academic writing cost",
    "homework help prices",
    "student discounts",
  ],
  openGraph: {
    title: "Pricing - Affordable Assignment Help Services | AssignmentGhar",
    description:
      "Transparent and affordable pricing for professional assignment help. Quality academic writing at competitive rates.",
    type: "website",
    url: `${
      process.env.NEXT_PUBLIC_APP_URL || "https://assignmentghar.com"
    }/pricing`,
    images: [
      {
        url: "/og-pricing.png",
        width: 1200,
        height: 630,
        alt: "AssignmentGhar Pricing",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Pricing - Affordable Assignment Help Services",
    description:
      "Transparent and affordable pricing for professional assignment help. Quality academic writing at competitive rates.",
    images: ["/og-pricing.png"],
  },
  alternates: {
    canonical: `${
      process.env.NEXT_PUBLIC_APP_URL || "https://assignmentghar.com"
    }/pricing`,
  },
};

export default function PricingPage() {
  return (
    <div className="w-full min-h-screen bg-gradient-to-b from-[#F8FBFF] via-white to-[#F8FBFF] dark:from-[#0A0F1E] dark:via-[#1E293B] dark:to-[#0A0F1E]">
      {/* Hero */}
      <section className="relative overflow-hidden py-20 md:py-32">
        {/* Background decorations */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-20 left-10 w-72 h-72 bg-blue-200/20 dark:bg-blue-500/10 rounded-full blur-3xl"></div>
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-purple-200/20 dark:bg-purple-500/10 rounded-full blur-3xl"></div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="max-w-3xl mx-auto text-center">
            <div className="inline-block mb-4 px-4 py-2 bg-blue-100 dark:bg-blue-900/30 rounded-full">
              <span className="text-sm font-semibold text-[#0E52AC] dark:text-blue-400">
                💰 Simple & Transparent
              </span>
            </div>
            <h1 className="text-4xl md:text-6xl font-bold mb-6 text-[#111E2F] dark:text-white leading-tight">
              Fair & Flexible
              <span className="block bg-gradient-to-r from-[#0E52AC] to-[#60A5FA] bg-clip-text text-transparent">
                Pricing
              </span>
            </h1>
            <p className="text-lg md:text-xl text-[#284366] dark:text-[#CBD5E1] leading-relaxed">
              Pricing is case-by-case based on your assignment complexity and
              deadline. No hidden charges, just honest quotes.
            </p>
          </div>
        </div>
      </section>

      {/* Pricing Info */}
      <section className="py-16 md:py-24 relative">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
            {/* How It Works Card */}
            <Card className="bg-white dark:bg-[#1E293B] border-2 border-[#E0EDFD] dark:border-[#475569] p-6 md:p-8 rounded-2xl shadow-lg hover:shadow-2xl hover:border-[#0E52AC] dark:hover:border-[#60A5FA] transition-all duration-300 hover:-translate-y-1">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 bg-gradient-to-br from-[#0E52AC] to-[#60A5FA] rounded-xl flex items-center justify-center shadow-lg">
                  <span className="text-white text-2xl">📋</span>
                </div>
                <h3 className="text-2xl font-bold text-[#111E2F] dark:text-white">
                  How It Works
                </h3>
              </div>
              <ul className="space-y-4">
                <li className="flex gap-4 items-start group">
                  <span className="flex-shrink-0 w-8 h-8 bg-blue-100 dark:bg-blue-900/30 text-[#0E52AC] dark:text-blue-400 font-bold rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
                    1
                  </span>
                  <span className="text-[#284366] dark:text-[#CBD5E1] pt-1">
                    Submit your assignment details
                  </span>
                </li>
                <li className="flex gap-4 items-start group">
                  <span className="flex-shrink-0 w-8 h-8 bg-blue-100 dark:bg-blue-900/30 text-[#0E52AC] dark:text-blue-400 font-bold rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
                    2
                  </span>
                  <span className="text-[#284366] dark:text-[#CBD5E1] pt-1">
                    Get a custom quote from our team
                  </span>
                </li>
                <li className="flex gap-4 items-start group">
                  <span className="flex-shrink-0 w-8 h-8 bg-blue-100 dark:bg-blue-900/30 text-[#0E52AC] dark:text-blue-400 font-bold rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
                    3
                  </span>
                  <span className="text-[#284366] dark:text-[#CBD5E1] pt-1">
                    Pay via secure QR code
                  </span>
                </li>
                <li className="flex gap-4 items-start group">
                  <span className="flex-shrink-0 w-8 h-8 bg-blue-100 dark:bg-blue-900/30 text-[#0E52AC] dark:text-blue-400 font-bold rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
                    4
                  </span>
                  <span className="text-[#284366] dark:text-[#CBD5E1] pt-1">
                    Work begins after payment confirmation
                  </span>
                </li>
              </ul>
            </Card>

            {/* Factors Card */}
            <Card className="bg-white dark:bg-[#1E293B] border-2 border-[#E0EDFD] dark:border-[#475569] p-6 md:p-8 rounded-2xl shadow-lg hover:shadow-2xl hover:border-[#0E52AC] dark:hover:border-[#60A5FA] transition-all duration-300 hover:-translate-y-1">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center shadow-lg">
                  <span className="text-white text-2xl">💡</span>
                </div>
                <h3 className="text-2xl font-bold text-[#111E2F] dark:text-white">
                  Factors Affecting Price
                </h3>
              </div>
              <ul className="space-y-4">
                <li className="flex gap-4 items-start group">
                  <span className="flex-shrink-0 w-2 h-2 mt-2 bg-gradient-to-br from-[#0E52AC] to-[#60A5FA] rounded-full group-hover:scale-150 transition-transform"></span>
                  <span className="text-[#284366] dark:text-[#CBD5E1]">
                    Assignment complexity and length
                  </span>
                </li>
                <li className="flex gap-4 items-start group">
                  <span className="flex-shrink-0 w-2 h-2 mt-2 bg-gradient-to-br from-[#0E52AC] to-[#60A5FA] rounded-full group-hover:scale-150 transition-transform"></span>
                  <span className="text-[#284366] dark:text-[#CBD5E1]">
                    Subject area and expertise required
                  </span>
                </li>
                <li className="flex gap-4 items-start group">
                  <span className="flex-shrink-0 w-2 h-2 mt-2 bg-gradient-to-br from-[#0E52AC] to-[#60A5FA] rounded-full group-hover:scale-150 transition-transform"></span>
                  <span className="text-[#284366] dark:text-[#CBD5E1]">
                    Deadline urgency
                  </span>
                </li>
                <li className="flex gap-4 items-start group">
                  <span className="flex-shrink-0 w-2 h-2 mt-2 bg-gradient-to-br from-[#0E52AC] to-[#60A5FA] rounded-full group-hover:scale-150 transition-transform"></span>
                  <span className="text-[#284366] dark:text-[#CBD5E1]">
                    Specific requirements and formatting
                  </span>
                </li>
              </ul>
            </Card>
          </div>

          {/* CTA Section */}
          <div className="mt-12 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-[#0E52AC] to-[#60A5FA] opacity-5 dark:opacity-10 rounded-2xl"></div>
            <Card className="relative bg-gradient-to-br from-[#F8FBFF] via-white to-blue-50 dark:from-[#1E293B] dark:via-[#0F172A] dark:to-[#1E293B] border-2 border-[#0E52AC] dark:border-[#60A5FA] p-8 md:p-12 text-center rounded-2xl shadow-2xl">
              <div className="max-w-2xl mx-auto">
                <div className="inline-block mb-4 px-4 py-2 bg-white dark:bg-[#0F172A] rounded-full shadow-md">
                  <span className="text-sm font-semibold text-[#0E52AC] dark:text-blue-400">
                    ⚡ Quick Response
                  </span>
                </div>
                <h3 className="text-3xl md:text-4xl font-bold mb-4 text-[#111E2F] dark:text-white">
                  Get Your Custom Quote
                </h3>
                <p className="text-lg text-[#284366] dark:text-[#CBD5E1] mb-8 leading-relaxed">
                  Submit your assignment and receive a personalized quote within
                  24 hours. Our team will analyze your requirements and provide
                  you with the best price.
                </p>
                <Link href="/submit">
                  <Button className="bg-gradient-to-r from-[#0E52AC] to-[#60A5FA] hover:from-[#0A3D7F] hover:to-[#4B8FE8] text-white px-8 py-6 text-lg font-semibold rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 hover:scale-105">
                    Submit Assignment Now
                    <span className="ml-2">→</span>
                  </Button>
                </Link>
              </div>
            </Card>
          </div>

          {/* Features Grid */}
          <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white dark:bg-[#1E293B] border border-[#E0EDFD] dark:border-[#475569] rounded-xl p-6 text-center hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
              <div className="w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-3xl">✅</span>
              </div>
              <h4 className="font-bold mb-2 text-[#111E2F] dark:text-white">
                No Hidden Fees
              </h4>
              <p className="text-sm text-[#284366] dark:text-[#CBD5E1]">
                What you see is what you pay. Complete transparency in pricing.
              </p>
            </div>

            <div className="bg-white dark:bg-[#1E293B] border border-[#E0EDFD] dark:border-[#475569] rounded-xl p-6 text-center hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
              <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-3xl">🔒</span>
              </div>
              <h4 className="font-bold mb-2 text-[#111E2F] dark:text-white">
                Secure Payment
              </h4>
              <p className="text-sm text-[#284366] dark:text-[#CBD5E1]">
                Safe QR code payments. Your financial information is protected.
              </p>
            </div>

            <div className="bg-white dark:bg-[#1E293B] border border-[#E0EDFD] dark:border-[#475569] rounded-xl p-6 text-center hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
              <div className="w-16 h-16 bg-purple-100 dark:bg-purple-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-3xl">🎯</span>
              </div>
              <h4 className="font-bold mb-2 text-[#111E2F] dark:text-white">
                Quality Guaranteed
              </h4>
              <p className="text-sm text-[#284366] dark:text-[#CBD5E1]">
                Free revisions included. We ensure your complete satisfaction.
              </p>
            </div>
          </div>

          {/* Payment Info */}
          <div className="mt-12 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-[#1E293B] dark:to-[#0F172A] border-2 border-[#E0EDFD] dark:border-[#475569] rounded-2xl p-6 md:p-8">
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-[#0E52AC] to-[#60A5FA] rounded-xl flex items-center justify-center">
                <span className="text-white text-2xl">💳</span>
              </div>
              <div>
                <h4 className="text-xl font-bold mb-2 text-[#111E2F] dark:text-white">
                  Payment Method
                </h4>
                <p className="text-[#284366] dark:text-[#CBD5E1] leading-relaxed">
                  We accept payments via secure QR code. Work begins immediately
                  after payment is confirmed. No hidden fees, no surprises -
                  just honest, transparent pricing tailored to your needs.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
