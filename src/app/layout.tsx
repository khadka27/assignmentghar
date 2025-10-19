import type React from "react"
import type { Metadata } from "next"
import { Geist, Geist_Mono } from "next/font/google"
import "./globals.css"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { ThemeProvider } from "@/components/theme-provider"

const geistSans = Geist({ subsets: ["latin"] })
const geistMono = Geist_Mono({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Student Assist - Assignment Help & Consultancy",
  description:
    "Get quick, reliable help with your college or university assignments. Chat directly, share files, and get support from expert consultants.",
  keywords: "assignment help, student consultancy, coursework assistance, academic support",
  openGraph: {
    title: "Student Assist - Assignment Help",
    description: "Expert assignment help for students",
    type: "website",
  },
  robots: "index, follow",
  canonical: "https://studentassist.com",
    generator: 'v0.app'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
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
        <ThemeProvider>
          <a href="#main-content" className="sr-only focus:not-sr-only">
            Skip to main content
          </a>
          <Navbar />
          <main id="main-content" className="min-h-screen">
            {children}
          </main>
          <Footer />
        </ThemeProvider>
      </body>
    </html>
  )
}
