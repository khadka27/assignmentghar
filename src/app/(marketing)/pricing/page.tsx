import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export const metadata = {
  title: "Pricing - AssignmentGhar",
  description: "Transparent pricing for assignment help services.",
};

export default function PricingPage() {
  return (
    <div className="w-full">
      {/* Hero */}
      <section className="bg-gradient-to-b from-slate-50 to-white dark:from-slate-900 dark:to-slate-950 py-20 md:py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              Transparent Pricing
            </h1>
            <p className="text-lg text-slate-600 dark:text-slate-400">
              Pricing is case-by-case based on your assignment complexity and
              deadline.
            </p>
          </div>
        </div>
      </section>

      {/* Pricing Info */}
      <section className="py-20 md:py-32">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <Card>
              <h3 className="text-2xl font-bold mb-4">How It Works</h3>
              <ul className="space-y-3 text-slate-600 dark:text-slate-400">
                <li className="flex gap-3">
                  <span className="text-emerald-600 font-bold">1.</span>
                  <span>Submit your assignment details</span>
                </li>
                <li className="flex gap-3">
                  <span className="text-emerald-600 font-bold">2.</span>
                  <span>Get a custom quote from our team</span>
                </li>
                <li className="flex gap-3">
                  <span className="text-emerald-600 font-bold">3.</span>
                  <span>Pay via secure QR code</span>
                </li>
                <li className="flex gap-3">
                  <span className="text-emerald-600 font-bold">4.</span>
                  <span>Work begins after payment confirmation</span>
                </li>
              </ul>
            </Card>

            <Card>
              <h3 className="text-2xl font-bold mb-4">
                Factors Affecting Price
              </h3>
              <ul className="space-y-3 text-slate-600 dark:text-slate-400">
                <li className="flex gap-3">
                  <span className="text-emerald-600">•</span>
                  <span>Assignment complexity and length</span>
                </li>
                <li className="flex gap-3">
                  <span className="text-emerald-600">•</span>
                  <span>Subject area and expertise required</span>
                </li>
                <li className="flex gap-3">
                  <span className="text-emerald-600">•</span>
                  <span>Deadline urgency</span>
                </li>
                <li className="flex gap-3">
                  <span className="text-emerald-600">•</span>
                  <span>Specific requirements and formatting</span>
                </li>
              </ul>
            </Card>
          </div>

          {/* CTA */}
          <div className="mt-12 bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800 rounded-lg p-8 text-center">
            <h3 className="text-2xl font-bold mb-4">Get Your Custom Quote</h3>
            <p className="text-slate-600 dark:text-slate-400 mb-6">
              Submit your assignment and receive a personalized quote within 24
              hours.
            </p>
            <Link href="/submit">
              <Button>Submit Assignment</Button>
            </Link>
          </div>

          {/* Payment Info */}
          <div className="mt-12 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-6">
            <h4 className="font-semibold mb-2 text-blue-900 dark:text-blue-100">
              Payment Method
            </h4>
            <p className="text-sm text-blue-900 dark:text-blue-100">
              We accept payments via secure QR code. Work begins after payment
              is confirmed. No hidden fees.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
