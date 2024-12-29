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
  categoryName: z.string(),
  rank: z.number(),
});

type FormData = z.infer<typeof formSchema>;

export const CategoryForm = () => {
  const utils = api.useUtils();
  const { toast } = useToast();
  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
  });
  const createCategory = api.category.createCategory.useMutation({
    onSuccess: async () => {
      toast({
        title: "Success!",
        description: "Category added successfully.",
      });
      form.reset();
      await utils.category.getCategories.invalidate();
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
    createCategory.mutate({ categoryName: data.categoryName, rank: data.rank });
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="flex items-center space-x-2">
          <PlusIcon className="h-5 w-5" />
          <span>Add Category</span>
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogTitle>Add New Category</DialogTitle>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmission)}
            className="grid gap-2"
          >
            <FormField
              control={form.control}
              name="categoryName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Category name</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter the category name"
                      {...field}
                      value={field.value ?? ""}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="rank"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Category rank</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter the category rank"
                      {...field}
                      value={field.value ?? ""}
                      onChange={(e) => {
                        const value = e.target.value;
                        if (
                          value === "" ||
                          (/^\d+$/.test(value) && parseInt(value) > 0)
                        ) {
                          field.onChange(
                            value === "" ? undefined : parseInt(value),
                          );
                        }
                      }}
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
