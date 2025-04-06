'use client'
import React from 'react'
import { SignedIn, useOrganization ,useUser} from '@clerk/nextjs'   
import { OrganizationSwitcher } from '@clerk/nextjs'
import { usePathname } from 'next/navigation'

const OrgSwitcher = () => {
const {isLoaded} = useOrganization();
const {isLoaded:userLoaded} = useUser();
const pathname = usePathname();


if(!isLoaded || !userLoaded){
    return null;
}

  return (
    <SignedIn>
      <OrganizationSwitcher
      hidePersonal
      afterSelectOrganizationUrl="/organization/:slug"
      afterCreateOrganizationUrl="/organization/:slug"
      createOrganizationMode={
        pathname==="/onboarding" ? "navigation" : "modal"
      }
      createOrganizationUrl="/onboarding"
      appearance={{
        elements:{
            organizationSwitcherTrigger: "border border-gray-300 rounded-md px-5 py-2",
            organizationSwitcherTriggerIcon:"text-white",
        }
      }}
 
      />
    </SignedIn>
  )
}

export default OrgSwitcher
