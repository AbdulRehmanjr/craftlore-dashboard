type RoleProps = 'ADMIN' | 'SUPERADMIN'

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
    name: string
}

type SubCategoryProps = {
    subcategoryId: string
    name: string
    categoryId: string
}

type SectionProps = {
    sectionId: string
    name: string
    type: SectionTypeProps
    subcategoryId: string
}

type ValueProps = {
    valueId: string
    name: string
    value: string
    sectionId: string
}

type SectionTypeProps =
    "None" |
    "RawMaterial" |
    "Processing" |
    "ProductionMethod" |
    "Packaging" |
    "Transportation" |
    "Crafting" |
    "Installation" |
    "Finishing" |
    "Preparation" |
    "CookingProcess" |
    "PaintingAndLacquering" |
    "Embroidery"
