import { Metadata } from "next";
import Link from "next/link";
import { FileText, Shield, AlertCircle, Mail, Globe } from "lucide-react";

export const metadata: Metadata = {
  title: "Terms and Conditions | Assignment Ghar",
  description:
    "Read Assignment Ghar's terms and conditions. Understand our policies, user responsibilities, payment terms, and service guidelines for academic assistance.",
  openGraph: {
    title: "Terms and Conditions | Assignment Ghar",
    description:
      "Terms and conditions for using Assignment Ghar's academic assistance services.",
    url: "https://assignmentghar.com/terms",
  },
};

export default function TermsPage() {
  const sections = [
    {
      id: "definitions",
      title: "1. Definitions",
      content: [
        {
          term: '"We," "Our," "Us"',
          definition:
            "refer to Assignment Ghar, its operators, and representatives.",
        },
        {
          term: '"You," "Your," "User," "Client"',
          definition:
            "refer to anyone accessing or using our website or services.",
        },
        {
          term: '"Services"',
          definition:
            "refers to assignment assistance, writing guidance, tutoring, and related support offered by Assignment Ghar.",
        },
      ],
    },
    {
      id: "nature",
      title: "2. Nature of Service",
      content:
        "Assignment Ghar provides academic assistance and learning support to international students. All delivered materials (assignments, essays, reports, etc.) are intended for reference and educational purposes only. You agree not to submit any delivered material directly for academic credit without making substantial modifications or ensuring compliance with your institution's policies.",
    },
    {
      id: "responsibilities",
      title: "3. User Responsibilities",
      intro: "By using our platform, you agree to:",
      list: [
        "Provide accurate information about your assignment requirements and deadlines.",
        "Use the provided materials ethically, for study and understanding only.",
        "Not misuse, resell, or redistribute any content obtained from Assignment Ghar.",
        "Not engage in fraudulent, illegal, or abusive behavior toward our team or system.",
      ],
      outro:
        "Any violation of these responsibilities may result in suspension or permanent termination of your access.",
    },
    {
      id: "ordering",
      title: "4. Ordering Process",
      list: [
        {
          step: "Chat with Admin",
          detail:
            "You may discuss your assignment details with our support team.",
        },
        {
          step: "Submit Assignment",
          detail:
            "You provide files and instructions through our secure upload system.",
        },
        {
          step: "Quotation & Payment",
          detail: "You receive a price quote before payment.",
        },
        {
          step: "Work Delivery",
          detail:
            "Once completed, the assignment is sent to your registered email or dashboard.",
        },
      ],
      outro:
        "All communication, including changes, must be made via our official channels.",
    },
    {
      id: "payments",
      title: "5. Payments & Refunds",
      list: [
        "Payments are processed securely through third-party gateways (e.g., Stripe, PayPal).",
        "We do not store your payment details.",
        "Once an assignment is delivered, refunds are not guaranteed, except in cases of proven non-delivery or significant deviation from the agreed brief.",
        "Partial refunds may be issued only after internal review and at the company's discretion.",
        "If you have a payment issue, please contact support@assignmentghar.com within 48 hours of delivery.",
      ],
    },
    {
      id: "revisions",
      title: "6. Revisions Policy",
      content:
        "We offer limited free revisions (as stated during the order process) to ensure your satisfaction. Revisions must align with the original requirements; new or expanded instructions may incur additional charges.",
    },
    {
      id: "privacy",
      title: "7. Confidentiality & Privacy",
      content:
        "Your personal data and uploaded materials are kept strictly confidential in accordance with our Privacy Policy. We never disclose, share, or sell client data to unauthorized parties.",
    },
    {
      id: "intellectual",
      title: "8. Intellectual Property",
      content:
        "All content, branding, text, graphics, and design on Assignment Ghar are the intellectual property of the company. Reproduction, redistribution, or commercial use without written permission is strictly prohibited.",
    },
    {
      id: "liability",
      title: "9. Limitation of Liability",
      intro: "Assignment Ghar and its associates are not liable for:",
      list: [
        "Grades, academic penalties, or disciplinary actions resulting from misuse of our materials.",
        "Technical issues, internet disruptions, or delays beyond our control.",
        "Losses arising from user negligence or incomplete instructions.",
      ],
      outro:
        "Our total liability shall not exceed the amount paid by the client for the specific service in question.",
    },
    {
      id: "disclaimer",
      title: "10. Disclaimer",
      content:
        'All services are provided on an "as-is" basis. Assignment Ghar makes no express or implied warranties about grades, academic outcomes, or institutional acceptance of the materials provided.',
    },
    {
      id: "termination",
      title: "11. Termination of Services",
      content:
        "We reserve the right to suspend or terminate your access to our website or services at any time, without prior notice, if you violate these Terms or engage in unethical behavior.",
    },
    {
      id: "amendments",
      title: "12. Amendments",
      content:
        "We may update these Terms periodically. Any changes will be posted on this page with an updated effective date. Your continued use of the site after updates constitutes acceptance of the new Terms.",
    },
    {
      id: "law",
      title: "13. Governing Law",
      content:
        "These Terms are governed by and interpreted in accordance with the laws of the United Kingdom. Any disputes shall be resolved in the courts of that jurisdiction.",
    },
  ];

  return (
    <div className="min-h-screen bg-white dark:bg-[#0A0F1E] transition-colors">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-[#F8FBFF] via-white to-[#E0EDFD] dark:from-[#0A0F1E] dark:via-[#1E293B] dark:to-[#0E52AC]/10 py-16 sm:py-20 md:py-24">
        <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
        <div className="container mx-auto px-4 sm:px-6 md:px-8 lg:px-12 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-block mb-6">
              <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-[#0E52AC]/10 dark:bg-[#60A5FA]/10 flex items-center justify-center mx-auto mb-4">
                <FileText className="w-8 h-8 sm:w-10 sm:h-10 text-[#0E52AC] dark:text-[#60A5FA]" />
              </div>
            </div>

            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-6 sm:mb-8 text-[#111E2F] dark:text-white">
              Terms and{" "}
              <span className="relative inline-block text-[#0E52AC] dark:text-[#60A5FA]">
                Conditions
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

            <p className="text-base sm:text-lg md:text-xl text-[#284366] dark:text-[#CBD5E1] leading-relaxed mb-6">
              Effective Date: January 1, 2025
            </p>

            <p className="text-sm sm:text-base text-[#284366] dark:text-[#CBD5E1] leading-relaxed max-w-3xl mx-auto">
              Welcome to Assignment Ghar. By using our website and services, you
              agree to comply with and be bound by these Terms and Conditions.
              Please read them carefully before engaging with our platform.
            </p>
          </div>
        </div>
      </section>

      {/* Important Notice */}
      <section className="py-8 sm:py-12 bg-[#FEF3C7] dark:bg-[#854D0E]/20 border-y border-[#FCD34D] dark:border-[#854D0E]">
        <div className="container mx-auto px-4 sm:px-6 md:px-8 lg:px-12">
          <div className="max-w-4xl mx-auto">
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0">
                <AlertCircle className="w-6 h-6 text-[#92400E] dark:text-[#FCD34D]" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-[#92400E] dark:text-[#FCD34D] mb-2">
                  Important Notice
                </h3>
                <p className="text-sm sm:text-base text-[#78350F] dark:text-[#FDE68A] leading-relaxed">
                  If you do not agree with any part of these terms, you should
                  not use our website or services. Your continued use of
                  Assignment Ghar constitutes acceptance of these Terms and
                  Conditions.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-16 sm:py-20 md:py-24 lg:py-28">
        <div className="container mx-auto px-4 sm:px-6 md:px-8 lg:px-12">
          <div className="max-w-4xl mx-auto">
            {sections.map((section, index) => (
              <div
                key={section.id}
                id={section.id}
                className="mb-12 sm:mb-16 last:mb-0"
              >
                <h2 className="text-2xl sm:text-3xl font-bold mb-4 sm:mb-6 text-[#111E2F] dark:text-white">
                  {section.title}
                </h2>

                {/* Definitions */}
                {Array.isArray(section.content) && section.content[0]?.term && (
                  <div className="space-y-4">
                    {section.content.map((item: any, idx: number) => (
                      <div
                        key={idx}
                        className="p-4 rounded-lg bg-[#F8FBFF] dark:bg-[#1E293B] border border-slate-200 dark:border-slate-800"
                      >
                        <span className="font-semibold text-[#0E52AC] dark:text-[#60A5FA]">
                          {item.term}
                        </span>
                        {" – "}
                        <span className="text-[#284366] dark:text-[#CBD5E1]">
                          {item.definition}
                        </span>
                      </div>
                    ))}
                  </div>
                )}

                {/* Simple Content */}
                {typeof section.content === "string" && (
                  <p className="text-base sm:text-lg text-[#284366] dark:text-[#CBD5E1] leading-relaxed">
                    {section.content}
                  </p>
                )}

                {/* Lists with Intro/Outro */}
                {section.intro && (
                  <>
                    <p className="text-base sm:text-lg text-[#284366] dark:text-[#CBD5E1] leading-relaxed mb-4">
                      {section.intro}
                    </p>
                    <ul className="space-y-3 mb-4">
                      {section.list.map((item: any, idx: number) => (
                        <li
                          key={idx}
                          className="flex items-start gap-3 text-base sm:text-lg text-[#284366] dark:text-[#CBD5E1]"
                        >
                          <div className="flex-shrink-0 w-6 h-6 rounded-full bg-[#0E52AC]/10 dark:bg-[#60A5FA]/10 flex items-center justify-center mt-1">
                            <div className="w-2 h-2 rounded-full bg-[#0E52AC] dark:bg-[#60A5FA]"></div>
                          </div>
                          <span className="flex-1">
                            {typeof item === "string" ? (
                              item
                            ) : (
                              <>
                                <strong>{item.step}:</strong> {item.detail}
                              </>
                            )}
                          </span>
                        </li>
                      ))}
                    </ul>
                    {section.outro && (
                      <p className="text-base sm:text-lg text-[#284366] dark:text-[#CBD5E1] leading-relaxed italic">
                        {section.outro}
                      </p>
                    )}
                  </>
                )}

                {/* Simple Lists */}
                {!section.intro && Array.isArray(section.list) && (
                  <ul className="space-y-3">
                    {section.list.map((item: any, idx: number) => (
                      <li
                        key={idx}
                        className="flex items-start gap-3 text-base sm:text-lg text-[#284366] dark:text-[#CBD5E1]"
                      >
                        <div className="flex-shrink-0 w-6 h-6 rounded-full bg-[#0E52AC]/10 dark:bg-[#60A5FA]/10 flex items-center justify-center mt-1">
                          <div className="w-2 h-2 rounded-full bg-[#0E52AC] dark:bg-[#60A5FA]"></div>
                        </div>
                        <span className="flex-1">
                          {typeof item === "string" ? (
                            item
                          ) : (
                            <>
                              <strong>{item.step}:</strong> {item.detail}
                            </>
                          )}
                        </span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            ))}

            {/* Contact Section */}
            <div className="mt-16 sm:mt-20 p-6 sm:p-8 rounded-2xl bg-gradient-to-br from-[#0E52AC] to-[#0A3D7A] dark:from-[#60A5FA] dark:to-[#0E52AC] text-white">
              <h2 className="text-2xl sm:text-3xl font-bold mb-6">
                14. Contact Us
              </h2>
              <p className="text-base sm:text-lg mb-6 text-white/90">
                For questions, clarifications, or support regarding these Terms,
                contact:
              </p>
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <Mail className="w-5 h-5 flex-shrink-0" />
                  <a
                    href="mailto:support@assignmentghar1.com"
                    className="text-base sm:text-lg hover:underline"
                  >
                    support@assignmentghar1.com
                  </a>
                </div>
                <div className="flex items-center gap-3">
                  <Globe className="w-5 h-5 flex-shrink-0" />
                  <a
                    href="https://assignmentghar.com"
                    className="text-base sm:text-lg hover:underline"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    https://assignmentghar.com
                  </a>
                </div>
              </div>
            </div>

            {/* Related Links */}
            <div className="mt-12 sm:mt-16 flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/privacy" className="w-full sm:w-auto">
                <button className="w-full min-h-[52px] px-8 py-3.5 rounded-xl font-semibold text-base border-2 transition-all duration-300 hover:shadow-xl hover:scale-105 active:scale-95 text-[#0E52AC] dark:text-[#60A5FA] border-[#0E52AC] dark:border-[#60A5FA] bg-white dark:bg-[#0A0F1E] hover:bg-[#F8FBFF] dark:hover:bg-[#1E293B] flex items-center justify-center gap-2">
                  <Shield className="w-5 h-5" />
                  Privacy Policy
                </button>
              </Link>
              <Link href="/contact" className="w-full sm:w-auto">
                <button className="w-full min-h-[52px] px-8 py-3.5 rounded-xl font-semibold text-white text-base transition-all duration-300 hover:shadow-xl hover:scale-105 active:scale-95 bg-[#0E52AC] dark:bg-[#60A5FA] shadow-lg">
                  Contact Support
                </button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
