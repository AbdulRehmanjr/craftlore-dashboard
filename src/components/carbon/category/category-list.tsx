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

export const CarbonCategoryList = async () => {
  const categories: CategoryProps[] = await api.carbon.getCategories();
  return (
    <>
      {categories.map((category) => (
        <Card key={category.categoryId} className="col-span-2">
          <CardHeader>
            <CardTitle>{category.name}</CardTitle>
          </CardHeader>
          <CardFooter className="flex gap-2">
            <Button variant={"destructive"} size={"sm"}>
              <Trash />
            </Button>
            <Button variant={"default"} size={"sm"} asChild>
              <Link href={`/dashboard/carbon/category?categoryId=${category.categoryId}`}>
                <Info />
              </Link>
            </Button>
          </CardFooter>
        </Card>
      ))}
    </>
  );
};
