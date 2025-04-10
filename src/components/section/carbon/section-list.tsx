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
import { Trash, PlusCircle, Save, FileText, Loader2, ChevronDown, ChevronUp } from "lucide-react";
import { v4 as uuidv4 } from "uuid";
import { useToast } from "~/hooks/use-toast";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "~/components/ui/dialog";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "~/components/ui/form";

// Schema for material value form
const materialValueSchema = z.object({
  defaultName: z.string().optional(),
  defaultLowerLimit: z.string().default("0"),
  defaultUpperLimit: z.string().default("0"),
});

type MaterialValueFormData = z.infer<typeof materialValueSchema>;

// Schema for a single value
const valueSchema = z.object({
  valueId: z.string(),
  carbonsectionId: z.string(),
  materialId: z.string().min(1, { message: "Material is required" }),
  lowerLimit: z.string().default("0"),
  upperLimit: z.string().default("0"),
  name: z.string().min(1, { message: "Name is required" }),
  new: z.boolean().default(false),
  modified: z.boolean().default(false),
  createdAt: z.date().optional(),
});

type SectionValue = z.infer<typeof valueSchema>;

type Section = {
  carbonsectionId: string;
  subCategoryId: string;
  sectionType: string;
  values: SectionValue[];
  isOpen: boolean; // Track if section is expanded or collapsed
};

