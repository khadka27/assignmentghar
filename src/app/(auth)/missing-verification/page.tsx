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
  ArrowLeft,
  Loader2,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Alert, AlertDescription } from "@/components/ui/alert";

export default function MissingVerificationPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { toast } = useToast();

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

  const handleResendOTP = async () => {
    if (resendTimer > 0) return;
    await handleSendOTP();
  };

  return (
    <div className="min-h-screen bg-white dark:bg-black">
      <div className="container mx-auto px-4 py-8">
        <div className="min-h-screen flex items-center justify-center">
          <div className="w-full max-w-md">
            <div className="bg-white dark:bg-gray-950 rounded-2xl border border-gray-200 dark:border-gray-800 p-8 shadow-sm">
              {/* Logo */}
              <div className="mb-8 text-center">
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                  Assignment Hub
                </h1>
                <div className="h-1 bg-blue-600 rounded-full w-16 mx-auto"></div>
              </div>

              {/* Email Check Form */}
              {accountStatus === "checking" && !emailFromParams && (
                <div className="space-y-6">
                  <div className="text-center space-y-3">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 dark:bg-blue-950 rounded-full mb-2">
                      <ShieldCheck className="w-8 h-8 text-blue-600" />
                    </div>
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                      Account Verification
                    </h2>
                    <p className="text-gray-600 dark:text-gray-400">
                      Check your account verification status
                    </p>
                  </div>

                  <form onSubmit={handleCheckAccount} className="space-y-5">
                    <div className="space-y-2">
                      <Label
                        htmlFor="email-check"
                        className="text-sm font-medium text-gray-900 dark:text-white"
                      >
                        Email Address
                      </Label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                        <Input
                          id="email-check"
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
                      disabled={isLoading || !email}
                      className="w-full h-11 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isLoading ? (
                        <div className="flex items-center gap-2">
                          <Loader2 className="w-4 h-4 animate-spin" />
                          Checking...
                        </div>
                      ) : (
                        "Check Account Status"
                      )}
                    </Button>
                  </form>

                  <div className="text-center">
                    <Link
                      href="/login"
                      className="text-sm text-blue-600 hover:text-blue-700 dark:text-blue-500 dark:hover:text-blue-400 font-medium inline-flex items-center gap-1"
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
                    <Loader2 className="w-12 h-12 text-blue-600 animate-spin" />
                  </div>
                  <p className="text-gray-600 dark:text-gray-400">
                    Checking account status...
                  </p>
                </div>
              )}

              {/* Account Not Found */}
              {accountStatus === "not-found" && (
                <div className="space-y-6">
                  <div className="text-center space-y-4">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-red-100 dark:bg-red-950 rounded-full">
                      <UserX className="w-8 h-8 text-red-600" />
                    </div>
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                      Account Not Found
                    </h2>
                    <p className="text-gray-600 dark:text-gray-400">
                      No account exists with email:
                      <br />
                      <span className="font-semibold text-gray-900 dark:text-white">
                        {email}
                      </span>
                    </p>
                  </div>

                  <Alert className="bg-blue-50 dark:bg-blue-950/30 border-blue-200 dark:border-blue-900">
                    <AlertDescription className="text-center">
                      <p className="text-gray-700 dark:text-gray-300 font-medium mb-4">
                        Would you like to create an account?
                      </p>
                      <div className="flex gap-3">
                        <Button
                          onClick={() => router.push("/register")}
                          className="flex-1 bg-blue-600 hover:bg-blue-700 text-white"
                        >
                          Create Account
                        </Button>
                        <Button
                          variant="outline"
                          onClick={() => router.push("/login")}
                          className="flex-1 border-gray-300 dark:border-gray-700"
                        >
                          Go to Login
                        </Button>
                      </div>
                    </AlertDescription>
                  </Alert>
                </div>
              )}

              {/* Account Unverified */}
              {accountStatus === "unverified" && !showOTPInput && (
                <div className="space-y-6">
                  <div className="text-center space-y-4">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-yellow-100 dark:bg-yellow-950 rounded-full">
                      <AlertCircle className="w-8 h-8 text-yellow-600" />
                    </div>
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                      Email Not Verified
                    </h2>
                    <p className="text-gray-600 dark:text-gray-400">
                      Your account exists but email is not verified yet
                    </p>
                  </div>

                  <Alert className="bg-yellow-50 dark:bg-yellow-950/30 border-yellow-200 dark:border-yellow-900">
                    <AlertDescription className="space-y-4">
                      <p className="text-gray-700 dark:text-gray-300 font-medium text-center">
                        Email:{" "}
                        <span className="text-blue-600 dark:text-blue-400">
                          {email}
                        </span>
                      </p>
                      <p className="text-sm text-gray-600 dark:text-gray-400 text-center">
                        We'll send a verification code to complete your
                        registration
                      </p>
                      <Button
                        onClick={handleSendOTP}
                        disabled={isLoading}
                        className="w-full h-11 bg-blue-600 hover:bg-blue-700 text-white font-medium disabled:opacity-50"
                      >
                        {isLoading ? (
                          <div className="flex items-center gap-2">
                            <Loader2 className="w-4 h-4 animate-spin" />
                            Sending Code...
                          </div>
                        ) : (
                          "Send Verification Code"
                        )}
                      </Button>
                    </AlertDescription>
                  </Alert>

                  <div className="text-center">
                    <Link
                      href="/login"
                      className="text-sm text-blue-600 hover:text-blue-700 dark:text-blue-500 dark:hover:text-blue-400 font-medium inline-flex items-center gap-1"
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
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 dark:bg-blue-950 rounded-full">
                      <Mail className="w-8 h-8 text-blue-600" />
                    </div>
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                      Verify Your Email
                    </h2>
                    <p className="text-gray-600 dark:text-gray-400">
                      We've sent a 6-digit code to
                    </p>
                    <p className="font-semibold text-gray-900 dark:text-white">
                      {email}
                    </p>
                  </div>

                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label
                        htmlFor="otp-input"
                        className="text-sm font-medium text-gray-900 dark:text-white"
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
                        className="h-14 text-center text-2xl font-bold tracking-widest bg-gray-50 dark:bg-gray-900 border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white focus:border-blue-600 focus:ring-1 focus:ring-blue-600"
                      />
                      <p className="text-xs text-gray-500 dark:text-gray-400 text-center">
                        Code expires in 10 minutes
                      </p>
                    </div>

                    <Button
                      onClick={handleVerifyOTP}
                      disabled={otp.length !== 6 || isLoading}
                      className="w-full h-11 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isLoading ? (
                        <div className="flex items-center gap-2">
                          <Loader2 className="w-4 h-4 animate-spin" />
                          Verifying...
                        </div>
                      ) : (
                        "Verify Email"
                      )}
                    </Button>

                    <div className="text-center space-y-2">
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
                          <span className="flex items-center gap-1">
                            <Clock className="w-4 h-4" />
                            Resend in {resendTimer}s
                          </span>
                        ) : (
                          "Resend Code"
                        )}
                      </Button>
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
                      className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white text-sm"
                    >
                      <ArrowLeft className="h-4 w-4 mr-1" />
                      Back
                    </Button>
                  </div>
                </div>
              )}

              {/* Account Already Verified */}
              {accountStatus === "verified" && (
                <div className="space-y-6 text-center">
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 dark:bg-green-950 rounded-full">
                    <CheckCircle className="w-8 h-8 text-green-600" />
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                    Account Already Verified!
                  </h2>
                  <p className="text-gray-600 dark:text-gray-400">
                    Redirecting you to login...
                  </p>
                  <div className="flex justify-center">
                    <Loader2 className="w-6 h-6 text-blue-600 animate-spin" />
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
