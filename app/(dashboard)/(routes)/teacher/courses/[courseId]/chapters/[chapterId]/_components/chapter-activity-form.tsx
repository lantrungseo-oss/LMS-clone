"use client";

import { Loader, PlusCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import { useCallback, useState } from "react";
import * as z from "zod";

import { Button } from "@/components/ui/button";
import { ChapterActivity } from "@/core/frontend/entity-types";
import { cn } from "@/lib/utils";
import { AddChapterActivityForm } from "./add-activity-form";
import { ChapterActivityList } from "./chapter-activity-list";
import axios from "axios";
import toast from "react-hot-toast";

interface ChaptersFormProps {
  initialData: { activities: ChapterActivity[] };
  courseId: string;
  chapterId: string;
};

const formSchema = z.object({
  title: z.string().min(1),
});

export const ChapterActivityForm = ({
  initialData,
  courseId,
  chapterId
}: ChaptersFormProps) => {
  const [isCreating, setIsCreating] = useState(false);
  const [isReorderUpdating, setIsReorderUpdating] = useState(false);

  const toggleCreating = () => {
    setIsCreating((current) => !current);
  }


  const router = useRouter();

  const afterCreated = useCallback(() => {
    toggleCreating();
    router.refresh();
  }, [toggleCreating, router])

  const onReorder = async (updateData: { id: string; position: number }[]) => {
    setIsReorderUpdating(true);
    try {
      await axios.put(`/api/courses/${courseId}/chapters/${chapterId}/activities/reorder`, {
        updatedActivities: updateData.map((activity) => ({
          id: activity.id,
          position: activity.position + 1
        }))
      });
      toast.success("Activities reordered");
      router.refresh();
    } catch {
      toast.error("Something went wrong");
    } finally {
      setIsReorderUpdating(false);
    }
  }

  const onEdit = (id: string) => {
    router.push(`/teacher/courses/${courseId}/chapters/${chapterId}/activities/${id}`);
  }

  return (
    <div className="relative mt-6 border bg-slate-100 rounded-md p-4">
      {isReorderUpdating ? (
        <div className="absolute inset-0 bg-white bg-opacity-70 flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-sky-500">
            <Loader className='w-10 h-10'/>
          </div>
        </div>
      ) : null}
      <div className="font-medium flex items-center justify-between">
        Chapter&apos;s activities
        <Button onClick={toggleCreating} variant="ghost">
          {isCreating ? (
            <>Cancel</>
          ) : (
            <>
              <PlusCircle className="h-4 w-4 mr-2" />
              Add an activity
            </>
          )}
        </Button>
      </div>
      {isCreating && (
        <AddChapterActivityForm 
          chapterId={chapterId}
          courseId={courseId}
          afterCreated={afterCreated}
        />
      )}
      {!isCreating && (
        <div className={cn(
          "text-sm mt-2",
          !initialData.activities.length && "text-slate-500 italic"
        )}>
          {!initialData.activities.length && "No activities"}
          <ChapterActivityList
            onEdit={onEdit}
            onReorder={onReorder}
            items={initialData.activities || []}
          />
        </div>
      )}
      {!isCreating && (
        <p className="text-xs text-muted-foreground mt-4">
          Drag and drop to reorder the activities
        </p>
      )}
    </div>
  )
}