"use client";

import Editor from "@/components/editor"
import { Preview } from "@/components/preview"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent,DialogHeader } from "@/components/ui/dialog"
import { MULTI_CHOICE_QUESTION_TEMPLATE } from "@/core/frontend/constants";
import { IQuestion } from "@/core/frontend/entity-types";
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

export type TQuestionFormProps = {
  currentQuestion: IQuestion;
  setQuestionData: (setter: (initialQuestionData: IQuestion) => IQuestion) => void;
}

type TEditParams = {
  type: 'question' | 'option';
  optionIndex: number;
}

export const QuestionForm = (
  {
    currentQuestion,
    setQuestionData
  }: TQuestionFormProps
) => {
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editParams, setEditParams] = useState<TEditParams | null>(null)
  const [editValue, setEditValue] = useState<string>('')

  const onOptionAdded = () => {
    setQuestionData((question) => {
      const maxId = question.options.length > 0 ? Math.max(...question.options.map(option => option.id)) : 0;
      return {
        ...question,
        options: [
          ...question.options,
          {
            id: maxId + 1,
            text: MULTI_CHOICE_QUESTION_TEMPLATE.options[0].text
          }
        ]
      }
    })
  }

  const onQuestionEditClick = () => {
    setEditParams({
      type: 'question',
      optionIndex: -1
    })
    setEditValue(currentQuestion.question)
    setDialogOpen(true)
  }

  const onOptionEditClick = (optionIndex: number) => {
    setEditParams({
      type: 'option',
      optionIndex,
    })
    setEditValue(currentQuestion.options[optionIndex].text)
    setDialogOpen(true)
  }


  const onDialogOpenChange = (open: boolean) => {
    if(open) {
      setEditParams(params => params ?? null)
    } else {
      setEditParams(null)
    }
    setDialogOpen(open)
  }

  const onEditValueSaved = () => {
    if(editParams === null) {
      return
    }

    if(editParams.type === 'question') {
      setQuestionData((question) => ({
        ...question,
        question: editValue
      }))
    } else {
      setQuestionData((question) => {
        const newOptions = question.options.map((option, index) => {
          if(index === editParams.optionIndex) {
            return {
              ...option,
              text: editValue
            }
          }
          return option
        })
        return {
          ...question,
          options: newOptions
        }
      })
    }
    setDialogOpen(false)
  }

  const onOptionDelete = (optionIndex: number) => {
    setQuestionData((question) => {
      return {
        ...question,
        correctAnswerIndex: question.correctAnswerIndex !== optionIndex ? 0 : question.correctAnswerIndex,
        options: question.options.filter((option, index) => index !== optionIndex)
      }
    })
  }

  const deleteOptionDisabled = currentQuestion.options.length <= 2


  return (
    <>
      <div className='text-left max-w-[75%]'>
        <Preview value={currentQuestion.question}/>
        <Button variant='secondary' className="py-0 ml-3 my-0 max-h-5" onClick={onQuestionEditClick}>
          <Pencil className="w-3 h-3 p-0"/>
        </Button>
        <div>
          {currentQuestion.options.map((option, index) => {
            return (
              <div key={option.id} className="p-2">
                <div className="flex items-center p-0">
                  <div>
                    <Circle className="w-6 h-6"/>
                  </div>
                  <Preview value={option.text}/>
                </div>
                <div className="flex">
                  <div className="w-8"></div> {/* This is a placeholder */}
                  <div>
                    <Button variant='secondary' className="py-0 my-0 max-h-5" onClick={() => onOptionEditClick(index)}>
                      <Pencil className="w-3 h-3 p-0"/>
                    </Button>
                    <Button disabled={deleteOptionDisabled} variant='secondary' className="py-0 my-0 max-h-5" onClick={() => onOptionDelete(index)}>
                      <Trash className="w-3 h-3 p-0"/>
                    </Button>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
        <div className="pt-2">
          <Button onClick={onOptionAdded}>Add option</Button>
        </div>
      </div>
      <Dialog
        open={dialogOpen}
        onOpenChange={onDialogOpenChange}
      >
        <DialogContent className="p-4 mt-4">
          <DialogHeader>
            <DialogTitle>
              Edit question
            </DialogTitle>
          </DialogHeader>
          <Editor 
            value={editValue}
            onChange={(value) => setEditValue(value)}
          />
          <Button onClick={onEditValueSaved}>
            Save
          </Button>
        </DialogContent>
      </Dialog>
    </>
  )
  
}