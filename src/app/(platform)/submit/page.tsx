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
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8 transition-colors bg-[#F8FBFF] dark:bg-[#1E293B]">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="mb-8 text-center">
          <h1 className="text-3xl md:text-4xl font-bold mb-3 transition-colors text-[#111E2F] dark:text-white">
            Submit Your Assignment
          </h1>
          <p className="text-base md:text-lg max-w-2xl mx-auto transition-colors text-[#64748B] dark:text-[#94A3B8]">
            Upload your assignment guide and our expert team will review it and
            provide personalized assistance
          </p>
        </div>

        {!submitted ? (
          <div className="border rounded-2xl p-6 md:p-8 shadow-lg transition-colors bg-white dark:bg-[#1E293B] border-[#E0EDFD] dark:border-[#475569]">
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
                    className={`h-11 transition-colors bg-[#F8FBFF] dark:bg-[#0F172A] text-[#111E2F] dark:text-white ${
                      errors.name
                        ? "border-red-500"
                        : "border-[#E0EDFD] dark:border-[#475569]"
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
                    className={`h-11 transition-colors bg-[#F8FBFF] dark:bg-[#0F172A] text-[#111E2F] dark:text-white ${
                      errors.email
                        ? "border-red-500"
                        : "border-[#E0EDFD] dark:border-[#475569]"
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
                  className={`w-full h-11 px-4 rounded-lg border transition-all focus:outline-none focus:ring-2 bg-[#F8FBFF] dark:bg-[#0F172A] text-[#111E2F] dark:text-white ${
                    errors.course
                      ? "border-red-500"
                      : "border-[#E0EDFD] dark:border-[#475569]"
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
                    className={`h-11 transition-colors bg-[#F8FBFF] dark:bg-[#0F172A] text-[#111E2F] dark:text-white ${
                      errors.customCourse
                        ? "border-red-500"
                        : "border-[#E0EDFD] dark:border-[#475569]"
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
                    className="h-11 transition-colors bg-[#F8FBFF] dark:bg-[#0F172A] border-[#E0EDFD] dark:border-[#475569] text-[#111E2F] dark:text-white"
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
                    className={`h-11 transition-colors bg-[#F8FBFF] dark:bg-[#0F172A] text-[#111E2F] dark:text-white ${
                      errors.deadline
                        ? "border-red-500"
                        : "border-[#E0EDFD] dark:border-[#475569]"
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
                  className={`relative border-2 border-dashed rounded-xl p-6 transition-all hover:border-opacity-80 bg-[#F8FBFF] dark:bg-[#0F172A] ${
                    errors.file
                      ? "border-red-500"
                      : "border-[#E0EDFD] dark:border-[#475569]"
                  }`}
                >
                  <input
                    type="file"
                    accept=".pdf,.doc,.docx"
                    onChange={handleFileChange}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  />
                  <div className="text-center">
                    <Upload className="w-10 h-10 mx-auto mb-3 text-[#0E52AC]" />
                    <p className="text-sm font-medium mb-1 transition-colors text-[#284366] dark:text-[#CBD5E1]">
                      Click to upload or drag and drop
                    </p>
                    <p className="text-xs transition-colors text-[#64748B] dark:text-[#94A3B8]">
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
                  <div className="mt-3 p-4 rounded-lg border flex items-center gap-3 transition-colors bg-[#0E52AC]/10 border-[#0E52AC]">
                    <FileText className="w-5 h-5 flex-shrink-0 text-[#0E52AC]" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate transition-colors text-[#111E2F] dark:text-white">
                        {file.name}
                      </p>
                      <p className="text-xs transition-colors text-[#64748B] dark:text-[#94A3B8]">
                        {(file.size / 1024).toFixed(2)} KB
                      </p>
                    </div>
                    <CheckCircle2 className="w-5 h-5 flex-shrink-0 text-[#0E52AC]" />
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
                  className="resize-none transition-colors bg-[#F8FBFF] dark:bg-[#0F172A] border-[#E0EDFD] dark:border-[#475569] text-[#111E2F] dark:text-white"
                />
              </div>

              {/* Submit Button */}
              <Button
                type="submit"
                disabled={isSubmitting}
                className="w-full h-12 text-white font-semibold text-base rounded-xl transition-all hover:opacity-90 disabled:opacity-50 bg-[#0E52AC]"
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
        ) : (
          <div className="border rounded-2xl p-8 md:p-12 text-center shadow-lg transition-colors bg-[#0E52AC]/10 border-[#0E52AC]">
            <div className="w-16 h-16 md:w-20 md:h-20 rounded-full flex items-center justify-center mx-auto mb-4 bg-[#0E52AC]">
              <CheckCircle2 className="w-10 h-10 md:w-12 md:h-12 text-white" />
            </div>
            <h2 className="text-2xl md:text-3xl font-bold mb-3 transition-colors text-[#111E2F] dark:text-white">
              Submission Successful!
            </h2>
            <p className="text-base md:text-lg mb-6 transition-colors text-[#284366] dark:text-[#CBD5E1]">
              Your assignment has been submitted successfully. Our expert team
              will review it and get back to you shortly via chat.
            </p>
            <Link href="/chat">
              <Button className="h-12 px-8 text-white font-semibold text-base rounded-xl transition-all hover:opacity-90 bg-[#0E52AC]">
                Go to Chat Now
              </Button>
            </Link>
          </div>
        )}

        {/* Info Box */}
        <div className="mt-6 p-4 md:p-5 border rounded-xl transition-colors bg-white dark:bg-[#1E293B] border-[#E0EDFD] dark:border-[#475569]">
          <p className="text-sm transition-colors text-[#64748B] dark:text-[#94A3B8]">
            <strong className="text-[#284366] dark:text-[#CBD5E1]">
              Note:
            </strong>{" "}
            After submitting your assignment, you'll be redirected to the chat
            where you can communicate directly with our experts. Make sure to
            provide all necessary details about your assignment for better
            assistance.
          </p>
        </div>
      </div>
    </div>
  );
}
