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
import { Loader2 } from "lucide-react";

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
        formData.subject || formData.course === "custom" ? formData.customCourse : formData.course
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
        description: "Assignment submitted successfully! Redirecting to chat...",
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
        description: error.response?.data?.error || "Failed to submit assignment",
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
    <div className="min-h-screen bg-white dark:bg-black py-12 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            Submit Your Assignment
          </h1>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Submit your assignment guide for help. Our experts will review and
            get back to you.
          </p>
        </div>

        {!submitted ? (
          <div className="bg-white dark:bg-black border border-gray-200 dark:border-gray-800 rounded-lg p-6">
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label className="block text-sm font-medium text-gray-900 dark:text-white mb-2">
                    Full Name
                  </label>
                  <Input
                    placeholder="John Doe"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="h-11 bg-gray-50 dark:bg-gray-900 border-gray-300 dark:border-gray-700 focus:border-blue-600 focus:ring-1 focus:ring-blue-600"
                  />
                  {errors.name && (
                    <p className="text-red-600 text-xs mt-1">{errors.name}</p>
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
                    className="h-11 bg-gray-50 dark:bg-gray-900 border-gray-300 dark:border-gray-700 focus:border-blue-600 focus:ring-1 focus:ring-blue-600"
                  />
                  {errors.email && (
                    <p className="text-red-600 text-xs mt-1">{errors.email}</p>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-900 dark:text-white mb-2">
                  Course
                </label>
                <select
                  name="course"
                  value={formData.course}
                  onChange={handleChange}
                  className="w-full h-11 px-3 bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-lg text-gray-900 dark:text-white focus:border-blue-600 focus:ring-1 focus:ring-blue-600"
                >
                  <option value="">Select a course</option>
                  {courses.map((course) => (
                    <option key={course.value} value={course.value}>
                      {course.label}
                    </option>
                  ))}
                </select>
                {errors.course && (
                  <p className="text-red-600 text-xs mt-1">{errors.course}</p>
                )}
              </div>

              {formData.course === "custom" && (
                <div>
                  <label className="block text-sm font-medium text-gray-900 dark:text-white mb-2">
                    Specify Your Course
                  </label>
                  <Input
                    placeholder="e.g., Engineering, Medicine, Arts"
                    name="customCourse"
                    value={formData.customCourse}
                    onChange={handleChange}
                    className="h-11 bg-gray-50 dark:bg-gray-900 border-gray-300 dark:border-gray-700 focus:border-blue-600 focus:ring-1 focus:ring-blue-600"
                  />
                  {errors.customCourse && (
                    <p className="text-red-600 text-xs mt-1">
                      {errors.customCourse}
                    </p>
                  )}
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label className="block text-sm font-medium text-gray-900 dark:text-white mb-2">
                    Subject (Optional)
                  </label>
                  <Input
                    placeholder="e.g., Database Systems"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    className="h-11 bg-gray-50 dark:bg-gray-900 border-gray-300 dark:border-gray-700 focus:border-blue-600 focus:ring-1 focus:ring-blue-600"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-900 dark:text-white mb-2">
                    Deadline
                  </label>
                  <Input
                    type="date"
                    name="deadline"
                    value={formData.deadline}
                    onChange={handleChange}
                    className="h-11 bg-gray-50 dark:bg-gray-900 border-gray-300 dark:border-gray-700 focus:border-blue-600 focus:ring-1 focus:ring-blue-600"
                  />
                  {errors.deadline && (
                    <p className="text-red-600 text-xs mt-1">
                      {errors.deadline}
                    </p>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-900 dark:text-white mb-2">
                  Module Guide (PDF or Word)
                </label>
                <input
                  type="file"
                  accept=".pdf,.doc,.docx"
                  onChange={handleFileChange}
                  className="w-full h-11 px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-900 text-sm text-gray-900 dark:text-white cursor-pointer file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-medium file:bg-blue-600 file:text-white hover:file:bg-blue-700"
                />
                {errors.file && (
                  <p className="text-red-600 text-xs mt-1">{errors.file}</p>
                )}
                {file && (
                  <div className="mt-3 p-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
                    <p className="text-sm text-blue-900 dark:text-blue-100">
                      ✓ {file.name} selected
                    </p>
                  </div>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-900 dark:text-white mb-2">
                  Additional Message (Optional)
                </label>
                <Textarea
                  placeholder="Tell us more about your assignment or any specific requirements..."
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  rows={4}
                  className="bg-gray-50 dark:bg-gray-900 border-gray-300 dark:border-gray-700 focus:border-blue-600 focus:ring-1 focus:ring-blue-600"
                />
              </div>

              <Button
                type="submit"
                disabled={isSubmitting}
                className="w-full h-11 bg-blue-600 hover:bg-blue-700 text-white font-medium"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Submitting...
                  </>
                ) : (
                  "Submit Assignment"
                )}
              </Button>
            </form>
          </div>
        ) : (
          <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-8 text-center">
            <h2 className="text-xl font-bold text-blue-900 dark:text-blue-100 mb-2">
              Submission Successful!
            </h2>
            <p className="text-sm text-blue-800 dark:text-blue-200 mb-4">
              Your assignment has been submitted. You'll be redirected to the
              chat shortly.
            </p>
            <Link href="/chat">
              <Button className="bg-blue-600 hover:bg-blue-700">
                Go to Chat Now
              </Button>
            </Link>
          </div>
        )}

        <div className="mt-6 p-4 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg">
          <p className="text-xs text-gray-600 dark:text-gray-400">
            <strong>Note:</strong> Submit your assignment guide for help. Our
            experts will review and get back to you via chat.
          </p>
        </div>
      </div>
    </div>
  );
}
