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
    <div className="min-h-screen bg-gradient-to-br from-white via-[#F0F7FF] to-[#E8F4FF] dark:from-[#0F172A] dark:via-[#1E293B] dark:to-[#0F172A]">
      {/* Hero Section */}
      <div className="relative bg-gradient-to-r from-[#0E52AC] to-[#60A5FA] overflow-hidden">
        <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10"></div>
        <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 md:w-20 md:h-20 rounded-2xl bg-white/20 backdrop-blur-sm mb-6 shadow-lg">
              <Mail className="w-8 h-8 md:w-10 md:h-10 text-white" />
            </div>
            <h1 className="text-3xl md:text-5xl font-bold text-white mb-4">
              Contact Us
            </h1>
            <p className="text-lg md:text-xl max-w-2xl mx-auto text-white/90">
              Have questions or need assistance? Get in touch with our support
              team
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Contact Form */}
          <div className="lg:col-span-2">
            <div className="bg-white dark:bg-[#1E293B] border border-[#E0EDFD] dark:border-[#475569] rounded-2xl p-8 shadow-2xl transition-all hover:shadow-3xl">
              <h2 className="text-2xl font-bold text-[#111E2F] dark:text-white mb-6">
                Send us a Message
              </h2>

              {submitted ? (
                <div className="bg-gradient-to-br from-green-50 to-[#F0F7FF] dark:from-green-900/10 dark:to-[#1E293B] border-2 border-green-500 dark:border-green-400 rounded-xl p-8 text-center">
                  <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 bg-gradient-to-br from-green-500 to-green-600 shadow-lg">
                    <Mail className="w-8 h-8 text-white" />
                  </div>
                  <p className="text-[#111E2F] dark:text-white font-bold text-xl mb-2">
                    Message sent successfully!
                  </p>
                  <p className="text-[#284366] dark:text-[#CBD5E1] text-sm">
                    We've sent a confirmation email to your inbox. We'll get
                    back to you within 24-48 hours.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div>
                    <label className="block text-sm font-semibold text-[#284366] dark:text-[#CBD5E1] mb-2">
                      Full Name
                    </label>
                    <Input
                      placeholder="Your Name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      disabled={isSubmitting}
                      className="h-12 bg-[#F8FBFF] dark:bg-[#0F172A] border-[#E0EDFD] dark:border-[#475569] text-[#111E2F] dark:text-white focus:border-[#0E52AC] focus:ring-2 focus:ring-[#0E52AC]/20 transition-all"
                    />
                    {errors.name && (
                      <p className="text-sm text-red-600 dark:text-red-400 mt-1">
                        {errors.name}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-[#284366] dark:text-[#CBD5E1] mb-2">
                      Email Address
                    </label>
                    <Input
                      type="email"
                      placeholder="you@example.com"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      disabled={isSubmitting}
                      className="h-12 bg-[#F8FBFF] dark:bg-[#0F172A] border-[#E0EDFD] dark:border-[#475569] text-[#111E2F] dark:text-white focus:border-[#0E52AC] focus:ring-2 focus:ring-[#0E52AC]/20 transition-all"
                    />
                    {errors.email && (
                      <p className="text-sm text-red-600 dark:text-red-400 mt-1">
                        {errors.email}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-[#284366] dark:text-[#CBD5E1] mb-2">
                      Subject{" "}
                      <span className="text-[#64748B] dark:text-[#94A3B8] font-normal">
                        (Optional)
                      </span>
                    </label>
                    <Input
                      placeholder="What is this about?"
                      name="subject"
                      value={formData.subject}
                      onChange={handleChange}
                      disabled={isSubmitting}
                      className="h-12 bg-[#F8FBFF] dark:bg-[#0F172A] border-[#E0EDFD] dark:border-[#475569] text-[#111E2F] dark:text-white focus:border-[#0E52AC] focus:ring-2 focus:ring-[#0E52AC]/20 transition-all"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-[#284366] dark:text-[#CBD5E1] mb-2">
                      Message
                    </label>
                    <Textarea
                      placeholder="Tell us how we can help... (minimum 10 characters)"
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      rows={6}
                      disabled={isSubmitting}
                      className="bg-[#F8FBFF] dark:bg-[#0F172A] border-[#E0EDFD] dark:border-[#475569] text-[#111E2F] dark:text-white focus:border-[#0E52AC] focus:ring-2 focus:ring-[#0E52AC]/20 resize-none transition-all"
                    />
                    {errors.message && (
                      <p className="text-sm text-red-600 dark:text-red-400 mt-1">
                        {errors.message}
                      </p>
                    )}
                    <p className="text-xs text-[#64748B] dark:text-[#94A3B8] mt-1">
                      {formData.message.length}/5000 characters
                    </p>
                  </div>

                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full h-12 bg-gradient-to-r from-[#0E52AC] to-[#60A5FA] hover:shadow-lg text-white font-bold rounded-xl disabled:opacity-50 disabled:cursor-not-allowed transition-all hover:scale-[1.02] border-0 flex items-center justify-center"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                        Sending...
                      </>
                    ) : (
                      <>
                        <Mail className="w-5 h-5 mr-2" />
                        Send Message
                      </>
                    )}
                  </Button>
                </form>
              )}
            </div>
          </div>

          {/* Contact Info Sidebar */}
          <div className="space-y-6">
            {/* Contact Information */}
            <div className="bg-white dark:bg-[#1E293B] border border-[#E0EDFD] dark:border-[#475569] rounded-2xl p-6 shadow-xl">
              <h3 className="text-lg font-bold text-[#111E2F] dark:text-white mb-5">
                Contact Information
              </h3>

              <div className="space-y-5">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-lg bg-[#0E52AC]/10 dark:bg-[#60A5FA]/10 flex items-center justify-center flex-shrink-0">
                    <Mail className="w-5 h-5 text-[#0E52AC] dark:text-[#60A5FA]" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-[#284366] dark:text-[#CBD5E1] mb-1">
                      Email
                    </p>
                    <a
                      href="mailto:assignmentghar1@gmail.com"
                      className="text-sm text-[#0E52AC] dark:text-[#60A5FA] hover:underline"
                    >
                      assignmentghar1@gmail.com
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-lg bg-[#0E52AC]/10 dark:bg-[#60A5FA]/10 flex items-center justify-center flex-shrink-0">
                    <Phone className="w-5 h-5 text-[#0E52AC] dark:text-[#60A5FA]" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-[#284366] dark:text-[#CBD5E1] mb-1">
                      Phone
                    </p>
                    <p className="text-sm text-[#64748B] dark:text-[#94A3B8]">
                      Available via email
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-lg bg-[#0E52AC]/10 dark:bg-[#60A5FA]/10 flex items-center justify-center flex-shrink-0">
                    <MapPin className="w-5 h-5 text-[#0E52AC] dark:text-[#60A5FA]" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-[#284366] dark:text-[#CBD5E1] mb-1">
                      Response Time
                    </p>
                    <p className="text-sm text-[#64748B] dark:text-[#94A3B8]">
                      Within 24-48 hours
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Note */}
            <div className="bg-gradient-to-br from-[#F0F7FF] to-white dark:from-[#1E293B] dark:to-[#0F172A] border border-[#E0EDFD] dark:border-[#475569] rounded-2xl p-6 shadow-xl">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-lg bg-[#0E52AC]/10 dark:bg-[#60A5FA]/10 flex items-center justify-center flex-shrink-0">
                  <Mail className="w-5 h-5 text-[#0E52AC] dark:text-[#60A5FA]" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-[#284366] dark:text-[#CBD5E1] mb-1">
                    Email Confirmation
                  </p>
                  <p className="text-xs text-[#64748B] dark:text-[#94A3B8] leading-relaxed">
                    You'll receive a confirmation email after submitting. Check
                    your spam folder if you don't see it.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
