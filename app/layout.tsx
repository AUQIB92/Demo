import type { Metadata, Viewport } from 'next'
import { Manrope, Space_Grotesk } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import { ThemeProvider } from '@/components/theme-provider'
import './globals.css'

const manrope = Manrope({
  subsets: ['latin'],
  variable: '--font-manrope',
})

const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  variable: '--font-space',
})

export const metadata: Metadata = {
  title: 'SecureVision | Smart Security Solutions',
  description: 'Premium CCTV surveillance and smart security services. AI-powered protection for your home and business.',
  generator: 'SecureVision',
  keywords: ['CCTV', 'Security', 'Smart Home', 'Surveillance', 'AI Security'],
  authors: [{ name: 'SecureVision' }],
}

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#edf8f6' },
    { media: '(prefers-color-scheme: dark)', color: '#071c22' },
  ],
  colorScheme: 'light dark',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning className="bg-background">
      <body
        className={`${manrope.variable} ${spaceGrotesk.variable} min-h-screen font-sans antialiased`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {children}
        </ThemeProvider>
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}
