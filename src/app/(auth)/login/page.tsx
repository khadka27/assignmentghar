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
import { Eye, EyeOff, Mail, Lock, User } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

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

  // Redirect if already logged in
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
      // Preflight check if status isn't settled yet
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

      // Intercept if account is unverified to avoid server UNVERIFIED error
      if (checkStatus === "unverified") {
        setShowUnverifiedDialog(true);
        toast({
          title: "Account not verified",
          description: "Please verify your email before logging in.",
        });
        return; // Don't call signIn
      }

      const emailToUse = resolvedEmail || formData.email;
      // Login
      const result = await signIn("credentials", {
        email: emailToUse,
        password: formData.password,
        redirect: false,
      });

      if (result?.error) {
        // Debug: Log the actual error
        console.log("=== LOGIN ERROR DEBUG ===");
        console.log("Full error:", result.error);
        console.log("Email used:", formData.email);

        // Parse error code from error message format: "CODE: message"
        const errorParts = result.error.split(": ");
        const errorCode = errorParts[0];
        const errorMessage = errorParts.slice(1).join(": ") || result.error;

        console.log("Parsed error code:", errorCode);
        console.log("Parsed error message:", errorMessage);
        console.log("========================");

        // Handle specific error codes
        // Also check if error contains "verify" or "unverified" (fallback)
        if (
          errorCode === "UNVERIFIED" ||
          result.error.toLowerCase().includes("verify") ||
          result.error.toLowerCase().includes("unverified")
        ) {
          // Account exists but not verified - Redirect to missing-verification page
          console.log("UNVERIFIED detected - redirecting to verification");
          toast({
            title: "Email Not Verified",
            description: "Please verify your email first. Redirecting...",
          });

          // Redirect to missing-verification page with email and auto-send OTP
          setTimeout(() => {
            router.push(
              `/missing-verification?email=${encodeURIComponent(
                resolvedEmail || formData.email
              )}&autoSend=true`
            );
          }, 1500);
          setIsLoading(false); // Set loading false but keep user on page during redirect
          return; // Exit early
        }

        switch (errorCode) {
          case "USER_NOT_FOUND":
            toast({
              variant: "destructive",
              title: "Account not found",
              description:
                "We couldn't find an account with that username or email. You can create one from the Register page.",
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
                "The username/email or password you entered is incorrect. Please try again.",
            });
            setAuthError(
              "The username/email or password you entered is incorrect."
            );
            break;

          default:
            // Fallback for any other errors
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

  // Realtime account check (username or email)
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
          setShowUnverifiedDialog(true); // open popup in real-time
        }
      } catch (e) {
        setCheckStatus("idle");
        setResolvedEmail(null);
      } finally {
        if (!cancelled) setChecking(false);
      }
    }, 400); // debounce

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

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Email field */}
              <div className="space-y-2 animate-slide-down">
                <Label
                  htmlFor="email"
                  className="text-gray-700 dark:text-gray-300 font-medium"
                >
                  Username or email
                </Label>
                <div className="relative group">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 group-focus-within:text-blue-500 transition-colors duration-300" />
                  <Input
                    id="email"
                    type="text"
                    placeholder="johnsmith007"
                    value={formData.email}
                    onChange={(e) => {
                      setFormData({ ...formData, email: e.target.value });
                      if (authError) setAuthError(null);
                    }}
                    className="pl-10 h-12 bg-gray-50 dark:bg-gray-900/50 border-gray-300 dark:border-gray-600 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all duration-300"
                    required
                  />
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
                      setFormData({ ...formData, password: e.target.value });
                      if (authError) setAuthError(null);
                    }}
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

              {/* Forgot Password */}
              <div className="flex justify-end animate-slide-down">
                <Link
                  href="/recover"
                  className="text-sm text-blue-600 hover:text-purple-600 dark:text-blue-400 dark:hover:text-purple-400 transition-colors duration-300 hover:underline"
                >
                  Forgot password?
                </Link>
              </div>

              {/* Error banner (friendly) */}
              {authError && (
                <Alert variant="destructive" className="animate-fade-in">
                  <AlertTitle>We couldn’t sign you in</AlertTitle>
                  <AlertDescription>
                    <p>{authError}</p>
                    <p className="text-xs mt-1 text-muted-foreground">
                      Tip: Check that Caps Lock is off, or use “Forgot
                      password?” to reset.
                    </p>
                  </AlertDescription>
                </Alert>
              )}

              {/* Submit Button */}
              <Button
                type="submit"
                disabled={isLoading || checkStatus === "unverified"}
                className="w-full h-12 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed animate-slide-down"
              >
                {isLoading ? (
                  <div className="flex items-center gap-2">
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Signing in...</span>
                  </div>
                ) : (
                  <span>Sign in</span>
                )}
              </Button>

              {/* Inline helper under email */}
              <div className="min-h-5 text-sm text-gray-500">
                {checkStatus === "checking" && (
                  <span className="text-gray-500">Checking account…</span>
                )}
                {checkStatus === "not_found" && (
                  <span className="text-gray-500">
                    No account found. You can still create one.
                  </span>
                )}
                {checkStatus === "unverified" && (
                  <span className="text-amber-600">
                    This account is not verified yet.{" "}
                    <button
                      type="button"
                      onClick={() =>
                        router.push(
                          `/missing-verification?email=${encodeURIComponent(
                            resolvedEmail || formData.email
                          )}&autoSend=true`
                        )
                      }
                      className="text-blue-600 hover:text-purple-600 underline underline-offset-2 font-medium"
                    >
                      Verify now
                    </button>
                  </span>
                )}
              </div>

              {/* Divider */}
              <div className="relative my-6 animate-slide-down">
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

              {/* Link to Register */}
              <div className="text-center pt-4 animate-slide-down">
                <p className="text-gray-600 dark:text-gray-400">
                  Are you new?{" "}
                  <Link
                    href="/register"
                    className="text-blue-600 hover:text-purple-600 dark:text-blue-400 dark:hover:text-purple-400 font-semibold transition-colors duration-300 hover:underline"
                  >
                    Create an Account
                  </Link>
                </p>
              </div>
            </form>
          </div>
        </div>
      </div>

      {/* Unverified account dialog */}
      <Dialog
        open={showUnverifiedDialog}
        onOpenChange={setShowUnverifiedDialog}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Account not verified</DialogTitle>
            <DialogDescription>
              This account is unverified. Please verify your email first to
              login.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => setShowUnverifiedDialog(false)}
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
            >
              Verify now
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

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
