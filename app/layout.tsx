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
    <html lang="en" className="dark">
      <body className={`${inter.className} bg-gradient-to-br from-rose-50 via-amber-50 to-slate-100 dark:from-slate-900 dark:via-slate-800 dark:to-slate-700 text-slate-800 dark:text-slate-100 min-h-screen`}>
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
