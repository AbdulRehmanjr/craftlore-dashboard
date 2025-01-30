"use client";

import { useForm } from "react-hook-form";
import { api } from "~/trpc/react";
import { Input } from "~/components/ui/input";
import { Textarea } from "~/components/ui/textarea";
import { Button } from "~/components/ui/button";
import { useToast } from "~/hooks/use-toast";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormField,
  FormItem,
  FormControl,
  FormMessage,
  FormLabel,
} from "~/components/ui/form";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import { RefreshCcw } from "lucide-react";

const formSchema = z.object({
  fullName: z.string({ required_error: "Field is required" }),
  organization :  z.string({ required_error: "Field is required" }),
  skills: z.string({ required_error: "Field is required" }),
  contribution: z.string({ required_error: "Field is required" }),
});

export const CreateEmployeeForm = () => {
  const { toast } = useToast();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
  });
  const utils = api.useUtils();

  const createEmployee = api.employ.createEmployee.useMutation({
    onSuccess: async () => {
      toast({
        title: "Success!",
        description: "Employee added successfully.",
      });
      form.reset();
      await utils.employ.getEmployees.invalidate();
    },
    onError: (error) => {
      toast({
        variant: "destructive",
        title: "Oop!",
        description: error.message,
      });
    },
  });

  const formSubmitted = (data: z.infer<typeof formSchema>) => {
    createEmployee.mutate({
      fullName: data.fullName,
      skills: data.skills,
      contribution: data.contribution,
      organization: data.organization
    });
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(formSubmitted)}
        className="w-full space-y-8"
      >
        <div className="grid gap-6">
          <Card className="shadow-md">
            <CardHeader className="text-primary">
              <CardTitle className="text-2xl">Employee information</CardTitle>
              <CardDescription>
                Enter the basic details of employee
              </CardDescription>
            </CardHeader>
            <CardContent className="grid gap-6">
              <FormField
                control={form.control}
                name="fullName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Full name</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Enter the employee name"
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
                name="organization"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Organization</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Enter the organization name"
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
                name="skills"
                render={({ field }) => (
                  <FormItem className="col-span-1 md:col-span-2 lg:col-span-3">
                    <FormLabel>Employee skills</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Enter employee skills"
                        {...field}
                        value={field.value ?? ""}
                        rows={4}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="contribution"
                render={({ field }) => (
                  <FormItem className="col-span-1 md:col-span-2 lg:col-span-3">
                    <FormLabel>Employee contribution</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Enter employee contribution"
                        {...field}
                        value={field.value ?? ""}
                        rows={4}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>
        </div>

        <div className="flex justify-center">
          <Button
            type="submit"
            className="w-full max-w-md"
            disabled={createEmployee.isPending}
          >
            {createEmployee.isPending ? (
              <>
                <RefreshCcw className="mr-2 h-4 w-4 animate-spin" />
                Please wait...
              </>
            ) : (
              "Create employee"
            )}
          </Button>
        </div>
      </form>
    </Form>
  );
};
