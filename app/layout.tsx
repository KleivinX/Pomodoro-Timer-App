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
      <head>
        <meta name="application-name" content="SaladTimer" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="SaladTimer" />
        <meta name="format-detection" content="telephone=no" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="msapplication-config" content="/browserconfig.xml" />
        <meta name="msapplication-TileColor" content="#ef4444" />
        <meta name="msapplication-tap-highlight" content="no" />

        <link rel="apple-touch-icon" href="/saladtimer-logo.png" />
        <link rel="icon" type="image/png" sizes="32x32" href="/saladtimer-logo.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/saladtimer-logo.png" />
        <link rel="manifest" href="/manifest.json" />
        <link rel="shortcut icon" href="/saladtimer-logo.png" />
      </head>
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
