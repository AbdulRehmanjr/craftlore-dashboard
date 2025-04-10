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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import { useState } from "react";
import { Checkbox } from "~/components/ui/checkbox";

const formSchema = z.object({
  sectionName: z.string(),
  autoAddMaterials: z.boolean().default(true),
});

type FormData = z.infer<typeof formSchema>;

export const CarbonSectionForm = ({ subId }: { subId: string }) => {
  const [isOpen, setIsOpen] = useState(false);
  const utils = api.useUtils();
  const { toast } = useToast();
  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      autoAddMaterials: true,
    },
  });
  
  const createSection = api.carbon.createSection.useMutation({
    onSuccess: async (createdSection) => {
      const autoAddMaterials = form.getValues().autoAddMaterials;
      
      // If auto-add materials is enabled, create values for each material
      if (autoAddMaterials && createdSection) {
        try {
          
          toast({
            title: "Success!",
            description: "Section added with all materials.",
          });
        } catch (error) {
          console.error(error);
          toast({
            variant: "destructive",
            title: "Error adding materials",
            description: "Some materials could not be added automatically.",
          });
        }
      } else {
        toast({
          title: "Success!",
          description: "Section added successfully.",
        });
      }
      
      form.reset();
      setIsOpen(false);
      await utils.carbon.getSectionsBySubCategory.invalidate();
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
    createSection.mutate({ subCategoryId: subId, sectionType: data.sectionName });
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button className="flex items-center space-x-2" onClick={() => setIsOpen(true)}>
          <PlusIcon className="h-5 w-5" />
          <span>Add Section</span>
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogTitle>Add New Section</DialogTitle>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmission)}
            className="grid gap-4"
          >
            <FormField
              control={form.control}
              name="sectionName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Section name</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a type" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {[
                        "RawMaterial",
                        "Quality",
                        "Processing",
                        "ProductionMethod",
                        "Packaging",
                        "Transportation",
                        "Crafting",
                        "Installation",
                        "Finishing",
                        "Preparation",
                        "CookingProcess",
                        "PaintingAndLacquering",
                        "Embroidery",
                      ].map((section, index) => (
                        <SelectItem value={section} key={index}>
                          {section}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="autoAddMaterials"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel>
                      Automatically add all materials
                    </FormLabel>
                    <p className="text-sm text-gray-500">
                      This will create value entries for each material in this section
                    </p>
                  </div>
                </FormItem>
              )}
            />
            
            <Button
              type="submit"
              className="w-full max-w-md"
              disabled={createSection.isPending}
            >
              {createSection.isPending ? (
                <>
                  <RefreshCcw className="mr-2 h-4 w-4 animate-spin" />
                  Please wait...
                </>
              ) : (
                "Create section"
              )}
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};