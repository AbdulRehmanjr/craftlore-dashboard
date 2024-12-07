'use client'
import { api } from "~/trpc/react";
import {
  Card,
  CardFooter,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import { PriceMaterialDelete } from "~/components/cost/material/delete-material";

type ComponentProps ={
    subId:string
}

export const PriceMaterialList =  ({subId}:ComponentProps) => {

  const [materials] =  api.category.getAllMaterials.useSuspenseQuery({subId:subId});
  return (
    <div className="flex flex-wrap gap-2">
      {materials.map((material) => (
        <Card key={material.materialId} className="col-span-2">
          <CardHeader>
            <CardTitle>{material.materialName}</CardTitle>
          </CardHeader>
          <CardFooter className="flex gap-2 w-full">
            <PriceMaterialDelete materialId={material.materialId} subId={material.subcategoryId}/>
          </CardFooter>
        </Card>
      ))}
    </div>
  );
};
