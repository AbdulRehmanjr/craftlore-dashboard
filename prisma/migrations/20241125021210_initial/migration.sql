-- CreateEnum
CREATE TYPE "Role" AS ENUM ('ADMIN', 'SUPERADMIN');

-- CreateEnum
CREATE TYPE "Ranks" AS ENUM ('None', 'Gold', 'Silver', 'Bronze');

-- CreateEnum
CREATE TYPE "InstitutionType" AS ENUM ('None', 'Governance', 'NGO', 'Training_Body', 'Educational_Body');

-- CreateEnum
CREATE TYPE "BusinessLevel" AS ENUM ('None', 'Large_Enterprice', 'Mid_sized_Business', 'Small_Business', 'Startup');

-- CreateEnum
CREATE TYPE "SkillLevel" AS ENUM ('None', 'Expert', 'Advanced', 'Beginner');

-- CreateEnum
CREATE TYPE "RegisterType" AS ENUM ('None', 'Artisan', 'Business', 'Institution', 'BuyerMembership', 'CorpoMembership', 'SponsorMembership');

-- CreateEnum
CREATE TYPE "MarketType" AS ENUM ('None', 'Local', 'National', 'International');

-- CreateEnum
CREATE TYPE "Status" AS ENUM ('Pending', 'Actice');

-- CreateTable
CREATE TABLE "Account" (
    "accountId" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "role" "Role" NOT NULL DEFAULT 'ADMIN',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "udpatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Account_pkey" PRIMARY KEY ("accountId")
);

-- CreateTable
CREATE TABLE "AppliedJob" (
    "jobId" TEXT NOT NULL,
    "fullName" TEXT NOT NULL DEFAULT 'none',
    "email" TEXT NOT NULL DEFAULT 'none',
    "job" TEXT NOT NULL DEFAULT 'none',
    "jobCode" TEXT NOT NULL DEFAULT 'none',
    "resume" TEXT NOT NULL DEFAULT 'none',
    "coverLetter" TEXT NOT NULL DEFAULT 'none',

    CONSTRAINT "AppliedJob_pkey" PRIMARY KEY ("jobId")
);

-- CreateTable
CREATE TABLE "Employ" (
    "employId" TEXT NOT NULL,
    "fullName" TEXT NOT NULL DEFAULT 'none',
    "skills" TEXT NOT NULL DEFAULT 'none',
    "contribution" TEXT NOT NULL DEFAULT 'none',

    CONSTRAINT "Employ_pkey" PRIMARY KEY ("employId")
);

-- CreateTable
CREATE TABLE "User" (
    "userId" TEXT NOT NULL,
    "fullName" TEXT NOT NULL DEFAULT 'none',
    "phone" TEXT NOT NULL DEFAULT 'none',
    "email" TEXT NOT NULL,
    "address" TEXT NOT NULL DEFAULT 'none',
    "password" TEXT NOT NULL DEFAULT 'none',
    "registerType" "RegisterType" NOT NULL DEFAULT 'None',
    "status" "Status" NOT NULL DEFAULT 'Pending',

    CONSTRAINT "User_pkey" PRIMARY KEY ("userId")
);

-- CreateTable
CREATE TABLE "Artisan" (
    "artisanId" TEXT NOT NULL,
    "craftSpecialty" TEXT NOT NULL DEFAULT 'none',
    "craftSkill" "SkillLevel" NOT NULL DEFAULT 'None',
    "craftExperience" INTEGER NOT NULL DEFAULT 0,
    "craftAward" TEXT NOT NULL DEFAULT 'none',
    "market" "MarketType" NOT NULL DEFAULT 'None',
    "documents" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "status" TEXT NOT NULL DEFAULT 'active',
    "userId" TEXT NOT NULL,
    "listingCriteria" TEXT NOT NULL,

    CONSTRAINT "Artisan_pkey" PRIMARY KEY ("artisanId")
);

-- CreateTable
CREATE TABLE "Business" (
    "businessId" TEXT NOT NULL,
    "businessName" TEXT NOT NULL DEFAULT 'none',
    "businessEmail" TEXT NOT NULL,
    "businessAddress" TEXT NOT NULL DEFAULT 'none',
    "businessType" "BusinessLevel" NOT NULL DEFAULT 'None',
    "businessSold" TEXT NOT NULL DEFAULT 'none',
    "businessEmployee" INTEGER NOT NULL DEFAULT 0,
    "documents" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "status" TEXT NOT NULL DEFAULT 'active',
    "listingCriteria" TEXT NOT NULL,
    "userId" TEXT NOT NULL,

    CONSTRAINT "Business_pkey" PRIMARY KEY ("businessId")
);

