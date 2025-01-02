import Image from "next/image";
import { api } from "~/trpc/server";

export const ProfileImages = async ({ subId }: { subId: string }) => {
  const pictures = await api.craft.getPictures({ subId: subId });
  return (
    <>
      {pictures.map((pictureObject) => (
        <div key={pictureObject.pictureId} className="grid grid-cols-3 gap-3">
          {pictureObject.pictures.map((picture, index) => (
            <div className="relative h-32 w-full" key={index}>
              <Image src={picture} alt="Craft images" fill  />
            </div>
          ))}
        </div>
      ))}
    </>
  );
};
