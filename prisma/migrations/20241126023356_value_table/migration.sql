/*
  Warnings:

  - You are about to drop the `ValueProp` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "ValueProp" DROP CONSTRAINT "ValueProp_sectionId_fkey";

-- DropTable
DROP TABLE "ValueProp";

-- CreateTable
CREATE TABLE "Value" (
    "valueId" TEXT NOT NULL,
    "name" TEXT NOT NULL DEFAULT 'none',
    "value" TEXT NOT NULL DEFAULT '0-0',
    "sectionId" TEXT NOT NULL,

    CONSTRAINT "Value_pkey" PRIMARY KEY ("valueId")
);

-- AddForeignKey
ALTER TABLE "Value" ADD CONSTRAINT "Value_sectionId_fkey" FOREIGN KEY ("sectionId") REFERENCES "Section"("sectionId") ON DELETE CASCADE ON UPDATE CASCADE;
