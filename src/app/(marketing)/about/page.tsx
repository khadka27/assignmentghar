import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { CheckCircle } from "lucide-react";

export const metadata = {
  title: "About AssignmentGhar - Our Mission & Values",
  description:
    "Learn about our mission to help students succeed with expert assignment consultancy.",
};

export default function AboutPage() {
  const values = [
    {
      title: "Student Success",
      description:
        "We're committed to helping every student achieve their academic goals.",
    },
    {
      title: "Trust & Confidentiality",
      description: "Your privacy and data security are our top priorities.",
    },
    {
      title: "On-time Delivery",
      description:
        "We respect your deadlines and deliver quality work on schedule.",
    },
    {
      title: "Academic Integrity",
      description:
        "We provide guidance and support while maintaining academic standards.",
    },
  ];

  return (
    <div className="w-full">
      {/* Hero */}
      <section className="bg-gradient-to-b from-[#F8FBFF] to-white dark:from-[#0A0F1E] dark:to-[#1E293B] py-20 md:py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6 text-[#111E2F] dark:text-white">
              About AssignmentGhar
            </h1>
            <p className="text-lg text-[#284366] dark:text-[#CBD5E1]">
              We&apos;re dedicated to helping students succeed by providing
              expert assignment consultancy and support.
            </p>
          </div>
        </div>
      </section>

      {/* Mission */}
      <section className="py-20 md:py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold mb-6 text-[#111E2F] dark:text-white">
                Our Mission
              </h2>
              <p className="text-lg text-[#284366] dark:text-[#CBD5E1] mb-4">
                AssignmentGhar was founded with a simple mission: to provide
                reliable, confidential, and expert help to students pursuing
                higher education.
              </p>
              <p className="text-lg text-[#284366] dark:text-[#CBD5E1] mb-6">
                We believe every student deserves access to quality guidance and
                support. Our team of experienced consultants is here to help you
                navigate your coursework and achieve academic excellence.
              </p>
              <Link href="/chat">
                <Button className="bg-[#0E52AC] hover:bg-[#0A3D7F]">
                  Start Free Consultation
                </Button>
              </Link>
            </div>
            <div className="bg-[#F8FBFF] dark:bg-[#1E293B] rounded-lg h-64 flex items-center justify-center">
              <p className="text-[#284366] dark:text-[#CBD5E1]">
                Mission Image Placeholder
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="bg-[#F8FBFF] dark:bg-[#1E293B] py-20 md:py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-[#111E2F] dark:text-white">
              Our Values
            </h2>
            <p className="text-lg text-[#284366] dark:text-[#CBD5E1] max-w-2xl mx-auto">
              These core values guide everything we do
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {values.map((value, idx) => (
              <Card
                key={idx}
                className="flex gap-4 bg-white dark:bg-[#0A0F1E] border-[#E0EDFD] dark:border-[#475569]"
              >
                <CheckCircle className="w-6 h-6 text-[#0E52AC] flex-shrink-0" />
                <div>
                  <h3 className="font-semibold mb-2 text-[#111E2F] dark:text-white">
                    {value.title}
                  </h3>
                  <p className="text-[#284366] dark:text-[#CBD5E1] text-sm">
                    {value.description}
                  </p>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-[#0E52AC] text-white py-16 md:py-24">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Ready to Get Started?
          </h2>
          <p className="text-lg mb-8 opacity-90">
            Join thousands of students who trust AssignmentGhar.
          </p>
          <Link href="/chat">
            <Button
              size="lg"
              className="bg-white text-[#0E52AC] hover:bg-[#F8FBFF]"
            >
              Start Your Free Consultation
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
}
