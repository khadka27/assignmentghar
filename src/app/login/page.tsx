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
} from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const { toast } = useToast();

  const [isLogin, setIsLogin] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [showOTPVerification, setShowOTPVerification] = useState(false);
  const [otp, setOtp] = useState("");
  const [resendTimer, setResendTimer] = useState(0);
  const [unverifiedEmail, setUnverifiedEmail] = useState("");

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

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

  const handleSendOTP = async (email: string) => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/auth/resend-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();

      if (res.ok) {
        toast({
          title: "Verification Code Sent!",
          description: "Please check your email for the verification code.",
        });
        setShowOTPVerification(true);
        setResendTimer(60);
      } else {
        toast({
          variant: "destructive",
          title: "Error",
          description: data.error || "Failed to send verification code",
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

  const handleVerifyOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const res = await fetch("/api/auth/verify-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: unverifiedEmail,
          otp: otp,
        }),
      });

      const data = await res.json();

      if (res.ok) {
        toast({
          title: "Email Verified!",
          description: "Your account has been verified. You can now login.",
        });
        setShowOTPVerification(false);
        setOtp("");
        setUnverifiedEmail("");
        // Auto-fill the login form
        setFormData({
          ...formData,
          email: unverifiedEmail,
        });
      } else {
        toast({
          variant: "destructive",
          title: "Verification Failed",
          description: data.error || "Invalid verification code",
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
    await handleSendOTP(unverifiedEmail);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      if (isLogin) {
        // Login
        const result = await signIn("credentials", {
          email: formData.email,
          password: formData.password,
          redirect: false,
        });

        if (result?.error) {
          // Parse error code from error message format: "CODE: message"
          const errorParts = result.error.split(": ");
          const errorCode = errorParts[0];
          const errorMessage = errorParts.slice(1).join(": ") || result.error;

          // Handle specific error codes
          switch (errorCode) {
            case "UNVERIFIED":
              // Account exists but not verified - Send OTP inline
              setUnverifiedEmail(formData.email);
              toast({
                title: "Email Not Verified",
                description: "Sending verification code to your email...",
              });
              await handleSendOTP(formData.email);
              // Alternative: Redirect to missing-verification page
              // router.push(`/missing-verification?email=${encodeURIComponent(formData.email)}`);
              break;

            case "USER_NOT_FOUND":
              toast({
                variant: "destructive",
                title: "User Not Found",
                description:
                  "No account found with this email. Please register first.",
              });
              break;

            case "INVALID_CREDENTIALS":
              toast({
                variant: "destructive",
                title: "Login Failed",
                description: errorMessage || "Email or password incorrect",
              });
              break;

            default:
              // Fallback for any other errors
              toast({
                variant: "destructive",
                title: "Login Failed",
                description: errorMessage || "An error occurred during login",
              });
          }
        } else {
          toast({
            title: "Welcome back!",
            description: "Login successful",
          });
          router.push("/");
        }
      } else {
        // Register
        if (formData.password !== formData.confirmPassword) {
          toast({
            variant: "destructive",
            title: "Error",
            description: "Passwords do not match",
          });
          setIsLoading(false);
          return;
        }

        const res = await fetch("/api/auth/register", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name: formData.name,
            email: formData.email,
            password: formData.password,
          }),
        });

        const data = await res.json();

        if (res.ok) {
          toast({
            title: "Account created!",
            description: "Please login with your credentials",
          });
          setIsLogin(true);
          setFormData({
            name: "",
            email: formData.email,
            password: "",
            confirmPassword: "",
          });
        } else {
          toast({
            variant: "destructive",
            title: "Registration Failed",
            description: data.message || "Something went wrong",
          });
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
              Unleash Your Academic Success with Assignment Hub's Excellence
              Platform
            </p>

            {/* Carousel indicators */}
            <div className="flex items-center justify-center gap-2 pt-4">
              {[1, 2, 3, 4].map((dot) => (
                <div
                  key={dot}
                  className={`h-2 rounded-full transition-all duration-300 ${
                    dot === 1
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
          <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-gray-200/50 dark:border-gray-700/50 p-8 transition-all duration-500 hover:shadow-blue-500/20">
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

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Name field - only for register */}
              {!isLogin && (
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
                      required={!isLogin}
                    />
                  </div>
                </div>
              )}

              {/* Email field */}
              <div
                className="space-y-2 animate-slide-down"
                style={{ animationDelay: "0.1s" }}
              >
                <Label
                  htmlFor="email"
                  className="text-gray-700 dark:text-gray-300 font-medium"
                >
                  {isLogin ? "Username or email" : "Email"}
                </Label>
                <div className="relative group">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 group-focus-within:text-blue-500 transition-colors duration-300" />
                  <Input
                    id="email"
                    type={isLogin ? "text" : "email"}
                    placeholder={isLogin ? "johnsmith007" : "john@example.com"}
                    value={formData.email}
                    onChange={(e) =>
                      setFormData({ ...formData, email: e.target.value })
                    }
                    className="pl-10 h-12 bg-gray-50 dark:bg-gray-900/50 border-gray-300 dark:border-gray-600 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all duration-300"
                    required
                  />
                </div>
              </div>

              {/* Password field */}
              <div
                className="space-y-2 animate-slide-down"
                style={{ animationDelay: "0.2s" }}
              >
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
                    onChange={(e) =>
                      setFormData({ ...formData, password: e.target.value })
                    }
                    className="pl-10 pr-10 h-12 bg-gray-50 dark:bg-gray-900/50 border-gray-300 dark:border-gray-600 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all duration-300"
                    required
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
              </div>

              {/* Confirm Password - only for register */}
              {!isLogin && (
                <div
                  className="space-y-2 animate-slide-down"
                  style={{ animationDelay: "0.3s" }}
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
                      className="pl-10 pr-10 h-12 bg-gray-50 dark:bg-gray-900/50 border-gray-300 dark:border-gray-600 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all duration-300"
                      required={!isLogin}
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
                </div>
              )}

              {/* Forgot Password - only for login */}
              {isLogin && (
                <div
                  className="flex justify-end animate-slide-down"
                  style={{ animationDelay: "0.3s" }}
                >
                  <Link
                    href="/recover"
                    className="text-sm text-blue-600 hover:text-purple-600 dark:text-blue-400 dark:hover:text-purple-400 transition-colors duration-300 hover:underline"
                  >
                    Forgot password?
                  </Link>
                </div>
              )}

              {/* Submit Button */}
              <Button
                type="submit"
                disabled={isLoading}
                className="w-full h-12 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed animate-slide-down"
                style={{ animationDelay: "0.4s" }}
              >
                {isLoading ? (
                  <div className="flex items-center gap-2">
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>
                      {isLogin ? "Signing in..." : "Creating account..."}
                    </span>
                  </div>
                ) : (
                  <span>{isLogin ? "Sign in" : "Create Account"}</span>
                )}
              </Button>

              {/* Divider */}
              <div
                className="relative my-6 animate-slide-down"
                style={{ animationDelay: "0.5s" }}
              >
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-300 dark:border-gray-600"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-4 bg-white dark:bg-gray-800 text-gray-500">
                    or
                  </span>
                </div>
              </div>

              {/* Google Sign In */}
              <Button
                type="button"
                onClick={handleGoogleSignIn}
                disabled={isLoading}
                variant="outline"
                className="w-full h-12 border-2 border-gray-300 dark:border-gray-600 hover:border-blue-500 dark:hover:border-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-all duration-300 transform hover:scale-[1.02] animate-slide-down"
                style={{ animationDelay: "0.6s" }}
              >
                <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                  <path
                    fill="currentColor"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    className="text-blue-500"
                  />
                  <path
                    fill="currentColor"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    className="text-green-500"
                  />
                  <path
                    fill="currentColor"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                    className="text-yellow-500"
                  />
                  <path
                    fill="currentColor"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                    className="text-red-500"
                  />
                </svg>
                Sign in with Google
              </Button>

              {/* Toggle Login/Register */}
              <div
                className="text-center pt-4 animate-slide-down"
                style={{ animationDelay: "0.7s" }}
              >
                <p className="text-gray-600 dark:text-gray-400">
                  {isLogin ? "Are you new? " : "Already have an account? "}
                  <button
                    type="button"
                    onClick={() => {
                      setIsLogin(!isLogin);
                      setFormData({
                        name: "",
                        email: "",
                        password: "",
                        confirmPassword: "",
                      });
                    }}
                    className="text-blue-600 hover:text-purple-600 dark:text-blue-400 dark:hover:text-purple-400 font-semibold transition-colors duration-300 hover:underline"
                  >
                    {isLogin ? "Create an Account" : "Sign in"}
                  </button>
                </p>
              </div>
            </form>

            {/* OTP Verification Section */}
            {showOTPVerification && (
              <div className="mt-8 p-6 bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-950/30 dark:to-purple-950/30 rounded-2xl border-2 border-blue-200 dark:border-blue-800 animate-slide-down">
                <div className="text-center space-y-4">
                  {/* Icon */}
                  <div className="flex justify-center">
                    <div className="relative">
                      <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full blur-xl opacity-50 animate-pulse"></div>
                      <div className="relative bg-white dark:bg-gray-800 rounded-full p-4 shadow-xl">
                        <ShieldCheck
                          className="w-12 h-12 text-transparent bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text"
                          style={{ fill: "url(#gradient)" }}
                        />
                        <svg width="0" height="0">
                          <defs>
                            <linearGradient
                              id="gradient"
                              x1="0%"
                              y1="0%"
                              x2="100%"
                              y2="100%"
                            >
                              <stop offset="0%" stopColor="#3B82F6" />
                              <stop offset="100%" stopColor="#9333EA" />
                            </linearGradient>
                          </defs>
                        </svg>
                      </div>
                    </div>
                  </div>

                  {/* Title */}
                  <div>
                    <h3 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
                      Verify Your Email
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      We've sent a 6-digit verification code to
                    </p>
                    <p className="text-sm font-semibold text-blue-600 dark:text-blue-400 mt-1">
                      {unverifiedEmail}
                    </p>
                  </div>

                  {/* OTP Input */}
                  <div className="space-y-2">
                    <Label
                      htmlFor="otp-input"
                      className="text-gray-700 dark:text-gray-300 font-medium"
                    >
                      Verification Code
                    </Label>
                    <div className="relative">
                      <Input
                        id="otp-input"
                        type="text"
                        inputMode="numeric"
                        maxLength={6}
                        placeholder="000000"
                        value={otp}
                        onChange={(e) => {
                          const value = e.target.value.replace(/\D/g, "");
                          setOtp(value.slice(0, 6));
                        }}
                        className="h-14 text-center text-2xl font-bold tracking-widest bg-white dark:bg-gray-900 border-2 border-blue-300 dark:border-blue-700 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/20 transition-all duration-300"
                      />
                    </div>
                  </div>

                  {/* Verify Button */}
                  <Button
                    type="button"
                    onClick={handleVerifyOTP}
                    disabled={otp.length !== 6 || isLoading}
                    className="w-full h-12 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isLoading ? (
                      <div className="flex items-center gap-2">
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        <span>Verifying...</span>
                      </div>
                    ) : (
                      "Verify Email"
                    )}
                  </Button>

                  {/* Resend Button */}
                  <div className="flex items-center justify-center gap-2 text-sm">
                    <span className="text-gray-600 dark:text-gray-400">
                      Didn't receive the code?
                    </span>
                    <button
                      type="button"
                      onClick={handleResendOTP}
                      disabled={resendTimer > 0 || isLoading}
                      className="font-semibold text-blue-600 hover:text-purple-600 dark:text-blue-400 dark:hover:text-purple-400 disabled:opacity-50 disabled:cursor-not-allowed underline transition-colors duration-300"
                    >
                      {resendTimer > 0 ? (
                        <span className="flex items-center gap-1">
                          <Clock className="w-4 h-4" />
                          Resend in {resendTimer}s
                        </span>
                      ) : (
                        "Resend Code"
                      )}
                    </button>
                  </div>

                  {/* Back to Login */}
                  <Button
                    type="button"
                    variant="ghost"
                    onClick={() => {
                      setShowOTPVerification(false);
                      setOtp("");
                      setUnverifiedEmail("");
                      setResendTimer(0);
                    }}
                    className="w-full text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100"
                  >
                    Back to Login
                  </Button>
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
