"use client";

import SliderPagination from "@/components/ui/slider-pagination";
import { QuestionForm } from "./question-form";
import Breadcrumbs from "@/components/ui/breadcrumbs";
import { QuestionSettings } from "./question-settings";
import { IQuestion, IQuizData } from "@/core/frontend/entity-types";
import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { QuizQuestionList } from "./quiz-question-list";
import toast from "react-hot-toast";
import axios from "axios";
import { useRouter } from "next/navigation";
import { BasicLoader } from "@/components/ui/basic-loader";

export type TActivityTextFormProps = {
  activityId: string;
  courseId: string;
  chapterId: string;
  quizData?: IQuizData;
}

export const ActivityQuizForm = (
  {
    activityId,
    courseId,
    chapterId,
    quizData: initialQuizData,
  }: TActivityTextFormProps
) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(initialQuizData?.questions.length && initialQuizData?.questions.length > 0 ? 0 : -1);
  const [isOnQuestionList, setIsOnQuestionList] = useState(currentQuestionIndex < 0);
  const [quizData, setQuizData] = useState<IQuizData>(() => {
    if (initialQuizData) {
      return {
        questions: initialQuizData.questions.map((question, index) => ({
          ...question,
          id: index,
          options: question.options.map((option, optIndex) => ({
            ...option,
            id: optIndex
          })),
        })),
      }
    }
    return { questions: [] }
  });

  const [isSaving, setIsSaving] = useState(false);

  const currentQuestion = useMemo(() => {
    if (currentQuestionIndex >= 0 && currentQuestionIndex < quizData.questions.length) {
      return quizData.questions[currentQuestionIndex];
    }
    return undefined;
  }, [currentQuestionIndex, quizData.questions])

  const onQuestionChosen = (questionIndex: number) => {
    setCurrentQuestionIndex(questionIndex);
    setIsOnQuestionList(false);
  }

  const onQuestionUpdate = (setter: (initialQuestionData: IQuestion) => IQuestion) => {
    setQuizData((quizData) => {
      return {
        questions: quizData.questions.map((question, index) => {
          if (index === currentQuestionIndex) {
            return setter(question);
          }
          return question;
        })
      }
    })
  }

  const breadcrumbPaths = useMemo(() => {
    if (isOnQuestionList || currentQuestionIndex < 0) {
      return [
        { label: 'Questions' },
      ]
    } else {
      return [
        { label: 'Questions', onClick: () => {setIsOnQuestionList(true)} },
        { label: `Question ${currentQuestionIndex+1}` },
      ]
    }
  }, [currentQuestionIndex, isOnQuestionList])

  const onQuestionDelete = (questionIndex: number) => {
    setQuizData((quizData) => {
      return {
        ...quizData,
        questions: quizData.questions.filter((question, index) => index !== questionIndex)
      }
    })

    if (currentQuestionIndex === questionIndex) {
      setCurrentQuestionIndex(-1);
      setIsOnQuestionList(true);
    }
  }

  const router = useRouter();

  const onQuizDataPersist = async () => {
    try {
      setIsSaving(true)
      await axios.patch(`/api/courses/${courseId}/chapters/${chapterId}/activities/${activityId}`, {
        quizData
      });
      toast.success('Quiz data saved');
      router.refresh();
    } catch {
      toast.error('Failed to save quiz data');
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <div className="h-100 w-100 grid grid-rows-[1fr_150px] grid-cols-12 grid-flow-col flex-1">
      {isSaving && <BasicLoader />}
      <div className="w-100 p-2 row-start-1 col-start-1 col-span-7 flex justify-center content-center"> 
        {currentQuestion ? <QuestionForm currentQuestion={currentQuestion} setQuestionData={onQuestionUpdate}/> : <small>Please select a question</small>}
      </div>
      <div className="w-100 p-2 row-start-2 col-start-1 col-span-7 flex justify-center">
        {quizData.questions.length > 0 && currentQuestion ? (
          <SliderPagination
            totalSlides={quizData.questions.length} currentSlide={currentQuestionIndex}
            onChange={(index: number) => setCurrentQuestionIndex(index)}
          />
        ): null}
        
      </div>
      <div className="w-100 py-2 px-4 row-start-1 col-start-8 row-span-2 col-span-5 border-l-2">
        <div className="flex items-center justify-between pb-5">
          <Breadcrumbs
            paths={breadcrumbPaths}
          />
          <Button onClick={() => onQuizDataPersist()}>
            Save
          </Button>
        </div>
        {(isOnQuestionList || !currentQuestion) ? <QuizQuestionList
          currentQuestionIndex={currentQuestionIndex}
          questions={quizData.questions}
          onQuestionClick={onQuestionChosen}
          setQuizData={setQuizData}
          onQuestionDelete={onQuestionDelete}
        /> : <QuestionSettings
          currentQuestion={currentQuestion}
          setQuestionData={onQuestionUpdate}
          onThisQuestionDelete={() => onQuestionDelete(currentQuestionIndex)}
        />}
      </div>
    </div>
  )
}