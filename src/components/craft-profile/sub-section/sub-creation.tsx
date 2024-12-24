"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { PlusIcon, RefreshCcw } from "lucide-react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "~/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "~/components/ui/dialog";
import { useToast } from "~/hooks/use-toast";
import { api } from "~/trpc/react";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "~/components/ui/form";
import { Input } from "~/components/ui/input";

const formSchema = z.object({
  sectionName: z.string(),
});

type FormData = z.infer<typeof formSchema>;

export const ProfileSubSectionCreation = ({ sectionId }: { sectionId: string }) => {
  const utils = api.useUtils();
  const { toast } = useToast();
  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
  });
  const createSubSection = api.craft.createSubSection.useMutation({
    onSuccess: async () => {
      toast({
        title: "Success!",
        description: "Section added successfully.",
      });
      form.reset();
      await utils.craft.getSectionsBySubCategory.invalidate();
    },
    onError: (error) => {
      toast({
        variant: "destructive",
        title: "Oop!",
        description: error.message,
      });
    },
  });

  const onSubmission = (data: FormData) => {
    createSubSection.mutate({
      sectionId: sectionId,
      sectionName: data.sectionName,
    });
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="flex items-center gap-1 w-fit" variant="outline">
          <PlusIcon />
          <span>Add sub section</span>
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogTitle>Add New sub section</DialogTitle>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmission)}
            className="grid gap-2"
          >
            <FormField
              control={form.control}
              name="sectionName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Section name</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter the section name"
                      {...field}
                      value={field.value ?? ""}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button
              type="submit"
              className="w-full max-w-md"
              disabled={createSubSection.isPending}
            >
              {createSubSection.isPending ? (
                <>
                  <RefreshCcw className="mr-2 h-4 w-4 animate-spin" />
                  Please wait...
                </>
              ) : (
                "Create sub section"
              )}
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
