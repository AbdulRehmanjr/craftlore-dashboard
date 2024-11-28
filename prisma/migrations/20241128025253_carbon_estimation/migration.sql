-- CreateEnum
CREATE TYPE "SectionType" AS ENUM ('None', 'RawMaterial', 'Processing', 'ProductionMethod', 'Packaging', 'Transportation', 'Crafting', 'Installation', 'Finishing', 'Preparation', 'CookingProcess', 'PaintingAndLacquering', 'Embroidery');

-- CreateTable
CREATE TABLE "Category" (
    "categoryId" TEXT NOT NULL,
    "categoryName" TEXT NOT NULL,

    CONSTRAINT "Category_pkey" PRIMARY KEY ("categoryId")
);

-- CreateTable
CREATE TABLE "SubCategory" (
    "subcategoryId" TEXT NOT NULL,
    "subcategoryName" TEXT NOT NULL DEFAULT 'none',
    "categoryId" TEXT NOT NULL,

    CONSTRAINT "SubCategory_pkey" PRIMARY KEY ("subcategoryId")
);

-- CreateTable
CREATE TABLE "Material" (
    "materialId" TEXT NOT NULL,
    "materialName" TEXT NOT NULL DEFAULT 'none',

    CONSTRAINT "Material_pkey" PRIMARY KEY ("materialId")
);

-- CreateTable
CREATE TABLE "Section" (
    "sectionId" TEXT NOT NULL,
    "sectionType" "SectionType" NOT NULL DEFAULT 'None',
    "subcategoryId" TEXT NOT NULL,

    CONSTRAINT "Section_pkey" PRIMARY KEY ("sectionId")
);

-- CreateTable
CREATE TABLE "Value" (
    "valueId" TEXT NOT NULL,
    "value" TEXT NOT NULL DEFAULT '0-0',
    "sectionId" TEXT NOT NULL,
    "materialId" TEXT NOT NULL,

    CONSTRAINT "Value_pkey" PRIMARY KEY ("valueId")
);

-- CreateIndex
CREATE UNIQUE INDEX "Category_categoryName_key" ON "Category"("categoryName");

-- AddForeignKey
ALTER TABLE "SubCategory" ADD CONSTRAINT "SubCategory_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "Category"("categoryId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Section" ADD CONSTRAINT "Section_subcategoryId_fkey" FOREIGN KEY ("subcategoryId") REFERENCES "SubCategory"("subcategoryId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Value" ADD CONSTRAINT "Value_sectionId_fkey" FOREIGN KEY ("sectionId") REFERENCES "Section"("sectionId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Value" ADD CONSTRAINT "Value_materialId_fkey" FOREIGN KEY ("materialId") REFERENCES "Material"("materialId") ON DELETE CASCADE ON UPDATE CASCADE;
