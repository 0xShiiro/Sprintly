'use client'
import React, { useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Trash2 } from 'lucide-react'
import { deleteProject } from '../../../../../../actions/project'
import { useOrganization } from '@clerk/nextjs'
import useFetch from '../../../../../../hooks/use-fetch'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'
import { cn } from '@/lib/utils'
import { ClimbingBoxLoader } from 'react-spinners'
const DeleteProject = ({ projectId }) => {
    const { membership } = useOrganization();
    const isAdmin = membership?.role === "org:admin";
    const {
        loading: isDeleting,
        error,
        data: deleted,
        fn: deleteProjectFn,
    } = useFetch(deleteProject);
    const router = useRouter();
    const handleDelete = async () => {
        if (window.confirm("Are you sure you want to delete this project?")) {
            try {
                await deleteProjectFn(projectId);
            } catch (err) {
                console.error("Error deleting project: ", err);
            }
        }
    }
    useEffect(() => {
        if (deleted?.success) {
            router.refresh();
            setTimeout(() => {
                toast.success("Project deleted successfully");
            }, 2000);
        }
    }, [deleted]);

    if (!isAdmin) {
        return null
    };
    
    return (
        <>
            <Button
                variant="ghost"
                size="sm"
                // safelist: hover:bg-accent hover:text-accent-foreground dark:hover:bg-accent/50

                className={cn(
                    isDeleting && "animate-pulse",
                    "hover:bg-accent hover:text-accent-foreground dark:hover:bg-accent/50"
                  )}
                onClick={handleDelete}
                disabled={isDeleting}
            >
                <Trash2 className="h-4 w-4" />
            </Button>
            {error && <p className="text-red-500 text-sm">{error.message}</p>}
            {isDeleting && 
            <div className='fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm bg-black/30'>
                <ClimbingBoxLoader className='mt-4 ' size={25} color="#36d7b7"/>
            </div>}
        </>
    )

}

export default DeleteProject
