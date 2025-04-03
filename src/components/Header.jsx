import React from 'react'
import { SignedIn, SignedOut, UserButton, SignInButton } from '@clerk/nextjs'
import Link from 'next/link'
import { Button } from './ui/button'
import { PenBox } from 'lucide-react'
import UserMenu from './UserMenu.jsx'
const Header = () => {
    return (
        <header className='container mx-auto'>
            <nav className="py-6 px-4 flex justify-between items-center" >
                <Link href="/">
                    Sprintly
                </Link>
                <div className='flex items-center gap-4'>
                    <Link href="/project/create">
                        <Button variant="destructive" className="flex items-center gap-2 bg-orange-900">
                            <PenBox size={18} />
                            <span>Create Project</span>
                        </Button>
                    </Link>
                    <SignedOut>
                        <SignInButton forceRedirectUrl="/onboarding">
                            <Button variant="outline">Login</Button>
                        </SignInButton>
                    </SignedOut>
                    <SignedIn>
                        <UserMenu />
                    </SignedIn>
                </div>
            </nav>
        </header>

    )
}

export default Header
