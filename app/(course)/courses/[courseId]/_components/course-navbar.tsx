"use client";

import { Chapter, ChapterActivity, Course } from "@prisma/client";
import { NavbarRoutes } from "@/components/navbar-routes";
import { CourseMobileSidebar } from "./course-mobile-sidebar";

interface CourseNavbarProps {
  progressCount: number;
};

export const CourseNavbar = ({
  progressCount,
}: CourseNavbarProps) => {
  return (
    <div className="p-4 border-b h-full flex items-center bg-white shadow-sm">
      <CourseMobileSidebar
        progressCount={progressCount}
      />
      <NavbarRoutes />      
    </div>
  )
}