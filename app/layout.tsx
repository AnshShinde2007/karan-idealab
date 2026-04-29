import type { Metadata, Viewport } from 'next'
import { Inter, Space_Grotesk } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import { ThemeProvider } from '@/components/theme-provider'
import { Providers } from '@/components/providers'
import { OfflineIndicator } from '@/components/offline-indicator'
import { Toaster } from '@/components/ui/sonner'
import './globals.css'

const inter = Inter({ 
  subsets: ["latin"],
  variable: '--font-inter',
  preload: false,
})

const spaceGrotesk = Space_Grotesk({ 
  subsets: ["latin"],
  variable: '--font-space-grotesk',
  preload: false,
})

export const metadata: Metadata = {
  title: 'SkyRelief Connect | Emergency Rescue Network Powered by HAPS',
  description: 'Emergency disaster rescue platform using High Altitude Platform Station (HAPS) connectivity. Request help, find rescue camps, and stay connected during disasters.',
  keywords: ['disaster rescue', 'emergency response', 'HAPS', 'relief camps', 'SOS', 'disaster management'],
  authors: [{ name: 'SkyRelief Connect' }],
  openGraph: {
    title: 'SkyRelief Connect | Emergency Rescue Network',
    description: 'Stay Connected. Stay Safe. Get Help Fast.',
    type: 'website',
  },
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#3b82f6' },
    { media: '(prefers-color-scheme: dark)', color: '#1e3a8a' },
  ],
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${spaceGrotesk.variable}`} suppressHydrationWarning>
      <body className="font-sans antialiased bg-background">
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <Providers>
            {children}
            <OfflineIndicator />
          </Providers>
          <Toaster />
        </ThemeProvider>
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}
