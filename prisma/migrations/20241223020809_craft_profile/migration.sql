-- CreateTable
CREATE TABLE "CraftSection" (
    "craftsectionId" TEXT NOT NULL,
    "sectionName" TEXT NOT NULL DEFAULT 'none',
    "subCategoryId" TEXT NOT NULL,

    CONSTRAINT "CraftSection_pkey" PRIMARY KEY ("craftsectionId")
);

-- CreateTable
CREATE TABLE "CraftSubSection" (
    "craftsubsectionId" TEXT NOT NULL,
    "sectionName" TEXT NOT NULL DEFAULT 'none',
    "sectionId" TEXT NOT NULL,

    CONSTRAINT "CraftSubSection_pkey" PRIMARY KEY ("craftsubsectionId")
);

-- AddForeignKey
ALTER TABLE "CraftSection" ADD CONSTRAINT "CraftSection_subCategoryId_fkey" FOREIGN KEY ("subCategoryId") REFERENCES "SubCategory"("subcategoryId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CraftSubSection" ADD CONSTRAINT "CraftSubSection_sectionId_fkey" FOREIGN KEY ("sectionId") REFERENCES "CraftSection"("craftsectionId") ON DELETE CASCADE ON UPDATE CASCADE;
