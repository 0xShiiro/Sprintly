import React from 'react'
import { getProject } from '../../../../../actions/project';
import { notFound } from 'next/navigation';
import SprintCreationForm from '../_components/SprintCreationForm';
import SprintBoard from '../_components/SprintBoard';
const page = async ({params}) => {
    const {projectId} = await params;
    const project = await getProject(projectId);
    if(!project){
        notFound();
    }
  return (
    <div>
      {/* Sprint Creation  */}
      <SprintCreationForm 
        projectTitle={project.name}
        projectId={projectId}
        projectKey={project.key}
        sprintKey={project.sprints?.length+1}
        />

      {project.sprints.length > 0 ?(
        <>
        {/* Sprint Board */}
        <SprintBoard
          sprints={project.sprints}
          projectId={projectId}
          orgId={project.organizationId}
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
