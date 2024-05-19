"use client";

import { CourseProgress } from "@/components/course-progress";
import * as Accordion from '@radix-ui/react-accordion';

import { ChevronDown, ChevronRight } from "lucide-react";
import { useRouter } from "next/navigation";
import { useContext, useEffect, useMemo, useState } from "react";
import { CourseContext } from "../_contexts/course-context";
import { CourseChapterActivityList } from "./course-chapter-activities";
import { CourseEnrollButton } from "./course-enroll-button";

interface CourseSidebarProps {
  progressCount: number;
};



export const CourseSidebar = ({
}: CourseSidebarProps) => {
  const courseCtxVal = useContext(CourseContext);
  const course = courseCtxVal?.initialData.course;
  const [collapsedChapterIds, setCollapsedChapterIds] = useState<string[]>(() => {
    return courseCtxVal?.chapterId ? [courseCtxVal?.chapterId] : []
  });

  const progressCount = useMemo(() => {
    if(!courseCtxVal?.initialData.course.chapters) {
      return 100;
    }
    
    const listActivities = courseCtxVal?.initialData.course.chapters.map(chapter => chapter.activities).flat();
    const completedActivityCount = listActivities?.filter(activity => courseCtxVal?.isActivityCompleted(activity.id)).length;

    if(listActivities.length === 0) {
      return 100;
    }

    return 100 * completedActivityCount / (listActivities.length || 1)
  }, [courseCtxVal?.initialData.course.chapters, courseCtxVal?.isActivityCompleted])

  useEffect(() => {
    if(courseCtxVal?.chapterId) {
      setCollapsedChapterIds(currentChapterIds => {
        if(courseCtxVal?.chapterId) {
          return Array.from(new Set([...currentChapterIds, courseCtxVal?.chapterId]));
        }
        return currentChapterIds;
      });
    }
  }, [courseCtxVal?.chapterId]);
  const router = useRouter();
  
  const onAccordionValueChange = (value: string[]) => {
    setCollapsedChapterIds(value)
  }

  const redirectToCourse = () => {
    router.push(`/courses/${course?.id}`)
  }
  return (
    <div className="h-full border-r flex flex-col overflow-y-auto shadow-sm">
      <div className="p-8 flex flex-col border-b">
        <h1 className="font-semibold cursor-pointer" onClick={redirectToCourse}>
          {course?.title}
        </h1>
        {courseCtxVal?.initialData.coursePurchased && (
          <div className="mt-10">
            <CourseProgress
              value={progressCount}
              variant="success"
            />
          </div>
        )}
        {!courseCtxVal?.initialData.coursePurchased && course?.price && (
          <div className='pt-3'>
            <CourseEnrollButton price={course.price} courseId={course.id} />
          </div>
        )}
      </div>
      <div className="flex flex-col w-full">
        <Accordion.Root type='multiple' value={collapsedChapterIds} onValueChange={onAccordionValueChange}>
        {/**Use accordion to group activities into chapter */}
          {course?.chapters.map((chapter) => {

            // (
            //   <CourseSidebarItem
            //   key={chapter.id}
            //   id={chapter.id}
            //   label={chapter.title}
            //   // isCompleted={!!chapter.userProgress?.[0]?.isCompleted}
            //   isCompleted={false}
            //   courseId={course.id}
            //   isLocked={!chapter.isFree && !isPurchased}
            // />
            const isOpen = collapsedChapterIds.includes(chapter.id);
            return (
                <Accordion.Item key={chapter.id} value={chapter.id}>
                  <div className="w-full flex items-center">
                    {isOpen ? <ChevronDown size={18} color="gray" /> : <ChevronRight size={18} color="gray" />}
                    <Accordion.Header className="p-4">
                      <Accordion.Trigger className="text-md text-left font-semibold text-gray-700">
                        {chapter.title}
                      </Accordion.Trigger>
                    </Accordion.Header>
                  </div>
                  <Accordion.Content className="p-4 bg-white shadow">
                    <CourseChapterActivityList 
                      chapterId={chapter.id}
                      currentActivityId={courseCtxVal?.activityId}
                      currentChapterId={courseCtxVal?.chapterId}
                      courseId={course.id}
                      activities={chapter.activities.map((activity) => ({
                        type: activity.type,
                        title: activity.name,
                        id: activity.id,
                        completed: courseCtxVal?.isActivityCompleted(activity.id)
                      }))}
                    />
                  </Accordion.Content>
                </Accordion.Item>
            )
          })}
        </Accordion.Root>
      </div>
    </div>
  )
}