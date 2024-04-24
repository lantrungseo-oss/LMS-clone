import { ActivityIcon } from "@/app/(dashboard)/_components/activity-icon";
import { ChapterActivity } from "@/core/frontend/entity-types";
import clsx from "clsx";

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
      title: 'Chapter description',
      id: `${chapterId}-description`,
    },
    ...activities
  ]

  // higl
  return (
    <div className="bg-gray-200 p-2">
       {/**Highlight if this is the current activity */}
      {
        finalActivities.map((activity) => (
          <div key={activity.id} className={clsx("p-2", "flex", "items-center", {
            "bg-white": activity.id === currentActivityId && chapterId === currentChapterId,
          })}>
            <ActivityIcon type={activity.type} className="w-4 h-4" />
            <h6 className="px-2" >{activity.title}</h6>
          </div>
        ))
      }
    </div>
  )

}