-- CreateTable
CREATE TABLE "Institute" (
    "instituteId" TEXT NOT NULL,
    "instituteName" TEXT NOT NULL DEFAULT 'none',
    "instituteEmail" TEXT NOT NULL,
    "instituteType" "InstitutionType" NOT NULL DEFAULT 'None',
    "instituteAddress" TEXT NOT NULL DEFAULT 'none',
    "instituteMission" TEXT NOT NULL DEFAULT 'none',
    "instituteRep" TEXT NOT NULL DEFAULT 'none',
    "repDes" TEXT NOT NULL DEFAULT 'none',
    "documents" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "status" TEXT NOT NULL DEFAULT 'active',
    "listingCriteria" TEXT NOT NULL,
    "userId" TEXT NOT NULL,

    CONSTRAINT "Institute_pkey" PRIMARY KEY ("instituteId")
);

-- CreateTable
CREATE TABLE "BuyerMembership" (
    "buyerMemberId" TEXT NOT NULL,
    "buyerType" TEXT NOT NULL DEFAULT 'none',
    "businessName" TEXT NOT NULL DEFAULT 'none',
    "businessType" TEXT NOT NULL DEFAULT 'none',
    "taxId" TEXT NOT NULL DEFAULT 'none',
    "country" TEXT NOT NULL DEFAULT 'none',
    "website" TEXT NOT NULL DEFAULT 'none',
    "productInterest" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "orderVolume" TEXT NOT NULL DEFAULT 'none',
    "authentication" TEXT NOT NULL DEFAULT 'none',
    "traceability" TEXT NOT NULL DEFAULT 'none',
    "sustainability" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "source" TEXT NOT NULL DEFAULT 'none',
    "newsletter" BOOLEAN NOT NULL DEFAULT false,
    "specialRequirements" TEXT NOT NULL DEFAULT 'none',
    "terms" BOOLEAN NOT NULL DEFAULT false,
    "userId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "BuyerMembership_pkey" PRIMARY KEY ("buyerMemberId")
);

-- CreateTable
CREATE TABLE "CorpoMembership" (
    "corpoMemberId" TEXT NOT NULL,
    "institutionName" TEXT NOT NULL DEFAULT 'none',
    "institutionType" TEXT NOT NULL DEFAULT 'none',
    "industry" TEXT NOT NULL DEFAULT 'none',
    "yearEstablished" INTEGER NOT NULL DEFAULT 0,
    "taxId" TEXT NOT NULL DEFAULT 'none',
    "primaryContact" TEXT NOT NULL DEFAULT 'none',
    "contactEmail" TEXT NOT NULL DEFAULT 'none',
    "contactPhone" TEXT NOT NULL DEFAULT 'none',
    "website" TEXT NOT NULL DEFAULT 'none',
    "headquartersAddress" TEXT NOT NULL DEFAULT 'none',
    "additionalLocations" TEXT NOT NULL DEFAULT 'none',
    "partnershipType" TEXT NOT NULL DEFAULT 'none',
    "partnershipGoals" TEXT NOT NULL DEFAULT 'none',
    "targetProducts" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "csrInterest" TEXT NOT NULL DEFAULT 'No',
    "csrInitiatives" TEXT NOT NULL DEFAULT 'none',
    "sustainabilityPractices" TEXT NOT NULL DEFAULT 'none',
    "businessLicense" TEXT NOT NULL DEFAULT 'none',
    "proofOfTaxID" TEXT NOT NULL DEFAULT 'none',
    "references" TEXT NOT NULL DEFAULT 'none',
    "engagementChannels" TEXT NOT NULL DEFAULT 'none',
    "customerDemographic" TEXT NOT NULL DEFAULT 'none',
    "brandMission" TEXT NOT NULL DEFAULT 'none',
    "specificRequirements" TEXT NOT NULL DEFAULT 'none',
    "challenges" TEXT NOT NULL DEFAULT 'none',
    "additionalComments" TEXT NOT NULL DEFAULT 'none',
    "terms" BOOLEAN NOT NULL DEFAULT false,
    "userId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CorpoMembership_pkey" PRIMARY KEY ("corpoMemberId")
);

