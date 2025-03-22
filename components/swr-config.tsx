"use client"

import type React from "react"

import { SWRConfig } from "swr"

interface SWRProviderProps {
  children: React.ReactNode
}

export default function SWRProvider({ children }: SWRProviderProps) {
  return (
    <SWRConfig
      value={{
        // Global SWR configuration
        revalidateOnFocus: false,
        revalidateIfStale: false,
        errorRetryCount: 3,
        dedupingInterval: 60000, // 1 minute
        provider: () => new Map(), // Use a Map as the cache provider
      }}
    >
      {children}
    </SWRConfig>
  )
}

