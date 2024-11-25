"use client";

import { useForm } from "react-hook-form";
import { api } from "~/trpc/react";
import { Input } from "~/components/ui/input";
import { Textarea } from "~/components/ui/textarea";
import { Button } from "~/components/ui/button";
import { useToast } from "~/hooks/use-toast";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {Form,FormField,FormItem,FormControl,FormMessage,FormLabel} from "~/components/ui/form";
import {Card,CardContent,CardDescription,CardHeader,CardTitle} from "~/components/ui/card";
import {Select,SelectContent,SelectTrigger,SelectValue,SelectItem} from "~/components/ui/select";
import { MEALPLANS } from "~/constants";
import { RefreshCcw } from "lucide-react";


const formSchema = z.object({
  rateName: z.string({ required_error: "Field is required" }),
  hotelId: z.string({ required_error: "Field is required" }),
  mealId: z.string({ required_error: "Field is required" }),
  description: z.string({ required_error: "Field is required" }),
});




export const RateCreationForm = () => {
  
  const { toast } = useToast();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
  });

  const utils = api.useUtils()
  const hotelData = api.hotel.getAllHotelBySellerId.useQuery();

  const createPlan =  api.rateplan.createRatePlan.useMutation({
    onSuccess: async () => {
      toast({
        title: "Success!",
        description: "Rate plan added successfully.",
      });
      form.reset();
      await utils.rateplan.getRatePlanBySellerId.invalidate()
    },
    onError: (error) => {
      toast({
        variant: "destructive",
        title: "Oop!",
        description: error.message,
      });
    }
  });

  const formSubmitted = (data: z.infer<typeof formSchema>) => {
    createPlan.mutate({
      rateName: data.rateName,
      description: data.description,
      mealId: +data.mealId,
      hotelId: data.hotelId,
    });
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(formSubmitted)}
        className="w-full space-y-8"
      >
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <Card className="shadow-md">
            <CardHeader className="text-primary">
              <CardTitle className="text-2xl">Rate plan Information</CardTitle>
              <CardDescription>
                Enter the basic details of the rate plan
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <FormField
                control={form.control}
                name="rateName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Rate plan name</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Enter rate plan name"
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
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Rate plan description</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Enter rate plan description"
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

          <Card className="shadow-md">
            <CardHeader className="text-primary">
              <CardTitle className="text-2xl">Hotel & Meal</CardTitle>
              <CardDescription>
                Select hotel and meal type for rate plan
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <FormField
                control={form.control}
                name="mealId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Meal type</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      value={field.value ?? ""}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a meal type" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {MEALPLANS.map((meal) => (
                          <SelectItem value={`${meal.code}`} key={meal.code}>
                            {meal.name}
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
                name="hotelId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Hotel</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      value={field.value ?? ""}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a hotel" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {hotelData.data?.map((hotel) => (
                          <SelectItem key={hotel.hotelId} value={hotel.hotelId}>
                            {hotel.hotelName}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
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
            disabled={createPlan.isPending}
          >
            {createPlan.isPending ? (
              <>
                <RefreshCcw className="mr-2 h-4 w-4 animate-spin" />
                Creating plan...
              </>
            ) : (
              "Create rate plan"
            )}
          </Button>
        </div>
      </form>
    </Form>
  );
};
