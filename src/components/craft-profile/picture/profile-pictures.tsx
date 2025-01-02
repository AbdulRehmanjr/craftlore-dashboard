import { PenLine } from "lucide-react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "~/components/ui/card";
import { ProfilePictureCreation } from "~/components/craft-profile/picture/picture-form";
import { ProfileImages } from "~/components/craft-profile/picture/profile-images";

export const ProfilePicture = ({ subId }: { subId: string }) => {
  return (
    <Card className="border-2 border-dashed">
      <CardHeader className="pb-3">
        <div className="flex items-center gap-2">
          <PenLine className="h-4 w-4 text-primary" />
          <div>
            <CardTitle className="text-lg">Craft Pictures</CardTitle>
            <CardDescription>
              Add pictures to your craft profile
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <ProfilePictureCreation subId={subId} />
        <ProfileImages subId={subId}/>
      </CardContent>
    </Card>
  );
};
