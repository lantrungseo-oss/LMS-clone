import { auth } from "@clerk/nextjs";
import { ArrowLeft, Edit, Trash } from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";

import { Banner } from "@/components/banner";
import { Button } from "@/components/ui/button";
import { db } from "@/lib/db";
import { ActivityQuizForm } from "./_components/activity-quiz-form";
import { ActivityTextForm } from "./_components/activity-text-form";
import { ActivityVideoForm } from "./_components/activity-video-form";
import { mainActivityService } from "@/core/business/activity";
import { ActivityIcon } from "@/app/(dashboard)/_components/activity-icon";
import { ActivityEditorHeader } from "./_components/activity-editor-header";

const ActivityEditPage = async ({
  params
}: {
  params: { courseId: string; chapterId: string; activityId: string; }
}) => {
  const { userId } = auth();

  if (!userId) {
    return redirect("/");
  }

  const chapter = await db.chapter.findUnique({
    where: {
      id: params.chapterId,
      courseId: params.courseId
    },
  });

  if (!chapter) {
    return redirect(`/teacher/courses/${params.courseId}`)
  }

  const activity = await mainActivityService.getActivity(params.activityId, { includeVideoData: true });
  if(!activity) {
    return redirect(`/teacher/courses/${params.courseId}/chapters/${params.chapterId}`)
  }

  return (
    <div className="h-full flex flex-col">
      {!chapter.isPublished && (
        <Banner
          className='flex-none'
          variant="warning"
          label="This chapter is unpublished. It will not be visible in the course"
        />
      )}
      <div className="p-6 flex-none">
        <div className="flex items-center justify-between">
          <div className="w-full">
            <Link
              href={`/teacher/courses/${params.courseId}/chapters/${params.chapterId}`}
              className="flex items-center text-sm hover:opacity-75 transition mb-6"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to chapter setup
            </Link>
          </div>
        </div>
      </div>
      <div className="w-100 p-6 flex-1">
        <div className="h-full w-100 flex flex-col">
          <ActivityEditorHeader 
            type={activity.type} name={activity.name} activityId={activity.id}
            courseId={params.courseId} chapterId={params.chapterId}
          />
         
          {activity.type === 'video' && (
            <ActivityVideoForm 
              courseId={params.courseId}
              chapterId={params.chapterId}
              activity={{
                ...activity,
                videoUrl: activity.videoUrl ?? undefined,
                playbackId: activity.videoData?.playbackId ?? undefined,
              }}
            />
          )}

          {activity.type === 'text' && (
            <ActivityTextForm />
          )}
          {activity.type === 'quiz' && (
            <ActivityQuizForm />
          )}
        </div>
        
      </div>
    </div>
   );
}
 
export default ActivityEditPage;