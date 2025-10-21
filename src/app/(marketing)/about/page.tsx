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
      <section className="bg-gradient-to-b from-slate-50 to-white dark:from-slate-900 dark:to-slate-950 py-20 md:py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              About AssignmentGhar
            </h1>
            <p className="text-lg text-slate-600 dark:text-slate-400">
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
              <h2 className="text-3xl font-bold mb-6">Our Mission</h2>
              <p className="text-lg text-slate-600 dark:text-slate-400 mb-4">
                AssignmentGhar was founded with a simple mission: to provide
                reliable, confidential, and expert help to students pursuing
                higher education.
              </p>
              <p className="text-lg text-slate-600 dark:text-slate-400 mb-6">
                We believe every student deserves access to quality guidance and
                support. Our team of experienced consultants is here to help you
                navigate your coursework and achieve academic excellence.
              </p>
              <Link href="/chat">
                <Button>Start Free Consultation</Button>
              </Link>
            </div>
            <div className="bg-slate-100 dark:bg-slate-800 rounded-lg h-64 flex items-center justify-center">
              <p className="text-slate-500 dark:text-slate-400">
                Mission Image Placeholder
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="bg-slate-50 dark:bg-slate-900 py-20 md:py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Our Values</h2>
            <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
              These core values guide everything we do
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {values.map((value, idx) => (
              <Card key={idx} className="flex gap-4">
                <CheckCircle className="w-6 h-6 text-emerald-600 flex-shrink-0" />
                <div>
                  <h3 className="font-semibold mb-2">{value.title}</h3>
                  <p className="text-slate-600 dark:text-slate-400 text-sm">
                    {value.description}
                  </p>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-emerald-600 text-white py-16 md:py-24">
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
              className="bg-white text-emerald-600 hover:bg-slate-100"
            >
              Start Your Free Consultation
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
}
