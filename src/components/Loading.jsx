'use client'

import React from 'react'
import { useOrganization } from '@clerk/nextjs'
import { useUser } from '@clerk/nextjs'
import { BarLoader } from 'react-spinners'

const Loading = () => {
    const {isLoaded} = useOrganization();
    const {isLoaded:isLoadedUser} = useUser();

    if(!isLoaded || !isLoadedUser){
        return (
            <BarLoader className='mb-4' width={"100%"} color="#36d7b7"/>
        )
    }else{
        <></>
    }

}

export default Loading
