import { Button } from "@/components/ui/button";
import { Combobox } from "@/components/ui/combobox";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { ACTIVITY_TYPES } from "@/core/frontend/constants";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { z } from "zod";

type TAddChapterActivityFormProps = {
  courseId: string;
  chapterId: string;
  afterCreated: () => void;
}

const formSchema = z.object({
  title: z.string().min(1),
  // type should be either video, text or quiz
  type: z.custom((value) => ACTIVITY_TYPES.map((type) => type.value).includes(value as string))
});

export const AddChapterActivityForm = ({
  courseId, chapterId, afterCreated
}: TAddChapterActivityFormProps) => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      type: "video"
    },
  });

  const { isValid, isSubmitting } = form.formState

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      await axios.post(`/api/courses/${courseId}/chapters/${chapterId}/activities`, {
        name: values.title,
        type: values.type,
      });
      toast.success("Activity created");
      afterCreated();
      // router.refresh();
    } catch (error) {
      toast.error("Something went wrong");
    }
  }

  return (
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-4 mt-4"
        >
          <FormField
            control={form.control}
            name="type"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Combobox
                    disabled={false}
                    options={ACTIVITY_TYPES}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input
                    disabled={false}
                    placeholder="e.g. 'Introduction to the course'"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button
            type="submit"
            disabled={!isValid || isSubmitting}
          >
            Create
          </Button>
        </form>
      </Form>
  )
}