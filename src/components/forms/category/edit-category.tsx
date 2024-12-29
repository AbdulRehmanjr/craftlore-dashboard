"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { PencilIcon, RefreshCcw } from "lucide-react";
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
  categoryName: z.string().min(1, { message: "Category name is required" }),
  rank: z.number(),
});

type FormData = z.infer<typeof formSchema>;
type ComponentProps = {
  categoryId: string;
  initialCategoryName: string;
  rank:number
};

export const EditCategoryForm = ({
  categoryId,
  initialCategoryName,
  rank
}: ComponentProps) => {
  const utils = api.useUtils();
  const { toast } = useToast();

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      categoryName: initialCategoryName,
      rank:rank
    },
  });

  const editCategory = api.category.editCategory.useMutation({
    onSuccess: async () => {
      toast({
        title: "Success!",
        description: "Category updated successfully.",
      });
      await utils.category.getCategories.invalidate();
    },
    onError: (error) => {
      toast({
        variant: "destructive",
        title: "Oops!",
        description: error.message,
      });
    },
  });

  const onSubmission = (data: FormData) => {
    editCategory.mutate({
      categoryId,
      categoryName: data.categoryName,
      rank:data.rank
    });
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" size="icon" type="button">
          <PencilIcon />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogTitle>Edit Category</DialogTitle>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmission)}
            className="grid gap-4"
          >
            <FormField
              control={form.control}
              name="categoryName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Category Name</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter the new category name"
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
              className="w-full"
              disabled={editCategory.isPending}
            >
              {editCategory.isPending ? (
                <>
                  <RefreshCcw className="mr-2 h-4 w-4 animate-spin" />
                  Updating...
                </>
              ) : (
                "Update Category"
              )}
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
