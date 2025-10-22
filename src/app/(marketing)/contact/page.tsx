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
    <div className="min-h-screen bg-white dark:bg-black py-12 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-3">
            Contact Us
          </h1>
          <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Have questions or need assistance? Get in touch with our support
            team.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Contact Form */}
          <div className="lg:col-span-2">
            <div className="bg-white dark:bg-black border border-gray-200 dark:border-gray-800 rounded-lg p-8">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">
                Send us a Message
              </h2>

              {submitted ? (
                <div className="bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg p-6">
                  <p className="text-gray-900 dark:text-white font-medium mb-2">
                    Message sent successfully!
                  </p>
                  <p className="text-gray-600 dark:text-gray-400 text-sm">
                    We've sent a confirmation email to your inbox. We'll get
                    back to you within 24-48 hours.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-5">
                  <div>
                    <label className="block text-sm font-medium text-gray-900 dark:text-white mb-2">
                      Full Name
                    </label>
                    <Input
                      placeholder="John Doe"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      disabled={isSubmitting}
                      className="h-11 bg-gray-50 dark:bg-gray-900 border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white focus:border-blue-600 focus:ring-1 focus:ring-blue-600"
                    />
                    {errors.name && (
                      <p className="text-sm text-red-600 dark:text-red-400 mt-1">
                        {errors.name}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-900 dark:text-white mb-2">
                      Email Address
                    </label>
                    <Input
                      type="email"
                      placeholder="you@example.com"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      disabled={isSubmitting}
                      className="h-11 bg-gray-50 dark:bg-gray-900 border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white focus:border-blue-600 focus:ring-1 focus:ring-blue-600"
                    />
                    {errors.email && (
                      <p className="text-sm text-red-600 dark:text-red-400 mt-1">
                        {errors.email}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-900 dark:text-white mb-2">
                      Subject <span className="text-gray-500">(Optional)</span>
                    </label>
                    <Input
                      placeholder="What is this about?"
                      name="subject"
                      value={formData.subject}
                      onChange={handleChange}
                      disabled={isSubmitting}
                      className="h-11 bg-gray-50 dark:bg-gray-900 border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white focus:border-blue-600 focus:ring-1 focus:ring-blue-600"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-900 dark:text-white mb-2">
                      Message
                    </label>
                    <Textarea
                      placeholder="Tell us how we can help... (minimum 10 characters)"
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      rows={6}
                      disabled={isSubmitting}
                      className="bg-gray-50 dark:bg-gray-900 border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white focus:border-blue-600 focus:ring-1 focus:ring-blue-600 resize-none"
                    />
                    {errors.message && (
                      <p className="text-sm text-red-600 dark:text-red-400 mt-1">
                        {errors.message}
                      </p>
                    )}
                    <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                      {formData.message.length}/5000 characters
                    </p>
                  </div>

                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full h-11 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
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

          {/* Contact Info Sidebar */}
          <div className="space-y-6">
            {/* Contact Information */}
            <div className="bg-white dark:bg-black border border-gray-200 dark:border-gray-800 rounded-lg p-6">
              <h3 className="text-base font-bold text-gray-900 dark:text-white mb-5">
                Contact Information
              </h3>

              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <Mail className="w-5 h-5 text-gray-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-gray-900 dark:text-white mb-1">
                      Email
                    </p>
                    <a
                      href="mailto:assignmentghar1@gmail.com"
                      className="text-sm text-blue-600 dark:text-blue-500 hover:underline"
                    >
                      assignmentghar1@gmail.com
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Phone className="w-5 h-5 text-gray-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-gray-900 dark:text-white mb-1">
                      Phone
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Available via email
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <MapPin className="w-5 h-5 text-gray-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-gray-900 dark:text-white mb-1">
                      Response Time
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Within 24-48 hours
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Note */}
            <div className="bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg p-6">
              <div className="flex items-start gap-3">
                <Mail className="w-5 h-5 text-blue-600 dark:text-blue-500 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-gray-900 dark:text-white mb-1">
                    Email Confirmation
                  </p>
                  <p className="text-xs text-gray-600 dark:text-gray-400 leading-relaxed">
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
