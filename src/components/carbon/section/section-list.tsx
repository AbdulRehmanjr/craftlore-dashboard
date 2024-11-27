"use client";
import React, { useState } from "react";
import { api } from "~/trpc/react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Trash, PlusCircle, Save } from "lucide-react";
import { v4 as uuidv4 } from "uuid";
import { useToast } from "~/hooks/use-toast";

// Define the type for your section and value
type SectionValue = {
  valueId: string;
  sectionId: string;
  name: string;
  lowerLimit: string;
  upperLimit: string;
  new: boolean;
};

type Section = {
  sectionId: string;
  subcategoryId: string;
  name: string;
  values: SectionValue[];
};

export const CarbonSectionList = ({ subId }: { subId: string }) => {
  const { toast } = useToast();
  const [sections] = api.carbon.getSectionsBySubCategory.useSuspenseQuery({
    subCategoryId: subId,
  });

  const createValueProps = api.carbon.createValueProp.useMutation({
    onSuccess: async () => {
      toast({
        title: "Success!",
        description: "Value added successfully.",
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

  const updateValueProps = api.carbon.updateValueProp.useMutation({
    onSuccess: async () => {
      toast({
        title: "Success!",
        description: "Value updated successfully.",
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

  const [editableSections, setEditableSections] = useState<Section[]>(
    sections.map((section) => ({
      ...section,
      values:
        section.values.length > 0
          ? section.values.map((value) => ({
              ...value,
              lowerLimit: value.value.split("-")[0] ?? "",
              upperLimit: value.value.split("-")[1] ?? "",
              new: false,
            }))
          : [],
    })),
  );

  function createNewValue(sectionId: string): SectionValue {
    return {
      valueId: uuidv4(),
      sectionId: sectionId,
      name: "",
      lowerLimit: "0",
      upperLimit: "0",
      new: true,
    };
  }

  // Function to add a new value to a section
  const addValue = (sectionIndex: number) => {
    setEditableSections((prevSections) => {
      const updatedSections = [...prevSections];

      // Explicit null check and initialization
      if (!updatedSections[sectionIndex]) {
        console.error("Section not found at index", sectionIndex);
        return prevSections;
      }
      // Ensure values array exists
      updatedSections[sectionIndex] = {
        ...updatedSections[sectionIndex],
        values: updatedSections[sectionIndex].values
          ? [
              ...updatedSections[sectionIndex].values,
              createNewValue(updatedSections[sectionIndex].sectionId),
            ]
          : [createNewValue(updatedSections[sectionIndex].sectionId)],
      };

      return updatedSections;
    });
  };

  // Function to update a value
  const updateValue = (
    sectionIndex: number,
    valueIndex: number,
    field: "name" | "lowerLimit" | "upperLimit",
    newValue: string,
  ) => {
    setEditableSections((prevSections) => {
      const updatedSections = [...prevSections];

      // Null check and type guard
      if (updatedSections[sectionIndex]?.values?.[valueIndex]) {
        updatedSections[sectionIndex].values[valueIndex][field] = newValue;
      }
      return updatedSections;
    });
  };

  // Function to delete a value
  const deleteValue = (sectionIndex: number, valueIndex: number) => {
    setEditableSections((prevSections) => {
      const updatedSections = [...prevSections];
      const currentSection = updatedSections[sectionIndex];

      // Null checks
      if (currentSection?.values) {
        // Remove the value
        currentSection.values.splice(valueIndex, 1);
      }
      return updatedSections;
    });
  };

  const handleSave = (sectionIndex: number, valueIndex: number) => {
    const value = editableSections[sectionIndex]!.values[valueIndex];

    if (value?.new) {
      if (value?.name && value.lowerLimit && value.upperLimit) {
        const valueToSave = {
          sectionId: value.sectionId,
          name: value.name,
          value: `${value.lowerLimit}-${value.upperLimit}`,
        };

        createValueProps.mutate(valueToSave);

        setEditableSections((prevSections) => {
          const updatedSections = [...prevSections];
          if (updatedSections[sectionIndex]?.values?.[valueIndex]) {
            updatedSections[sectionIndex].values[valueIndex].new = false;
          }
          return updatedSections;
        });
      }
    } else {
      if (value?.name && value.lowerLimit && value.upperLimit) {
        const valueToSave = {
          valueId: value.valueId,
          name: value.name,
          value: `${value.lowerLimit}-${value.upperLimit}`,
        };

        updateValueProps.mutate(valueToSave);
      }
    }
  };

  return (
    <>
      {editableSections.map((section, sectionIndex) => (
        <Card key={section.sectionId} className="col-span-2">
          <CardHeader className="grid gap-2">
            <CardTitle>{section.name}</CardTitle>
            <Button
              variant="outline"
              onClick={() => addValue(sectionIndex)}
              className="mt-2 w-fit"
            >
              <PlusCircle className="mr-2 h-4 w-4" /> Add Value
            </Button>
          </CardHeader>
          <CardContent className="space-y-2">
            {section.values.map((value, valueIndex) => (
              <div key={value.valueId} className="flex items-center gap-2">
                <div className="flex w-full items-center gap-2">
                  <Input
                    placeholder="Name"
                    value={value.name}
                    onChange={(e) =>
                      updateValue(
                        sectionIndex,
                        valueIndex,
                        "name",
                        e.target.value,
                      )
                    }
                    className="flex-grow"
                  />
                  <div className="flex items-center">
                    <Input
                      placeholder="Lower"
                      value={value.lowerLimit}
                      onChange={(e) =>
                        updateValue(
                          sectionIndex,
                          valueIndex,
                          "lowerLimit",
                          e.target.value,
                        )
                      }
                      className="mr-1 w-20"
                    />
                    <span>-</span>
                    <Input
                      placeholder="Upper"
                      value={value.upperLimit}
                      onChange={(e) =>
                        updateValue(
                          sectionIndex,
                          valueIndex,
                          "upperLimit",
                          e.target.value,
                        )
                      }
                      className="ml-1 w-20"
                    />
                    <span className="ml-2">kgCo2</span>
                  </div>
                  <Button
                    size="icon"
                    onClick={() => handleSave(sectionIndex, valueIndex)}
                    disabled={createValueProps.isPending}
                    className="ml-2"
                  >
                    <Save className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="destructive"
                    size="icon"
                    onClick={() => deleteValue(sectionIndex, valueIndex)}
                    className="ml-2"
                  >
                    <Trash className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </CardContent>
          <CardFooter className="flex gap-2">
            <Button variant="destructive" size="sm">
              <Trash className="mr-2 h-4 w-4" /> Delete Section
            </Button>
          </CardFooter>
        </Card>
      ))}
    </>
  );
};
