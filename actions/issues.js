import  db  from "../src/lib/prisma";
import { auth } from "@clerk/nextjs/server";
export async function createIssue(projectId,data){
    const {userId,orgId} = auth();
    if(!userId || !orgId){
        throw new Error("Unauthorized");
    }

    let user = await db.user.findUnique({
        where:{
            clerkUserId:userId,
        },
    })

    const lastIssue = await db.issue.findFirst({
        where:{
            projectId,
            status:data.status
        },
        orderBy:{
            order:"desc",
        },
    })
    const newOrder = lastIssue ? lastIssue.order + 1 : 1;

     const issue = await db.issue.create({
        data:{
            title:data.title,
            description:data.description,
            status:data.status,
            priority:data.priority,
            projectId:projectId,
            sprintId:data.sprintId,
            reporterId:user.id,
            asigneeId:data.asigneeId || null,
            order:newOrder,
        },
        include:{
            reporter:true,
            asignee:true,
        }
     })
     return issue;
}