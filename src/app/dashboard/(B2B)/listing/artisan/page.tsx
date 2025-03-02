import Image from "next/image";
import Link from "next/link";
import { api } from "~/trpc/server";

import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbSeparator,
  BreadcrumbPage,
} from "~/components/ui/breadcrumb";
import { Badge } from "~/components/ui/badge";
import { Button } from "~/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs";
import {
  ChevronLeft,
  Tag,
  Phone,
  Mail,
  MapPin,
  FileText,
  User,
  ShieldCheck,
} from "lucide-react";

type PageProps = {
  searchParams: Promise<{ artisanId: string }>;
};

export default async function ArtisanDetailPage({ searchParams }: PageProps) {
  const searchProps = await searchParams;
  // Fetch artisan data using TRPC
  const artisanData = await api.listing.getArtisanDetail({
    artisanId: searchProps.artisanId,
  });

  if (!artisanData) {
    return (
      <div className="flex h-96 w-full flex-col items-center justify-center">
        <h2 className="text-2xl font-semibold">Artisan Not Found</h2>
        <p className="text-muted-foreground">
          The artisan you&apos;re looking for doesn&apos;t exist or has been
          removed.
        </p>
        <Button asChild className="mt-4">
          <Link href="/dashboard/listing">
            <ChevronLeft className="mr-2 h-4 w-4" />
            Back to Listings
          </Link>
        </Button>
      </div>
    );
  }

  const getSkillBadgeColor = (skill: string) => {
    switch (skill) {
      case "Expert":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300";
      case "Advanced":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300";
      case "Beginner":
        return "bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-300";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300";
    }
  };

  const getMarketBadgeColor = (market: string) => {
    switch (market) {
      case "International":
        return "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300";
      case "National":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300";
      case "Local":
        return "bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-300";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300";
    }
  };

  const getLevelIndicator = () => {
    const listingRank = artisanData.criteria.listingRank;

    switch (listingRank) {
      case "Gold":
        return { color: "bg-amber-500", label: "Gold level artisan" };
      case "Silver":
        return { color: "bg-gray-400", label: "Silver level artisan" };
      case "Bronze":
        return { color: "bg-amber-700", label: "Bronze level artisan" };
      default:
        return { color: "bg-slate-300", label: "Standard artisan" };
    }
  };

  const levelInfo = getLevelIndicator();

  return (
    <>
      {/* Header with Breadcrumb and Action Button */}
      <div className="my-2 flex flex-col justify-between gap-4 md:flex-row md:items-center">
        <Breadcrumb>
          <BreadcrumbList className="text-primary">
            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                <Link href="/dashboard">Dashboard</Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                <Link href="/dashboard/listing">Listing</Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>Artisan Details</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        <Button variant="outline" size="sm" asChild>
          <Link href="/dashboard/listing">
            <ChevronLeft className="mr-1 h-4 w-4" />
            Back to Listings
          </Link>
        </Button>
      </div>

      {/* Artisan Profile Section */}
      <Card className="mb-6">
        <CardHeader className="border-b pb-3 pt-6">
          <CardTitle className="text-xl font-medium">
            Artisan Information
          </CardTitle>
          <CardDescription>
            Details about the artisan and their qualifications
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="flex flex-col gap-8 lg:flex-row">
            {/* Left Column - Profile Summary */}
            <div className="flex flex-col items-center lg:w-1/4">
              <div className="relative">
                <Badge
                  className={`${levelInfo.color} absolute -right-2 -top-2 text-white`}
                >
                  {levelInfo.label}
                </Badge>
                <div className="flex h-48 w-48 items-center justify-center rounded-full bg-muted">
                  <span className="text-5xl font-bold text-muted-foreground">
                    {artisanData.user.fullName.charAt(0)}
                  </span>
                </div>
              </div>
              <h2 className="mt-4 text-center text-2xl font-semibold">
                {artisanData.user.fullName}
              </h2>

              <Badge variant="outline" className="mt-1 text-sm font-normal">
                Status: {artisanData.status}
              </Badge>
            </div>

            {/* Right Column - Detailed Information */}
            <div className="flex-1 space-y-5 lg:w-3/4">
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                {/* Craft Details */}
                <div className="rounded-lg border p-4">
                  <div className="mb-3 flex items-center gap-2">
                    <Tag className="h-5 w-5 text-primary" />
                    <h3 className="text-base font-medium">Craft Information</h3>
                  </div>
                  <div className="space-y-3">
                    <div className="flex items-baseline justify-between">
                      <span className="text-sm font-medium text-muted-foreground">
                        Specialty:
                      </span>
                      <span className="text-sm">
                        {artisanData.craftSpecialty}
                      </span>
                    </div>

                    <div className="flex items-baseline justify-between">
                      <span className="text-sm font-medium text-muted-foreground">
                        Skill Level:
                      </span>
                      <Badge
                        className={getSkillBadgeColor(artisanData.craftSkill)}
                      >
                        {artisanData.craftSkill}
                      </Badge>
                    </div>

                    <div className="flex items-baseline justify-between">
                      <span className="text-sm font-medium text-muted-foreground">
                        Experience:
                      </span>
                      <span className="text-sm">
                        {artisanData.craftExperience} years
                      </span>
                    </div>

                    <div className="flex items-baseline justify-between">
                      <span className="text-sm font-medium text-muted-foreground">
                        Market Type:
                      </span>
                      <Badge
                        className={getMarketBadgeColor(artisanData.market)}
                      >
                        {artisanData.market}
                      </Badge>
                    </div>

                    {artisanData.craftAward !== "none" && (
                      <div>
                        <span className="text-sm font-medium text-muted-foreground">
                          Awards:
                        </span>
                        <p className="mt-1 text-sm">{artisanData.craftAward}</p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Contact Information */}
                <div className="rounded-lg border p-4">
                  <div className="mb-3 flex items-center gap-2">
                    <User className="h-5 w-5 text-primary" />
                    <h3 className="text-base font-medium">
                      Contact Information
                    </h3>
                  </div>
                  <div className="space-y-3">
                    <div className="flex items-start gap-2">
                      <Mail className="mt-0.5 h-4 w-4 text-muted-foreground" />
                      <div>
                        <span className="text-sm font-medium text-muted-foreground">
                          Email:
                        </span>
                        <p className="text-sm">{artisanData.user.email}</p>
                      </div>
                    </div>

                    <div className="flex items-start gap-2">
                      <Phone className="mt-0.5 h-4 w-4 text-muted-foreground" />
                      <div>
                        <span className="text-sm font-medium text-muted-foreground">
                          Phone:
                        </span>
                        <p className="text-sm">{artisanData.user.phone}</p>
                      </div>
                    </div>

                    <div className="flex items-start gap-2">
                      <MapPin className="mt-0.5 h-4 w-4 text-muted-foreground" />
                      <div>
                        <span className="text-sm font-medium text-muted-foreground">
                          Address:
                        </span>
                        <p className="text-sm">{artisanData.user.address}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Documents Quick Access */}
              {artisanData.documents.length > 0 && (
                <div className="rounded-lg border p-4">
                  <div className="mb-3 flex items-center gap-2">
                    <FileText className="h-5 w-5 text-primary" />
                    <h3 className="text-base font-medium">Documentation</h3>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {artisanData.documents.map((doc, index) => (
                      <Button key={index} variant="outline" size="sm">
                        Document {index + 1}
                      </Button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tab Navigation - On a Separate Row */}
      <div className="mb-6">
        <Card>
          <CardHeader className="border-b pb-3 pt-6">
            <CardTitle className="text-xl font-medium">
              Detailed Information
            </CardTitle>
            <CardDescription>
              Certifications, documents, and quality standards
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-6">
            <Tabs defaultValue="criteria" className="w-full">
              <TabsList className="mb-6 grid w-full grid-cols-2">
                <TabsTrigger value="criteria" className="text-base">
                  <ShieldCheck className="mr-2 h-4 w-4" />
                  Criteria & Standards
                </TabsTrigger>
                <TabsTrigger value="documents" className="text-base">
                  <FileText className="mr-2 h-4 w-4" />
                  Documents
                </TabsTrigger>
              </TabsList>

              <TabsContent value="criteria">
                <div className="space-y-4">
                  {/* Material and Process */}
                  <div className="rounded-lg border p-4">
                    <h3 className="mb-3 text-lg font-medium">
                      Materials & Process
                    </h3>

                    <div className="space-y-3">
                      <div>
                        <p className="text-sm font-medium">
                          Source of Materials:
                        </p>
                        <p className="text-sm">
                          {artisanData.criteria.sourceOfMaterial !== "none"
                            ? artisanData.criteria.sourceOfMaterial
                            : "Not specified"}
                        </p>
                      </div>

                      <div>
                        <p className="text-sm font-medium">Crafting Process:</p>
                        <p className="text-sm">
                          {artisanData.criteria.craftingProcess !== "none"
                            ? artisanData.criteria.craftingProcess
                            : "Not specified"}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Certifications */}
                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    {/* Fair Trade */}
                    <div className="rounded-lg border p-4">
                      <div className="flex items-center gap-2">
                        <h3 className="font-medium">Fair Trade</h3>
                        <Badge
                          variant={
                            artisanData.criteria.fairTrade
                              ? "default"
                              : "outline"
                          }
                        >
                          {artisanData.criteria.fairTrade
                            ? "Verified"
                            : "Not Verified"}
                        </Badge>
                      </div>

                      {artisanData.criteria.fairTrade &&
                        artisanData.criteria.fairtradeDoc.length > 0 && (
                          <div className="mt-2">
                            <p className="text-xs text-muted-foreground">
                              {artisanData.criteria.fairtradeDoc.length}{" "}
                              document(s) available
                            </p>
                          </div>
                        )}
                    </div>

                    {/* GI Certification */}
                    <div className="rounded-lg border p-4">
                      <div className="flex items-center gap-2">
                        <h3 className="font-medium">Geographical Indication</h3>
                        <Badge
                          variant={
                            artisanData.criteria.giHold ? "default" : "outline"
                          }
                        >
                          {artisanData.criteria.giHold
                            ? "Verified"
                            : "Not Verified"}
                        </Badge>
                      </div>

                      {artisanData.criteria.giHold && (
                        <div className="mt-2">
                          <p className="text-xs">
                            GI Number: {artisanData.criteria.giNumber}
                          </p>
                        </div>
                      )}
                    </div>

                    {/* Blockchain */}
                    <div className="rounded-lg border p-4">
                      <div className="flex items-center gap-2">
                        <h3 className="font-medium">Blockchain Verification</h3>
                        <Badge
                          variant={
                            artisanData.criteria.blockChain
                              ? "default"
                              : "outline"
                          }
                        >
                          {artisanData.criteria.blockChain
                            ? "Verified"
                            : "Not Verified"}
                        </Badge>
                      </div>

                      {artisanData.criteria.blockChain &&
                        artisanData.criteria.blockChainDoc.length > 0 && (
                          <div className="mt-2">
                            <p className="text-xs text-muted-foreground">
                              {artisanData.criteria.blockChainDoc.length}{" "}
                              document(s) available
                            </p>
                          </div>
                        )}
                    </div>

                    {/* Sustainability */}
                    <div className="rounded-lg border p-4">
                      <div className="flex items-center gap-2">
                        <h3 className="font-medium">Sustainable Practices</h3>
                        <Badge
                          variant={
                            artisanData.criteria.sustainablePractices
                              ? "default"
                              : "outline"
                          }
                        >
                          {artisanData.criteria.sustainablePractices
                            ? "Verified"
                            : "Not Verified"}
                        </Badge>
                      </div>

                      {artisanData.criteria.sustainablePractices &&
                        artisanData.criteria.sustainabledescription !==
                          "none" && (
                          <div className="mt-2">
                            <p className="text-xs">
                              {artisanData.criteria.sustainabledescription}
                            </p>
                          </div>
                        )}
                    </div>
                  </div>

                  {/* Additional Certifications */}
                  <div className="rounded-lg border p-4">
                    <h3 className="mb-2 font-medium">Additional Standards</h3>
                    <div className="flex flex-wrap gap-2">
                      <Badge
                        variant={
                          artisanData.criteria.fairWage ? "default" : "outline"
                        }
                      >
                        Fair Wage {artisanData.criteria.fairWage ? "✓" : "✗"}
                      </Badge>

                      <Badge
                        variant={
                          artisanData.criteria.genderSuport
                            ? "default"
                            : "outline"
                        }
                      >
                        Gender Support{" "}
                        {artisanData.criteria.genderSuport ? "✓" : "✗"}
                      </Badge>

                      <Badge
                        variant={
                          artisanData.criteria.workplaceuphold
                            ? "default"
                            : "outline"
                        }
                      >
                        Workplace Standards{" "}
                        {artisanData.criteria.workplaceuphold ? "✓" : "✗"}
                      </Badge>

                      <Badge
                        variant={
                          !artisanData.criteria.childLabour
                            ? "default"
                            : "outline"
                        }
                      >
                        No Child Labor{" "}
                        {!artisanData.criteria.childLabour ? "✓" : "✗"}
                      </Badge>

                      <Badge
                        variant={
                          artisanData.criteria.ethics ? "default" : "outline"
                        }
                      >
                        Ethical Standards{" "}
                        {artisanData.criteria.ethics ? "✓" : "✗"}
                      </Badge>

                      <Badge
                        variant={
                          artisanData.criteria.qualityReview
                            ? "default"
                            : "outline"
                        }
                      >
                        Quality Review{" "}
                        {artisanData.criteria.qualityReview ? "✓" : "✗"}
                      </Badge>
                    </div>

                    {artisanData.criteria.genderSuport &&
                      artisanData.criteria.womenPercentage > 0 && (
                        <div className="mt-2">
                          <p className="text-xs">
                            Women in workforce:{" "}
                            {artisanData.criteria.womenPercentage}%
                          </p>
                        </div>
                      )}

                    {artisanData.criteria.workplaceuphold &&
                      artisanData.criteria.workplaceDescription !== "none" && (
                        <div className="mt-2">
                          <p className="text-xs">
                            Workplace standards:{" "}
                            {artisanData.criteria.workplaceDescription}
                          </p>
                        </div>
                      )}
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="documents">
                <div className="space-y-6">
                  {/* Artisan Documents */}
                  <div>
                    <h3 className="mb-3 text-lg font-medium">
                      Artisan Documents
                    </h3>
                    {artisanData.documents.length > 0 ? (
                      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                        {artisanData.documents.map((doc, index) => (
                          <div key={index} className="rounded-lg border p-2">
                            <div className="relative aspect-square w-full overflow-hidden rounded-md bg-muted">
                              <Image
                                src={doc}
                                alt={`Document ${index + 1}`}
                                fill
                                className="object-cover"
                              />
                            </div>
                            <p className="mt-2 text-center text-sm font-medium">
                              Document {index + 1}
                            </p>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="flex h-32 items-center justify-center rounded-md border-2 border-dashed">
                        <p className="text-muted-foreground">
                          No documents uploaded
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Fair Trade Documents */}
                  {artisanData.criteria.fairtradeDoc.length > 0 && (
                    <div>
                      <h3 className="mb-3 text-lg font-medium">
                        Fair Trade Documents
                      </h3>
                      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                        {artisanData.criteria.fairtradeDoc.map((doc, index) => (
                          <div key={index} className="rounded-lg border p-2">
                            <div className="relative aspect-square w-full overflow-hidden rounded-md bg-muted">
                              <Image
                                src={doc}
                                alt={`Fair Trade Document ${index + 1}`}
                                fill
                                className="object-cover"
                              />
                            </div>
                            <p className="mt-2 text-center text-sm font-medium">
                              Fair Trade Doc {index + 1}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Blockchain Documents */}
                  {artisanData.criteria.blockChainDoc.length > 0 && (
                    <div>
                      <h3 className="mb-3 text-lg font-medium">
                        Blockchain Documents
                      </h3>
                      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                        {artisanData.criteria.blockChainDoc.map(
                          (doc, index) => (
                            <div key={index} className="rounded-lg border p-2">
                              <div className="relative aspect-square w-full overflow-hidden rounded-md bg-muted">
                                <Image
                                  src={doc}
                                  alt={`Blockchain Document ${index + 1}`}
                                  fill
                                  className="object-cover"
                                />
                              </div>
                              <p className="mt-2 text-center text-sm font-medium">
                                Blockchain Doc {index + 1}
                              </p>
                            </div>
                          ),
                        )}
                      </div>
                    </div>
                  )}

                  {/* GI Certificate */}
                  {artisanData.criteria.giDoc !== "none" && (
                    <div>
                      <h3 className="mb-3 text-lg font-medium">
                        GI Certificate
                      </h3>
                      <div className="w-full max-w-xs">
                        <div className="rounded-lg border p-2">
                          <div className="relative aspect-square w-full overflow-hidden rounded-md bg-muted">
                            <Image
                              src={artisanData.criteria.giDoc}
                              alt="GI Certificate"
                              fill
                              className="object-cover"
                            />
                          </div>
                          <p className="mt-2 text-center text-sm font-medium">
                            GI Certificate
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </>
  );
}
