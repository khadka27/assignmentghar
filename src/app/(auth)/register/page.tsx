"use client";

import { useState, useEffect } from "react";
import { signIn, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import axios from "axios";
import { useToast } from "@/hooks/use-toast";
import {
  Eye,
  EyeOff,
  Mail,
  Lock,
  User,
  ShieldCheck,
  Clock,
  Check,
  X,
  Loader2,
  ArrowRight,
  ArrowLeft,
  AlertCircle,
  Moon,
  Sun,
} from "lucide-react";

export default function RegisterPage() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const { toast } = useToast();

  const [isDark, setIsDark] = useState(false);
  const themeColors = {
    primary: "#0E52AC",
    text1: isDark ? "#FFFFFF" : "#111E2F",
    text2: isDark ? "#CBD5E1" : "#284366",
    bg1: isDark ? "#0A0F1E" : "#F8FBFF",
    bg2: isDark ? "#1E293B" : "#FFFFFF",
    inputBg: isDark ? "#1E293B" : "#F8FBFF",
    border: isDark ? "#475569" : "#CBD5E1",
  };

  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [currentStep, setCurrentStep] = useState<1 | 2 | 3>(1);
  const [otp, setOtp] = useState("");
  const [resendTimer, setResendTimer] = useState(0);
  const [passwordStrength, setPasswordStrength] = useState<
    "weak" | "medium" | "strong" | null
  >(null);

  const [emailStatus, setEmailStatus] = useState<
    "idle" | "checking" | "available" | "taken" | "invalid"
  >("idle");
  const [usernameStatus, setUsernameStatus] = useState<
    "idle" | "checking" | "available" | "taken" | "invalid"
  >("idle");

  const [formData, setFormData] = useState({
    name: "",
    username: "",
    email: "",
    gender: "",
    password: "",
    confirmPassword: "",
  });

  const calculatePasswordStrength = (password: string) => {
    if (password.length === 0) return null;
    if (password.length < 8) return "weak";

    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumbers = /\d/.test(password);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);

    const score =
      (hasUpperCase ? 1 : 0) +
      (hasLowerCase ? 1 : 0) +
      (hasNumbers ? 1 : 0) +
      (hasSpecialChar ? 1 : 0);

    if (password.length >= 12 && score >= 3) return "strong";
    if (password.length >= 8 && score >= 2) return "medium";
    return "weak";
  };

  useEffect(() => {
    const email = formData.email.trim().toLowerCase();
    if (!email || email.length < 3) {
      setEmailStatus("idle");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setEmailStatus("invalid");
      return;
    }

    let cancelled = false;
    setEmailStatus("checking");

    const timer = setTimeout(async () => {
      try {
        const { data } = await axios.get(
          `/api/auth/check-email?email=${encodeURIComponent(email)}`
        );
        if (cancelled) return;
        setEmailStatus(data.available ? "available" : "taken");
      } catch {
        if (!cancelled) setEmailStatus("idle");
      }
    }, 500);

    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
  }, [formData.email]);

  useEffect(() => {
    const username = formData.username.trim();
    if (!username || username.length < 3) {
      setUsernameStatus("idle");
      return;
    }

    if (!/^[a-zA-Z0-9_-]+$/.test(username)) {
      setUsernameStatus("invalid");
      return;
    }

    let cancelled = false;
    setUsernameStatus("checking");

    const timer = setTimeout(async () => {
      try {
        const { data } = await axios.get(
          `/api/auth/check-username?username=${encodeURIComponent(username)}`
        );
        if (cancelled) return;
        setUsernameStatus(data.available ? "available" : "taken");
      } catch {
        if (!cancelled) setUsernameStatus("idle");
      }
    }, 500);

    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
  }, [formData.username]);

  useEffect(() => {
    if (status === "authenticated" && session?.user) {
      router.push("/");
    }
  }, [status, session, router]);

  useEffect(() => {
    if (resendTimer > 0) {
      const timer = setTimeout(() => setResendTimer(resendTimer - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [resendTimer]);

  const validateStep1 = () => {
    if (!formData.name.trim()) {
      toast({
        variant: "destructive",
        title: "Name Required",
        description: "Please enter your full name",
      });
      return false;
    }
    if (usernameStatus !== "available") {
      toast({
        variant: "destructive",
        title: "Username Issue",
        description:
          usernameStatus === "taken"
            ? "Username already taken. Please choose another."
            : "Please enter a valid username (3+ characters, letters, numbers, _ or - only)",
      });
      return false;
    }
    if (emailStatus !== "available") {
      toast({
        variant: "destructive",
        title: "Email Issue",
        description:
          emailStatus === "taken"
            ? "Email already registered. Please login or use another email."
            : "Please enter a valid email address",
      });
      return false;
    }
    if (!formData.gender) {
      toast({
        variant: "destructive",
        title: "Gender Required",
        description: "Please select your gender",
      });
      return false;
    }
    return true;
  };

  const validateStep2 = () => {
    if (formData.password.length < 8) {
      toast({
        variant: "destructive",
        title: "Weak Password",
        description: "Password must be at least 8 characters long",
      });
      return false;
    }
    if (formData.password !== formData.confirmPassword) {
      toast({
        variant: "destructive",
        title: "Passwords Don't Match",
        description: "Please make sure both passwords are the same",
      });
      return false;
    }
    return true;
  };

  const handleNextStep = () => {
    if (currentStep === 1 && validateStep1()) {
      setCurrentStep(2);
    } else if (currentStep === 2 && validateStep2()) {
      handleSubmit();
    }
  };

  const handleSubmit = async () => {
    setIsLoading(true);

    try {
      const { data } = await axios.post("/api/auth/register", {
        name: formData.name,
        username: formData.username,
        email: formData.email,
        password: formData.password,
      });

      toast({
        title: "✅ Account Created Successfully!",
        description:
          "We've sent a 6-digit verification code to your email. Please check your inbox (and spam folder).",
      });
      setCurrentStep(3);
      setResendTimer(60);
    } catch (error: any) {
      let errorMessage =
        error.response?.data?.message || "Something went wrong";
      let errorTitle = "Registration Failed";

      if (error.response?.data?.code === "EMAIL_TAKEN") {
        errorTitle = "Email Already Registered";
        errorMessage =
          "This email is already registered. Please login or use a different email.";
      } else if (error.response?.data?.code === "USERNAME_TAKEN") {
        errorTitle = "Username Taken";
        errorMessage = "This username is already taken. Please choose another.";
      } else if (error.response?.data?.code === "WEAK_PASSWORD") {
        errorTitle = "Weak Password";
        errorMessage =
          "Please use a stronger password (at least 8 characters with numbers and symbols).";
      } else if (error.response?.data?.code === "INVALID_EMAIL") {
        errorTitle = "Invalid Email";
        errorMessage = "Please enter a valid email address.";
      }

      toast({
        variant: "destructive",
        title: errorTitle,
        description: errorMessage,
      });

      if (
        error.response?.data?.code === "EMAIL_TAKEN" ||
        error.response?.data?.code === "USERNAME_TAKEN"
      ) {
        setCurrentStep(1);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const { data } = await axios.post("/api/auth/verify-otp", {
        email: formData.email,
        otp: otp,
      });

      toast({
        title: "Email Verified!",
        description:
          "Your account has been created successfully. Redirecting to login...",
      });
      setTimeout(() => router.push("/login"), 1500);
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Verification Failed",
        description: error.response?.data?.error || "Invalid OTP",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendOTP = async () => {
    if (resendTimer > 0) return;

    setIsLoading(true);
    try {
      const { data } = await axios.post("/api/auth/resend-otp", {
        email: formData.email,
      });

      toast({
        title: "OTP Resent!",
        description: "Please check your email for the new verification code.",
      });
      setResendTimer(60);
      setOtp("");
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Failed to Resend",
        description: error.response?.data?.error || "Something went wrong",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setIsLoading(true);
    try {
      await signIn("google", { callbackUrl: "/" });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to sign in with Google",
      });
      setIsLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen relative"
      style={{ backgroundColor: themeColors.bg1 }}
    >
      {/* Theme Toggle */}
      <button
        onClick={() => setIsDark(!isDark)}
        className="fixed top-6 right-6 z-50 p-3 rounded-full transition-all hover:scale-110"
        style={{
          backgroundColor: themeColors.bg2,
          border: `1px solid ${themeColors.border}`,
          color: themeColors.text1,
        }}
        aria-label="Toggle theme"
      >
        {isDark ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
      </button>

      <div className="container mx-auto px-4 md:px-6 py-6 md:py-8 lg:py-0">
        <div className="min-h-screen flex items-center justify-center">
          <div className="w-full max-w-[1200px] grid lg:grid-cols-2 gap-8 md:gap-12 lg:gap-16 items-center">
            {/* Left Side - Hero Section */}
            <div className="hidden lg:block space-y-6 md:space-y-8">
              <div className="space-y-3 md:space-y-4">
                <div className="inline-block">
                  <h1
                    className="text-4xl md:text-5xl lg:text-6xl font-bold mb-2"
                    style={{ color: themeColors.text1 }}
                  >
                    Join Us Today
                  </h1>
                  <div
                    className="h-1.5 rounded-full w-32"
                    style={{ backgroundColor: themeColors.primary }}
                  ></div>
                </div>
                <p
                  className="text-base md:text-lg max-w-md"
                  style={{ color: themeColors.text2 }}
                >
                  Create your account and start managing your assignments
                  efficiently
                </p>
              </div>

              {/* Feature Cards */}
              <div className="space-y-3 md:space-y-4">
                {[
                  {
                    icon: "📚",
                    title: "Easy Management",
                    desc: "Organize all assignments in one place",
                  },
                  {
                    icon: "⚡",
                    title: "Quick Access",
                    desc: "Access your work from anywhere, anytime",
                  },
                  {
                    icon: "🎯",
                    title: "Track Progress",
                    desc: "Monitor your academic journey",
                  },
                ].map((feature, idx) => (
                  <div
                    key={idx}
                    className="flex items-start gap-3 md:gap-4 p-3 md:p-4 rounded-xl transition-all"
                    style={{
                      backgroundColor: themeColors.inputBg,
                      border: `1px solid ${themeColors.border}`,
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.borderColor = themeColors.primary;
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.borderColor = themeColors.border;
                    }}
                  >
                    <div className="text-2xl md:text-3xl">{feature.icon}</div>
                    <div>
                      <h3
                        className="font-semibold mb-1"
                        style={{ color: themeColors.text1 }}
                      >
                        {feature.title}
                      </h3>
                      <p
                        className="text-xs md:text-sm"
                        style={{ color: themeColors.text2 }}
                      >
                        {feature.desc}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right Side - Register Form */}
            <div className="w-full max-w-md mx-auto lg:mx-0">
              {/* Logo - Mobile Only */}
              <div className="lg:hidden mb-6 md:mb-8 text-center">
                <h1
                  className="text-2xl md:text-3xl font-bold mb-2"
                  style={{ color: themeColors.text1 }}
                >
                  Assignment Ghar
                </h1>
                <div
                  className="h-1 rounded-full w-16 mx-auto"
                  style={{ backgroundColor: themeColors.primary }}
                ></div>
              </div>

              <div
                className="rounded-2xl p-6 md:p-8 shadow-sm"
                style={{
                  backgroundColor: themeColors.bg2,
                  border: `1px solid ${themeColors.border}`,
                }}
              >
                {/* Header */}
                <div className="mb-6 md:mb-8">
                  <h2
                    className="text-xl md:text-2xl font-bold mb-2"
                    style={{ color: themeColors.text1 }}
                  >
                    {currentStep === 3 ? "Verify Email" : "Create Account"}
                  </h2>
                  <p
                    className="text-sm md:text-base"
                    style={{ color: themeColors.text2 }}
                  >
                    {currentStep === 3
                      ? "Enter the code sent to your email"
                      : "Fill in your details to get started"}
                  </p>
                </div>

                {/* Progress Indicator */}
                {currentStep !== 3 && (
                  <div className="mb-4 md:mb-6">
                    <div className="flex items-center justify-between mb-2">
                      <span
                        className="text-xs md:text-sm font-medium"
                        style={{ color: themeColors.text1 }}
                      >
                        Step {currentStep} of 2
                      </span>
                      <span
                        className="text-xs"
                        style={{ color: themeColors.text2 }}
                      >
                        {currentStep === 1 ? "Basic Info" : "Set Password"}
                      </span>
                    </div>
                    <div className="flex gap-2">
                      <div
                        className="h-1.5 flex-1 rounded-full transition-all"
                        style={{
                          backgroundColor:
                            currentStep >= 1
                              ? themeColors.primary
                              : themeColors.border,
                        }}
                      ></div>
                      <div
                        className="h-1.5 flex-1 rounded-full transition-all"
                        style={{
                          backgroundColor:
                            currentStep >= 2
                              ? themeColors.primary
                              : themeColors.border,
                        }}
                      ></div>
                    </div>
                  </div>
                )}

                {/* Step 1: Basic Info */}
                {currentStep === 1 && (
                  <div className="space-y-4 md:space-y-5">
                    {/* Name */}
                    <div className="space-y-2">
                      <label
                        htmlFor="name"
                        className="text-xs md:text-sm font-medium"
                        style={{ color: themeColors.text1 }}
                      >
                        Full Name
                      </label>
                      <div className="relative">
                        <User
                          className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 md:h-5 md:w-5"
                          style={{ color: themeColors.text2 }}
                        />
                        <input
                          id="name"
                          type="text"
                          placeholder="Enter your full name"
                          value={formData.name}
                          onChange={(e) =>
                            setFormData({ ...formData, name: e.target.value })
                          }
                          onFocus={(e) =>
                            (e.currentTarget.style.borderColor =
                              themeColors.primary)
                          }
                          onBlur={(e) =>
                            (e.currentTarget.style.borderColor =
                              themeColors.border)
                          }
                          className="w-full pl-9 md:pl-10 pr-3 py-2 md:py-2.5 rounded-lg text-sm md:text-base transition-colors"
                          style={{
                            backgroundColor: themeColors.inputBg,
                            border: `1px solid ${themeColors.border}`,
                            color: themeColors.text1,
                          }}
                          required
                        />
                      </div>
                    </div>

                    {/* Username */}
                    <div className="space-y-2">
                      <label
                        htmlFor="username"
                        className="text-xs md:text-sm font-medium"
                        style={{ color: themeColors.text1 }}
                      >
                        Username
                      </label>
                      <div className="relative">
                        <User
                          className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 md:h-5 md:w-5"
                          style={{ color: themeColors.text2 }}
                        />
                        <input
                          id="username"
                          type="text"
                          placeholder="Choose a username"
                          value={formData.username}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              username: e.target.value.trim().toLowerCase(),
                            })
                          }
                          onFocus={(e) =>
                            (e.currentTarget.style.borderColor =
                              themeColors.primary)
                          }
                          onBlur={(e) =>
                            (e.currentTarget.style.borderColor =
                              usernameStatus === "available"
                                ? "#10B981"
                                : usernameStatus === "taken" ||
                                  usernameStatus === "invalid"
                                ? "#DC2626"
                                : themeColors.border)
                          }
                          className="w-full pl-9 md:pl-10 pr-9 md:pr-10 py-2 md:py-2.5 rounded-lg text-sm md:text-base transition-colors"
                          style={{
                            backgroundColor: themeColors.inputBg,
                            border: `1px solid ${
                              usernameStatus === "available"
                                ? "#10B981"
                                : usernameStatus === "taken" ||
                                  usernameStatus === "invalid"
                                ? "#DC2626"
                                : themeColors.border
                            }`,
                            color: themeColors.text1,
                          }}
                          required
                          minLength={3}
                        />
                        {formData.username.length >= 3 && (
                          <div className="absolute right-3 top-1/2 -translate-y-1/2">
                            {usernameStatus === "checking" ? (
                              <Loader2
                                className="h-4 w-4 md:h-5 md:w-5 animate-spin"
                                style={{ color: themeColors.text2 }}
                              />
                            ) : usernameStatus === "available" ? (
                              <Check className="h-4 w-4 md:h-5 md:w-5 text-green-600" />
                            ) : usernameStatus === "taken" ||
                              usernameStatus === "invalid" ? (
                              <X className="h-4 w-4 md:h-5 md:w-5 text-red-600" />
                            ) : null}
                          </div>
                        )}
                      </div>
                      {usernameStatus === "taken" && (
                        <p className="text-xs text-red-600 flex items-center gap-1">
                          <AlertCircle className="h-3 w-3" />
                          Username already taken
                        </p>
                      )}
                      {usernameStatus === "invalid" && (
                        <p className="text-xs text-red-600 flex items-center gap-1">
                          <AlertCircle className="h-3 w-3" />
                          Only letters, numbers, _ and - allowed (min 3 chars)
                        </p>
                      )}
                      {usernameStatus === "available" && (
                        <p className="text-xs text-green-600 flex items-center gap-1">
                          <Check className="h-3 w-3" />
                          Username is available
                        </p>
                      )}
                    </div>

                    {/* Email */}
                    <div className="space-y-2">
                      <label
                        htmlFor="email"
                        className="text-xs md:text-sm font-medium"
                        style={{ color: themeColors.text1 }}
                      >
                        Email Address
                      </label>
                      <div className="relative">
                        <Mail
                          className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 md:h-5 md:w-5"
                          style={{ color: themeColors.text2 }}
                        />
                        <input
                          id="email"
                          type="email"
                          placeholder="Enter your email"
                          value={formData.email}
                          onChange={(e) => {
                            setFormData({ ...formData, email: e.target.value });
                          }}
                          onFocus={(e) =>
                            (e.currentTarget.style.borderColor =
                              themeColors.primary)
                          }
                          onBlur={(e) =>
                            (e.currentTarget.style.borderColor =
                              emailStatus === "available"
                                ? "#10B981"
                                : emailStatus === "taken" ||
                                  emailStatus === "invalid"
                                ? "#DC2626"
                                : themeColors.border)
                          }
                          className="w-full pl-9 md:pl-10 pr-9 md:pr-10 py-2 md:py-2.5 rounded-lg text-sm md:text-base transition-colors"
                          style={{
                            backgroundColor: themeColors.inputBg,
                            border: `1px solid ${
                              emailStatus === "available"
                                ? "#10B981"
                                : emailStatus === "taken" ||
                                  emailStatus === "invalid"
                                ? "#DC2626"
                                : themeColors.border
                            }`,
                            color: themeColors.text1,
                          }}
                          required
                        />
                        {formData.email.length > 0 && (
                          <div className="absolute right-3 top-1/2 -translate-y-1/2">
                            {emailStatus === "checking" ? (
                              <Loader2
                                className="h-4 w-4 md:h-5 md:w-5 animate-spin"
                                style={{ color: themeColors.text2 }}
                              />
                            ) : emailStatus === "available" ? (
                              <Check className="h-4 w-4 md:h-5 md:w-5 text-green-600" />
                            ) : emailStatus === "taken" ||
                              emailStatus === "invalid" ? (
                              <X className="h-4 w-4 md:h-5 md:w-5 text-red-600" />
                            ) : null}
                          </div>
                        )}
                      </div>
                      {emailStatus === "taken" && (
                        <p className="text-xs text-red-600 flex items-center gap-1">
                          <AlertCircle className="h-3 w-3" />
                          Email already registered
                        </p>
                      )}
                      {emailStatus === "invalid" && (
                        <p className="text-xs text-red-600 flex items-center gap-1">
                          <AlertCircle className="h-3 w-3" />
                          Please enter a valid email address
                        </p>
                      )}
                      {emailStatus === "available" && (
                        <p className="text-xs text-green-600 flex items-center gap-1">
                          <Check className="h-3 w-3" />
                          Email is available
                        </p>
                      )}
                    </div>

                    {/* Gender */}
                    <div className="space-y-2">
                      <label
                        htmlFor="gender"
                        className="text-xs md:text-sm font-medium"
                        style={{ color: themeColors.text1 }}
                      >
                        Gender
                      </label>
                      <select
                        id="gender"
                        value={formData.gender}
                        onChange={(e) =>
                          setFormData({ ...formData, gender: e.target.value })
                        }
                        onFocus={(e) =>
                          (e.currentTarget.style.borderColor =
                            themeColors.primary)
                        }
                        onBlur={(e) =>
                          (e.currentTarget.style.borderColor =
                            themeColors.border)
                        }
                        className="w-full px-3 md:px-4 py-2 md:py-2.5 rounded-lg text-sm md:text-base transition-colors"
                        style={{
                          backgroundColor: themeColors.inputBg,
                          border: `1px solid ${themeColors.border}`,
                          color: themeColors.text1,
                        }}
                        required
                      >
                        <option value="">Select your gender</option>
                        <option value="male">Male</option>
                        <option value="female">Female</option>
                        <option value="other">Other</option>
                        <option value="prefer-not-to-say">
                          Prefer not to say
                        </option>
                      </select>
                    </div>

                    {/* Next Button */}
                    <button
                      type="button"
                      onClick={handleNextStep}
                      disabled={
                        !formData.name ||
                        !formData.gender ||
                        usernameStatus !== "available" ||
                        emailStatus !== "available"
                      }
                      className="w-full py-2.5 md:py-3 rounded-lg text-white text-sm md:text-base font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed hover:opacity-90"
                      style={{ backgroundColor: themeColors.primary }}
                    >
                      <span className="flex items-center justify-center gap-2">
                        Next: Set Password{" "}
                        <ArrowRight className="h-4 w-4 md:h-5 md:w-5" />
                      </span>
                    </button>

                    {/* Google Sign In */}
                    <div className="relative my-4 md:my-6">
                      <div className="absolute inset-0 flex items-center">
                        <div
                          className="w-full border-t"
                          style={{ borderColor: themeColors.border }}
                        ></div>
                      </div>
                      <div className="relative flex justify-center text-xs">
                        <span
                          className="px-3"
                          style={{
                            backgroundColor: themeColors.bg2,
                            color: themeColors.text2,
                          }}
                        >
                          OR CONTINUE WITH
                        </span>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={handleGoogleSignIn}
                      disabled={isLoading}
                      className="w-full py-2.5 md:py-3 rounded-lg text-sm md:text-base font-medium transition-all hover:opacity-90"
                      style={{
                        border: `1px solid ${themeColors.border}`,
                        backgroundColor: themeColors.bg2,
                        color: themeColors.text1,
                      }}
                    >
                      <svg
                        className="w-4 h-4 md:w-5 md:h-5 mr-2 inline-block"
                        viewBox="0 0 24 24"
                      >
                        <path
                          fill="#4285F4"
                          d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                        />
                        <path
                          fill="#34A853"
                          d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                        />
                        <path
                          fill="#FBBC05"
                          d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                        />
                        <path
                          fill="#EA4335"
                          d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                        />
                      </svg>
                      Continue with Google
                    </button>

                    {/* Login Link */}
                    <p
                      className="text-center text-xs md:text-sm pt-3 md:pt-4"
                      style={{ color: themeColors.text2 }}
                    >
                      Already have an account?{" "}
                      <Link
                        href="/login"
                        className="font-semibold hover:underline"
                        style={{ color: themeColors.primary }}
                      >
                        Sign In
                      </Link>
                    </p>
                  </div>
                )}

                {/* Step 2: Password */}
                {currentStep === 2 && (
                  <div className="space-y-4 md:space-y-5">
                    {/* Summary */}
                    <div
                      className="p-3 md:p-4 rounded-lg"
                      style={{
                        backgroundColor: isDark ? "#1E3A8A20" : "#DBEAFE",
                        border: `1px solid ${isDark ? "#1E40AF" : "#93C5FD"}`,
                      }}
                    >
                      <p
                        className="font-medium mb-2 text-xs md:text-sm"
                        style={{ color: themeColors.text1 }}
                      >
                        Account Details:
                      </p>
                      <div className="space-y-1 text-xs">
                        <p style={{ color: themeColors.text2 }}>
                          <strong style={{ color: themeColors.text1 }}>
                            Name:
                          </strong>{" "}
                          {formData.name}
                        </p>
                        <p style={{ color: themeColors.text2 }}>
                          <strong style={{ color: themeColors.text1 }}>
                            Username:
                          </strong>{" "}
                          @{formData.username}
                        </p>
                        <p style={{ color: themeColors.text2 }}>
                          <strong style={{ color: themeColors.text1 }}>
                            Email:
                          </strong>{" "}
                          {formData.email}
                        </p>
                      </div>
                    </div>

                    {/* Password */}
                    <div className="space-y-2">
                      <label
                        htmlFor="password"
                        className="text-xs md:text-sm font-medium"
                        style={{ color: themeColors.text1 }}
                      >
                        Password
                      </label>
                      <div className="relative">
                        <Lock
                          className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 md:h-5 md:w-5"
                          style={{ color: themeColors.text2 }}
                        />
                        <input
                          id="password"
                          type={showPassword ? "text" : "password"}
                          placeholder="Create a strong password"
                          value={formData.password}
                          onChange={(e) => {
                            const password = e.target.value;
                            setFormData({ ...formData, password });
                            setPasswordStrength(
                              calculatePasswordStrength(password)
                            );
                          }}
                          onFocus={(e) =>
                            (e.currentTarget.style.borderColor =
                              themeColors.primary)
                          }
                          onBlur={(e) =>
                            (e.currentTarget.style.borderColor =
                              themeColors.border)
                          }
                          className="w-full pl-9 md:pl-10 pr-9 md:pr-10 py-2 md:py-2.5 rounded-lg text-sm md:text-base transition-colors"
                          style={{
                            backgroundColor: themeColors.inputBg,
                            border: `1px solid ${themeColors.border}`,
                            color: themeColors.text1,
                          }}
                          required
                          minLength={8}
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 transition-colors"
                          style={{ color: themeColors.text2 }}
                        >
                          {showPassword ? (
                            <EyeOff className="h-4 w-4 md:h-5 md:w-5" />
                          ) : (
                            <Eye className="h-4 w-4 md:h-5 md:w-5" />
                          )}
                        </button>
                      </div>

                      {/* Password Strength */}
                      {formData.password.length > 0 && (
                        <div className="space-y-1">
                          <div className="flex gap-1 h-1">
                            <div
                              className="flex-1 rounded-full transition-all"
                              style={{
                                backgroundColor:
                                  passwordStrength === "weak"
                                    ? "#DC2626"
                                    : passwordStrength === "medium"
                                    ? "#F59E0B"
                                    : passwordStrength === "strong"
                                    ? "#10B981"
                                    : themeColors.border,
                              }}
                            ></div>
                            <div
                              className="flex-1 rounded-full transition-all"
                              style={{
                                backgroundColor:
                                  passwordStrength === "medium" ||
                                  passwordStrength === "strong"
                                    ? passwordStrength === "medium"
                                      ? "#F59E0B"
                                      : "#10B981"
                                    : themeColors.border,
                              }}
                            ></div>
                            <div
                              className="flex-1 rounded-full transition-all"
                              style={{
                                backgroundColor:
                                  passwordStrength === "strong"
                                    ? "#10B981"
                                    : themeColors.border,
                              }}
                            ></div>
                          </div>
                          <p
                            className="text-xs font-medium"
                            style={{
                              color:
                                passwordStrength === "weak"
                                  ? "#DC2626"
                                  : passwordStrength === "medium"
                                  ? "#F59E0B"
                                  : passwordStrength === "strong"
                                  ? "#10B981"
                                  : themeColors.text2,
                            }}
                          >
                            {passwordStrength === "weak" && "Weak password"}
                            {passwordStrength === "medium" && "Medium strength"}
                            {passwordStrength === "strong" &&
                              "Strong password ✓"}
                          </p>
                        </div>
                      )}
                    </div>

                    {/* Confirm Password */}
                    <div className="space-y-2">
                      <label
                        htmlFor="confirmPassword"
                        className="text-xs md:text-sm font-medium"
                        style={{ color: themeColors.text1 }}
                      >
                        Confirm Password
                      </label>
                      <div className="relative">
                        <Lock
                          className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 md:h-5 md:w-5"
                          style={{ color: themeColors.text2 }}
                        />
                        <input
                          id="confirmPassword"
                          type={showConfirmPassword ? "text" : "password"}
                          placeholder="Re-enter your password"
                          value={formData.confirmPassword}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              confirmPassword: e.target.value,
                            })
                          }
                          onFocus={(e) =>
                            (e.currentTarget.style.borderColor =
                              themeColors.primary)
                          }
                          onBlur={(e) =>
                            (e.currentTarget.style.borderColor =
                              formData.confirmPassword &&
                              formData.password !== formData.confirmPassword
                                ? "#DC2626"
                                : formData.confirmPassword &&
                                  formData.password === formData.confirmPassword
                                ? "#10B981"
                                : themeColors.border)
                          }
                          className="w-full pl-9 md:pl-10 pr-9 md:pr-10 py-2 md:py-2.5 rounded-lg text-sm md:text-base transition-colors"
                          style={{
                            backgroundColor: themeColors.inputBg,
                            border: `1px solid ${
                              formData.confirmPassword &&
                              formData.password !== formData.confirmPassword
                                ? "#DC2626"
                                : formData.confirmPassword &&
                                  formData.password === formData.confirmPassword
                                ? "#10B981"
                                : themeColors.border
                            }`,
                            color: themeColors.text1,
                          }}
                          required
                        />
                        <button
                          type="button"
                          onClick={() =>
                            setShowConfirmPassword(!showConfirmPassword)
                          }
                          className="absolute right-3 top-1/2 -translate-y-1/2 transition-colors"
                          style={{ color: themeColors.text2 }}
                        >
                          {showConfirmPassword ? (
                            <EyeOff className="h-4 w-4 md:h-5 md:w-5" />
                          ) : (
                            <Eye className="h-4 w-4 md:h-5 md:w-5" />
                          )}
                        </button>
                      </div>
                      {formData.confirmPassword &&
                        formData.password !== formData.confirmPassword && (
                          <p className="text-xs text-red-600 flex items-center gap-1">
                            <AlertCircle className="h-3 w-3" />
                            Passwords don't match
                          </p>
                        )}
                      {formData.confirmPassword &&
                        formData.password === formData.confirmPassword && (
                          <p className="text-xs text-green-600 flex items-center gap-1">
                            <Check className="h-3 w-3" />
                            Passwords match
                          </p>
                        )}
                    </div>

                    {/* Buttons */}
                    <div className="flex gap-2 md:gap-3">
                      <button
                        type="button"
                        onClick={() => setCurrentStep(1)}
                        className="px-4 md:px-6 py-2.5 md:py-3 rounded-lg text-sm md:text-base transition-all hover:opacity-90"
                        style={{
                          border: `1px solid ${themeColors.border}`,
                          backgroundColor: themeColors.bg2,
                          color: themeColors.text1,
                        }}
                      >
                        <ArrowLeft className="h-4 w-4 md:h-5 md:w-5 mr-2 inline-block" />
                        Back
                      </button>
                      <button
                        type="button"
                        onClick={handleNextStep}
                        disabled={
                          isLoading ||
                          !formData.password ||
                          formData.password !== formData.confirmPassword ||
                          passwordStrength === "weak"
                        }
                        className="flex-1 py-2.5 md:py-3 rounded-lg text-white text-sm md:text-base font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed hover:opacity-90"
                        style={{ backgroundColor: themeColors.primary }}
                      >
                        {isLoading ? (
                          <div className="flex items-center justify-center gap-2">
                            <Loader2 className="h-4 w-4 md:h-5 md:w-5 animate-spin" />
                            Creating...
                          </div>
                        ) : (
                          "Create Account"
                        )}
                      </button>
                    </div>
                  </div>
                )}

                {/* Step 3: OTP Verification */}
                {currentStep === 3 && (
                  <form
                    onSubmit={handleVerifyOTP}
                    className="space-y-4 md:space-y-6"
                  >
                    {/* OTP Info */}
                    <div className="text-center space-y-2 md:space-y-3">
                      <div
                        className="inline-flex items-center justify-center w-14 h-14 md:w-16 md:h-16 rounded-full mb-2"
                        style={{
                          backgroundColor: isDark ? "#1E3A8A" : "#DBEAFE",
                        }}
                      >
                        <ShieldCheck
                          className="w-7 h-7 md:w-8 md:h-8"
                          style={{ color: themeColors.primary }}
                        />
                      </div>
                      <p
                        className="text-xs md:text-sm"
                        style={{ color: themeColors.text2 }}
                      >
                        We've sent a 6-digit code to
                        <br />
                        <span
                          className="font-semibold"
                          style={{ color: themeColors.text1 }}
                        >
                          {formData.email}
                        </span>
                      </p>
                    </div>

                    {/* OTP Input */}
                    <div className="space-y-2">
                      <label
                        htmlFor="otp"
                        className="text-xs md:text-sm font-medium"
                        style={{ color: themeColors.text1 }}
                      >
                        Verification Code
                      </label>
                      <input
                        id="otp"
                        type="text"
                        placeholder="000000"
                        value={otp}
                        onChange={(e) =>
                          setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))
                        }
                        onFocus={(e) =>
                          (e.currentTarget.style.borderColor =
                            themeColors.primary)
                        }
                        onBlur={(e) =>
                          (e.currentTarget.style.borderColor =
                            themeColors.border)
                        }
                        className="w-full h-12 md:h-14 text-center text-xl md:text-2xl font-bold tracking-widest rounded-lg transition-colors"
                        style={{
                          backgroundColor: themeColors.inputBg,
                          border: `1px solid ${themeColors.border}`,
                          color: themeColors.text1,
                        }}
                        required
                        maxLength={6}
                        pattern="\d{6}"
                      />
                      <p
                        className="text-xs text-center"
                        style={{ color: themeColors.text2 }}
                      >
                        Code expires in 10 minutes
                      </p>
                    </div>

                    {/* Verify Button */}
                    <button
                      type="submit"
                      disabled={isLoading || otp.length !== 6}
                      className="w-full py-2.5 md:py-3 rounded-lg text-white text-sm md:text-base font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed hover:opacity-90"
                      style={{ backgroundColor: themeColors.primary }}
                    >
                      {isLoading ? (
                        <div className="flex items-center justify-center gap-2">
                          <Loader2 className="h-4 w-4 md:h-5 md:w-5 animate-spin" />
                          Verifying...
                        </div>
                      ) : (
                        "Verify Email"
                      )}
                    </button>

                    {/* Resend OTP */}
                    <div className="text-center space-y-2 md:space-y-3">
                      <p
                        className="text-xs md:text-sm"
                        style={{ color: themeColors.text2 }}
                      >
                        Didn't receive the code?
                      </p>
                      <button
                        type="button"
                        onClick={handleResendOTP}
                        disabled={resendTimer > 0 || isLoading}
                        className="font-medium text-sm disabled:opacity-50 hover:underline"
                        style={{ color: themeColors.primary }}
                      >
                        {resendTimer > 0 ? (
                          <div className="flex items-center justify-center gap-2">
                            <Clock className="w-3 h-3 md:w-4 md:h-4" />
                            Resend in {resendTimer}s
                          </div>
                        ) : (
                          "Resend Code"
                        )}
                      </button>
                    </div>

                    {/* Back Link */}
                    <div className="text-center pt-3 md:pt-4">
                      <button
                        type="button"
                        onClick={() => {
                          setCurrentStep(1);
                          setOtp("");
                        }}
                        className="text-xs md:text-sm transition-colors hover:underline"
                        style={{ color: themeColors.text2 }}
                      >
                        ← Change email address
                      </button>
                    </div>
                  </form>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
