"use client";

import { ActivityIcon } from "@/app/(dashboard)/_components/activity-icon";
import { Button } from "@/components/ui/button";
import { DialogHeader, Dialog, DialogContent, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { DialogDescription } from "@radix-ui/react-dialog";
import axios from "axios";
import { Edit, Trash } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-hot-toast";
import { z } from "zod";

export type TActivityEditorHeaderProps = {
  type: string;
  name: string;
  activityId: string;
  courseId: string;
  chapterId: string;
}

const nameEditorFormSchema = z.object({
  title: z.string().min(1),
});

export const ActivityEditorHeader = ({
  type, name, activityId, courseId, chapterId
}: TActivityEditorHeaderProps) => {
  const [editNameDialogOpen, setEditNameDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  
  const nameForm = useForm<z.infer<typeof nameEditorFormSchema>>({
    resolver: zodResolver(nameEditorFormSchema),
    defaultValues: {
      title: name
    },
  });

  const { isValid, isSubmitting } = nameForm.formState;
  const router = useRouter();

  const onTitleEditFormSubmit = async (values: z.infer<typeof nameEditorFormSchema>) => {
    try {
      await axios.patch(`/api/courses/${courseId}/chapters/${chapterId}/activities/${activityId}`, {
        name: values.title
      });
      setEditNameDialogOpen(false);
      toast.success("Activity's name updated");
      router.refresh();
    } catch {
      toast.error("Something went wrong");
    }
  }

  const onDelete = async () => {
    try {
      await axios.delete(`/api/courses/${courseId}/chapters/${chapterId}/activities/${activityId}`);
      setDeleteDialogOpen(false);
      setIsDeleting(true)
      toast.success("Activity deleted");
      router.push(`/teacher/courses/${courseId}/chapters/${chapterId}`);
    } catch {
      toast.error("Something went wrong! Cannot delete activity.");
    } finally {
      setIsDeleting(false);
    }
  }


  return (
    <>
      <div className='pb-6 flex-none flex justify-between'>
        <div className='flex flex-row items-center'>
          <ActivityIcon type={type} className="w-10 h-10"/>
          <h1 className="text-xl px-4">{name}</h1>
          <Button variant='ghost' onClick={() => setEditNameDialogOpen(true)}>
            <Edit className="w-6 h-6 ml-2"/>
          </Button>
        </div>
        
        <Button variant='destructive' onClick={() => setDeleteDialogOpen(true)}>
          <Trash className="w-4 h-4 mr-2"/>
          Delete
        </Button>
      </div>
      <Dialog
        open={editNameDialogOpen}
        onOpenChange={(open) => setEditNameDialogOpen(open)}
      >
        <DialogContent className="p-4 mt-4">
          <DialogHeader>
            <DialogTitle>
              Edit activity title
            </DialogTitle>
          </DialogHeader>
          <Form {...nameForm}>
            <form
              onSubmit={nameForm.handleSubmit(onTitleEditFormSubmit)}
              className="space-y-4 mt-4"
            >
              <FormField
                control={nameForm.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input
                        disabled={isSubmitting}
                        placeholder="e.g. 'Introduction to the course'"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="flex items-center gap-x-2">
                <Button
                  disabled={!isValid || isSubmitting}
                  type="submit"
                >
                  Save
                </Button>
              </div>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      <Dialog
        open={deleteDialogOpen}
        onOpenChange={(open) => setDeleteDialogOpen(open)}
      >
        <DialogContent className="p-4 mt-4">
          <DialogHeader>
            <DialogTitle>
              Are you sure you want to delete the activity?
            </DialogTitle>
          </DialogHeader>
          <DialogDescription>
            This will delete all the associated data, including video, quiz, and text content.
          </DialogDescription>
          <DialogFooter>
            <Button variant='destructive' onClick={onDelete} disabled={isDeleting}>
              Delete
            </Button>
            <Button onClick={() => setDeleteDialogOpen(false)}>
              Cancel
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
    
  )
}