"use client";

import { useContext, useMemo } from "react";
import { CourseContext } from "../../../_contexts/course-context";
import { Button } from "@/components/ui/button";

export const MarkCompleteButton = () => {
  const courseCtx = useContext(CourseContext);

  const btnText = useMemo(() => {
    if(!courseCtx?.activityId) {
      return "Next";
    }
    return courseCtx?.isActivityCompleted(courseCtx?.activityId) ? "Complete" : "Completed";
  }, [courseCtx?.isActivityCompleted, courseCtx?.activityId])
  

  return (<Button variant="default">
    {btnText}
  </Button>);
}