-- CreateTable
CREATE TABLE "SponsorMembership" (
    "sponsorshipId" TEXT NOT NULL,
    "sponsorName" TEXT NOT NULL DEFAULT 'none',
    "contactPerson" TEXT NOT NULL DEFAULT 'none',
    "email" TEXT NOT NULL,
    "phone" TEXT NOT NULL DEFAULT 'none',
    "socialLinks" TEXT NOT NULL DEFAULT 'none',
    "sponsorType" TEXT NOT NULL DEFAULT 'none',
    "industry" TEXT NOT NULL DEFAULT 'none',
    "sponsorshipGoal" TEXT NOT NULL DEFAULT 'none',
    "objectives" TEXT NOT NULL DEFAULT 'none',
    "focusArea" TEXT NOT NULL DEFAULT 'none',
    "tier" TEXT NOT NULL DEFAULT 'none',
    "budgetRange" TEXT NOT NULL DEFAULT 'none',
    "sponsorshipChannel" TEXT NOT NULL DEFAULT 'none',
    "eventInterest" TEXT NOT NULL DEFAULT 'No',
    "productCustomization" TEXT NOT NULL DEFAULT 'none',
    "csrInterest" TEXT NOT NULL DEFAULT 'No',
    "pastCSREfforts" TEXT NOT NULL DEFAULT 'none',
    "sustainabilityPractices" TEXT NOT NULL DEFAULT 'none',
    "brandingOptions" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "socialHandles" TEXT NOT NULL DEFAULT 'none',
    "communicationChannel" TEXT NOT NULL DEFAULT 'none',
    "impactMetrics" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "reportFrequency" TEXT NOT NULL DEFAULT 'none',
    "publicUse" TEXT NOT NULL DEFAULT 'No',
    "specialRequirements" TEXT NOT NULL DEFAULT 'none',
    "additionalComments" TEXT NOT NULL DEFAULT 'none',
    "terms" BOOLEAN NOT NULL DEFAULT false,
    "userId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SponsorMembership_pkey" PRIMARY KEY ("sponsorshipId")
);

-- CreateTable
CREATE TABLE "LisitingCritera" (
    "criteraId" TEXT NOT NULL,
    "sourceOfMaterial" TEXT NOT NULL DEFAULT 'none',
    "craftingProcess" TEXT NOT NULL DEFAULT 'none',
    "sustainablePractices" BOOLEAN NOT NULL DEFAULT false,
    "sustainabledescription" TEXT NOT NULL DEFAULT 'none',
    "fairWage" BOOLEAN NOT NULL DEFAULT false,
    "genderSuport" BOOLEAN NOT NULL DEFAULT false,
    "womenPercentage" INTEGER NOT NULL DEFAULT 0,
    "workplaceuphold" BOOLEAN NOT NULL DEFAULT false,
    "workplaceDescription" TEXT NOT NULL DEFAULT 'none',
    "childLabour" BOOLEAN NOT NULL DEFAULT false,
    "fairTrade" BOOLEAN NOT NULL DEFAULT false,
    "fairtradeDoc" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "giHold" BOOLEAN NOT NULL DEFAULT false,
    "giNumber" TEXT NOT NULL DEFAULT 'none',
    "giDoc" TEXT NOT NULL DEFAULT 'none',
    "blockChain" BOOLEAN NOT NULL DEFAULT false,
    "blockChainDoc" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "ethics" BOOLEAN NOT NULL DEFAULT false,
    "qualityReview" BOOLEAN NOT NULL DEFAULT false,
    "profilePermission" BOOLEAN NOT NULL DEFAULT false,
    "complianceAcknowledgement" BOOLEAN NOT NULL DEFAULT false,
    "rank" "Ranks" NOT NULL DEFAULT 'None',

    CONSTRAINT "LisitingCritera_pkey" PRIMARY KEY ("criteraId")
);

-- CreateIndex
CREATE INDEX "Account_email_idx" ON "Account"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Account_email_key" ON "Account"("email");

-- CreateIndex
CREATE INDEX "User_email_idx" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE INDEX "Business_businessEmail_idx" ON "Business"("businessEmail");

-- CreateIndex
CREATE UNIQUE INDEX "Business_businessEmail_key" ON "Business"("businessEmail");

-- CreateIndex
CREATE INDEX "Institute_instituteEmail_idx" ON "Institute"("instituteEmail");

-- CreateIndex
CREATE UNIQUE INDEX "Institute_instituteEmail_key" ON "Institute"("instituteEmail");

-- CreateIndex
CREATE UNIQUE INDEX "SponsorMembership_email_key" ON "SponsorMembership"("email");

-- AddForeignKey
ALTER TABLE "Artisan" ADD CONSTRAINT "Artisan_listingCriteria_fkey" FOREIGN KEY ("listingCriteria") REFERENCES "LisitingCritera"("criteraId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Artisan" ADD CONSTRAINT "Artisan_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("userId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Business" ADD CONSTRAINT "Business_listingCriteria_fkey" FOREIGN KEY ("listingCriteria") REFERENCES "LisitingCritera"("criteraId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Business" ADD CONSTRAINT "Business_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("userId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Institute" ADD CONSTRAINT "Institute_listingCriteria_fkey" FOREIGN KEY ("listingCriteria") REFERENCES "LisitingCritera"("criteraId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Institute" ADD CONSTRAINT "Institute_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("userId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BuyerMembership" ADD CONSTRAINT "BuyerMembership_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("userId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CorpoMembership" ADD CONSTRAINT "CorpoMembership_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("userId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SponsorMembership" ADD CONSTRAINT "SponsorMembership_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("userId") ON DELETE CASCADE ON UPDATE CASCADE;
