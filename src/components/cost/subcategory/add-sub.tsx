"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { PlusIcon, RefreshCcw } from "lucide-react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "~/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
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
  subCategoryName: z.string(),
});

type FormData = z.infer<typeof formSchema>;

type FormProps  = {
  categoryId:string
}

export const PriceSubCategoryForm = ({categoryId}:FormProps) => {
  const utils = api.useUtils();
  const { toast } = useToast();
  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
  });
  const createCategory = api.category.createSubCategory.useMutation({
    onSuccess: async () => {
      toast({
        title: "Success!",
        description: "Sub Category added successfully.",
      });
      form.reset();
      await utils.category.getSubByCatId.invalidate({categoryId:categoryId});
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
    createCategory.mutate({ categoryId:categoryId,subName: data.subCategoryName });
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="flex items-center space-x-2">
          <PlusIcon className="h-5 w-5" />
          <span>Add Subcategory</span>
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogTitle>Add new sub category</DialogTitle>
        <DialogDescription>You can add sub categories thtough this form</DialogDescription>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmission)}
            className="grid gap-2"
          >
            <FormField
              control={form.control}
              name="subCategoryName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Subcategory name</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter the sub category"
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
              disabled={createCategory.isPending}
            >
              {createCategory.isPending ? (
                <>
                  <RefreshCcw className="mr-2 h-4 w-4 animate-spin" />
                  Please wait...
                </>
              ) : (
                "Create category"
              )}
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
