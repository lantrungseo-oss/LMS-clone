"use client";

import { useCallback, useContext, useMemo, useState } from "react";
import axios from 'axios';
import { CourseContext } from "../../../_contexts/course-context";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

export const MarkCompleteButton = () => {
  const courseCtx = useContext(CourseContext);
  const [isSettingCompletion, setIsSettingCompletion] = useState(false);
  const router = useRouter();

  const btnText = useMemo(() => {
    if(!courseCtx?.activityId) {
      return "Next";
    }
    return courseCtx?.isActivityCompleted(courseCtx?.activityId) ? "Completed" : "Complete";
  }, [courseCtx?.isActivityCompleted, courseCtx?.activityId])

  const onToggleCompletionStatus = useCallback(() => {
    if(!courseCtx?.activityId) {
      const nextActivity = courseCtx?.getNextActivity();
      if(nextActivity) {
        router.push(nextActivity.path)
      }
      return;
    }
    const isCompleted = !courseCtx?.isActivityCompleted(courseCtx?.activityId);
    setIsSettingCompletion(true);
    axios.post(`/api/courses/${courseCtx?.courseId}/chapters/${courseCtx.chapterId}/activities/${courseCtx?.activityId}/progress`, {
      isCompleted
    }).then(() => {
      setIsSettingCompletion(false);
      courseCtx?.markActivityCompletionState(courseCtx?.activityId ?? '', isCompleted);
      if(isCompleted){
        const nextActivity = courseCtx?.getNextActivity();
        if(nextActivity) {
          router.push(nextActivity.path)
        }
      }
    
     
    }).catch(() => {
      setIsSettingCompletion(false);
    })
  }, [courseCtx?.activityId, courseCtx?.markActivityCompletionState, courseCtx?.isActivityCompleted, courseCtx?.getNextActivity, courseCtx?.courseId, router])

  return (
    <Button variant={btnText === 'Completed' ? 'success': 'default'} disabled={isSettingCompletion} onClick={onToggleCompletionStatus}>
      {btnText}
    </Button>
  );
}