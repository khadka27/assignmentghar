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
  Shield,
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import axios from "axios";

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const { theme, toggleTheme } = useTheme();
  const { data: session, status } = useSession();
  const router = useRouter();
  const { toast } = useToast();

  const isAuthenticated = status === "authenticated";
  const userRole = session?.user?.role;
  const isAdmin = userRole === "ADMIN";
  const isExpert = userRole === "EXPERT";
  const isStudent = userRole === "STUDENT";

  // Guest links (not logged in)
  const guestLinks = [
    { href: "/", label: "Home" },
    { href: "/#services", label: "Services" },
    { href: "/testimonials", label: "Testimonials" },
    { href: "/contact", label: "Contact" },
  ];

  // Student links
  const studentLinks = [
    { href: "/", label: "Home" },
    { href: "/submit", label: "Submit Assignment" },
    { href: "/testimonials", label: "Testimonials" },
    { href: "/contact", label: "Contact" },
  ];

  // Admin links
  const adminLinks = [
    { href: "/", label: "Home" },
    { href: "/admin", label: "Dashboard" },
    { href: "/testimonials", label: "Testimonials" },
    { href: "/contact", label: "Contact" },
  ];

  // Expert links
  const expertLinks = [
    { href: "/", label: "Home" },
    { href: "/expert", label: "Dashboard" },
    { href: "/testimonials", label: "Testimonials" },
    { href: "/contact", label: "Contact" },
  ];

  // Determine which links to show based on role
  const links = isAdmin
    ? adminLinks
    : isExpert
    ? expertLinks
    : isStudent
    ? studentLinks
    : guestLinks;

  // Handle logout
  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      // Call logout API
      await axios.post("/api/auth/logout");

      // Sign out with NextAuth
      await signOut({ redirect: false });

      toast({
        title: "Logged out successfully! 👋",
        description: "See you again soon!",
      });

      // Redirect to home
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
    <nav className="sticky top-0 z-50 bg-white/95 dark:bg-gray-900/95 backdrop-blur-lg border-b border-gray-200/50 dark:border-gray-700/50 transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link
            href="/"
            className="flex items-center gap-2 transform transition-transform duration-300 hover:scale-105"
          >
            <Image
              src="/Images/nav_logo.png"
              alt="AssignmentGhar Logo"
              width={180}
              height={50}
              priority
              className="h-10 w-auto"
            />
          </Link>

          {/* Desktop Links */}
          <div className="hidden md:flex items-center gap-8">
            {links.map((link, index) => (
              <Link
                key={link.href}
                href={link.href}
                className={`text-sm font-medium transition-colors relative group ${
                  index === 0
                    ? "text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300"
                    : "text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400"
                }`}
              >
                {link.label}
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-blue-500 to-purple-500 group-hover:w-full transition-all duration-300"></span>
              </Link>
            ))}
          </div>

          {/* Right Actions */}
          <div className="flex items-center gap-3">
            {/* Authenticated User Actions */}
            {isAuthenticated ? (
              <>
                {/* User Profile Dropdown - Your Blue/Purple Theme */}
                <div className="relative">
                  <button
                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                    className="flex items-center gap-2 focus:outline-none"
                  >
                    <Avatar className="h-10 w-10 ring-2 ring-blue-500/30 hover:ring-blue-500/60 dark:ring-purple-500/30 dark:hover:ring-purple-500/60 transition-all">
                      <AvatarImage
                        src={session?.user?.image || undefined}
                        alt={session?.user?.name || "User"}
                      />
                      <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-500 text-white text-sm font-semibold">
                        {getUserInitials()}
                      </AvatarFallback>
                    </Avatar>
                  </button>

                  {/* Dropdown Menu - Flowbite Style with Your Colors */}
                  {isDropdownOpen && (
                    <>
                      {/* Backdrop */}
                      <div
                        className="fixed inset-0 z-30"
                        onClick={() => setIsDropdownOpen(false)}
                      />

                      {/* Dropdown Content */}
                      <div className="absolute right-0 mt-3 w-56 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-xl z-40 overflow-hidden">
                        {/* User Info Header */}
                        <div className="px-4 py-3 border-b border-gray-200 dark:border-gray-700 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-950/20 dark:to-purple-950/20">
                          <p className="text-sm font-semibold text-gray-900 dark:text-white">
                            {session?.user?.name}
                          </p>
                          <p className="text-xs text-gray-600 dark:text-gray-400 truncate">
                            {session?.user?.email}
                          </p>
                        </div>

                        {/* Menu Items */}
                        <div className="py-1">
                          {/* Dashboard Link for Admin/Expert */}
                          {(isAdmin || isExpert) && (
                            <Link
                              href={isAdmin ? "/admin" : "/expert"}
                              onClick={() => setIsDropdownOpen(false)}
                              className="flex items-center px-4 py-2.5 text-sm text-gray-700 dark:text-gray-200 hover:bg-blue-50 dark:hover:bg-blue-900/20 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                            >
                              <LayoutDashboard className="mr-3 h-4 w-4" />
                              Dashboard
                            </Link>
                          )}

                          <Link
                            href="/settings"
                            onClick={() => setIsDropdownOpen(false)}
                            className="flex items-center px-4 py-2.5 text-sm text-gray-700 dark:text-gray-200 hover:bg-blue-50 dark:hover:bg-blue-900/20 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                          >
                            <Settings className="mr-3 h-4 w-4" />
                            Settings
                          </Link>

                          {isExpert && (
                            <Link
                              href="/earnings"
                              onClick={() => setIsDropdownOpen(false)}
                              className="flex items-center px-4 py-2.5 text-sm text-gray-700 dark:text-gray-200 hover:bg-blue-50 dark:hover:bg-blue-900/20 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                            >
                              <span className="mr-3">💰</span>
                              Earnings
                            </Link>
                          )}
                        </div>

                        {/* Logout */}
                        <div className="border-t border-gray-200 dark:border-gray-700">
                          <button
                            onClick={() => {
                              setIsDropdownOpen(false);
                              handleLogout();
                            }}
                            disabled={isLoggingOut}
                            className="w-full flex items-center px-4 py-2.5 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors disabled:opacity-50"
                          >
                            <LogOut className="mr-3 h-4 w-4" />
                            {isLoggingOut ? "Signing out..." : "Sign out"}
                          </button>
                        </div>
                      </div>
                    </>
                  )}
                </div>
              </>
            ) : (
              // Guest Actions (Not Logged In)
              <>
                <Link
                  href="/login"
                  className="hidden sm:inline-block px-5 py-2 text-sm text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                >
                  Login
                </Link>

                <Link
                  href="/register"
                  className="hidden sm:inline-block px-5 py-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white text-sm rounded-lg transition-all shadow-md hover:shadow-lg"
                >
                  Get Started
                </Link>
              </>
            )}

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="md:hidden p-2 text-gray-700 dark:text-gray-300 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors"
              aria-expanded={isOpen}
              aria-controls="mobile-menu"
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
          <div
            id="mobile-menu"
            className="md:hidden pb-4 pt-2 space-y-1 border-t border-gray-200 dark:border-gray-700"
          >
            {/* Navigation Links */}
            {links.map((link, index) => (
              <Link
                key={link.href}
                href={link.href}
                className={`block px-4 py-2.5 text-sm transition-colors ${
                  index === 0
                    ? "text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20"
                    : "text-gray-700 dark:text-gray-300 hover:bg-blue-50 dark:hover:bg-blue-900/20"
                }`}
                onClick={() => setIsOpen(false)}
              >
                {link.label}
              </Link>
            ))}

            {/* Authenticated Mobile Menu Items */}
            {isAuthenticated ? (
              <>
                <div className="border-t border-gray-200 dark:border-gray-700 pt-2 mt-2">
                  {/* User Info */}
                  <div className="px-4 py-3 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-950/20 dark:to-purple-950/20">
                    <div className="flex items-center gap-3">
                      <Avatar className="h-10 w-10 ring-2 ring-blue-500/30 dark:ring-purple-500/30">
                        <AvatarImage
                          src={session?.user?.image || undefined}
                          alt={session?.user?.name || "User"}
                        />
                        <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-500 text-white font-semibold text-sm">
                          {getUserInitials()}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-900 dark:text-white">
                          {session?.user?.name}
                        </p>
                        <p className="text-xs text-gray-600 dark:text-gray-400">
                          {session?.user?.email}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Dashboard for Admin/Expert */}
                  {(isAdmin || isExpert) && (
                    <Link
                      href={isAdmin ? "/admin" : "/expert"}
                      className="flex items-center gap-2 px-4 py-2.5 text-sm text-gray-700 dark:text-gray-200 hover:bg-blue-50 dark:hover:bg-blue-900/20 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                      onClick={() => setIsOpen(false)}
                    >
                      <LayoutDashboard className="w-4 h-4" />
                      <span>Dashboard</span>
                    </Link>
                  )}

                  {/* Settings */}
                  <Link
                    href="/settings"
                    className="flex items-center gap-2 px-4 py-2.5 text-sm text-gray-700 dark:text-gray-200 hover:bg-blue-50 dark:hover:bg-blue-900/20 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                    onClick={() => setIsOpen(false)}
                  >
                    <Settings className="w-4 h-4" />
                    <span>Settings</span>
                  </Link>

                  {/* Logout */}
                  <button
                    onClick={() => {
                      setIsOpen(false);
                      handleLogout();
                    }}
                    disabled={isLoggingOut}
                    className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors disabled:opacity-50"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>{isLoggingOut ? "Signing out..." : "Sign out"}</span>
                  </button>
                </div>
              </>
            ) : (
              // Guest Mobile Menu Items
              <>
                <div className="border-t border-gray-200 dark:border-gray-700 pt-2 mt-2 space-y-1">
                  <Link
                    href="/login"
                    className="block px-4 py-2.5 text-sm text-gray-700 dark:text-gray-300 hover:bg-blue-50 dark:hover:bg-blue-900/20 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                    onClick={() => setIsOpen(false)}
                  >
                    Login
                  </Link>

                  <Link
                    href="/register"
                    className="block px-4 py-2.5 mx-4 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white text-sm text-center rounded-lg transition-all shadow-md"
                    onClick={() => setIsOpen(false)}
                  >
                    Get Started
                  </Link>
                </div>
              </>
            )}
          </div>
        )}
      </div>
    </nav>
  );
}
