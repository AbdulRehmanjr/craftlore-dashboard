/*
  Warnings:

  - Added the required column `subcategoryId` to the `Material` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Material" ADD COLUMN     "subcategoryId" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "Material" ADD CONSTRAINT "Material_subcategoryId_fkey" FOREIGN KEY ("subcategoryId") REFERENCES "SubCategory"("subcategoryId") ON DELETE CASCADE ON UPDATE CASCADE;