export const CarbonSectionList = ({ subId }: { subId: string }) => {
  const { toast } = useToast();
  const [isAddingMaterials, setIsAddingMaterials] = useState(false);
  const [currentSectionIndex, setCurrentSectionIndex] = useState<number | null>(
    null,
  );
  const [editableSections, setEditableSections] = useState<Section[]>([]);

  // Material and section data queries
  const [materials] = api.category.getAllMaterials.useSuspenseQuery({
    subId: subId,
  });
  const [sections] = api.carbon.getSectionsBySubCategory.useSuspenseQuery({
    subCategoryId: subId,
  });

  // Mutation for deleting a value
  const deleteValueMutation = api.carbon.deleteValue.useMutation({
    onSuccess: () => {
      toast({
        title: "Success!",
        description: "Value deleted successfully.",
      });
    },
    onError: (error) => {
      toast({
        variant: "destructive",
        title: "Delete Failed",
        description: error.message,
      });
    },
  });

  // Form for setting default values when adding materials
  const defaultValueForm = useForm<MaterialValueFormData>({
    resolver: zodResolver(materialValueSchema),
    defaultValues: {
      defaultName: "",
      defaultLowerLimit: "0",
      defaultUpperLimit: "0",
    },
  });

  // Initialize editableSections from API data
  useEffect(() => {
    if (sections) {
      const formattedSections = sections.map((section) => {
        // Format and sort section values
        const formattedValues = section.values.length > 0
          ? section.values
              .map((value) => ({
                valueId: value.valueId,
                carbonsectionId: value.carbonsectionId,
                materialId: value.materialId,
                lowerLimit: value.value.split("-")[0] ?? "",
                upperLimit: value.value.split("-")[1] ?? "",
                new: false,
                modified: false, // Track if value has been modified
                name: value.name ?? "",
                createdAt: new Date(),
              }))
              .sort((a, b) => {
                // Sort by valueId to maintain insertion order
                return a.valueId.localeCompare(b.valueId);
              })
          : [];
        
        return {
          ...section,
          isOpen: true, // Start with all sections expanded
          values: formattedValues,
        };
      });

      setEditableSections(formattedSections);
    }
  }, [sections]);

  // API mutations
  const addSingleValueMutation = api.carbon.addSingleValue.useMutation({
    onSuccess: () => {
      toast({
        title: "Success!",
        description: "Value added successfully.",
      });
      if (currentSectionIndex !== null) {
        setEditableSections((prevSections) => {
          const updatedSections = [...prevSections];
          if (updatedSections[currentSectionIndex]) {
            updatedSections[currentSectionIndex].values = updatedSections[
              currentSectionIndex
            ].values.map((value) => {
              if (value.new || value.modified) {
                return { ...value, new: false, modified: false };
              }
              return value;
            });
          }
          return updatedSections;
        });
      }
    },
    onError: (error) => {
      toast({
        variant: "destructive",
        title: "Oops!",
        description: error.message,
      });
    },
  });

  const addValuesMutation = api.carbon.addValues.useMutation({
    onSuccess: (result) => {
      toast({
        title: "Success!",
        description: result.message || `${result.count} values updated successfully.`,
      });
      setEditableSections((prevSections) => {
        return prevSections.map((section) => ({
          ...section,
          values: section.values.map((value) => {
            if (value.new || value.modified) {
              return { ...value, new: false, modified: false };
            }
            return value;
          }),
        }));
      });
    },
    onError: (error) => {
      toast({
        variant: "destructive",
        title: "Batch Update Failed",
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
    lowerLimit = "0",
    upperLimit = "0",
  ): SectionValue {
    return {
      valueId: uuidv4(),
      carbonsectionId: sectionId,
      materialId: materialId,
      lowerLimit: lowerLimit,
      upperLimit: upperLimit,
      new: true, // Mark as new to not show validation errors initially
      modified: false, // Not modified yet since it's new
      name: defaultName || materialName,
      createdAt: new Date(), // Add current timestamp for sorting
    };
  }

  // Function to add a single new value to a section
  const addSingleValue = (sectionIndex: number) => {
    setEditableSections((prevSections) => {
      const updatedSections = [...prevSections];
      if (!updatedSections[sectionIndex]) return prevSections;

      const section = updatedSections[sectionIndex];
      const newValue = createNewValue(section.carbonsectionId);
      
      updatedSections[sectionIndex] = {
        ...section,
        values: [...section.values, newValue],
      };

      return updatedSections;
    });
  };

  // Function to open dialog for adding all materials with default values
  const openAddAllMaterialsDialog = (sectionIndex: number) => {
    setCurrentSectionIndex(sectionIndex);
    setIsAddingMaterials(true);
    defaultValueForm.reset({
      defaultName: "",
      defaultLowerLimit: "0",
      defaultUpperLimit: "0",
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
        section.carbonsectionId,
        material.materialId,
        material.materialName,
        valueName,
        data.defaultLowerLimit || "0",
        data.defaultUpperLimit || "0",
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

  // Function to update a value field
  const updateValue = (
    sectionIndex: number,
    valueIndex: number,
    field: keyof Pick<SectionValue, "name" | "materialId" | "lowerLimit" | "upperLimit">,
    newValue: string,
  ) => {
    setEditableSections((prevSections) => {
      const updatedSections = [...prevSections];
      if (updatedSections[sectionIndex]?.values?.[valueIndex]) {
        updatedSections[sectionIndex].values[valueIndex] = {
          ...updatedSections[sectionIndex].values[valueIndex],
          [field]: newValue,
          modified: true // Mark as modified when a field is updated
        };
      }
      return updatedSections;
    });
  };

  // Function to handle saving a single value
  const handleSave = (sectionIndex: number, valueIndex: number) => {
    const value = editableSections[sectionIndex]?.values[valueIndex];
    if (!value) return;

    // When a user tries to save, we mark the value as no longer new
    // so validation will apply from now on
    if (value.new) {
      setEditableSections((prevSections) => {
        const updatedSections = [...prevSections];
        if (updatedSections[sectionIndex]?.values?.[valueIndex]) {
          updatedSections[sectionIndex].values[valueIndex] = {
            ...updatedSections[sectionIndex].values[valueIndex],
            new: false
          };
        }
        return updatedSections;
      });
    }

    // Validate required fields
    if (!value.materialId || !value.name) {
      toast({
        variant: "destructive",
        title: "Validation Error",
        description: "Please fill in all required fields before saving.",
      });
      return;
    }

    // Format the value string for API
    const valueString = `${value.lowerLimit}-${value.upperLimit}`;

    // Set current section for onSuccess handler
    setCurrentSectionIndex(sectionIndex);

    // Only save this single value
    addSingleValueMutation.mutate({
      sectionId: value.carbonsectionId,
      materialId: value.materialId,
      valueId: value.valueId,
      value: valueString,
      valueName: value.name,
    });
  };

  // Function to save all values in a section
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
      value => !value.materialId || !value.name
    );
    
    if (invalidValues.length > 0) {
      toast({
        variant: "destructive",
        title: "Validation Error",
        description: "Please fill in all required fields before saving.",
      });
      return;
    }

    // Only save values that are new or modified
    const valuesToSave = valuesToUpdate.map((value) => ({
      sectionId: value.carbonsectionId,
      materialId: value.materialId,
      valueId: value.valueId,
      value: `${value.lowerLimit}-${value.upperLimit}`,
      valueName: value.name,
    }));

    toast({
      title: "Saving...",
      description: `Updating ${valuesToSave.length} modified values.`,
    });

    addValuesMutation.mutate({ values: valuesToSave });
  };

  // Function to delete a value
  const deleteValue = (
    sectionIndex: number,
    valueIndex: number,
    event: React.MouseEvent,
  ) => {
    event.stopPropagation();
    
    // Get the value to delete outside of the state update to avoid it being called twice
    const value = editableSections[sectionIndex]?.values?.[valueIndex];
    if (!value) return;
    
    // If the value is not new, delete it from the database
    if (!value.new) {
      deleteValueMutation.mutate({ valueId: value.valueId });
    }
    
    // Remove the value from the UI state
    setEditableSections((prevSections) => {
      const updatedSections = [...prevSections];
      if (updatedSections[sectionIndex]?.values) {
        updatedSections[sectionIndex].values = [
          ...updatedSections[sectionIndex].values.slice(0, valueIndex),
          ...updatedSections[sectionIndex].values.slice(valueIndex + 1),
        ];
      }
      return updatedSections;
    });
  };

  // Function to toggle section collapse/expand
  const toggleSection = (sectionIndex: number) => {
    setEditableSections((prevSections) => {
      const updatedSections = [...prevSections];
      if (updatedSections[sectionIndex]) {
        updatedSections[sectionIndex].isOpen = !updatedSections[sectionIndex].isOpen;
      }
      return updatedSections;
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
        <Card key={section.carbonsectionId} className="col-span-2 mb-6">
          <CardHeader 
            className="grid gap-2 sticky top-0 z-10 bg-white border-b" 
            style={{ position: "sticky", top: 0, zIndex: 10 }}
          >
            <div className="flex justify-between items-center">
              <CardTitle>{section.sectionType}</CardTitle>
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => toggleSection(sectionIndex)}
                className="ml-auto"
              >
                {section.isOpen ? (
                  <ChevronUp className="h-4 w-4" />
                ) : (
                  <ChevronDown className="h-4 w-4" />
                )}
              </Button>
            </div>
            <div className="flex gap-2">
              <Button
                variant="default"
                onClick={() => openAddAllMaterialsDialog(sectionIndex)}
                className="mt-2 w-fit"
              >
                <PlusCircle className="mr-2 h-4 w-4" /> Add All Materials
              </Button>
              <Button
                variant="outline"
                onClick={() => addSingleValue(sectionIndex)}
                className="mt-2 w-fit"
              >
                <PlusCircle className="mr-2 h-4 w-4" /> Add Single Value
              </Button>
              <Button
                variant="secondary"
                onClick={() => handleSaveAll(sectionIndex)}
                className="mt-2 w-fit"
                disabled={addValuesMutation.isPending || getModifiedCount(sectionIndex) === 0}
              >
                {addValuesMutation.isPending ? (
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
          </CardHeader>
          
          {section.isOpen && (
            <>
              <CardContent className="space-y-2">
                {section.values.length > 0 ? (
                  section.values.map((value, valueIndex) => (
                    <div
                      key={value.valueId}
                      className={`mb-2 flex items-center gap-2 rounded border ${
                        value.new || value.modified ? "bg-yellow-50" : "bg-gray-50"
                      } p-2`}
                    >
                      <div className="flex w-full items-center gap-2">
                        <Input
                          placeholder="Name"
                          value={value.name}
                          onChange={(e) => updateValue(
                            sectionIndex,
                            valueIndex,
                            "name",
                            e.target.value
                          )}
                          className="mr-1 flex-1"
                          aria-invalid={!value.name && !value.new ? "true" : "false"}
                        />
                        {!value.name && !value.new && (
                          <span className="text-red-500 text-xs absolute mt-14">
                            Name is required
                          </span>
                        )}

                        <div className="flex-1">
                          <Select
                            value={value.materialId}
                            onValueChange={(newValue) => updateValue(
                              sectionIndex,
                              valueIndex,
                              "materialId",
                              newValue
                            )}
                          >
                            <SelectTrigger className={!value.materialId && !value.new ? "border-red-500" : ""}>
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
                          {!value.materialId && !value.new && (
                            <span className="text-red-500 text-xs">
                              Material is required
                            </span>
                          )}
                        </div>

                        <div className="flex items-center">
                          <Input
                            placeholder="Lower"
                            value={value.lowerLimit}
                            onChange={(e) => updateValue(
                              sectionIndex,
                              valueIndex,
                              "lowerLimit",
                              e.target.value
                            )}
                            className="mr-1 w-20"
                          />
                          <span>-</span>
                          <Input
                            placeholder="Upper"
                            value={value.upperLimit}
                            onChange={(e) => updateValue(
                              sectionIndex,
                              valueIndex,
                              "upperLimit",
                              e.target.value
                            )}
                            className="ml-1 w-20"
                          />
                          <span className="ml-2">kgCo2</span>
                        </div>

                        <Button
                          type="button"
                          onClick={() => handleSave(sectionIndex, valueIndex)}
                          disabled={
                            addSingleValueMutation.isPending || 
                            (!value.name && !value.new) || 
                            (!value.materialId && !value.new) ||
                            (!value.new && !value.modified) // Disable if not new or modified
                          }
                          className={`ml-2 ${(value.new || value.modified) ? "bg-yellow-500 hover:bg-yellow-600" : ""}`}
                        >
                          {addSingleValueMutation.isPending ? (
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
                          onClick={(e) => deleteValue(sectionIndex, valueIndex, e)}
                          className="ml-2"
                          disabled={deleteValueMutation.isPending && !value.new}
                        >
                          {(deleteValueMutation.isPending && !value.new) ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                          ) : (
                            <Trash className="h-4 w-4" />
                          )}
                          Delete
                        </Button>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="py-4 text-center text-gray-500">
                    No values added yet. Add a single value or use &quot;Add All Materials&quot;.
                  </div>
                )}
              </CardContent>
              <CardFooter className="flex gap-2">
                <Button variant="destructive" size="sm">
                  <Trash className="mr-2 h-4 w-4" /> Delete Section
                </Button>
              </CardFooter>
            </>
          )}
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

              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={defaultValueForm.control}
                  name="defaultLowerLimit"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Default Lower Limit</FormLabel>
                      <FormControl>
                        <Input placeholder="0" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={defaultValueForm.control}
                  name="defaultUpperLimit"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Default Upper Limit</FormLabel>
                      <FormControl>
                        <Input placeholder="0" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

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