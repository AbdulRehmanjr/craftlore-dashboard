"use client";

import { RefreshCcw } from "lucide-react";
import { Button } from "~/components/ui/button";
import { useToast } from "~/hooks/use-toast";
import { api } from "~/trpc/react";

export const SeedButton = () => {
  const { toast } = useToast();

  const createCategory = api.seed.createValues.useMutation({
    onSuccess: async () => {
      toast({
        title: "Success!",
        description: "Added successfully.",
      });
    },
    onError: (error) => {
      toast({
        variant: "destructive",
        title: "Oop!",
        description: error.message,
      });
    },
  });

  const clicked = () => {
    createCategory.mutate({
      values: []
    });
  };

  return (
    <Button
      type="button"
      className="w-full max-w-md"
      disabled={createCategory.isPending}
      onClick={() => clicked()}
    >
      {createCategory.isPending ? (
        <>
          <RefreshCcw className="mr-2 h-4 w-4 animate-spin" />
          Please wait...
        </>
      ) : (
        "Create seed"
      )}
    </Button>
  );
};
