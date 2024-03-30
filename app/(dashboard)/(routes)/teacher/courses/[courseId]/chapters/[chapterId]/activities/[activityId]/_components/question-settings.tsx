"use client";

import { Button } from "@/components/ui/button"
import { Combobox } from "@/components/ui/combobox"
import { Label } from "@/components/ui/label"
import { Trash } from "lucide-react"

export const QuestionSettings = () => {
  return (
    <div className='mt-6'>
      <div className="w-100">
        <Label className="pb-4">Select correct answer</Label>
        <Combobox
          options={[
            { label: 'Hello', value: 'hello' },
          ]}
          value='hello'
          onChange={() => {}}
        />
      </div>
      <div className="w-100 pt-6">
        <Button className='w-100' variant='destructive'>
          <Trash className="w-6 h-6 mx-2" />
          Delete question
        </Button>
      </div>
    </div>
  )
}