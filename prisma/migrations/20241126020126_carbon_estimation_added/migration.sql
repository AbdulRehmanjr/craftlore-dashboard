-- CreateEnum
CREATE TYPE "SectionType" AS ENUM ('None', 'RawMaterial', 'Processing', 'ProductionMethod', 'Packaging', 'Transportation', 'Crafting', 'Installation', 'Finishing', 'Preparation', 'CookingProcess', 'PaintingAndLacquering', 'Embroidery');

-- CreateTable
CREATE TABLE "Category" (
    "categoryId" TEXT NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "Category_pkey" PRIMARY KEY ("categoryId")
);

-- CreateTable
CREATE TABLE "SubCategory" (
    "subcategoryId" TEXT NOT NULL,
    "name" TEXT NOT NULL DEFAULT 'none',
    "categoryId" TEXT NOT NULL,

    CONSTRAINT "SubCategory_pkey" PRIMARY KEY ("subcategoryId")
);

-- CreateTable
CREATE TABLE "Section" (
    "sectionId" TEXT NOT NULL,
    "name" TEXT NOT NULL DEFAULT 'none',
    "type" "SectionType" NOT NULL DEFAULT 'None',
    "subcategoryId" TEXT NOT NULL,

    CONSTRAINT "Section_pkey" PRIMARY KEY ("sectionId")
);

-- CreateTable
CREATE TABLE "ValueProp" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL DEFAULT 'none',
    "value" TEXT NOT NULL DEFAULT '0-0',
    "sectionId" TEXT NOT NULL,

    CONSTRAINT "ValueProp_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Category_name_key" ON "Category"("name");

-- AddForeignKey
ALTER TABLE "SubCategory" ADD CONSTRAINT "SubCategory_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "Category"("categoryId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Section" ADD CONSTRAINT "Section_subcategoryId_fkey" FOREIGN KEY ("subcategoryId") REFERENCES "SubCategory"("subcategoryId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ValueProp" ADD CONSTRAINT "ValueProp_sectionId_fkey" FOREIGN KEY ("sectionId") REFERENCES "Section"("sectionId") ON DELETE CASCADE ON UPDATE CASCADE;
