"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, Settings, Wrench, Zap, Cpu } from "lucide-react";

export default function EngineeringTechnologyPage() {
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
                <Settings className="w-5 h-5" />
                <span className="font-semibold">Engineering & Technology</span>
              </div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
                ⚙️ Technical Reports, Design, and Project Submissions
              </h1>
              <p className="text-lg md:text-xl text-white/90 leading-relaxed">
                Execute Complex Engineering and Technology Projects with
                Precision
              </p>
            </div>

            <div className="relative rounded-2xl overflow-hidden shadow-2xl">
              <Image
                src="/images/landing/areas/engineering-technology.png"
                alt="Engineering & Technology"
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
              Engineering and Technology assignments are demanding, requiring
              meticulous calculations, detailed design documentation, and strong
              problem-solving skills. Assignment Ghar provides comprehensive,
              hands-on guidance to ensure your technical reports and projects
              are flawless.
            </p>
            <p className="text-lg leading-relaxed mt-4 transition-colors text-[#284366] dark:text-[#CBD5E1]">
              Our consultants are experienced engineers and technical
              specialists across various disciplines (Civil, Mechanical,
              Electrical, etc.).
            </p>
          </div>

          {/* What We Cover Section */}
          <div className="mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-8 transition-colors text-[#111E2F] dark:text-white">
              What We Cover:
            </h2>

            <div className="space-y-8">
              <ServiceItem
                icon={<Wrench className="w-6 h-6" />}
                title="Technical Reports & Analysis"
                description="Comprehensive guidance on structuring, analyzing, and documenting technical reports, integrating data, calculations, simulations, and experimental results accurately."
              />

              <ServiceItem
                icon={<Settings className="w-6 h-6" />}
                title="Design Documentation"
                description="Assistance with drafting precise design specifications, CAD/CAM documentation, fabrication guides, and project timelines that meet industry standards."
              />

              <ServiceItem
                icon={<Cpu className="w-6 h-6" />}
                title="Complex Problem Solving"
                description="Step-by-step support for advanced mathematics, physics, and technical problem sets requiring numerical methods, modeling, and simulation tools."
              />

              <ServiceItem
                icon={<Zap className="w-6 h-6" />}
                title="Project Submissions"
                description="Structured help for final-year projects, capstone projects, and thesis submissions, ensuring technical rigor and professional presentation."
              />

              <ServiceItem
                icon={<Settings className="w-6 h-6" />}
                title="Software Application"
                description="Guidance on using industry-standard software for analysis and design (e.g., MATLAB, AutoCAD, SolidWorks, specialized FEA tools)."
              />
            </div>
          </div>

          {/* Why Choose Section */}
          <div className="rounded-2xl p-8 md:p-12 mb-12 transition-colors bg-[#F8FBFF] dark:bg-[#1E293B]">
            <h2 className="text-3xl md:text-4xl font-bold mb-8 transition-colors text-[#111E2F] dark:text-white">
              Your Blueprint for Engineering Success:
            </h2>

            <div className="space-y-6">
              <BenefitItem
                title="Technical Accuracy"
                description="We rigorously check calculations, formulas, and data interpretation for technical perfection."
              />
              <BenefitItem
                title="Professional Format"
                description="We ensure all documentation is formatted professionally, meeting required technical report standards."
              />
              <BenefitItem
                title="Structured Methodology"
                description="We help you apply clear and effective methodologies for complex problem resolution."
              />
            </div>
          </div>

          {/* CTA Section */}
          <div className="text-center">
            <h3 className="text-2xl md:text-3xl font-bold mb-6 transition-colors text-[#111E2F] dark:text-white">
              Ready to Excel in Engineering & Technology?
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
