'use client'
import { api } from "~/trpc/react";
import {
  Card,
  CardFooter,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import { Button } from "~/components/ui/button";
import { Info } from "lucide-react";
import Link from "next/link";
import { CategoryDelete } from "~/components/forms/category/delete-category";


export const CategoryList =  ({link}:{link:string}) => {
  const [categories] =  api.category.getCategories.useSuspenseQuery();
  return (
    <>
      {categories.map((category) => (
        <Card key={category.categoryId} className="col-span-2">
          <CardHeader>
            <CardTitle>{category.categoryName}</CardTitle>
          </CardHeader>
          <CardFooter className="flex gap-2 w-full">
            <CategoryDelete categoryId={category.categoryId}/>
            <Button variant={"default"} asChild>
              <Link href={`${link}/category?categoryId=${category.categoryId}`}>
                <Info /> Detail
              </Link>
            </Button>
          </CardFooter>
        </Card>
      ))}
    </>
  );
};