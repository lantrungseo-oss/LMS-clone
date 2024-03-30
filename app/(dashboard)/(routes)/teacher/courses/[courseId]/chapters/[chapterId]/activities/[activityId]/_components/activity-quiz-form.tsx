"use client";

import SliderPagination from "@/components/ui/slider-pagination";
import { QuestionForm } from "./question-form";
import Breadcrumbs from "@/components/ui/breadcrumbs";
import { QuestionSettings } from "./question-settings";


export const ActivityQuizForm = () => {
  return (
    <div className="h-100 w-100 grid grid-rows-[1fr_150px] grid-cols-12 grid-flow-col flex-1">
      <div className="w-100 p-2 row-start-1 col-start-1 col-span-7 flex justify-center content-center">  
        <QuestionForm />
      </div>
      <div className="w-100 p-2 row-start-2 col-start-1 col-span-7 flex justify-center">
        <SliderPagination totalSlides={10} currentSlide={3}/>
      </div>
      <div className="w-100 py-2 px-4 row-start-1 col-start-8 row-span-2 col-span-5 border-l-2">
        <Breadcrumbs
          paths={[
            { label: 'Questions' },
            { label: 'Question 1'}
          ]}
        ></Breadcrumbs>
        <QuestionSettings />
        {/* <QuizQuestionList /> */}
      </div>
    </div>
  )
}