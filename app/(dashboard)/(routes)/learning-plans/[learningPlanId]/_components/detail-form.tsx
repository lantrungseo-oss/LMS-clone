"use client";

import { CourseListSlider } from "@/components/course-list-slider";
import type { Course, LearningPlan, LearningPlanStep, LearningPlanStepCourse } from "@prisma/client";
import { Timeline } from "antd";
import { result } from "lodash";
import { useMemo } from "react";

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
  const items = useMemo(() => {
    return learningPlan.steps.map((stepData) => {
      return (
        <Timeline.Item key={stepData.id}>
          <h2 className="text-lg font-bold">{stepData.description}</h2>
          <div className="w-100">
            <CourseListSlider header={(<h4 className="font-bold">Recommended Course</h4>)} items={stepData.stepCourses.map(sc=>sc.course)} />
          </div>
        </Timeline.Item>
      );
    });
  }, [learningPlan])
  return (
    <>
      <div className="min-h-screen w-full flex flex-col items-center bg-gray-100">
        {/** a form to edit title, a form to edit description */}
        <h3 className="text-xl font-semibold mb-4 mt-10">{learningPlan.title}</h3>
        <p className="w-[80%] py-4">
          {learningPlan.description}
        </p>
        <div className="w-[79%] mt-5">
          <Timeline className="mt-4">
            {items}
          </Timeline>
        </div>
      </div>
    </>
  )
}

export default DetailForm;