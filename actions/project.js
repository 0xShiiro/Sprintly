'use server'

import { auth } from "@clerk/nextjs/server";
import  db  from "../src/lib/prisma";
import { clerkClient } from "@clerk/nextjs/server";
export async function createProject(data){
    const {userId,orgId} = await auth();
    if(!userId){
        throw new Error("Unauthorized");
    }
    if(!orgId){
        throw new Error("No Organization Detected");
    }

    const {data : membership} = await clerkClient().organizations.getOrganizationMembershipList({
        organizationId:orgId,
    })
    const userMemberShip = membership.find(
        (member) => member.publicUserData.userId === userId
    )

    if(!userMemberShip || userMemberShip.role !== "org:admin"){
        throw new Error("Only Organization admins can create projects");
    }
    try {
        const project = await db.project.create({
           data:{
            name:data.name,
            key:data.key,
            description:data.description,
            organizationId:orgId,
           }
        })
        return project;
    } catch (error) {
        throw new Error("Error Creating Project: " + error.message);
    }
}