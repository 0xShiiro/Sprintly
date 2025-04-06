import React from 'react'
import { getOrganization } from '../../../../../actions/organization';
import OrgSwitcher from '@/components/OrgSwitcher';

export default async function Page({ params }) {
    const { orgId } = await params;
    const organization = await getOrganization(orgId);

    if (!organization) {
        return <div>Organization Not Found</div>
    }
    return (
        <div className='container mx-auto'>
            <div className="mb-4 flex flex-col sm:flex-row justify-between items-start">
                <h1 className='text-5xl font-bold gradient-title pb-2'>
                    {organization.name}'s Projects
                </h1>
                <OrgSwitcher/>
            </div>
            <div className="mb-4">
                Show Org projects
            </div>
            <div className="mt-8">
                Show user assigned and reported issues here
            </div>
        </div>
    )
}
