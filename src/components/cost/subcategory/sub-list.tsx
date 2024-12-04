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
import { PriceSubCategoryDelete } from "~/components/cost/subcategory/delete-sub";

type ComponentProps = {
    categoryId:string
}

export const PriceSubCategoryList = ({categoryId}:ComponentProps) => {
  const [subCategories] =  api.price.getSubByCatId.useSuspenseQuery({categoryId:categoryId});
  return (
    <>
      {subCategories.map((sub) => (
        <Card key={sub.subcategoryId} className="col-span-2">
          <CardHeader>
            <CardTitle>{sub.subcategoryName}</CardTitle>
          </CardHeader>
          <CardFooter className="flex gap-2">
            <PriceSubCategoryDelete categoryId={categoryId} subcategoryId={sub.subcategoryId}/>
            <Button variant={"default"}  asChild>
              <Link href={`/dashboard/price/subcategory?subId=${sub.subcategoryId}`}>
                <Info /> Detail
              </Link>
            </Button>
          </CardFooter>
        </Card>
      ))}
    </>
  );
};
