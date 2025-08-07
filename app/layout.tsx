import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { AuthProvider } from "@/components/auth-provider"
import { CurrencyProvider } from "@/contexts/currency-context"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Financial Goals Portal",
  description: "Track and manage your financial goals with smart recommendations",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="dark" style={{ backgroundColor: '#F3E2D4' }}>
      <body className={`${inter.className} bg-[#F3E2D4] dark:bg-gradient-to-br dark:from-[#415E72] dark:via-[#B9375D] dark:to-[#D25D5D] text-[#415E72] dark:text-white min-h-screen`} style={{ backgroundColor: '#F3E2D4' }}>
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          <AuthProvider>
            <CurrencyProvider>
              {children}
            </CurrencyProvider>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
