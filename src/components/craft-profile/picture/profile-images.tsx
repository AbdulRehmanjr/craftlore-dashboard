import Image from "next/image";
import { api } from "~/trpc/server";

export const ProfileImages = async ({ subId }: { subId: string }) => {
  const pictures = await api.craft.getPictures({ subId: subId });
  return (
    <div className="grid grid-cols-3 gap-3">
      {pictures.map((pictureObject,index) => (
        <div className="relative h-32 w-full" key={index}>
          <Image src={pictureObject.picture} alt="Craft images" fill />
        </div>
      ))}
    </div>
  );
};
