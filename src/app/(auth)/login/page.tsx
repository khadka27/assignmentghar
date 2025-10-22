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
  AlertCircle,
  CheckCircle2,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Alert, AlertDescription } from "@/components/ui/alert";

export default function LoginPage() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const { toast } = useToast();

  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [checking, setChecking] = useState(false);
  const [checkStatus, setCheckStatus] = useState<
    "idle" | "checking" | "verified" | "unverified" | "not_found"
  >("idle");
  const [resolvedEmail, setResolvedEmail] = useState<string | null>(null);
  const [showUnverifiedDialog, setShowUnverifiedDialog] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  useEffect(() => {
    if (status === "authenticated" && session?.user) {
      router.push("/");
    }
  }, [status, session, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setAuthError(null);

    try {
      if (checkStatus === "idle" || checkStatus === "checking") {
        try {
          const res = await fetch(
            `/api/auth/check-account?identifier=${encodeURIComponent(
              formData.email
            )}`
          );
          if (res.ok) {
            const data = await res.json();
            if (data?.exists && !data?.isVerified) {
              setResolvedEmail(data.email || null);
              setShowUnverifiedDialog(true);
              toast({
                title: "Account not verified",
                description: "Please verify your email before logging in.",
              });
              return;
            }
            if (data?.exists && data?.isVerified && data?.email) {
              setResolvedEmail(data.email);
            }
          }
        } catch {}
      }

      if (checkStatus === "unverified") {
        setShowUnverifiedDialog(true);
        toast({
          title: "Account not verified",
          description: "Please verify your email before logging in.",
        });
        return;
      }

      const emailToUse = resolvedEmail || formData.email;
      const result = await signIn("credentials", {
        email: emailToUse,
        password: formData.password,
        redirect: false,
      });

      if (result?.error) {
        const errorParts = result.error.split(": ");
        const errorCode = errorParts[0];
        const errorMessage = errorParts.slice(1).join(": ") || result.error;

        if (
          errorCode === "UNVERIFIED" ||
          result.error.toLowerCase().includes("verify") ||
          result.error.toLowerCase().includes("unverified")
        ) {
          toast({
            title: "Email Not Verified",
            description: "Please verify your email first. Redirecting...",
          });

          setTimeout(() => {
            router.push(
              `/missing-verification?email=${encodeURIComponent(
                resolvedEmail || formData.email
              )}&autoSend=true`
            );
          }, 1500);
          setIsLoading(false);
          return;
        }

        switch (errorCode) {
          case "USER_NOT_FOUND":
            toast({
              variant: "destructive",
              title: "Account not found",
              description:
                "We couldn't find an account with that username or email.",
            });
            setAuthError(
              "We couldn't find an account with that username or email."
            );
            break;

          case "INVALID_CREDENTIALS":
            toast({
              variant: "destructive",
              title: "Incorrect credentials",
              description:
                errorMessage ||
                "The username/email or password you entered is incorrect.",
            });
            setAuthError(
              "The username/email or password you entered is incorrect."
            );
            break;

          default:
            toast({
              variant: "destructive",
              title: "Login Failed",
              description: errorMessage || "An error occurred during login",
            });
            setAuthError("An error occurred during login. Please try again.");
        }
      } else {
        toast({
          title: "Welcome back!",
          description: "Login successful",
        });
        router.push("/");
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Something went wrong. Please try again.",
      });
      setAuthError("Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const identifier = formData.email.trim();
    if (!identifier || identifier.length < 3) {
      setCheckStatus("idle");
      setResolvedEmail(null);
      return;
    }

    let cancelled = false;
    setChecking(true);
    setCheckStatus("checking");
    const t = setTimeout(async () => {
      try {
        const res = await fetch(
          `/api/auth/check-account?identifier=${encodeURIComponent(identifier)}`
        );
        if (cancelled) return;
        if (!res.ok) {
          setCheckStatus("idle");
          setResolvedEmail(null);
          return;
        }
        const data = await res.json();
        if (!data.exists) {
          setCheckStatus("not_found");
          setResolvedEmail(null);
          setShowUnverifiedDialog(false);
          return;
        }
        setResolvedEmail(data.email || null);
        if (data.isVerified) {
          setCheckStatus("verified");
          setShowUnverifiedDialog(false);
        } else {
          setCheckStatus("unverified");
          setShowUnverifiedDialog(true);
        }
      } catch (e) {
        setCheckStatus("idle");
        setResolvedEmail(null);
      } finally {
        if (!cancelled) setChecking(false);
      }
    }, 400);

    return () => {
      cancelled = true;
      clearTimeout(t);
    };
  }, [formData.email]);

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
                    Welcome Back
                  </h1>
                  <div className="h-1.5 bg-blue-600 rounded-full w-24"></div>
                </div>
                <p className="text-lg text-gray-600 dark:text-gray-400 max-w-md">
                  Sign in to access your assignments and continue your academic
                  journey
                </p>
              </div>

              {/* Feature Cards */}
              <div className="space-y-4">
                {[
                  {
                    icon: "📚",
                    title: "Manage Assignments",
                    desc: "Track all your work in one place",
                  },
                  {
                    icon: "✓",
                    title: "Stay Organized",
                    desc: "Never miss a deadline again",
                  },
                  {
                    icon: "📊",
                    title: "Track Progress",
                    desc: "Monitor your academic success",
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

            {/* Right Side - Login Form */}
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
                    Sign In
                  </h2>
                  <p className="text-gray-600 dark:text-gray-400">
                    Enter your credentials to continue
                  </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-5">
                  {/* Email/Username Field */}
                  <div className="space-y-2">
                    <Label
                      htmlFor="email"
                      className="text-sm font-medium text-gray-900 dark:text-white"
                    >
                      Username or Email
                    </Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                      <Input
                        id="email"
                        type="text"
                        placeholder="Enter username or email"
                        value={formData.email}
                        onChange={(e) => {
                          setFormData({ ...formData, email: e.target.value });
                          if (authError) setAuthError(null);
                        }}
                        className="pl-10 h-11 bg-gray-50 dark:bg-gray-900 border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white placeholder:text-gray-500 focus:border-blue-600 focus:ring-1 focus:ring-blue-600"
                        required
                      />
                      {checkStatus === "verified" && (
                        <CheckCircle2 className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-green-600" />
                      )}
                    </div>

                    {/* Status Messages */}
                    {checkStatus === "not_found" && (
                      <p className="text-xs text-gray-500 dark:text-gray-400 flex items-center gap-1">
                        <AlertCircle className="h-3 w-3" />
                        No account found with this username/email
                      </p>
                    )}
                    {checkStatus === "unverified" && (
                      <p className="text-xs text-amber-600 dark:text-amber-500 flex items-center gap-1">
                        <AlertCircle className="h-3 w-3" />
                        Account not verified.{" "}
                        <button
                          type="button"
                          onClick={() =>
                            router.push(
                              `/missing-verification?email=${encodeURIComponent(
                                resolvedEmail || formData.email
                              )}&autoSend=true`
                            )
                          }
                          className="underline font-medium hover:text-amber-700"
                        >
                          Verify now
                        </button>
                      </p>
                    )}
                  </div>

                  {/* Password Field */}
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
                        placeholder="Enter your password"
                        value={formData.password}
                        onChange={(e) => {
                          setFormData({
                            ...formData,
                            password: e.target.value,
                          });
                          if (authError) setAuthError(null);
                        }}
                        className="pl-10 pr-10 h-11 bg-gray-50 dark:bg-gray-900 border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white placeholder:text-gray-500 focus:border-blue-600 focus:ring-1 focus:ring-blue-600"
                        required
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
                  </div>

                  {/* Forgot Password */}
                  <div className="flex justify-end">
                    <Link
                      href="/recover"
                      className="text-sm text-blue-600 hover:text-blue-700 dark:text-blue-500 dark:hover:text-blue-400 font-medium"
                    >
                      Forgot password?
                    </Link>
                  </div>

                  {/* Error Alert */}
                  {authError && (
                    <Alert
                      variant="destructive"
                      className="bg-red-50 dark:bg-red-950/30 border-red-200 dark:border-red-900"
                    >
                      <AlertCircle className="h-4 w-4" />
                      <AlertDescription className="text-sm text-red-800 dark:text-red-400">
                        {authError}
                      </AlertDescription>
                    </Alert>
                  )}

                  {/* Sign In Button */}
                  <Button
                    type="submit"
                    disabled={isLoading || checkStatus === "unverified"}
                    className="w-full h-11 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    {isLoading ? (
                      <div className="flex items-center gap-2">
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                        Signing in...
                      </div>
                    ) : (
                      "Sign In"
                    )}
                  </Button>

                  {/* Divider */}
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

                  {/* Google Sign In */}
                  <Button
                    type="button"
                    onClick={handleGoogleSignIn}
                    disabled={isLoading}
                    variant="outline"
                    className="w-full h-11 border-gray-300 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-900 text-gray-900 dark:text-white font-medium rounded-lg transition-colors"
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

                  {/* Sign Up Link */}
                  <p className="text-center text-sm text-gray-600 dark:text-gray-400 pt-4">
                    Don't have an account?{" "}
                    <Link
                      href="/register"
                      className="text-blue-600 hover:text-blue-700 dark:text-blue-500 dark:hover:text-blue-400 font-semibold"
                    >
                      Create Account
                    </Link>
                  </p>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Unverified Dialog */}
      <Dialog
        open={showUnverifiedDialog}
        onOpenChange={setShowUnverifiedDialog}
      >
        <DialogContent className="bg-white dark:bg-gray-950 border-gray-200 dark:border-gray-800">
          <DialogHeader>
            <DialogTitle className="text-gray-900 dark:text-white">
              Account Not Verified
            </DialogTitle>
            <DialogDescription className="text-gray-600 dark:text-gray-400">
              This account is unverified. Please verify your email first to
              login.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => setShowUnverifiedDialog(false)}
              className="border-gray-300 dark:border-gray-700"
            >
              Close
            </Button>
            <Button
              type="button"
              onClick={() => {
                const emailParam = encodeURIComponent(
                  resolvedEmail || formData.email
                );
                router.push(
                  `/missing-verification?email=${emailParam}&autoSend=true`
                );
              }}
              className="bg-blue-600 hover:bg-blue-700 text-white"
            >
              Verify Now
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
