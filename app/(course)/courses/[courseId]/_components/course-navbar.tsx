"use client";

import { Chapter, ChapterActivity, Course } from "@prisma/client";
import { NavbarRoutes } from "@/components/navbar-routes";
import { CourseMobileSidebar } from "./course-mobile-sidebar";

interface CourseNavbarProps {
  course: Course & {
    chapters: (Chapter & {
      activities: (ChapterActivity & {
        videoData: {
          playbackId?: string | null;
        }
      })[]
    })[]
  };
  progressCount: number;
  isPurchased: boolean;
};

export const CourseNavbar = ({
  course,
  progressCount,
  isPurchased
}: CourseNavbarProps) => {
  return (
    <div className="p-4 border-b h-full flex items-center bg-white shadow-sm">
      <CourseMobileSidebar
        course={course}
        isPurchased
        progressCount={progressCount}
      />
      <NavbarRoutes />      
    </div>
  )
}