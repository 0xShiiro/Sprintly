'use client'
import React, { useState, useEffect } from 'react'
import SprintManager from './SprintManager'
import { DragDropContext, Draggable, Droppable } from '@hello-pangea/dnd'
import status from '../../../../../data/status.json'
import { Button } from '@/components/ui/button'
import { Plus } from 'lucide-react'
import CreateIssue from './CreateIssue'
import useFetch from '../../../../../hooks/use-fetch'
import { getIssuesforSprint,updateIssueOrder } from '../../../../../actions/issues'
import IssueCard from '@/components/IssueCard'
import { toast } from 'sonner'
import { BarLoader, ClimbingBoxLoader } from 'react-spinners'
import BoardFilters from './BoardFilters'
const reorder = (list, startIndex, endIndex) => {
  const result = Array.from(list);
  const [removed] = result.splice(startIndex, 1);
  result.splice(endIndex, 0, removed);
  return result;
}
const SprintBoard = ({ sprints, projectId, orgId }) => {

  const [currentsprint, setcurrentsprint] = useState(
    sprints.find((sprint) => sprint.status === 'ACTIVE' || sprints[0])
  )
  const [isDrawerOpen, setisDrawerOpen] = useState(false);
  const [selectedStatus, setselectedStatus] = useState(null);
  const onDragEnd = (result) => {
    if (currentsprint.status === "COMPLETED") {
      toast.warning("Cannot update issues in completed sprint")
      return;
    }
    if (currentsprint.status === "PLANNED") {
      toast.warning("Start the sprint to update issues")
      return;
    }
    const { destination, source } = result;
    if (!destination) {
      return;
    }
    if (
      destination.droppableId === source.droppableId
      && destination.index === source.index) {
      return;
    }
    const newOrderedData = [...issues];

    //fetching the source and destination lists
    const sourceList = newOrderedData.filter(
      (issue) => issue.status === source.droppableId
    );
    const destinationList = newOrderedData.filter(
      (issue) => issue.status === destination.droppableId
    );
    //if the source and destination are same
    if (source.droppableId === destination.droppableId) {
      const reorderedList = reorder(
        sourceList,
        source.index,
        destination.index
      )
      reorderedList.forEach((issue, index) => {
        issue.order = index;
      })
      const sortedIssues = newOrderedData.sort((a, b) => a.order - b.order)
      setIssues(sortedIssues, sortedIssues);
      //if the source and destination are different
    } else {
      // removed Card from the source list
      const [removed] = sourceList.splice(source.index, 1);
      //Assigned new Status to the removed card
      removed.status = destination.droppableId;
      //Added the removed card to the destination list
      destinationList.splice(destination.index, 0, removed);

      //Updating the order of the source list
      sourceList.forEach((issue, index) => {
        issue.order = index;
      })
      //Updating the order of the destination list
      destinationList.forEach((issue, index) => {
        issue.order = index;
      })
      //Updating the new ordered data
      const sortedIssues = newOrderedData.sort((a, b) => a.order - b.order);
      setIssues(newOrderedData, sortedIssues);
      //Updating the order of the issues in the database
      updateIssuesFn(sortedIssues).then(() => {
        toast.success("Issues updated successfully");
      }).catch(() => {
        toast.error("Failed to update issues");
      });
    }
  }
  const handleAddIssue = (status) => {
    setselectedStatus(status);
    setisDrawerOpen(true);

  }

  const {
    loading: isFetchingIssues,
    fn: fetchIssuesFn,
    error: fetchIssuesError,
    data: issues,
    setData: setIssues,
  } = useFetch(getIssuesforSprint)

  const {
    loading: isUpdatingIssues,
    fn: updateIssuesFn,
    error: updateIssuesError,
  } = useFetch(updateIssueOrder)

  const [filterIssues, setfilterIssues] = useState(issues);

  const handleFilterChange =(newFilteredIssues) =>{
    setfilterIssues(newFilteredIssues);
  }

  useEffect(() => {
    if (currentsprint.id) {
      fetchIssuesFn(currentsprint.id)
    }
  }, [currentsprint.id])
  useEffect(() => {
    setfilterIssues(issues);
  }, [issues]);
  const handleIssueCreated = () => {
    fetchIssuesFn(currentsprint.id);
  }
  if (fetchIssuesError) {
    return (
      <div>
        Error Loading Issues...
      </div>
    )
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

      {issues && !isFetchingIssues &&(
        <BoardFilters issues={issues} onFilterChange={handleFilterChange} />
      )}
      {isUpdatingIssues && (
        <BarLoader className='mt-4' width={'100%'} color="#36d7b7" />
      )}
      {(isFetchingIssues) && (
        <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm bg-black/30">
          <ClimbingBoxLoader className="mt-4 " size={25} color="#36d7b7" />
        </div>
      )}
      {updateIssuesError && (
        toast.error(`Failed to update issues : ${updateIssuesError.message}`)
      )}
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
                      className="space-y-4 "
                    >
                      <h3 className="font-semibold text-center" >
                        {column.name}
                      </h3>

                      {/* iSSUES */}
                      {issues?.filter((issue) => issue.status === column.key)
                        .map((issue, index) => (
                          <Draggable
                            key={issue.id}
                            draggableId={issue.id}
                            index={index}
                            isDragDisabled={isUpdatingIssues}
                          >
                            {(provided) => (

                              <div
                                ref={provided.innerRef}
                                {...provided.draggableProps}
                                {...provided.dragHandleProps}

                              >
                                <IssueCard issue={issue} 
                                  onDelete={()=>fetchIssuesFn(currentsprint.id)}
                                  onUpdate={(updated)=>{
                                    setIssues((issues)=>{
                                      issues.map((issue)=>{
                                        if(issue.id === updated.id){
                                          return updated;
                                        }
                                        return issue;
                                      })
                                    })
                                  }}
                                />
                              </div>

                            )}
                          </Draggable>
                        ))}
                      {provided.placeholder}
                      {column.key === "TODO" &&
                        currentsprint.status !== "COMPLETED" && (
                          <Button className="w-full border-white bg-red-500 hover:bg-red-900 hover:font-bold" onClick={() => { handleAddIssue(column.key) }}>
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
      <CreateIssue
        isOpen={isDrawerOpen}
        onClose={() => setisDrawerOpen(false)}
        sprintId={currentsprint.id}
        status={selectedStatus}
        projectId={projectId}
        onIssueCreated={handleIssueCreated}
        orgId={orgId}
      />
    </div>
  )
}

export default SprintBoard
