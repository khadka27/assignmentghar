"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useToast } from "@/hooks/use-toast";
import { useTheme } from "@/hooks/use-theme";
import {
  Loader2,
  User,
  Mail,
  Lock,
  Camera,
  Save,
  Eye,
  EyeOff,
  Shield,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";

export default function ProfilePage() {
  const { data: session, status, update } = useSession();
  const router = useRouter();
  const { toast } = useToast();
  const { theme } = useTheme();
  const isDark = theme === "dark";

  // Brand theme colors
  const themeColors = {
    primary: "#0E52AC",
    primaryHover: "#0A3D7F",
    text1: isDark ? "#FFFFFF" : "#111E2F",
    text2: isDark ? "#CBD5E1" : "#284366",
    text3: isDark ? "#94A3B8" : "#64748B",
    bg1: isDark ? "#0A0F1E" : "#FFFFFF",
    bg2: isDark ? "#1E293B" : "#F8FBFF",
    cardBg: isDark ? "#1E293B" : "#FFFFFF",
    border: isDark ? "#475569" : "#E0EDFD",
    inputBg: isDark ? "#0F172A" : "#F8FBFF",
  };

  // Profile form state
  const [profileData, setProfileData] = useState({
    name: "",
    email: "",
    username: "",
    image: "",
  });

  // Password form state
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  // UI state
  const [isUpdating, setIsUpdating] = useState(false);
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [activeTab, setActiveTab] = useState<"profile" | "password">("profile");
  const [profileErrors, setProfileErrors] = useState<Record<string, string>>(
    {}
  );
  const [passwordErrors, setPasswordErrors] = useState<Record<string, string>>(
    {}
  );
  const [passwordStrength, setPasswordStrength] = useState(0);

  // Redirect if not authenticated
  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    }
  }, [status, router]);

  // Load user data
  useEffect(() => {
    if (session?.user) {
      setProfileData({
        name: session.user.name || "",
        email: session.user.email || "",
        username:
          session.user.username || session.user.email?.split("@")[0] || "",
        image: session.user.image || "",
      });
    }
  }, [session]);

  // Password strength calculator
  const calculatePasswordStrength = (password: string) => {
    let strength = 0;
    if (password.length >= 8) strength += 25;
    if (password.length >= 12) strength += 25;
    if (/[a-z]/.test(password) && /[A-Z]/.test(password)) strength += 25;
    if (/\d/.test(password)) strength += 15;
    if (/[^a-zA-Z0-9]/.test(password)) strength += 10;
    return Math.min(strength, 100);
  };

  // Handle password input change
  const handlePasswordInputChange = (field: string, value: string) => {
    setPasswordData((prev) => ({ ...prev, [field]: value }));
    if (field === "newPassword") {
      setPasswordStrength(calculatePasswordStrength(value));
    }
    if (passwordErrors[field]) {
      setPasswordErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  // Validate profile form
  const validateProfileForm = () => {
    const errors: Record<string, string> = {};
    if (!profileData.name.trim()) {
      errors.name = "Name is required";
    }
    if (!profileData.email.trim()) {
      errors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(profileData.email)) {
      errors.email = "Invalid email format";
    }
    setProfileErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Validate password form
  const validatePasswordForm = () => {
    const errors: Record<string, string> = {};
    if (!passwordData.currentPassword) {
      errors.currentPassword = "Current password is required";
    }
    if (!passwordData.newPassword) {
      errors.newPassword = "New password is required";
    } else if (passwordData.newPassword.length < 8) {
      errors.newPassword = "Password must be at least 8 characters";
    }
    if (!passwordData.confirmPassword) {
      errors.confirmPassword = "Please confirm your password";
    } else if (passwordData.newPassword !== passwordData.confirmPassword) {
      errors.confirmPassword = "Passwords do not match";
    }
    if (passwordData.currentPassword === passwordData.newPassword) {
      errors.newPassword =
        "New password must be different from current password";
    }
    setPasswordErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Handle profile update with optimistic UI
  const handleProfileUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateProfileForm()) return;

    setIsUpdating(true);

    // Store old data for rollback
    const oldData = { ...profileData };

    try {
      // Optimistically update session immediately
      await update({
        ...session,
        user: {
          ...session?.user,
          name: profileData.name,
          email: profileData.email,
          image: profileData.image,
        },
      });

      // Make API call
      const response = await axios.patch("/api/user/profile", {
        name: profileData.name,
        email: profileData.email,
        image: profileData.image,
      });

      toast({
        title: "Success!",
        description: "Profile updated successfully",
      });
    } catch (error: any) {
      console.error("Profile update error:", error);

      // Rollback on error
      setProfileData(oldData);
      await update({
        ...session,
        user: {
          ...session?.user,
          name: oldData.name,
          email: oldData.email,
          image: oldData.image,
        },
      });

      toast({
        variant: "destructive",
        title: "Error",
        description: error.response?.data?.error || "Failed to update profile",
      });
    } finally {
      setIsUpdating(false);
    }
  };

  // Handle password change
  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validatePasswordForm()) return;

    setIsChangingPassword(true);
    try {
      await axios.post("/api/user/change-password", {
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword,
      });

      toast({
        title: "Success!",
        description: "Password changed successfully",
      });

      setPasswordData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
      setPasswordStrength(0);
    } catch (error: any) {
      console.error("Password change error:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: error.response?.data?.error || "Failed to change password",
      });
    } finally {
      setIsChangingPassword(false);
    }
  };

  // Handle image upload with optimistic UI
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith("image/")) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Please select an image file",
      });
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Image size must be less than 5MB",
      });
      return;
    }

    setIsUploadingImage(true);

    // Create preview URL for optimistic update
    const previewUrl = URL.createObjectURL(file);
    const oldImage = profileData.image;

    // Optimistically update UI
    setProfileData((prev) => ({ ...prev, image: previewUrl }));

    try {
      const formData = new FormData();
      formData.append("file", file);

      const response = await axios.post("/api/user/upload-image", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      // Update with actual server URL
      const actualImageUrl = response.data.imageUrl;
      setProfileData((prev) => ({ ...prev, image: actualImageUrl }));

      // Update session
      await update({
        ...session,
        user: {
          ...session?.user,
          image: actualImageUrl,
        },
      });

      // Clean up preview URL
      URL.revokeObjectURL(previewUrl);

      toast({
        title: "Success!",
        description: "Profile image uploaded successfully",
      });
    } catch (error: any) {
      console.error("Image upload error:", error);

      // Rollback on error
      setProfileData((prev) => ({ ...prev, image: oldImage }));
      URL.revokeObjectURL(previewUrl);

      toast({
        variant: "destructive",
        title: "Error",
        description: error.response?.data?.error || "Failed to upload image",
      });
    } finally {
      setIsUploadingImage(false);
    }
  };

  if (status === "loading") {
    return (
      <div
        className="flex items-center justify-center min-h-screen"
        style={{ backgroundColor: themeColors.bg2 }}
      >
        <Loader2
          className="w-8 h-8 animate-spin"
          style={{ color: themeColors.primary }}
        />
      </div>
    );
  }

  if (!session) {
    return null;
  }

  return (
    <div
      className="min-h-screen py-8 px-4 sm:px-6 lg:px-8 transition-colors"
      style={{ backgroundColor: themeColors.bg2 }}
    >
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1
            className="text-3xl md:text-4xl font-bold mb-2 transition-colors"
            style={{ color: themeColors.text1 }}
          >
            My Profile
          </h1>
          <p
            className="text-base transition-colors"
            style={{ color: themeColors.text3 }}
          >
            Manage your account settings and preferences
          </p>
        </div>

        {/* Profile Card */}
        <div
          className="border rounded-2xl p-6 md:p-8 shadow-lg mb-6 transition-colors"
          style={{
            backgroundColor: themeColors.cardBg,
            borderColor: themeColors.border,
          }}
        >
          {/* Avatar Section */}
          <div className="flex flex-col items-center mb-8">
            <div className="relative">
              <Avatar className="w-24 h-24 md:w-32 md:h-32">
                <AvatarImage src={profileData.image} />
                <AvatarFallback
                  className="text-3xl font-bold text-white"
                  style={{ backgroundColor: themeColors.primary }}
                >
                  {profileData.name?.[0]?.toUpperCase() || "U"}
                </AvatarFallback>
              </Avatar>
              {isUploadingImage && (
                <div
                  className="absolute inset-0 rounded-full flex items-center justify-center"
                  style={{ backgroundColor: "rgba(0,0,0,0.6)" }}
                >
                  <Loader2 className="w-8 h-8 animate-spin text-white" />
                </div>
              )}
              <label
                className={`absolute bottom-0 right-0 p-2 rounded-full transition-all ${
                  isUploadingImage
                    ? "cursor-not-allowed opacity-50"
                    : "cursor-pointer hover:opacity-90"
                }`}
                style={{ backgroundColor: themeColors.primary }}
              >
                {isUploadingImage ? (
                  <Loader2 className="w-4 h-4 md:w-5 md:h-5 text-white animate-spin" />
                ) : (
                  <Camera className="w-4 h-4 md:w-5 md:h-5 text-white" />
                )}
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  disabled={isUploadingImage}
                  className="hidden"
                />
              </label>
            </div>
            <h2
              className="mt-4 text-xl md:text-2xl font-bold transition-colors"
              style={{ color: themeColors.text1 }}
            >
              {profileData.name}
            </h2>
            <p
              className="text-sm transition-colors"
              style={{ color: themeColors.text3 }}
            >
              @{profileData.username}
            </p>
          </div>

          {/* Tabs */}
          <div
            className="flex gap-4 mb-6 border-b"
            style={{ borderColor: themeColors.border }}
          >
            <button
              onClick={() => setActiveTab("profile")}
              className="pb-3 px-4 font-semibold transition-all"
              style={{
                color:
                  activeTab === "profile"
                    ? themeColors.primary
                    : themeColors.text3,
                borderBottom:
                  activeTab === "profile"
                    ? `2px solid ${themeColors.primary}`
                    : "none",
              }}
            >
              <User className="w-4 h-4 inline-block mr-2" />
              Profile Info
            </button>
            <button
              onClick={() => setActiveTab("password")}
              className="pb-3 px-4 font-semibold transition-all"
              style={{
                color:
                  activeTab === "password"
                    ? themeColors.primary
                    : themeColors.text3,
                borderBottom:
                  activeTab === "password"
                    ? `2px solid ${themeColors.primary}`
                    : "none",
              }}
            >
              <Lock className="w-4 h-4 inline-block mr-2" />
              Security
            </button>
          </div>

          {/* Profile Info Tab */}
          {activeTab === "profile" && (
            <form onSubmit={handleProfileUpdate} className="space-y-6">
              <div>
                <label
                  className="text-sm font-semibold mb-2 flex items-center gap-2 transition-colors"
                  style={{ color: themeColors.text2 }}
                >
                  <User
                    className="w-4 h-4"
                    style={{ color: themeColors.primary }}
                  />
                  Full Name
                </label>
                <Input
                  placeholder="John Doe"
                  value={profileData.name}
                  onChange={(e) => {
                    setProfileData((prev) => ({
                      ...prev,
                      name: e.target.value,
                    }));
                    if (profileErrors.name) {
                      setProfileErrors((prev) => {
                        const newErrors = { ...prev };
                        delete newErrors.name;
                        return newErrors;
                      });
                    }
                  }}
                  className="h-11 transition-colors"
                  style={{
                    backgroundColor: themeColors.inputBg,
                    borderColor: profileErrors.name
                      ? "#EF4444"
                      : themeColors.border,
                    color: themeColors.text1,
                  }}
                />
                {profileErrors.name && (
                  <p className="text-red-500 text-xs mt-1.5 flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" /> {profileErrors.name}
                  </p>
                )}
              </div>

              <div>
                <label
                  className="text-sm font-semibold mb-2 flex items-center gap-2 transition-colors"
                  style={{ color: themeColors.text2 }}
                >
                  <Mail
                    className="w-4 h-4"
                    style={{ color: themeColors.primary }}
                  />
                  Email Address
                </label>
                <Input
                  type="email"
                  placeholder="you@example.com"
                  value={profileData.email}
                  onChange={(e) => {
                    setProfileData((prev) => ({
                      ...prev,
                      email: e.target.value,
                    }));
                    if (profileErrors.email) {
                      setProfileErrors((prev) => {
                        const newErrors = { ...prev };
                        delete newErrors.email;
                        return newErrors;
                      });
                    }
                  }}
                  className="h-11 transition-colors"
                  style={{
                    backgroundColor: themeColors.inputBg,
                    borderColor: profileErrors.email
                      ? "#EF4444"
                      : themeColors.border,
                    color: themeColors.text1,
                  }}
                />
                {profileErrors.email && (
                  <p className="text-red-500 text-xs mt-1.5 flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" /> {profileErrors.email}
                  </p>
                )}
              </div>

              <div>
                <label
                  className="text-sm font-semibold mb-2 flex items-center gap-2 transition-colors"
                  style={{ color: themeColors.text2 }}
                >
                  <Shield
                    className="w-4 h-4"
                    style={{ color: themeColors.primary }}
                  />
                  Username
                </label>
                <Input
                  value={profileData.username}
                  disabled
                  className="h-11 transition-colors cursor-not-allowed opacity-60"
                  style={{
                    backgroundColor: themeColors.inputBg,
                    borderColor: themeColors.border,
                    color: themeColors.text3,
                  }}
                />
                <p
                  className="text-xs mt-1.5 flex items-center gap-1 transition-colors"
                  style={{ color: themeColors.text3 }}
                >
                  <AlertCircle className="w-3 h-3" /> Username cannot be changed
                </p>
              </div>

              <Button
                type="submit"
                disabled={isUpdating}
                className="w-full h-11 text-white font-semibold rounded-xl transition-all hover:opacity-90 disabled:opacity-50"
                style={{ backgroundColor: themeColors.primary }}
              >
                {isUpdating ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Updating Profile...
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4 mr-2" />
                    Save Changes
                  </>
                )}
              </Button>
            </form>
          )}

          {/* Password Tab */}
          {activeTab === "password" && (
            <form onSubmit={handlePasswordSubmit} className="space-y-6">
              <div>
                <label
                  className="text-sm font-semibold mb-2 flex items-center gap-2 transition-colors"
                  style={{ color: themeColors.text2 }}
                >
                  <Lock
                    className="w-4 h-4"
                    style={{ color: themeColors.primary }}
                  />
                  Current Password
                </label>
                <div className="relative">
                  <Input
                    type={showCurrentPassword ? "text" : "password"}
                    placeholder="Enter current password"
                    value={passwordData.currentPassword}
                    onChange={(e) =>
                      handlePasswordInputChange(
                        "currentPassword",
                        e.target.value
                      )
                    }
                    className="h-11 pr-10 transition-colors"
                    style={{
                      backgroundColor: themeColors.inputBg,
                      borderColor: passwordErrors.currentPassword
                        ? "#EF4444"
                        : themeColors.border,
                      color: themeColors.text1,
                    }}
                  />
                  <button
                    type="button"
                    onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2"
                    style={{ color: themeColors.text3 }}
                  >
                    {showCurrentPassword ? (
                      <EyeOff className="w-4 h-4" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                  </button>
                </div>
                {passwordErrors.currentPassword && (
                  <p className="text-red-500 text-xs mt-1.5 flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" />{" "}
                    {passwordErrors.currentPassword}
                  </p>
                )}
              </div>

              <div>
                <label
                  className="text-sm font-semibold mb-2 flex items-center gap-2 transition-colors"
                  style={{ color: themeColors.text2 }}
                >
                  <Lock
                    className="w-4 h-4"
                    style={{ color: themeColors.primary }}
                  />
                  New Password
                </label>
                <div className="relative">
                  <Input
                    type={showNewPassword ? "text" : "password"}
                    placeholder="Enter new password"
                    value={passwordData.newPassword}
                    onChange={(e) =>
                      handlePasswordInputChange("newPassword", e.target.value)
                    }
                    className="h-11 pr-10 transition-colors"
                    style={{
                      backgroundColor: themeColors.inputBg,
                      borderColor: passwordErrors.newPassword
                        ? "#EF4444"
                        : themeColors.border,
                      color: themeColors.text1,
                    }}
                  />
                  <button
                    type="button"
                    onClick={() => setShowNewPassword(!showNewPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2"
                    style={{ color: themeColors.text3 }}
                  >
                    {showNewPassword ? (
                      <EyeOff className="w-4 h-4" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                  </button>
                </div>
                {passwordErrors.newPassword && (
                  <p className="text-red-500 text-xs mt-1.5 flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" />{" "}
                    {passwordErrors.newPassword}
                  </p>
                )}
                {passwordData.newPassword && (
                  <div className="mt-2">
                    <div className="flex items-center justify-between mb-1">
                      <span
                        className="text-xs"
                        style={{ color: themeColors.text3 }}
                      >
                        Password Strength
                      </span>
                      <span
                        className="text-xs font-semibold"
                        style={{ color: themeColors.text2 }}
                      >
                        {passwordStrength < 40
                          ? "Weak"
                          : passwordStrength < 70
                          ? "Medium"
                          : "Strong"}
                      </span>
                    </div>
                    <div
                      className="w-full h-2 rounded-full"
                      style={{ backgroundColor: themeColors.border }}
                    >
                      <div
                        className="h-full rounded-full transition-all"
                        style={{
                          width: `${passwordStrength}%`,
                          backgroundColor:
                            passwordStrength < 40
                              ? "#EF4444"
                              : passwordStrength < 70
                              ? "#F59E0B"
                              : "#22C55E",
                        }}
                      />
                    </div>
                  </div>
                )}
              </div>

              <div>
                <label
                  className="text-sm font-semibold mb-2 flex items-center gap-2 transition-colors"
                  style={{ color: themeColors.text2 }}
                >
                  <CheckCircle2
                    className="w-4 h-4"
                    style={{ color: themeColors.primary }}
                  />
                  Confirm New Password
                </label>
                <div className="relative">
                  <Input
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="Confirm new password"
                    value={passwordData.confirmPassword}
                    onChange={(e) =>
                      handlePasswordInputChange(
                        "confirmPassword",
                        e.target.value
                      )
                    }
                    className="h-11 pr-10 transition-colors"
                    style={{
                      backgroundColor: themeColors.inputBg,
                      borderColor: passwordErrors.confirmPassword
                        ? "#EF4444"
                        : themeColors.border,
                      color: themeColors.text1,
                    }}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2"
                    style={{ color: themeColors.text3 }}
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="w-4 h-4" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                  </button>
                </div>
                {passwordErrors.confirmPassword && (
                  <p className="text-red-500 text-xs mt-1.5 flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" />{" "}
                    {passwordErrors.confirmPassword}
                  </p>
                )}
              </div>

              <Button
                type="submit"
                disabled={isChangingPassword}
                className="w-full h-11 text-white font-semibold rounded-xl transition-all hover:opacity-90 disabled:opacity-50"
                style={{ backgroundColor: themeColors.primary }}
              >
                {isChangingPassword ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Changing Password...
                  </>
                ) : (
                  <>
                    <Lock className="w-4 h-4 mr-2" />
                    Change Password
                  </>
                )}
              </Button>
            </form>
          )}
        </div>

        {/* Info Box */}
        <div
          className="border rounded-xl p-4 transition-colors"
          style={{
            backgroundColor: themeColors.cardBg,
            borderColor: themeColors.border,
          }}
        >
          <p
            className="text-sm transition-colors"
            style={{ color: themeColors.text3 }}
          >
            <strong style={{ color: themeColors.text2 }}>Security Note:</strong>{" "}
            Your password should be at least 8 characters long and include a mix
            of uppercase, lowercase, numbers, and special characters for better
            security.
          </p>
        </div>
      </div>
    </div>
  );
}
