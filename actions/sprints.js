'use server'
import { auth } from "@clerk/nextjs/server";
  
import  db  from "../src/lib/prisma";

export async function createSprint(projectId,data){
    const {userId,orgId} = auth();
    if(!userId || !orgId){
        return {error:"Unauthorized"}
    }
    const project = await db.project.findUnique({
        where:{
            id:projectId,
        },
    });
    if(!project || project.organizationId !== orgId){
        throw new Error("Project not Found")
    }
     const sprint = await db.sprint.create({
        data:{
            name:data.name,
            startDate:data.startDate,
            endDate:data.endDate,
            status:"PLANNED",
            projectId,
        }
     })
     return sprint;
}
