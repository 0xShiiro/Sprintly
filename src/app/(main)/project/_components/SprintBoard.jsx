'use client'
import React,{useState} from 'react'
import SprintManager from './SprintManager'
const SprintBoard = ({sprints,projectId,orgId}) => {

  const [currentsprint, setcurrentsprint] = useState(
    sprints.find((sprint) => sprint.status === 'ACTIVE' || sprints[0])
  )
  return (
    <div>
      {/* Sprint Manager */}
      <SprintManager
        sprint={currentsprint}
        setsprint={setcurrentsprint}
        sprints={sprints}
        projectId={projectId}
        />
    </div>
  )
}

export default SprintBoard
