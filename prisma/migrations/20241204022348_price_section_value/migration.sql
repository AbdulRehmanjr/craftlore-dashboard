-- CreateEnum
CREATE TYPE "PriceSectionType" AS ENUM ('None', 'MaterialType', 'Quality', 'ProductionProcess', 'ProductCertifications', 'PlyType', 'TypeOfWeaving', 'DesignPatternTypes', 'DyeTypes', 'FinishingTechniques', 'ProductLineSize', 'ColorShades', 'Embellishments', 'Certifications', 'MaterialGrading', 'ProductTypesSizes', 'KnotPerInch', 'Dimensions', 'CarvingTechniques', 'ScaleOfCarving', 'FinishOptions', 'PatternTypes', 'FabricAndMaterial', 'RawMaterial', 'Processing', 'Packaging', 'Transportation', 'Crafting', 'Installation', 'Finishing', 'Preparation', 'CookingProcess', 'PaintingAndLacquering', 'Embroidery');

-- DropForeignKey
ALTER TABLE "PriceMaterial" DROP CONSTRAINT "PriceMaterial_pricesubcategoryId_fkey";

-- CreateTable
CREATE TABLE "PriceSection" (
    "priceSectionId" TEXT NOT NULL,
    "priceSectionType" "PriceSectionType" NOT NULL DEFAULT 'None',
    "priceSubCategoryId" TEXT NOT NULL,

    CONSTRAINT "PriceSection_pkey" PRIMARY KEY ("priceSectionId")
);

-- CreateTable
CREATE TABLE "PriceValue" (
    "valueId" TEXT NOT NULL,
    "name" TEXT NOT NULL DEFAULT 'none',
    "value" TEXT NOT NULL DEFAULT '0-0',
    "priceSectionId" TEXT NOT NULL,
    "materialId" TEXT NOT NULL,

    CONSTRAINT "PriceValue_pkey" PRIMARY KEY ("valueId")
);

-- AddForeignKey
ALTER TABLE "PriceMaterial" ADD CONSTRAINT "PriceMaterial_pricesubcategoryId_fkey" FOREIGN KEY ("pricesubcategoryId") REFERENCES "PriceSubCategory"("subcategoryId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PriceSection" ADD CONSTRAINT "PriceSection_priceSubCategoryId_fkey" FOREIGN KEY ("priceSubCategoryId") REFERENCES "PriceSubCategory"("subcategoryId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PriceValue" ADD CONSTRAINT "PriceValue_priceSectionId_fkey" FOREIGN KEY ("priceSectionId") REFERENCES "PriceSection"("priceSectionId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PriceValue" ADD CONSTRAINT "PriceValue_materialId_fkey" FOREIGN KEY ("materialId") REFERENCES "PriceMaterial"("materialId") ON DELETE CASCADE ON UPDATE CASCADE;
