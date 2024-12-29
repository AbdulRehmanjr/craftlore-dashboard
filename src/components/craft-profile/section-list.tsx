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
import { Textarea } from "~/components/ui/textarea";
import { Button } from "~/components/ui/button";
import { useEffect, useState } from "react";
import { useToast } from "~/hooks/use-toast";
import { Loader2 } from "lucide-react"; 
import { SectionDeletion } from "~/components/craft-profile/section/section-deletion";
import { SubSectionDeletion } from "~/components/craft-profile/sub-section/sub-deletion";
import { ProfileSectionMCQ } from "~/components/craft-profile/quiz";

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
    <div className="space-y-6">
      <Accordion type="multiple" className="space-y-4">
        {sections.map((section) => (
          <AccordionItem
            key={section.craftsectionId}
            value={section.craftsectionId}
            className="rounded-lg border bg-white shadow-sm"
          >
            {/* Accordion Trigger */}
            <div className="flex items-center justify-between p-4">
              <AccordionTrigger className="text-lg font-semibold tracking-wide">
                {section.rank}. {section.sectionName}
              </AccordionTrigger>

              <div className="flex items-center gap-2">
                <ProfileSectionUpdation
                  sectionId={section.craftsectionId}
                  sectionName={section.sectionName}
                  rank={section.rank}
                />
                <SectionDeletion
                  sectionId={section.craftsectionId}
                  subId={subId}
                />
              </div>
            </div>

            {/* Accordion Content */}
            <AccordionContent>
              <div className="p-4 pt-2 border-t">
                <div className="mb-4 flex items-center justify-between">
                  <p className="text-sm text-muted-foreground">
                    Entering data for {section.sectionName.toLowerCase()}
                  </p>
                  <ProfileSubSectionCreation
                    sectionId={section.craftsectionId}
                  />
                </div>

                <div className="space-y-8">
                  {section.CraftSubSection.map((sub) => (
                    <div key={sub.craftsubsectionId} className="space-y-4">
                      {/* Sub-section Header */}
                      <div className="flex items-center justify-between rounded-md border bg-muted/10 p-3 font-heading text-primary">
                        <p className="text-sm font-semibold">
                          {sub.rank}. {sub.sectionName}
                        </p>
                        <div className="flex items-center gap-2">
                          <ProfileSubSectionUpdation
                            sectionId={sub.craftsubsectionId}
                            sectionName={sub.sectionName}
                            rank={sub.rank}
                          />
                          <SubSectionDeletion subId={sub.craftsubsectionId} />
                        </div>
                      </div>

                      {/* Sub-section Content Textarea */}
                      <div className="rounded-md bg-muted/5 p-4">
                        <Textarea
                          placeholder={`Enter content for ${sub.sectionName}...`}
                          value={contents[sub.craftsubsectionId] ?? ""}
                          onChange={(e) =>
                            handleContentChange(
                              sub.craftsubsectionId,
                              e.target.value,
                            )
                          }
                          className="min-h-[8rem]"
                        />
                        <div className="mt-3 flex justify-end">
                          <Button
                            type="button"
                            variant="default"
                            onClick={() =>
                              handleSaveContent(sub.craftsubsectionId)
                            }
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

                {/* Optional: Place your section-level MCQ here */}
                <div className="mt-6 pt-4 border-t">
                  <ProfileSectionMCQ sectionId={section.craftsectionId} />
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  );
};
