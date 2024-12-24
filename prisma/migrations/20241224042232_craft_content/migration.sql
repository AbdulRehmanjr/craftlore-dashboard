-- CreateTable
CREATE TABLE "CraftContent" (
    "craftsubsectionId" TEXT NOT NULL,
    "content" TEXT NOT NULL DEFAULT 'none',
    "subsectionId" TEXT NOT NULL,

    CONSTRAINT "CraftContent_pkey" PRIMARY KEY ("craftsubsectionId")
);

-- AddForeignKey
ALTER TABLE "CraftContent" ADD CONSTRAINT "CraftContent_subsectionId_fkey" FOREIGN KEY ("subsectionId") REFERENCES "CraftSubSection"("craftsubsectionId") ON DELETE CASCADE ON UPDATE CASCADE;
