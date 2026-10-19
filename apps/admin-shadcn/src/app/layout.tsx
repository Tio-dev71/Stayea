import { Playfair_Display, Plus_Jakarta_Sans, Cinzel, Dancing_Script, Great_Vibes } from "next/font/google"
import { env } from "@/config/env"
import { AppProvider } from "./provide"
import type { Metadata } from "next"
import "@/styles/globals.css"

const playfair = Playfair_Display({
  subsets: ["latin", "vietnamese"],
  variable: "--font-serif",
  display: "swap",
})

const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin", "vietnamese"],
  variable: "--font-sans",
  display: "swap",
})

const cinzel = Cinzel({
  subsets: ["latin"],
  variable: "--font-brand",
  display: "swap",
})

const dancingScript = Dancing_Script({
  subsets: ["latin", "vietnamese"],
  variable: "--font-script-vi",
  display: "swap",
})

const greatVibes = Great_Vibes({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-script",
  display: "swap",
})


export const metadata: Metadata = {
  metadataBase: new URL(env.NEXT_PUBLIC_APP_URL),
  title: {
    default: "STAYEA | Kỳ nghỉ tuyển chọn và trải nghiệm tinh tế tại Phú Quốc",
    template: "%s | STAYEA",
  },
  description: "STAYEA - Nền tảng du lịch và lưu trú cao cấp tại Phú Quốc. Biệt thự, homestay, trải nghiệm độc bản.",
  openGraph: {
    type: "website",
    siteName: "STAYEA",
  },
  twitter: {
    card: "summary_large_image",
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="vi" suppressHydrationWarning className={`${playfair.variable} ${jakarta.variable} ${cinzel.variable} ${dancingScript.variable} ${greatVibes.variable}`}>
      <head>
        <meta name="theme-color" media="(prefers-color-scheme: light)" content="#ffffff" />
        <meta name="theme-color" media="(prefers-color-scheme: dark)" content="#0c3b40" />
      </head>
      <body className="min-h-dvh font-sans antialiased bg-white text-slate-800">
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-100 focus:rounded-md focus:bg-background focus:px-4 focus:py-2 focus:text-sm focus:font-medium focus:text-foreground focus:ring-2 focus:ring-ring"
        >
          Skip to main content
        </a>
        <AppProvider>{children}</AppProvider>
      </body>
    </html>
  )
}
