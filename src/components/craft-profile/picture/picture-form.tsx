"use client";

import { Button } from "~/components/ui/button";
import { useToast } from "~/hooks/use-toast";
import { api } from "~/trpc/react";
import {
  CldUploadWidget,
  type CloudinaryUploadWidgetResults,
} from "next-cloudinary";
import { useState } from "react";

export const ProfilePictureCreation = ({ subId }: { subId: string }) => {
  const [images, setImages] = useState<string[]>([]);
  const { toast } = useToast();

  const createPictures = api.craft.createPictures.useMutation({
    onSuccess: async () => {
      toast({
        title: "Success!",
        description: "pictures added successfully.",
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

  return (
    <CldUploadWidget
      options={{ sources: ["local"] }}
      uploadPreset="sshea_1"
      onSuccess={(result: CloudinaryUploadWidgetResults) => {
        const info = result.info;
        if (typeof info !== "string") {
          const secure_url = info?.secure_url ?? "none";
          if (secure_url) {
            const currentImages = Array.isArray(images) ? images : [];
            const updatedImages = [...currentImages, secure_url];
            setImages(updatedImages);
            createPictures.mutate({
                subId: subId,
                images: updatedImages,
              });
          }
        }
      }}
    >
      {({ open }) => {
        function handleOnClick() {
          open();
        }
        return (
          <Button
            type="button"
            onClick={handleOnClick}
            className="w-fit bg-primary text-white"
          >
            Upload pictures
          </Button>
        );
      }}
    </CldUploadWidget>
  );
};
