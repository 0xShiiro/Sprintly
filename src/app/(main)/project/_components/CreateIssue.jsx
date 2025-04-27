'use client'

import React, { useEffect } from 'react'
import { Drawer, DrawerTrigger, DrawerContent, DrawerHeader, DrawerTitle, DrawerDescription, DrawerFooter } from '@/components/ui/drawer'
import { Controller, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { issueSchema } from '@/app/lib/validators'
import useFetch from '../../../../../hooks/use-fetch'
import { createIssue } from '../../../../../actions/issues'
import { getOrganzationUsers } from '../../../../../actions/organization'
import { BarLoader, ClimbingBoxLoader } from 'react-spinners'
import { Input } from '@/components/ui/input'
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select'
import MDEditor from '@uiw/react-md-editor'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'
const CreateIssue = ({
    isOpen,
    onClose,
    sprintId,
    status,
    projectId,
    onIssueCreated,
    orgId
}) => {

    const {
        control,
        register,
        handleSubmit,
        formState: { errors },
        reset,
    } = useForm({
        resolver: zodResolver(issueSchema),
        defaultValues: {
            priority: "MEDIUM",
            description: "",
            assigneeId: "",
        }
    })

    const {
        loading: isCreatingIssue,
        fn: createIssuefn,
        error: createIssueError,
        data: newIssue,
    } = useFetch(createIssue)

    const {
        loading: isFetchingUsers,
        fn: fetchUsersFn,
        error: fetchUsersError,
        data: users,
    } = useFetch(getOrganzationUsers)

    const onSubmit = async (data) => {
        await createIssuefn(
            projectId,
            {
                ...data,
                sprintId,
                status,
            }
        )
     }

    useEffect(() => {
        if (isOpen && orgId) {
            console.log("Fetching users")
            const fetchUsers = async () => {
                await fetchUsersFn(orgId)
            }
            fetchUsers();
        }
    }, [isOpen, orgId])

    useEffect(()=>{
        if(newIssue){
            reset()
            onIssueCreated()
            onClose()
            toast.success("Issue Created Successfully")
        }
    },[newIssue,isCreatingIssue])
    return (
        <Drawer open={isOpen} onClose={onClose} >
            <DrawerContent className="bg-slate-900" >
                <DrawerHeader>
                    <DrawerTitle>Create New Issue</DrawerTitle>
                </DrawerHeader>
                {isFetchingUsers && (
                    <BarLoader width="100%" color="#36d7b7" />
                )}
                <form className="p-4 space-y-4" onSubmit={handleSubmit(onSubmit)}>
                    <div>
                        <label htmlFor="title" className="block text-sm font-medium mb-1" >
                            <div className='mb-2 text-lg' >
                            Title

                            </div>
                            <Input id="title" {...register('title')} className="mt-1" placeholder="Title" />
                            {errors.title && <p className="text-red-500 text-sm mt-1">
                                {errors.title.message}
                            </p>}
                        </label>
                    </div>
                    <div>
                        <label htmlFor="assigneeId" className="block text-sm font-medium mb-1 " >
                            <div className="mb-2 text-lg" >
                            Assignee
                            </div>
                            <Controller
                                name="assigneeId"
                                control={control}
                                render={({ field }) => (
                                    <Select
                                        onValueChange={field.onChange}
                                        defaultValue={field.value}
                                    >
                                        <SelectTrigger className="w-[180px]">
                                            <SelectValue placeholder="Select Assignee" />
                                        </SelectTrigger>
                                        <SelectContent >
                                            {users?.map((user)=>(
                                                <SelectItem key={user.id} value={user.id} className="bg-slate-950">
                                                    {user.name} 
                                                </SelectItem>
                                            ))}
                                            
                                        </SelectContent>
                                    </Select>
                                )} />
                            {errors.assigneeId && <p className="text-red-500 text-sm mt-1">
                                {errors.assigneeId.message}
                            </p>}
                        </label>
                    </div>
                    <div>
                        <label htmlFor="description" className="block text-sm font-medium mb-1" >
                          
                            <div className='mb-2 text-lg' >
                            Description    
                            </div>
                            
                            <Controller
                                name="description"
                                control={control}
                                
                                render={({ field }) => (
                                    
                                    <MDEditor className="custom-md-editor" value={field.value} onChange={field.onChange} />
                                )} />
                            {errors.description && <p className="text-red-500 text-sm mt-1">
                                {errors.description.message}
                            </p>}
                        </label>
                    </div>
                    <div>
                        <label htmlFor="priority" className="block text-sm font-medium mb-1 " >
                            <div className="mb-2 text-lg" >
                            Priority
                            </div>
                            <Controller
                                name="priority"
                                control={control}
                                render={({ field }) => (
                                    <Select
                                        onValueChange={field.onChange}
                                        defaultValue={field.value}
                                    >
                                        <SelectTrigger className="w-[180px]">
                                            <SelectValue placeholder="Select Priority" />
                                        </SelectTrigger>
                                        <SelectContent >
                                            <SelectItem value="LOW" className="bg-slate-950">
                                                Low
                                            </SelectItem>
                                            <SelectItem value="MEDIUM" className="bg-slate-950">
                                                Medium
                                            </SelectItem>
                                            <SelectItem value="HIGH" className="bg-slate-950">
                                                High
                                            </SelectItem>
                                            <SelectItem value="URGENT" className="bg-slate-950">
                                                Urgent
                                            </SelectItem>
                                            
                                        </SelectContent>
                                    </Select>
                                )} />
                            {errors.assigneeId && <p className="text-red-500 text-sm mt-1">
                                {errors.assigneeId.message}
                            </p>}
                        </label>
                    </div>
                    {createIssueError && <p className="text-red-500 text-sm mt-1">{createIssueError.message}</p>}
                    <Button className="w-full bg-blue-500" >
                        {isCreatingIssue ? "Creating...": "Create Issue"}{" "}
                    </Button>
                </form>
            </DrawerContent>
        </Drawer>

    )
}

export default CreateIssue
