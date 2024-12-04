"use client";

import { RefreshCcw } from "lucide-react";
import { Button } from "~/components/ui/button";
import { useToast } from "~/hooks/use-toast";
import { api } from "~/trpc/react";

export const SeedButton = () => {
  const { toast } = useToast();

  const createCategory = api.seed.createPriceSubCategories.useMutation({
    onSuccess: async () => {
      toast({
        title: "Success!",
        description: "Added successfully.",
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

  const clicked = () => {
    createCategory.mutate({
      subcategories: [
        {
          subCategoryName: "Pashmina",
          categoryId: "cm47ws9ec0000j58m4dlcc2y8",
        },
        {
          subCategoryName: "Kani Craft",
          categoryId: "cm47ws9ec0000j58m4dlcc2y8",
        },
        {
          subCategoryName: "Cashmere",
          categoryId: "cm47ws9ec0000j58m4dlcc2y8",
        },
        { subCategoryName: "Silk", categoryId: "cm47ws9ec0000j58m4dlcc2y8" },
        {
          subCategoryName: "Kashmiri Bags and Purses",
          categoryId: "cm47ws9ec0000j58m4dlcc2y8",
        },
        {
          subCategoryName: "Kashmiri Jackets",
          categoryId: "cm47ws9ec0000j58m4dlcc2y8",
        },
        {
          subCategoryName: "Kashmiri Kaftans",
          categoryId: "cm47ws9ec0000j58m4dlcc2y8",
        },
        {
          subCategoryName: "Kashmiri Kurtas",
          categoryId: "cm47ws9ec0000j58m4dlcc2y8",
        },
        {
          subCategoryName: "Kashmiri Pherans",
          categoryId: "cm47ws9ec0000j58m4dlcc2y8",
        },
        {
          subCategoryName: "Kashmiri Jewelry",
          categoryId: "cm47ws9ec0000j58m4dlcc2y8",
        },

        {
          subCategoryName: "Papier-Mâché",
          categoryId: "cm47wsa400001j58mg0ktcqcu",
        },
        {
          subCategoryName: "Bed Linens",
          categoryId: "cm47wsa400001j58mg0ktcqcu",
        },
        {
          subCategoryName: "Sofa and Cushion Covers",
          categoryId: "cm47wsa400001j58mg0ktcqcu",
        },
        {
          subCategoryName: "Room Divider Screens",
          categoryId: "cm47wsa400001j58mg0ktcqcu",
        },
        {
          subCategoryName: "Office Accessories",
          categoryId: "cm47wsa400001j58mg0ktcqcu",
        },
        {
          subCategoryName: "Jeweled Wall Hangings",
          categoryId: "cm47wsa400001j58mg0ktcqcu",
        },
        {
          subCategoryName: "Tapestry",
          categoryId: "cm47wsa400001j58mg0ktcqcu",
        },
        {
          subCategoryName: "Copperware",
          categoryId: "cm47wsacs0002j58mt8rlizdy",
        },
        {
          subCategoryName: "Silverware",
          categoryId: "cm47wsacs0002j58mt8rlizdy",
        },
        {
          subCategoryName: "Walnutware",
          categoryId: "cm47wsacs0002j58mt8rlizdy",
        },
        {
          subCategoryName: "Papermachieware",
          categoryId: "cm47wsacs0002j58mt8rlizdy",
        },
        {
          subCategoryName: "Enamelware",
          categoryId: "cm47wsacs0002j58mt8rlizdy",
        },
        {
          subCategoryName: "Bedroom Rugs",
          categoryId: "cm47wsazj0003j58muus28on9",
        },
        {
          subCategoryName: "Living Room Rugs",
          categoryId: "cm47wsazj0003j58muus28on9",
        },
        {
          subCategoryName: "Dining Room Rugs",
          categoryId: "cm47wsazj0003j58muus28on9",
        },
        {
          subCategoryName: "Kitchen Rugs",
          categoryId: "cm47wsazj0003j58muus28on9",
        },
        {
          subCategoryName: "Home Library Rugs",
          categoryId: "cm47wsazj0003j58muus28on9",
        },
        {
          subCategoryName: "Passageway & Stair Rugs",
          categoryId: "cm47wsazj0003j58muus28on9",
        },
        {
          subCategoryName: "Grand Foyer Rugs",
          categoryId: "cm47wsazj0003j58muus28on9",
        },
        {
          subCategoryName: "Parlor Room Rugs",
          categoryId: "cm47wsazj0003j58muus28on9",
        },
        {
          subCategoryName: "Cigar Room Rugs",
          categoryId: "cm47wsazj0003j58muus28on9",
        },
        {
          subCategoryName: "Namda Embroidery Rugs",
          categoryId: "cm47wsazj0003j58muus28on9",
        },
        {
          subCategoryName: "Walnut Wood Carving Furniture",
          categoryId: "cm47wsbgo0004j58mmfv1lx7k",
        },
        {
          subCategoryName: "Crewel Furniture",
          categoryId: "cm47wsbgo0004j58mmfv1lx7k",
        },
        {
          subCategoryName: "Wicker Furniture",
          categoryId: "cm47wsbgo0004j58mmfv1lx7k",
        },
        {
          subCategoryName: "Room Dividers",
          categoryId: "cm47wsbgo0004j58mmfv1lx7k",
        },

        {
          subCategoryName: "Khatamband",
          categoryId: "cm47wsbve0005j58mq3izwm12",
        },

        {
          subCategoryName: "Pinjrakari (Kashmir Lattice Work)",
          categoryId: "cm47wschr0006j58m3e5jiqst",
        },
        {
          subCategoryName: "Crewel Embroidery Curtains",
          categoryId: "cm47wschr0006j58m3e5jiqst",
        },
      ],
    });
  };

  return (
    <Button
      type="button"
      className="w-full max-w-md"
      disabled={createCategory.isPending}
      onClick={() => clicked()}
    >
      {createCategory.isPending ? (
        <>
          <RefreshCcw className="mr-2 h-4 w-4 animate-spin" />
          Please wait...
        </>
      ) : (
        "Create seed"
      )}
    </Button>
  );
};
