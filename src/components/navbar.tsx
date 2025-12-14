"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useTheme } from "@/hooks/use-theme";
import {
  Menu,
  X,
  Moon,
  Sun,
  User,
  LogOut,
  Settings,
  LayoutDashboard,
  MessageSquare,
  FileText,
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import axios from "axios";

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const { theme, toggleTheme, mounted } = useTheme();
  const { data: session, status } = useSession();
  const router = useRouter();
  const { toast } = useToast();

  const isAuthenticated = status === "authenticated";
  const userRole = session?.user?.role;
  const isAdmin = userRole === "ADMIN";

  // Guest links (not logged in)
  const guestLinks = [
    { href: "/", label: "Home" },
    { href: "/#services", label: "Services" },
    { href: "/contact", label: "Contact" },
    { href: "/testimonials", label: "Testimonials" },
    { href: "/about", label: "About Us" },
  ];

  // Authenticated user links
  const authLinks = [
    { href: "/", label: "Home" },
    { href: "/submit", label: "Submit" },
    { href: "/my-assignments", label: "My Assignments" },
    { href: "/chat", label: "Chat" },
    { href: "/contact", label: "Support" },
    { href: "/about", label: "About Us" },
  ];

  const links = isAuthenticated ? authLinks : guestLinks;

  // Handle logout
  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      await axios.post("/api/auth/logout");
      await signOut({ redirect: false });
      toast({
        title: "Logged out successfully",
        description: "See you again soon!",
      });
      router.push("/");
      router.refresh();
    } catch (error) {
      console.error("Logout error:", error);
      toast({
        title: "Logout failed",
        description: "Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoggingOut(false);
    }
  };

  // Get user initials for avatar
  const getUserInitials = () => {
    if (!session?.user?.name) return "U";
    const names = session.user.name.split(" ");
    if (names.length >= 2) {
      return `${names[0][0]}${names[1][0]}`.toUpperCase();
    }
    return names[0][0].toUpperCase();
  };

  return (
    <nav className="sticky top-0 z-50 bg-white/80 dark:bg-[#0F172A]/80 backdrop-blur-xl border-b border-[#E0EDFD] dark:border-[#475569] shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link
            href="/"
            className="flex items-center transition-transform hover:scale-105"
          >
            <Image
              src="/images/nav_logo.png"
              alt="AssignmentGhar"
              width={160}
              height={40}
              priority
              className="h-9 w-auto dark:hidden"
            />
            <Image
              src="/images/darklogo.png"
              alt="AssignmentGhar"
              width={160}
              height={40}
              priority
              className="h-9 w-auto hidden dark:block"
            />
          </Link>

          {/* Desktop Links */}
          <div className="hidden md:flex items-center gap-1">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-sm font-semibold text-[#284366] hover:text-[#0E52AC] dark:text-[#CBD5E1] dark:hover:text-[#60A5FA] px-3 py-2 rounded-lg hover:bg-[#F0F7FF] dark:hover:bg-[#1E293B] transition-all"
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Right Actions */}
          <div className="flex items-center gap-3">
            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="p-2 text-[#284366] hover:text-[#0E52AC] dark:text-[#CBD5E1] dark:hover:text-[#60A5FA] hover:bg-[#F0F7FF] dark:hover:bg-[#1E293B] rounded-lg transition-all hover:scale-110"
              aria-label="Toggle theme"
            >
              {mounted && theme === "dark" && <Sun className="w-5 h-5" />}
              {mounted && theme === "light" && <Moon className="w-5 h-5" />}
              {!mounted && <div className="w-5 h-5" />}
            </button>

            {/* Authenticated User */}
            {isAuthenticated ? (
              <div className="relative">
                <button
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  className="flex items-center focus:outline-none"
                >
                  <Avatar className="h-9 w-9 border-2 border-[#E0EDFD] dark:border-[#475569] hover:border-[#0E52AC] dark:hover:border-[#60A5FA] transition-all hover:scale-110 shadow-md hover:shadow-lg">
                    <AvatarImage
                      src={session?.user?.image || undefined}
                      alt={session?.user?.name || "User"}
                    />
                    <AvatarFallback className="bg-gradient-to-br from-[#0E52AC] to-[#60A5FA] text-white text-sm font-semibold">
                      {getUserInitials()}
                    </AvatarFallback>
                  </Avatar>
                </button>

                {/* Dropdown Menu */}
                {isDropdownOpen && (
                  <>
                    <div
                      className="fixed inset-0 z-30"
                      onClick={() => setIsDropdownOpen(false)}
                    />

                    <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-[#1E293B] border border-[#E0EDFD] dark:border-[#475569] rounded-xl shadow-2xl z-40">
                      {/* User Info */}
                      <div className="px-4 py-3 border-b border-[#E0EDFD] dark:border-[#475569] bg-gradient-to-br from-[#F0F7FF] to-white dark:from-[#0F172A] dark:to-[#1E293B] rounded-t-xl">
                        <p className="text-sm font-semibold text-[#111E2F] dark:text-white truncate">
                          {session?.user?.name}
                        </p>
                        <p className="text-xs text-[#64748B] dark:text-[#94A3B8] truncate">
                          {session?.user?.email}
                        </p>
                      </div>

                      {/* Menu Items */}
                      <div className="py-1">
                        <Link
                          href="/profile"
                          onClick={() => setIsDropdownOpen(false)}
                          className="flex items-center px-4 py-2.5 text-sm font-medium text-[#284366] dark:text-[#CBD5E1] hover:bg-[#F0F7FF] dark:hover:bg-[#0F172A] hover:text-[#0E52AC] dark:hover:text-[#60A5FA] transition-all"
                        >
                          <User className="mr-3 h-4 w-4" />
                          Profile
                        </Link>

                        <Link
                          href="/settings"
                          onClick={() => setIsDropdownOpen(false)}
                          className="flex items-center px-4 py-2.5 text-sm font-medium text-[#284366] dark:text-[#CBD5E1] hover:bg-[#F0F7FF] dark:hover:bg-[#0F172A] hover:text-[#0E52AC] dark:hover:text-[#60A5FA] transition-all"
                        >
                          <Settings className="mr-3 h-4 w-4" />
                          Settings
                        </Link>

                        {isAdmin && (
                          <Link
                            href="/admin"
                            onClick={() => setIsDropdownOpen(false)}
                            className="flex items-center px-4 py-2.5 text-sm font-medium text-[#284366] dark:text-[#CBD5E1] hover:bg-[#F0F7FF] dark:hover:bg-[#0F172A] hover:text-[#0E52AC] dark:hover:text-[#60A5FA] transition-all"
                          >
                            <LayoutDashboard className="mr-3 h-4 w-4" />
                            Dashboard
                          </Link>
                        )}
                      </div>

                      {/* Logout */}
                      <div className="border-t border-[#E0EDFD] dark:border-[#475569] py-1">
                        <button
                          onClick={() => {
                            setIsDropdownOpen(false);
                            handleLogout();
                          }}
                          disabled={isLoggingOut}
                          className="w-full flex items-center px-4 py-2.5 text-sm font-medium text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-all disabled:opacity-50 rounded-b-xl"
                        >
                          <LogOut className="mr-3 h-4 w-4" />
                          {isLoggingOut ? "Signing out..." : "Sign out"}
                        </button>
                      </div>
                    </div>
                  </>
                )}
              </div>
            ) : (
              // Guest Actions
              <>
                <Link
                  href="/login"
                  className="hidden sm:inline-block px-4 py-2 text-sm font-semibold text-[#284366] hover:text-[#0E52AC] dark:text-[#CBD5E1] dark:hover:text-[#60A5FA] hover:bg-[#F0F7FF] dark:hover:bg-[#1E293B] rounded-lg transition-all"
                >
                  Login
                </Link>

                <Link
                  href="/register"
                  className="hidden sm:inline-block px-5 py-2 bg-gradient-to-r from-[#0E52AC] to-[#60A5FA] hover:shadow-lg text-white text-sm font-semibold rounded-lg transition-all hover:scale-105"
                >
                  Register
                </Link>
              </>
            )}

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="md:hidden p-2 text-[#284366] dark:text-[#CBD5E1] hover:bg-[#F0F7FF] dark:hover:bg-[#1E293B] rounded-lg transition-all hover:scale-110"
              aria-label="Toggle menu"
            >
              {isOpen ? (
                <X className="w-5 h-5" />
              ) : (
                <Menu className="w-5 h-5" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <div className="md:hidden border-t border-[#E0EDFD] dark:border-[#475569] py-4 space-y-1 bg-gradient-to-b from-[#F8FBFF] to-white dark:from-[#0F172A] dark:to-[#1E293B]">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="block px-4 py-2.5 text-sm font-semibold text-[#284366] hover:text-[#0E52AC] dark:text-[#CBD5E1] dark:hover:text-[#60A5FA] hover:bg-white dark:hover:bg-[#0F172A] rounded-lg transition-all mx-2"
                onClick={() => setIsOpen(false)}
              >
                {link.label}
              </Link>
            ))}

            {isAuthenticated ? (
              <div className="border-t border-[#E0EDFD] dark:border-[#475569] pt-4 mt-4 space-y-1">
                <div className="px-4 py-2 mb-2">
                  <div className="flex items-center gap-3">
                    <Avatar className="h-10 w-10 border-2 border-[#E0EDFD] dark:border-[#475569] shadow-md">
                      <AvatarImage
                        src={session?.user?.image || undefined}
                        alt={session?.user?.name || "User"}
                      />
                      <AvatarFallback className="bg-gradient-to-br from-[#0E52AC] to-[#60A5FA] text-white font-semibold">
                        {getUserInitials()}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="text-sm font-semibold text-[#111E2F] dark:text-white">
                        {session?.user?.name}
                      </p>
                      <p className="text-xs text-[#64748B] dark:text-[#94A3B8]">
                        {session?.user?.email}
                      </p>
                    </div>
                  </div>
                </div>

                <Link
                  href="/profile"
                  className="flex items-center gap-2 px-4 py-2.5 text-sm font-medium text-[#284366] dark:text-[#CBD5E1] hover:bg-white dark:hover:bg-[#0F172A] hover:text-[#0E52AC] dark:hover:text-[#60A5FA] rounded-lg transition-all mx-2"
                  onClick={() => setIsOpen(false)}
                >
                  <User className="w-4 h-4" />
                  Profile
                </Link>

                <Link
                  href="/settings"
                  className="flex items-center gap-2 px-4 py-2.5 text-sm font-medium text-[#284366] dark:text-[#CBD5E1] hover:bg-white dark:hover:bg-[#0F172A] hover:text-[#0E52AC] dark:hover:text-[#60A5FA] rounded-lg transition-all mx-2"
                  onClick={() => setIsOpen(false)}
                >
                  <Settings className="w-4 h-4" />
                  Settings
                </Link>

                {isAdmin && (
                  <Link
                    href="/admin"
                    className="flex items-center gap-2 px-4 py-2.5 text-sm font-medium text-[#284366] dark:text-[#CBD5E1] hover:bg-white dark:hover:bg-[#0F172A] hover:text-[#0E52AC] dark:hover:text-[#60A5FA] rounded-lg transition-all mx-2"
                    onClick={() => setIsOpen(false)}
                  >
                    <LayoutDashboard className="w-4 h-4" />
                    Dashboard
                  </Link>
                )}

                <button
                  onClick={() => {
                    setIsOpen(false);
                    handleLogout();
                  }}
                  disabled={isLoggingOut}
                  className="w-full flex items-center gap-2 px-4 py-2.5 text-sm font-medium text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-all disabled:opacity-50 mx-2"
                >
                  <LogOut className="w-4 h-4" />
                  {isLoggingOut ? "Signing out..." : "Sign out"}
                </button>
              </div>
            ) : (
              <div className="border-t border-gray-200 dark:border-gray-800 pt-4 mt-4 space-y-2">
                <Link
                  href="/login"
                  className="block px-4 py-2.5 text-sm font-semibold text-[#284366] hover:text-[#0E52AC] dark:text-[#CBD5E1] dark:hover:text-[#60A5FA] hover:bg-white dark:hover:bg-[#0F172A] rounded-lg transition-all mx-2"
                  onClick={() => setIsOpen(false)}
                >
                  Login
                </Link>

                <Link
                  href="/register"
                  className="block mx-4 py-2.5 bg-gradient-to-r from-[#0E52AC] to-[#60A5FA] hover:shadow-lg text-white text-sm font-semibold text-center rounded-lg transition-all hover:scale-[1.02]"
                  onClick={() => setIsOpen(false)}
                >
                  Register
                </Link>
              </div>
            )}
          </div>
        )}
      </div>
    </nav>
  );
}
