'use client'

import React from 'react'
import { useOrganization } from '@clerk/nextjs'
import { useUser } from '@clerk/nextjs'
import { BarLoader, ClimbingBoxLoader } from 'react-spinners'



const Loading = (Loading) => {
    const {isLoaded} = useOrganization();
    const {isLoaded:isLoadedUser} = useUser();

    if(!isLoaded || !isLoadedUser ){
        return (
            <div className='fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm bg-black/30'>
                <ClimbingBoxLoader className='mt-4 ' size={25} color="#36d7b7"/>
            </div>
            // <BarLoader  width={"100%"}  color="#36d7b7"/>
        )
    }else{
        <></>
    }

}

export default Loading
