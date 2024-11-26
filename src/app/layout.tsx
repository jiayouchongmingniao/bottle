import './globals.css'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Mood Bottle - Share Your Feelings Globally',
  description: 'A global platform for sharing and receiving mood messages in multiple languages',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <main className="min-h-screen bg-gradient-to-b from-background to-white">
          {children}
        </main>
      </body>
    </html>
  )
}
