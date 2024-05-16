"use client";
import { FullCourseData } from "@/core/frontend/entity-types";
import { useParams } from "next/navigation";
import { createContext, useCallback, useRef, useState } from "react";



type CourseDataFromUrlParams = {
  courseId: string;
  chapterId?: string;
  activityId?: string;
}

type CourseDataFromProps = {
  coursePurchased?: boolean;
  course: FullCourseData
}

type CourseContextReader = {
  isActivityCompleted: (activityId: string) => boolean;
  markActivityCompletionState: (activityId: string, isCompleted: boolean) => void;
}

type CourseContextValue  = CourseDataFromUrlParams & { initialData: CourseDataFromProps } & CourseContextReader; 

type CourseContextProviderProps = {
  children?: React.ReactNode;
  initialData: CourseDataFromProps;
}

export const CourseContext = createContext<CourseContextValue | null>(null);

export const CourseContextProvider = ({ children, initialData }: CourseContextProviderProps) => {
  const params = useParams<CourseDataFromUrlParams>()
  const [activityCompletionMap, setActivityCompletionMap] = useState<Record<string, boolean>> (() => {
    const res: Record<string, boolean> = {};
    initialData.course.chapters.forEach((chapter) => {
      chapter.activities.forEach((activity) => {
        res[activity.id] = activity.completed;
      });
    });
    return res;
  });
  
  const isActivityCompleted = useCallback((activityId: string) => {
    return !!activityCompletionMap[activityId];
  }, [activityCompletionMap])

  const markActivityCompletionState = useCallback((activityId: string, isCompleted: boolean) => {
    setActivityCompletionMap((prev) => {
      return {
        ...prev,
        [activityId]: isCompleted
      }
    })
  }, [])
  
  const providerValue = {
    ...params,
    initialData,
    isActivityCompleted,
    markActivityCompletionState
  };

  return (
    <CourseContext.Provider value={providerValue}>
      {children}
    </CourseContext.Provider>
  )
}
