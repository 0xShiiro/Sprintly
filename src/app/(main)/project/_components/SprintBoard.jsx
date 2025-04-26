'use client'
import React, { useState } from 'react'
import SprintManager from './SprintManager'
import { DragDropContext, Droppable } from '@hello-pangea/dnd'
import status from '../../../../../data/status.json'
import { Button } from '@/components/ui/button'
import { Plus } from 'lucide-react'
const SprintBoard = ({ sprints, projectId, orgId }) => {

  const [currentsprint, setcurrentsprint] = useState(
    sprints.find((sprint) => sprint.status === 'ACTIVE' || sprints[0])
  )
  const [isDrawerOpen, setisDrawerOpen] = useState(false);
  const [selectedStatus, setselectedStatus] = useState(null);
  const onDragEnd = () => {

  }
  const handleAddIssue = (status) => {
    setselectedStatus(status);
    setisDrawerOpen(true);
  }
  return (
    <div>
      {/* Sprint Manager */}
      <SprintManager
        sprint={currentsprint}
        setsprint={setcurrentsprint}
        sprints={sprints}
        projectId={projectId}
      />

      {/* Kanban board */}
      <DragDropContext onDragEnd={onDragEnd}>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 bg-slate-900 p-4 rounded-lg">
          {status.map((column) => {
            return (
              <Droppable key={column.key} droppableId={column.key}>
                {(provided) => {
                  return (
                    <div {...provided.droppableProps}
                      ref={provided.innerRef}
                      className="space-y-2"
                    >
                      <h3 className="font-semibold text-center" >
                        {column.name}
                      </h3>

                      {/* iSSUES */}
                      {provided.placeholder}
                      {column.key === "TODO" &&
                        currentsprint.status !== "COMPLETED" && (
                          <Button variant="ghost" className="w-full" onClick={() => {handleAddIssue(column.key)}}>
                            <Plus className="mr-2 h-4 w-4" />
                            Create Issue
                          </Button>
                        )

                      }
                    </div>
                  )
                }}
              </Droppable>
            )
          })}
        </div>
      </DragDropContext>

    </div>
  )
}

export default SprintBoard
