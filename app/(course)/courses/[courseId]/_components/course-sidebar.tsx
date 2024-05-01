"use client";

import { CourseProgress } from "@/components/course-progress";
import * as Accordion from '@radix-ui/react-accordion';

import { CourseSidebarItem } from "./course-sidebar-item";
import { FullCourseData } from "@/core/frontend/entity-types";
import { useContext, useState } from "react";
import { ChevronDown, ChevronRight } from "lucide-react";
import { CourseChapterActivityList } from "./course-chapter-activities";
import { CourseContext } from "../contexts/course-context";
import { useRouter } from "next/navigation";

  interface CourseSidebarProps {
    course: FullCourseData;
    progressCount: number;
  isPurchased?: boolean;
};

// hard code here
const currentActivityId = "171e0ea4-390e-4d71-9d5b-ea78360591a2"
const currentChapterId = "23e625b3-aa32-43f9-b778-9a5b0836b2b9"


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