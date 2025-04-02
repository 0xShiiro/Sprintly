import React from 'react'
import { SignedIn, SignedOut, UserButton, SignInButton } from '@clerk/nextjs'
import Link from 'next/link'

const Header = () => {
    return (<>
        <SignedOut>
            <SignInButton forceRedirectUrl="/onboarding">
              sign in
            </SignInButton>
          </SignedOut>
          <SignedIn>
            <UserButton />
          </SignedIn>

    </>
    )
}

export default Header
