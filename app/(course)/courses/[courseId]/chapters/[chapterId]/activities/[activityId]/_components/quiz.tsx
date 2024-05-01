"use client";

import { IQuizData, QuizStudentAnswerData } from "@/core/frontend/entity-types";
import React, { use, useState } from 'react';
import { Root as RadioGroupRoot, RadioGroupItem, Indicator as RadioGroupIndicator } from '@radix-ui/react-radio-group';
import { Circle, CheckCircle } from 'lucide-react';
import classNames from 'classnames';
import { Preview } from "@/components/preview";
import SliderPagination from "@/components/ui/slider-pagination";
import { Button } from "@/components/ui/button";

type QuizProps = {
  data: IQuizData;
  studentAnswers?: QuizStudentAnswerData;
}

export const Quiz = ({ data, studentAnswers: initialStudentAnswers }: QuizProps) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(data.questions.length > 0 ? 0 : -1);
  const [studentAnswers, setStudentAnswers] = useState<QuizStudentAnswerData>(initialStudentAnswers ?? { answerMap: {} })

  const onCurrentQuestionChange = (qIndex: number) => {
    setCurrentQuestionIndex(qIndex)
  }

  const setAnswer = (optionId: number | string, questionId: number | string) => {
    const questionData = data.questions.find(q => q.id.toString() === questionId.toString());
    if(!questionData) {
      return;
    }

    const optionIndex = questionData.options.findIndex(o => o.id.toString() === optionId.toString());
    if(optionIndex === -1) {
      return;
    }
    setStudentAnswers((prev) => {
      return {
        answerMap: {
          ...prev.answerMap,
          [questionId.toString()]: { chosenOptionIndex: optionIndex }
        }
      }
    })
  }


  if(data.questions.length === 0) {
    return <div>No questions. Please ask the teacher to add some questions here</div>
  }
  return (
    <div className="flex flex-col w-5/6 p-8 h-full items-stretch">
      <div className="flex-1 w-full">
        <div className="py-2">
          <Preview value={data.questions[0].question} />
        </div>
        <RadioGroupRoot onValueChange={(optionId: string) => setAnswer(optionId, currentQuestionIndex)}>
          <div className='flex flex-col'>
            {data.questions[currentQuestionIndex].options.map((o, index) => {
              const isChosenAnswer = studentAnswers.answerMap[currentQuestionIndex.toString()]?.chosenOptionIndex === index
              return (
                <RadioGroupItem key={o.id} value={o.id.toString()}>
                  <div className="flex items-center p-2">
                    <div>
                      {isChosenAnswer ? <CheckCircle className="w-5 h-5"/> : <Circle className="w-5 h-5"/>}
                    </div>
                    <Preview value={o.text}/>
                  </div>
                </RadioGroupItem>
              )
            })}
          </div>
        </RadioGroupRoot>
      </div>
      <div className='flex-none self-center'>
        <SliderPagination totalSlides={data.questions.length} currentSlide={currentQuestionIndex} onChange={onCurrentQuestionChange} />
      </div>
      <div className='flex-none self-center py-3'>
        <Button onClick={() => console.log(studentAnswers)}>Submit</Button>
      </div>
    </div>
  );
};

