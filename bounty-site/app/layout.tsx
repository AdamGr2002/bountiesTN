import { ClerkProvider } from '@clerk/nextjs'
import type { Metadata } from "next";
import { Inter } from 'next/font/google'
import './globals.css'
import { ConvexClientProvider } from "./ConvexClientProvider";
const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: "bountiesTN",
  description: "A platform for creating and solving bounties",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <ClerkProvider>
        <html lang="en">
          <body className={inter.className}><ConvexClientProvider>{children}</ConvexClientProvider>
          </body>
        </html>
    </ClerkProvider>
  )
}