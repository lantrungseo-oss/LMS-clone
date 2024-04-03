import { auth } from "@clerk/nextjs";
import { ArrowLeft, Eye, LayoutDashboard, ListChecks } from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";

import { Banner } from "@/components/banner";
import { IconBadge } from "@/components/icon-badge";
import { db } from "@/lib/db";

import { ChapterAccessForm } from "./_components/chapter-access-form";
import { ChapterActions } from "./_components/chapter-actions";
import { ChapterActivityForm } from "./_components/chapter-activity-form";
import { ChapterDescriptionForm } from "./_components/chapter-description-form";
import { ChapterTitleForm } from "./_components/chapter-title-form";
import { mainActivityService } from "@/core/business/activity";

const ChapterIdPage = async ({
  params
}: {
  params: { courseId: string; chapterId: string }
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
    return redirect("/")
  }

  const chapterActivities = await mainActivityService
    .getChapterActivities(params.chapterId)
    .then(activities => {
      return activities.map((activity) => {
        return {
          id: activity.id,
          title: activity.name,
          type: activity.type,
          position: activity.position,

        }
      }).sort((a, b) => a.position - b.position);
    });

  const allRequirementFlags = [
    !!chapter.title,
    !!chapter.description,
    chapterActivities.length > 0,
    chapterActivities.every(activity => !!activity.title)
  ];

  const totalFields = allRequirementFlags.length;
  const completedFields = allRequirementFlags.filter(Boolean).length;
  const completionText = `(${completedFields}/${totalFields})`;
  const isComplete = totalFields === completedFields;

  return (
    <>
      {!chapter.isPublished && (
        <Banner
          variant="warning"
          label="This chapter is unpublished. It will not be visible in the course"
        />
      )}
      <div className="p-6">
        <div className="flex items-center justify-between">
          <div className="w-full">
            <Link
              href={`/teacher/courses/${params.courseId}`}
              className="flex items-center text-sm hover:opacity-75 transition mb-6"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to course setup
            </Link>
            <div className="flex items-center justify-between w-full">
              <div className="flex flex-col gap-y-2">
                <h1 className="text-2xl font-medium">
                  Chapter Creation
                </h1>
                <span className="text-sm text-slate-700">
                  Complete all fields {completionText}. Make sure all your activities is set up properly
                </span>
              </div>
              <ChapterActions
                disabled={!isComplete}
                courseId={params.courseId}
                chapterId={params.chapterId}
                isPublished={chapter.isPublished}
              />
            </div>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-16">
          <div className="space-y-4">
            <div>
              <div className="flex items-center gap-x-2">
                <IconBadge icon={LayoutDashboard} />
                <h2 className="text-xl">
                  Customize your chapter
                </h2>
              </div>
              <ChapterTitleForm
                initialData={chapter}
                courseId={params.courseId}
                chapterId={params.chapterId}
              />
              <ChapterDescriptionForm
                initialData={chapter}
                courseId={params.courseId}
                chapterId={params.chapterId}
              />
            </div>
            <div>
              <div className="flex items-center gap-x-2">
                <IconBadge icon={Eye} />
                <h2 className="text-xl">
                  Access Settings
                </h2>
              </div>
              <ChapterAccessForm
                initialData={chapter}
                courseId={params.courseId}
                chapterId={params.chapterId}
              />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-x-2">
            <IconBadge icon={ListChecks} />
              <h2 className="text-xl">
                Chapter&apos; activities
              </h2>
            </div>
            <ChapterActivityForm 
              initialData={{activities: chapterActivities}}
              courseId={params.courseId}
              chapterId={params.chapterId}
            />
          </div>
        </div>
      </div>
    </>
   );
}
 
export default ChapterIdPage;