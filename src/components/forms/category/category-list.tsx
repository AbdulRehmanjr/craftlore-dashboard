"use client";
import { api } from "~/trpc/react";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "~/components/ui/card";
import { Button } from "~/components/ui/button";
import { Info } from "lucide-react";
import Link from "next/link";
import { CategoryDelete } from "~/components/forms/category/delete-category";
import { EditCategoryForm } from "~/components/forms/category/edit-category";

export const CategoryList = ({ link }: { link: string }) => {
  const [categories] = api.category.getCategories.useSuspenseQuery();
  return (
    <div className="col-span-12 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
      {categories.map((category) => (
        <Card
          key={category.categoryId}
          className="group transition-shadow duration-200 hover:shadow-md"
        >
          <CardHeader className="pb-3">
            <CardTitle className="truncate text-lg font-semibold font-heading">
              {category.rank}. {category.categoryName}
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
              <Link href={`${link}/category?categoryId=${category.categoryId}`}>
                <Info className="mr-2 h-4 w-4" />
                Details
              </Link>
            </Button>
            <div className="flex gap-2">
              <EditCategoryForm
                categoryId={category.categoryId}
                initialCategoryName={category.categoryName}
                rank={category.rank}
              />
              <CategoryDelete categoryId={category.categoryId} />
            </div>
          </CardFooter>
        </Card>
      ))}
    </div>
  );
};
