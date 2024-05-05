"use client"
import { Chapter, ChapterActivity, Course } from "@prisma/client";
import { Menu } from "lucide-react";

import {
  Sheet,
  SheetContent,
  SheetTrigger
} from "@/components/ui/sheet";

import { CourseSidebar } from "./course-sidebar";
import { FullCourseData } from "@/core/frontend/entity-types";

interface CourseMobileSidebarProps {
  course: FullCourseData;
  progressCount: number;
  isPurchased: boolean;
};

export const CourseMobileSidebar = ({ 
  course,
  progressCount,
  isPurchased
}: CourseMobileSidebarProps) => {
  return (
    <Sheet>
      <SheetTrigger className="md:hidden pr-4 hover:opacity-75 transition">
        <Menu />
      </SheetTrigger>
      <SheetContent side="left" className="p-0 bg-white w-72">
        <CourseSidebar
          isPurchased={isPurchased}
          course={course}
          progressCount={progressCount}
        />
      </SheetContent>
    </Sheet>
  )
}