"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, Code, Database, Shield, Cpu } from "lucide-react";

export default function ITComputerSciencePage() {
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
                <Code className="w-5 h-5" />
                <span className="font-semibold">IT & Computer Science</span>
              </div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
                💻 Coding, System Design, and Technical Reporting
              </h1>
              <p className="text-lg md:text-xl text-white/90 leading-relaxed">
                Conquer Your IT and Computer Science Assignments with Expert
                Support
              </p>
            </div>

            <div className="relative rounded-2xl overflow-hidden shadow-2xl">
              <Image
                src="/images/landing/areas/it-computer-science.png"
                alt="IT & Computer Science"
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
              The world of IT and Computer Science demands precision, technical
              expertise, and innovation. Whether you are struggling with complex
              algorithms, system architecture, or technical documentation,
              Assignment Ghar connects you with professional developers and IT
              consultants ready to guide your success.
            </p>
            <p className="text-lg leading-relaxed mt-4 transition-colors text-[#284366] dark:text-[#CBD5E1]">
              Our service provides comprehensive help tailored to university
              standards, ensuring your work is academically rigorous and
              technically sound.
            </p>
          </div>

          {/* What We Cover Section */}
          <div className="mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-8 transition-colors text-[#111E2F] dark:text-white">
              What We Cover:
            </h2>

            <div className="space-y-8">
              <ServiceItem
                icon={<Code className="w-6 h-6" />}
                title="Coding & Debugging Assistance"
                description="Get line-by-line support for programming assignments in languages like Python, Java, C++, JavaScript, and more. We help you fix logical errors, optimize performance, and understand complex data structures and algorithms."
              />

              <ServiceItem
                icon={<Cpu className="w-6 h-6" />}
                title="Software Development Lifecycle"
                description="Guidance through the full SDLC, including requirement gathering, system analysis, design documentation, and testing procedures for small or large-scale projects."
              />

              <ServiceItem
                icon={<Database className="w-6 h-6" />}
                title="System Design & Architecture"
                description="Expert help with designing scalable, secure, and efficient systems, network topologies, cloud environments, and database management solutions."
              />

              <ServiceItem
                icon={<Shield className="w-6 h-6" />}
                title="Technical Report Writing"
                description="Professional support in structuring, phrasing, and formatting technical reports, thesis chapters, and user documentation that clearly communicates complex concepts to a technical audience."
              />

              <ServiceItem
                icon={<Code className="w-6 h-6" />}
                title="Specialized Fields"
                description="Assistance in areas like cybersecurity, machine learning, artificial intelligence (AI), web development, and mobile application development."
              />
            </div>
          </div>

          {/* Why Choose Section */}
          <div className="rounded-2xl p-8 md:p-12 mb-12 transition-colors bg-[#F8FBFF] dark:bg-[#1E293B]">
            <h2 className="text-3xl md:text-4xl font-bold mb-8 transition-colors text-[#111E2F] dark:text-white">
              Why Choose Assignment Ghar for IT & CS?
            </h2>

            <div className="space-y-6">
              <BenefitItem
                title="Industry Expertise"
                description="Our consultants include seasoned software engineers and IT professionals who understand real-world application alongside academic theory."
              />
              <BenefitItem
                title="Plagiarism-Free Projects"
                description="We guide you in developing original code and documentation, prioritizing academic integrity and ensuring your work is unique."
              />
              <BenefitItem
                title="Adherence to Standards"
                description="We ensure your assignments follow strict formatting and referencing guidelines (e.g., IEEE style) expected in technical fields."
              />
            </div>
          </div>

          {/* CTA Section */}
          <div className="text-center">
            <h3 className="text-2xl md:text-3xl font-bold mb-6 transition-colors text-[#111E2F] dark:text-white">
              Ready to Excel in Your IT & Computer Science Studies?
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
