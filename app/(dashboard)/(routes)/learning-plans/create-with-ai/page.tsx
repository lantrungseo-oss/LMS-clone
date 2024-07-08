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
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { useRouter } from "next/navigation";

// Mock data for courses

type RecommendationResult = {
  step: string;
  recommendedCourses: Course[];
  otherCourses: Course[];
}[];

const CreateWithAIPage = () => {
  const [inputValue, setInputValue] = useState("");
  const [userQuery, setUserQuery] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [isTriggering, setIsTriggering] = useState(false);
  const [isSavingDialogOpen, setIsSavingDialogOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [recResult, setRecResult] = useState<RecommendationResult>([]);

  const router = useRouter();

  const triggerLearningPlanRecommendation = () => {
    setRecResult([])
    setIsTriggering(true);
    setUserQuery(inputValue);
    axios.post('/api/learning-path/recommendation', {
      userQuery: inputValue,
      mainRecCount: 2,
      otherCount: 0,
    }).then((response) => {
      setRecResult(response.data);
    })
    .catch(err => toast.error(err.response.data.message))
    .finally(() => {
      setIsTriggering(false);
    })
  }

  const startSaveLearningPlan = () => {
    setIsSavingDialogOpen(true);
  }

  const saveLearningPlan = () => {
    setIsSaving(true);
    axios.post('/api/learning-path/crud', {
      title,
      description: userQuery,
      steps: recResult.map(result => ({
        description: result.step,
        courseIds: result.recommendedCourses.map(course => course.id),
      }))
    }).then((res) => {
      toast.success("Learning plan saved!");
      if(res.data.id) {
        router.push(`/learning-plans/${res.data.id}`);
      }
      setIsSavingDialogOpen(false);
    })
    .catch(err => toast.error(err.response?.data?.message))
    .finally(() => setIsSaving(false))
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
    <>
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
        {isTriggering && (
          <Banner variant="info" label="Patient, your learning plan is being generated ..." />
        )}
        {recResult.length > 0 && (
          <>
            <Banner className="mb-10" variant="success" label={<><span>Love the learning plan?</span> <Button onClick={startSaveLearningPlan} className="mx-5" variant={'secondary'}>Save it!</Button></>} />
            <Timeline className="mt-4">
              {items}
            </Timeline>
          </>
        )}
      </div>
    </div>
    <Dialog onOpenChange={(open) => setIsSavingDialogOpen(open)} open={isSavingDialogOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Save learning plan</DialogTitle>
        </DialogHeader>
        <DialogDescription>
          <Label>
            Set learning plan's title
          </Label>
          <Input className="mt-4" value={title} onChange={(e) => setTitle(e.target.value)} />
          {isSaving && <Banner className="mt-7" variant="info" label="Patient, your learning plan is being saved..." />}
        </DialogDescription>
        <DialogFooter>
          <Button onClick={() => setIsSavingDialogOpen(false)} variant={"ghost"}>Cancel</Button>
          <Button onClick={saveLearningPlan} variant="default" disabled={isSaving}>Save</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
    </>
  );
};

export default CreateWithAIPage;
