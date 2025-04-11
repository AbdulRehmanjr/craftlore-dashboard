"use client";
import React, { useEffect, useState } from "react";
import { api } from "~/trpc/react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Trash, PlusCircle, Save, FileText, Loader2 } from "lucide-react";
import { v4 as uuidv4 } from "uuid";
import { useToast } from "~/hooks/use-toast";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "~/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "~/components/ui/form";

const materialValueSchema = z.object({
  defaultName: z.string().optional(),
  defaultCost: z.string().default("0"),
});

type MaterialValueFormData = z.infer<typeof materialValueSchema>;

// Schema for a single valu
const valueSchema = z.object({
  valueId: z.string(),
  priceSectionId: z.string(),
  materialId: z.string().min(1, { message: "Material is required" }),
  cost: z.number().min(0, { message: "Cost must be greater than 0" }),
  name: z.string().min(1, { message: "Name is required" }),
  new: z.boolean().default(false),
  modified: z.boolean().default(false),
  createdAt: z.date().optional(),
});

type SectionValue = z.infer<typeof valueSchema>;

type Section = {
  priceSectionId: string;
  subCategoryId: string;
  sectionType: string;
  values: SectionValue[];
  isOpen: boolean;
};

export const PriceSectionList = ({ subId }: { subId: string }) => {
  const { toast } = useToast();
  const [isAddingMaterials, setIsAddingMaterials] = useState(false);
  const [currentSectionIndex, setCurrentSectionIndex] = useState<number | null>(null);
  const [editableSections, setEditableSections] = useState<Section[]>([]);

  // Material and section data queries
  const [materials] = api.category.getAllMaterials.useSuspenseQuery({
    subId: subId,
  });
  const [sections] = api.price.getSectionsBySubCategory.useSuspenseQuery({
    subCategoryId: subId,
  });

  // Form for setting default values when adding materials
  const defaultValueForm = useForm<MaterialValueFormData>({
    resolver: zodResolver(materialValueSchema),
    defaultValues: {
      defaultName: "",
      defaultCost: "0",
    },
  });

  // Initialize editableSections from API data
  useEffect(() => {
    if (sections) {
      const formattedSections = sections.map((section) => {
        const formattedValues = section.values.length > 0
          ? section.values
              .map((value) => ({
                valueId: value.valueId,
                priceSectionId: value.priceSectionId,
                materialId: value.materialId,
                cost: value.value,
                new: false,
                modified: false,
                name: value.name ?? "",
                createdAt: new Date(),
              }))
              .sort((a, b) => a.valueId.localeCompare(b.valueId))
          : [];
        
        return {
          ...section,
          isOpen: true,
          values: formattedValues,
        };
      });

      setEditableSections(formattedSections);
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

  // Function to create a new value
  function createNewValue(
    sectionId: string,
    materialId = "",
    materialName = "",
    defaultName = "",
    defaultCost = "0",
  ): SectionValue {
    return {
      valueId: uuidv4(),
      priceSectionId: sectionId,
      materialId: materialId,
      cost: Number(defaultCost) || 0,
      new: true,
      modified: false,
      name: defaultName || materialName,
      createdAt: new Date(),
    };
  }

  // Function to open dialog for adding all materials with default values
  const openAddAllMaterialsDialog = (sectionIndex: number) => {
    setCurrentSectionIndex(sectionIndex);
    setIsAddingMaterials(true);
    defaultValueForm.reset({
      defaultName: "",
      defaultCost: "0",
    });
  };

  // Function to add values for all materials to a section with default values
  const addAllMaterialValues = (data: MaterialValueFormData) => {
    if (currentSectionIndex === null) {
      setIsAddingMaterials(false);
      return;
    }

    const sectionIndex = currentSectionIndex;
    const section = editableSections[sectionIndex];
    if (!section) return;

    // Create new values for all materials
    const newValues = materials.map((material) => {
      const valueName = data.defaultName ?? material.materialName;
      return createNewValue(
        section.priceSectionId,
        material.materialId,
        material.materialName,
        valueName,
        data.defaultCost || "0",
      );
    });

    // Add new values to the section
    setEditableSections((prevSections) => {
      const updatedSections = [...prevSections];
      if (newValues.length > 0) {
        updatedSections[sectionIndex] = {
          ...section,
          values: [...section.values, ...newValues],
        };
      }
      return updatedSections;
    });

    // Close dialog
    setIsAddingMaterials(false);
    setCurrentSectionIndex(null);

    // Show toast message
    toast({
      title: "Materials Added",
      description: `Added ${materials.length} new value entries.`,
      variant: "default",
    });
  };

  // Function to add a new value to a section
  const addSingleValue = (sectionIndex: number) => {
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
              createNewValue(updatedSections[sectionIndex].priceSectionId),
            ]
          : [createNewValue(updatedSections[sectionIndex].priceSectionId)],
      };

      return updatedSections;
    });
  };

  const updateValue = (
    sectionIndex: number,
    valueIndex: number,
    field: "name" | "materialId" | "cost",
    newValue: string,
  ) => {
    setEditableSections((prevSections) => {
      const updatedSections = [...prevSections];
  
      if (updatedSections[sectionIndex]?.values?.[valueIndex]) {
        if (field === "cost") {
          updatedSections[sectionIndex].values[valueIndex][field] = Number(newValue) || 0;
        } else {
          updatedSections[sectionIndex].values[valueIndex][field] = newValue;
        }
        updatedSections[sectionIndex].values[valueIndex].modified = true;
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
    const value = editableSections[sectionIndex]?.values[valueIndex];
    if (!value) return;

    // Validate required fields
    if (!value.materialId || !value.name || value.cost <= 0) {
      toast({
        variant: "destructive",
        title: "Validation Error",
        description: "Please fill in all required fields with valid values.",
      });
      return;
    }

    if (value.new) {
      const valueToSave = {
        sectionId: value.priceSectionId,
        materialId: value.materialId,
        valueName: value.name,
        value: value.cost,
      };

      createValueProps.mutate(valueToSave);

      setEditableSections((prevSections) => {
        const updatedSections = [...prevSections];
        if (updatedSections[sectionIndex]?.values?.[valueIndex]) {
          updatedSections[sectionIndex].values[valueIndex] = {
            ...updatedSections[sectionIndex].values[valueIndex],
            new: false,
            modified: false,
          };
        }
        return updatedSections;
      });
    } else if (value.modified) {
      const valueToSave = {
        valueId: value.valueId,
        valueName: value.name,
        value: value.cost,
      };

      updateValueProps.mutate(valueToSave);

      setEditableSections((prevSections) => {
        const updatedSections = [...prevSections];
        if (updatedSections[sectionIndex]?.values?.[valueIndex]) {
          updatedSections[sectionIndex].values[valueIndex].modified = false;
        }
        return updatedSections;
      });
    }
  };

  const handleSaveAll = (sectionIndex: number) => {
    const section = editableSections[sectionIndex];
    if (!section) return;

    // Filter for only new or modified values
    const valuesToUpdate = section.values.filter(value => value.new || value.modified);
    
    if (valuesToUpdate.length === 0) {
      toast({
        title: "Nothing to Update",
        description: "No values have been modified.",
      });
      return;
    }

    // Check if all values have required fields
    const invalidValues = valuesToUpdate.filter(
      value => !value.materialId || !value.name || value.cost <= 0
    );
    
    if (invalidValues.length > 0) {
      toast({
        variant: "destructive",
        title: "Validation Error",
        description: "Please fill in all required fields with valid values.",
      });
      return;
    }

    // Save all values
    valuesToUpdate.forEach(value => {
      if (value.new) {
        createValueProps.mutate({
          sectionId: value.priceSectionId,
          materialId: value.materialId,
          valueName: value.name,
          value: value.cost,
        });
      } else if (value.modified) {
        updateValueProps.mutate({
          valueId: value.valueId,
          valueName: value.name,
          value: value.cost,
        });
      }
    });

    // Update UI state
    setEditableSections((prevSections) => {
      const updatedSections = [...prevSections];
      if (updatedSections[sectionIndex]) {
        updatedSections[sectionIndex].values = updatedSections[sectionIndex].values.map(value => ({
          ...value,
          new: false,
          modified: false,
        }));
      }
      return updatedSections;
    });

    toast({
      title: "Saving...",
      description: `Updating ${valuesToUpdate.length} values.`,
    });
  };

  // Count modified values in a section
  const getModifiedCount = (sectionIndex: number): number => {
    const section = editableSections[sectionIndex];
    if (!section) return 0;
    
    return section.values.filter(value => value.new || value.modified).length;
  };

  return (
    <>
      {editableSections.map((section, sectionIndex) => (
        <Card key={section.priceSectionId} className="col-span-2 mb-6">
          <CardHeader className="grid gap-2 sticky top-0 bg-white z-10 shadow-sm">
            <div className="flex justify-between items-center">
              <CardTitle>{section.sectionType}</CardTitle>
              <div className="flex gap-2">
                <Button
                  variant="default"
                  onClick={() => openAddAllMaterialsDialog(sectionIndex)}
                  className="w-fit"
                >
                  <PlusCircle className="mr-2 h-4 w-4" /> Add All Materials
                </Button>
                <Button
                  variant="outline"
                  onClick={() => addSingleValue(sectionIndex)}
                  className="w-fit"
                >
                  <PlusCircle className="mr-2 h-4 w-4" /> Add Single Value
                </Button>
                <Button
                  variant="secondary"
                  onClick={() => handleSaveAll(sectionIndex)}
                  className="w-fit"
                  disabled={createValueProps.isPending || updateValueProps.isPending || getModifiedCount(sectionIndex) === 0}
                >
                  {(createValueProps.isPending || updateValueProps.isPending) ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <>
                      <Save className="mr-2 h-4 w-4" /> Save All
                      {getModifiedCount(sectionIndex) > 0 && 
                        <span className="ml-1 text-xs bg-primary/20 py-0.5 px-1.5 rounded-full">
                          {getModifiedCount(sectionIndex)}
                        </span>
                      }
                    </>
                  )}
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-2">
            {section.values.map((value, valueIndex) => (
              <div 
                key={value.valueId} 
                className={`flex items-center gap-2 rounded border p-2 ${
                  value.new || value.modified ? "bg-yellow-50" : "bg-gray-50"
                }`}
              >
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
                    className="w-1/3"
                    aria-invalid={!value.name && !value.new ? "true" : "false"}
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
                    <SelectTrigger className={!value.materialId && !value.new ? "border-red-500" : ""}>
                      <SelectValue placeholder="Select material" />
                    </SelectTrigger>
                    <SelectContent>
                      {materials.map((material) => (
                        <SelectItem
                          key={material.materialId}
                          value={material.materialId}
                        >
                          {material.materialName}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  <Input
                    type="number"
                    placeholder="Cost"
                    value={value.cost}
                    onChange={(e) =>
                      updateValue(
                        sectionIndex,
                        valueIndex,
                        "cost",
                        e.target.value,
                      )
                    }
                    className="w-1/3"
                    aria-invalid={value.cost <= 0 && !value.new ? "true" : "false"}
                  />

                  <div className="flex items-center gap-2">
                    <Button
                      type="button"
                      onClick={() => handleSave(sectionIndex, valueIndex)}
                      disabled={
                        createValueProps.isPending || 
                        updateValueProps.isPending ||
                        (!value.name && !value.new) || 
                        (!value.materialId && !value.new) ||
                        (value.cost <= 0 && !value.new) ||
                        (!value.new && !value.modified)
                      }
                      className={`ml-2 ${(value.new || value.modified) ? "bg-yellow-500 hover:bg-yellow-600" : ""}`}
                    >
                      {(createValueProps.isPending || updateValueProps.isPending) ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <>
                          <Save className="h-4 w-4" /> Save
                          {value.modified && !value.new && " *"}
                        </>
                      )}
                    </Button>

                    <Button
                      type="button"
                      variant="destructive"
                      onClick={() => deleteValue(sectionIndex, valueIndex)}
                      className="ml-2"
                      disabled={createValueProps.isPending || updateValueProps.isPending}
                    >
                      <Trash className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      ))}

      {/* Dialog for adding all materials with default values */}
      <Dialog open={isAddingMaterials} onOpenChange={setIsAddingMaterials}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Materials with Default Values</DialogTitle>
          </DialogHeader>

          <Form {...defaultValueForm}>
            <form
              onSubmit={defaultValueForm.handleSubmit(addAllMaterialValues)}
              className="space-y-4"
            >
              <FormField
                control={defaultValueForm.control}
                name="defaultName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Default Name Prefix</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Enter a default name (material name will be used if empty)"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={defaultValueForm.control}
                name="defaultCost"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Default Cost</FormLabel>
                    <FormControl>
                      <Input type="number" placeholder="0" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <DialogFooter>
                <Button type="submit" className="w-full">
                  <FileText className="mr-2 h-4 w-4" />
                  Add Materials
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </>
  );
};
