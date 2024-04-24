"use client";
import { useParams } from "next/navigation";
import { createContext } from "react";

export type CourseContextValue = {
  courseId: string;
  chapterId?: string;
  activityId?: string;
}

export const CourseContext = createContext<CourseContextValue | null>(null);

export const CourseContextProvider = ({ children }: { children: React.ReactNode }) => {
  const value = useParams<CourseContextValue>()
  return (
    <CourseContext.Provider value={value}>
      {children}
    </CourseContext.Provider>
  )
}
