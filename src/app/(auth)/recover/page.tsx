"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { useToast } from "@/hooks/use-toast";
import {
  Mail,
  Lock,
  ShieldCheck,
  Clock,
  KeyRound,
  Eye,
  EyeOff,
  ArrowLeft,
  Check,
  AlertCircle,
  Moon,
  Sun,
} from "lucide-react";
import Link from "next/link";

export default function RecoverPage() {
  const router = useRouter();
  const { toast } = useToast();

  const [isDark, setIsDark] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [step, setStep] = useState<"email" | "verify" | "reset">("email");
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [resendTimer, setResendTimer] = useState(0);

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

  const handleSendOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const { data } = await axios.post("/api/auth/forgot-password", {
        email,
      });

      toast({
        title: "Reset Code Sent!",
        description: "Please check your email for the password reset code.",
      });
      setStep("verify");
      setResendTimer(60);
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.response?.data?.error || "Failed to send reset code",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    if (otp.length === 6) {
      setStep("reset");
    } else {
      toast({
        variant: "destructive",
        title: "Invalid Code",
        description: "Please enter a valid 6-digit code",
      });
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();

    if (newPassword !== confirmPassword) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Passwords do not match",
      });
      return;
    }

    if (newPassword.length < 6) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Password must be at least 6 characters long",
      });
      return;
    }

    setIsLoading(true);

    try {
      const { data } = await axios.post("/api/auth/reset-password", {
        email,
        otp,
        newPassword,
      });

      toast({
        title: "Password Reset Successfully!",
        description: "You can now login with your new password.",
      });
      setTimeout(() => router.push("/login"), 1500);
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.response?.data?.error || "Failed to reset password",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendOTP = async () => {
    if (resendTimer > 0) return;

    setIsLoading(true);
    try {
      const { data } = await axios.post("/api/auth/forgot-password", {
        email,
      });

      toast({
        title: "Code Resent!",
        description: "Please check your email for the new reset code.",
      });
      setResendTimer(60);
      setOtp("");
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.response?.data?.error || "Failed to resend code",
      });
    } finally {
      setIsLoading(false);
    }
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
            onClick={() => setIsDark(!isDark)}
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
              className="rounded-2xl border p-6 md:p-8 shadow-xl"
              style={{
                backgroundColor: themeColors.bg2,
                borderColor: isDark ? "#334155" : "#E0EDFD",
              }}
            >
              {/* Logo */}
              <div className="mb-6 md:mb-8 text-center">
                <h1
                  className="text-xl md:text-2xl font-bold mb-2"
                  style={{ color: themeColors.text1 }}
                >
                  Assignment Ghar
                </h1>
                <div
                  className="h-1 rounded-full w-16 mx-auto"
                  style={{ backgroundColor: themeColors.primary }}
                ></div>
              </div>

              {/* Header */}
              <div className="mb-6 md:mb-8">
                <h2
                  className="text-xl md:text-2xl font-bold mb-2"
                  style={{ color: themeColors.text1 }}
                >
                  {step === "email" && "Recover Password"}
                  {step === "verify" && "Verify Code"}
                  {step === "reset" && "Reset Password"}
                </h2>
                <p
                  className="text-sm md:text-base"
                  style={{ color: themeColors.text2 }}
                >
                  {step === "email" &&
                    "Enter your email to receive a reset code"}
                  {step === "verify" && "Enter the code sent to your email"}
                  {step === "reset" && "Create a new password for your account"}
                </p>
              </div>

              {/* Step Indicator */}
              <div className="mb-6">
                <div className="flex items-center justify-between mb-2">
                  <span
                    className="text-xs md:text-sm font-medium"
                    style={{ color: themeColors.text1 }}
                  >
                    Step{" "}
                    {step === "email" ? "1" : step === "verify" ? "2" : "3"} of
                    3
                  </span>
                </div>
                <div className="flex gap-2">
                  <div
                    className="h-1.5 flex-1 rounded-full transition-all"
                    style={{
                      backgroundColor:
                        step === "email" ||
                        step === "verify" ||
                        step === "reset"
                          ? themeColors.primary
                          : isDark
                          ? "#475569"
                          : "#CBD5E1",
                    }}
                  ></div>
                  <div
                    className="h-1.5 flex-1 rounded-full transition-all"
                    style={{
                      backgroundColor:
                        step === "verify" || step === "reset"
                          ? themeColors.primary
                          : isDark
                          ? "#475569"
                          : "#CBD5E1",
                    }}
                  ></div>
                  <div
                    className="h-1.5 flex-1 rounded-full transition-all"
                    style={{
                      backgroundColor:
                        step === "reset"
                          ? themeColors.primary
                          : isDark
                          ? "#475569"
                          : "#CBD5E1",
                    }}
                  ></div>
                </div>
              </div>

              {/* Email Step */}
              {step === "email" && (
                <form onSubmit={handleSendOTP} className="space-y-5">
                  <div className="space-y-2">
                    <label
                      htmlFor="email"
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
                        id="email"
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
                    disabled={isLoading}
                    className="w-full h-11 text-white font-semibold rounded-lg transition-all hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed"
                    style={{ backgroundColor: themeColors.primary }}
                  >
                    {isLoading ? (
                      <div className="flex items-center justify-center gap-2">
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                        Sending...
                      </div>
                    ) : (
                      "Send Reset Code"
                    )}
                  </button>

                  <div className="text-center pt-4">
                    <Link
                      href="/login"
                      className="text-sm font-medium inline-flex items-center gap-1 hover:opacity-80 transition-opacity"
                      style={{ color: themeColors.primary }}
                    >
                      <ArrowLeft className="h-4 w-4" />
                      Back to Login
                    </Link>
                  </div>
                </form>
              )}

              {/* Verify OTP Step */}
              {step === "verify" && (
                <form onSubmit={handleVerifyOTP} className="space-y-6">
                  <div className="text-center space-y-3 mb-6">
                    <div
                      className="inline-flex items-center justify-center w-16 h-16 rounded-full"
                      style={{
                        backgroundColor: isDark ? "#1E3A8A" : "#DBEAFE",
                      }}
                    >
                      <ShieldCheck
                        className="w-8 h-8"
                        style={{ color: themeColors.primary }}
                      />
                    </div>
                    <p className="text-sm" style={{ color: themeColors.text2 }}>
                      Reset code sent to
                      <br />
                      <span
                        className="font-semibold"
                        style={{ color: themeColors.text1 }}
                      >
                        {email}
                      </span>
                    </p>
                  </div>

                  <div className="space-y-2">
                    <label
                      htmlFor="otp"
                      className="text-sm font-medium block"
                      style={{ color: themeColors.text1 }}
                    >
                      Reset Code
                    </label>
                    <input
                      id="otp"
                      type="text"
                      placeholder="000000"
                      value={otp}
                      onChange={(e) =>
                        setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))
                      }
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
                      required
                      maxLength={6}
                    />
                    <p
                      className="text-xs text-center"
                      style={{ color: themeColors.text2 }}
                    >
                      Code expires in 10 minutes
                    </p>
                  </div>

                  <button
                    type="submit"
                    disabled={isLoading || otp.length !== 6}
                    className="w-full h-11 text-white font-semibold rounded-lg hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition-opacity"
                    style={{ backgroundColor: themeColors.primary }}
                  >
                    {isLoading ? (
                      <div className="flex items-center justify-center gap-2">
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                        Verifying...
                      </div>
                    ) : (
                      "Verify Code"
                    )}
                  </button>

                  <div className="text-center space-y-3">
                    <p className="text-sm" style={{ color: themeColors.text2 }}>
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
                        <div className="flex items-center justify-center gap-2">
                          <Clock className="w-4 h-4" />
                          Resend in {resendTimer}s
                        </div>
                      ) : (
                        "Resend Code"
                      )}
                    </button>
                  </div>

                  <div className="text-center pt-2">
                    <button
                      type="button"
                      onClick={() => {
                        setStep("email");
                        setOtp("");
                      }}
                      className="text-sm hover:opacity-80 transition-opacity inline-flex items-center gap-1"
                      style={{ color: themeColors.text2 }}
                    >
                      <ArrowLeft className="h-3 w-3" />
                      Change email address
                    </button>
                  </div>
                </form>
              )}

              {/* Reset Password Step */}
              {step === "reset" && (
                <form onSubmit={handleResetPassword} className="space-y-5">
                  <div className="text-center mb-6">
                    <div
                      className="inline-flex items-center justify-center w-16 h-16 rounded-full"
                      style={{
                        backgroundColor: isDark ? "#1E3A8A" : "#DBEAFE",
                      }}
                    >
                      <KeyRound
                        className="w-8 h-8"
                        style={{ color: themeColors.primary }}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label
                      htmlFor="newPassword"
                      className="text-sm font-medium block"
                      style={{ color: themeColors.text1 }}
                    >
                      New Password
                    </label>
                    <div className="relative">
                      <Lock
                        className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5"
                        style={{ color: themeColors.text2 }}
                      />
                      <input
                        id="newPassword"
                        type={showPassword ? "text" : "password"}
                        placeholder="Enter new password"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        className="w-full pl-10 pr-10 h-11 rounded-lg border outline-none transition-all"
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
                        minLength={6}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 transition-colors"
                        style={{ color: themeColors.text2 }}
                      >
                        {showPassword ? (
                          <EyeOff className="h-5 w-5" />
                        ) : (
                          <Eye className="h-5 w-5" />
                        )}
                      </button>
                    </div>
                    <p className="text-xs" style={{ color: themeColors.text2 }}>
                      Must be at least 6 characters long
                    </p>
                  </div>

                  <div className="space-y-2">
                    <label
                      htmlFor="confirmPassword"
                      className="text-sm font-medium block"
                      style={{ color: themeColors.text1 }}
                    >
                      Confirm New Password
                    </label>
                    <div className="relative">
                      <Lock
                        className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5"
                        style={{ color: themeColors.text2 }}
                      />
                      <input
                        id="confirmPassword"
                        type={showConfirmPassword ? "text" : "password"}
                        placeholder="Re-enter new password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        className="w-full pl-10 pr-10 h-11 rounded-lg border outline-none transition-all"
                        style={{
                          backgroundColor: isDark ? "#1E293B" : "#F8FBFF",
                          borderColor:
                            confirmPassword && newPassword !== confirmPassword
                              ? "#DC2626"
                              : confirmPassword &&
                                newPassword === confirmPassword
                              ? "#10B981"
                              : isDark
                              ? "#475569"
                              : "#CBD5E1",
                          color: themeColors.text1,
                        }}
                        onFocus={(e) =>
                          (e.target.style.borderColor =
                            confirmPassword && newPassword !== confirmPassword
                              ? "#DC2626"
                              : confirmPassword &&
                                newPassword === confirmPassword
                              ? "#10B981"
                              : themeColors.primary)
                        }
                        onBlur={(e) =>
                          (e.target.style.borderColor =
                            confirmPassword && newPassword !== confirmPassword
                              ? "#DC2626"
                              : confirmPassword &&
                                newPassword === confirmPassword
                              ? "#10B981"
                              : isDark
                              ? "#475569"
                              : "#CBD5E1")
                        }
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
                          <EyeOff className="h-5 w-5" />
                        ) : (
                          <Eye className="h-5 w-5" />
                        )}
                      </button>
                    </div>
                    {confirmPassword && newPassword !== confirmPassword && (
                      <p className="text-xs text-red-600 flex items-center gap-1">
                        <AlertCircle className="h-3 w-3" />
                        Passwords don't match
                      </p>
                    )}
                    {confirmPassword && newPassword === confirmPassword && (
                      <p className="text-xs text-green-600 flex items-center gap-1">
                        <Check className="h-3 w-3" />
                        Passwords match
                      </p>
                    )}
                  </div>

                  <button
                    type="submit"
                    disabled={
                      isLoading ||
                      newPassword !== confirmPassword ||
                      newPassword.length < 6
                    }
                    className="w-full h-11 text-white font-semibold rounded-lg hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition-opacity"
                    style={{ backgroundColor: themeColors.primary }}
                  >
                    {isLoading ? (
                      <div className="flex items-center justify-center gap-2">
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                        Resetting...
                      </div>
                    ) : (
                      "Reset Password"
                    )}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
