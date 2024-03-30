import { auth } from "@clerk/nextjs";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";

import { Banner } from "@/components/banner";
import { db } from "@/lib/db";
import { ActivityTextForm } from "./_components/activity-text-form";
import { ActivityVideoForm } from "./_components/activity-video-form";
import { ActivityQuizForm } from "./_components/activity-quiz-form";

const mockActivity = {
  name: 'Hello word',
  type: 'quiz',
  id: '123'
}

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
    include: {
      muxData: true,
    },
  });

  if (!chapter) {
    return redirect("/")
  }

  const activity = mockActivity;

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
          <h1 className="text-xl pb-6 flex-none">{activity.type.toUpperCase()}: {activity.name}</h1>
          {activity.type === 'video' && (
            <ActivityVideoForm 
              courseId={params.courseId}
              chapterId={params.chapterId}
              activity={{
                ...activity,
                videoUrl: 'https://utfs.io/f/6f3503a9-1f8a-4617-ac09-75f4b89ee8f2-b3p25x.52.36.mov',
                playbackId: 'p00aoECM01s2yVu7XiurL2rlZhGv00K24am0056T4EFTSgY'
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