-- CreateTable
CREATE TABLE "PriceMaterial" (
    "materialId" TEXT NOT NULL,
    "materialName" TEXT NOT NULL DEFAULT 'none',
    "pricesubcategoryId" TEXT NOT NULL,

    CONSTRAINT "PriceMaterial_pkey" PRIMARY KEY ("materialId")
);

-- AddForeignKey
ALTER TABLE "PriceMaterial" ADD CONSTRAINT "PriceMaterial_pricesubcategoryId_fkey" FOREIGN KEY ("pricesubcategoryId") REFERENCES "PriceSubCategory"("subcategoryId") ON DELETE RESTRICT ON UPDATE CASCADE;
