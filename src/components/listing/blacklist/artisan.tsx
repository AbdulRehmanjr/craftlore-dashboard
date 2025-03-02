"use client";

import { useState } from "react";
import { Button } from "~/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "~/components/ui/dialog";
import { api } from "~/trpc/react";
import { toast } from "~/hooks/use-toast";

type ComponentProps = {
  artisanId: string;
};

export const BlacklistArtisan  = ({ artisanId }: ComponentProps)=> {
  const utils = api.useUtils();
  const [open, setOpen] = useState<boolean>(false);

  const blacklist = api.listing.blackListArtisan.useMutation({
    onSuccess: () => {
      toast({
        title: "Success!",
        description: "Artisan blacklisted",
      });
      setOpen((prev)=>!prev)
      void utils.listing.getArtisans.refetch();
    },
    onError: () => {
      toast({
        variant: "destructive",
        title: "ERROR!",
        description: "Something went wrong",
      });
    },
  });

  const handleBlacklist =  () => {
    blacklist.mutate({artisanId})
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="destructive" className="h-full w-full">
          Blacklist
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Blacklist Artisan</DialogTitle>
          <DialogDescription>
            Are you sure you want to blacklist the artisan? This action will
            change the institute status from active to blacklist.
          </DialogDescription>
        </DialogHeader>

        <DialogFooter className="sm:justify-end">
          <Button
            type="button"
            variant="secondary"
            onClick={() => setOpen(false)}
            disabled={blacklist.isPending}
          >
            Cancel
          </Button>
          <Button
            type="button"
            variant="destructive"
            onClick={handleBlacklist}
            disabled={blacklist.isPending}
          >
            {blacklist.isPending ? "Processing..." : "Confirm Blacklist"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
