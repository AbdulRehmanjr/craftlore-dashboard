import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import { ProfileSectionCreation } from "~/components/craft-profile/section/section-creation";
import { ProfileSectionList } from "~/components/craft-profile/section-list";

type ComponentProps = {
  subId: string;
};

export const ProfileCreation = ({ subId }: ComponentProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Craft profile</CardTitle>
        <CardDescription>Entering data for craft profile</CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        <ProfileSectionCreation subId={subId} />
        <ProfileSectionList subId={subId} />
      </CardContent>
    </Card>
  );
};
