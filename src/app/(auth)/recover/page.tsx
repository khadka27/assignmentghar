"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
} from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

export default function RecoverPage() {
  const router = useRouter();
  const { toast } = useToast();

  const [isLoading, setIsLoading] = useState(false);
  const [step, setStep] = useState<"email" | "verify" | "reset">("email");
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [resendTimer, setResendTimer] = useState(0);

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
      const res = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();

      if (res.ok) {
        toast({
          title: "Reset Code Sent!",
          description: "Please check your email for the password reset code.",
        });
        setStep("verify");
        setResendTimer(60);
      } else {
        toast({
          variant: "destructive",
          title: "Error",
          description: data.error || "Failed to send reset code",
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
      const res = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          otp,
          newPassword,
        }),
      });

      const data = await res.json();

      if (res.ok) {
        toast({
          title: "Password Reset Successfully!",
          description: "You can now login with your new password.",
        });
        setTimeout(() => router.push("/login"), 1500);
      } else {
        toast({
          variant: "destructive",
          title: "Error",
          description: data.error || "Failed to reset password",
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
      const res = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();

      if (res.ok) {
        toast({
          title: "Code Resent!",
          description: "Please check your email for the new reset code.",
        });
        setResendTimer(60);
        setOtp("");
      } else {
        toast({
          variant: "destructive",
          title: "Error",
          description: data.error || "Failed to resend code",
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

  return (
    <div className="min-h-screen bg-white dark:bg-black">
      <div className="container mx-auto px-4 py-8">
        <div className="min-h-screen flex items-center justify-center">
          <div className="w-full max-w-md">
            <div className="bg-white dark:bg-gray-950 rounded-2xl border border-gray-200 dark:border-gray-800 p-8 shadow-sm">
              {/* Logo - Mobile Centered */}
              <div className="mb-8 text-center">
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                  Assignment Hub
                </h1>
                <div className="h-1 bg-blue-600 rounded-full w-16 mx-auto"></div>
              </div>

              {/* Header */}
              <div className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                  {step === "email" && "Recover Password"}
                  {step === "verify" && "Verify Code"}
                  {step === "reset" && "Reset Password"}
                </h2>
                <p className="text-gray-600 dark:text-gray-400">
                  {step === "email" &&
                    "Enter your email to receive a reset code"}
                  {step === "verify" && "Enter the code sent to your email"}
                  {step === "reset" && "Create a new password for your account"}
                </p>
              </div>

              {/* Step Indicator */}
              <div className="mb-6">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Step{" "}
                    {step === "email" ? "1" : step === "verify" ? "2" : "3"} of
                    3
                  </span>
                </div>
                <div className="flex gap-2">
                  <div
                    className={`h-1.5 flex-1 rounded-full transition-all ${
                      step === "email" || step === "verify" || step === "reset"
                        ? "bg-blue-600"
                        : "bg-gray-300 dark:bg-gray-700"
                    }`}
                  ></div>
                  <div
                    className={`h-1.5 flex-1 rounded-full transition-all ${
                      step === "verify" || step === "reset"
                        ? "bg-blue-600"
                        : "bg-gray-300 dark:bg-gray-700"
                    }`}
                  ></div>
                  <div
                    className={`h-1.5 flex-1 rounded-full transition-all ${
                      step === "reset"
                        ? "bg-blue-600"
                        : "bg-gray-300 dark:bg-gray-700"
                    }`}
                  ></div>
                </div>
              </div>

              {/* Email Step */}
              {step === "email" && (
                <form onSubmit={handleSendOTP} className="space-y-5">
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
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="pl-10 h-11 bg-gray-50 dark:bg-gray-900 border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white placeholder:text-gray-500 focus:border-blue-600 focus:ring-1 focus:ring-blue-600"
                        required
                      />
                    </div>
                  </div>

                  <Button
                    type="submit"
                    disabled={isLoading}
                    className="w-full h-11 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    {isLoading ? (
                      <div className="flex items-center gap-2">
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                        Sending...
                      </div>
                    ) : (
                      "Send Reset Code"
                    )}
                  </Button>

                  <div className="text-center pt-4">
                    <Link
                      href="/login"
                      className="text-sm text-blue-600 hover:text-blue-700 dark:text-blue-500 dark:hover:text-blue-400 font-medium inline-flex items-center gap-1"
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
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 dark:bg-blue-950 rounded-full">
                      <ShieldCheck className="w-8 h-8 text-blue-600" />
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Reset code sent to
                      <br />
                      <span className="font-semibold text-gray-900 dark:text-white">
                        {email}
                      </span>
                    </p>
                  </div>

                  <div className="space-y-2">
                    <Label
                      htmlFor="otp"
                      className="text-sm font-medium text-gray-900 dark:text-white"
                    >
                      Reset Code
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
                    />
                    <p className="text-xs text-gray-500 dark:text-gray-400 text-center">
                      Code expires in 10 minutes
                    </p>
                  </div>

                  <Button
                    type="submit"
                    disabled={isLoading || otp.length !== 6}
                    className="w-full h-11 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isLoading ? (
                      <div className="flex items-center gap-2">
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                        Verifying...
                      </div>
                    ) : (
                      "Verify Code"
                    )}
                  </Button>

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

                  <div className="text-center pt-2">
                    <button
                      type="button"
                      onClick={() => {
                        setStep("email");
                        setOtp("");
                      }}
                      className="text-sm text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white transition-colors inline-flex items-center gap-1"
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
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 dark:bg-blue-950 rounded-full">
                      <KeyRound className="w-8 h-8 text-blue-600" />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label
                      htmlFor="newPassword"
                      className="text-sm font-medium text-gray-900 dark:text-white"
                    >
                      New Password
                    </Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                      <Input
                        id="newPassword"
                        type={showPassword ? "text" : "password"}
                        placeholder="Enter new password"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        className="pl-10 pr-10 h-11 bg-gray-50 dark:bg-gray-900 border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white placeholder:text-gray-500 focus:border-blue-600 focus:ring-1 focus:ring-blue-600"
                        required
                        minLength={6}
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
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      Must be at least 6 characters long
                    </p>
                  </div>

                  <div className="space-y-2">
                    <Label
                      htmlFor="confirmPassword"
                      className="text-sm font-medium text-gray-900 dark:text-white"
                    >
                      Confirm New Password
                    </Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                      <Input
                        id="confirmPassword"
                        type={showConfirmPassword ? "text" : "password"}
                        placeholder="Re-enter new password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        className={`pl-10 pr-10 h-11 bg-gray-50 dark:bg-gray-900 border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white placeholder:text-gray-500 focus:border-blue-600 focus:ring-1 focus:ring-blue-600 ${
                          confirmPassword && newPassword !== confirmPassword
                            ? "border-red-600"
                            : confirmPassword && newPassword === confirmPassword
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

                  <Button
                    type="submit"
                    disabled={
                      isLoading ||
                      newPassword !== confirmPassword ||
                      newPassword.length < 6
                    }
                    className="w-full h-11 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isLoading ? (
                      <div className="flex items-center gap-2">
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                        Resetting...
                      </div>
                    ) : (
                      "Reset Password"
                    )}
                  </Button>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
