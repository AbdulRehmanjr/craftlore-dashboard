import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { randomBytes } from "crypto";
import { BusinessLevel, InstitutionType } from "@prisma/client";
import { BriefcaseIcon, BuildingIcon, GraduationCapIcon, type LucideIcon, SchoolIcon, ShoppingBagIcon, StoreIcon } from "lucide-react";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const getPaginationPages = (totalPages: number, currentPage: number) => {
  const maxPages = 5;
  let startPage = Math.max(0, currentPage - Math.floor(maxPages / 2));
  const endPage = Math.min(totalPages - 1, startPage + maxPages - 1);

  if (endPage - startPage + 1 < maxPages) {
    startPage = Math.max(0, endPage - maxPages + 1);
  }

  return Array.from(
    { length: endPage - startPage + 1 },
    (_, i) => startPage + i,
  );
};

export const randomCode = (length: number, prefix: string) => {
  let generatedString = prefix;
  const charset = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  const randombytes = randomBytes(length)
  for (const byte of randombytes) {
      const randomIndex = byte % charset.length;
      generatedString += charset[randomIndex];
  }
  return generatedString.slice(0, length)
}

export const getStatusColor = (status: string) => {
  switch (status.toLowerCase()) {
    case "active":
      return "bg-green-100 text-green-800 border-green-300";
    case "pending":
      return "bg-yellow-100 text-yellow-800 border-yellow-300";
    case "inactive":
      return "bg-red-100 text-red-800 border-red-300";
    case "blacklist":
      return "bg-red-100 text-black border-white";
    default:
      return "bg-blue-100 text-blue-800 border-blue-300";
  }
};

export const getBusinessTypeIcon = (type: BusinessLevel): LucideIcon => {
  switch (type) {
    case "Large_Enterprice":
      return BuildingIcon;
    case "Mid_sized_Business":
      return BriefcaseIcon;
    case "Small_Business":
      return StoreIcon;
    case "Startup":
      return ShoppingBagIcon;
    default:
      return StoreIcon;
  }
};

export const getBusinessTypeColor = (type: BusinessLevel) => {
  switch (type) {
    case BusinessLevel.Large_Enterprice:
      return "bg-purple-100 text-purple-800 border-purple-300";
    case BusinessLevel.Mid_sized_Business:
      return "bg-blue-100 text-blue-800 border-blue-300";
    case BusinessLevel.Small_Business:
      return "bg-indigo-100 text-indigo-800 border-indigo-300";
    case BusinessLevel.Startup:
      return "bg-amber-100 text-amber-800 border-amber-300";
    default:
      return "bg-gray-100 text-gray-800 border-gray-300";
  }
};

export const formatBusinessLevel = (type: BusinessLevel): string => {
  switch (type) {
    case BusinessLevel.Large_Enterprice:
      return "Large Enterprice";
    case BusinessLevel.Mid_sized_Business:
      return "Mid-sized Business";
    case BusinessLevel.Small_Business:
      return "Small Business";
    case BusinessLevel.Startup:
      return "Startup";
    default:
      return "None";
  }
};


export const getInstitutionTypeIcon = (type: InstitutionType) => {
  switch (type) {
    case InstitutionType.Governance:
      return BuildingIcon;
    case InstitutionType.NGO:
      return BuildingIcon;
    case InstitutionType.Training_Body:
      return GraduationCapIcon;
    case InstitutionType.Educational_Body:
      return SchoolIcon;
    default:
      return BuildingIcon;
  }
};

export const getInstitutionTypeColor = (type: InstitutionType) => {
  switch (type) {
    case InstitutionType.Governance:
      return "bg-amber-100 text-amber-800 border-amber-300";
    case InstitutionType.NGO:
      return "bg-green-100 text-green-800 border-green-300";
    case InstitutionType.Training_Body:
      return "bg-blue-100 text-blue-800 border-blue-300";
    case InstitutionType.Educational_Body:
      return "bg-purple-100 text-purple-800 border-purple-300";
    default:
      return "bg-gray-100 text-gray-800 border-gray-300";
  }
};

export const getInstitutionTypeFormat = (type: InstitutionType) => {
  switch (type) {
    case InstitutionType.Governance:
      return "Governance";
    case InstitutionType.NGO:
      return "NGO";
    case InstitutionType.Training_Body:
      return "Training Body";
    case InstitutionType.Educational_Body:
      return "Eductional Body";
    default:
      return "None";
  }
};