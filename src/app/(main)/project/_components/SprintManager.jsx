'use client'
import { isBefore, isAfter, format, formatDistanceToNow } from 'date-fns'
import React, { useState ,useEffect} from 'react'
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import useFetch from '../../../../../hooks/use-fetch'
import { updateSprintStatus } from '../../../../../actions/sprints'
import { ClimbingBoxLoader } from 'react-spinners'

const SprintManager = ({ sprint, setsprint, sprints, projectId }) => {
    const [status, setstatus] = useState(sprint.status)

    const startDate = new Date(sprint.startDate)
    const endDate = new Date(sprint.endDate)
    const today = new Date()
    const canStart = isBefore(today, endDate) && isAfter(today, startDate) && sprint.status === 'PLANNED';

    const canEnd = status === 'ACTIVE';
    const iscompleted = status === 'COMPLETED';
    const {
        fn:updateStatus,
        loading,
        error,
        data:updatedStatus
    } = useFetch(updateSprintStatus);

    const handleStatusChange = async (newStatus) => {
        updateStatus(sprint.id, newStatus)

    }
    useEffect(() => {
        if(updatedStatus && updatedStatus.success){
            setstatus(updatedStatus.sprint.status)
            setsprint({
                ...sprint,
                status: updatedStatus.sprint.status
            });
        }
    },[updatedStatus,loading])
    const handleSprintChange = (value) => {
        const selectedSprint = sprints.find((s) => s.id === value)
        if (selectedSprint) {
            setsprint(selectedSprint)
        }
        setstatus(selectedSprint.status)
    }
    const getStatus = () => {
        if (status === 'COMPLETED') {
            return `Sprint Ended`
        } else if (status === "ACTIVE" && isAfter(today, endDate)) {
            return `Overdue by ${formatDistanceToNow(endDate)}`;
        } else if (status === "PLANNED" && isBefore(today, startDate)) {
            return `Sprint Starts in ${formatDistanceToNow(startDate)}`;
        } else {
            return null
        }
    }



    return (
        <>
            <div className='flex justify-between items-center gap-4' >
                <Select value={sprint.id} onValueChange={handleSprintChange}>
                    <SelectTrigger className="bg-slate-950 self-start w-full">
                        <SelectValue placeholder="Select Sprint" />
                    </SelectTrigger>
                    <SelectContent>
                        {sprints.map((sprint) => (
                            <SelectItem key={sprint.id} value={sprint.id} className="bg-slate-950 self-start w-full hover:cursor-pointer">
                                {sprint.name} ({format(sprint.startDate, "MMM d,yyyy")}) to{" "}
                                {format(sprint.startDate, "MMM d,yyyy")}
                            </SelectItem>
                        ))}

                    </SelectContent>
                </Select>

                {canStart && (
                    <Button className="bg-green-600 text-white transition-all ease-in-out duration-500 hover:bg-green-800"
                    onClick={()=> handleStatusChange("ACTIVE")}
                    disabled={loading}
                    >Start Sprint</Button>
                )}
                {canEnd && (
                    <Button className="bg-red-600 text-white transition-all ease-in-out duration-500 hover:bg-red-800"
                        onClick={()=> handleStatusChange("COMPLETED")}
                        disabled={loading}
                    >End Sprint</Button>
                )}
                {iscompleted && (
                    <Button className="bg-green-600 text-white rounded-lg "
                        // disabled
                    >Completed</Button>
                )}

            </div>
            {loading && (
                <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm bg-black/30">
                <ClimbingBoxLoader className="mt-4 " size={25} color="#36d7b7" />
              </div>
            )}
            {getStatus() && (
                <Badge className="bg-white mt-3 ml-1 self-start text-black">{getStatus()}</Badge>
            )}
        </>
    )
}

export default SprintManager
