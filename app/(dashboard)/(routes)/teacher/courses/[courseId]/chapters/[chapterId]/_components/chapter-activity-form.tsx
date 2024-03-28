"use client";

import * as z from "zod";
import axios from "axios";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Loader2, PlusCircle } from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { Chapter, Course } from "@prisma/client";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { ChapterActivityList } from "./chapter-activity-list";
import { ChapterActivity } from "@/core/frontend/entity-types";
import { AddChapterActivityForm } from "./add-activity-form";

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
  const [isUpdating, setIsUpdating] = useState(false);

  const toggleCreating = () => {
    setIsCreating((current) => !current);
  }

  const router = useRouter();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
    },
  });

  const { isSubmitting, isValid } = form.formState;

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    // try {
    //   await axios.post(`/api/courses/${courseId}/chapters`, values);
    //   toast.success("Chapter created");
    //   toggleCreating();
    //   router.refresh();
    // } catch {
    //   toast.error("Something went wrong");
    // }
  }

  const onReorder = async (updateData: { id: string; position: number }[]) => {
    // try {
    //   setIsUpdating(true);

    //   await axios.put(`/api/courses/${courseId}/chapters/reorder`, {
    //     list: updateData
    //   });
    //   toast.success("Chapters reordered");
    //   router.refresh();
    // } catch {
    //   toast.error("Something went wrong");
    // } finally {
    //   setIsUpdating(false);
    // }
  }

  const onEdit = (id: string) => {
    router.push(`/teacher/courses/${courseId}/chapters/${chapterId}/activities/${id}`);
  }

  return (
    <div className="relative mt-6 border bg-slate-100 rounded-md p-4">
      <div className="font-medium flex items-center justify-between">
        Chapter&apos;activities
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
          chapterId="1"
          courseId="1"
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