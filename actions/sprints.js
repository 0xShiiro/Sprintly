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

export async function updateSprintStatus(sprintId,newStatus) {
    const {userId , orgId , orgRole} = auth();
    if(!userId || !orgId){
        return {error:"Unauthorized"}
    }
    try {
        const sprint = await db.sprint.findUnique({
            where:{
                id:sprintId,
            },
            include:{
                project:true,
            },
        });
        if(!sprint){
            throw new Error("Sprint Not Found")
        }
        if(sprint.project.organizationId !== orgId){
            throw new Error("Unauthorized")
        }
        if(orgRole !== "org:admin"){
            throw new Error("Only Admins can change the status")
        }
        
        const startDate = new Date(sprint.startDate);
        const endDate = new Date(sprint.endDate);
        const today = new Date();

        if(newStatus === "ACTIVE" && (today < startDate || today > endDate)){
            throw new Error("Sprint Cannot be started before start date or after end date");
        }
        if(newStatus === "COMPLETED" && sprint.status !== "ACTIVE"){
            throw new Error("Sprint Cannot be completed if not started");
        }
        const updatedSprint = await db.sprint.update({
            where:{
                id:sprintId,
            },
            data:{
                status:newStatus,
            },
            
        })
        return {success:true,sprint:updatedSprint};

    } catch (error) {
        throw new Error(error.message)
        
    }
}