"use client";

import type { Course, LearningPlan, LearningPlanStep, LearningPlanStepCourse } from "@prisma/client";

type DetailFormProps = {
  learningPlan: LearningPlan & {
    steps: Array<LearningPlanStep & {
      stepCourses: Array<LearningPlanStepCourse & {
        course: Course
      }>
    }>
  }
}

const DetailForm = ({
  learningPlan
}: DetailFormProps) => {
  return (
    <>
      <div>
        {/** a form to edit title, a form to edit description */}
        
      </div>
    </>
  )
}

export default DetailForm;