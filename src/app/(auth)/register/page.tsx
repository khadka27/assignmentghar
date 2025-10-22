"use client";

import { useState, useEffect } from "react";
import { signIn, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
} from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

export default function RegisterPage() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const { toast } = useToast();

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
        const res = await fetch(
          `/api/auth/check-email?email=${encodeURIComponent(email)}`
        );
        if (cancelled) return;
        const data = await res.json();
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
        const res = await fetch(
          `/api/auth/check-username?username=${encodeURIComponent(username)}`
        );
        if (cancelled) return;
        const data = await res.json();
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
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.name,
          username: formData.username,
          email: formData.email,
          password: formData.password,
        }),
      });

      const data = await res.json();

      if (res.ok) {
        toast({
          title: "✅ Account Created Successfully!",
          description:
            "We've sent a 6-digit verification code to your email. Please check your inbox (and spam folder).",
        });
        setCurrentStep(3);
        setResendTimer(60);
      } else {
        let errorMessage = data.message || "Something went wrong";
        let errorTitle = "Registration Failed";

        if (data.code === "EMAIL_TAKEN") {
          errorTitle = "Email Already Registered";
          errorMessage =
            "This email is already registered. Please login or use a different email.";
        } else if (data.code === "USERNAME_TAKEN") {
          errorTitle = "Username Taken";
          errorMessage =
            "This username is already taken. Please choose another.";
        } else if (data.code === "WEAK_PASSWORD") {
          errorTitle = "Weak Password";
          errorMessage =
            "Please use a stronger password (at least 8 characters with numbers and symbols).";
        } else if (data.code === "INVALID_EMAIL") {
          errorTitle = "Invalid Email";
          errorMessage = "Please enter a valid email address.";
        }

        toast({
          variant: "destructive",
          title: errorTitle,
          description: errorMessage,
        });
        if (data.code === "EMAIL_TAKEN" || data.code === "USERNAME_TAKEN") {
          setCurrentStep(1);
        }
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Something went wrong. Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const res = await fetch("/api/auth/verify-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: formData.email,
          otp: otp,
        }),
      });

      const data = await res.json();

      if (res.ok) {
        toast({
          title: "Email Verified!",
          description:
            "Your account has been created successfully. Redirecting to login...",
        });
        setTimeout(() => router.push("/login"), 1500);
      } else {
        toast({
          variant: "destructive",
          title: "Verification Failed",
          description: data.error || "Invalid OTP",
        });
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Something went wrong. Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendOTP = async () => {
    if (resendTimer > 0) return;

    setIsLoading(true);
    try {
      const res = await fetch("/api/auth/resend-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: formData.email,
        }),
      });

      const data = await res.json();

      if (res.ok) {
        toast({
          title: "OTP Resent!",
          description: "Please check your email for the new verification code.",
        });
        setResendTimer(60);
        setOtp("");
      } else {
        toast({
          variant: "destructive",
          title: "Failed to Resend",
          description: data.error || "Something went wrong",
        });
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Something went wrong. Please try again.",
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
    <div className="min-h-screen bg-white dark:bg-black">
      <div className="container mx-auto px-4 py-8 lg:py-0">
        <div className="min-h-screen flex items-center justify-center">
          <div className="w-full max-w-[1200px] grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            {/* Left Side - Hero Section */}
            <div className="hidden lg:block space-y-8">
              <div className="space-y-4">
                <div className="inline-block">
                  <h1 className="text-5xl lg:text-6xl font-bold text-gray-900 dark:text-white mb-2">
                    Join Us Today
                  </h1>
                  <div className="h-1.5 bg-blue-600 rounded-full w-32"></div>
                </div>
                <p className="text-lg text-gray-600 dark:text-gray-400 max-w-md">
                  Create your account and start managing your assignments
                  efficiently
                </p>
              </div>

              {/* Feature Cards */}
              <div className="space-y-4">
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
                    className="flex items-start gap-4 p-4 rounded-xl bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 transition-all hover:border-blue-600 dark:hover:border-blue-600"
                  >
                    <div className="text-3xl">{feature.icon}</div>
                    <div>
                      <h3 className="font-semibold text-gray-900 dark:text-white mb-1">
                        {feature.title}
                      </h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
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
              <div className="lg:hidden mb-8 text-center">
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                  Assignment Hub
                </h1>
                <div className="h-1 bg-blue-600 rounded-full w-16 mx-auto"></div>
              </div>

              <div className="bg-white dark:bg-gray-950 rounded-2xl border border-gray-200 dark:border-gray-800 p-8 shadow-sm">
                {/* Header */}
                <div className="mb-8">
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                    {currentStep === 3 ? "Verify Email" : "Create Account"}
                  </h2>
                  <p className="text-gray-600 dark:text-gray-400">
                    {currentStep === 3
                      ? "Enter the code sent to your email"
                      : "Fill in your details to get started"}
                  </p>
                </div>

                {/* Progress Indicator */}
                {currentStep !== 3 && (
                  <div className="mb-6">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                        Step {currentStep} of 2
                      </span>
                      <span className="text-xs text-gray-500">
                        {currentStep === 1 ? "Basic Info" : "Set Password"}
                      </span>
                    </div>
                    <div className="flex gap-2">
                      <div
                        className={`h-1.5 flex-1 rounded-full transition-all ${
                          currentStep >= 1
                            ? "bg-blue-600"
                            : "bg-gray-300 dark:bg-gray-700"
                        }`}
                      ></div>
                      <div
                        className={`h-1.5 flex-1 rounded-full transition-all ${
                          currentStep >= 2
                            ? "bg-blue-600"
                            : "bg-gray-300 dark:bg-gray-700"
                        }`}
                      ></div>
                    </div>
                  </div>
                )}

                {/* Step 1: Basic Info */}
                {currentStep === 1 && (
                  <div className="space-y-5">
                    {/* Name */}
                    <div className="space-y-2">
                      <Label
                        htmlFor="name"
                        className="text-sm font-medium text-gray-900 dark:text-white"
                      >
                        Full Name
                      </Label>
                      <div className="relative">
                        <User className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                        <Input
                          id="name"
                          type="text"
                          placeholder="Enter your full name"
                          value={formData.name}
                          onChange={(e) =>
                            setFormData({ ...formData, name: e.target.value })
                          }
                          className="pl-10 h-11 bg-gray-50 dark:bg-gray-900 border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white placeholder:text-gray-500 focus:border-blue-600 focus:ring-1 focus:ring-blue-600"
                          required
                        />
                      </div>
                    </div>

                    {/* Username */}
                    <div className="space-y-2">
                      <Label
                        htmlFor="username"
                        className="text-sm font-medium text-gray-900 dark:text-white"
                      >
                        Username
                      </Label>
                      <div className="relative">
                        <User className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                        <Input
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
                          className={`pl-10 pr-10 h-11 bg-gray-50 dark:bg-gray-900 border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white placeholder:text-gray-500 focus:border-blue-600 focus:ring-1 focus:ring-blue-600 ${
                            usernameStatus === "available"
                              ? "border-green-600"
                              : usernameStatus === "taken" ||
                                usernameStatus === "invalid"
                              ? "border-red-600"
                              : ""
                          }`}
                          required
                          minLength={3}
                        />
                        {formData.username.length >= 3 && (
                          <div className="absolute right-3 top-1/2 -translate-y-1/2">
                            {usernameStatus === "checking" ? (
                              <Loader2 className="h-5 w-5 text-gray-400 animate-spin" />
                            ) : usernameStatus === "available" ? (
                              <Check className="h-5 w-5 text-green-600" />
                            ) : usernameStatus === "taken" ||
                              usernameStatus === "invalid" ? (
                              <X className="h-5 w-5 text-red-600" />
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
                      <Label
                        htmlFor="email"
                        className="text-sm font-medium text-gray-900 dark:text-white"
                      >
                        Email Address
                      </Label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                        <Input
                          id="email"
                          type="email"
                          placeholder="Enter your email"
                          value={formData.email}
                          onChange={(e) => {
                            setFormData({ ...formData, email: e.target.value });
                          }}
                          className={`pl-10 pr-10 h-11 bg-gray-50 dark:bg-gray-900 border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white placeholder:text-gray-500 focus:border-blue-600 focus:ring-1 focus:ring-blue-600 ${
                            emailStatus === "available"
                              ? "border-green-600"
                              : emailStatus === "taken" ||
                                emailStatus === "invalid"
                              ? "border-red-600"
                              : ""
                          }`}
                          required
                        />
                        {formData.email.length > 0 && (
                          <div className="absolute right-3 top-1/2 -translate-y-1/2">
                            {emailStatus === "checking" ? (
                              <Loader2 className="h-5 w-5 text-gray-400 animate-spin" />
                            ) : emailStatus === "available" ? (
                              <Check className="h-5 w-5 text-green-600" />
                            ) : emailStatus === "taken" ||
                              emailStatus === "invalid" ? (
                              <X className="h-5 w-5 text-red-600" />
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
                      <Label
                        htmlFor="gender"
                        className="text-sm font-medium text-gray-900 dark:text-white"
                      >
                        Gender
                      </Label>
                      <select
                        id="gender"
                        value={formData.gender}
                        onChange={(e) =>
                          setFormData({ ...formData, gender: e.target.value })
                        }
                        className="w-full h-11 px-4 bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-lg focus:border-blue-600 focus:ring-1 focus:ring-blue-600 text-gray-900 dark:text-white"
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
                    <Button
                      type="button"
                      onClick={handleNextStep}
                      disabled={
                        !formData.name ||
                        !formData.gender ||
                        usernameStatus !== "available" ||
                        emailStatus !== "available"
                      }
                      className="w-full h-11 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      <span className="flex items-center justify-center gap-2">
                        Next: Set Password <ArrowRight className="h-5 w-5" />
                      </span>
                    </Button>

                    {/* Google Sign In */}
                    <div className="relative my-6">
                      <div className="absolute inset-0 flex items-center">
                        <div className="w-full border-t border-gray-200 dark:border-gray-800"></div>
                      </div>
                      <div className="relative flex justify-center text-xs">
                        <span className="px-3 bg-white dark:bg-gray-950 text-gray-500">
                          OR CONTINUE WITH
                        </span>
                      </div>
                    </div>

                    <Button
                      type="button"
                      onClick={handleGoogleSignIn}
                      disabled={isLoading}
                      variant="outline"
                      className="w-full h-11 border-gray-300 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-900 text-gray-900 dark:text-white font-medium rounded-lg"
                    >
                      <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
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
                    </Button>

                    {/* Login Link */}
                    <p className="text-center text-sm text-gray-600 dark:text-gray-400 pt-4">
                      Already have an account?{" "}
                      <Link
                        href="/login"
                        className="text-blue-600 hover:text-blue-700 dark:text-blue-500 dark:hover:text-blue-400 font-semibold"
                      >
                        Sign In
                      </Link>
                    </p>
                  </div>
                )}

                {/* Step 2: Password */}
                {currentStep === 2 && (
                  <div className="space-y-5">
                    {/* Summary */}
                    <Alert className="bg-blue-50 dark:bg-blue-950/30 border-blue-200 dark:border-blue-900">
                      <AlertDescription className="text-sm text-gray-700 dark:text-gray-300">
                        <p className="font-medium mb-2">Account Details:</p>
                        <div className="space-y-1 text-xs">
                          <p>
                            <strong>Name:</strong> {formData.name}
                          </p>
                          <p>
                            <strong>Username:</strong> @{formData.username}
                          </p>
                          <p>
                            <strong>Email:</strong> {formData.email}
                          </p>
                        </div>
                      </AlertDescription>
                    </Alert>

                    {/* Password */}
                    <div className="space-y-2">
                      <Label
                        htmlFor="password"
                        className="text-sm font-medium text-gray-900 dark:text-white"
                      >
                        Password
                      </Label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                        <Input
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
                          className="pl-10 pr-10 h-11 bg-gray-50 dark:bg-gray-900 border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white placeholder:text-gray-500 focus:border-blue-600 focus:ring-1 focus:ring-blue-600"
                          required
                          minLength={8}
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                        >
                          {showPassword ? (
                            <EyeOff className="h-5 w-5" />
                          ) : (
                            <Eye className="h-5 w-5" />
                          )}
                        </button>
                      </div>

                      {/* Password Strength */}
                      {formData.password.length > 0 && (
                        <div className="space-y-1">
                          <div className="flex gap-1 h-1">
                            <div
                              className={`flex-1 rounded-full transition-all ${
                                passwordStrength === "weak"
                                  ? "bg-red-600"
                                  : passwordStrength === "medium"
                                  ? "bg-yellow-500"
                                  : passwordStrength === "strong"
                                  ? "bg-green-600"
                                  : "bg-gray-300"
                              }`}
                            ></div>
                            <div
                              className={`flex-1 rounded-full transition-all ${
                                passwordStrength === "medium" ||
                                passwordStrength === "strong"
                                  ? passwordStrength === "medium"
                                    ? "bg-yellow-500"
                                    : "bg-green-600"
                                  : "bg-gray-300"
                              }`}
                            ></div>
                            <div
                              className={`flex-1 rounded-full transition-all ${
                                passwordStrength === "strong"
                                  ? "bg-green-600"
                                  : "bg-gray-300"
                              }`}
                            ></div>
                          </div>
                          <p
                            className={`text-xs font-medium ${
                              passwordStrength === "weak"
                                ? "text-red-600"
                                : passwordStrength === "medium"
                                ? "text-yellow-600"
                                : passwordStrength === "strong"
                                ? "text-green-600"
                                : "text-gray-500"
                            }`}
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
                      <Label
                        htmlFor="confirmPassword"
                        className="text-sm font-medium text-gray-900 dark:text-white"
                      >
                        Confirm Password
                      </Label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                        <Input
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
                          className={`pl-10 pr-10 h-11 bg-gray-50 dark:bg-gray-900 border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white placeholder:text-gray-500 focus:border-blue-600 focus:ring-1 focus:ring-blue-600 ${
                            formData.confirmPassword &&
                            formData.password !== formData.confirmPassword
                              ? "border-red-600"
                              : formData.confirmPassword &&
                                formData.password === formData.confirmPassword
                              ? "border-green-600"
                              : ""
                          }`}
                          required
                        />
                        <button
                          type="button"
                          onClick={() =>
                            setShowConfirmPassword(!showConfirmPassword)
                          }
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                        >
                          {showConfirmPassword ? (
                            <EyeOff className="h-5 w-5" />
                          ) : (
                            <Eye className="h-5 w-5" />
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
                    <div className="flex gap-3">
                      <Button
                        type="button"
                        onClick={() => setCurrentStep(1)}
                        variant="outline"
                        className="h-11 px-6 border-gray-300 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-900"
                      >
                        <ArrowLeft className="h-5 w-5 mr-2" />
                        Back
                      </Button>
                      <Button
                        type="button"
                        onClick={handleNextStep}
                        disabled={
                          isLoading ||
                          !formData.password ||
                          formData.password !== formData.confirmPassword ||
                          passwordStrength === "weak"
                        }
                        className="flex-1 h-11 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {isLoading ? (
                          <div className="flex items-center gap-2">
                            <Loader2 className="h-5 w-5 animate-spin" />
                            Creating...
                          </div>
                        ) : (
                          "Create Account"
                        )}
                      </Button>
                    </div>
                  </div>
                )}

                {/* Step 3: OTP Verification */}
                {currentStep === 3 && (
                  <form onSubmit={handleVerifyOTP} className="space-y-6">
                    {/* OTP Info */}
                    <div className="text-center space-y-3">
                      <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 dark:bg-blue-950 rounded-full mb-2">
                        <ShieldCheck className="w-8 h-8 text-blue-600" />
                      </div>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        We've sent a 6-digit code to
                        <br />
                        <span className="font-semibold text-gray-900 dark:text-white">
                          {formData.email}
                        </span>
                      </p>
                    </div>

                    {/* OTP Input */}
                    <div className="space-y-2">
                      <Label
                        htmlFor="otp"
                        className="text-sm font-medium text-gray-900 dark:text-white"
                      >
                        Verification Code
                      </Label>
                      <Input
                        id="otp"
                        type="text"
                        placeholder="000000"
                        value={otp}
                        onChange={(e) =>
                          setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))
                        }
                        className="h-14 text-center text-2xl font-bold tracking-widest bg-gray-50 dark:bg-gray-900 border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white focus:border-blue-600 focus:ring-1 focus:ring-blue-600"
                        required
                        maxLength={6}
                        pattern="\d{6}"
                      />
                      <p className="text-xs text-gray-500 dark:text-gray-400 text-center">
                        Code expires in 10 minutes
                      </p>
                    </div>

                    {/* Verify Button */}
                    <Button
                      type="submit"
                      disabled={isLoading || otp.length !== 6}
                      className="w-full h-11 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isLoading ? (
                        <div className="flex items-center gap-2">
                          <Loader2 className="h-5 w-5 animate-spin" />
                          Verifying...
                        </div>
                      ) : (
                        "Verify Email"
                      )}
                    </Button>

                    {/* Resend OTP */}
                    <div className="text-center space-y-3">
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Didn't receive the code?
                      </p>
                      <Button
                        type="button"
                        onClick={handleResendOTP}
                        disabled={resendTimer > 0 || isLoading}
                        variant="ghost"
                        className="text-blue-600 hover:text-blue-700 dark:text-blue-500 dark:hover:text-blue-400 font-medium disabled:opacity-50"
                      >
                        {resendTimer > 0 ? (
                          <div className="flex items-center gap-2">
                            <Clock className="w-4 h-4" />
                            Resend in {resendTimer}s
                          </div>
                        ) : (
                          "Resend Code"
                        )}
                      </Button>
                    </div>

                    {/* Back Link */}
                    <div className="text-center pt-4">
                      <button
                        type="button"
                        onClick={() => {
                          setCurrentStep(1);
                          setOtp("");
                        }}
                        className="text-sm text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white transition-colors"
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
