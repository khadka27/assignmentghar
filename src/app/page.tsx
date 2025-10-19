import Link from "next/link";
import { services } from "@/data/services";
import { testimonials } from "@/data/testimonials";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Star, Lock, Clock, Brain, MessageSquare } from "lucide-react";

export const metadata = {
  title: "AssignmentGhar - Get Quick Assignment Help",
  description:
    "Chat directly, share your files, and get support from expert consultants — fast, secure, and confidential.",
  keywords:
    "assignment help, student consultancy, coursework assistance, academic support",
};

export default function Home() {
  return (
    <div className="w-full">
      {/* Hero Section */}
      <section className="bg-gradient-to-b from-slate-50 to-white dark:from-slate-900 dark:to-slate-950 py-20 md:py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 text-balance">
              Get quick, reliable help with your college or university
              assignments.
            </h1>
            <p className="text-lg md:text-xl text-slate-600 dark:text-slate-400 mb-8 text-balance">
              Chat directly, share your files, and get support from expert
              consultants — fast, secure, and confidential.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
              <Link href="/chat">
                <Button size="lg">Start Chat Now</Button>
              </Link>
              <Link href="/submit">
                <Button variant="outline" size="lg">
                  Submit Your Assignment
                </Button>
              </Link>
            </div>

            {/* Highlights */}
            <div className="flex flex-wrap justify-center gap-3">
              {[
                "Chat System",
                "File Sharing",
                "QR Payment",
                "Free Consultation Video",
              ].map((highlight) => (
                <Badge key={highlight} variant="default">
                  {highlight}
                </Badge>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Trust Bar */}
      <section className="bg-white dark:bg-slate-900 border-y border-slate-200 dark:border-slate-800 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="flex items-center gap-3">
              <Lock className="w-6 h-6 text-emerald-600" />
              <div className="text-left">
                <p className="text-sm font-medium">Confidential</p>
                <p className="text-xs text-slate-600 dark:text-slate-400">
                  Your data is secure
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Clock className="w-6 h-6 text-emerald-600" />
              <div className="text-left">
                <p className="text-sm font-medium">On-time Delivery</p>
                <p className="text-xs text-slate-600 dark:text-slate-400">
                  Always on schedule
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Brain className="w-6 h-6 text-emerald-600" />
              <div className="text-left">
                <p className="text-sm font-medium">Expert Consultants</p>
                <p className="text-xs text-slate-600 dark:text-slate-400">
                  Qualified professionals
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <MessageSquare className="w-6 h-6 text-emerald-600" />
              <div className="text-left">
                <p className="text-sm font-medium">24/7 Support</p>
                <p className="text-xs text-slate-600 dark:text-slate-400">
                  Always available
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section id="services" className="py-20 md:py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Our Services
            </h2>
            <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
              Expert help across multiple academic disciplines
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {services.map((service) => (
              <Card
                key={service.id}
                className="hover:shadow-lg transition-shadow"
              >
                <h3 className="text-lg font-semibold mb-2">{service.title}</h3>
                <p className="text-slate-600 dark:text-slate-400 text-sm">
                  {service.description}
                </p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="bg-slate-50 dark:bg-slate-900 py-20 md:py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              What Our Students Say
            </h2>
            <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
              Read what our students say about our assignment help service.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials.map((testimonial) => (
              <Card key={testimonial.id}>
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <p className="font-semibold">{testimonial.initials}</p>
                    <p className="text-sm text-slate-600 dark:text-slate-400">
                      {testimonial.course}
                    </p>
                  </div>
                  <div className="flex gap-1">
                    {Array.from({ length: testimonial.rating }).map((_, i) => (
                      <Star
                        key={i}
                        className="w-4 h-4 fill-emerald-600 text-emerald-600"
                      />
                    ))}
                  </div>
                </div>
                <p className="text-slate-700 dark:text-slate-300 italic">
                  "{testimonial.text}"
                </p>
              </Card>
            ))}
          </div>

          <div className="text-center mt-12">
            <Link href="/testimonials">
              <Button variant="outline">View All Testimonials</Button>
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-emerald-600 text-white py-16 md:py-24">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Ready to Get Started?
          </h2>
          <p className="text-lg mb-8 opacity-90">
            Join hundreds of students who have improved their grades with our
            expert help.
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
