import React from 'react'
import { SignedIn, SignedOut, UserButton, SignInButton } from '@clerk/nextjs'
import Link from 'next/link'
import { Button } from './ui/button'
import { PenBox } from 'lucide-react'
import UserMenu from './UserMenu.jsx'
import Image from 'next/image'
import checkUser from '@/lib/checkUser'
import Loading from './Loading'
const Header = async() => {
    await checkUser();
    return (
        <header className='container mx-auto'>
            <nav className="py-6 px-4 flex justify-between items-center" >
                <Link href="/">
                    <Image src="/logo2.png" alt="Sprintly Logo" className="w-auto" width={400} height={400} />
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
            <Loading/>
        </header>

    )
}

export default Header
