import React from "react"
import type { Metadata, Viewport } from 'next'
import { Poppins, Inter } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import './globals.css'

const poppins = Poppins({ 
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-poppins"
});

const inter = Inter({ 
  subsets: ["latin"],
  variable: "--font-inter"
});

export const metadata: Metadata = {
  title: 'Naju Gourmet - Cardapio Digital',
  description: 'Naju Gourmet - O melhor acai da regiao! Escolha seus sabores favoritos e faca seu pedido.',
  generator: 'v0.app',
  icons: {
    icon: '/images/logo-naju.png',
    apple: '/images/logo-naju.png',
  },
}

export const viewport: Viewport = {
  themeColor: '#7c2d7c',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="pt-BR">
      <body className={`${poppins.variable} ${inter.variable} font-sans antialiased`}>
        {children}
        <Analytics />
      </body>
    </html>
  )
}
