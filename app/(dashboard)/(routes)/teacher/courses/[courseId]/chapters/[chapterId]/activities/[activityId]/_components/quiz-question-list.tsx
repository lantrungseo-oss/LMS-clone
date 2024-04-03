"use client";

import { Button } from "@/components/ui/button";
import { MULTI_CHOICE_QUESTION_TEMPLATE } from "@/core/frontend/constants";
import { IQuestion, IQuizData } from "@/core/frontend/entity-types";
import { cn } from "@/lib/utils";
import { ListTodo, Trash } from "lucide-react";

export type TQuizQuestionListProps = {
  questions: IQuestion[];
  currentQuestionIndex: number;
  onQuestionClick: ((questionIndex: number) => void);
  setQuizData: (setter: (initialQuizData: IQuizData) => IQuizData) => void;
  onQuestionDelete: (questionIndex: number) => void;
}


export const QuizQuestionList = ({
  questions: questionList,
  currentQuestionIndex,
  onQuestionClick,
  onQuestionDelete,
  setQuizData
}: TQuizQuestionListProps) => {

  const onQuestionAdd = () => {
    setQuizData((quizData) => {
      const maxId = quizData.questions.length > 0 ? Math.max(...quizData.questions.map(question => question.id)) : 0;
      return {
        questions: [
          ...quizData.questions,
          {
            ...MULTI_CHOICE_QUESTION_TEMPLATE,
            id: maxId + 1
          }
        ]
      }
    })
    onQuestionClick(questionList.length);
  }

  const onQuestionDeleteClick = (questionIndex: number) => {
    onQuestionDelete(questionIndex);
  }

  return (
    <>
      {questionList.length > 0 ? questionList.map((question, index) => {
        const questionText = new DOMParser()
          .parseFromString(question.question, "text/html")
          .documentElement.textContent;
        return (
          <div className={cn(
            'flex justify-between p-3 w-100 cursor-pointer',
            index === currentQuestionIndex && 'bg-slate-100'
          )} key={question.id}>
            
            <button className="flex items-center grow" onClick={() => onQuestionClick(index)}>
              <ListTodo className='w-4 h-4'/>
              <span className="px-2 font-medium">{questionText}</span>
            </button>
            <button className="flex items-center gap-x-2 justify-end grow-0" onClick={() => onQuestionDeleteClick(index)}>
              <Trash className='w-4 h-4'/>
            </button>
          </div>
        )
      }) : <small>No questions found. Please add some questions</small>}
      <div className='pt-2 text-center'>
        <Button onClick={onQuestionAdd}>
          Add question
        </Button>
      </div>
    </>
  )
}