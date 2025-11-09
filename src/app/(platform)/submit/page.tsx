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
import { useTheme } from "@/hooks/use-theme";
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
  const { theme } = useTheme();
  const isDark = theme === "dark";

  // Brand theme colors
  const themeColors = {
    primary: "#0E52AC",
    primaryHover: "#0A3D7F",
    text1: isDark ? "#FFFFFF" : "#111E2F",
    text2: isDark ? "#CBD5E1" : "#284366",
    text3: isDark ? "#94A3B8" : "#64748B",
    bg1: isDark ? "#0A0F1E" : "#FFFFFF",
    bg2: isDark ? "#1E293B" : "#F8FBFF",
    cardBg: isDark ? "#1E293B" : "#FFFFFF",
    border: isDark ? "#475569" : "#E0EDFD",
    inputBg: isDark ? "#0F172A" : "#F8FBFF",
  };

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
    <div
      className="min-h-screen py-12 px-4 sm:px-6 lg:px-8 transition-colors"
      style={{ backgroundColor: themeColors.bg2 }}
    >
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="mb-8 text-center">
          <h1
            className="text-3xl md:text-4xl font-bold mb-3 transition-colors"
            style={{ color: themeColors.text1 }}
          >
            Submit Your Assignment
          </h1>
          <p
            className="text-base md:text-lg max-w-2xl mx-auto transition-colors"
            style={{ color: themeColors.text3 }}
          >
            Upload your assignment guide and our expert team will review it and
            provide personalized assistance
          </p>
        </div>

        {!submitted ? (
          <div
            className="border rounded-2xl p-6 md:p-8 shadow-lg transition-colors"
            style={{
              backgroundColor: themeColors.cardBg,
              borderColor: themeColors.border,
            }}
          >
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Name and Email Row */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label
                    className="text-sm font-semibold mb-2 flex items-center gap-2 transition-colors"
                    style={{ color: themeColors.text2 }}
                  >
                    <User
                      className="w-4 h-4"
                      style={{ color: themeColors.primary }}
                    />
                    Full Name
                  </label>
                  <Input
                    placeholder="John Doe"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="h-11 transition-colors"
                    style={{
                      backgroundColor: themeColors.inputBg,
                      borderColor: errors.name ? "#EF4444" : themeColors.border,
                      color: themeColors.text1,
                    }}
                  />
                  {errors.name && (
                    <p className="text-red-500 text-xs mt-1.5 flex items-center gap-1">
                      <span>⚠</span> {errors.name}
                    </p>
                  )}
                </div>

                <div>
                  <label
                    className="text-sm font-semibold mb-2 flex items-center gap-2 transition-colors"
                    style={{ color: themeColors.text2 }}
                  >
                    <Mail
                      className="w-4 h-4"
                      style={{ color: themeColors.primary }}
                    />
                    Email Address
                  </label>
                  <Input
                    type="email"
                    placeholder="you@example.com"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="h-11 transition-colors"
                    style={{
                      backgroundColor: themeColors.inputBg,
                      borderColor: errors.email
                        ? "#EF4444"
                        : themeColors.border,
                      color: themeColors.text1,
                    }}
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
                <label
                  className="block text-sm font-semibold mb-2 transition-colors"
                  style={{ color: themeColors.text2 }}
                >
                  Course
                </label>
                <select
                  name="course"
                  value={formData.course}
                  onChange={handleChange}
                  className="w-full h-11 px-4 rounded-lg border transition-all focus:outline-none focus:ring-2"
                  style={{
                    backgroundColor: themeColors.inputBg,
                    borderColor: errors.course ? "#EF4444" : themeColors.border,
                    color: themeColors.text1,
                  }}
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
                  <label
                    className="block text-sm font-semibold mb-2 transition-colors"
                    style={{ color: themeColors.text2 }}
                  >
                    Specify Your Course
                  </label>
                  <Input
                    placeholder="e.g., Engineering, Medicine, Arts"
                    name="customCourse"
                    value={formData.customCourse}
                    onChange={handleChange}
                    className="h-11 transition-colors"
                    style={{
                      backgroundColor: themeColors.inputBg,
                      borderColor: errors.customCourse
                        ? "#EF4444"
                        : themeColors.border,
                      color: themeColors.text1,
                    }}
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
                  <label
                    className="block text-sm font-semibold mb-2 transition-colors"
                    style={{ color: themeColors.text2 }}
                  >
                    Subject{" "}
                    <span style={{ color: themeColors.text3 }}>(Optional)</span>
                  </label>
                  <Input
                    placeholder="e.g., Database Systems"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    className="h-11 transition-colors"
                    style={{
                      backgroundColor: themeColors.inputBg,
                      borderColor: themeColors.border,
                      color: themeColors.text1,
                    }}
                  />
                </div>

                <div>
                  <label
                    className="text-sm font-semibold mb-2 flex items-center gap-2 transition-colors"
                    style={{ color: themeColors.text2 }}
                  >
                    <Calendar
                      className="w-4 h-4"
                      style={{ color: themeColors.primary }}
                    />
                    Deadline
                  </label>
                  <Input
                    type="date"
                    name="deadline"
                    value={formData.deadline}
                    onChange={handleChange}
                    className="h-11 transition-colors"
                    style={{
                      backgroundColor: themeColors.inputBg,
                      borderColor: errors.deadline
                        ? "#EF4444"
                        : themeColors.border,
                      color: themeColors.text1,
                    }}
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
                <label
                  className="text-sm font-semibold mb-2 flex items-center gap-2 transition-colors"
                  style={{ color: themeColors.text2 }}
                >
                  <FileText
                    className="w-4 h-4"
                    style={{ color: themeColors.primary }}
                  />
                  Module Guide (PDF or Word)
                </label>
                <div
                  className="relative border-2 border-dashed rounded-xl p-6 transition-all hover:border-opacity-80"
                  style={{
                    borderColor: errors.file ? "#EF4444" : themeColors.border,
                    backgroundColor: themeColors.inputBg,
                  }}
                >
                  <input
                    type="file"
                    accept=".pdf,.doc,.docx"
                    onChange={handleFileChange}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  />
                  <div className="text-center">
                    <Upload
                      className="w-10 h-10 mx-auto mb-3"
                      style={{ color: themeColors.primary }}
                    />
                    <p
                      className="text-sm font-medium mb-1 transition-colors"
                      style={{ color: themeColors.text2 }}
                    >
                      Click to upload or drag and drop
                    </p>
                    <p
                      className="text-xs transition-colors"
                      style={{ color: themeColors.text3 }}
                    >
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
                  <div
                    className="mt-3 p-4 rounded-lg border flex items-center gap-3 transition-colors"
                    style={{
                      backgroundColor: `${themeColors.primary}15`,
                      borderColor: themeColors.primary,
                    }}
                  >
                    <FileText
                      className="w-5 h-5 flex-shrink-0"
                      style={{ color: themeColors.primary }}
                    />
                    <div className="flex-1 min-w-0">
                      <p
                        className="text-sm font-medium truncate transition-colors"
                        style={{ color: themeColors.text1 }}
                      >
                        {file.name}
                      </p>
                      <p
                        className="text-xs transition-colors"
                        style={{ color: themeColors.text3 }}
                      >
                        {(file.size / 1024).toFixed(2)} KB
                      </p>
                    </div>
                    <CheckCircle2
                      className="w-5 h-5 flex-shrink-0"
                      style={{ color: themeColors.primary }}
                    />
                  </div>
                )}
              </div>

              {/* Additional Message */}
              <div>
                <label
                  className="block text-sm font-semibold mb-2 transition-colors"
                  style={{ color: themeColors.text2 }}
                >
                  Additional Message{" "}
                  <span style={{ color: themeColors.text3 }}>(Optional)</span>
                </label>
                <Textarea
                  placeholder="Tell us more about your assignment or any specific requirements..."
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  rows={4}
                  className="resize-none transition-colors"
                  style={{
                    backgroundColor: themeColors.inputBg,
                    borderColor: themeColors.border,
                    color: themeColors.text1,
                  }}
                />
              </div>

              {/* Submit Button */}
              <Button
                type="submit"
                disabled={isSubmitting}
                className="w-full h-12 text-white font-semibold text-base rounded-xl transition-all hover:opacity-90 disabled:opacity-50"
                style={{ backgroundColor: themeColors.primary }}
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
          <div
            className="border rounded-2xl p-8 md:p-12 text-center shadow-lg transition-colors"
            style={{
              backgroundColor: `${themeColors.primary}15`,
              borderColor: themeColors.primary,
            }}
          >
            <div
              className="w-16 h-16 md:w-20 md:h-20 rounded-full flex items-center justify-center mx-auto mb-4"
              style={{ backgroundColor: themeColors.primary }}
            >
              <CheckCircle2 className="w-10 h-10 md:w-12 md:h-12 text-white" />
            </div>
            <h2
              className="text-2xl md:text-3xl font-bold mb-3 transition-colors"
              style={{ color: themeColors.text1 }}
            >
              Submission Successful!
            </h2>
            <p
              className="text-base md:text-lg mb-6 transition-colors"
              style={{ color: themeColors.text2 }}
            >
              Your assignment has been submitted successfully. Our expert team
              will review it and get back to you shortly via chat.
            </p>
            <Link href="/chat">
              <Button
                className="h-12 px-8 text-white font-semibold text-base rounded-xl transition-all hover:opacity-90"
                style={{ backgroundColor: themeColors.primary }}
              >
                Go to Chat Now
              </Button>
            </Link>
          </div>
        )}

        {/* Info Box */}
        <div
          className="mt-6 p-4 md:p-5 border rounded-xl transition-colors"
          style={{
            backgroundColor: themeColors.cardBg,
            borderColor: themeColors.border,
          }}
        >
          <p
            className="text-sm transition-colors"
            style={{ color: themeColors.text3 }}
          >
            <strong style={{ color: themeColors.text2 }}>Note:</strong> After
            submitting your assignment, you'll be redirected to the chat where
            you can communicate directly with our experts. Make sure to provide
            all necessary details about your assignment for better assistance.
          </p>
        </div>
      </div>
    </div>
  );
}
