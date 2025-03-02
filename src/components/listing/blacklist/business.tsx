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
  businessId: string;
};

export const BlacklistBusiness  = ({ businessId }: ComponentProps)=> {
  const utils = api.useUtils();
  const [open, setOpen] = useState(false);

  const blacklist = api.listing.blackListBusiness.useMutation({
    onSuccess: () => {
      toast({
        title: "Success!",
        description: "Business blacklisted",
      });
      setOpen((prev)=>!prev)
      void utils.listing.getBusinesses.refetch();
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
    blacklist.mutate({businessId})
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
          <DialogTitle>Blacklist Business</DialogTitle>
          <DialogDescription>
            Are you sure you want to blacklist the business? This action will
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
