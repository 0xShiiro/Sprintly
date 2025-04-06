'use client'
import React , {useState,useEffect} from 'react'
import { useOrganization } from '@clerk/nextjs' 
import { useUser } from '@clerk/nextjs'
import OrgSwitcher from '@/components/OrgSwitcher';

const page = () => {
const {isLoaded:isOrgLoaded , membership} = useOrganization();
const {isLoaded:isUserLoaded } = useUser();
const [isAdmin, setisAdmin] = useState(false);

useEffect(()=>{
    if(isOrgLoaded && isUserLoaded && membership){
        setisAdmin(membership.role === "org:admin");
    }
},[isOrgLoaded,isUserLoaded,membership])

if(!isOrgLoaded && !isUserLoaded){
    return null;
}

if(!isAdmin){
    return (
        <div>
            <span>
                Only Admin Can Create Projects.
            </span>
            <OrgSwitcher/>
        </div>
    )
}

  return (
    <div>
      
    </div>
  )
}

export default page
