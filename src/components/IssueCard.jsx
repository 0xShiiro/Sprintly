import React,{useState} from 'react'
import UserAvatar from './UserAvatar'
import { Badge } from './ui/badge'
import { formatDistanceToNow } from 'date-fns'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from './ui/card'

const priorityColor = {
    LOW: "border-green-600",
    MEDIUM: "border-yellow-300",
    HIGH: "border-orange-400",
    URGENT: "border-red-400",
}
const IssueCard = ({
    issue,
    showStatus = false,
    onDelete = () => { },
    onUpdate = () => { },

}) => {
    const [isDialogOpen, setisDialogOpen] = useState(false)
    const created = formatDistanceToNow(new Date(issue.createdAt), {
        addSuffix: true,
    })
    return (
        <>
            <Card className={`issue-card ${priorityColor[issue.priority]} cursor-pointer hover:shadow-md transition-shadow bg-slate-950`} >
                <CardHeader  >
                    <CardTitle>{issue.title}</CardTitle>
                </CardHeader>
                <CardContent className="flex gap-2" >
                    {showStatus && (<Badge variant="outline" className="-ml-1">\
                        {issue.priority}
                    </Badge>)}
                </CardContent>
                <CardFooter className="flex flex-col items-start space-y-3" >
                    <UserAvatar user={issue.assignee} />
                    <div className='text-xs text-gray-400 w-full' >
                        Created {created}
                    </div>
                </CardFooter>
            </Card>
            {isDialogOpen && (
                <>
                </>
            )}
        </>
    )
}

export default IssueCard
