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
  instituteId: string;
};

export const BlacklistInstitute  = ({ instituteId }: ComponentProps)=> {
  const utils = api.useUtils();
  const [open, setOpen] = useState(false);

  const blacklist = api.listing.blackListInstitute.useMutation({
    onSuccess: () => {
      toast({
        title: "Success!",
        description: "Institute blacklisted",
      });
      setOpen((prev)=>!prev)
      void utils.listing.getInstitutes.refetch();
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
    blacklist.mutate({instituteId})
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
          <DialogTitle>Blacklist Institute</DialogTitle>
          <DialogDescription>
            Are you sure you want to blacklist the institute? This action will
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
