"use client";

import { Button } from "@/components/ui/button";
import { FormControl, FormField, FormItem, FormMessage, Form } from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { z } from "zod";

const Editor = dynamic(() => import("@/components/editor"), { ssr: false });

export type TActivityTextFormProps =  {
  activityId: string;
  courseId: string;
  chapterId: string;
  textContent?: string;
}

const formSchema = z.object({
  textContent: z.string().min(1),
});

export const ActivityTextForm = ({
  activityId, textContent, courseId, chapterId
}: TActivityTextFormProps) => {

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      textContent,
    },
  });

  const router = useRouter();

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      await axios.patch(`/api/courses/${courseId}/chapters/${chapterId}/activities/${activityId}`, values);
      toast.success("Activity updated");
      router.refresh();
    } catch {
      toast.error("Something went wrong");
    }
  }

  const { 
    isValid, isSubmitting
  } = form.formState

  return (
    <div className="w-100 text-center">
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-4 mt-4 w-100"
        >
          <FormField
            control={form.control}
            name="textContent"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Editor
                    {...field}
                    // imageEnabled: will come back later
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="flex justify-center gap-x-2 w-100">
            <Button
              disabled={!isValid || isSubmitting}
              type="submit"
              className="mt-4"
            >
              Save
            </Button>
          </div>
        </form>
      </Form>
    </div>
  )
}