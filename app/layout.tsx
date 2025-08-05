import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { AuthProvider } from "@/components/auth-provider"
import { Toaster } from "@/components/ui/toaster"
import { CurrencyProvider } from "@/contexts/currency-context"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Financial Goals & Job Portal",
  description: "Track your financial goals and find campus jobs",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.className} dark bg-gray-950 text-gray-100`}>
        <AuthProvider>
          <CurrencyProvider>
            {children}
            <Toaster />
          </CurrencyProvider>
        </AuthProvider>
      </body>
    </html>
  )
}
