/*
  Warnings:

  - You are about to drop the column `sectionId` on the `CarbonValue` table. All the data in the column will be lost.
  - You are about to drop the `Section` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `carbonsectionId` to the `CarbonValue` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "CarbonValue" DROP CONSTRAINT "CarbonValue_sectionId_fkey";

-- DropForeignKey
ALTER TABLE "Section" DROP CONSTRAINT "Section_subcategoryId_fkey";

-- AlterTable
ALTER TABLE "CarbonValue" DROP COLUMN "sectionId",
ADD COLUMN     "carbonsectionId" TEXT NOT NULL;

-- DropTable
DROP TABLE "Section";

-- CreateTable
CREATE TABLE "CarbonSection" (
    "carbonsectionId" TEXT NOT NULL,
    "sectionType" "SectionType" NOT NULL DEFAULT 'None',
    "subcategoryId" TEXT NOT NULL,

    CONSTRAINT "CarbonSection_pkey" PRIMARY KEY ("carbonsectionId")
);

-- AddForeignKey
ALTER TABLE "CarbonSection" ADD CONSTRAINT "CarbonSection_subcategoryId_fkey" FOREIGN KEY ("subcategoryId") REFERENCES "SubCategory"("subcategoryId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CarbonValue" ADD CONSTRAINT "CarbonValue_carbonsectionId_fkey" FOREIGN KEY ("carbonsectionId") REFERENCES "CarbonSection"("carbonsectionId") ON DELETE CASCADE ON UPDATE CASCADE;
