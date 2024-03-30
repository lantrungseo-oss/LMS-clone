"use client";

import Editor from "@/components/editor"
import { Preview } from "@/components/preview"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent,DialogHeader } from "@/components/ui/dialog"
import { DialogTitle } from "@radix-ui/react-dialog"
import { Circle, Pencil, Trash } from "lucide-react"
import { useState } from "react"

const questionContent = {
  question: "<b>Chúng ta cần tải gì về để soạn thảo code?</b>",
  types: 'multiple-choice',
  answers: [
    {
      id: '1',
      text: "It has multiple things"
    },
    {
      text: "It has nothing",
      id: '2'
    },
    {
      text: "Hello world",
      id: '3'
    }
  ]
}

export const QuestionForm = () => {
  const [dialogOpen, setDialogOpen] = useState(false)
  return (
    <>
      <div className='text-left max-w-[75%]'>
        <Preview value={questionContent.question}/>
        <div>
          {questionContent.answers.map((answer) => {
            return (
              <div key={answer.id} className="p-2">
                <div className="flex items-center p-0">
                  <div>
                    <Circle className="w-6 h-6"/>
                  </div>
                  <Preview value={answer.text}/>
                </div>
                <div className="flex">
                  <div className="w-8"></div> {/* This is a placeholder */}
                  <div>
                    <Button variant='secondary' className="py-0 my-0 max-h-5" onClick={() => setDialogOpen(true)}>
                      <Pencil className="w-3 h-3 p-0"/>
                    </Button>
                    <Button variant='secondary' className="py-0 my-0 max-h-5">
                      <Trash className="w-3 h-3 p-0"/>
                    </Button>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
        <div className="pt-2">
          <Button>Add option</Button>
        </div>
      </div>
      <Dialog
        open={dialogOpen}
        onOpenChange={(open) => setDialogOpen(open)}
      >
        <DialogContent className="p-4 mt-4">
          <DialogHeader>
            <DialogTitle>
              Edit question
            </DialogTitle>
          </DialogHeader>
          <Editor 
            value={questionContent.question}
            onChange={(value) => console.log(value)}
          />
          <Button disabled>
            Save
          </Button>
        </DialogContent>
      </Dialog>
    </>
  )
  
}