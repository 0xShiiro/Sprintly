import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select'
import { Input } from '@/components/ui/input';
import React, { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';
import { preconnect } from 'react-dom';

const priorityOptions = ["LOW", "MEDIUM", "HIGH", "URGENT"];
const BoardFilters = ({ issues, onFilterChange }) => {
  const [searchTerm, setsearchTerm] = useState("");
  const [selectedAssignee, setSelectedAssignee] = useState([]);
  const [selectedPriority, setSelectedPriority] = useState("");

  const assignees = issues.map((issue) => issue.assignee).filter(
    (item, index, self) => index === self.indexOf((t) => t.id === item.id)
  );
  const isFilterApplied =
    searchTerm !== "" || selectedAssignee.length > 0 || selectedPriority !== "";

  const clearFilters = () => {
    setsearchTerm("");
    setSelectedAssignee([]);
    setSelectedPriority("");
  }

  useEffect(() => {
    const filteredIssues = issues.filter((issue) => {
      const matchesSearchTerm = issue.title.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesAssignee = selectedAssignee.length === 0 || selectedAssignee.some(assignee => assignee.id === issue.assignee.id);
      const matchesPriority = selectedPriority === "" || issue.priority === selectedPriority;
      return matchesSearchTerm && matchesAssignee && matchesPriority;
    });
    onFilterChange(filteredIssues);
  }, [issues, searchTerm, selectedAssignee, selectedPriority]);

  const toggleAssignee = (assigneeId) => {
    setSelectedAssignee((prev) =>
      prev.includes(assigneeId)
        ? prev.filter(id => id !== assigneeId)
        : [...prev, assigneeId]
    )
  }

  return (
    <div>
      <div className="flex flex-col pr-2 sm:flex-row gap-4 sm:gap-6 mt-6">
        <Input
          className="w-full sm:w-27"
          placeholder="Search issues..."
          value={searchTerm}
          onChange={(e) => setsearchTerm(e.target.value)}
        />
        <div className="flex-shrink-0">
          <div className='flex gap-2 flex-wrap' >
            {assignees?.map((assignee, i) => {
              const selected = selectedAssignee.includes(assignee.id);
              return (
                <div key={assignee.id}
                  className={`rounded-full ring ${selected ? "ring-blue-600" : "ring-black"
                    } ${i > 0 ? "-ml-6" : ""} cursor-pointer`}
                  style={{
                    zIndex: i
                  }}
                  onClick={() => toggleAssignee(assignee.id)}
                >
                  <Avatar className="h-10 w-10">
                    <AvatarImage src={assignee.imageUrl} alt="User" />
                    <AvatarFallback>{assignee.name[0]}</AvatarFallback>
                  </Avatar>
                </div>
              )
            })}
          </div>
        </div>
        <Select value={selectedPriority} onValueChange={setSelectedPriority}>
          <SelectTrigger className="w-full sm:w-52">
            <SelectValue placeholder="Select priority" />
          </SelectTrigger>
          <SelectContent>
            {
              priorityOptions.map((priority) => (
                <SelectItem key={priority} value={priority} className='bg-black'>
                  {priority}
                </SelectItem>
              ))

            }
          </SelectContent>
        </Select>

        {
            isFilterApplied && (
            <Button
              variant="ghost"
              onClick={clearFilters}
              className="flex items-center"
            >
              <X className="h-4 w-4 mr-2" /> Clear Filters
            </Button>
          )
        }
      </div>
    </div>
  )
}

export default BoardFilters
