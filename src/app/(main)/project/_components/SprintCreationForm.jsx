"use client"
import { Button } from '@/components/ui/button'
import React from 'react'

const SprintCreationForm = ({
    projectTitle,
    projectId,
    projectKey,
    sprintKey
}) => {
  return (
    <div>
      <h1>
        {projectTitle}
      </h1>
      <Button className="mt-2">
        Create New Sprint
      </Button>

    </div>
  )
}

export default SprintCreationForm
