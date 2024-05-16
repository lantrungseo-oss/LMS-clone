import { ActivityIcon } from "@/app/(dashboard)/_components/activity-icon";
import { learningMainService } from "@/core/business/learning";
import { redirect } from "next/navigation";
import { ActivityVideoPlayer } from "./_components/video-player";
import { ActivityTextBook } from "./_components/activity-textbook";
import { Quiz } from "./_components/quiz";
import { IQuizData } from "@/core/frontend/entity-types";
import { CourseEnrollBanner } from "../../../../_components/course-enroll-banner";
import { MarkCompleteButton } from "../../_components/mark-complete-btn";

const ActivityPage = async ({
  params
}: {
  params: { courseId: string; chapterId: string; activityId: string }
}) => {
  const { userId, grantedAccessRole, isFree } = await learningMainService
    .checkCourseAccessForActivity(
      params.activityId, { readFullCourse: true }
    );

  if (!userId) {
    return redirect("/");
  }

  if(!grantedAccessRole && !isFree) {
    return redirect(`/courses/${params.courseId}/chapters/${params.chapterId}`)
  }

  const activity = await learningMainService.getActivity(params.activityId);
  const course = await learningMainService.getCourse(params.courseId);

  if (!activity || !course) {
    return redirect(`/courses/${params.courseId}/chapters/${params.chapterId}`)
  }

  return (
    <>
      {!grantedAccessRole && course.price && (
        <CourseEnrollBanner courseId={course.id} price={course.price} />
      )}
      <div className="flex flex-col h-[90%]">
        <div className='flex items-center py-3 justify-between w-100 px-8'>
          <div className='flex items-center'>
            <ActivityIcon type={activity.type} className='w-6 h-6 flex-none' />
            <h1 className="text-2xl p-2 font-bold flex-1">{activity.name}</h1>
          </div>
          {activity.type !== 'quiz' && (
            <MarkCompleteButton />
          )}
        </div>
        {activity.type === 'video' && (
          <ActivityVideoPlayer playbackId={activity.videoData?.playbackId}/>
        )}
        {activity.type === 'text' && (
          <ActivityTextBook value={activity.textContent}/>
        )}
        {activity.type === 'quiz' && activity.quizData && (
          <Quiz data={activity.quizData as unknown as IQuizData} />
        )}
      </div>
    </>
   
  )
}
 
export default ActivityPage;