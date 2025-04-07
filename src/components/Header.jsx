import React from 'react'
import { SignedIn, SignedOut, UserButton, SignInButton } from '@clerk/nextjs'
import Link from 'next/link'
import { Button } from './ui/button'
import { PenBox } from 'lucide-react'
import UserMenu from './UserMenu.jsx'
import Image from 'next/image'
import checkUser from '@/lib/checkUser'
import Loading from './Loading'

const Header = async () => {
    try {
        await checkUser();
        return (
            <header className='container mx-auto'>
                <nav className="py-6 px-4 flex justify-between items-center" >
                    <Link href="/">
                        <Image src="/logo2.png" alt="Sprintly Logo" priority={false} className="w-auto" width={200} height={40} />
                    </Link>
                    <div className='flex items-center gap-4'>
                        <Link href="/project/create">
                            <Button variant="destructive" className="flex items-center gap-2 bg-orange-900 transition-all ease-in-out duration-300 hover:cursor-pointer ">
                                <PenBox size={18} />
                                <span>Create Project</span>
                            </Button>
                        </Link>
                        <SignedOut>
                            <SignInButton forceRedirectUrl="/onboarding">
                                <Button variant="outline" className='hover:cursor-pointer hover:bg-white hover:text-black transition-ease-in-out duration-300'>Login</Button>
                            </SignInButton>
                        </SignedOut>
                        <SignedIn>
                            <UserMenu />
                        </SignedIn>
                    </div>
                </nav>
                <Loading />
            </header>
        )
    } catch (error) {
        console.error('Error in Header:', error);
        return (
            <header className='container mx-auto'>
                <nav className="py-6 px-4 flex justify-between items-center" >
                    <Link href="/">
                        <Image src="/logo2.png" alt="Sprintly Logo" className="w-auto" width={200} height={40} />
                    </Link>
                    <div className='flex items-center gap-4'>
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
                <Loading />
            </header>
        )
    }
}

export default Header
