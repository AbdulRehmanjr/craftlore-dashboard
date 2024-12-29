"use client";

import { api } from "~/trpc/react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import { Button } from "~/components/ui/button";
import { Info } from "lucide-react";
import Link from "next/link";
import { SubCategoryDelete } from "~/components/forms/subcategory/delete-sub";
import { EditSubCategoryForm } from "~/components/forms/subcategory/edit-sub";

type ComponentProps = {
  categoryId: string;
  link: string;
};

export const SubCategoryList = ({ categoryId, link }: ComponentProps) => {
  const [subCategories] = api.category.getSubByCatId.useSuspenseQuery({
    categoryId: categoryId,
  });
  return (
    <div className="col-span-12 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
      {subCategories.map((sub) => (
        <Card
          key={sub.subcategoryId}
          className="group transition-shadow duration-200 hover:shadow-md"
        >
          <CardHeader className="pb-3">
            <CardTitle className="truncate text-lg font-semibold">
              {sub.subcategoryName}
            </CardTitle>
          </CardHeader>
          <CardContent className="pb-2">
            <div className="h-1 w-full overflow-hidden rounded-full bg-primary/10">
              <div
                className="h-full rounded-full bg-primary"
                style={{ width: "45%" }}
              />
            </div>
          </CardContent>
          <CardFooter className="flex justify-between gap-2 pt-3">
            <Button variant="default" size="sm" className="flex-1" asChild>
              <Link href={`${link}/subcategory?subId=${sub.subcategoryId}`}>
                <Info className="mr-2 h-4 w-4" />
                Details
              </Link>
            </Button>
            <div className="flex gap-2">
              <EditSubCategoryForm
                subcategoryId={sub.subcategoryId}
                subcategoryName={sub.subcategoryName}
              />
              <SubCategoryDelete
                categoryId={categoryId}
                subcategoryId={sub.subcategoryId}
              />
            </div>
          </CardFooter>
        </Card>
      ))}
    </div>
  );
};
