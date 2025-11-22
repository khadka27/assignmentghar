import { Metadata } from "next";
import Link from "next/link";
import {
  Shield,
  Lock,
  Eye,
  Cookie,
  FileText,
  MessageSquare,
  ExternalLink,
  UserCheck,
  Mail,
  Globe,
  AlertCircle,
} from "lucide-react";

export const metadata: Metadata = {
  title: "Privacy Policy | Assignment Ghar",
  description:
    "Learn how Assignment Ghar protects your personal information. Read our privacy policy covering data collection, security measures, and your rights.",
  openGraph: {
    title: "Privacy Policy | Assignment Ghar",
    description:
      "Assignment Ghar's commitment to protecting your privacy and personal information.",
    url: "https://assignmentghar.com/privacy",
  },
};

export default function PrivacyPage() {
  const highlights = [
    {
      icon: <Lock className="w-6 h-6" />,
      title: "Encrypted & Secure",
      description: "All data transfers and payments are fully encrypted",
    },
    {
      icon: <Eye className="w-6 h-6" />,
      title: "No Data Selling",
      description: "We never sell or share your data with third parties",
    },
    {
      icon: <Shield className="w-6 h-6" />,
      title: "Strict Confidentiality",
      description: "Your assignments and personal info stay private",
    },
    {
      icon: <UserCheck className="w-6 h-6" />,
      title: "Your Rights Protected",
      description: "Request, correct, or delete your data anytime",
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
                <Shield className="w-8 h-8 sm:w-10 sm:h-10 text-[#0E52AC] dark:text-[#60A5FA]" />
              </div>
            </div>

            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-6 sm:mb-8 text-[#111E2F] dark:text-white">
              Privacy{" "}
              <span className="relative inline-block text-[#0E52AC] dark:text-[#60A5FA]">
                Policy
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
              At Assignment Ghar, we value your trust and are committed to
              protecting your personal information. This Privacy Policy explains
              how we collect, use, and safeguard your data when you use our
              website, communicate with us, or use our assignment assistance
              services.
            </p>
          </div>
        </div>
      </section>

      {/* Key Highlights */}
      <section className="py-12 sm:py-16 bg-white dark:bg-[#0A0F1E]">
        <div className="container mx-auto px-4 sm:px-6 md:px-8 lg:px-12">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-2xl sm:text-3xl font-bold text-center mb-8 sm:mb-12 text-[#111E2F] dark:text-white">
              Our Privacy{" "}
              <span className="text-[#0E52AC] dark:text-[#60A5FA]">
                Commitment
              </span>
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {highlights.map((item, index) => (
                <div
                  key={index}
                  className="p-6 rounded-xl bg-[#F8FBFF] dark:bg-[#1E293B] border border-slate-200 dark:border-slate-800 hover:border-[#0E52AC] dark:hover:border-[#60A5FA] transition-all duration-300"
                >
                  <div className="w-12 h-12 rounded-full bg-[#0E52AC]/10 dark:bg-[#60A5FA]/10 flex items-center justify-center mb-4 text-[#0E52AC] dark:text-[#60A5FA]">
                    {item.icon}
                  </div>
                  <h3 className="text-lg font-bold mb-2 text-[#111E2F] dark:text-white">
                    {item.title}
                  </h3>
                  <p className="text-sm text-[#284366] dark:text-[#CBD5E1]">
                    {item.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-16 sm:py-20 md:py-24 lg:py-28 bg-[#F8FBFF] dark:bg-[#1E293B]">
        <div className="container mx-auto px-4 sm:px-6 md:px-8 lg:px-12">
          <div className="max-w-4xl mx-auto space-y-12 sm:space-y-16">
            {/* Section 1 */}
            <div>
              <h2 className="text-2xl sm:text-3xl font-bold mb-4 sm:mb-6 text-[#111E2F] dark:text-white">
                1. Information We Collect
              </h2>
              <p className="text-base sm:text-lg text-[#284366] dark:text-[#CBD5E1] leading-relaxed mb-6">
                We collect only the information necessary to provide you with
                our services efficiently and securely.
              </p>

              <div className="space-y-6">
                <div className="p-6 rounded-xl bg-white dark:bg-[#0A0F1E] border border-slate-200 dark:border-slate-800">
                  <h3 className="text-lg sm:text-xl font-bold mb-4 text-[#111E2F] dark:text-white flex items-center gap-2">
                    <FileText className="w-5 h-5 text-[#0E52AC] dark:text-[#60A5FA]" />
                    a. Personal Information
                  </h3>
                  <p className="text-base text-[#284366] dark:text-[#CBD5E1] mb-4">
                    When you use our platform (e.g., to chat, share assignments,
                    or make payments), we may collect:
                  </p>
                  <ul className="space-y-2">
                    {[
                      "Your full name and email address",
                      "Contact number (if provided voluntarily)",
                      "Course and assignment details",
                      "Uploaded files, project instructions, or reference materials",
                      "Payment-related details (processed through secure gateways)",
                    ].map((item, idx) => (
                      <li
                        key={idx}
                        className="flex items-start gap-3 text-base text-[#284366] dark:text-[#CBD5E1]"
                      >
                        <div className="flex-shrink-0 w-6 h-6 rounded-full bg-[#0E52AC]/10 dark:bg-[#60A5FA]/10 flex items-center justify-center mt-0.5">
                          <div className="w-2 h-2 rounded-full bg-[#0E52AC] dark:bg-[#60A5FA]"></div>
                        </div>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="p-6 rounded-xl bg-white dark:bg-[#0A0F1E] border border-slate-200 dark:border-slate-800">
                  <h3 className="text-lg sm:text-xl font-bold mb-4 text-[#111E2F] dark:text-white flex items-center gap-2">
                    <Eye className="w-5 h-5 text-[#0E52AC] dark:text-[#60A5FA]" />
                    b. Automatically Collected Data
                  </h3>
                  <p className="text-base text-[#284366] dark:text-[#CBD5E1] mb-4">
                    Our systems may collect:
                  </p>
                  <ul className="space-y-2">
                    {[
                      "IP address and browser type",
                      "Device information",
                      "Session duration and interaction logs (for performance improvement)",
                      "Cookies (used for session management and analytics)",
                    ].map((item, idx) => (
                      <li
                        key={idx}
                        className="flex items-start gap-3 text-base text-[#284366] dark:text-[#CBD5E1]"
                      >
                        <div className="flex-shrink-0 w-6 h-6 rounded-full bg-[#0E52AC]/10 dark:bg-[#60A5FA]/10 flex items-center justify-center mt-0.5">
                          <div className="w-2 h-2 rounded-full bg-[#0E52AC] dark:bg-[#60A5FA]"></div>
                        </div>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>

            {/* Section 2 */}
            <div>
              <h2 className="text-2xl sm:text-3xl font-bold mb-4 sm:mb-6 text-[#111E2F] dark:text-white">
                2. How We Use Your Information
              </h2>
              <p className="text-base sm:text-lg text-[#284366] dark:text-[#CBD5E1] leading-relaxed mb-4">
                We use your data only for legitimate purposes such as:
              </p>
              <ul className="space-y-3 mb-6">
                {[
                  "Delivering your requested services (assignment help, support, communication)",
                  "Sending progress updates and final files",
                  "Processing secure payments and invoices",
                  "Improving website functionality and customer experience",
                  "Responding to queries and support requests",
                ].map((item, idx) => (
                  <li
                    key={idx}
                    className="flex items-start gap-3 text-base sm:text-lg text-[#284366] dark:text-[#CBD5E1]"
                  >
                    <div className="flex-shrink-0 w-6 h-6 rounded-full bg-[#0E52AC]/10 dark:bg-[#60A5FA]/10 flex items-center justify-center mt-1">
                      <div className="w-2 h-2 rounded-full bg-[#0E52AC] dark:bg-[#60A5FA]"></div>
                    </div>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
              <div className="p-4 rounded-lg bg-[#FEF3C7] dark:bg-[#854D0E]/20 border border-[#FCD34D] dark:border-[#854D0E]">
                <p className="text-sm sm:text-base text-[#78350F] dark:text-[#FDE68A] font-semibold">
                  We never sell or share your data with unauthorized third
                  parties for marketing purposes.
                </p>
              </div>
            </div>

            {/* Section 3 */}
            <div>
              <h2 className="text-2xl sm:text-3xl font-bold mb-4 sm:mb-6 text-[#111E2F] dark:text-white flex items-center gap-3">
                <Lock className="w-7 h-7 text-[#0E52AC] dark:text-[#60A5FA]" />
                3. Data Protection & Security
              </h2>
              <p className="text-base sm:text-lg text-[#284366] dark:text-[#CBD5E1] leading-relaxed mb-6">
                Your privacy is our priority. We implement strong technical and
                organizational measures to safeguard your data:
              </p>
              <ul className="space-y-3 mb-6">
                {[
                  "Encrypted file transfers and secure payment processing",
                  "Access control for internal staff (need-to-know basis)",
                  "Regular audits to prevent unauthorized access, alteration, or misuse",
                ].map((item, idx) => (
                  <li
                    key={idx}
                    className="flex items-start gap-3 text-base sm:text-lg text-[#284366] dark:text-[#CBD5E1]"
                  >
                    <div className="flex-shrink-0 w-6 h-6 rounded-full bg-[#0E52AC]/10 dark:bg-[#60A5FA]/10 flex items-center justify-center mt-1">
                      <div className="w-2 h-2 rounded-full bg-[#0E52AC] dark:bg-[#60A5FA]"></div>
                    </div>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
              <div className="p-4 rounded-lg bg-[#DBEAFE] dark:bg-[#1E3A8A]/20 border border-[#60A5FA] dark:border-[#1E3A8A]">
                <p className="text-sm sm:text-base text-[#1E3A8A] dark:text-[#BFDBFE]">
                  All payments are processed via trusted third-party gateways
                  (e.g., Stripe, PayPal) — we do not store your card or banking
                  information on our servers.
                </p>
              </div>
            </div>

            {/* Section 4 */}
            <div>
              <h2 className="text-2xl sm:text-3xl font-bold mb-4 sm:mb-6 text-[#111E2F] dark:text-white flex items-center gap-3">
                <Cookie className="w-7 h-7 text-[#0E52AC] dark:text-[#60A5FA]" />
                4. Cookies Policy
              </h2>
              <p className="text-base sm:text-lg text-[#284366] dark:text-[#CBD5E1] leading-relaxed mb-4">
                Cookies are small text files used to improve your experience on
                our site. We use them to:
              </p>
              <ul className="space-y-3 mb-4">
                {[
                  "Maintain user sessions",
                  "Store preferences for faster navigation",
                  "Analyze site performance and optimize usability",
                ].map((item, idx) => (
                  <li
                    key={idx}
                    className="flex items-start gap-3 text-base sm:text-lg text-[#284366] dark:text-[#CBD5E1]"
                  >
                    <div className="flex-shrink-0 w-6 h-6 rounded-full bg-[#0E52AC]/10 dark:bg-[#60A5FA]/10 flex items-center justify-center mt-1">
                      <div className="w-2 h-2 rounded-full bg-[#0E52AC] dark:bg-[#60A5FA]"></div>
                    </div>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
              <p className="text-base sm:text-lg text-[#284366] dark:text-[#CBD5E1] leading-relaxed italic">
                You can disable cookies anytime through your browser settings,
                but some features may not function properly without them.
              </p>
            </div>

            {/* Section 5 */}
            <div>
              <h2 className="text-2xl sm:text-3xl font-bold mb-4 sm:mb-6 text-[#111E2F] dark:text-white">
                5. File & Data Retention
              </h2>
              <p className="text-base sm:text-lg text-[#284366] dark:text-[#CBD5E1] leading-relaxed">
                Uploaded assignments and related files are retained only for the
                duration necessary to complete your service request. After
                delivery and confirmation, we securely delete or anonymize files
                unless you request otherwise (for revisions or reference).
              </p>
            </div>

            {/* Section 6 */}
            <div>
              <h2 className="text-2xl sm:text-3xl font-bold mb-4 sm:mb-6 text-[#111E2F] dark:text-white flex items-center gap-3">
                <MessageSquare className="w-7 h-7 text-[#0E52AC] dark:text-[#60A5FA]" />
                6. Communication & Chat Records
              </h2>
              <p className="text-base sm:text-lg text-[#284366] dark:text-[#CBD5E1] leading-relaxed">
                All conversations via chat or email are kept confidential and
                used solely for service-related communication. We may store
                these interactions for quality assurance and dispute resolution,
                but never for unsolicited contact.
              </p>
            </div>

            {/* Section 7 */}
            <div>
              <h2 className="text-2xl sm:text-3xl font-bold mb-4 sm:mb-6 text-[#111E2F] dark:text-white flex items-center gap-3">
                <ExternalLink className="w-7 h-7 text-[#0E52AC] dark:text-[#60A5FA]" />
                7. Third-Party Services
              </h2>
              <p className="text-base sm:text-lg text-[#284366] dark:text-[#CBD5E1] leading-relaxed">
                Our site may contain links to third-party tools or payment
                processors. Assignment Ghar is not responsible for external
                privacy practices. We recommend reviewing the privacy policies
                of those third-party sites before sharing any personal
                information.
              </p>
            </div>

            {/* Section 8 */}
            <div>
              <h2 className="text-2xl sm:text-3xl font-bold mb-4 sm:mb-6 text-[#111E2F] dark:text-white flex items-center gap-3">
                <UserCheck className="w-7 h-7 text-[#0E52AC] dark:text-[#60A5FA]" />
                8. Your Rights
              </h2>
              <p className="text-base sm:text-lg text-[#284366] dark:text-[#CBD5E1] leading-relaxed mb-4">
                You have the right to:
              </p>
              <ul className="space-y-3 mb-6">
                {[
                  "Request a copy of your stored data",
                  "Ask for corrections or deletion of your personal information",
                  "Withdraw consent at any time (where applicable)",
                ].map((item, idx) => (
                  <li
                    key={idx}
                    className="flex items-start gap-3 text-base sm:text-lg text-[#284366] dark:text-[#CBD5E1]"
                  >
                    <div className="flex-shrink-0 w-6 h-6 rounded-full bg-[#0E52AC]/10 dark:bg-[#60A5FA]/10 flex items-center justify-center mt-1">
                      <div className="w-2 h-2 rounded-full bg-[#0E52AC] dark:bg-[#60A5FA]"></div>
                    </div>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
              <div className="p-4 rounded-lg bg-[#F8FBFF] dark:bg-[#1E293B] border border-[#0E52AC]/20 dark:border-[#60A5FA]/20">
                <p className="text-base text-[#284366] dark:text-[#CBD5E1]">
                  To exercise your rights, contact us at:{" "}
                  <a
                    href="mailto:privacy@assignmentghar.com"
                    className="text-[#0E52AC] dark:text-[#60A5FA] font-semibold hover:underline"
                  >
                    privacy@assignmentghar.com
                  </a>
                </p>
              </div>
            </div>

            {/* Section 9 */}
            <div>
              <h2 className="text-2xl sm:text-3xl font-bold mb-4 sm:mb-6 text-[#111E2F] dark:text-white">
                9. Children's Privacy
              </h2>
              <p className="text-base sm:text-lg text-[#284366] dark:text-[#CBD5E1] leading-relaxed">
                Our services are intended for college and university students
                aged 18+. We do not knowingly collect or store information from
                minors.
              </p>
            </div>

            {/* Section 10 */}
            <div>
              <h2 className="text-2xl sm:text-3xl font-bold mb-4 sm:mb-6 text-[#111E2F] dark:text-white">
                10. Policy Updates
              </h2>
              <p className="text-base sm:text-lg text-[#284366] dark:text-[#CBD5E1] leading-relaxed">
                We may occasionally update this Privacy Policy to reflect
                changes in our practices or regulations. The latest version will
                always be available on this page with an updated "Effective
                Date."
              </p>
            </div>

            {/* Contact Section */}
            <div className="p-6 sm:p-8 rounded-2xl bg-gradient-to-br from-[#0E52AC] to-[#0A3D7A] dark:from-[#60A5FA] dark:to-[#0E52AC] text-white">
              <h2 className="text-2xl sm:text-3xl font-bold mb-6">
                11. Contact Us
              </h2>
              <p className="text-base sm:text-lg mb-6 text-white/90">
                If you have questions or concerns about this Privacy Policy or
                how your data is handled, please contact:
              </p>
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <Mail className="w-5 h-5 flex-shrink-0" />
                  <a
                    href="mailto:support@assignmentghar.com"
                    className="text-base sm:text-lg hover:underline"
                  >
                    support@assignmentghar.com
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
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/terms" className="w-full sm:w-auto">
                <button className="w-full min-h-[52px] px-8 py-3.5 rounded-xl font-semibold text-base border-2 transition-all duration-300 hover:shadow-xl hover:scale-105 active:scale-95 text-[#0E52AC] dark:text-[#60A5FA] border-[#0E52AC] dark:border-[#60A5FA] bg-white dark:bg-[#0A0F1E] hover:bg-[#F8FBFF] dark:hover:bg-[#1E293B] flex items-center justify-center gap-2">
                  <FileText className="w-5 h-5" />
                  Terms & Conditions
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
