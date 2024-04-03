"use client";

import { Button } from "@/components/ui/button"
import { Combobox } from "@/components/ui/combobox"
import { Label } from "@/components/ui/label"
import { IQuestion, IQuizData } from "@/core/frontend/entity-types";
import { Trash } from "lucide-react"
import { useMemo } from "react";

export type TQuestionSettingsProps = {
  currentQuestion?: IQuestion;
  setQuestionData: (setter: (initialQuestionData: IQuestion) => IQuestion) => void;
  onThisQuestionDelete: () => void;
}


export const QuestionSettings = (
  {
    currentQuestion,
    setQuestionData,
    onThisQuestionDelete
  }: TQuestionSettingsProps
) => {
  
  const answerOptions = useMemo(() => {
    return currentQuestion?.options.map(option => {
      return {
        label: new DOMParser()
          .parseFromString(option.text, "text/html")
          .documentElement.textContent ?? option.text,
        value: option.id.toString()
      }
    }) ?? [];
  }, [currentQuestion])

  const onCorrectAnswerSelected = (optionId: string) => {
    setQuestionData((question) => {
      const correctAnswerIndex = question.options.findIndex(option => option.id === parseInt(optionId));
      return {
        ...question,
        correctAnswerIndex: Math.max(correctAnswerIndex, 0)
      }
    })
  }

  return (
    <div className='mt-6'>
      <div className="w-100">
        <Label className="pb-4">Select correct answer</Label>
        <Combobox
          options={answerOptions}
          value={currentQuestion?.options[currentQuestion.correctAnswerIndex]?.id.toString() || ""}
          onChange={onCorrectAnswerSelected}
        />
      </div>
      <div className="w-100 pt-6">
        <Button className='w-100' variant='destructive' onClick={onThisQuestionDelete}>
          <Trash className="w-6 h-6 mr-2" />
          Delete question
        </Button>
      </div>
    </div>
  )
}