"use client";

import { useContext } from "react";
import { CourseContext } from "../../../_contexts/course-context";
import { Button } from "@/components/ui/button";

export const MarkCompleteButton = () => {
  const courseCtx = useContext(CourseContext);

  const btnText = !!courseCtx?.activityId ? "Complete" :  "Next"
  

  return (<Button variant="default">
    Complete
  </Button>);
}