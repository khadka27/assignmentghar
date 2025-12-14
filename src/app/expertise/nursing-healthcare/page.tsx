"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, Heart, FileText, Shield, Activity } from "lucide-react";

export default function NursingHealthcarePage() {
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
                <Heart className="w-5 h-5" />
                <span className="font-semibold">Nursing & Healthcare</span>
              </div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
                🩺 Care Plans, Reflective Practice, and Clinical Context
              </h1>
              <p className="text-lg md:text-xl text-white/90 leading-relaxed">
                Navigate Nursing and Healthcare Coursework with Accuracy and
                Compassion
              </p>
            </div>

            <div className="relative rounded-2xl overflow-hidden shadow-2xl">
              <Image
                src="/images/landing/areas/nursing-healthcare.png"
                alt="Nursing & Healthcare"
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
              Assignments in Nursing and Healthcare require not only deep
              theoretical knowledge but also the ethical application of clinical
              skills. Assignment Ghar provides support that is grounded in
              evidence-based practice and sensitive to real-life medical
              contexts.
            </p>
            <p className="text-lg leading-relaxed mt-4 transition-colors text-[#284366] dark:text-[#CBD5E1]">
              Our consultants include qualified nurses and healthcare educators
              committed to maintaining the highest standards of care and
              academic integrity.
            </p>
          </div>

          {/* What We Cover Section */}
          <div className="mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-8 transition-colors text-[#111E2F] dark:text-white">
              What We Cover:
            </h2>

            <div className="space-y-8">
              <ServiceItem
                icon={<FileText className="w-6 h-6" />}
                title="Accurate Care Plans"
                description="Step-by-step assistance in drafting comprehensive, patient-centered, and evidence-based care plans that adhere to clinical guidelines and local protocols."
              />

              <ServiceItem
                icon={<Heart className="w-6 h-6" />}
                title="Reflective Journals & Essays"
                description="Guidance on structuring insightful and professional reflective journals and essays that link practical clinical experiences to theoretical frameworks and ethical reasoning."
              />

              <ServiceItem
                icon={<Activity className="w-6 h-6" />}
                title="Academic Reports & Research"
                description="Support for writing clinical audit reports, research summaries, and dissertations, ensuring accurate referencing and adherence to medical reporting standards."
              />

              <ServiceItem
                icon={<Shield className="w-6 h-6" />}
                title="Public Health & Policy"
                description="Help with assignments covering epidemiology, health promotion, policy analysis, and community health planning."
              />

              <ServiceItem
                icon={<Heart className="w-6 h-6" />}
                title="Ethical Dilemma Analysis"
                description="Structured guidance on analyzing and addressing complex ethical and legal issues in healthcare practice."
              />
            </div>
          </div>

          {/* Why Choose Section */}
          <div className="rounded-2xl p-8 md:p-12 mb-12 transition-colors bg-[#F8FBFF] dark:bg-[#1E293B]">
            <h2 className="text-3xl md:text-4xl font-bold mb-8 transition-colors text-[#111E2F] dark:text-white">
              Building Trust in Healthcare Education:
            </h2>

            <div className="space-y-6">
              <BenefitItem
                title="Evidence-Based Practice"
                description="We ensure all guidance is rooted in current, accepted medical literature and best practices."
              />
              <BenefitItem
                title="Confidentiality & Ethics"
                description="We emphasize the ethical and confidential handling of patient data and scenarios within academic work."
              />
              <BenefitItem
                title="Real-Life Context"
                description="We bridge the gap between classroom theory and the clinical environment, making your assignments highly relevant."
              />
            </div>
          </div>

          {/* CTA Section */}
          <div className="text-center">
            <h3 className="text-2xl md:text-3xl font-bold mb-6 transition-colors text-[#111E2F] dark:text-white">
              Ready to Excel in Nursing & Healthcare?
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
