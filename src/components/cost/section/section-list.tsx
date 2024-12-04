"use client";
import React, { useEffect, useState } from "react";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";

type SectionValue = {
  valueId: string;
  priceSectionId: string;
  materialId: string;
  cost: string;
  name: string;
  new: boolean;
};

type Section = {
  priceSectionId: string;
  priceSubCategoryId: string;
  priceSectionType: PriceSectionTypeProps;
  PriceValue: SectionValue[];
};

export const PriceSectionList = ({ subId }: { subId: string }) => {
  const { toast } = useToast();
  const [materials] = api.price.getAllMaterials.useSuspenseQuery({
    subId: subId,
  });
  const [sections] = api.price.getSectionsBySubCategory.useSuspenseQuery({
    subCategoryId: subId,
  });

  const [editableSections, setEditableSections] = useState<Section[]>([]);

  useEffect(() => {
    if (sections) {
      setEditableSections(
        sections.map((section) => ({
          ...section,
          PriceValue:
            section.PriceValue.length > 0
              ? section.PriceValue.map((value) => ({
                  ...value,
                  cost: value.value,
                  new: false,
                  name: value.name ?? "", 
                }))
              : [],
        })),
      );
    }
  }, [sections]);

  const createValueProps = api.price.createPriceValueProp.useMutation({
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

  const updateValueProps = api.price.updatePriceValueProp.useMutation({
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

  function createNewValue(sectionId: string): SectionValue {
    return {
      valueId: uuidv4(),
      priceSectionId: sectionId,
      materialId: "",
      cost: "0",
      new: true,
      name: "",
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
      // Ensure PriceValue array exists
      updatedSections[sectionIndex] = {
        ...updatedSections[sectionIndex],
        PriceValue: updatedSections[sectionIndex].PriceValue
          ? [
              ...updatedSections[sectionIndex].PriceValue,
              createNewValue(updatedSections[sectionIndex].priceSectionId),
            ]
          : [createNewValue(updatedSections[sectionIndex].priceSectionId)],
      };

      return updatedSections;
    });
  };

  // Function to update a value
  const updateValue = (
    sectionIndex: number,
    valueIndex: number,
    field: "name" | "materialId" | "cost",
    newValue: string,
  ) => {
    setEditableSections((prevSections) => {
      const updatedSections = [...prevSections];

      // Null check and type guard
      if (updatedSections[sectionIndex]?.PriceValue?.[valueIndex]) {
        updatedSections[sectionIndex].PriceValue[valueIndex][field] = newValue;
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
      if (currentSection?.PriceValue) {
        // Remove the value
        currentSection.PriceValue.splice(valueIndex, 1);
      }
      return updatedSections;
    });
  };

  const handleSave = (sectionIndex: number, valueIndex: number) => {
    const value = editableSections[sectionIndex]!.PriceValue[valueIndex];
    if (value?.new) {
      if (value?.materialId && value.cost && value.name) {
        const valueToSave = {
          sectionId: value.priceSectionId,
          materialId: value.materialId,
          valueName: value.name,
          value: value.cost,
        };

        createValueProps.mutate(valueToSave);

        setEditableSections((prevSections) => {
          const updatedSections = [...prevSections];
          if (updatedSections[sectionIndex]?.PriceValue?.[valueIndex]) {
            updatedSections[sectionIndex].PriceValue[valueIndex].new = false;
          }
          return updatedSections;
        });
      }
    } else {
      if (value?.materialId && value.cost) {
        const valueToSave = {
          valueId: value.valueId,
          valueName: value.name,
          value: value.cost,
        };

        updateValueProps.mutate(valueToSave);
      }
    }
  };

  return (
    <>
      {editableSections.map((section, sectionIndex) => (
        <Card key={section.priceSectionId} className="col-span-2">
          <CardHeader className="grid gap-2">
            <CardTitle>{section.priceSectionType}</CardTitle>
            <Button
              variant="outline"
              onClick={() => addValue(sectionIndex)}
              className="mt-2 w-fit"
            >
              <PlusCircle className="mr-2 h-4 w-4" /> Add Value
            </Button>
          </CardHeader>
          <CardContent className="space-y-2">
            {section.PriceValue.map((value, valueIndex) => (
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
                    className="mr-1"
                  />
                  <Select
                    value={value.materialId}
                    onValueChange={(selectedValue) =>
                      updateValue(
                        sectionIndex,
                        valueIndex,
                        "materialId",
                        selectedValue,
                      )
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select the material" />
                    </SelectTrigger>
                    <SelectContent>
                      {materials.map((material) => (
                        <SelectItem
                          value={material.materialId}
                          key={material.materialId}
                        >
                          {material.materialName}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  <div className="flex items-center">
                    <Input
                      placeholder="Cost"
                      value={value.cost ?? '0'}
                      onChange={(e) =>
                        updateValue(
                          sectionIndex,
                          valueIndex,
                          "cost",
                          e.target.value,
                        )
                      }
                      className="mr-1 w-20"
                    />
                  </div>
                  <Button
                    onClick={() => handleSave(sectionIndex, valueIndex)}
                    disabled={createValueProps.isPending}
                    className="ml-2"
                  >
                    <Save className="h-4 w-4" /> Save
                  </Button>
                  <Button
                    variant="destructive"
                    onClick={() => deleteValue(sectionIndex, valueIndex)}
                    className="ml-2"
                  >
                    <Trash className="h-4 w-4" /> Delete
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
