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
import { SubCategoryDelete } from "~/components/forms/subcategory/delete-sub";

type ComponentProps = {
    categoryId:string
    link : string
}

export const SubCategoryList = ({categoryId,link}:ComponentProps) => {
  const [subCategories] =  api.category.getSubByCatId.useSuspenseQuery({categoryId:categoryId});
  return (
    <>
      {subCategories.map((sub) => (
        <Card key={sub.subcategoryId} className="col-span-2">
          <CardHeader>
            <CardTitle>{sub.subcategoryName}</CardTitle>
          </CardHeader>
          <CardFooter className="flex gap-2">
            <SubCategoryDelete categoryId={categoryId} subcategoryId={sub.subcategoryId}/>
            <Button variant={"default"}  asChild>
              <Link href={`${link}/subcategory?subId=${sub.subcategoryId}`}>
                <Info /> Detail
              </Link>
            </Button>
          </CardFooter>
        </Card>
      ))}
    </>
  );
};