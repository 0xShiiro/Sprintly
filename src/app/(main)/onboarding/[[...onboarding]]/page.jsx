'use client'

import { OrganizationList, useOrganization } from '@clerk/nextjs'
import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation';

const page = () => {
    const {organization} =useOrganization();
    const router = useRouter();
    const [loading, setloading] = useState(false)

    useEffect(()=>{
        if(organization){
            router.push(`/organization/${organization.slug}`)
        }
    },[organization]);

  return (
    <div className="flex justify-center items-center pt-14" >
      <OrganizationList 
      hidePersonal
      afterCreateOrganizationUrl="/organization/:slug"
      afterSelectOrganizationUrl="/organization/:slug"
      />
    </div>
  )
}

export default page
