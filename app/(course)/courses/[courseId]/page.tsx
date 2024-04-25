import { learningMainService } from "@/core/business/learning";
import { redirect } from "next/navigation";
import { CourseDescription } from "./_components/course-description";

const CourseIdPage = async ({
  params
}: {
  params: { courseId: string; }
}) => {
  const course = await learningMainService.getCourse(params.courseId);

  if (!course) {
    return redirect("/");
  }

  return (
    <CourseDescription
      imageUrl={course.imageUrl || ""}
      title={course.title}
      description={course.description || ""}
    />
  )
}
 
export default CourseIdPage;