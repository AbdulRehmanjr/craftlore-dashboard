/*
  Warnings:

  - You are about to drop the column `subcategoryId` on the `CarbonSection` table. All the data in the column will be lost.
  - You are about to drop the column `priceSectionType` on the `PriceSection` table. All the data in the column will be lost.
  - You are about to drop the column `priceSubCategoryId` on the `PriceSection` table. All the data in the column will be lost.
  - The `value` column on the `PriceValue` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - You are about to drop the `PriceCategory` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `PriceMaterial` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `PriceSubCategory` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `subCategoryId` to the `CarbonSection` table without a default value. This is not possible if the table is not empty.
  - Added the required column `subCategoryId` to the `PriceSection` table without a default value. This is not possible if the table is not empty.

*/
-- AlterEnum
-- This migration adds more than one value to an enum.
-- With PostgreSQL versions 11 and earlier, this is not possible
-- in a single migration. This can be worked around by creating
-- multiple migrations, each migration adding only one value to
-- the enum.


ALTER TYPE "SectionType" ADD VALUE 'MaterialType';
ALTER TYPE "SectionType" ADD VALUE 'ProductionProcess';
ALTER TYPE "SectionType" ADD VALUE 'ProductCertifications';
ALTER TYPE "SectionType" ADD VALUE 'PlyType';
ALTER TYPE "SectionType" ADD VALUE 'TypeOfWeaving';
ALTER TYPE "SectionType" ADD VALUE 'DesignPatternTypes';
ALTER TYPE "SectionType" ADD VALUE 'DyeTypes';
ALTER TYPE "SectionType" ADD VALUE 'FinishingTechniques';
ALTER TYPE "SectionType" ADD VALUE 'ProductLineSize';
ALTER TYPE "SectionType" ADD VALUE 'ColorShades';
ALTER TYPE "SectionType" ADD VALUE 'Embellishments';
ALTER TYPE "SectionType" ADD VALUE 'Certifications';
ALTER TYPE "SectionType" ADD VALUE 'MaterialGrading';
ALTER TYPE "SectionType" ADD VALUE 'ProductTypesSizes';
ALTER TYPE "SectionType" ADD VALUE 'KnotPerInch';
ALTER TYPE "SectionType" ADD VALUE 'Dimensions';
ALTER TYPE "SectionType" ADD VALUE 'CarvingTechniques';
ALTER TYPE "SectionType" ADD VALUE 'ScaleOfCarving';
ALTER TYPE "SectionType" ADD VALUE 'FinishOptions';
ALTER TYPE "SectionType" ADD VALUE 'PatternTypes';
ALTER TYPE "SectionType" ADD VALUE 'FabricAndMaterial';

-- DropForeignKey
ALTER TABLE "CarbonSection" DROP CONSTRAINT "CarbonSection_subcategoryId_fkey";

-- DropForeignKey
ALTER TABLE "PriceMaterial" DROP CONSTRAINT "PriceMaterial_pricesubcategoryId_fkey";

-- DropForeignKey
ALTER TABLE "PriceSection" DROP CONSTRAINT "PriceSection_priceSubCategoryId_fkey";

-- DropForeignKey
ALTER TABLE "PriceSubCategory" DROP CONSTRAINT "PriceSubCategory_pricecategoryId_fkey";

-- DropForeignKey
ALTER TABLE "PriceValue" DROP CONSTRAINT "PriceValue_materialId_fkey";

-- AlterTable
ALTER TABLE "CarbonSection" DROP COLUMN "subcategoryId",
ADD COLUMN     "subCategoryId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "PriceSection" DROP COLUMN "priceSectionType",
DROP COLUMN "priceSubCategoryId",
ADD COLUMN     "sectionType" "SectionType" NOT NULL DEFAULT 'None',
ADD COLUMN     "subCategoryId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "PriceValue" DROP COLUMN "value",
ADD COLUMN     "value" INTEGER NOT NULL DEFAULT 0;

-- DropTable
DROP TABLE "PriceCategory";

-- DropTable
DROP TABLE "PriceMaterial";

-- DropTable
DROP TABLE "PriceSubCategory";

-- DropEnum
DROP TYPE "PriceSectionType";

-- AddForeignKey
ALTER TABLE "CarbonSection" ADD CONSTRAINT "CarbonSection_subCategoryId_fkey" FOREIGN KEY ("subCategoryId") REFERENCES "SubCategory"("subcategoryId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PriceSection" ADD CONSTRAINT "PriceSection_subCategoryId_fkey" FOREIGN KEY ("subCategoryId") REFERENCES "SubCategory"("subcategoryId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PriceValue" ADD CONSTRAINT "PriceValue_materialId_fkey" FOREIGN KEY ("materialId") REFERENCES "Material"("materialId") ON DELETE CASCADE ON UPDATE CASCADE;
