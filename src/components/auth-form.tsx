"use client";

import { useState, useEffect } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Alert } from "@/components/ui/alert";
import { Spinner } from "@/components/ui/spinner";

type AuthMode = "login" | "register" | "verify";

export function AuthForm() {
  const router = useRouter();
  const [mode, setMode] = useState<AuthMode>("login");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Form states
  const [formData, setFormData] = useState({
    name: "",
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
    otp: "",
  });

  // Real-time validation states
  const [usernameStatus, setUsernameStatus] = useState<{
    checking: boolean;
    available: boolean | null;
    message: string;
  }>({ checking: false, available: null, message: "" });

  const [emailStatus, setEmailStatus] = useState<{
    checking: boolean;
    available: boolean | null;
    message: string;
  }>({ checking: false, available: null, message: "" });

  const [userId, setUserId] = useState("");

  // Debounce timer
  const [usernameTimeout, setUsernameTimeout] = useState<NodeJS.Timeout | null>(
    null
  );
  const [emailTimeout, setEmailTimeout] = useState<NodeJS.Timeout | null>(null);

  // Real-time username check
  useEffect(() => {
    if (mode === "register" && formData.username.length >= 3) {
      if (usernameTimeout) clearTimeout(usernameTimeout);

      setUsernameStatus({
        checking: true,
        available: null,
        message: "Checking...",
      });

      const timeout = setTimeout(async () => {
        try {
          const res = await fetch("/api/auth/check-username", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ username: formData.username }),
          });

          const data = await res.json();
          setUsernameStatus({
            checking: false,
            available: data.available,
            message: data.message,
          });
        } catch {
          setUsernameStatus({
            checking: false,
            available: null,
            message: "Failed to check",
          });
        }
      }, 500);

      setUsernameTimeout(timeout);
    } else if (formData.username.length < 3 && formData.username.length > 0) {
      setUsernameStatus({
        checking: false,
        available: false,
        message: "Username must be at least 3 characters",
      });
    } else {
      setUsernameStatus({ checking: false, available: null, message: "" });
    }
  }, [formData.username, mode]);

  // Real-time email check
  useEffect(() => {
    if (mode === "register" && formData.email.includes("@")) {
      if (emailTimeout) clearTimeout(emailTimeout);

      setEmailStatus({
        checking: true,
        available: null,
        message: "Checking...",
      });

      const timeout = setTimeout(async () => {
        try {
          const res = await fetch("/api/auth/check-email", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email: formData.email }),
          });

          const data = await res.json();
          setEmailStatus({
            checking: false,
            available: data.available,
            message: data.message,
          });
        } catch {
          setEmailStatus({
            checking: false,
            available: null,
            message: "Failed to check",
          });
        }
      }, 500);

      setEmailTimeout(timeout);
    } else {
      setEmailStatus({ checking: false, available: null, message: "" });
    }
  }, [formData.email, mode]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError("");
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const result = await signIn("credentials", {
        email: formData.email,
        password: formData.password,
        redirect: false,
      });

      if (result?.error) {
        setError(result.error);
      } else {
        setSuccess("Login successful! Redirecting...");
        setTimeout(() => {
          router.push("/");
          router.refresh();
        }, 1000);
      }
    } catch {
      setError("An error occurred during login");
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    // Validation
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      setIsLoading(false);
      return;
    }

    if (formData.password.length < 8) {
      setError("Password must be at least 8 characters");
      setIsLoading(false);
      return;
    }

    if (!emailStatus.available || !usernameStatus.available) {
      setError("Please fix the errors before submitting");
      setIsLoading(false);
      return;
    }

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

      if (!res.ok) {
        setError(data.error || "Registration failed");
      } else {
        setSuccess(data.message);
        setUserId(data.userId);
        setTimeout(() => {
          setMode("verify");
          setSuccess("");
        }, 2000);
      }
    } catch {
      setError("An error occurred during registration");
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const res = await fetch("/api/auth/verify-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: formData.email,
          otp: formData.otp,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Verification failed");
      } else {
        setSuccess(data.message);
        setTimeout(() => {
          setMode("login");
          setFormData({
            ...formData,
            otp: "",
            password: "",
            confirmPassword: "",
          });
        }, 2000);
      }
    } catch {
      setError("An error occurred during verification");
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendOTP = async () => {
    setError("");
    setIsLoading(true);

    try {
      const res = await fetch("/api/auth/resend-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: formData.email }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Failed to resend OTP");
      } else {
        setSuccess(data.message);
      }
    } catch {
      setError("An error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  const isFormValid = () => {
    if (mode === "login") {
      return formData.email && formData.password;
    } else if (mode === "register") {
      return (
        formData.name &&
        formData.email &&
        formData.username &&
        formData.password &&
        formData.confirmPassword &&
        emailStatus.available &&
        usernameStatus.available
      );
    } else {
      return formData.otp.length === 6;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 dark:from-gray-900 dark:via-purple-900 dark:to-gray-900 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <Card className="backdrop-blur-sm bg-white/90 dark:bg-gray-800/90 shadow-2xl border-0">
          <CardHeader className="space-y-1 pb-6">
            <div className="flex items-center justify-center mb-4">
              <div className="text-4xl">🎓</div>
            </div>
            <CardTitle className="text-2xl font-bold text-center bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              {mode === "login" && "Welcome Back"}
              {mode === "register" && "Create Account"}
              {mode === "verify" && "Verify Email"}
            </CardTitle>
            <CardDescription className="text-center">
              {mode === "login" && "Sign in to your AssignmentGhar account"}
              {mode === "register" && "Join AssignmentGhar today"}
              {mode === "verify" &&
                "Enter the verification code sent to your email"}
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-4">
            {error && (
              <Alert variant="destructive" className="animate-shake">
                {error}
              </Alert>
            )}

            {success && (
              <Alert className="bg-green-50 text-green-800 border-green-200 animate-fade-in">
                {success}
              </Alert>
            )}

            <div className="relative overflow-hidden">
              {/* Login Form */}
              <div
                className={`transition-all duration-500 ease-in-out ${
                  mode === "login"
                    ? "translate-x-0 opacity-100"
                    : "-translate-x-full opacity-0 absolute inset-0"
                }`}
              >
                <form onSubmit={handleLogin} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="login-email">Email</Label>
                    <Input
                      id="login-email"
                      name="email"
                      type="email"
                      placeholder="student@example.com"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      disabled={isLoading}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="login-password">Password</Label>
                    <Input
                      id="login-password"
                      name="password"
                      type="password"
                      placeholder="••••••••"
                      value={formData.password}
                      onChange={handleChange}
                      required
                      disabled={isLoading}
                    />
                  </div>

                  <Button
                    type="submit"
                    className="w-full"
                    disabled={!isFormValid() || isLoading}
                  >
                    {isLoading ? <Spinner className="mr-2" /> : null}
                    {isLoading ? "Signing in..." : "Sign In"}
                  </Button>
                </form>

                <div className="mt-4 text-center text-sm">
                  <button
                    type="button"
                    onClick={() => setMode("register")}
                    className="text-blue-600 hover:text-blue-700 hover:underline"
                    disabled={isLoading}
                  >
                    Don't have an account? Register
                  </button>
                </div>
              </div>

              {/* Register Form */}
              <div
                className={`transition-all duration-500 ease-in-out ${
                  mode === "register"
                    ? "translate-x-0 opacity-100"
                    : mode === "login"
                    ? "translate-x-full opacity-0 absolute inset-0"
                    : "-translate-x-full opacity-0 absolute inset-0"
                }`}
              >
                <form onSubmit={handleRegister} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="register-name">Full Name</Label>
                    <Input
                      id="register-name"
                      name="name"
                      type="text"
                      placeholder="John Doe"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      disabled={isLoading}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="register-username">Username</Label>
                    <Input
                      id="register-username"
                      name="username"
                      type="text"
                      placeholder="johndoe"
                      value={formData.username}
                      onChange={handleChange}
                      required
                      disabled={isLoading}
                    />
                    {usernameStatus.message && (
                      <p
                        className={`text-xs ${
                          usernameStatus.checking
                            ? "text-gray-500"
                            : usernameStatus.available
                            ? "text-green-600"
                            : "text-red-600"
                        }`}
                      >
                        {usernameStatus.checking
                          ? "⏳ "
                          : usernameStatus.available
                          ? "✓ "
                          : "✗ "}
                        {usernameStatus.message}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="register-email">Email</Label>
                    <Input
                      id="register-email"
                      name="email"
                      type="email"
                      placeholder="john@example.com"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      disabled={isLoading}
                    />
                    {emailStatus.message && (
                      <p
                        className={`text-xs ${
                          emailStatus.checking
                            ? "text-gray-500"
                            : emailStatus.available
                            ? "text-green-600"
                            : "text-red-600"
                        }`}
                      >
                        {emailStatus.checking
                          ? "⏳ "
                          : emailStatus.available
                          ? "✓ "
                          : "✗ "}
                        {emailStatus.message}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="register-password">Password</Label>
                    <Input
                      id="register-password"
                      name="password"
                      type="password"
                      placeholder="Minimum 8 characters"
                      value={formData.password}
                      onChange={handleChange}
                      required
                      disabled={isLoading}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="register-confirm">Confirm Password</Label>
                    <Input
                      id="register-confirm"
                      name="confirmPassword"
                      type="password"
                      placeholder="Re-enter password"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      required
                      disabled={isLoading}
                    />
                    {formData.confirmPassword &&
                      formData.password !== formData.confirmPassword && (
                        <p className="text-xs text-red-600">
                          ✗ Passwords do not match
                        </p>
                      )}
                  </div>

                  <Button
                    type="submit"
                    className="w-full"
                    disabled={!isFormValid() || isLoading}
                  >
                    {isLoading ? <Spinner className="mr-2" /> : null}
                    {isLoading ? "Creating account..." : "Create Account"}
                  </Button>
                </form>

                <div className="mt-4 text-center text-sm">
                  <button
                    type="button"
                    onClick={() => setMode("login")}
                    className="text-blue-600 hover:text-blue-700 hover:underline"
                    disabled={isLoading}
                  >
                    Already have an account? Sign in
                  </button>
                </div>
              </div>

              {/* Verify OTP Form */}
              <div
                className={`transition-all duration-500 ease-in-out ${
                  mode === "verify"
                    ? "translate-x-0 opacity-100"
                    : "translate-x-full opacity-0 absolute inset-0"
                }`}
              >
                <form onSubmit={handleVerifyOTP} className="space-y-4">
                  <div className="text-center mb-4">
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      We've sent a 6-digit code to
                    </p>
                    <p className="font-semibold text-blue-600">
                      {formData.email}
                    </p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="verify-otp">Verification Code</Label>
                    <Input
                      id="verify-otp"
                      name="otp"
                      type="text"
                      placeholder="000000"
                      value={formData.otp}
                      onChange={handleChange}
                      maxLength={6}
                      className="text-center text-2xl tracking-widest"
                      required
                      disabled={isLoading}
                    />
                  </div>

                  <Button
                    type="submit"
                    className="w-full"
                    disabled={!isFormValid() || isLoading}
                  >
                    {isLoading ? <Spinner className="mr-2" /> : null}
                    {isLoading ? "Verifying..." : "Verify Email"}
                  </Button>

                  <Button
                    type="button"
                    variant="outline"
                    className="w-full"
                    onClick={handleResendOTP}
                    disabled={isLoading}
                  >
                    Resend Code
                  </Button>
                </form>

                <div className="mt-4 text-center text-sm">
                  <button
                    type="button"
                    onClick={() => setMode("register")}
                    className="text-blue-600 hover:text-blue-700 hover:underline"
                    disabled={isLoading}
                  >
                    ← Back to registration
                  </button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="mt-6 text-center text-xs text-gray-600 dark:text-gray-400">
          <p>
            By continuing, you agree to AssignmentGhar's{" "}
            <a href="/privacy" className="underline hover:text-blue-600">
              Terms of Service
            </a>{" "}
            and{" "}
            <a href="/privacy" className="underline hover:text-blue-600">
              Privacy Policy
            </a>
          </p>
        </div>

        <div className="mt-4 p-4 bg-blue-50 dark:bg-gray-800 rounded-lg text-sm">
          <p className="font-semibold mb-2">🔐 Default Admin Credentials:</p>
          <p className="text-gray-700 dark:text-gray-300">
            Email:{" "}
            <code className="bg-white dark:bg-gray-900 px-2 py-1 rounded">
              admin@assignmentghar.com
            </code>
          </p>
          <p className="text-gray-700 dark:text-gray-300">
            Password:{" "}
            <code className="bg-white dark:bg-gray-900 px-2 py-1 rounded">
              Admin@123
            </code>
          </p>
          <p className="text-xs text-gray-500 mt-2">
            ⚠️ Change password after first login!
          </p>
        </div>
      </div>
    </div>
  );
}
