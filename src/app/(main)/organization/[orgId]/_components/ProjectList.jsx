import { getProjects } from "../../../../../../actions/project";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import DeleteProject from "./DeleteProject.jsx";
import Link from "next/link";

export default async function ProjectList({ orgId }) {
    const projects = await getProjects(orgId);
    if (projects.length === 0) {
        return (
            <p>
                No Projects Found
                <Link href="/project/create">
                    Create Project
                </Link>
            </p>
        )
    }
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4" >
            {projects.map((project) => {
                return (
                    <Card key={project.id} >
                        <CardHeader>
                            <CardTitle className="flex justify-between items-center" >
                                {project.name}
                                <div className="hover:bg-accent hover:text-accent-foreground dark:hover:bg-accent/50">
                                    <DeleteProject projectId={project.id} />
                                </div>
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-sm text-gray-500 mb-4" >
                                {project.description}
                            </p>
                            <Link href={`/project/${project.id}`} className="text-blue-500 hover:underline" >
                                View Project
                            </Link>
                        </CardContent>
                    </Card>
                )
            })}
        </div>
    )
}
