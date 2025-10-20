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
    <nav className="sticky top-0 z-50 bg-white/80 dark:bg-gray-900/80 backdrop-blur-lg border-b border-gray-200/50 dark:border-gray-700/50 transition-all duration-300">
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
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-blue-500 dark:hover:text-blue-400 transition-all duration-300 relative group"
              >
                {link.label}
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-blue-500 group-hover:w-full transition-all duration-300"></span>
              </Link>
            ))}
          </div>

          {/* Right Actions */}
          <div className="flex items-center gap-4">
            <button
              onClick={toggleTheme}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-xl transition-all duration-300 transform hover:scale-110 hover:rotate-12"
              aria-label="Toggle theme"
            >
              {theme === "dark" ? (
                <Sun className="w-5 h-5 text-yellow-400" />
              ) : (
                <Moon className="w-5 h-5 text-blue-500" />
              )}
            </button>

            <Link
              href="/chat"
              className="hidden sm:inline-block px-6 py-2.5 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-xl hover:from-blue-600 hover:to-purple-600 transition-all duration-300 text-sm font-semibold transform hover:scale-105 hover:shadow-lg hover:shadow-blue-500/30"
            >
              Start Chat
            </Link>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="md:hidden p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-xl transition-all duration-300"
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
            className="md:hidden pb-4 space-y-2 animate-slide-down"
          >
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-xl transition-all duration-300 transform hover:translate-x-2"
                onClick={() => setIsOpen(false)}
              >
                {link.label}
              </Link>
            ))}
            <Link
              href="/chat"
              className="block px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-xl hover:from-blue-600 hover:to-purple-600 transition-all duration-300 font-semibold text-center transform hover:scale-105"
              onClick={() => setIsOpen(false)}
            >
              Start Chat
            </Link>
          </div>
        )}
      </div>
    </nav>
  );
}
