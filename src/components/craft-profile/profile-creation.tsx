import React from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import { ProfileSectionCreation } from "~/components/craft-profile/section/section-creation";
import { ProfileSectionList } from "~/components/craft-profile/section-list";
import { PenLine, ListChecks } from "lucide-react";
import { ProfilePicture } from './picture/profile-pictures';

type ComponentProps = {
  subId: string;
};

export const ProfileCreation = ({ subId }: ComponentProps) => {
  return (
    <div className="space-y-6">
      <Card className="shadow-sm">
        <CardHeader className="border-b">
          <div className="flex items-center gap-2">
            <PenLine className="h-5 w-5 text-primary" />
            <div>
              <CardTitle className="text-2xl font-heading">Craft Profile</CardTitle>
              <CardDescription className="mt-1.5 font-text">
                Create and manage your craft profile sections
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-6 space-y-6">
          
          {/* Creation Section */}
          <Card className="border-2 border-dashed">
            <CardHeader className="pb-3">
              <div className="flex items-center gap-2">
                <PenLine className="h-4 w-4 text-primary" />
                <div>
                  <CardTitle className="text-lg">New Section</CardTitle>
                  <CardDescription>
                    Add a new section to your craft profile
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <ProfileSectionCreation subId={subId} />
            </CardContent>
          </Card>

          {/* Picture Section */}
          <ProfilePicture subId={subId}/>

          {/* List Section */}
          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center gap-2">
                <ListChecks className="h-4 w-4 text-primary" />
                <div>
                  <CardTitle className="text-lg">Existing Sections</CardTitle>
                  <CardDescription>
                    View and manage your profile sections
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <ProfileSectionList subId={subId} />
            </CardContent>
          </Card>
        </CardContent>
      </Card>
    </div>
  );
};
