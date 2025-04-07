'use client'
import React, { useState, useEffect } from 'react'
import { useOrganization } from '@clerk/nextjs'
import { useUser } from '@clerk/nextjs'
import OrgSwitcher from '@/components/OrgSwitcher';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { projectSchema } from '@/app/lib/validators';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import useFetch from '../../../../../hooks/use-fetch';
import { createProject } from '../../../../../actions/project';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { ClimbingBoxLoader } from 'react-spinners';

const page = () => {
    const router = useRouter();
    const { isLoaded: isOrgLoaded, membership } = useOrganization();
    const { isLoaded: isUserLoaded } = useUser();
    const [isAdmin, setIsAdmin] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm({
        resolver: zodResolver(projectSchema),
    });

    useEffect(() => {
        if (isOrgLoaded && isUserLoaded && membership) {
            setIsAdmin(membership.role === "org:admin");
        }
    }, [isOrgLoaded, isUserLoaded, membership]);

    const {
        loading,
        error,
        data: project,
        fn: createProjectFn,
    } = useFetch(createProject);

    const onSubmit = async (data) => {
        if (!isAdmin) {
            toast.error("Only organization admins can create projects");
            return;
        }
        console.log("First isSubmitting", isSubmitting);
        setIsSubmitting(true);
        console.log("Second isSubmitting", isSubmitting);
        if (isSubmitting) {
            return (
                <div className='fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm bg-black/30'>
                    <ClimbingBoxLoader className='mt-4 ' size={25} color="#36d7b7" />
                </div>
            );
        }

        try {
            console.log("Third isSubmitting", isSubmitting);
            await createProjectFn(data);
        } catch (err) {
            console.log("Fourth isSubmitting", isSubmitting);
            toast.error("Failed to create project");
            setIsSubmitting(false);
        }
    };

    useEffect(() => {
        if (project) {
            toast.success("Project created successfully!");
            router.push(`/project/${project.id}`);
        }

        if (error) {
            toast.error(error.message || "Failed to create project");
            setIsSubmitting(false);
        }
    }, [project, error, router]);



    if (!isOrgLoaded || !isUserLoaded) {
        return (
            <div className='fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm bg-black/30'>
                <ClimbingBoxLoader className='mt-4 ' size={25} color="#36d7b7" />
            </div>
        );
    }

    if (!isAdmin) {
        return (
            <div className='flex flex-col gap-2 items-center py-10' >
                <picture>
                    <source srcSet="https://fonts.gstatic.com/s/e/notoemoji/latest/1f613/512.webp" type="image/webp" />
                    <img src="https://fonts.gstatic.com/s/e/notoemoji/latest/1f613/512.gif" alt="😓" width="100" height="100" />
                </picture>
                <span className="text-4xl gradient-title">
                    Only Admin Can Create Projects.
                </span>
                <OrgSwitcher />
            </div>
        )
    }

    return (
        <div className="container px-20 py-10" >
            <h1 className="text-6xl text-center font-bold mb-8 gradient-title" >
                Create New Project
            </h1>

            <form className='flex flex-col space-y-4' onSubmit={handleSubmit(onSubmit)}>
                <div>
                    <Input
                        id="name"
                        className="bg-slate-950 border-none"
                        placeholder="Project Name"
                        {...register("name")}
                        disabled={isSubmitting}
                    />
                    {errors.name && (
                        <p className='text-red-500 text-sm mt-1' >
                            {errors.name.message}
                        </p>
                    )}
                </div>
                <div>
                    <Input
                        id="key"
                        className="bg-slate-950 border-none"
                        placeholder="Project Key (ex. ZKY-1)"
                        {...register("key")}
                        disabled={isSubmitting}
                    />
                    {errors.key && (
                        <p className='text-red-500 text-sm mt-1' >
                            {errors.key.message}
                        </p>
                    )}
                </div>
                <div>
                    <Textarea
                        id="description"
                        className="bg-slate-950 h-28 border-none"
                        placeholder="Project Description"
                        {...register("description")}
                        disabled={isSubmitting}
                    />
                    {errors.description && (
                        <p className='text-red-500 text-sm mt-1' >
                            {errors.description.message}
                        </p>
                    )}
                </div>
                <Button
                    disabled={isSubmitting}
                    type='submit'
                    className='bg-blue-500 text-white hover:cursor-pointer hover:bg-green-500 transition-all ease-in-out duration-300'
                    size='lg'
                >
                    {isSubmitting ? (
                        <>
                            <div className='fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm bg-black/30'>
                                <ClimbingBoxLoader className='mt-4 ' size={25} color="#36d7b7" />
                            </div>
                            Creating...
                        </>
                    ) : "Create Project"}
                </Button>
                {error && <p className='text-red-500 mt-2' >{error.message}</p>}
            </form>
        </div>
    )
}

export default page
