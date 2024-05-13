"use client";
import { FullCourseData } from "@/core/frontend/entity-types";
import { useParams } from "next/navigation";
import { createContext, useRef } from "react";



type CourseDataFromUrlParams = {
  courseId: string;
  chapterId?: string;
  activityId?: string;
}

type CourseDataFromProps = {
  coursePurchased?: boolean;
  course: FullCourseData
}

type CourseContextValue  = CourseDataFromUrlParams & { initialData: CourseDataFromProps };

type CourseContextProviderProps = {
  children?: React.ReactNode;
  initialData: CourseDataFromProps;
}

export const CourseContext = createContext<CourseContextValue | null>(null);

export const CourseContextProvider = ({ children, initialData }: CourseContextProviderProps) => {
  const params = useParams<CourseDataFromUrlParams>()
  const providerValue = {
    ...params,
    initialData,
  };
  return (
    <CourseContext.Provider value={providerValue}>
      {children}
    </CourseContext.Provider>
  )
}
