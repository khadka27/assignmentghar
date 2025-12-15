import Link from "next/link";
import Image from "next/image";

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-[#F8FBFF] dark:bg-[#0A0F1E] border-t border-slate-200 dark:border-slate-800 mt-16 sm:mt-20 md:mt-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-14 md:py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 sm:gap-10 md:gap-12 mb-10 sm:mb-12">
          {/* Brand */}
          <div className="sm:col-span-2 lg:col-span-1">
            <div className="mb-4 sm:mb-5">
              <Image
                src="/images/nav_logo.png"
                alt="AssignmentGhar Logo"
                width={180}
                height={50}
                className="h-10 sm:h-12 w-auto dark:hidden"
                priority
                unoptimized
              />
              <Image
                src="/images/darklogo.png"
                alt="AssignmentGhar Logo"
                width={180}
                height={50}
                className="h-10 sm:h-12 w-auto hidden dark:block"
                priority
                unoptimized
              />
            </div>
            <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400 leading-relaxed max-w-sm">
              Expert assignment help and consultancy for college and university
              students. Quality work, on-time delivery, 24/7 support.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-bold text-base sm:text-lg mb-4 sm:mb-5 text-[#111E2F] dark:text-white">
              Quick Links
            </h3>
            <ul className="space-y-2.5 sm:space-y-3 text-sm sm:text-base">
              <li>
                <Link
                  href="/about"
                  className="text-slate-600 dark:text-slate-400 hover:text-[#0E52AC] dark:hover:text-[#60A5FA] transition-colors duration-200 inline-flex items-center group"
                >
                  <span className="group-hover:translate-x-1 transition-transform duration-200">
                    About Us
                  </span>
                </Link>
              </li>
              <li>
                <Link
                  href="/contact"
                  className="text-slate-600 dark:text-slate-400 hover:text-[#0E52AC] dark:hover:text-[#60A5FA] transition-colors duration-200 inline-flex items-center group"
                >
                  <span className="group-hover:translate-x-1 transition-transform duration-200">
                    Contact
                  </span>
                </Link>
              </li>
              <li>
                <Link
                  href="/submit"
                  className="text-slate-600 dark:text-slate-400 hover:text-[#0E52AC] dark:hover:text-[#60A5FA] transition-colors duration-200 inline-flex items-center group"
                >
                  <span className="group-hover:translate-x-1 transition-transform duration-200">
                    Submit Assignment
                  </span>
                </Link>
              </li>
              <li>
                <Link
                  href="/chat"
                  className="text-slate-600 dark:text-slate-400 hover:text-[#0E52AC] dark:hover:text-[#60A5FA] transition-colors duration-200 inline-flex items-center group"
                >
                  <span className="group-hover:translate-x-1 transition-transform duration-200">
                    Start Chat
                  </span>
                </Link>
              </li>
              <li>
                <Link
                  href="/pricing"
                  className="text-slate-600 dark:text-slate-400 hover:text-[#0E52AC] dark:hover:text-[#60A5FA] transition-colors duration-200 inline-flex items-center group"
                >
                  <span className="group-hover:translate-x-1 transition-transform duration-200">
                    Pricing
                  </span>
                </Link>
              </li>
            </ul>
          </div>

          {/* Services */}
          <div>
            <h3 className="font-bold text-base sm:text-lg mb-4 sm:mb-5 text-[#111E2F] dark:text-white">
              Services
            </h3>
            <ul className="space-y-2.5 sm:space-y-3 text-sm sm:text-base">
              <li className="text-slate-600 dark:text-slate-400">
                Essay Writing
              </li>
              <li className="text-slate-600 dark:text-slate-400">
                Research Papers
              </li>
              <li className="text-slate-600 dark:text-slate-400">
                Thesis Help
              </li>
              <li className="text-slate-600 dark:text-slate-400">
                Homework Support
              </li>
              <li className="text-slate-600 dark:text-slate-400">Tutoring</li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-bold text-base sm:text-lg mb-4 sm:mb-5 text-[#111E2F] dark:text-white">
              Contact
            </h3>
            <div className="space-y-3 sm:space-y-4 text-sm sm:text-base">
              <p className="text-slate-600 dark:text-slate-400">
                <span className="font-medium text-[#0E52AC] dark:text-[#60A5FA]">
                  Email:
                </span>
                <br className="sm:hidden" />
                <a
                  href="mailto:support@assignmentghar.com"
                  className="hover:text-[#0E52AC] dark:hover:text-[#60A5FA] transition-colors ml-0 sm:ml-1"
                >
                  support@assignmentghar.com
                </a>
              </p>
              <p className="text-slate-600 dark:text-slate-400">
                <span className="font-medium text-[#0E52AC] dark:text-[#60A5FA]">
                  Phone:
                </span>
                <br className="sm:hidden" />
                <a
                  href="tel:+15551234567"
                  className="hover:text-[#0E52AC] dark:hover:text-[#60A5FA] transition-colors ml-0 sm:ml-1"
                >
                  +1 (555) 123-4567
                </a>
              </p>
              <p className="text-slate-600 dark:text-slate-400">
                <span className="font-medium text-[#0E52AC] dark:text-[#60A5FA]">
                  Hours:
                </span>
                <br />
                24/7 Support
              </p>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-slate-200 dark:border-slate-800 pt-6 sm:pt-8">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4 sm:gap-6">
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 text-center sm:text-left">
              © {currentYear} AssignmentGhar. All rights reserved.
            </p>
            <div className="flex flex-wrap justify-center gap-4 sm:gap-6 text-xs sm:text-sm">
              <Link
                href="/privacy"
                className="text-slate-600 dark:text-slate-400 hover:text-[#0E52AC] dark:hover:text-[#60A5FA] transition-colors duration-200"
              >
                Privacy Policy
              </Link>
              <Link
                href="/contact"
                className="text-slate-600 dark:text-slate-400 hover:text-[#0E52AC] dark:hover:text-[#60A5FA] transition-colors duration-200"
              >
                Terms of Service
              </Link>
              <Link
                href="/testimonials"
                className="text-slate-600 dark:text-slate-400 hover:text-[#0E52AC] dark:hover:text-[#60A5FA] transition-colors duration-200"
              >
                Testimonials
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
