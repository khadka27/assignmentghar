import type React from "react";
import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { RootLayoutClient } from "./layout-client";

const geistSans = Geist({ subsets: ["latin"] });
const geistMono = Geist_Mono({ subsets: ["latin"] });

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#0a0a0a" },
  ],
};

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_APP_URL || "https://assignmentghar.com"
  ),
  title: {
    default:
      "AssignmentGhar - Expert Assignment Help & Academic Writing Services",
    template: "%s | AssignmentGhar",
  },
  description:
    "Get professional assignment help from expert writers. Quality academic writing services for students. Fast delivery, plagiarism-free, 24/7 support. AssignmentGhar - Your trusted assignment partner.",
  applicationName: "AssignmentGhar",
  keywords: [
    "assignment help",
    "academic writing",
    "homework help",
    "essay writing",
    "research paper",
    "dissertation help",
    "thesis writing",
    "online tutoring",
    "student services",
    "assignment writing",
    "college assignment help",
    "university assignment help",
    "plagiarism free",
    "expert writers",
    "academic support",
  ],
  authors: [{ name: "AssignmentGhar Team", url: "https://assignmentghar.com" }],
  creator: "AssignmentGhar",
  publisher: "AssignmentGhar",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  category: "Education",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: process.env.NEXT_PUBLIC_APP_URL || "https://assignmentghar.com",
    siteName: "AssignmentGhar",
    title:
      "AssignmentGhar - Expert Assignment Help & Academic Writing Services",
    description:
      "Get professional assignment help from expert writers. Quality academic writing services for students. Fast delivery, plagiarism-free, 24/7 support.",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "AssignmentGhar - Expert Assignment Help",
        type: "image/png",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title:
      "AssignmentGhar - Expert Assignment Help & Academic Writing Services",
    description:
      "Get professional assignment help from expert writers. Quality academic writing services for students. Fast delivery, plagiarism-free, 24/7 support.",
    images: ["/og-image.png"],
    creator: "@assignmentghar",
    site: "@assignmentghar",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  icons: {
    icon: [
      { url: "/favicon.ico", type: "image/x-icon" },
      { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
    ],
    apple: [
      { url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" },
    ],
  },
  manifest: "/site.webmanifest",
  alternates: {
    canonical: process.env.NEXT_PUBLIC_APP_URL || "https://assignmentghar.com",
  },
  verification: {
    google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
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
        <RootLayoutClient>{children}</RootLayoutClient>
      </body>
    </html>
  );
}
