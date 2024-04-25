import { ActivityIcon } from "@/app/(dashboard)/_components/activity-icon";
import { learningMainService } from "@/core/business/learning";
import { redirect } from "next/navigation";
import { ActivityVideoPlayer } from "./_components/video-player";
import { ActivityTextBook } from "./_components/activity-textbook";

const ActivityPage = async ({
  params
}: {
  params: { courseId: string; chapterId: string; activityId: string }
}) => {
  const activity = await learningMainService.getActivity(params.activityId);

  if (!activity) {
    return redirect("/");
  }

  return (
    <div className="flex flex-col items-center">
      <div className='flex items-center py-3'>
        <ActivityIcon type={activity.type} className='w-6 h-6' />
        <h1 className="text-2xl p-2 font-bold">{activity.name}</h1>
      </div>
      {activity.type === 'video' && (
        <ActivityVideoPlayer playbackId={activity.videoData?.playbackId}/>
      )}
      {activity.type === 'text' && (
        <ActivityTextBook value={activity.textContent}/>
      )}
    </div>
  )
}
 
export default ActivityPage;