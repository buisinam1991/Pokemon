import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import SWRProvider from "@/components/swr-config"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Pokémon Explorer",
  description: "Explore Pokémon with filtering and pagination",
    generator: 'buisinam1991'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <SWRProvider>{children}</SWRProvider>
      </body>
    </html>
  )
}



import './globals.css'