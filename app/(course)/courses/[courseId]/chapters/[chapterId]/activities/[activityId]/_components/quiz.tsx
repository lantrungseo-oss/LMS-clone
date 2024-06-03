"use client";

import { IQuizData, QuizStudentAnswerData } from "@/core/frontend/entity-types";
import React, { useContext, useMemo, useState } from 'react';
import { Root as RadioGroupRoot, RadioGroupItem } from '@radix-ui/react-radio-group';
import { Circle, CheckCircle } from 'lucide-react';
import { Preview } from "@/components/preview";
import SliderPagination from "@/components/ui/slider-pagination";
import { Button } from "@/components/ui/button";
import { QuizStarter } from "./quiz-starter";
import { CourseContext } from "@/app/(course)/courses/[courseId]/_contexts/course-context";
import axios from "axios";
import { useRouter } from "next/navigation";

type QuizProps = {
  data: IQuizData;
  studentAnswers?: QuizStudentAnswerData;
  isCompleted?: boolean;
}

export const Quiz = ({ data, studentAnswers: initialStudentAnswers, isCompleted }: QuizProps) => {
  const courseCtx = useContext(CourseContext);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [started, setStarted] = useState(false);
  const [listOfMissingQuestions, setListOfMissingQuestions] = useState<number[]>([]); // [1, 2, 3, 4, 5]
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(data.questions.length > 0 ? 0 : -1);
  const [studentAnswers, setStudentAnswers] = useState<QuizStudentAnswerData>(initialStudentAnswers ?? { answerMap: {} })
  const currentQuestion = data.questions[currentQuestionIndex];

  const score = useMemo(() => {
    if(!isCompleted) {
      return undefined;
    }
    const correctAnswers = data.questions.filter(q => {
      const studentAnswer = initialStudentAnswers?.answerMap[q.id.toString()];
      if(!studentAnswer) {
        return false;
      }
      return studentAnswer.chosenOptionIndex === q.correctAnswerIndex;
    })
    return correctAnswers.length;
  }, [initialStudentAnswers, isCompleted])

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

  if(!started) {
    return <QuizStarter
      questionCount={data.questions.length}
      score={score}
      onStarted={() => setStarted(true)}
    />
  }

  const handleSubmitQuiz = () => {
    const missingQuestions = data.questions.filter(q => !studentAnswers.answerMap[q.id.toString()]);
    if(missingQuestions.length > 0) {
      setListOfMissingQuestions(missingQuestions.map(q => q.id));
      return
    }
    setListOfMissingQuestions([]);
    setIsSubmitting(true);
    if(courseCtx) {
      axios.post(`/api/courses/${courseCtx?.courseId}/chapters/${courseCtx.chapterId}/activities/${courseCtx?.activityId}/quiz-completion`, {
        quizData: studentAnswers,
        isCompleted: true
      })
        .then(() => {
          window.location.reload();
        })
    }
   
  }

  return (
    <>
    <div className="flex flex-col w-5/6 p-8 h-full items-stretch">
      <div className="flex-1 w-full">
        <div className="py-2">
          <Preview value={data.questions[0].question} />
        </div>
        <RadioGroupRoot onValueChange={(optionJson: string) => {
          const { questionId, optionId } = JSON.parse(optionJson);
          setAnswer(optionId, questionId);
        }}>
          <div className='flex flex-col'>
            {data.questions[currentQuestionIndex].options.map((o, index) => {
              const isChosenAnswer = studentAnswers.answerMap[currentQuestion.id.toString()]?.chosenOptionIndex === index
              return (
                <RadioGroupItem key={`${currentQuestion.id}-${o.id}`} value={JSON.stringify({ questionId: currentQuestion.id, optionId: o.id })}>
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
      {listOfMissingQuestions.length > 0 && <div className="text-red-500 self-center">
            Missing answers for all questions: {listOfMissingQuestions.join(', ')}
          </div>}
      <div className='flex-none self-center py-3'>
        <Button disabled={isSubmitting} onClick={handleSubmitQuiz}>Submit</Button>
      </div>
    </div>
    
    </>
  );
};

