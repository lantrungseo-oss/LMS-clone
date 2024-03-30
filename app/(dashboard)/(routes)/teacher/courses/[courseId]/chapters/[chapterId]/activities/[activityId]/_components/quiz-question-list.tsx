"use client";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ListTodo, Trash } from "lucide-react";

const questionList = [
  {
    id: '0',
    question: 'What is the capital letter?'
  },
  {
    id: '1',
    question:'What is it man?'
  },
  {
    id: '2',
    question: 'What is the capital letter?'
  },
  {
    id: '3',
    question:'Hello world?'
  }
]

const currentId = '2'


export const QuizQuestionList = () => {
  return (
    <>
      {questionList.map((question) => {
        return (
          <div className={cn(
            'flex justify-between p-3 w-100',
            question.id === currentId && 'bg-slate-100'
          )} key={question.id}>
            
            <span className="flex items-center">
              <ListTodo className='w-4 h-4'/>
              <span className="px-2">{question.question}</span>
            </span>
            <span className="flex items-center gap-x-2 justify-end">
              <Trash className='w-4 h-4'/>
            </span>
          </div>
        )
      })}
      <div className='pt-2 text-center'>
        <Button>
          Add question
        </Button>
      </div>
    </>
  )
}