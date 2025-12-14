"use client";

import Image from "next/image";
import Link from "next/link";
import {
  ArrowLeft,
  TrendingUp,
  FileText,
  Users,
  Briefcase,
} from "lucide-react";

export default function BusinessManagementPage() {
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

          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="text-white">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm mb-6">
                <Briefcase className="w-5 h-5" />
                <span className="font-semibold">Business & Management</span>
              </div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
                📈 Strategy, Case Studies, and Research
              </h1>
              <p className="text-lg md:text-xl text-white/90 leading-relaxed">
                Achieve Excellence in Your Business and Management Coursework
              </p>
            </div>

            <div className="relative rounded-2xl overflow-hidden shadow-2xl">
              <Image
                src="/images/landing/areas/business-management.png"
                alt="Business & Management"
                width={600}
                height={400}
                className="w-full h-auto object-cover"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="py-16 md:py-20">
        <div className="container mx-auto px-6 md:px-8 lg:px-12 max-w-5xl">
          {/* Introduction */}
          <div className="mb-12">
            <p className="text-lg leading-relaxed transition-colors text-[#284366] dark:text-[#CBD5E1]">
              From microeconomics to international strategy, Business and
              Management degrees require a balance of theoretical understanding
              and practical decision-making. Assignment Ghar offers professional
              support to help you analyze market trends, craft compelling
              strategic reports, and conduct insightful research.
            </p>
            <p className="text-lg leading-relaxed mt-4 transition-colors text-[#284366] dark:text-[#CBD5E1]">
              Our expert consultants—including MBAs and industry leaders—provide
              personalized guidance that injects real-world context into your
              academic work.
            </p>
          </div>

          {/* What We Cover Section */}
          <div className="mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-8 transition-colors text-[#111E2F] dark:text-white">
              What We Cover:
            </h2>

            <div className="space-y-8">
              <ServiceItem
                icon={<TrendingUp className="w-6 h-6" />}
                title="Strategic Reports & Planning"
                description="Assistance with developing robust business plans, market entry strategies, competitive analysis, and strategic management reports."
              />

              <ServiceItem
                icon={<FileText className="w-6 h-6" />}
                title="In-Depth Case Study Analysis"
                description="Step-by-step guidance on dissecting complex business scenarios, applying relevant theoretical frameworks, and formulating justified, actionable recommendations."
              />

              <ServiceItem
                icon={<Users className="w-6 h-6" />}
                title="Research Assignments & Dissertations"
                description="Full support for developing research proposals, literature reviews, methodology design (qualitative and quantitative), and sophisticated data interpretation."
              />

              <ServiceItem
                icon={<Briefcase className="w-6 h-6" />}
                title="Functional Expertise"
                description="Detailed help in core areas like Marketing, Human Resource Management (HRM), Operations Management, and Organizational Behaviour."
              />

              <ServiceItem
                icon={<FileText className="w-6 h-6" />}
                title="Presentation and Report Structure"
                description="Ensure your papers are professionally formatted, clearly structured, and written with the persuasive, professional tone required in business communication."
              />
            </div>
          </div>

          {/* Why Choose Section */}
          <div className="rounded-2xl p-8 md:p-12 mb-12 transition-colors bg-[#F8FBFF] dark:bg-[#1E293B]">
            <h2 className="text-3xl md:text-4xl font-bold mb-8 transition-colors text-[#111E2F] dark:text-white">
              Your Success Partner in Business:
            </h2>

            <div className="space-y-6">
              <BenefitItem
                title="Real-World Context"
                description="We bridge the gap between textbook theory and practical business challenges, enriching the quality of your analysis."
              />
              <BenefitItem
                title="Academic Rigor"
                description="We ensure correct application of management theories (e.g., Porter's Five Forces, SWOT, PESTEL) and accurate referencing styles (e.g., APA, Harvard)."
              />
              <BenefitItem
                title="Clarity and Structure"
                description="We help you organize complex information into clear, compelling reports and essays that achieve top marks."
              />
            </div>
          </div>

          {/* CTA Section */}
          <div className="text-center">
            <h3 className="text-2xl md:text-3xl font-bold mb-6 transition-colors text-[#111E2F] dark:text-white">
              Ready to Excel in Business & Management?
            </h3>
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
  );
}

interface ServiceItemProps {
  icon: React.ReactNode;
  title: string;
  description: string;
}

const ServiceItem: React.FC<ServiceItemProps> = ({
  icon,
  title,
  description,
}) => {
  return (
    <div className="flex gap-4">
      <div className="flex-shrink-0">
        <div className="w-12 h-12 rounded-lg flex items-center justify-center transition-colors bg-[#0E52AC] text-white">
          {icon}
        </div>
      </div>
      <div>
        <h3 className="text-xl font-bold mb-2 transition-colors text-[#111E2F] dark:text-white">
          {title}
        </h3>
        <p className="text-base leading-relaxed transition-colors text-[#284366] dark:text-[#CBD5E1]">
          {description}
        </p>
      </div>
    </div>
  );
};

interface BenefitItemProps {
  title: string;
  description: string;
}

const BenefitItem: React.FC<BenefitItemProps> = ({ title, description }) => {
  return (
    <div>
      <h4 className="text-lg font-bold mb-2 transition-colors text-[#0E52AC] dark:text-[#60A5FA]">
        {title}
      </h4>
      <p className="text-base leading-relaxed transition-colors text-[#284366] dark:text-[#CBD5E1]">
        {description}
      </p>
    </div>
  );
};
