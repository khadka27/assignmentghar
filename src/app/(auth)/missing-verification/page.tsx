"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import {
  ShieldCheck,
  Clock,
  UserX,
  Mail,
  AlertCircle,
  CheckCircle,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export default function MissingVerificationPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { toast } = useToast();

  // Get email from URL params if provided
  const emailFromParams = searchParams.get("email") || "";
  const autoSend = searchParams.get("autoSend") === "true";

  // State management
  const [email, setEmail] = useState(emailFromParams);
  const [otp, setOtp] = useState("");
  const [accountStatus, setAccountStatus] = useState<
    "checking" | "not-found" | "unverified" | "verified" | "otp-sent"
  >("checking");
  const [isLoading, setIsLoading] = useState(false);
  const [resendTimer, setResendTimer] = useState(0);
  const [showOTPInput, setShowOTPInput] = useState(false);

  // Timer countdown effect
  useEffect(() => {
    if (resendTimer > 0) {
      const timer = setTimeout(() => setResendTimer(resendTimer - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [resendTimer]);

  // Check account status on mount if email is provided
  useEffect(() => {
    if (emailFromParams) {
      checkAccountStatus(emailFromParams);
    } else {
      setAccountStatus("checking");
    }
  }, [emailFromParams]);

  // Auto-send OTP if autoSend parameter is present and account is unverified
  useEffect(() => {
    if (autoSend && accountStatus === "unverified" && email && !showOTPInput) {
      // Delay to ensure UI is ready
      setTimeout(() => {
        handleSendOTP();
      }, 500);
    }
  }, [autoSend, accountStatus, email]);

  // Check if account exists and verification status
  const checkAccountStatus = async (emailToCheck: string) => {
    if (!emailToCheck) return;

    setIsLoading(true);
    try {
      const response = await fetch("/api/auth/check-account-status", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: emailToCheck }),
      });

      const data = await response.json();

      if (response.ok) {
        if (data.exists) {
          if (data.isVerified) {
            setAccountStatus("verified");
            toast({
              title: "Account Already Verified",
              description: "Redirecting to login...",
            });
            setTimeout(() => router.push("/login"), 2000);
          } else {
            setAccountStatus("unverified");
          }
        } else {
          setAccountStatus("not-found");
        }
      } else {
        throw new Error(data.error || "Failed to check account status");
      }
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "Failed to check account status",
      });
      setAccountStatus("not-found");
    } finally {
      setIsLoading(false);
    }
  };

  // Handle check button click
  const handleCheckAccount = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      toast({
        variant: "destructive",
        title: "Email Required",
        description: "Please enter your email address",
      });
      return;
    }
    await checkAccountStatus(email);
  };

  // Send OTP to unverified account
  const handleSendOTP = async () => {
    setIsLoading(true);
    try {
      const response = await fetch("/api/auth/resend-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (response.ok) {
        toast({
          title: "Verification Code Sent",
          description: "Check your email for the 6-digit code",
        });
        setShowOTPInput(true);
        setAccountStatus("otp-sent");
        setResendTimer(60);
      } else {
        throw new Error(data.error || "Failed to send verification code");
      }
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "Failed to send verification code",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Verify OTP
  const handleVerifyOTP = async () => {
    if (otp.length !== 6) {
      toast({
        variant: "destructive",
        title: "Invalid Code",
        description: "Please enter a 6-digit verification code",
      });
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch("/api/auth/verify-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, otp }),
      });

      const data = await response.json();

      if (response.ok) {
        toast({
          title: "Email Verified Successfully!",
          description: "Redirecting to login...",
        });
        setTimeout(() => router.push("/login"), 2000);
      } else {
        throw new Error(data.error || "Failed to verify code");
      }
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Verification Failed",
        description: error.message || "Invalid or expired verification code",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Resend OTP
  const handleResendOTP = async () => {
    if (resendTimer > 0) return;
    await handleSendOTP();
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 dark:from-gray-900 dark:via-blue-950 dark:to-purple-950 p-4">
      <div className="w-full max-w-2xl">
        <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-gray-200/50 dark:border-gray-700/50 p-8 md:p-12 transition-all duration-500">
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

          {/* Main Content - Email Check Form */}
          {accountStatus === "checking" && !emailFromParams && (
            <div className="space-y-6 animate-slide-down">
              <div className="text-center space-y-3">
                <div className="flex justify-center">
                  <div className="relative">
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full blur-xl opacity-50 animate-pulse"></div>
                    <div className="relative bg-white dark:bg-gray-800 rounded-full p-4 shadow-xl">
                      <ShieldCheck className="w-16 h-16 text-blue-600 dark:text-blue-400" />
                    </div>
                  </div>
                </div>
                <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  Account Verification
                </h1>
                <p className="text-gray-600 dark:text-gray-400 text-lg">
                  Let's check your account verification status
                </p>
              </div>

              <form onSubmit={handleCheckAccount} className="space-y-6">
                <div className="space-y-2">
                  <Label
                    htmlFor="email-check"
                    className="text-gray-700 dark:text-gray-300 font-medium"
                  >
                    Email Address
                  </Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <Input
                      id="email-check"
                      type="email"
                      placeholder="john@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="pl-10 h-12 bg-gray-50 dark:bg-gray-900/50 border-gray-300 dark:border-gray-600 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all duration-300"
                      required
                    />
                  </div>
                </div>

                <Button
                  type="submit"
                  disabled={isLoading || !email}
                  className="w-full h-12 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? (
                    <div className="flex items-center gap-2">
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      <span>Checking...</span>
                    </div>
                  ) : (
                    "Check Account Status"
                  )}
                </Button>
              </form>

              <div className="text-center">
                <Link
                  href="/login"
                  className="text-sm text-blue-600 hover:text-purple-600 dark:text-blue-400 dark:hover:text-purple-400 transition-colors duration-300 hover:underline"
                >
                  Back to Login
                </Link>
              </div>
            </div>
          )}

          {/* Loading State */}
          {isLoading && accountStatus === "checking" && emailFromParams && (
            <div className="space-y-6 text-center animate-pulse">
              <div className="flex justify-center">
                <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
              </div>
              <p className="text-gray-600 dark:text-gray-400">
                Checking account status...
              </p>
            </div>
          )}

          {/* Account Not Found */}
          {accountStatus === "not-found" && (
            <div className="space-y-6 animate-slide-down">
              <div className="text-center space-y-4">
                <div className="flex justify-center">
                  <div className="relative">
                    <div className="absolute inset-0 bg-gradient-to-r from-red-500 to-orange-500 rounded-full blur-xl opacity-50 animate-pulse"></div>
                    <div className="relative bg-white dark:bg-gray-800 rounded-full p-4 shadow-xl">
                      <UserX className="w-16 h-16 text-red-600 dark:text-red-400" />
                    </div>
                  </div>
                </div>
                <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-gray-100">
                  Account Not Found
                </h2>
                <p className="text-gray-600 dark:text-gray-400">
                  No account exists with email:{" "}
                  <span className="font-semibold text-gray-900 dark:text-gray-100">
                    {email}
                  </span>
                </p>
                <div className="bg-blue-50 dark:bg-blue-950/30 border-2 border-blue-200 dark:border-blue-800 rounded-xl p-4">
                  <p className="text-gray-700 dark:text-gray-300 font-medium mb-4">
                    Would you like to create an account?
                  </p>
                  <div className="flex gap-4 justify-center">
                    <Button
                      onClick={() => router.push("/register")}
                      className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02]"
                    >
                      Yes, Create Account
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => router.push("/login")}
                      className="border-2 border-gray-300 dark:border-gray-600 hover:border-blue-500 dark:hover:border-blue-500 transition-all duration-300"
                    >
                      No, Go to Login
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Account Unverified - Show Send OTP Option */}
          {accountStatus === "unverified" && !showOTPInput && (
            <div className="space-y-6 animate-slide-down">
              <div className="text-center space-y-4">
                <div className="flex justify-center">
                  <div className="relative">
                    <div className="absolute inset-0 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-full blur-xl opacity-50 animate-pulse"></div>
                    <div className="relative bg-white dark:bg-gray-800 rounded-full p-4 shadow-xl">
                      <AlertCircle className="w-16 h-16 text-yellow-600 dark:text-yellow-400" />
                    </div>
                  </div>
                </div>
                <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-gray-100">
                  Email Not Verified
                </h2>
                <p className="text-gray-600 dark:text-gray-400">
                  Your account exists but your email is not verified yet.
                </p>
                <div className="bg-yellow-50 dark:bg-yellow-950/30 border-2 border-yellow-200 dark:border-yellow-800 rounded-xl p-6 space-y-4">
                  <p className="text-gray-700 dark:text-gray-300 font-medium">
                    Email:{" "}
                    <span className="text-blue-600 dark:text-blue-400">
                      {email}
                    </span>
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    We'll send a verification code to complete your registration
                  </p>
                  <Button
                    onClick={handleSendOTP}
                    disabled={isLoading}
                    className="w-full h-12 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02] disabled:opacity-50"
                  >
                    {isLoading ? (
                      <div className="flex items-center gap-2">
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        <span>Sending Code...</span>
                      </div>
                    ) : (
                      "Send Verification Code"
                    )}
                  </Button>
                </div>
              </div>

              <div className="text-center">
                <Link
                  href="/login"
                  className="text-sm text-blue-600 hover:text-purple-600 dark:text-blue-400 dark:hover:text-purple-400 transition-colors duration-300 hover:underline"
                >
                  Back to Login
                </Link>
              </div>
            </div>
          )}

          {/* OTP Verification Section */}
          {(accountStatus === "otp-sent" || showOTPInput) && (
            <div className="space-y-6 animate-slide-down">
              <div className="text-center space-y-4">
                <div className="flex justify-center">
                  <div className="relative">
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full blur-xl opacity-50 animate-pulse"></div>
                    <div className="relative bg-white dark:bg-gray-800 rounded-full p-4 shadow-xl">
                      <Mail className="w-16 h-16 text-blue-600 dark:text-blue-400" />
                    </div>
                  </div>
                </div>
                <h2 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  Verify Your Email
                </h2>
                <p className="text-gray-600 dark:text-gray-400">
                  We've sent a 6-digit code to
                </p>
                <p className="text-lg font-semibold text-blue-600 dark:text-blue-400">
                  {email}
                </p>
              </div>

              <div className="space-y-4">
                <div className="space-y-2">
                  <Label
                    htmlFor="otp-input"
                    className="text-gray-700 dark:text-gray-300 font-medium"
                  >
                    Verification Code
                  </Label>
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

                <Button
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
              </div>

              <div className="text-center">
                <Button
                  variant="ghost"
                  onClick={() => {
                    setShowOTPInput(false);
                    setOtp("");
                    setAccountStatus("unverified");
                  }}
                  className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100"
                >
                  Back
                </Button>
              </div>
            </div>
          )}

          {/* Account Already Verified */}
          {accountStatus === "verified" && (
            <div className="space-y-6 text-center animate-slide-down">
              <div className="flex justify-center">
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full blur-xl opacity-50 animate-pulse"></div>
                  <div className="relative bg-white dark:bg-gray-800 rounded-full p-4 shadow-xl">
                    <CheckCircle className="w-16 h-16 text-green-600 dark:text-green-400" />
                  </div>
                </div>
              </div>
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-gray-100">
                Account Already Verified!
              </h2>
              <p className="text-gray-600 dark:text-gray-400">
                Redirecting you to login...
              </p>
            </div>
          )}
        </div>
      </div>

      <style jsx global>{`
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

        .animate-fade-in {
          animation: fade-in 1s ease-out;
        }

        .animate-slide-down {
          animation: slide-down 0.6s ease-out forwards;
        }
      `}</style>
    </div>
  );
}
