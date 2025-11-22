"use client";

import type React from "react";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import axios from "axios";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import {
  Loader2,
  FileText,
  Upload,
  CheckCircle2,
  Calendar,
  User,
  Mail,
} from "lucide-react";

export default function SubmitPage() {
  const { data: session } = useSession();
  const router = useRouter();
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    name: session?.user?.name || "",
    email: session?.user?.email || "",
    course: "",
    customCourse: "",
    subject: "",
    deadline: "",
    message: "",
  });
  const [file, setFile] = useState<File | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const courses = [
    { value: "IT & Computer Science", label: "IT & Computer Science" },
    { value: "Business & Management", label: "Business & Management" },
    { value: "Finance & Accounting", label: "Finance & Accounting" },
    { value: "Hospitality & Tourism", label: "Hospitality & Tourism" },
    { value: "custom", label: "Other (Specify)" },
  ];

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.name) newErrors.name = "Name is required";
    if (!formData.email) newErrors.email = "Email is required";
    if (!formData.course) newErrors.course = "Course is required";
    if (formData.course === "custom" && !formData.customCourse) {
      newErrors.customCourse = "Please specify your course";
    }
    if (!formData.deadline) newErrors.deadline = "Deadline is required";
    if (!file) newErrors.file = "Module guide file is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsSubmitting(true);

    try {
      const formDataToSend = new FormData();
      formDataToSend.append("name", formData.name);
      formDataToSend.append("email", formData.email);
      formDataToSend.append(
        "course",
        formData.course === "custom" ? formData.customCourse : formData.course
      );
      formDataToSend.append(
        "subject",
        formData.subject || formData.course === "custom"
          ? formData.customCourse
          : formData.course
      );
      formDataToSend.append("deadline", formData.deadline);
      formDataToSend.append("message", formData.message);
      if (file) {
        formDataToSend.append("file", file);
      }

      const response = await axios.post("/api/assignments", formDataToSend, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      toast({
        title: "Success!",
        description:
          "Assignment submitted successfully! Redirecting to chat...",
      });

      setSubmitted(true);

      setTimeout(() => {
        router.push("/chat");
      }, 2000);
    } catch (error: any) {
      console.error("Submission error:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description:
          error.response?.data?.error || "Failed to submit assignment",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      const newErrors = { ...errors };
      delete newErrors[name];
      setErrors(newErrors);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      if (
        ![
          "application/pdf",
          "application/msword",
          "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        ].includes(selectedFile.type)
      ) {
        setErrors({
          ...errors,
          file: "Only PDF and Word documents are allowed",
        });
        return;
      }
      setFile(selectedFile);
      if (errors.file) {
        const newErrors = { ...errors };
        delete newErrors.file;
        setErrors(newErrors);
      }
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
              <Upload className="w-8 h-8 md:w-10 md:h-10 text-white" />
            </div>
            <h1 className="text-3xl md:text-5xl font-bold text-white mb-4">
              Submit Your Assignment
            </h1>
            <p className="text-lg md:text-xl max-w-2xl mx-auto text-white/90">
              Upload your assignment guide and our expert team will provide
              personalized assistance
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pb-16">
        {!submitted ? (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Side - Tips & Info */}
            <div className="lg:col-span-1 space-y-6">
              {/* Quick Tips Card */}
              <div className="border rounded-2xl p-6 shadow-xl bg-gradient-to-br from-[#F0F7FF] to-white dark:from-[#1E293B] dark:to-[#0F172A] border-[#E0EDFD] dark:border-[#475569]">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-lg bg-[#0E52AC]/10 dark:bg-[#60A5FA]/10 flex items-center justify-center">
                    <FileText className="w-5 h-5 text-[#0E52AC] dark:text-[#60A5FA]" />
                  </div>
                  <h3 className="text-lg font-bold text-[#111E2F] dark:text-white">
                    Quick Tips
                  </h3>
                </div>
                <ul className="space-y-3">
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-green-600 dark:text-green-400 mt-0.5 flex-shrink-0" />
                    <span className="text-sm text-[#64748B] dark:text-[#94A3B8]">
                      Upload your complete module guide for accurate assistance
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-green-600 dark:text-green-400 mt-0.5 flex-shrink-0" />
                    <span className="text-sm text-[#64748B] dark:text-[#94A3B8]">
                      Provide a realistic deadline to ensure quality work
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-green-600 dark:text-green-400 mt-0.5 flex-shrink-0" />
                    <span className="text-sm text-[#64748B] dark:text-[#94A3B8]">
                      Include any specific requirements in the message box
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-green-600 dark:text-green-400 mt-0.5 flex-shrink-0" />
                    <span className="text-sm text-[#64748B] dark:text-[#94A3B8]">
                      Our experts will review and respond within 24 hours
                    </span>
                  </li>
                </ul>
              </div>

              {/* What Happens Next Card */}
              <div className="border rounded-2xl p-6 shadow-xl bg-gradient-to-br from-[#F0F7FF] to-white dark:from-[#1E293B] dark:to-[#0F172A] border-[#E0EDFD] dark:border-[#475569]">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-lg bg-[#0E52AC]/10 dark:bg-[#60A5FA]/10 flex items-center justify-center">
                    <Calendar className="w-5 h-5 text-[#0E52AC] dark:text-[#60A5FA]" />
                  </div>
                  <h3 className="text-lg font-bold text-[#111E2F] dark:text-white">
                    What Happens Next?
                  </h3>
                </div>
                <div className="space-y-4">
                  <div className="flex gap-3">
                    <div className="w-8 h-8 rounded-full bg-[#0E52AC] text-white flex items-center justify-center text-sm font-bold flex-shrink-0">
                      1
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-[#284366] dark:text-[#CBD5E1]">
                        Instant Confirmation
                      </p>
                      <p className="text-xs text-[#64748B] dark:text-[#94A3B8] mt-1">
                        Receive immediate confirmation of your submission
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <div className="w-8 h-8 rounded-full bg-[#0E52AC] text-white flex items-center justify-center text-sm font-bold flex-shrink-0">
                      2
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-[#284366] dark:text-[#CBD5E1]">
                        Expert Review
                      </p>
                      <p className="text-xs text-[#64748B] dark:text-[#94A3B8] mt-1">
                        Our team analyzes your requirements
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <div className="w-8 h-8 rounded-full bg-[#0E52AC] text-white flex items-center justify-center text-sm font-bold flex-shrink-0">
                      3
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-[#284366] dark:text-[#CBD5E1]">
                        Direct Chat
                      </p>
                      <p className="text-xs text-[#64748B] dark:text-[#94A3B8] mt-1">
                        Get personalized assistance via chat
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Support Card */}
              <div className="border rounded-2xl p-6 shadow-xl bg-gradient-to-br from-[#F0F7FF] to-white dark:from-[#1E293B] dark:to-[#0F172A] border-[#E0EDFD] dark:border-[#475569]">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-lg bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                    <CheckCircle2 className="w-5 h-5 text-green-600 dark:text-green-400" />
                  </div>
                  <h3 className="text-lg font-bold text-[#111E2F] dark:text-white">
                    Need Help?
                  </h3>
                </div>
                <p className="text-sm text-[#64748B] dark:text-[#94A3B8] mb-4">
                  Our support team is available 24/7 to assist you with any
                  questions.
                </p>
                <Link href="/contact">
                  <Button className="w-full h-10 text-[#0E52AC] dark:text-[#60A5FA] font-semibold rounded-lg border-2 border-[#0E52AC] dark:border-[#60A5FA] bg-transparent hover:bg-[#0E52AC] hover:text-white dark:hover:bg-[#60A5FA] dark:hover:text-white transition-all">
                    Contact Support
                  </Button>
                </Link>
              </div>
            </div>

            {/* Right Side - Form */}
            <div className="lg:col-span-2">
              <div className="border rounded-2xl p-6 md:p-8 shadow-2xl transition-all hover:shadow-3xl bg-white dark:bg-[#1E293B] border-[#E0EDFD] dark:border-[#475569]">
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Name and Email Row */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="text-sm font-semibold mb-2 flex items-center gap-2 transition-colors text-[#284366] dark:text-[#CBD5E1]">
                        <User className="w-4 h-4 text-[#0E52AC]" />
                        Full Name
                      </label>
                      <Input
                        placeholder="John Doe"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        className={`h-12 transition-all focus:ring-2 focus:ring-[#0E52AC]/20 bg-[#F8FBFF] dark:bg-[#0F172A] text-[#111E2F] dark:text-white ${
                          errors.name
                            ? "border-red-500 focus:border-red-500"
                            : "border-[#E0EDFD] dark:border-[#475569] focus:border-[#0E52AC]"
                        }`}
                      />
                      {errors.name && (
                        <p className="text-red-500 text-xs mt-1.5 flex items-center gap-1">
                          <span>⚠</span> {errors.name}
                        </p>
                      )}
                    </div>

                    <div>
                      <label className="text-sm font-semibold mb-2 flex items-center gap-2 transition-colors text-[#284366] dark:text-[#CBD5E1]">
                        <Mail className="w-4 h-4 text-[#0E52AC]" />
                        Email Address
                      </label>
                      <Input
                        type="email"
                        placeholder="you@example.com"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        className={`h-12 transition-all focus:ring-2 focus:ring-[#0E52AC]/20 bg-[#F8FBFF] dark:bg-[#0F172A] text-[#111E2F] dark:text-white ${
                          errors.email
                            ? "border-red-500 focus:border-red-500"
                            : "border-[#E0EDFD] dark:border-[#475569] focus:border-[#0E52AC]"
                        }`}
                      />
                      {errors.email && (
                        <p className="text-red-500 text-xs mt-1.5 flex items-center gap-1">
                          <span>⚠</span> {errors.email}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Course Selection */}
                  <div>
                    <label className="block text-sm font-semibold mb-2 transition-colors text-[#284366] dark:text-[#CBD5E1]">
                      Course
                    </label>
                    <select
                      name="course"
                      value={formData.course}
                      onChange={handleChange}
                      className={`w-full h-12 px-4 rounded-lg border transition-all focus:outline-none focus:ring-2 focus:ring-[#0E52AC]/20 bg-[#F8FBFF] dark:bg-[#0F172A] text-[#111E2F] dark:text-white ${
                        errors.course
                          ? "border-red-500 focus:border-red-500"
                          : "border-[#E0EDFD] dark:border-[#475569] focus:border-[#0E52AC]"
                      }`}
                    >
                      <option value="">Select a course</option>
                      {courses.map((course) => (
                        <option key={course.value} value={course.value}>
                          {course.label}
                        </option>
                      ))}
                    </select>
                    {errors.course && (
                      <p className="text-red-500 text-xs mt-1.5 flex items-center gap-1">
                        <span>⚠</span> {errors.course}
                      </p>
                    )}
                  </div>

                  {/* Custom Course Input */}
                  {formData.course === "custom" && (
                    <div>
                      <label className="block text-sm font-semibold mb-2 transition-colors text-[#284366] dark:text-[#CBD5E1]">
                        Specify Your Course
                      </label>
                      <Input
                        placeholder="e.g., Engineering, Medicine, Arts"
                        name="customCourse"
                        value={formData.customCourse}
                        onChange={handleChange}
                        className={`h-12 transition-all focus:ring-2 focus:ring-[#0E52AC]/20 bg-[#F8FBFF] dark:bg-[#0F172A] text-[#111E2F] dark:text-white ${
                          errors.customCourse
                            ? "border-red-500 focus:border-red-500"
                            : "border-[#E0EDFD] dark:border-[#475569] focus:border-[#0E52AC]"
                        }`}
                      />
                      {errors.customCourse && (
                        <p className="text-red-500 text-xs mt-1.5 flex items-center gap-1">
                          <span>⚠</span> {errors.customCourse}
                        </p>
                      )}
                    </div>
                  )}

                  {/* Subject and Deadline Row */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-semibold mb-2 transition-colors text-[#284366] dark:text-[#CBD5E1]">
                        Subject{" "}
                        <span className="text-[#64748B] dark:text-[#94A3B8]">
                          (Optional)
                        </span>
                      </label>
                      <Input
                        placeholder="e.g., Database Systems"
                        name="subject"
                        value={formData.subject}
                        onChange={handleChange}
                        className="h-12 transition-all focus:ring-2 focus:ring-[#0E52AC]/20 bg-[#F8FBFF] dark:bg-[#0F172A] border-[#E0EDFD] dark:border-[#475569] focus:border-[#0E52AC] text-[#111E2F] dark:text-white"
                      />
                    </div>

                    <div>
                      <label className="text-sm font-semibold mb-2 flex items-center gap-2 transition-colors text-[#284366] dark:text-[#CBD5E1]">
                        <Calendar className="w-4 h-4 text-[#0E52AC]" />
                        Deadline
                      </label>
                      <Input
                        type="date"
                        name="deadline"
                        value={formData.deadline}
                        onChange={handleChange}
                        className={`h-12 transition-all focus:ring-2 focus:ring-[#0E52AC]/20 bg-[#F8FBFF] dark:bg-[#0F172A] text-[#111E2F] dark:text-white ${
                          errors.deadline
                            ? "border-red-500 focus:border-red-500"
                            : "border-[#E0EDFD] dark:border-[#475569] focus:border-[#0E52AC]"
                        }`}
                      />
                      {errors.deadline && (
                        <p className="text-red-500 text-xs mt-1.5 flex items-center gap-1">
                          <span>⚠</span> {errors.deadline}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* File Upload */}
                  <div>
                    <label className="text-sm font-semibold mb-2 flex items-center gap-2 transition-colors text-[#284366] dark:text-[#CBD5E1]">
                      <FileText className="w-4 h-4 text-[#0E52AC]" />
                      Module Guide (PDF or Word)
                    </label>
                    <div
                      className={`relative border-2 border-dashed rounded-xl p-8 transition-all hover:border-[#0E52AC] hover:bg-[#F0F7FF] dark:hover:bg-[#0F172A] group cursor-pointer bg-gradient-to-br from-[#F8FBFF] to-white dark:from-[#0F172A] dark:to-[#1E293B] ${
                        errors.file
                          ? "border-red-500"
                          : "border-[#E0EDFD] dark:border-[#475569]"
                      }`}
                    >
                      <input
                        type="file"
                        accept=".pdf,.doc,.docx"
                        onChange={handleFileChange}
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                      />
                      <div className="text-center relative z-0">
                        <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-[#0E52AC]/10 dark:bg-[#60A5FA]/10 flex items-center justify-center group-hover:scale-110 transition-transform">
                          <Upload className="w-8 h-8 text-[#0E52AC] dark:text-[#60A5FA]" />
                        </div>
                        <p className="text-base font-semibold mb-2 transition-colors text-[#284366] dark:text-[#CBD5E1]">
                          Click to upload or drag and drop
                        </p>
                        <p className="text-sm transition-colors text-[#64748B] dark:text-[#94A3B8]">
                          PDF, DOC, or DOCX (MAX. 10MB)
                        </p>
                      </div>
                    </div>
                    {errors.file && (
                      <p className="text-red-500 text-xs mt-1.5 flex items-center gap-1">
                        <span>⚠</span> {errors.file}
                      </p>
                    )}
                    {file && (
                      <div className="mt-3 p-4 rounded-xl border-2 flex items-center gap-3 transition-all bg-gradient-to-br from-[#0E52AC]/10 to-[#60A5FA]/5 border-[#0E52AC] dark:border-[#60A5FA] shadow-md">
                        <div className="w-10 h-10 rounded-lg bg-[#0E52AC]/20 dark:bg-[#60A5FA]/20 flex items-center justify-center flex-shrink-0">
                          <FileText className="w-5 h-5 text-[#0E52AC] dark:text-[#60A5FA]" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-semibold truncate transition-colors text-[#111E2F] dark:text-white">
                            {file.name}
                          </p>
                          <p className="text-xs transition-colors text-[#64748B] dark:text-[#94A3B8]">
                            {(file.size / 1024).toFixed(2)} KB
                          </p>
                        </div>
                        <div className="w-8 h-8 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center flex-shrink-0">
                          <CheckCircle2 className="w-5 h-5 text-green-600 dark:text-green-400" />
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Additional Message */}
                  <div>
                    <label className="block text-sm font-semibold mb-2 transition-colors text-[#284366] dark:text-[#CBD5E1]">
                      Additional Message{" "}
                      <span className="text-[#64748B] dark:text-[#94A3B8]">
                        (Optional)
                      </span>
                    </label>
                    <Textarea
                      placeholder="Tell us more about your assignment or any specific requirements..."
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      rows={4}
                      className="resize-none transition-all focus:ring-2 focus:ring-[#0E52AC]/20 bg-[#F8FBFF] dark:bg-[#0F172A] border-[#E0EDFD] dark:border-[#475569] focus:border-[#0E52AC] text-[#111E2F] dark:text-white"
                    />
                  </div>

                  {/* Submit Button */}
                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full h-14 text-white font-bold text-base rounded-xl transition-all hover:shadow-2xl hover:scale-[1.02] disabled:opacity-50 disabled:hover:scale-100 disabled:cursor-not-allowed bg-gradient-to-r from-[#0E52AC] to-[#60A5FA] border-0 flex items-center justify-center"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                        Submitting Assignment...
                      </>
                    ) : (
                      <>
                        <Upload className="w-5 h-5 mr-2" />
                        Submit Assignment
                      </>
                    )}
                  </Button>
                </form>
              </div>
            </div>
          </div>
        ) : (
          <div className="border-2 rounded-2xl p-8 md:p-12 text-center shadow-2xl transition-all animate-in fade-in zoom-in duration-500 bg-gradient-to-br from-green-50 to-[#F0F7FF] dark:from-green-900/10 dark:to-[#1E293B] border-green-500 dark:border-green-400 max-w-3xl mx-auto">
            <div className="w-20 h-20 md:w-24 md:h-24 rounded-full flex items-center justify-center mx-auto mb-6 bg-gradient-to-br from-green-500 to-green-600 shadow-xl animate-bounce">
              <CheckCircle2 className="w-12 h-12 md:w-14 md:h-14 text-white" />
            </div>
            <h2 className="text-2xl md:text-4xl font-bold mb-4 transition-colors text-[#111E2F] dark:text-white">
              Submission Successful!
            </h2>
            <p className="text-base md:text-lg mb-8 transition-colors text-[#284366] dark:text-[#CBD5E1] max-w-md mx-auto">
              Your assignment has been submitted successfully. Our expert team
              will review it and get back to you shortly via chat.
            </p>
            <Link href="/chat">
              <Button className="h-14 px-10 text-white font-bold text-base rounded-xl transition-all hover:shadow-2xl hover:scale-105 bg-gradient-to-r from-[#0E52AC] to-[#60A5FA] border-0 flex items-center justify-center">
                Go to Chat Now
              </Button>
            </Link>
          </div>
        )}

        {/* Info Box */}
        <div className="mt-6 p-5 md:p-6 border rounded-xl transition-all bg-gradient-to-br from-[#F0F7FF] to-white dark:from-[#1E293B] dark:to-[#0F172A] border-[#0E52AC]/20 dark:border-[#60A5FA]/20 shadow-md">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-lg bg-[#0E52AC]/10 dark:bg-[#60A5FA]/10 flex items-center justify-center flex-shrink-0">
              <FileText className="w-5 h-5 text-[#0E52AC] dark:text-[#60A5FA]" />
            </div>
            <div>
              <h3 className="font-semibold text-[#284366] dark:text-[#CBD5E1] mb-1">
                Important Note
              </h3>
              <p className="text-sm transition-colors text-[#64748B] dark:text-[#94A3B8] leading-relaxed">
                After submitting your assignment, you'll be redirected to the
                chat where you can communicate directly with our experts. Make
                sure to provide all necessary details about your assignment for
                better assistance.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
