"use client";

import { api } from "~/trpc/react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "~/components/ui/accordion";
import { ProfileSectionUpdation } from "~/components/craft-profile/section/section-updation";
import { ProfileSubSectionCreation } from "~/components/craft-profile/sub-section/sub-creation";
import { ProfileSubSectionUpdation } from "~/components/craft-profile/sub-section/sub-updation";
import { Textarea } from "../ui/textarea";
import { Button } from "../ui/button";
import { useEffect, useState } from "react";
import { useToast } from "~/hooks/use-toast";
import { Loader2 } from "lucide-react";

type ComponentProps = {
  subId: string;
};

export const ProfileSectionList = ({ subId }: ComponentProps) => {
  const { toast } = useToast();
  const [contents, setContents] = useState<Record<string, string>>({});
  const [sections] = api.craft.getSectionsBySubCategory.useSuspenseQuery({
    subCategoryId: subId,
  });

  const addContent = api.craft.createSubSectionContent.useMutation({
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Content saved successfully",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to save content",
        variant: "destructive",
      });
    },
  });

  useEffect(() => {
    const initialContents: Record<string, string> = {};
    sections.forEach((section) => {
      section.CraftSubSection.forEach((sub) => {
        if (sub.CraftContent && sub.CraftContent.length > 0) {
          initialContents[sub.craftsubsectionId] =
            sub.CraftContent[0]?.content ?? "";
        }
      });
    });
    setContents(initialContents);
  }, [sections]);

  const handleContentChange = (subsectionId: string, value: string) => {
    setContents((prev) => ({
      ...prev,
      [subsectionId]: value,
    }));
  };

  const handleSaveContent = async (subsectionId: string) => {
    addContent.mutate({
      subSectionId: subsectionId,
      content: contents[subsectionId] ?? "none",
    });
  };

  return (
    <Accordion type="multiple" className="space-y-4">
      {sections.map((data, index) => (
        <AccordionItem 
          value={data.craftsectionId} 
          key={index}
          className="border rounded-lg px-6"
        >
          <div className="flex items-center py-4">
            <AccordionTrigger className="hover:no-underline w-full">
              <h3 className="text-xl font-semibold">{data.sectionName}</h3>
            </AccordionTrigger>
            <div className="ml-4">
              <ProfileSectionUpdation
                sectionId={data.craftsectionId}
                sectionName={data.sectionName}
              />
            </div>
          </div>
          <AccordionContent>
            <div className="py-4">
              <div className="flex items-center justify-between mb-4">
                <p className="text-sm text-muted-foreground">
                  Entering data for {data.sectionName.toLowerCase()}
                </p>
                <ProfileSubSectionCreation sectionId={data.craftsectionId} />
              </div>
              <div className="space-y-10">
                {data.CraftSubSection.map((sub) => (
                  <div key={sub.craftsubsectionId} className="space-y-10">
                    <div className="flex items-center gap-2 rounded-md border-2 p-3 font-heading text-primary">
                      <p className="">{sub.sectionName}</p>
                      <ProfileSubSectionUpdation
                        sectionId={sub.craftsubsectionId}
                        sectionName={sub.sectionName}
                      />
                    </div>
                    <div className="space-y-2">
                      <Textarea
                        placeholder={`Enter content for ${sub.sectionName}...`}
                        value={contents[sub.craftsubsectionId] ?? ""}
                        onChange={(e) =>
                          handleContentChange(sub.craftsubsectionId, e.target.value)
                        }
                        className="min-h-[10rem]"
                      />
                      <div className="flex items-center justify-center">
                        <Button
                          type="button"
                          onClick={() => handleSaveContent(sub.craftsubsectionId)}
                          disabled={addContent.isPending}
                        >
                          {addContent.isPending ? (
                            <>
                              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                              Saving
                            </>
                          ) : (
                            "Save Content"
                          )}
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  );
};