import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
})

export const metadata: Metadata = {
  title: "SaladTimer - Pomodoro Timer",
  description: "A beautiful Pomodoro timer with music integration to boost your productivity",
  manifest: "/manifest.json",
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ef4444" },
    { media: "(prefers-color-scheme: dark)", color: "#dc2626" },
  ],
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "SaladTimer",
  },
  formatDetection: {
    telephone: false,
  },
  applicationName: "SaladTimer",
  other: {
    "mobile-web-app-capable": "yes",
    "msapplication-config": "/browserconfig.xml",
    "msapplication-TileColor": "#ef4444",
    "msapplication-tap-highlight": "no",
  },
  icons: {
    icon: [
      { url: "/saladtimer-logo.png", sizes: "32x32", type: "image/png" },
      { url: "/saladtimer-logo.png", sizes: "16x16", type: "image/png" },
    ],
    shortcut: "/saladtimer-logo.png",
    apple: "/saladtimer-logo.png",
  },
  openGraph: {
    type: "website",
    siteName: "SaladTimer",
    title: "SaladTimer - Pomodoro Timer",
    description: "A beautiful Pomodoro timer with music integration to boost your productivity",
  },
  twitter: {
    card: "summary",
    title: "SaladTimer - Pomodoro Timer",
    description: "A beautiful Pomodoro timer with music integration to boost your productivity",
  },
    generator: 'v0.app'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={`${inter.variable} antialiased`} suppressHydrationWarning>
      <body className="font-sans">
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          {children}
        </ThemeProvider>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              if ('serviceWorker' in navigator) {
                window.addEventListener('load', function() {
                  navigator.serviceWorker.register('/sw.js')
                    .then(function(registration) {
                      console.log('SW registered: ', registration);
                    })
                    .catch(function(registrationError) {
                      console.log('SW registration failed: ', registrationError);
                    });
                });
              }
            `,
          }}
        />
      </body>
    </html>
  )
}
