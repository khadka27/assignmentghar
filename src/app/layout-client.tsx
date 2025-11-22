"use client";

import type React from "react";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "@/components/ui/toaster";
import { SessionProvider } from "next-auth/react";
import { SocketProvider } from "@/contexts/socket-context";
import { usePathname } from "next/navigation";

export function RootLayoutClient({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  // Hide navbar and footer on auth pages and admin pages
  const isAuthPage =
    pathname === "/login" ||
    pathname === "/register" ||
    pathname === "/recover";

  const isAdminPage = pathname?.startsWith("/admin");
  const isChatPage = pathname === "/chat";

  const showNavAndFooter = !isAuthPage && !isAdminPage;
  const showFooter = showNavAndFooter && !isChatPage;

  return (
    <SessionProvider>
      <SocketProvider>
        <ThemeProvider>
          <a href="#main-content" className="sr-only focus:not-sr-only">
            Skip to main content
          </a>
          {showNavAndFooter && <Navbar />}
          <main
            id="main-content"
            className={showNavAndFooter ? "min-h-screen" : ""}
          >
            {children}
          </main>
          {showFooter && <Footer />}
          <Toaster />
        </ThemeProvider>
      </SocketProvider>
    </SessionProvider>
  );
}
