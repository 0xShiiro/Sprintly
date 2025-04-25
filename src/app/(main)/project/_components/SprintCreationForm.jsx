"use client"
import { Button } from '@/components/ui/button'
import React, { useState } from 'react'
import { useForm, Controller } from 'react-hook-form';
import { createSprint } from '../../../../../actions/sprints';
import { zodResolver } from '@hookform/resolvers/zod';
import { addDays } from 'date-fns';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Popover, PopoverTrigger } from '@/components/ui/popover';
import { CalendarIcon } from 'lucide-react'
import { format } from 'date-fns';
import { PopoverContent } from '@/components/ui/popover';
import { DayPicker } from 'react-day-picker';
import "react-day-picker/style.css";
import "./styles.css"
import useFetch from '../../../../../hooks/use-fetch';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import { SprintSchema } from '@/app/lib/validators';
const SprintCreationForm = ({
  projectTitle,
  projectId,
  projectKey,
  sprintKey
}) => {
  const [showForm, setShowForm] = useState(false);
  const router = useRouter();
  const [dateRange, setDateRange] = useState({
    from: new Date(),
    to: addDays(new Date(), 14)
  })
  const { register, handleSubmit, formState: { errors }, control } = useForm({
    resolver: zodResolver(SprintSchema),
    defaultValues: {
      name: `${projectKey}-${sprintKey}`,
      startDate: dateRange.from,
      endDate: dateRange.to
    }
  })

  const {loading:sprintLoading,fn: createSprintfn} = useFetch(createSprint);
  const onSubmit=async(data)=>{
    await createSprintfn(projectId , {
      ...data,
      startDate: dateRange.from,
      endDate: dateRange.to
    })
    setShowForm(false);
    toast.success("Sprint Created Successfully");
    router.refresh()
  }
  return (
    <>
      <div className='flex justify-between'>
        <h1 className="text-5xl font-bold mb-8 gradient-title" >
          {projectTitle}
        </h1>
        <Button
          className={`${showForm ? "mt-2 bg-red-500 transition-all border-2 border-red-500 hover:bg-transparent hover:border-red-500 cursor-pointer  ease-in-out duration-600 " : "mt-2 bg-blue-500 transition-all hover:bg-transparent border-2 border-blue-500 hover:border-blue-500 cursor-pointer  ease-in-out duration-600 "}`}
          onClick={() => setShowForm(!showForm)}

        >
          {showForm ? "Cancel" : "Create New Sprint"}
        </Button>
      </div>
      {showForm && (
        <Card className='pt-4 mb-4'>
          <CardContent>
            <form className='flex gap-4 items-end' onSubmit={handleSubmit(onSubmit)}>
              <div className="flex-1" >
                <label
                  htmlFor="name"
                  className="block text-sm font-medium mb-1"
                >
                  Sprint Name
                </label>
                <Input
                  id="name"
                  readOnly
                  className='bg-slate-950 mt-2'
                  {...register("name")}
                />
                {errors.name && (
                  <p className='text-red-500 text-sm mt-1'>{errors.name.message}</p>
                )}
              </div>
              <div className='flex-1' >
                <label className='block text-sm font-medium mb-1'>
                  Sprint Duration
                </label>
                <Controller
                  control={control}
                  name="dateRange"
                  render={({ field }) => (

                    <Popover>
                      <PopoverTrigger asChild>
                        <Button variant="outline" className={`hover:bg-white hover:text-black transition-all ease-in-out duration-500 bg-slate-950 font-normal text-left justify-start w-full ${!dateRange && "text-muted-foreground"}`}>
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {dateRange.from && dateRange.to ? (
                            format(dateRange.from, 'LLL dd yyyy') +
                            '-' +
                            format(dateRange.to, 'LLL dd yyyy')
                          ) : (
                            <span>
                              Pick a Date
                            </span>
                          )}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent
                        className='w-auto bg-slate-900'
                        align="start"
                      >
                        <DayPicker
                          mode="range"
                          className="bg-slate-900 text-white"
                          modifiers={{
                            today: "border-2 border-blue-700 text-white rounded-full",
                          }}
                          modifiersClassNames={{
                            selected: "text-white rounded-full",
                            today: "text-white rounded-full",
                            range_start: "rounded-l-full",
                            range_end: "rounded-r-full",
                            range_middle: "",
                          }}
                          modifiersStyles={{
                            range_start: {
                              backgroundColor: "#1e40af", // dark blue
                              color: "white",
                            },
                            range_end: {
                              backgroundColor: "#1e40af",
                              color: "white",
                            },
                            range_middle: {
                              backgroundColor: "#3b82f6", // lighter blue
                              color: "white",
                            },
                            selected: {
                              backgroundColor: "#1e40af",
                            },
                            today: {
                              borderRadius: "50% !important",
                              backgroundColor: "blue",

                            }
                          }}
                          selected={dateRange}
                          onSelect={(range) => {
                            if (range?.from && range?.to) {
                              setDateRange(range);
                              field.onChange(range);
                            }
                          }}
                        />

                      </PopoverContent>
                    </Popover>

                  )}
                />
              </div>
              <Button 
                type="submit"
                className="bg-blue-500 hover:bg-transparent hover:border hover:border-white-1 transition-all ease-in-out duration-450"
                disabled={sprintLoading}
              >{sprintLoading ? "Creating...":"Create Sprint"} </Button>
            </form>
          </CardContent>
        </Card>
      )}

    </>
  )
}

export default SprintCreationForm
