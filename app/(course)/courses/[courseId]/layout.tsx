import { auth } from "@clerk/nextjs";
import { redirect } from "next/navigation";

import { db } from "@/lib/db";

import { learningMainService } from "@/core/business/learning";
import { CourseNavbar } from "./_components/course-navbar";
import { CourseSidebar } from "./_components/course-sidebar";
import { CourseContextProvider } from "./contexts/course-context";

const CourseLayout = async ({
  children,
  params
}: {
  children: React.ReactNode;
  params: { courseId: string; };
}) => {
  const { userId } = auth();

  if (!userId) {
    return redirect("/")
  }

  const course = await learningMainService.getFullCourseData(params.courseId);

  if (!course) {
    return redirect("/");
  }

  const purchase = await db.purchase.findUnique({
    where: {
      userId_courseId: {
        userId,
        courseId: course.id
      }
    }
  });

  const progressCount = 0

  return (
    <CourseContextProvider>
      <div className="h-full">
        <div className="h-[80px] md:pl-80 fixed inset-y-0 w-full z-50">
          <CourseNavbar
            course={course}
            progressCount={progressCount}
          />
        </div>
        <div className="hidden md:flex h-full w-80 flex-col fixed inset-y-0 z-50">
          <CourseSidebar
            course={course}
            progressCount={progressCount}
            isPurchased
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