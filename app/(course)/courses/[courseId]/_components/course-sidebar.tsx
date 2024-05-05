"use client";

import { CourseProgress } from "@/components/course-progress";
import * as Accordion from '@radix-ui/react-accordion';

import { FullCourseData } from "@/core/frontend/entity-types";
import { ChevronDown, ChevronRight } from "lucide-react";
import { useRouter } from "next/navigation";
import { useContext, useState } from "react";
import { CourseContext } from "../contexts/course-context";
import { CourseChapterActivityList } from "./course-chapter-activities";
import { CourseEnrollButton } from "./course-enroll-button";

interface CourseSidebarProps {
  course: FullCourseData;
  progressCount: number;
  isPurchased: boolean;
};



export const CourseSidebar = ({
  course,
  progressCount,
  isPurchased
}: CourseSidebarProps) => {
  const [collapsedChapterIds, setCollapsedChapterIds] = useState<string[]>([]);
  const router = useRouter();
  
  const onAccordionValueChange = (value: string[]) => {
    setCollapsedChapterIds(value)
  }

  const courseContext = useContext(CourseContext);
  const redirectToCourse = () => {
    router.push(`/courses/${course.id}`)
  }
  return (
    <div className="h-full border-r flex flex-col overflow-y-auto shadow-sm">
      <div className="p-8 flex flex-col border-b">
        <h1 className="font-semibold cursor-pointer" onClick={redirectToCourse}>
          {course.title}
        </h1>
        {isPurchased && (
          <div className="mt-10">
            <CourseProgress
              variant="success"
              value={progressCount}
            />
          </div>
        )}
        {!isPurchased && course.price && (
          <div className='pt-3'>
            <CourseEnrollButton price={course.price} courseId={course.id} />
          </div>
        )}
      </div>
      <div className="flex flex-col w-full">
        <Accordion.Root type='multiple' value={collapsedChapterIds} onValueChange={onAccordionValueChange}>
        {/**Use accordion to group activities into chapter */}
          {course.chapters.map((chapter) => {

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
                      <Accordion.Trigger className="text-md font-semibold text-gray-700">
                        {chapter.title}
                      </Accordion.Trigger>
                    </Accordion.Header>
                  </div>
                  <Accordion.Content className="p-4 bg-white shadow">
                    <CourseChapterActivityList 
                      chapterId={chapter.id}
                      currentActivityId={courseContext?.activityId}
                      currentChapterId={courseContext?.chapterId}
                      courseId={course.id}
                      activities={chapter.activities.map((activity) => ({
                        type: activity.type,
                        title: activity.name,
                        id: activity.id,
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