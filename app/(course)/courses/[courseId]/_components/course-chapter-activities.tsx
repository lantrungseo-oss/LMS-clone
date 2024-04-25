import { ActivityIcon } from "@/app/(dashboard)/_components/activity-icon";
import { ChapterActivity } from "@/core/frontend/entity-types";
import clsx from "clsx";
import { usePathname, useRouter } from "next/navigation";

type CourseChapterProps = {
  courseId: string;
  chapterId: string;
  activities: ChapterActivity[];
  currentChapterId?: string;
  currentActivityId?: string;
}

export const CourseChapterActivityList = ({
  courseId, chapterId, activities, currentActivityId, currentChapterId
}: CourseChapterProps) => {

  const finalActivities = [
    {
      type: 'info',
      title: 'Chapter info',
      id: `${chapterId}-description`,
    },
    ...activities
  ]

  const router = useRouter();
  const pathName = usePathname();


  const moveToActivityPage = (activity: ChapterActivity) => {
    if(activity.id === `${chapterId}-description`) {
      router.push(`/courses/${courseId}/chapters/${chapterId}`);
      return;
    }
    router.push(`/courses/${courseId}/chapters/${chapterId}/activities/${activity.id}`)
  }

  const isActive = (activityId: string) => {
    if(currentChapterId !== chapterId) return false;
    if(activityId === currentActivityId) return true;
    if(activityId === `${chapterId}-description`) {
      return pathName === `/courses/${courseId}/chapters/${chapterId}`
    }
  }

  return (
    <div className="bg-gray-200 p-2">
       {/**Highlight if this is the current activity */}
      {
        finalActivities.map((activity) => (
          <div 
            key={activity.id} 
            className={clsx("p-2", "flex", "items-center", "cursor-pointer", {
              "bg-white": isActive(activity.id),
            })}
            onClick={() => moveToActivityPage(activity)}
          >
            <ActivityIcon type={activity.type} className="w-4 h-4" />
            <h6 className="px-2" >{activity.title}</h6>
          </div>
        ))
      }
    </div>
  )

}