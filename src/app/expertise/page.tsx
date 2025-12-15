"use client";

import Image from "next/image";
import Link from "next/link";
import {
  ArrowLeft,
  Code,
  Briefcase,
  DollarSign,
  Plane,
  Heart,
  Settings,
} from "lucide-react";

export default function ExpertisePage() {
  return (
    <div className="min-h-screen transition-colors bg-white dark:bg-[#0A0F1E]">
      {/* Hero Section */}
      <div className="relative py-16 md:py-24 transition-colors bg-gradient-to-br from-[#0E52AC] to-[#60A5FA]">
        <div className="container mx-auto px-6 md:px-8 lg:px-12">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-white/90 hover:text-white mb-8 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Home</span>
          </Link>

          <div className="text-center text-white max-w-4xl mx-auto">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
              Our Areas of Expertise
            </h1>
            <p className="text-lg md:text-xl text-white/90 leading-relaxed">
              We help students across diverse academic backgrounds achieve
              excellence through expert guidance, subject-focused insights, and
              personalized support. Each subject area is handled by experts who
              understand global university standards, ensuring accuracy,
              originality and academic integrity in every submission.
            </p>
          </div>
        </div>
      </div>

      {/* Expertise Cards Grid */}
      <div className="py-16 md:py-20">
        <div className="container mx-auto px-6 md:px-8 lg:px-12">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
            <ExpertiseCard
              href="/expertise/it-computer-science"
              icon={<Code className="w-8 h-8" />}
              image="/images/landing/areas/it-computer-science.png"
              title="IT & Computer Science"
              subtitle="💻 Coding, System Design & Technical Reporting"
              description="Comprehensive support for programming assignments, software development, system architecture, and technical documentation tailored to university standards."
            />

            <ExpertiseCard
              href="/expertise/business-management"
              icon={<Briefcase className="w-8 h-8" />}
              image="/images/landing/areas/business-management.png"
              title="Business & Management"
              subtitle="📈 Strategy, Case Studies & Research"
              description="Professional support for business plans, case studies, strategic reports, and research assignments with real-world context and academic rigor."
            />

            <ExpertiseCard
              href="/expertise/finance-accounting"
              icon={<DollarSign className="w-8 h-8" />}
              image="/images/landing/areas/finance-accounting.png"
              title="Finance & Accounting"
              subtitle="💰 Analysis, Modeling & Compliance"
              description="Specialized expertise for financial analysis, accounting principles, modeling, and compliance with GAAP and IFRS standards."
            />

            <ExpertiseCard
              href="/expertise/hospitality-tourism"
              icon={<Plane className="w-8 h-8" />}
              image="/images/landing/areas/hospitality-tourism.png"
              title="Hospitality & Tourism"
              subtitle="✈️ Global Trends, Projects & Research"
              description="Expert guidance for hospitality and tourism assignments aligned with international trends, industry standards, and academic excellence."
            />

            <ExpertiseCard
              href="/expertise/nursing-healthcare"
              icon={<Heart className="w-8 h-8" />}
              image="/images/landing/areas/nursing-healthcare.png"
              title="Nursing & Healthcare"
              subtitle="🩺 Care Plans, Reflective Practice & Clinical Context"
              description="Evidence-based support for nursing assignments, care plans, reflective journals, and healthcare research with clinical accuracy."
            />

            <ExpertiseCard
              href="/expertise/engineering-technology"
              icon={<Settings className="w-8 h-8" />}
              image="/images/landing/areas/engineering-technology.png"
              title="Engineering & Technology"
              subtitle="⚙️ Technical Reports, Design & Project Submissions"
              description="Comprehensive guidance for engineering projects, technical reports, design documentation, and complex problem-solving across all disciplines."
            />
          </div>

          {/* CTA Section */}
          <div className="mt-16 md:mt-20 text-center">
            <div className="max-w-3xl mx-auto rounded-2xl p-8 md:p-12 transition-colors bg-[#F8FBFF] dark:bg-[#1E293B]">
              <h2 className="text-3xl md:text-4xl font-bold mb-4 transition-colors text-[#111E2F] dark:text-white">
                Ready to Get Expert Help?
              </h2>
              <p className="text-lg mb-8 transition-colors text-[#284366] dark:text-[#CBD5E1]">
                No matter what subject you're studying, our expert consultants
                are here to guide your academic success with personalized,
                professional support.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/chat">
                  <button className="px-8 py-4 rounded-xl font-semibold text-white text-base transition-all hover:opacity-90 hover:shadow-xl hover:scale-105 bg-gradient-to-r from-[#0E52AC] to-[#60A5FA]">
                    Start Chat Now
                  </button>
                </Link>
                <Link href="/submit">
                  <button className="px-8 py-4 rounded-xl font-semibold text-base border-2 transition-all hover:shadow-xl hover:scale-105 text-[#0E52AC] dark:text-[#60A5FA] border-[#0E52AC] dark:border-[#60A5FA] bg-white dark:bg-[#0A0F1E]">
                    Submit Assignment
                  </button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

interface ExpertiseCardProps {
  href: string;
  icon: React.ReactNode;
  image: string;
  title: string;
  subtitle: string;
  description: string;
}

const ExpertiseCard: React.FC<ExpertiseCardProps> = ({
  href,
  icon,
  image,
  title,
  subtitle,
  description,
}) => {
  return (
    <Link href={href}>
      <div className="group h-full rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 bg-white dark:bg-[#1E293B] border border-transparent hover:border-[#0E52AC]/20 dark:hover:border-[#60A5FA]/20 transform hover:-translate-y-2">
        {/* Image */}
        <div className="relative h-48 overflow-hidden">
          <Image
            src={image}
            alt={title}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-110"
            unoptimized
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />

          {/* Icon Badge */}
          <div className="absolute top-4 right-4">
            <div className="w-12 h-12 rounded-lg flex items-center justify-center transition-colors bg-white/90 dark:bg-[#1E293B]/90 text-[#0E52AC] dark:text-[#60A5FA] backdrop-blur-sm">
              {icon}
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          <h3 className="text-xl font-bold mb-2 transition-colors text-[#111E2F] dark:text-white group-hover:text-[#0E52AC] dark:group-hover:text-[#60A5FA]">
            {title}
          </h3>
          <p className="text-sm font-semibold mb-3 transition-colors text-[#0E52AC] dark:text-[#60A5FA]">
            {subtitle}
          </p>
          <p className="text-sm leading-relaxed transition-colors text-[#284366] dark:text-[#CBD5E1]">
            {description}
          </p>

          {/* Learn More Link */}
          <div className="mt-4 flex items-center gap-2 text-sm font-semibold transition-all group-hover:gap-3 text-[#0E52AC] dark:text-[#60A5FA]">
            <span>Learn More</span>
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
          </div>
        </div>
      </div>
    </Link>
  );
};
