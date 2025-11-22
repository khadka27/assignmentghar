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
      <div className="flex items-center justify-center min-h-screen bg-[#F8FBFF] dark:bg-[#1E293B]">
        <Loader2 className="w-8 h-8 animate-spin text-[#0E52AC]" />
      </div>
    );
  }

  if (!session) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-[#F0F7FF] to-[#E8F4FF] dark:from-[#0F172A] dark:via-[#1E293B] dark:to-[#0F172A]">
      {/* Hero Section */}
      <div className="relative bg-gradient-to-r from-[#0E52AC] to-[#60A5FA] overflow-hidden">
        <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10"></div>
        <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 md:w-16 md:h-16 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center shadow-lg">
              <User className="w-7 h-7 md:w-8 md:h-8 text-white" />
            </div>
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
                My Profile
              </h1>
              <p className="text-white/90 text-sm md:text-base">
                Manage your account settings and preferences
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8 pb-16">
        {/* Profile Card */}
        <div className="border rounded-2xl p-6 md:p-8 shadow-2xl mb-6 transition-all hover:shadow-3xl bg-white dark:bg-[#1E293B] border-[#E0EDFD] dark:border-[#475569]">
          {/* Avatar Section */}
          <div className="flex flex-col items-center mb-8">
            <div className="relative group">
              <Avatar className="w-28 h-28 md:w-32 md:h-32 ring-4 ring-[#0E52AC]/20 group-hover:ring-[#0E52AC]/40 transition-all shadow-xl">
                <AvatarImage src={profileData.image} />
                <AvatarFallback className="text-3xl md:text-4xl font-bold text-white bg-gradient-to-br from-[#0E52AC] to-[#60A5FA]">
                  {profileData.name?.[0]?.toUpperCase() || "U"}
                </AvatarFallback>
              </Avatar>
              {isUploadingImage && (
                <div className="absolute inset-0 rounded-full flex items-center justify-center bg-black/60">
                  <Loader2 className="w-8 h-8 animate-spin text-white" />
                </div>
              )}
              <label
                className={`absolute bottom-0 right-0 w-10 h-10 rounded-full flex items-center justify-center transition-all bg-gradient-to-br from-[#0E52AC] to-[#60A5FA] shadow-lg hover:shadow-xl border-3 border-white dark:border-[#1E293B] ${
                  isUploadingImage
                    ? "cursor-not-allowed opacity-50"
                    : "cursor-pointer hover:scale-110"
                }`}
              >
                {isUploadingImage ? (
                  <Loader2 className="w-5 h-5 text-white animate-spin" />
                ) : (
                  <Camera className="w-5 h-5 text-white" />
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
            <h2 className="mt-4 text-xl md:text-2xl font-bold transition-colors text-[#111E2F] dark:text-white">
              {profileData.name}
            </h2>
            <p className="text-sm transition-colors text-[#64748B] dark:text-[#94A3B8] flex items-center gap-1 mt-1">
              <Mail className="w-3.5 h-3.5" />@{profileData.username}
            </p>
          </div>

          {/* Tabs */}
          <div className="flex gap-2 mb-8 p-1 bg-[#F8FBFF] dark:bg-[#0F172A] rounded-xl">
            <button
              onClick={() => setActiveTab("profile")}
              className={`flex-1 py-3 px-4 font-semibold rounded-lg transition-all ${
                activeTab === "profile"
                  ? "bg-white dark:bg-[#1E293B] text-[#0E52AC] dark:text-[#60A5FA] shadow-md"
                  : "text-[#64748B] dark:text-[#94A3B8] hover:text-[#0E52AC] dark:hover:text-[#60A5FA]"
              }`}
            >
              <User className="w-4 h-4 inline-block mr-2" />
              Profile Info
            </button>
            <button
              onClick={() => setActiveTab("password")}
              className={`flex-1 py-3 px-4 font-semibold rounded-lg transition-all ${
                activeTab === "password"
                  ? "bg-white dark:bg-[#1E293B] text-[#0E52AC] dark:text-[#60A5FA] shadow-md"
                  : "text-[#64748B] dark:text-[#94A3B8] hover:text-[#0E52AC] dark:hover:text-[#60A5FA]"
              }`}
            >
              <Lock className="w-4 h-4 inline-block mr-2" />
              Security
            </button>
          </div>

          {/* Profile Info Tab */}
          {activeTab === "profile" && (
            <form onSubmit={handleProfileUpdate} className="space-y-6">
              <div>
                <label className="text-sm font-semibold mb-2 flex items-center gap-2 transition-colors text-[#284366] dark:text-[#CBD5E1]">
                  <User className="w-4 h-4 text-[#0E52AC]" />
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
                  className={`h-12 transition-all focus:ring-2 focus:ring-[#0E52AC]/20 bg-[#F8FBFF] dark:bg-[#0F172A] text-[#111E2F] dark:text-white ${
                    profileErrors.name
                      ? "border-red-500 focus:border-red-500"
                      : "border-[#E0EDFD] dark:border-[#475569] focus:border-[#0E52AC]"
                  }`}
                />
                {profileErrors.name && (
                  <p className="text-red-500 text-xs mt-1.5 flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" /> {profileErrors.name}
                  </p>
                )}
              </div>

              <div>
                <label className="text-sm font-semibold mb-2 flex items-center gap-2 transition-colors text-[#284366] dark:text-[#CBD5E1]">
                  <Mail className="w-4 h-4 text-[#0E52AC]" />
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
                  className={`h-12 transition-all focus:ring-2 focus:ring-[#0E52AC]/20 bg-[#F8FBFF] dark:bg-[#0F172A] text-[#111E2F] dark:text-white ${
                    profileErrors.email
                      ? "border-red-500 focus:border-red-500"
                      : "border-[#E0EDFD] dark:border-[#475569] focus:border-[#0E52AC]"
                  }`}
                />
                {profileErrors.email && (
                  <p className="text-red-500 text-xs mt-1.5 flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" /> {profileErrors.email}
                  </p>
                )}
              </div>

              <div>
                <label className="text-sm font-semibold mb-2 flex items-center gap-2 transition-colors text-[#284366] dark:text-[#CBD5E1]">
                  <Shield className="w-4 h-4 text-[#0E52AC]" />
                  Username
                </label>
                <Input
                  value={profileData.username}
                  disabled
                  className="h-11 transition-colors cursor-not-allowed opacity-60 bg-[#F8FBFF] dark:bg-[#0F172A] border-[#E0EDFD] dark:border-[#475569] text-[#64748B] dark:text-[#94A3B8]"
                />
                <p className="text-xs mt-1.5 flex items-center gap-1 transition-colors text-[#64748B] dark:text-[#94A3B8]">
                  <AlertCircle className="w-3 h-3" /> Username cannot be changed
                </p>
              </div>

              <Button
                type="submit"
                disabled={isUpdating}
                className="w-full h-12 text-white font-semibold rounded-xl transition-all hover:shadow-lg hover:scale-[1.02] hover:opacity-90 disabled:opacity-50 disabled:hover:scale-100 disabled:cursor-not-allowed bg-gradient-to-r from-[#0E52AC] to-[#60A5FA] border-0 flex items-center justify-center"
              >
                {isUpdating ? (
                  <>
                    <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                    Updating Profile...
                  </>
                ) : (
                  <>
                    <Save className="w-5 h-5 mr-2" />
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
                <label className="text-sm font-semibold mb-2 flex items-center gap-2 transition-colors text-[#284366] dark:text-[#CBD5E1]">
                  <Lock className="w-4 h-4 text-[#0E52AC]" />
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
                    className={`h-12 pr-10 transition-all focus:ring-2 focus:ring-[#0E52AC]/20 bg-[#F8FBFF] dark:bg-[#0F172A] text-[#111E2F] dark:text-white ${
                      passwordErrors.currentPassword
                        ? "border-red-500 focus:border-red-500"
                        : "border-[#E0EDFD] dark:border-[#475569] focus:border-[#0E52AC]"
                    }`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-[#64748B] dark:text-[#94A3B8]"
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
                <label className="text-sm font-semibold mb-2 flex items-center gap-2 transition-colors text-[#284366] dark:text-[#CBD5E1]">
                  <Lock className="w-4 h-4 text-[#0E52AC]" />
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
                    className={`h-12 pr-10 transition-all focus:ring-2 focus:ring-[#0E52AC]/20 bg-[#F8FBFF] dark:bg-[#0F172A] text-[#111E2F] dark:text-white ${
                      passwordErrors.newPassword
                        ? "border-red-500 focus:border-red-500"
                        : "border-[#E0EDFD] dark:border-[#475569] focus:border-[#0E52AC]"
                    }`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowNewPassword(!showNewPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-[#64748B] dark:text-[#94A3B8]"
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
                  <div className="mt-3 p-3 rounded-lg bg-[#F8FBFF] dark:bg-[#0F172A] border border-[#E0EDFD] dark:border-[#475569]">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-medium text-[#64748B] dark:text-[#94A3B8]">
                        Password Strength
                      </span>
                      <span
                        className={`text-xs font-bold px-2 py-0.5 rounded ${
                          passwordStrength < 40
                            ? "bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400"
                            : passwordStrength < 70
                            ? "bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400"
                            : "bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400"
                        }`}
                      >
                        {passwordStrength < 40
                          ? "Weak"
                          : passwordStrength < 70
                          ? "Medium"
                          : "Strong"}
                      </span>
                    </div>
                    <div className="w-full h-2.5 rounded-full bg-[#E0EDFD] dark:bg-[#475569] overflow-hidden shadow-inner">
                      <div
                        className="h-full rounded-full transition-all duration-300 shadow-sm"
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
                <label className="text-sm font-semibold mb-2 flex items-center gap-2 transition-colors text-[#284366] dark:text-[#CBD5E1]">
                  <CheckCircle2 className="w-4 h-4 text-[#0E52AC]" />
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
                    className={`h-12 pr-10 transition-all focus:ring-2 focus:ring-[#0E52AC]/20 bg-[#F8FBFF] dark:bg-[#0F172A] text-[#111E2F] dark:text-white ${
                      passwordErrors.confirmPassword
                        ? "border-red-500 focus:border-red-500"
                        : "border-[#E0EDFD] dark:border-[#475569] focus:border-[#0E52AC]"
                    }`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-[#64748B] dark:text-[#94A3B8]"
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
                className="w-full h-12 text-white font-semibold rounded-xl transition-all hover:shadow-lg hover:scale-[1.02] hover:opacity-90 disabled:opacity-50 disabled:hover:scale-100 disabled:cursor-not-allowed bg-gradient-to-r from-[#0E52AC] to-[#60A5FA] border-0 flex items-center justify-center"
              >
                {isChangingPassword ? (
                  <>
                    <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                    Changing Password...
                  </>
                ) : (
                  <>
                    <Lock className="w-5 h-5 mr-2" />
                    Change Password
                  </>
                )}
              </Button>
            </form>
          )}
        </div>

        {/* Info Box */}
        <div className="border rounded-xl p-5 transition-all bg-gradient-to-br from-[#F0F7FF] to-white dark:from-[#1E293B] dark:to-[#0F172A] border-[#0E52AC]/20 dark:border-[#60A5FA]/20 shadow-md">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-lg bg-[#0E52AC]/10 dark:bg-[#60A5FA]/10 flex items-center justify-center flex-shrink-0">
              <Lock className="w-5 h-5 text-[#0E52AC] dark:text-[#60A5FA]" />
            </div>
            <div>
              <h3 className="font-semibold text-[#284366] dark:text-[#CBD5E1] mb-1">
                Security Note
              </h3>
              <p className="text-sm transition-colors text-[#64748B] dark:text-[#94A3B8] leading-relaxed">
                Your password should be at least 8 characters long and include a
                mix of uppercase, lowercase, numbers, and special characters for
                better security.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
