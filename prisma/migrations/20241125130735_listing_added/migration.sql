/*
  Warnings:

  - You are about to drop the column `rank` on the `LisitingCritera` table. All the data in the column will be lost.

*/
-- CreateEnum
CREATE TYPE "ListingRanks" AS ENUM ('None', 'Gold', 'Silver', 'Bronze');

-- AlterTable
ALTER TABLE "LisitingCritera" DROP COLUMN "rank",
ADD COLUMN     "listingRank" "ListingRanks" NOT NULL DEFAULT 'None';

-- DropEnum
DROP TYPE "Ranks";
