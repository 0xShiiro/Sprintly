import React from 'react'
import { getProject } from '../../../../../actions/project';
import { notFound } from 'next/navigation';
const page = async ({params}) => {
    const {projectId} = params;
    const project = await getProject(projectId);
    if(!project){
        notFound();
    }
  return (
    <div>
      {/* Sprint Creation  */}
      {/* Sprint Board */}

      {project.sprints.length > 0?(
        <>
          <SprintCreationForm 
            projectTtile={project.name}
            projectId={projectId}
            projectKet={project.key}
            sprintKey={project.sprints?.length+1}
            />
        </>
      ):(
        <div>
          Create Sprint From Above Button 
        </div>
      )}
    </div>
  )
}

export default page
