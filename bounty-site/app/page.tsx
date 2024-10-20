'use client'
import { useState } from 'react';
import BountyList from '@/components/BountyList'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { UserButton } from '@clerk/nextjs'
import { GlobeIcon, TrendingUpIcon, ShieldIcon } from 'lucide-react'
import { SignInButton } from '../components/SignInButton'
import GetStartedModal from '@/components/GetStartedModal';

export default function Home() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-800">
      <header className="border-b bg-white/50 backdrop-blur-xl dark:bg-gray-800/50">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <Link href="/" className="flex items-center space-x-2">
            <GlobeIcon className="h-8 w-8 text-primary" />
            <span className="text-2xl font-bold text-primary">BountiesTN</span>
          </Link>
          <div className="flex items-center space-x-4">
            <SignInButton />
            <Button asChild variant="outline">
              <Link href="/create">Post a Bounty</Link>
            </Button>
            <UserButton afterSignOutUrl="/" />
          </div>
        </div>
      </header>
      <main className="container mx-auto px-4 py-8">
        <div className="mb-12 text-center">
          <h1 className="text-4xl font-extrabold tracking-tight mb-4">
            Solve Problems, Earn Rewards
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-6">
            Connect with developers worldwide, tackle exciting challenges, and get paid for your solutions.
          </p>
          <Button onClick={() => setIsModalOpen(true)} size="lg">
            Get Started
          </Button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          <div className="flex flex-col items-center text-center p-6 bg-white rounded-lg shadow-md dark:bg-gray-800">
            <TrendingUpIcon className="h-12 w-12 text-primary mb-4" />
            <h2 className="text-xl font-semibold mb-2">Boost Your Skills</h2>
            <p className="text-muted-foreground">Challenge yourself with real-world problems and grow your expertise.</p>
          </div>
          <div className="flex flex-col items-center text-center p-6 bg-white rounded-lg shadow-md dark:bg-gray-800">
            <ShieldIcon className="h-12 w-12 text-primary mb-4" />
            <h2 className="text-xl font-semibold mb-2">Secure Payments</h2>
            <p className="text-muted-foreground">Get paid safely and promptly for your successful solutions.</p>
          </div>
          <div className="flex flex-col items-center text-center p-6 bg-white rounded-lg shadow-md dark:bg-gray-800">
            <GlobeIcon className="h-12 w-12 text-primary mb-4" />
            <h2 className="text-xl font-semibold mb-2">Global Community</h2>
            <p className="text-muted-foreground">Connect with developers and clients from around the world.</p>
          </div>
        </div>
        <BountyList />
      </main>
      <footer className="border-t bg-white/50 backdrop-blur-xl dark:bg-gray-800/50 mt-12">
        <div className="container mx-auto px-4 py-6 text-center text-muted-foreground">
          © 2023 BountiesTN. All rights reserved.
        </div>
      </footer>
      <GetStartedModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </div>
  )
}
