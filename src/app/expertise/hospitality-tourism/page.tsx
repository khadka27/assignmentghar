"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, Plane, MapPin, Calendar, Globe } from "lucide-react";

export default function HospitalityTourismPage() {
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
                <Plane className="w-5 h-5" />
                <span className="font-semibold">Hospitality & Tourism</span>
              </div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
                ✈️ Global Trends, Projects, and Research
              </h1>
              <p className="text-lg md:text-xl text-white/90 leading-relaxed">
                Shine in Hospitality and Tourism with Global-Focused Academic
                Support
              </p>
            </div>

            <div className="relative rounded-2xl overflow-hidden shadow-2xl">
              <Image
                src="/images/landing/areas/hospitality-tourism.png"
                alt="Hospitality & Tourism"
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
              The Hospitality and Tourism industry is dynamic, global, and
              centered on service excellence. Your assignments require a blend
              of marketing flair, management strategy, and cultural awareness.
              Assignment Ghar provides specialized support aligned with
              international trends and academic standards.
            </p>
            <p className="text-lg leading-relaxed mt-4 transition-colors text-[#284366] dark:text-[#CBD5E1]">
              Connect with experts who have practical experience in hotel
              management, tourism planning, and event organization.
            </p>
          </div>

          {/* What We Cover Section */}
          <div className="mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-8 transition-colors text-[#111E2F] dark:text-white">
              What We Cover:
            </h2>

            <div className="space-y-8">
              <ServiceItem
                icon={<Globe className="w-6 h-6" />}
                title="Industry Research Papers"
                description="Guidance on developing well-structured research papers covering topics like sustainable tourism, destination marketing, hotel operations, and current industry challenges (e.g., post-pandemic recovery)."
              />

              <ServiceItem
                icon={<Calendar className="w-6 h-6" />}
                title="Project Reports & Planning"
                description="Assistance with practical projects, including feasibility studies for new hospitality ventures, event planning documentation, and management proposals."
              />

              <ServiceItem
                icon={<MapPin className="w-6 h-6" />}
                title="Global Alignment"
                description="We tailor your assignments to reflect specific geographical and regulatory contexts, whether you are studying in the UK, Australia, the UAE, or Canada."
              />

              <ServiceItem
                icon={<Plane className="w-6 h-6" />}
                title="Service Management Essays"
                description="Support in analyzing and articulating service quality models, customer relationship management (CRM), and guest experience strategies."
              />

              <ServiceItem
                icon={<Globe className="w-6 h-6" />}
                title="Ethical & Cultural Issues"
                description="Assistance in addressing complex ethical, cultural, and environmental issues critical to the modern tourism sector."
              />
            </div>
          </div>

          {/* Why Choose Section */}
          <div className="rounded-2xl p-8 md:p-12 mb-12 transition-colors bg-[#F8FBFF] dark:bg-[#1E293B]">
            <h2 className="text-3xl md:text-4xl font-bold mb-8 transition-colors text-[#111E2F] dark:text-white">
              Your Advantage in Hospitality:
            </h2>

            <div className="space-y-6">
              <BenefitItem
                title="Trend Awareness"
                description="We help you integrate the latest global travel and service trends into your reports, making your work relevant and current."
              />
              <BenefitItem
                title="Project Structure"
                description="We ensure your project reports are professional, logically organized, and visually engaging, meeting industry presentation standards."
              />
              <BenefitItem
                title="Academic Credibility"
                description="We help you synthesize industry data and academic theory effectively to achieve strong grades."
              />
            </div>
          </div>

          {/* CTA Section */}
          <div className="text-center">
            <h3 className="text-2xl md:text-3xl font-bold mb-6 transition-colors text-[#111E2F] dark:text-white">
              Ready to Excel in Hospitality & Tourism?
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
