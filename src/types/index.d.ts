type RoleProps = 'ADMIN' | 'SUPERADMIN' | 'API'

type AccountProps = {
    email: string;
    password: string;
    accountId: string;
    role: RoleProps;
    createdAt: Date;
    udpatedAt: Date;
}


type EmployeeProps = {
    employId: string;
    fullName: string;
    skills: string;
    contribution: string;
    organization: string
}

type ArtisanProps = {
    artisanId: string;
    craftSpecialty: string;
    craftSkill: SkillLevel;
    craftExperience: number;
    craftAward: string;
    market: MarketType;
    documents: string[];
    status: string;
    userId: string;
    listingCriteria: string;
    user: {
        fullName: string
        address: string
    };
};

type BusinessProps = {
    businessId: string;
    businessName: string;
    businessEmail: string;
    businessAddress: string;
    businessType: BusinessLevel;
    businessSold: string;
    businessEmployee: number;
    documents: string[];
    status: string;
    listingCriteria: string;
    userId: string;
};

type InstituteProps = {
    instituteId: string;
    instituteName: string;
    instituteEmail: string;
    instituteType: InstitutionType;
    instituteAddress: string;
    instituteMission: string;
    instituteRep: string;
    repDes: string;
    documents: string[];
    status: string;
    listingCriteria: string;
    userId: string;
};

type CategoryProps = {
    categoryId: string
    categoryName: string
    rank: number
}

type SubCategoryProps = {
    subcategoryId: string
    subcategoryName: string
    categoryId: string
}

type SectionProps = {
    sectionId: string
    sectionType: SectionTypeProps
    subcategoryId: string
}

type MaterialProps = {
    materialId: string
    materialName: string
    subcategoryId: string
}

type ValueProps = {
    valueId: string
    value: string
    valueName: string
    sectionId: string
    materialId: string
}

type GIReportProps = {
    giId: string
    fullName: string
    email: string
    report: string
    productCode: string
}

type SectionTypeProps =
    "None" |
    "MaterialType" |
    "Quality" |
    "ProductionProcess" |
    "ProductCertifications" |
    "PlyType" |
    "TypeOfWeaving" |
    "DesignPatternTypes" |
    "DyeTypes" |
    "FinishingTechniques" |
    "ProductLineSize" |
    "ColorShades" |
    "Embellishments" |
    "Certifications" |
    "MaterialGrading" |
    "ProductTypesSizes" |
    "KnotPerInch" |
    "Dimensions" |
    "CarvingTechniques" |
    "ScaleOfCarving" |
    "FinishOptions" |
    "PatternTypes" |
    "FabricAndMaterial" |
    "RawMaterial" |
    "Processing" |
    "Packaging" |
    "Transportation" |
    "Crafting" |
    "Installation" |
    "Finishing" |
    "Preparation" |
    "CookingProcess" |
    "PaintingAndLacquering" |
    "Embroidery" |
    "ProductLine" |
    "ProductionMethod"


type BuyerMembershipProps = {
    buyerMemberId: string;
    buyerType: string;
    businessName: string;
    businessType: string;
    taxId: string;
    country: string;
    website: string;
    productInterest: string[];
    orderVolume: string;
    authentication: string;
    traceability: string;
    sustainability: string[];
    source: string;
    newsletter: boolean;
    specialRequirements: string;
    terms: boolean;
    userId: string;
    createdAt: Date;
    updatedAt: Date;
    user: {
        userId: string;
        fullName: string;
        email: string;
        phone: string;
        address: string;
    };
}


type CorpoMembershipProps = {
    corpoMemberId: string;
    institutionName: string;
    institutionType: string;
    industry: string;
    yearEstablished: number;
    taxId: string;
    primaryContact: string;
    contactEmail: string;
    contactPhone: string;
    website: string;
    headquartersAddress: string;
    additionalLocations: string;
    partnershipType: string;
    partnershipGoals: string;
    targetProducts: string[];
    csrInterest: string;
    csrInitiatives: string;
    sustainabilityPractices: string;
    businessLicense: string;
    proofOfTaxID: string;
    references: string;
    engagementChannels: string;
    customerDemographic: string;
    brandMission: string;
    specificRequirements: string;
    challenges: string;
    additionalComments: string;
    terms: boolean;
    userId: string;
    createdAt: string | Date;
    updatedAt: string | Date;
    user: {
      userId: string;
      fullName: string;
      email: string;
      phone: string;
      address?: string;
    };
  };

  type SponsorMembershipProps = {
    sponsorshipId: string;
    sponsorName: string;
    contactPerson: string;
    email: string;
    phone: string;
    socialLinks: string;
    sponsorType: string;
    industry: string;
    sponsorshipGoal: string;
    objectives: string;
    focusArea: string;
    tier: string;
    budgetRange: string;
    sponsorshipChannel: string;
    eventInterest: string;
    productCustomization: string;
    csrInterest: string;
    pastCSREfforts: string;
    sustainabilityPractices: string;
    brandingOptions: string[];
    socialHandles: string;
    communicationChannel: string;
    impactMetrics: string[];
    reportFrequency: string;
    publicUse: string;
    specialRequirements: string;
    additionalComments: string;
    terms: boolean;
    userId: string;
    createdAt: string | Date;
    updatedAt: string | Date;
    user: {
      userId: string;
      fullName: string;
      email: string;
      phone: string;
      address?: string;
    };
  };