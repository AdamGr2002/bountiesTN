import { ClerkProvider } from '@clerk/nextjs'
import { ConvexProvider, ConvexReactClient } from "convex/react"
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

const convex = new ConvexReactClient(process.env.NEXT_PUBLIC_CONVEX_URL!);

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <ClerkProvider>
      <ConvexProvider client={convex}>
        <html lang="en">
          <body className={inter.className}>{children}</body>
        </html>
      </ConvexProvider>
    </ClerkProvider>
  )
}