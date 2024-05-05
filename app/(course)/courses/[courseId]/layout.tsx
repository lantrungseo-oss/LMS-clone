import { auth } from "@clerk/nextjs";
import { redirect } from "next/navigation";

import { db } from "@/lib/db";

import { learningMainService } from "@/core/business/learning";
import { CourseNavbar } from "./_components/course-navbar";
import { CourseSidebar } from "./_components/course-sidebar";
import { CourseContextProvider } from "./contexts/course-context";
import { ECourseAccessRole } from "@/core/frontend/constants";

const CourseLayout = async ({
  children,
  params
}: {
  children: React.ReactNode;
  params: { courseId: string; };
}) => {
   const { userId, grantedAccessRole } = await learningMainService
    .checkCourseAccess(
      params.courseId, {}
    );


  if (!userId) {
    return redirect("/");
  }

  const course = await learningMainService.getFullCourseData(params.courseId, {
    freeChapterOnly: !grantedAccessRole
  });

  if(!course) {
    return redirect("/");
  }

  const progressCount = 0

  return (
    <CourseContextProvider>
      <div className="h-full">
        <div className="h-[80px] md:pl-80 fixed inset-y-0 w-full z-50">
          <CourseNavbar
            course={course}
            progressCount={progressCount}
            isPurchased={!!grantedAccessRole}
          />
        </div>
        <div className="hidden md:flex h-full w-80 flex-col fixed inset-y-0 z-50">
          <CourseSidebar
            course={course}
            progressCount={progressCount}
            isPurchased={!!grantedAccessRole}
          />
        </div>
        <main className="md:pl-80 pt-[80px] h-full">
          {children}
        </main>
      </div>
    </CourseContextProvider>
  )
}

export default CourseLayout