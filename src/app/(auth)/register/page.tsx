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
} from "lucide-react";

export default function RegisterPage() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const { toast } = useToast();

  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [currentStep, setCurrentStep] = useState<1 | 2 | 3>(1); // Step 1: Basic Info, Step 2: Password, Step 3: OTP
  const [otp, setOtp] = useState("");
  const [resendTimer, setResendTimer] = useState(0);
  const [passwordStrength, setPasswordStrength] = useState<
    "weak" | "medium" | "strong" | null
  >(null);

  // Real-time validation states
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

  // Calculate password strength
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

  // Real-time email availability check
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

  // Real-time username availability check
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

  // Redirect if already logged in
  useEffect(() => {
    if (status === "authenticated" && session?.user) {
      router.push("/");
    }
  }, [status, session, router]);

  // Resend timer countdown
  useEffect(() => {
    if (resendTimer > 0) {
      const timer = setTimeout(() => setResendTimer(resendTimer - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [resendTimer]);

  // Validate Step 1 (Basic Info)
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

  // Validate Step 2 (Password)
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
        setCurrentStep(3); // Move to OTP verification
        setResendTimer(60); // Start 60 second countdown
      } else {
        // Enhanced error messages based on error code
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
        // Go back to step 1 if email/username issue
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
        setResendTimer(60); // Restart countdown
        setOtp(""); // Clear current OTP
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
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 dark:from-gray-900 dark:via-blue-950 dark:to-purple-950 p-4">
      <div className="w-full max-w-6xl grid lg:grid-cols-2 gap-8 items-center">
        {/* Left Side - Illustration */}
        <div className="hidden lg:flex flex-col items-center justify-center p-12 bg-gradient-to-br from-blue-100 to-purple-100 dark:from-blue-950/50 dark:to-purple-950/50 rounded-3xl shadow-2xl backdrop-blur-sm border border-blue-200/50 dark:border-blue-800/50 transition-all duration-500 hover:shadow-blue-500/20 hover:scale-[1.02]">
          {/* Illustration */}
          <div className="relative w-full max-w-md mb-8 animate-float">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full blur-3xl opacity-20 animate-pulse"></div>
            <div className="relative bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl p-8 shadow-xl">
              {/* Mathematical symbols floating around */}
              <div className="absolute -top-6 -left-6 text-4xl animate-bounce">
                📚
              </div>
              <div className="absolute -top-4 -right-4 text-3xl animate-bounce delay-100">
                ✏️
              </div>
              <div className="absolute -bottom-4 -left-4 text-3xl animate-bounce delay-200">
                📝
              </div>
              <div className="absolute -bottom-6 -right-6 text-4xl animate-bounce delay-300">
                🎓
              </div>

              {/* Central illustration */}
              <div className="flex flex-col items-center justify-center space-y-6">
                <div className="w-48 h-48 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center shadow-2xl animate-pulse-slow">
                  <User className="w-24 h-24 text-white" />
                </div>

                {/* Floating papers/assignments */}
                <div className="grid grid-cols-3 gap-4 w-full">
                  {[1, 2, 3].map((i) => (
                    <div
                      key={i}
                      className="bg-white dark:bg-gray-700 rounded-lg p-4 shadow-lg transform hover:scale-110 transition-transform duration-300"
                      style={{ animationDelay: `${i * 0.2}s` }}
                    >
                      <div className="h-2 bg-gradient-to-r from-blue-400 to-purple-400 rounded mb-2"></div>
                      <div className="h-2 bg-gray-200 dark:bg-gray-600 rounded mb-1"></div>
                      <div className="h-2 bg-gray-200 dark:bg-gray-600 rounded w-2/3"></div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Title and Description */}
          <div className="text-center space-y-4 animate-fade-in">
            <h2 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Assignment Hub
            </h2>
            <p className="text-gray-700 dark:text-gray-300 text-lg max-w-md">
              Join thousands of students achieving academic excellence with our
              platform
            </p>

            {/* Carousel indicators */}
            <div className="flex items-center justify-center gap-2 pt-4">
              {[1, 2, 3, 4].map((dot) => (
                <div
                  key={dot}
                  className={`h-2 rounded-full transition-all duration-300 ${
                    dot === 2
                      ? "w-8 bg-gradient-to-r from-blue-500 to-purple-500"
                      : "w-2 bg-gray-400"
                  }`}
                ></div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Side - Auth Form */}
        <div className="w-full max-w-md mx-auto">
          <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-2xl border border-gray-200 dark:border-gray-700 p-8 transition-all duration-500 hover:shadow-blue-500/20">
            {/* Logo */}
            <div className="flex justify-center mb-8 animate-fade-in">
              <div className="relative group">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-500 rounded-2xl blur-xl opacity-50 group-hover:opacity-75 transition-opacity duration-300"></div>
                <div className="relative bg-white dark:bg-gray-900 rounded-2xl p-4 shadow-xl">
                  <Image
                    src="/Images/nav_logo.png"
                    alt="AssignmentGhar"
                    width={180}
                    height={50}
                    className="object-contain"
                  />
                </div>
              </div>
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
                    className={`h-2 flex-1 rounded-full transition-all duration-300 ${
                      currentStep >= 1
                        ? "bg-gradient-to-r from-blue-500 to-purple-500"
                        : "bg-gray-300"
                    }`}
                  ></div>
                  <div
                    className={`h-2 flex-1 rounded-full transition-all duration-300 ${
                      currentStep >= 2
                        ? "bg-gradient-to-r from-blue-500 to-purple-500"
                        : "bg-gray-300"
                    }`}
                  ></div>
                </div>
              </div>
            )}

            {/* Form */}
            {currentStep === 1 ? (
              <div className="space-y-6">
                {/* Name field */}
                <div className="space-y-2 animate-slide-down">
                  <Label
                    htmlFor="name"
                    className="text-gray-700 dark:text-gray-300 font-medium"
                  >
                    Full Name
                  </Label>
                  <div className="relative group">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 group-focus-within:text-blue-500 transition-colors duration-300" />
                    <Input
                      id="name"
                      type="text"
                      placeholder="John Doe"
                      value={formData.name}
                      onChange={(e) =>
                        setFormData({ ...formData, name: e.target.value })
                      }
                      className="pl-10 h-12 bg-gray-50 dark:bg-gray-900/50 border-gray-300 dark:border-gray-600 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all duration-300"
                      required
                    />
                  </div>
                </div>

                {/* Username field */}
                <div
                  className="space-y-2 animate-slide-down"
                  style={{ animationDelay: "0.1s" }}
                >
                  <Label
                    htmlFor="username"
                    className="text-gray-700 dark:text-gray-300 font-medium"
                  >
                    Username
                  </Label>
                  <div className="relative group">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 group-focus-within:text-blue-500 transition-colors duration-300" />
                    <Input
                      id="username"
                      type="text"
                      placeholder="johndoe123"
                      value={formData.username}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          username: e.target.value.trim().toLowerCase(),
                        })
                      }
                      className={`pl-10 pr-10 h-12 bg-gray-50 dark:bg-gray-900/50 border-gray-300 dark:border-gray-600 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all duration-300 ${
                        usernameStatus === "available"
                          ? "border-green-500"
                          : usernameStatus === "taken" ||
                            usernameStatus === "invalid"
                          ? "border-red-500"
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
                          <div className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center">
                            <Check className="h-3 w-3 text-white" />
                          </div>
                        ) : usernameStatus === "taken" ||
                          usernameStatus === "invalid" ? (
                          <div className="w-5 h-5 bg-red-500 rounded-full flex items-center justify-center">
                            <X className="h-3 w-3 text-white" />
                          </div>
                        ) : null}
                      </div>
                    )}
                  </div>
                  {usernameStatus === "taken" && (
                    <p className="text-xs text-red-500 mt-1">
                      Username already taken
                    </p>
                  )}
                  {usernameStatus === "invalid" && (
                    <p className="text-xs text-red-500 mt-1">
                      Only letters, numbers, _ and - allowed (min 3 characters)
                    </p>
                  )}
                  {usernameStatus === "available" && (
                    <p className="text-xs text-green-500 mt-1">
                      Username is available
                    </p>
                  )}
                </div>

                {/* Email field */}
                <div
                  className="space-y-2 animate-slide-down"
                  style={{ animationDelay: "0.2s" }}
                >
                  <Label
                    htmlFor="email"
                    className="text-gray-700 dark:text-gray-300 font-medium"
                  >
                    Email
                  </Label>
                  <div className="relative group">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 group-focus-within:text-blue-500 transition-colors duration-300" />
                    <Input
                      id="email"
                      type="email"
                      placeholder="john@example.com"
                      value={formData.email}
                      onChange={(e) => {
                        setFormData({ ...formData, email: e.target.value });
                      }}
                      className={`pl-10 pr-10 h-12 bg-gray-50 dark:bg-gray-900/50 border-gray-300 dark:border-gray-600 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all duration-300 ${
                        emailStatus === "available"
                          ? "border-green-500"
                          : emailStatus === "taken" || emailStatus === "invalid"
                          ? "border-red-500"
                          : ""
                      }`}
                      required
                    />
                    {formData.email.length > 0 && (
                      <div className="absolute right-3 top-1/2 -translate-y-1/2">
                        {emailStatus === "checking" ? (
                          <Loader2 className="h-5 w-5 text-gray-400 animate-spin" />
                        ) : emailStatus === "available" ? (
                          <div className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center">
                            <Check className="h-3 w-3 text-white" />
                          </div>
                        ) : emailStatus === "taken" ||
                          emailStatus === "invalid" ? (
                          <div className="w-5 h-5 bg-red-500 rounded-full flex items-center justify-center">
                            <X className="h-3 w-3 text-white" />
                          </div>
                        ) : null}
                      </div>
                    )}
                  </div>
                  {emailStatus === "taken" && (
                    <p className="text-xs text-red-500 mt-1">
                      Email already registered
                    </p>
                  )}
                  {emailStatus === "invalid" && (
                    <p className="text-xs text-red-500 mt-1">
                      Please enter a valid email address
                    </p>
                  )}
                  {emailStatus === "available" && (
                    <p className="text-xs text-green-500 mt-1">
                      Email is available
                    </p>
                  )}
                </div>

                {/* Gender field */}
                <div
                  className="space-y-2 animate-slide-down"
                  style={{ animationDelay: "0.3s" }}
                >
                  <Label
                    htmlFor="gender"
                    className="text-gray-700 dark:text-gray-300 font-medium"
                  >
                    Gender
                  </Label>
                  <select
                    id="gender"
                    value={formData.gender}
                    onChange={(e) =>
                      setFormData({ ...formData, gender: e.target.value })
                    }
                    className="w-full h-12 px-4 bg-gray-50 dark:bg-gray-900/50 border border-gray-300 dark:border-gray-600 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all duration-300 text-gray-900 dark:text-white"
                    required
                  >
                    <option value="">Select your gender</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="other">Other</option>
                    <option value="prefer-not-to-say">Prefer not to say</option>
                  </select>
                </div>

                {/* Next Button - Step 1 */}
                <Button
                  type="button"
                  onClick={handleNextStep}
                  disabled={
                    !formData.name ||
                    !formData.gender ||
                    usernameStatus !== "available" ||
                    emailStatus !== "available"
                  }
                  className="w-full h-12 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed animate-slide-down"
                  style={{ animationDelay: "0.4s" }}
                >
                  <span className="flex items-center gap-2">
                    Next: Set Password <ArrowRight className="h-5 w-5" />
                  </span>
                </Button>

                {/* Link to Login */}
                <div
                  className="text-center pt-4 animate-slide-down"
                  style={{ animationDelay: "0.5s" }}
                >
                  <p className="text-gray-600 dark:text-gray-400">
                    Already have an account?{" "}
                    <Link
                      href="/login"
                      className="text-blue-600 hover:text-purple-600 dark:text-blue-400 dark:hover:text-purple-400 font-semibold transition-colors duration-300 hover:underline"
                    >
                      Sign in
                    </Link>
                  </p>
                </div>
              </div>
            ) : currentStep === 2 ? (
              <div className="space-y-6">
                {/* Summary of Step 1 */}
                <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4 space-y-2 animate-fade-in">
                  <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Account Details:
                  </p>
                  <div className="text-xs text-gray-600 dark:text-gray-400 space-y-1">
                    <p>
                      <strong>Name:</strong> {formData.name}
                    </p>
                    <p>
                      <strong>Username:</strong> @{formData.username}
                    </p>
                    <p>
                      <strong>Email:</strong> {formData.email}
                    </p>
                    <p>
                      <strong>Gender:</strong>{" "}
                      {formData.gender.charAt(0).toUpperCase() +
                        formData.gender.slice(1).replace("-", " ")}
                    </p>
                  </div>
                </div>

                {/* Password field */}
                <div className="space-y-2 animate-slide-down">
                  <Label
                    htmlFor="password"
                    className="text-gray-700 dark:text-gray-300 font-medium"
                  >
                    Password
                  </Label>
                  <div className="relative group">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 group-focus-within:text-blue-500 transition-colors duration-300" />
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="••••••••••"
                      value={formData.password}
                      onChange={(e) => {
                        const password = e.target.value;
                        setFormData({ ...formData, password });
                        setPasswordStrength(
                          calculatePasswordStrength(password)
                        );
                      }}
                      className="pl-10 pr-10 h-12 bg-gray-50 dark:bg-gray-900/50 border-gray-300 dark:border-gray-600 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all duration-300"
                      required
                      minLength={8}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-blue-500 transition-colors duration-300"
                    >
                      {showPassword ? (
                        <EyeOff className="h-5 w-5" />
                      ) : (
                        <Eye className="h-5 w-5" />
                      )}
                    </button>
                  </div>

                  {/* Password Strength Indicator */}
                  {formData.password.length > 0 && (
                    <div className="space-y-1">
                      <div className="flex gap-1 h-1">
                        <div
                          className={`flex-1 rounded-full transition-all duration-300 ${
                            passwordStrength === "weak"
                              ? "bg-red-500"
                              : passwordStrength === "medium"
                              ? "bg-yellow-500"
                              : passwordStrength === "strong"
                              ? "bg-green-500"
                              : "bg-gray-300"
                          }`}
                        ></div>
                        <div
                          className={`flex-1 rounded-full transition-all duration-300 ${
                            passwordStrength === "medium" ||
                            passwordStrength === "strong"
                              ? passwordStrength === "medium"
                                ? "bg-yellow-500"
                                : "bg-green-500"
                              : "bg-gray-300"
                          }`}
                        ></div>
                        <div
                          className={`flex-1 rounded-full transition-all duration-300 ${
                            passwordStrength === "strong"
                              ? "bg-green-500"
                              : "bg-gray-300"
                          }`}
                        ></div>
                      </div>
                      <p
                        className={`text-xs font-medium ${
                          passwordStrength === "weak"
                            ? "text-red-500"
                            : passwordStrength === "medium"
                            ? "text-yellow-500"
                            : passwordStrength === "strong"
                            ? "text-green-500"
                            : "text-gray-500"
                        }`}
                      >
                        {passwordStrength === "weak" && "Weak password"}
                        {passwordStrength === "medium" &&
                          "Medium strength password"}
                        {passwordStrength === "strong" && "Strong password! ✓"}
                      </p>
                      {passwordStrength === "weak" && (
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          Use 8+ characters with uppercase, numbers & symbols
                        </p>
                      )}
                    </div>
                  )}
                </div>

                {/* Confirm Password */}
                <div
                  className="space-y-2 animate-slide-down"
                  style={{ animationDelay: "0.1s" }}
                >
                  <Label
                    htmlFor="confirmPassword"
                    className="text-gray-700 dark:text-gray-300 font-medium"
                  >
                    Confirm Password
                  </Label>
                  <div className="relative group">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 group-focus-within:text-blue-500 transition-colors duration-300" />
                    <Input
                      id="confirmPassword"
                      type={showConfirmPassword ? "text" : "password"}
                      placeholder="••••••••••"
                      value={formData.confirmPassword}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          confirmPassword: e.target.value,
                        })
                      }
                      className={`pl-10 pr-10 h-12 bg-gray-50 dark:bg-gray-900/50 border-gray-300 dark:border-gray-600 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all duration-300 ${
                        formData.confirmPassword &&
                        formData.password !== formData.confirmPassword
                          ? "border-red-500"
                          : formData.confirmPassword &&
                            formData.password === formData.confirmPassword
                          ? "border-green-500"
                          : ""
                      }`}
                      required
                    />
                    <button
                      type="button"
                      onClick={() =>
                        setShowConfirmPassword(!showConfirmPassword)
                      }
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-blue-500 transition-colors duration-300"
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
                      <p className="text-xs text-red-500 mt-1">
                        Passwords don't match
                      </p>
                    )}
                  {formData.confirmPassword &&
                    formData.password === formData.confirmPassword && (
                      <p className="text-xs text-green-500 mt-1">
                        Passwords match ✓
                      </p>
                    )}
                </div>

                {/* Back and Submit Buttons */}
                <div className="flex gap-3">
                  <Button
                    type="button"
                    onClick={() => setCurrentStep(1)}
                    variant="outline"
                    className="h-12 px-6 border-2 border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-800"
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
                    className="flex-1 h-12 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isLoading ? (
                      <div className="flex items-center gap-2">
                        <Loader2 className="h-5 w-5 animate-spin" />
                        <span>Creating account...</span>
                      </div>
                    ) : (
                      <span>Create Account</span>
                    )}
                  </Button>
                </div>
              </div>
            ) : (
              <div className="space-y-6">
                {/* OTP Info */}
                <div className="text-center space-y-2 animate-fade-in">
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full mb-4">
                    <ShieldCheck className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
                    Verify Your Email
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400">
                    We've sent a 6-digit code to
                    <br />
                    <span className="font-semibold text-blue-600 dark:text-blue-400">
                      {formData.email}
                    </span>
                  </p>
                </div>

                {/* OTP Input */}
                <div className="space-y-2 animate-slide-down">
                  <Label
                    htmlFor="otp"
                    className="text-gray-700 dark:text-gray-300 font-medium"
                  >
                    Verification Code
                  </Label>
                  <div className="relative group">
                    <Input
                      id="otp"
                      type="text"
                      placeholder="Enter 6-digit code"
                      value={otp}
                      onChange={(e) =>
                        setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))
                      }
                      className="h-14 text-center text-2xl font-bold tracking-widest bg-gray-50 dark:bg-gray-900/50 border-gray-300 dark:border-gray-600 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all duration-300"
                      required
                      maxLength={6}
                      pattern="\d{6}"
                    />
                  </div>
                  <p className="text-sm text-gray-500 dark:text-gray-400 text-center">
                    Code expires in 10 minutes
                  </p>
                </div>

                {/* Verify Button */}
                <Button
                  type="submit"
                  disabled={isLoading || otp.length !== 6}
                  className="w-full h-12 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? (
                    <div className="flex items-center gap-2">
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      <span>Verifying...</span>
                    </div>
                  ) : (
                    <span>Verify Email</span>
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
                    className="text-blue-600 hover:text-purple-600 dark:text-blue-400 dark:hover:text-purple-400 font-semibold disabled:opacity-50"
                  >
                    {resendTimer > 0 ? (
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4" />
                        <span>Resend in {resendTimer}s</span>
                      </div>
                    ) : (
                      <span>Resend OTP</span>
                    )}
                  </Button>
                </div>

                {/* Back to Register */}
                <div className="text-center pt-4">
                  <button
                    type="button"
                    onClick={() => {
                      setCurrentStep(1);
                      setOtp("");
                    }}
                    className="text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white transition-colors duration-300 text-sm"
                  >
                    ← Change email address
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <style jsx global>{`
        @keyframes float {
          0%,
          100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-20px);
          }
        }

        @keyframes pulse-slow {
          0%,
          100% {
            opacity: 1;
            transform: scale(1);
          }
          50% {
            opacity: 0.8;
            transform: scale(1.05);
          }
        }

        @keyframes fade-in {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        @keyframes slide-down {
          from {
            opacity: 0;
            transform: translateY(-20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-float {
          animation: float 6s ease-in-out infinite;
        }

        .animate-pulse-slow {
          animation: pulse-slow 3s ease-in-out infinite;
        }

        .animate-fade-in {
          animation: fade-in 1s ease-out;
        }

        .animate-slide-down {
          animation: slide-down 0.6s ease-out forwards;
        }

        .delay-100 {
          animation-delay: 0.1s;
        }

        .delay-200 {
          animation-delay: 0.2s;
        }

        .delay-300 {
          animation-delay: 0.3s;
        }
      `}</style>
    </div>
  );
}
