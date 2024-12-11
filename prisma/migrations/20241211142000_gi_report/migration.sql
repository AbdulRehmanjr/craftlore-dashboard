-- CreateTable
CREATE TABLE "GIReport" (
    "giId" TEXT NOT NULL,
    "fullName" TEXT NOT NULL DEFAULT 'none',
    "email" TEXT NOT NULL DEFAULT 'none',
    "report" TEXT NOT NULL DEFAULT 'none',
    "productCode" TEXT NOT NULL DEFAULT 'none',

    CONSTRAINT "GIReport_pkey" PRIMARY KEY ("giId")
);
