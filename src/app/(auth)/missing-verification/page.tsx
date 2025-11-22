"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useTheme } from "@/hooks/use-theme";
import {
  ShieldCheck,
  Clock,
  UserX,
  Mail,
  AlertCircle,
  CheckCircle,
  ArrowLeft,
  Loader2,
  Moon,
  Sun,
} from "lucide-react";
import Link from "next/link";

export default function MissingVerificationPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { toast } = useToast();
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === "dark";

  const emailFromParams = searchParams.get("email") || "";
  const autoSend = searchParams.get("autoSend") === "true";
  const [email, setEmail] = useState(emailFromParams);
  const [otp, setOtp] = useState("");
  const [accountStatus, setAccountStatus] = useState<
    "checking" | "not-found" | "unverified" | "verified" | "otp-sent"
  >("checking");
  const [isLoading, setIsLoading] = useState(false);
  const [resendTimer, setResendTimer] = useState(0);
  const [showOTPInput, setShowOTPInput] = useState(false);

  const themeColors = {
    primary: "#0E52AC",
    text1: isDark ? "#FFFFFF" : "#111E2F",
    text2: isDark ? "#CBD5E1" : "#284366",
    bg1: isDark ? "#0F172A" : "#E0EDFD",
    bg2: isDark ? "#1E293B" : "#FFFFFF",
  };

  useEffect(() => {
    if (resendTimer > 0) {
      const timer = setTimeout(() => setResendTimer(resendTimer - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [resendTimer]);

  useEffect(() => {
    if (emailFromParams) {
      checkAccountStatus(emailFromParams);
    } else {
      setAccountStatus("checking");
    }
  }, [emailFromParams]);

  useEffect(() => {
    if (autoSend && accountStatus === "unverified" && email && !showOTPInput) {
      setTimeout(() => {
        handleSendOTP();
      }, 500);
    }
  }, [autoSend, accountStatus, email]);

  const checkAccountStatus = async (emailToCheck: string) => {
    if (!emailToCheck) return;

    setIsLoading(true);
    try {
      const { data } = await axios.post("/api/auth/check-account-status", {
        email: emailToCheck,
      });

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
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description:
          error.response?.data?.error || "Failed to check account status",
      });
      setAccountStatus("not-found");
    } finally {
      setIsLoading(false);
    }
  };

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

  const handleSendOTP = async () => {
    setIsLoading(true);
    try {
      const { data } = await axios.post("/api/auth/resend-otp", {
        email,
      });

      toast({
        title: "Verification Code Sent",
        description: "Check your email for the 6-digit code",
      });
      setShowOTPInput(true);
      setAccountStatus("otp-sent");
      setResendTimer(60);
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description:
          error.response?.data?.error || "Failed to send verification code",
      });
    } finally {
      setIsLoading(false);
    }
  };

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
      const { data } = await axios.post("/api/auth/verify-otp", {
        email,
        otp,
      });

      toast({
        title: "Email Verified Successfully!",
        description: "Redirecting to login...",
      });
      setTimeout(() => router.push("/login"), 2000);
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Verification Failed",
        description:
          error.response?.data?.error || "Invalid or expired verification code",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendOTP = async () => {
    if (resendTimer > 0) return;
    await handleSendOTP();
  };

  return (
    <div
      className="min-h-screen"
      style={{ backgroundColor: isDark ? "#0A0F1E" : "#F8FBFF" }}
    >
      <div className="container mx-auto px-4 py-8">
        {/* Theme Toggle Button */}
        <div className="fixed top-6 right-6 z-50">
          <button
            onClick={toggleTheme}
            className="p-3 rounded-full shadow-lg transition-all hover:scale-110"
            style={{
              backgroundColor: themeColors.bg2,
              color: themeColors.text1,
            }}
          >
            {isDark ? (
              <Sun className="w-5 h-5" />
            ) : (
              <Moon className="w-5 h-5" />
            )}
          </button>
        </div>

        <div className="min-h-screen flex items-center justify-center">
          <div className="w-full max-w-md">
            <div
              className="rounded-2xl border p-8 shadow-xl"
              style={{
                backgroundColor: themeColors.bg2,
                borderColor: isDark ? "#334155" : "#E0EDFD",
              }}
            >
              {/* Logo */}
              <div className="mb-8 text-center">
                <h1
                  className="text-2xl font-bold mb-2"
                  style={{ color: themeColors.text1 }}
                >
                  Assignment Ghar
                </h1>
                <div
                  className="h-1 rounded-full w-16 mx-auto"
                  style={{ backgroundColor: themeColors.primary }}
                ></div>
              </div>

              {/* Email Check Form */}
              {accountStatus === "checking" && !emailFromParams && (
                <div className="space-y-6">
                  <div className="text-center space-y-3">
                    <div
                      className="inline-flex items-center justify-center w-16 h-16 rounded-full mb-2"
                      style={{
                        backgroundColor: isDark ? "#1E3A8A" : "#DBEAFE",
                      }}
                    >
                      <ShieldCheck
                        className="w-8 h-8"
                        style={{ color: themeColors.primary }}
                      />
                    </div>
                    <h2
                      className="text-2xl font-bold"
                      style={{ color: themeColors.text1 }}
                    >
                      Account Verification
                    </h2>
                    <p style={{ color: themeColors.text2 }}>
                      Check your account verification status
                    </p>
                  </div>

                  <form onSubmit={handleCheckAccount} className="space-y-5">
                    <div className="space-y-2">
                      <label
                        htmlFor="email-check"
                        className="text-sm font-medium block"
                        style={{ color: themeColors.text1 }}
                      >
                        Email Address
                      </label>
                      <div className="relative">
                        <Mail
                          className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5"
                          style={{ color: themeColors.text2 }}
                        />
                        <input
                          id="email-check"
                          type="email"
                          placeholder="Enter your email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          className="w-full pl-10 pr-4 h-11 rounded-lg border outline-none transition-all"
                          style={{
                            backgroundColor: isDark ? "#1E293B" : "#F8FBFF",
                            borderColor: isDark ? "#475569" : "#CBD5E1",
                            color: themeColors.text1,
                          }}
                          onFocus={(e) =>
                            (e.target.style.borderColor = themeColors.primary)
                          }
                          onBlur={(e) =>
                            (e.target.style.borderColor = isDark
                              ? "#475569"
                              : "#CBD5E1")
                          }
                          required
                        />
                      </div>
                    </div>

                    <button
                      type="submit"
                      disabled={isLoading || !email}
                      className="w-full h-11 text-white font-semibold rounded-lg transition-all hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed"
                      style={{ backgroundColor: themeColors.primary }}
                    >
                      {isLoading ? (
                        <div className="flex items-center justify-center gap-2">
                          <Loader2 className="w-4 h-4 animate-spin" />
                          Checking...
                        </div>
                      ) : (
                        "Check Account Status"
                      )}
                    </button>
                  </form>

                  <div className="text-center">
                    <Link
                      href="/login"
                      className="text-sm font-medium inline-flex items-center gap-1 hover:opacity-80 transition-opacity"
                      style={{ color: themeColors.primary }}
                    >
                      <ArrowLeft className="h-4 w-4" />
                      Back to Login
                    </Link>
                  </div>
                </div>
              )}

              {/* Loading State */}
              {isLoading && accountStatus === "checking" && emailFromParams && (
                <div className="space-y-6 text-center">
                  <div className="flex justify-center">
                    <Loader2
                      className="w-12 h-12 animate-spin"
                      style={{ color: themeColors.primary }}
                    />
                  </div>
                  <p style={{ color: themeColors.text2 }}>
                    Checking account status...
                  </p>
                </div>
              )}

              {/* Account Not Found */}
              {accountStatus === "not-found" && (
                <div className="space-y-6">
                  <div className="text-center space-y-4">
                    <div
                      className="inline-flex items-center justify-center w-16 h-16 rounded-full"
                      style={{
                        backgroundColor: isDark ? "#7F1D1D" : "#FEE2E2",
                      }}
                    >
                      <UserX className="w-8 h-8 text-red-600" />
                    </div>
                    <h2
                      className="text-2xl font-bold"
                      style={{ color: themeColors.text1 }}
                    >
                      Account Not Found
                    </h2>
                    <p style={{ color: themeColors.text2 }}>
                      No account exists with email:
                      <br />
                      <span
                        className="font-semibold"
                        style={{ color: themeColors.text1 }}
                      >
                        {email}
                      </span>
                    </p>
                  </div>

                  <div
                    className="p-4 rounded-lg border"
                    style={{
                      backgroundColor: isDark ? "#1E3A8A" : "#DBEAFE",
                      borderColor: isDark ? "#1E40AF" : "#93C5FD",
                    }}
                  >
                    <p
                      className="font-medium mb-4 text-center"
                      style={{ color: themeColors.text1 }}
                    >
                      Would you like to create an account?
                    </p>
                    <div className="flex gap-3">
                      <button
                        onClick={() => router.push("/register")}
                        className="flex-1 h-11 text-white font-semibold rounded-lg hover:opacity-90 transition-opacity"
                        style={{ backgroundColor: themeColors.primary }}
                      >
                        Create Account
                      </button>
                      <button
                        onClick={() => router.push("/login")}
                        className="flex-1 h-11 font-semibold rounded-lg border hover:opacity-80 transition-opacity"
                        style={{
                          backgroundColor: themeColors.bg2,
                          borderColor: isDark ? "#475569" : "#CBD5E1",
                          color: themeColors.text1,
                        }}
                      >
                        Go to Login
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* Account Unverified */}
              {accountStatus === "unverified" && !showOTPInput && (
                <div className="space-y-6">
                  <div className="text-center space-y-4">
                    <div
                      className="inline-flex items-center justify-center w-16 h-16 rounded-full"
                      style={{
                        backgroundColor: isDark ? "#854D0E" : "#FEF3C7",
                      }}
                    >
                      <AlertCircle className="w-8 h-8 text-yellow-600" />
                    </div>
                    <h2
                      className="text-2xl font-bold"
                      style={{ color: themeColors.text1 }}
                    >
                      Email Not Verified
                    </h2>
                    <p style={{ color: themeColors.text2 }}>
                      Your account exists but email is not verified yet
                    </p>
                  </div>

                  <div
                    className="p-4 rounded-lg border"
                    style={{
                      backgroundColor: isDark ? "#854D0E" : "#FEF3C7",
                      borderColor: isDark ? "#A16207" : "#FDE047",
                    }}
                  >
                    <p
                      className="font-medium text-center mb-2"
                      style={{ color: themeColors.text1 }}
                    >
                      Email:{" "}
                      <span style={{ color: themeColors.primary }}>
                        {email}
                      </span>
                    </p>
                    <p
                      className="text-sm text-center mb-4"
                      style={{ color: themeColors.text2 }}
                    >
                      We'll send a verification code to complete your
                      registration
                    </p>
                    <button
                      onClick={handleSendOTP}
                      disabled={isLoading}
                      className="w-full h-11 text-white font-semibold rounded-lg hover:opacity-90 disabled:opacity-50 transition-opacity"
                      style={{ backgroundColor: themeColors.primary }}
                    >
                      {isLoading ? (
                        <div className="flex items-center justify-center gap-2">
                          <Loader2 className="w-4 h-4 animate-spin" />
                          Sending Code...
                        </div>
                      ) : (
                        "Send Verification Code"
                      )}
                    </button>
                  </div>

                  <div className="text-center">
                    <Link
                      href="/login"
                      className="text-sm font-medium inline-flex items-center gap-1 hover:opacity-80 transition-opacity"
                      style={{ color: themeColors.primary }}
                    >
                      <ArrowLeft className="h-4 w-4" />
                      Back to Login
                    </Link>
                  </div>
                </div>
              )}

              {/* OTP Verification */}
              {(accountStatus === "otp-sent" || showOTPInput) && (
                <div className="space-y-6">
                  <div className="text-center space-y-3">
                    <div
                      className="inline-flex items-center justify-center w-16 h-16 rounded-full"
                      style={{
                        backgroundColor: isDark ? "#1E3A8A" : "#DBEAFE",
                      }}
                    >
                      <Mail
                        className="w-8 h-8"
                        style={{ color: themeColors.primary }}
                      />
                    </div>
                    <h2
                      className="text-2xl font-bold"
                      style={{ color: themeColors.text1 }}
                    >
                      Verify Your Email
                    </h2>
                    <p style={{ color: themeColors.text2 }}>
                      We've sent a 6-digit code to
                    </p>
                    <p
                      className="font-semibold"
                      style={{ color: themeColors.text1 }}
                    >
                      {email}
                    </p>
                  </div>

                  <div className="space-y-4">
                    <div className="space-y-2">
                      <label
                        htmlFor="otp-input"
                        className="text-sm font-medium block"
                        style={{ color: themeColors.text1 }}
                      >
                        Verification Code
                      </label>
                      <input
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
                        className="w-full h-14 text-center text-2xl font-bold tracking-widest rounded-lg border outline-none transition-all"
                        style={{
                          backgroundColor: isDark ? "#1E293B" : "#F8FBFF",
                          borderColor: isDark ? "#475569" : "#CBD5E1",
                          color: themeColors.text1,
                        }}
                        onFocus={(e) =>
                          (e.target.style.borderColor = themeColors.primary)
                        }
                        onBlur={(e) =>
                          (e.target.style.borderColor = isDark
                            ? "#475569"
                            : "#CBD5E1")
                        }
                      />
                      <p
                        className="text-xs text-center"
                        style={{ color: themeColors.text2 }}
                      >
                        Code expires in 10 minutes
                      </p>
                    </div>

                    <button
                      onClick={handleVerifyOTP}
                      disabled={otp.length !== 6 || isLoading}
                      className="w-full h-11 text-white font-semibold rounded-lg hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition-opacity"
                      style={{ backgroundColor: themeColors.primary }}
                    >
                      {isLoading ? (
                        <div className="flex items-center justify-center gap-2">
                          <Loader2 className="w-4 h-4 animate-spin" />
                          Verifying...
                        </div>
                      ) : (
                        "Verify Email"
                      )}
                    </button>

                    <div className="text-center space-y-2">
                      <p
                        className="text-sm"
                        style={{ color: themeColors.text2 }}
                      >
                        Didn't receive the code?
                      </p>
                      <button
                        type="button"
                        onClick={handleResendOTP}
                        disabled={resendTimer > 0 || isLoading}
                        className="font-medium disabled:opacity-50 hover:opacity-80 transition-opacity"
                        style={{ color: themeColors.primary }}
                      >
                        {resendTimer > 0 ? (
                          <span className="flex items-center justify-center gap-1">
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
                    <button
                      onClick={() => {
                        setShowOTPInput(false);
                        setOtp("");
                        setAccountStatus("unverified");
                      }}
                      className="text-sm hover:opacity-80 transition-opacity inline-flex items-center gap-1"
                      style={{ color: themeColors.text2 }}
                    >
                      <ArrowLeft className="h-4 w-4" />
                      Back
                    </button>
                  </div>
                </div>
              )}

              {/* Account Already Verified */}
              {accountStatus === "verified" && (
                <div className="space-y-6 text-center">
                  <div
                    className="inline-flex items-center justify-center w-16 h-16 rounded-full"
                    style={{
                      backgroundColor: isDark ? "#065F46" : "#D1FAE5",
                    }}
                  >
                    <CheckCircle className="w-8 h-8 text-green-600" />
                  </div>
                  <h2
                    className="text-2xl font-bold"
                    style={{ color: themeColors.text1 }}
                  >
                    Account Already Verified!
                  </h2>
                  <p style={{ color: themeColors.text2 }}>
                    Redirecting you to login...
                  </p>
                  <div className="flex justify-center">
                    <Loader2
                      className="w-6 h-6 animate-spin"
                      style={{ color: themeColors.primary }}
                    />
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
