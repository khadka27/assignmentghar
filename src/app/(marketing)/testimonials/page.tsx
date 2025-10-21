import { testimonials } from "@/data/testimonials";
import { Card } from "@/components/ui/card";
import { Star } from "lucide-react";

export const metadata = {
  title: "Testimonials - AssignmentGhar",
  description: "Read what our students say about our assignment help service.",
};

export default function TestimonialsPage() {
  return (
    <div className="w-full">
      {/* Hero */}
      <section className="bg-gradient-to-b from-slate-50 to-white dark:from-slate-900 dark:to-slate-950 py-20 md:py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              What Our Students Say
            </h1>
            <p className="text-lg text-slate-600 dark:text-slate-400">
              Read testimonials from students who have benefited from our expert
              assignment help.
            </p>
          </div>
        </div>
      </section>

      {/* Testimonials Grid */}
      <section className="py-20 md:py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {testimonials.map((testimonial) => (
              <Card key={testimonial.id}>
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <p className="font-semibold text-lg">
                      {testimonial.initials}
                    </p>
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
                {testimonial.approved && (
                  <p className="text-xs text-emerald-600 dark:text-emerald-400 mt-4">
                    ✓ Verified Student
                  </p>
                )}
              </Card>
            ))}
          </div>

          {/* Additional Testimonials */}
          <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-6">
            {[
              {
                initials: "M.R.",
                course: "BEng Engineering",
                text: "Excellent support throughout my project. The consultants really understood what I needed.",
                rating: 5,
              },
              {
                initials: "P.L.",
                course: "BSc Biology",
                text: "Fast turnaround and very professional. Highly recommended for any student.",
                rating: 5,
              },
            ].map((testimonial, idx) => (
              <Card key={idx}>
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <p className="font-semibold text-lg">
                      {testimonial.initials}
                    </p>
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
        </div>
      </section>

      {/* Stats */}
      <section className="bg-slate-50 dark:bg-slate-900 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div>
              <p className="text-4xl font-bold text-emerald-600 mb-2">500+</p>
              <p className="text-slate-600 dark:text-slate-400">
                Happy Students
              </p>
            </div>
            <div>
              <p className="text-4xl font-bold text-emerald-600 mb-2">4.9/5</p>
              <p className="text-slate-600 dark:text-slate-400">
                Average Rating
              </p>
            </div>
            <div>
              <p className="text-4xl font-bold text-emerald-600 mb-2">98%</p>
              <p className="text-slate-600 dark:text-slate-400">
                On-time Delivery
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
