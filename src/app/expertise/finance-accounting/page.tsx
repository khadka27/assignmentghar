"use client";

import Image from "next/image";
import Link from "next/link";
import {
  ArrowLeft,
  DollarSign,
  Calculator,
  TrendingUp,
  BarChart3,
} from "lucide-react";

export default function FinanceAccountingPage() {
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
                <DollarSign className="w-5 h-5" />
                <span className="font-semibold">Finance & Accounting</span>
              </div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
                💰 Analysis, Modeling, and Compliance
              </h1>
              <p className="text-lg md:text-xl text-white/90 leading-relaxed">
                Master Financial Analysis and Accounting Principles with
                Precision Support
              </p>
            </div>

            <div className="relative rounded-2xl overflow-hidden shadow-2xl">
              <Image
                src="/images/landing/areas/finance-accounting.png"
                alt="Finance & Accounting"
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
              Finance and Accounting subjects demand unparalleled accuracy,
              strong analytical skills, and a deep understanding of regulatory
              frameworks. Assignment Ghar provides specialized expertise to help
              you navigate financial modeling, complex problem sets, and
              demanding accounting coursework.
            </p>
            <p className="text-lg leading-relaxed mt-4 transition-colors text-[#284366] dark:text-[#CBD5E1]">
              Our consultants are qualified accountants and financial analysts
              dedicated to ensuring your numbers add up and your concepts are
              crystal clear.
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
                title="Financial Analysis & Valuation"
                description="Step-by-step assistance with core financial analysis tasks, including ratio analysis, discounted cash flow (DCF) valuation, risk assessment, and capital budgeting decisions."
              />

              <ServiceItem
                icon={<Calculator className="w-6 h-6" />}
                title="Problem-Solving & Coursework"
                description="Detailed guidance on solving complex problem sets, covering topics from time value of money, derivatives, portfolio management, and investment strategies."
              />

              <ServiceItem
                icon={<BarChart3 className="w-6 h-6" />}
                title="Accounting Principles"
                description="Support for managerial accounting, cost accounting, financial reporting, auditing, and tax assignments, ensuring strict compliance with standards like GAAP and IFRS."
              />

              <ServiceItem
                icon={<DollarSign className="w-6 h-6" />}
                title="Modeling & Spreadsheets"
                description="Help in developing and error-checking financial models in Excel, ensuring formula accuracy and clarity in sensitivity analysis."
              />

              <ServiceItem
                icon={<TrendingUp className="w-6 h-6" />}
                title="Concept Clarity"
                description="We break down difficult concepts like hedging, option pricing, and regulatory compliance into easily digestible steps for clear academic presentation."
              />
            </div>
          </div>

          {/* Why Choose Section */}
          <div className="rounded-2xl p-8 md:p-12 mb-12 transition-colors bg-[#F8FBFF] dark:bg-[#1E293B]">
            <h2 className="text-3xl md:text-4xl font-bold mb-8 transition-colors text-[#111E2F] dark:text-white">
              Why Trust Us with Your Numbers?
            </h2>

            <div className="space-y-6">
              <BenefitItem
                title="Precision Guaranteed"
                description="We focus on the accuracy and methodological rigor required in quantitative fields."
              />
              <BenefitItem
                title="Regulatory Knowledge"
                description="Our experts stay current on global and regional accounting standards, ensuring your work is fully compliant."
              />
              <BenefitItem
                title="Complex Problem Breakdown"
                description="We turn overwhelming financial assignments into manageable tasks through structured, clear instruction."
              />
            </div>
          </div>

          {/* CTA Section */}
          <div className="text-center">
            <h3 className="text-2xl md:text-3xl font-bold mb-6 transition-colors text-[#111E2F] dark:text-white">
              Ready to Excel in Finance & Accounting?
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
