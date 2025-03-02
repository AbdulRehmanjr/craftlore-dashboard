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
  Building2,
  Mail,
  MapPin,
  Phone,
  FileText,
  ShieldCheck,
  Download,
} from "lucide-react";

type PageProps = {
  searchParams: Promise<{ businessId: string }>;
};

export default async function BusinessDetailPage({ searchParams }: PageProps) {
  const searchProps = await searchParams;
  // Fetch business data using TRPC
  const businessData = await api.listing.getBusinessDetail({
    businessId: searchProps.businessId,
  });

  if (!businessData) {
    return (
      <div className="flex h-96 w-full flex-col items-center justify-center">
        <h2 className="text-2xl font-semibold">Business Not Found</h2>
        <p className="text-muted-foreground">
          The business you&apos;re looking for doesn&apos;t exist or has been
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

  const getBusinessTypeColor = (type: string) => {
    switch (type) {
      case "Large_Enterprice":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300";
      case "Mid_sized_Business":
        return "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300";
      case "Small_Business":
        return "bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-300";
      case "Startup":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300";
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
    const listingRank = businessData.criteria.listingRank;

    switch (listingRank) {
      case "Gold":
        return { color: "bg-amber-500", label: "Gold level business" };
      case "Silver":
        return { color: "bg-gray-400", label: "Silver level business" };
      case "Bronze":
        return { color: "bg-amber-700", label: "Bronze level business" };
      default:
        return { color: "bg-slate-300", label: "Standard business" };
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
              <BreadcrumbPage>Business Details</BreadcrumbPage>
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

      {/* Business Profile Section */}
      <Card className="mb-6">
        <CardHeader className="border-b pb-3 pt-6">
          <CardTitle className="text-xl font-medium">
            Business Information
          </CardTitle>
          <CardDescription>
            Details about the business and its operations
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="flex flex-col gap-8 lg:flex-row">
            {/* Left Column - Business Summary */}
            <div className="flex flex-col items-center lg:w-1/4">
              <div className="relative">
                <Badge
                  className={`${levelInfo.color} absolute -right-2 -top-2 text-white`}
                >
                  {levelInfo.label}
                </Badge>
                <div className="flex h-48 w-48 items-center justify-center rounded-xl bg-muted">
                  <Building2 className="h-20 w-20 text-muted-foreground/40" />
                </div>
              </div>
              <h2 className="mt-4 text-center text-2xl font-semibold">
                {businessData.businessName}
              </h2>

              <Badge variant="outline" className="mt-1 text-sm font-normal">
                Status: {businessData.status}
              </Badge>
            </div>

            {/* Right Column - Detailed Information */}
            <div className="flex-1 space-y-5 lg:w-3/4">
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                {/* Business Details */}
                <div className="rounded-lg border p-4">
                  <div className="mb-3 flex items-center gap-2">
                    <Building2 className="h-5 w-5 text-primary" />
                    <h3 className="text-base font-medium">
                      Business Information
                    </h3>
                  </div>
                  <div className="space-y-3">
                    <div className="flex items-baseline justify-between">
                      <span className="text-sm font-medium text-muted-foreground">
                        Business Type:
                      </span>
                      <Badge
                        className={getBusinessTypeColor(
                          businessData.businessType,
                        )}
                      >
                        {businessData.businessType.replace(/_/g, " ")}
                      </Badge>
                    </div>

                    <div className="flex items-baseline justify-between">
                      <span className="text-sm font-medium text-muted-foreground">
                        Products Sold:
                      </span>
                      <span className="text-sm">
                        {businessData.businessSold !== "none"
                          ? businessData.businessSold
                          : "Not specified"}
                      </span>
                    </div>

                    <div className="flex items-baseline justify-between">
                      <span className="text-sm font-medium text-muted-foreground">
                        Employees:
                      </span>
                      <span className="text-sm">
                        {businessData.businessEmployee} people
                      </span>
                    </div>

                    <div className="flex items-baseline justify-between">
                      <span className="text-sm font-medium text-muted-foreground">
                        Market Type:
                      </span>
                      <Badge
                        className={getMarketBadgeColor(
                          businessData.businessMarket,
                        )}
                      >
                        {businessData.businessMarket}
                      </Badge>
                    </div>

                    <div className="flex items-baseline justify-between">
                      <span className="text-sm font-medium text-muted-foreground">
                        Years of Operation:
                      </span>
                      <span className="text-sm">
                        {businessData.yearOfOperation} years
                      </span>
                    </div>
                  </div>
                </div>

                {/* Contact Information */}
                <div className="rounded-lg border p-4">
                  <div className="mb-3 flex items-center gap-2">
                    <Mail className="h-5 w-5 text-primary" />
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
                        <p className="text-sm">{businessData.businessEmail}</p>
                      </div>
                    </div>

                    <div className="flex items-start gap-2">
                      <MapPin className="mt-0.5 h-4 w-4 text-muted-foreground" />
                      <div>
                        <span className="text-sm font-medium text-muted-foreground">
                          Address:
                        </span>
                        <p className="text-sm">
                          {businessData.businessAddress}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-2">
                      <Phone className="mt-0.5 h-4 w-4 text-muted-foreground" />
                      <div>
                        <span className="text-sm font-medium text-muted-foreground">
                          Contact Person:
                        </span>
                        <p className="text-sm">{businessData.user.fullName}</p>
                        <p className="text-sm">{businessData.user.phone}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Documents Quick Access */}
              {businessData.documents.length > 0 && (
                <div className="rounded-lg border p-4">
                  <div className="mb-3 flex items-center gap-2">
                    <FileText className="h-5 w-5 text-primary" />
                    <h3 className="text-base font-medium">
                      Business Documentation
                    </h3>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {businessData.documents.map((_, index) => (
                      <Button key={index} variant="outline" size="sm">
                        <FileText className="mr-1 h-4 w-4" />
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
                          {businessData.criteria.sourceOfMaterial !== "none"
                            ? businessData.criteria.sourceOfMaterial
                            : "Not specified"}
                        </p>
                      </div>

                      <div>
                        <p className="text-sm font-medium">
                          Manufacturing Process:
                        </p>
                        <p className="text-sm">
                          {businessData.criteria.craftingProcess !== "none"
                            ? businessData.criteria.craftingProcess
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
                            businessData.criteria.fairTrade
                              ? "default"
                              : "outline"
                          }
                        >
                          {businessData.criteria.fairTrade
                            ? "Verified"
                            : "Not Verified"}
                        </Badge>
                      </div>

                      {businessData.criteria.fairTrade &&
                        businessData.criteria.fairtradeDoc.length > 0 && (
                          <div className="mt-2">
                            <p className="text-xs text-muted-foreground">
                              {businessData.criteria.fairtradeDoc.length}{" "}
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
                            businessData.criteria.giHold ? "default" : "outline"
                          }
                        >
                          {businessData.criteria.giHold
                            ? "Verified"
                            : "Not Verified"}
                        </Badge>
                      </div>

                      {businessData.criteria.giHold && (
                        <div className="mt-2">
                          <p className="text-xs">
                            GI Number: {businessData.criteria.giNumber}
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
                            businessData.criteria.blockChain
                              ? "default"
                              : "outline"
                          }
                        >
                          {businessData.criteria.blockChain
                            ? "Verified"
                            : "Not Verified"}
                        </Badge>
                      </div>

                      {businessData.criteria.blockChain &&
                        businessData.criteria.blockChainDoc.length > 0 && (
                          <div className="mt-2">
                            <p className="text-xs text-muted-foreground">
                              {businessData.criteria.blockChainDoc.length}{" "}
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
                            businessData.criteria.sustainablePractices
                              ? "default"
                              : "outline"
                          }
                        >
                          {businessData.criteria.sustainablePractices
                            ? "Verified"
                            : "Not Verified"}
                        </Badge>
                      </div>

                      {businessData.criteria.sustainablePractices &&
                        businessData.criteria.sustainabledescription !==
                          "none" && (
                          <div className="mt-2">
                            <p className="text-xs">
                              {businessData.criteria.sustainabledescription}
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
                          businessData.criteria.fairWage ? "default" : "outline"
                        }
                      >
                        Fair Wage {businessData.criteria.fairWage ? "✓" : "✗"}
                      </Badge>

                      <Badge
                        variant={
                          businessData.criteria.genderSuport
                            ? "default"
                            : "outline"
                        }
                      >
                        Gender Support{" "}
                        {businessData.criteria.genderSuport ? "✓" : "✗"}
                      </Badge>

                      <Badge
                        variant={
                          businessData.criteria.workplaceuphold
                            ? "default"
                            : "outline"
                        }
                      >
                        Workplace Standards{" "}
                        {businessData.criteria.workplaceuphold ? "✓" : "✗"}
                      </Badge>

                      <Badge
                        variant={
                          !businessData.criteria.childLabour
                            ? "default"
                            : "outline"
                        }
                      >
                        No Child Labor{" "}
                        {!businessData.criteria.childLabour ? "✓" : "✗"}
                      </Badge>

                      <Badge
                        variant={
                          businessData.criteria.ethics ? "default" : "outline"
                        }
                      >
                        Ethical Standards{" "}
                        {businessData.criteria.ethics ? "✓" : "✗"}
                      </Badge>

                      <Badge
                        variant={
                          businessData.criteria.qualityReview
                            ? "default"
                            : "outline"
                        }
                      >
                        Quality Review{" "}
                        {businessData.criteria.qualityReview ? "✓" : "✗"}
                      </Badge>
                    </div>

                    {businessData.criteria.genderSuport &&
                      businessData.criteria.womenPercentage > 0 && (
                        <div className="mt-2">
                          <p className="text-xs">
                            Women in workforce:{" "}
                            {businessData.criteria.womenPercentage}%
                          </p>
                        </div>
                      )}

                    {businessData.criteria.workplaceuphold &&
                      businessData.criteria.workplaceDescription !== "none" && (
                        <div className="mt-2">
                          <p className="text-xs">
                            Workplace standards:{" "}
                            {businessData.criteria.workplaceDescription}
                          </p>
                        </div>
                      )}
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="documents">
                <div className="space-y-6">
                  {/* Business Documents */}
                  <div>
                    <h3 className="mb-3 text-lg font-medium">
                      Business Documents
                    </h3>
                    {businessData.documents.length > 0 ? (
                      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                        {businessData.documents.map((doc, index) => (
                          <div
                            key={index}
                            className="group relative rounded-lg border p-2 transition-all hover:shadow-md"
                          >
                            <div className="relative aspect-square w-full overflow-hidden rounded-md bg-muted">
                              <Image
                                src={doc}
                                alt={`Document ${index + 1}`}
                                fill
                                className="object-cover transition-transform duration-300 group-hover:scale-105"
                              />
                              <div className="absolute inset-0 bg-black/0 transition-colors group-hover:bg-black/20"></div>
                              <div className="absolute bottom-2 right-2 opacity-0 transition-opacity group-hover:opacity-100">
                                <Button
                                  size="icon"
                                  variant="secondary"
                                  className="h-8 w-8 rounded-full"
                                >
                                  <Download className="h-4 w-4" />
                                </Button>
                              </div>
                            </div>
                            <p className="mt-2 text-center text-sm font-medium">
                              Business Document {index + 1}
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
                  {businessData.criteria.fairTrade &&
                    businessData.criteria.fairtradeDoc.length > 0 && (
                      <div>
                        <h3 className="mb-3 text-lg font-medium">
                          Fair Trade Documents
                        </h3>
                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                          {businessData.criteria.fairtradeDoc.map(
                            (doc, index) => (
                              <div
                                key={index}
                                className="group relative rounded-lg border p-2 transition-all hover:shadow-md"
                              >
                                <div className="relative aspect-square w-full overflow-hidden rounded-md bg-muted">
                                  <Image
                                    src={doc}
                                    alt={`Fair Trade Document ${index + 1}`}
                                    fill
                                    className="object-cover transition-transform duration-300 group-hover:scale-105"
                                  />
                                  <div className="absolute inset-0 bg-black/0 transition-colors group-hover:bg-black/20"></div>
                                  <div className="absolute bottom-2 right-2 opacity-0 transition-opacity group-hover:opacity-100">
                                    <Button
                                      size="icon"
                                      variant="secondary"
                                      className="h-8 w-8 rounded-full"
                                    >
                                      <Download className="h-4 w-4" />
                                    </Button>
                                  </div>
                                </div>
                                <p className="mt-2 text-center text-sm font-medium">
                                  Fair Trade Doc {index + 1}
                                </p>
                              </div>
                            ),
                          )}
                        </div>
                      </div>
                    )}

                  {/* Blockchain Documents */}
                  {businessData.criteria.blockChain &&
                    businessData.criteria.blockChainDoc.length > 0 && (
                      <div>
                        <h3 className="mb-3 text-lg font-medium">
                          Blockchain Documents
                        </h3>
                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                          {businessData.criteria.blockChainDoc.map(
                            (doc, index) => (
                              <div
                                key={index}
                                className="group relative rounded-lg border p-2 transition-all hover:shadow-md"
                              >
                                <div className="relative aspect-square w-full overflow-hidden rounded-md bg-muted">
                                  <Image
                                    src={doc}
                                    alt={`Blockchain Document ${index + 1}`}
                                    fill
                                    className="object-cover transition-transform duration-300 group-hover:scale-105"
                                  />
                                  <div className="absolute inset-0 bg-black/0 transition-colors group-hover:bg-black/20"></div>
                                  <div className="absolute bottom-2 right-2 opacity-0 transition-opacity group-hover:opacity-100">
                                    <Button
                                      size="icon"
                                      variant="secondary"
                                      className="h-8 w-8 rounded-full"
                                    >
                                      <Download className="h-4 w-4" />
                                    </Button>
                                  </div>
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
                  {businessData.criteria.giHold &&
                    businessData.criteria.giDoc !== "none" && (
                      <div>
                        <h3 className="mb-3 text-lg font-medium">
                          GI Certificate
                        </h3>
                        <div className="w-full max-w-xs">
                          <div className="group relative rounded-lg border p-2 transition-all hover:shadow-md">
                            <div className="relative aspect-square w-full overflow-hidden rounded-md bg-muted">
                              <Image
                                src={businessData.criteria.giDoc}
                                alt="GI Certificate"
                                fill
                                className="object-cover transition-transform duration-300 group-hover:scale-105"
                              />
                              <div className="absolute inset-0 bg-black/0 transition-colors group-hover:bg-black/20"></div>
                              <div className="absolute bottom-2 right-2 opacity-0 transition-opacity group-hover:opacity-100">
                                <Button
                                  size="icon"
                                  variant="secondary"
                                  className="h-8 w-8 rounded-full"
                                >
                                  <Download className="h-4 w-4" />
                                </Button>
                              </div>
                            </div>
                            <p className="mt-2 text-center text-sm font-medium">
                              Geographical Indication Certificate
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
