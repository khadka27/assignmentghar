"use client";

import type React from "react";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "@/components/ui/toaster";
import { SessionProvider } from "next-auth/react";
import { SocketProvider } from "@/contexts/socket-context";
import { usePathname } from "next/navigation";

const geistSans = Geist({ subsets: ["latin"] });
const geistMono = Geist_Mono({ subsets: ["latin"] });

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  // Hide navbar and footer on auth pages
  const isAuthPage =
    pathname === "/login" ||
    pathname === "/register" ||
    pathname === "/recover";
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              try {
                if (localStorage.theme === 'dark' || (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
                  document.documentElement.classList.add('dark')
                } else {
                  document.documentElement.classList.remove('dark')
                }
              } catch (e) {}
            `,
          }}
        />
      </head>
      <body
        className={`${geistSans.className} bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors`}
      >
        <SessionProvider>
          <SocketProvider>
            <ThemeProvider>
              <a href="#main-content" className="sr-only focus:not-sr-only">
                Skip to main content
              </a>
              {!isAuthPage && <Navbar />}
              <main
                id="main-content"
                className={isAuthPage ? "" : "min-h-screen"}
              >
                {children}
              </main>
              {!isAuthPage && <Footer />}
              <Toaster />
            </ThemeProvider>
          </SocketProvider>
        </SessionProvider>
      </body>
    </html>
  );
}
