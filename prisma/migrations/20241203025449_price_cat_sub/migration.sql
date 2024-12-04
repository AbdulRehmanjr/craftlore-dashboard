-- CreateTable
CREATE TABLE "PriceCategory" (
    "categoryId" TEXT NOT NULL,
    "categoryName" TEXT NOT NULL,

    CONSTRAINT "PriceCategory_pkey" PRIMARY KEY ("categoryId")
);

-- CreateTable
CREATE TABLE "PriceSubCategory" (
    "subcategoryId" TEXT NOT NULL,
    "subcategoryName" TEXT NOT NULL DEFAULT 'none',
    "pricecategoryId" TEXT NOT NULL,

    CONSTRAINT "PriceSubCategory_pkey" PRIMARY KEY ("subcategoryId")
);

-- CreateIndex
CREATE UNIQUE INDEX "PriceCategory_categoryName_key" ON "PriceCategory"("categoryName");

-- AddForeignKey
ALTER TABLE "PriceSubCategory" ADD CONSTRAINT "PriceSubCategory_pricecategoryId_fkey" FOREIGN KEY ("pricecategoryId") REFERENCES "PriceCategory"("categoryId") ON DELETE CASCADE ON UPDATE CASCADE;
