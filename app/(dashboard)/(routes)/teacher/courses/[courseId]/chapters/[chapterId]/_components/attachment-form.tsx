"use client";

import { Attachment } from "@prisma/client";
import axios from "axios";
import { File, Loader2, Pencil, PlusCircle, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import toast from "react-hot-toast";
import * as z from "zod";

import { FileUpload } from "@/components/file-upload";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { EFileUploadEndpoint } from "@/core/frontend/constants";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Label } from "@/components/ui/label";

interface AttachmentFormProps {
  attachments: Attachment[];
  chapterId: string;
  courseId: string;
};

const formSchema = z.object({
  url: z.string().min(1),
});

const attachmentEditFormSchema = z.object({
  name: z.string().min(1),
});

export const AttachmentForm = ({
  chapterId,
  attachments,
  courseId,
}: AttachmentFormProps) => {
  const [startUpload, setStartUpload] = useState(false);
  const [idForEdit, setIdForEdit] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const selectedAttachmentForEdit = useMemo(() => attachments.find((attachment) => attachment.id === idForEdit), [idForEdit, attachments])

  const toggleUploadForm = () => setStartUpload((current) => !current);
  const toggleEditForAttachment = (id: string | null) => setIdForEdit(id);

  const attachmentEditForm = useForm<z.infer<typeof attachmentEditFormSchema>>({
    resolver: zodResolver(attachmentEditFormSchema),
    defaultValues: {
      name: selectedAttachmentForEdit?.name || ""
    }
  })

  const router = useRouter();

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      await axios.post(`/api/courses/${courseId}/chapters/${chapterId}/attachments`, values);
      toast.success("Chapter's attachment added");
      setStartUpload(false);
      router.refresh();
    } catch {
      toast.error("Something went wrong");
    }
  };

  const onDelete = async (id: string) => {
    try {
      setDeletingId(id);
      await axios.delete(`/api/courses/${courseId}/chapters/${chapterId}/attachments/${id}`);
      toast.success("Attachment deleted");
      router.refresh();
    } catch {
      toast.error("Something went wrong");
    } finally {
      setDeletingId(null);
    }
  }

  const onUpdateAttachment = async (data: { name: string; }) => {
    try {
      if(!selectedAttachmentForEdit) {
        return;
      }
      await axios.patch(`/api/courses/${courseId}/chapters/${chapterId}/attachments/${selectedAttachmentForEdit.id}`, {
        name: data.name,
      });
      toast.success("Attachment updated");
      toggleEditForAttachment(null);
      router.refresh();
    } catch {
      toast.error("Something went wrong");
    }
  }

  return (
    <div className="mt-6 border bg-slate-100 rounded-md p-4">
      <div className="font-medium flex items-center justify-between">
        {idForEdit ? "Chapter's attachment" : "Attachments"}
        {!idForEdit && (
          <Button onClick={toggleUploadForm} variant="ghost">
            {startUpload  && (
              <>Cancel</>
            )}
            {!startUpload && (
              <>
                <PlusCircle className="h-4 w-4 mr-2" />
                Add a file
              </>
            )}
          </Button>
        )}
        {idForEdit && (
          <Button onClick={() => toggleEditForAttachment(null)} variant="ghost">
            Cancel
          </Button>
        )}
      </div>
      {idForEdit && selectedAttachmentForEdit && (
        <>
           <div
              className="flex items-center p-3 w-full bg-sky-100 border-sky-200 border text-sky-700 rounded-md"
            >
              <File className="h-4 w-4 mr-2 flex-shrink-0" />
              <p className="text-xs line-clamp-1">
                {selectedAttachmentForEdit.name}
              </p>
            </div>
          <Form {...attachmentEditForm}>
            <form
              onSubmit={attachmentEditForm.handleSubmit(onUpdateAttachment)}
              className="space-y-4 mt-4"
            >
              <FormField
                control={attachmentEditForm.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <Label>Name</Label>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                  </FormItem>
                )}
              />
              <div className="flex items-center gap-x-2">
                <Button
                  disabled={!attachmentEditForm.formState.isValid || attachmentEditForm.formState.isSubmitting}
                  type="submit"
                >
                  Save
                </Button>
              </div>
            </form>
          </Form>
        </>
      )}
      {!startUpload && !idForEdit && (
        <>
          {attachments.length === 0 && (
            <p className="text-sm mt-2 text-slate-500 italic">
              No attachments yet
            </p>
          )}
          {attachments.length > 0 && (
            <div className="space-y-2">
              {attachments.map((attachment) => {
                return (
                  <div
                    key={attachment.id}
                    className="flex items-center p-3 w-full bg-sky-100 border-sky-200 border text-sky-700 rounded-md"
                  >
                    <div className="flex-1 flex items-center">
                      <File className="h-4 w-4 mr-2 flex-shrink-0" />
                      <p className="text-xs line-clamp-1">
                        {attachment.name}
                      </p>
                    </div>
                    
                    <div className="flex-none">
                      {deletingId === attachment.id && (
                        <div>
                          <Loader2 className="h-4 w-4 animate-spin" />
                        </div>
                      )}
                      <button
                          disabled={deletingId === attachment.id}
                          onClick={() => toggleEditForAttachment(attachment.id)}
                          className="ml-auto hover:opacity-75 transition px-1"
                        >
                          <Pencil className="h-4 w-4" />
                        </button>
                      {deletingId !== attachment.id && (
                        <button
                          onClick={() => onDelete(attachment.id)}
                          className="ml-auto hover:opacity-75 transition"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </>
      )}
      {startUpload && (
        <div>
          <FileUpload
            endpoint={EFileUploadEndpoint.courseAttachment}
            onChange={(url) => {
              if (url) {
                onSubmit({ url: url });
              }
            }}
          />
          <div className="text-xs text-muted-foreground mt-4">
            Add anything your students might need to complete the course.
          </div>
        </div>
      )}
    </div>
  )
}