


import { api } from "~/trpc/server";
import {
  Card,
  CardFooter,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import { Button } from "~/components/ui/button";
import { Info, Trash } from "lucide-react";
import Link from "next/link";

type ComponentProps = {
    categoryId:string
}

export const CarbonSubCategoryList = async ({categoryId}:ComponentProps) => {
  const subCategories: SubCategoryProps[] = await api.carbon.getSubByCatId({categoryId:categoryId});
  return (
    <>
      {subCategories.map((sub) => (
        <Card key={sub.subcategoryId} className="col-span-2">
          <CardHeader>
            <CardTitle>{sub.name}</CardTitle>
          </CardHeader>
          <CardFooter className="flex gap-2">
            <Button variant={"destructive"} size={"sm"}>
              <Trash />
            </Button>
            <Button variant={"default"} size={"sm"} asChild>
              <Link href={`/dashboard/carbon/subcategory?subId=${sub.subcategoryId}`}>
                <Info />
              </Link>
            </Button>
          </CardFooter>
        </Card>
      ))}
    </>
  );
};
