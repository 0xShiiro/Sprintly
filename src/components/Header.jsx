import React from 'react'
import { SignedIn, SignedOut, UserButton, SignInButton } from '@clerk/nextjs'
import Link from 'next/link'

const Header = () => {
    return (
        <header className="border-b border-gray-800 bg-gray-900">
            <div className="container mx-auto px-4 py-4 flex items-center justify-between">
                <Link href="/" className="text-xl font-bold text-white">
                    Sprintly
                </Link>
                <div className="flex items-center gap-4">
                    <SignedOut>
                        <SignInButton mode="modal">
                            <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md">
                                Sign In
                            </button>
                        </SignInButton>
                    </SignedOut>
                    <SignedIn>
                        <UserButton signOutUrl="/" />
                    </SignedIn>
                </div>
            </div>
        </header>
    )
}

export default Header
