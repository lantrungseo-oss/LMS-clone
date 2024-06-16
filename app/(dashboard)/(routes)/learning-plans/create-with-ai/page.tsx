"use client";

import React, { useMemo, useState } from "react";
import { Timeline } from 'antd';
import { Textarea } from "@/components/ui/textarea";
import { Course } from "@prisma/client";
import { Button } from "@/components/ui/button";
import { CourseListSlider } from '@/components/course-list-slider'
import axios from "axios";
import { Banner } from "@/components/banner";
import toast from "react-hot-toast";

// Mock data for courses

type RecommendationResult = {
  step: string;
  recommendedCourses: Course[];
  otherCourses: Course[];
}[];

const CreateWithAIPage = () => {
  const [inputValue, setInputValue] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [isTriggering, setIsTriggering] = useState(false);
  const [recResult, setRecResult] = useState<RecommendationResult>([]);

  const triggerLearningPlanRecommendation = () => {
    setIsTriggering(true);
    axios.post('/api/learning-path/recommendation', {
      userQuery: inputValue,
      mainRecCount: 2,
      otherCount: 3,
    }).then((response) => {
      setRecResult(response.data);
    })
    .catch(err => toast.error(err.response.data.message))
    .finally(() => {
      setIsTriggering(false);
    })
  }

  const saveLearningPlan = () => {
    setIsSaving(true);
    // Save learning plan here
    axios.post('/api/learning-path/create-or-edit', {
      
    })
    setIsSaving(false);
  }

  const items = useMemo(() => {
    return recResult.map((result) => {
      return (
        <Timeline.Item key={result.step}>
          <h2 className="text-lg font-bold">{result.step}</h2>
          <div className="w-100">
            <CourseListSlider header={(<h4 className="font-bold">Recommended Course</h4>)} items={result.recommendedCourses} />
          </div>
          {result.otherCourses.length > 0 && (
            <div className="w-100 overflow-x-auto">
              <CourseListSlider header={<h4 className="font-bold">Other Courses</h4>} items={result.otherCourses} />
            </div>
          )}
        </Timeline.Item>
      );
    });
  }, [recResult])

  return (
    <div className="min-h-screen w-full flex flex-col items-center bg-gray-100">
      <h3 className="text-xl font-semibold mb-4 mt-10">Curate your own learning plan</h3>
      <div className="w-full flex flex-col items-center">
        <Textarea
          value={inputValue}
          className="w-[80%] py-4"
          placeholder="Enter your request/desire...For example: 'I have basic knowledge in HTML/CSS now. I want to learn React'"
          onChange={(e) => setInputValue(e.target.value)}
        />
        <Button className="mt-4" onClick={() => triggerLearningPlanRecommendation()}>
          Submit
        </Button>
      </div>
      <div className="w-[79%] mt-5">
        {recResult.length > 0 && (
          <>
            <Banner className="mb-10" variant="success" label={<><span>Love the learning plan?</span> <Button className="ml-5" variant={'secondary'}>Save it!</Button></>} />
            <Timeline className="mt-4">
              {items}
            </Timeline>
          </>
        )}

        {isTriggering && (
          <Banner variant="info" label="Patient, your learning plan is being generated ..." />
        )}
      </div>
    </div>
  );
};

export default CreateWithAIPage;
