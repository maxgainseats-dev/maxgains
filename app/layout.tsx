import type React from "react"
import type { Metadata } from "next"
import { GeistSans } from "geist/font/sans"
import { GeistMono } from "geist/font/mono"
import "./globals.css"
import "../styles/globals.css"

export const metadata: Metadata = {
  title: "MaxGains",
  description: "Maximize Your Gains on Every Order",
  generator: "",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <head>
        <style>{`
html {
  font-family: ${GeistSans.style.fontFamily};
  --font-sans: ${GeistSans.variable};
  --font-mono: ${GeistMono.variable};
}
        `}</style>

        <link rel="icon" href="/slash.svg" type="image/svg+xml" />
      </head>
      <body>{children}</body>
    </html>
  )
}
