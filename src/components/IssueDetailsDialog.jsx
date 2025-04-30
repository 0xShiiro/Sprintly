import React, { useEffect } from 'react'
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog'
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select'
import { useState } from 'react'
import { BarLoader } from 'react-spinners'
import { usePathname, useRouter } from 'next/navigation'
import { Button } from './ui/button'
import { ExternalLink } from 'lucide-react'
import { useOrganization, useUser } from '@clerk/nextjs'
import useFetch from '../../hooks/use-fetch'
import { deleteIssue, updateIssue } from '../../actions/issues'
import statuses from '../../data/status.json'
import MDEditor from '@uiw/react-md-editor'
import UserAvatar from './UserAvatar'

const priorityOptions = ["LOW", "MEDIUM", "HIGH", "URGENT"];
const IssueDetailsDialog = ({
    isOpen,
    onClose,
    issue,
    onDelete = () => { },
    onUpdate = () => { },
    borderCol = "",
}) => {
    const pathname = usePathname();
    const router = useRouter()
    const [status, setstatus] = useState(issue.status);
    const [priority, setpriority] = useState(issue.priority)
    const { user } = useUser();
    const { membership } = useOrganization();

    const isProjectPage = pathname.startsWith("/project/");
    const canChange = user.id === issue.reporter.clerkUserId || membership.role === "org:admin";
    const handleGoToProject = () => {
        router.push(`/project/${issue.projectId}?sprint=${issue.sprintId}`)
    }


    const handleStatusChange = async (newStatus) => {
        setstatus(newStatus)
        updateIssueFn(issue.id, { status: newStatus ,priority })

    }
    const handlePriorityChange = async (newPriority) => {
        setpriority(newPriority)
        updateIssueFn(issue.id, { status, priority: newPriority })
    }
    const handleDelete = async()=>{
        window.confirm("Are you sure you want to delete this issue?") && deleteIssueFn(issue.id)
        deleteIssueFn(issue.id)
    }
    const {
        fn: updateIssueFn,
        loading: updateIssueLoading,
        error: updateIssueError,
        data: updateIssueData
    } = useFetch(updateIssue)

    const {
        fn: deleteIssueFn,
        loading: deleteIssueLoading,
        error: deleteIssueError,
        data: deleteIssueData
    } = useFetch(deleteIssue)

    useEffect(()=>{
        if(deleteIssueData){

            onClose()
            onDelete()
        }
        if(updateIssueData){
            onUpdate(updateIssueData)
        }
    },[updateIssueData, deleteIssueData,updateIssueLoading])
    return (
        <Dialog open={isOpen} onOpenChange={onClose} >
            <DialogContent className='bg-black' >
                <DialogHeader>
                    <div className={`flex items-center justify-between`}>
                        <DialogTitle className='text-3xl' >
                            {issue.title}
                        </DialogTitle>

                    </div>
                    {!isProjectPage && (
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={handleGoToProject}
                            title="Go to Project"
                        >
                            <ExternalLink className='h-4 w-4' />
                        </Button>
                    )}

                </DialogHeader>
                {(updateIssueLoading || deleteIssueLoading) && (
                    <BarLoader width="100%" color="#36d7b7" />
                )}

                <div className='space-y-4' >
                    <div className='flex items-center space-x-3' >
                        <Select value={status} onValueChange={handleStatusChange}>
                            <SelectTrigger className="w-full">
                                <SelectValue placeholder="Status" />
                            </SelectTrigger>
                            <SelectContent>
                                {statuses.map((option) => (
                                    <SelectItem key={option.key} value={option.key} className='bg-black'>
                                        {option.name}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        <Select value={priority} onValueChange={handlePriorityChange} disabled={!canChange}>
                            <SelectTrigger className={`w-full border ${borderCol} rounded`}>
                                <SelectValue placeholder="Priority" />
                            </SelectTrigger>
                            <SelectContent>
                                {priorityOptions.map((option) => (
                                    <SelectItem key={option} value={option} className='bg-black'>
                                        {option}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>

                    </div>
                    <div>
                        <h4 className="font-semibold">
                            Description
                        </h4>
                        <MDEditor.Markdown
                            className='rounded px-2 py-1'
                            source={issue.description ? issue.description : "--"}
                            />
                    </div>
                    <div className="flex justify-between">
                        <div className="flex flex-col gap-2">
                                <h4 className="font-semibold">
                                    Assignee
                                </h4>
                                <UserAvatar user={issue.assignee} />
                        </div>            
                        <div className="flex flex-col gap-2">
                                <h4 className="font-semibold">
                                    Reporter
                                </h4>
                                <UserAvatar user={issue.reporter} />
                        </div>            
                    </div>
                    {canChange &&(
                        <Button 
                            onClick={handleDelete}
                            disabled={deleteIssueLoading}
                            variant="destructive"
                            >
                                {deleteIssueLoading ? "Deleting..." : "Delete"}
                            </Button>
                    )}
                    {(updateIssueError || deleteIssueError) && (
                        <p className="text-red-500 text-sm mt-1">
                            {updateIssueError?.message || deleteIssueError?.message}
                        </p>
                    )}
                </div>
            </DialogContent>
        </Dialog>

    )
}

export default IssueDetailsDialog
