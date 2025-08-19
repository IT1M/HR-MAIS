import type React from "react"
import type { Metadata } from "next"
import { Inter, Cairo } from "next/font/google"
import "./globals.css"

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
})

const cairo = Cairo({
  subsets: ["arabic", "latin"],
  display: "swap",
  variable: "--font-cairo",
})

export const metadata: Metadata = {
  title: "AI Presentation & Dashboard Builder",
  description: "Bilingual AI-powered presentation and dashboard builder with Arabic and English support",
  manifest: "/manifest.json",
  themeColor: "#0ea5e9",
  viewport: "width=device-width, initial-scale=1",
    generator: 'v0.app'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" dir="ltr" className={`${inter.variable} ${cairo.variable}`}>
      <head>
        <link rel="icon" href="/favicon.ico" />
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#0ea5e9" />
      </head>
      <body className="antialiased">{children}</body>
    </html>
  )
}
