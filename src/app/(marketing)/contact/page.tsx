"use client";

import type React from "react";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Mail, Phone, MapPin, Loader2 } from "lucide-react";

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const { toast } = useToast();

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.name || formData.name.trim().length < 2) {
      newErrors.name = "Name must be at least 2 characters long";
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email || !emailRegex.test(formData.email)) {
      newErrors.email = "Please provide a valid email address";
    }

    if (!formData.message || formData.message.trim().length < 10) {
      newErrors.message = "Message must be at least 10 characters long";
    }

    if (formData.message.trim().length > 5000) {
      newErrors.message = "Message must be less than 5000 characters";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsSubmitting(true);

    try {
      const res = await fetch("/api/contact/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.name.trim(),
          email: formData.email.trim(),
          subject: formData.subject.trim() || undefined,
          message: formData.message.trim(),
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Failed to send message");
      }

      toast({
        title: "Message sent successfully!",
        description: data.message || "We'll get back to you soon.",
      });

      setSubmitted(true);
      setFormData({ name: "", email: "", subject: "", message: "" });

      setTimeout(() => {
        setSubmitted(false);
      }, 5000);
    } catch (error: any) {
      toast({
        title: "Failed to send message",
        description:
          error.message ||
          "Please try again later or contact us directly at assignmentghar1@gmail.com",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      const newErrors = { ...errors };
      delete newErrors[name];
      setErrors(newErrors);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white dark:from-slate-900 dark:to-slate-950 py-12 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-3xl md:text-4xl font-bold mb-4">
            We Value Student Support
          </h1>
          <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
            Have questions or need assistance? Get in touch with our support
            team.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Contact Form */}
          <div className="lg:col-span-2">
            <div className="bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 p-8">
              <h2 className="text-2xl font-bold mb-6">Send us a Message</h2>

              {submitted ? (
                <div className="bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800 rounded-lg p-6 text-center">
                  <p className="text-emerald-900 dark:text-emerald-100 text-lg font-semibold mb-2">
                    ✓ Thank you for your message!
                  </p>
                  <p className="text-emerald-800 dark:text-emerald-200">
                    We've sent a confirmation email to{" "}
                    {formData.email || "your inbox"}. We'll get back to you
                    within 24-48 hours.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <Input
                    label="Full Name"
                    placeholder="John Doe"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    error={errors.name}
                    disabled={isSubmitting}
                  />

                  <Input
                    label="Email Address"
                    type="email"
                    placeholder="you@example.com"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    error={errors.email}
                    disabled={isSubmitting}
                  />

                  <Input
                    label="Subject (Optional)"
                    placeholder="What is this about?"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    disabled={isSubmitting}
                  />

                  <Textarea
                    label="Message"
                    placeholder="Tell us how we can help... (minimum 10 characters)"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    error={errors.message}
                    rows={6}
                    disabled={isSubmitting}
                  />

                  <Button
                    type="submit"
                    className="w-full"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Sending...
                      </>
                    ) : (
                      "Send Message"
                    )}
                  </Button>
                </form>
              )}
            </div>
          </div>

          {/* Contact Info */}
          <div className="space-y-6">
            <div className="bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 p-6">
              <h3 className="text-lg font-semibold mb-6">
                Contact Information
              </h3>

              <div className="space-y-4">
                <div className="flex items-start gap-4">
                  <Mail className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-1" />
                  <div>
                    <p className="font-medium">Email</p>
                    <a
                      href="mailto:assignmentghar1@gmail.com"
                      className="text-sm text-blue-600 dark:text-blue-400 hover:underline"
                    >
                      assignmentghar1@gmail.com
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <Phone className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-1" />
                  <div>
                    <p className="font-medium">Phone</p>
                    <p className="text-sm text-slate-600 dark:text-slate-400">
                      Available via email
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <MapPin className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-1" />
                  <div>
                    <p className="font-medium">Response Time</p>
                    <p className="text-sm text-slate-600 dark:text-slate-400">
                      Within 24-48 hours
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Social Links */}
            <div className="bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 p-6">
              <h3 className="text-lg font-semibold mb-4">Follow Us</h3>
              <div className="flex gap-3">
                {["Facebook", "Twitter", "LinkedIn"].map((social) => (
                  <button
                    key={social}
                    className="flex-1 py-2 px-3 bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 rounded-lg text-sm font-medium transition-colors"
                  >
                    {social}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="mt-12 p-6 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
          <div className="flex items-start gap-3">
            <Mail className="w-5 h-5 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold text-blue-900 dark:text-blue-100 mb-2">
                📧 Email Confirmation
              </p>
              <p className="text-sm text-blue-800 dark:text-blue-200">
                After submitting your message, you'll receive a confirmation
                email. Please check your spam folder if you don't see it in your
                inbox within a few minutes.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
