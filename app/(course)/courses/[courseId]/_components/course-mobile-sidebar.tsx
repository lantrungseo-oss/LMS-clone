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
  progressCount: number;
};

export const CourseMobileSidebar = ({ 
  progressCount,
}: CourseMobileSidebarProps) => {
  return (
    <Sheet>
      <SheetTrigger className="md:hidden pr-4 hover:opacity-75 transition">
        <Menu />
      </SheetTrigger>
      <SheetContent side="left" className="p-0 bg-white w-72">
        <CourseSidebar
          progressCount={progressCount}
        />
      </SheetContent>
    </Sheet>
  )
}