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

type NextActivity = { path: string } | undefined;

type CourseContextStateReader = {
  isActivityCompleted: (activityId: string) => boolean;
  markActivityCompletionState: (activityId: string, isCompleted: boolean) => void;
  getNextActivity: () => NextActivity;
}

type CourseContextValue  = CourseDataFromUrlParams & { initialData: CourseDataFromProps } & CourseContextStateReader; 

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

  const getNextActivity = useCallback(() => {
    if(params.chapterId && params.activityId) {
       // find next activity based on pos
      const currentActivity = initialData.course.chapters.flatMap((chapter) => chapter.activities).find((activity) => activity.id === params.activityId);
      const currentChapter = initialData.course.chapters.find((chapter) => chapter.id === params.chapterId);
      if(!currentActivity || !currentChapter || currentActivity.chapterId !== currentChapter.id) {
        return;
      }

      const nextActivityInChapter = currentChapter?.activities.filter(activity => activity.id !== currentActivity.id).reduce((resultActivity: typeof currentActivity | undefined, activity) => {
        if(activity.position > currentActivity.position) {
          if(!resultActivity || activity.position < resultActivity.position) {
            return activity;
          }
          return resultActivity;
        }
        return resultActivity;
      }, undefined);

      if(nextActivityInChapter) {
        return { path: `/courses/${params.courseId}/chapters/${params.chapterId}/activities/${nextActivityInChapter.id}` }
      } else {
        const nextChapter = initialData.course.chapters.filter(c => c.id !== currentChapter.id).reduce((resultChapter: typeof currentChapter | undefined, chapter) => {
          if(chapter.position > currentChapter.position) {
            if(!resultChapter || chapter.position < resultChapter.position) {
              return chapter;
            }
            return resultChapter;
          }
          return resultChapter;
        }, undefined);


        if(nextChapter) {
          return { path: `/courses/${params.courseId}/chapters/${nextChapter.id}` }
        }
      }
     
    }
  
    if(!params.chapterId) {
      const chapter = initialData.course.chapters.reduce((resultChapter: FullCourseData['chapters'][number] | undefined, chapter) => {
        if(!resultChapter) {
          return chapter;
        }
        if(chapter.position < resultChapter.position) {
          return chapter;
        }
        return resultChapter;
      }, undefined)

      if(chapter) {
        return { path: `/courses/${params.courseId}/chapters/${chapter.id}` }
      }
    }
    if(!params.activityId) {
      const chapter = initialData.course.chapters.find((chapter) => chapter.id === params.chapterId);
      if(chapter) {
        const nextActivity = chapter.activities.reduce((resultActivity: FullCourseData['chapters'][number]['activities'][number] | undefined, activity) => {
          if(!resultActivity) {
            return activity;
          }
          if(activity.position < resultActivity.position) {
            return activity;
          }
          return resultActivity;
        }, undefined)

        if(nextActivity) {
          return { path: `/courses/${params.courseId}/chapters/${chapter.id}/activities/${nextActivity.id}` }
        }
      }
    } 
  }, [initialData, params.chapterId, params.activityId, params.courseId])
  
  const providerValue = {
    ...params,
    initialData,
    isActivityCompleted,
    markActivityCompletionState,
    getNextActivity,
  };

  return (
    <CourseContext.Provider value={providerValue}>
      {children}
    </CourseContext.Provider>
  )
}
