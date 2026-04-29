"use client"

import { SWRConfig } from "swr"
import { LanguageProvider } from "@/lib/i18n"

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SWRConfig
      value={{
        refreshInterval: 5000,
        revalidateOnFocus: true,
        dedupingInterval: 2000,
      }}
    >
      <LanguageProvider>{children}</LanguageProvider>
    </SWRConfig>
  )
}
