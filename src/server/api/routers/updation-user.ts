import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";
import { TRPCError } from "@trpc/server";
import { type SkillLevel, type MarketType, type RegisterType, type Status, type BusinessLevel, type InstitutionType } from "@prisma/client";

export const updationRouter = createTRPCRouter({
  // Get a single artisan by ID with user information
  getArtisanById: protectedProcedure
    .input(z.object({ artisanId: z.string() }))
    .query(async ({ ctx, input }) => {
      const artisan = await ctx.db.artisan.findUnique({
        where: {
          artisanId: input.artisanId,
        },
        include: {
          user: {
            select: {
              userId: true,
              fullName: true,
              email: true,
              phone: true,
              address: true,
              registerType: true,
              status: true,
            },
          },
        },
      });

      if (!artisan) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Artisan not found",
        });
      }

      return artisan;
    }),

  // Update artisan information only
  updateArtisan: protectedProcedure
    .input(
      z.object({
        artisanId: z.string(),
        craftSpecialty: z.string(),
        craftSkill: z.enum([
          "None",
          "Beginner",
          "Advanced",
          "Expert"
        ]).transform(val => val as SkillLevel),
        craftExperience: z.number().min(0),
        craftAward: z.string().optional(),
        market: z.enum([
          "None",
          "Local",
          "National",
          "International"
        ]).transform(val => val as MarketType),
        status: z.string(),
        userId: z.string(),
        listingCriteria: z.string(),
        documents: z.array(z.string()).optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      // Check if the artisan exists
      const existingArtisan = await ctx.db.artisan.findUnique({
        where: {
          artisanId: input.artisanId,
        },
      });

      if (!existingArtisan) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Artisan not found",
        });
      }

      // Update the artisan
      const updatedArtisan = await ctx.db.artisan.update({
        where: {
          artisanId: input.artisanId,
        },
        data: {
          craftSpecialty: input.craftSpecialty,
          craftSkill: input.craftSkill,
          craftExperience: input.craftExperience,
          craftAward: input.craftAward ?? "none",
          market: input.market,
          status: input.status,
          documents: input.documents ?? existingArtisan.documents,
        },
        include: {
          user: {
            select: {
              fullName: true,
              email: true,
              phone: true,
              address: true,
            },
          },
        },
      });

      return updatedArtisan;
    }),

  // Update both artisan and user information
  updateArtisanWithUser: protectedProcedure
    .input(
      z.object({
        // Artisan fields
        artisanId: z.string(),
        craftSpecialty: z.string(),
        craftSkill: z.enum([
          "None",
          "Beginner",
          "Advanced",
          "Expert"
        ]).transform(val => val as SkillLevel),
        craftExperience: z.number().min(0),
        craftAward: z.string().optional(),
        market: z.enum([
          "None",
          "Local",
          "National",
          "International"
        ]).transform(val => val as MarketType),
        status: z.string(),
        listingCriteria: z.string(),
        documents: z.array(z.string()).optional(),

        // User fields
        userId: z.string(),
        fullName: z.string(),
        phone: z.string(),
        email: z.string().email(),
        address: z.string(),
        registerType: z.enum([
          "None",
          "Artisan",
          "Business",
          "Institution",
          "BuyerMembership",
          "CorpoMembership",
          "SponsorMembership"
        ]).transform(val => val as RegisterType),
        userStatus: z.enum([
          "Pending",
          "Actice"
        ]).transform(val => val as Status),
      })
    )
    .mutation(async ({ ctx, input }) => {
      // Check if the artisan exists
      const existingArtisan = await ctx.db.artisan.findUnique({
        where: {
          artisanId: input.artisanId,
        },
        include: {
          user: true,
        },
      });

      if (!existingArtisan) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Artisan not found",
        });
      }

      // Start a transaction to update both artisan and user
      const [updatedUser, updatedArtisan] = await ctx.db.$transaction([
        // Update user information
        ctx.db.user.update({
          where: {
            userId: input.userId,
          },
          data: {
            fullName: input.fullName,
            phone: input.phone,
            email: input.email,
            address: input.address,
            registerType: input.registerType,
            status: input.userStatus,
          },
        }),

        // Update artisan information
        ctx.db.artisan.update({
          where: {
            artisanId: input.artisanId,
          },
          data: {
            craftSpecialty: input.craftSpecialty,
            craftSkill: input.craftSkill,
            craftExperience: input.craftExperience,
            craftAward: input.craftAward ?? "none",
            market: input.market,
            status: input.status,
            documents: input.documents ?? existingArtisan.documents,
          },
        }),
      ]);

      // Return the updated artisan with the updated user information
      return {
        ...updatedArtisan,
        user: updatedUser,
      };
    }),

  getBusinessById: protectedProcedure
    .input(z.object({ businessId: z.string() }))
    .query(async ({ ctx, input }) => {
      const business = await ctx.db.business.findUnique({
        where: {
          businessId: input.businessId,
        },
        include: {
          user: {
            select: {
              userId: true,
              fullName: true,
              email: true,
              phone: true,
              address: true,
              registerType: true,
              status: true,
            },
          },
        },
      });

      if (!business) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Business not found",
        });
      }

      return business;
    }),

  // Update business and user information
  updateBusinessWithUser: protectedProcedure
    .input(
      z.object({
        // Business fields
        businessId: z.string(),
        businessName: z.string(),
        businessEmail: z.string().email(),
        businessAddress: z.string(),
        businessType: z.enum([
          "None",
          "Large_Enterprice",
          "Mid_sized_Business",
          "Small_Business",
          "Startup"
        ]).transform(val => val as BusinessLevel),
        businessSold: z.string(),
        businessEmployee: z.number().min(0),
        status: z.string(),
        listingCriteria: z.string(),
        documents: z.array(z.string()),
        businessMarket: z.enum([
          "None",
          "Local",
          "National",
          "International"
        ]).transform(val => val as MarketType),
        yearOfOperation: z.number().min(1),

        // User fields
        userId: z.string(),
        fullName: z.string(),
        phone: z.string(),
        email: z.string().email(),
        address: z.string(),
        registerType: z.enum([
          "None",
          "Artisan",
          "Business",
          "Institution",
          "BuyerMembership",
          "CorpoMembership",
          "SponsorMembership"
        ]).transform(val => val as RegisterType),
        userStatus: z.enum([
          "Pending",
          "Actice"
        ]).transform(val => val as Status),
        businessStructure: z.string(),
        businessNetwork: z.string(),
        businessWebsite: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      // Check if the business exists
      const existingBusiness = await ctx.db.business.findUnique({
        where: {
          businessId: input.businessId,
        },
      });

      if (!existingBusiness) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Business not found",
        });
      }

      // Optional: Check if the user owns this business or has permission to update it
      // This can be implemented based on your authentication and authorization logic

      // Start a transaction to update both business and user
      const [updatedUser, updatedBusiness] = await ctx.db.$transaction([
        // Update user information
        ctx.db.user.update({
          where: {
            userId: input.userId,
          },
          data: {
            fullName: input.fullName,
            phone: input.phone,
            email: input.email,
            address: input.address,
            registerType: input.registerType,
            status: input.userStatus,
          },
        }),

        // Update business information
        ctx.db.business.update({
          where: {
            businessId: input.businessId,
          },
          data: {
            businessName: input.businessName,
            businessEmail: input.businessEmail,
            businessAddress: input.businessAddress,
            businessType: input.businessType,
            businessSold: input.businessSold,
            businessEmployee: input.businessEmployee,
            status: input.status,
            businessMarket: input.businessMarket,
            yearOfOperation: input.yearOfOperation,
            businessStructure: input.businessStructure,
            businessNetwork: input.businessNetwork,
            businessWebsite: input.businessWebsite,
            documents: input.documents || existingBusiness.documents,
          },
        }),
      ]);

      // Return the updated business with the updated user information
      return {
        ...updatedBusiness,
        user: updatedUser,
      };
    }),

  // Get all businesses (for listing page)
  getBusinesses: protectedProcedure
    .query(async ({ ctx }) => {
      const businesses = await ctx.db.business.findMany({
        orderBy: {
          businessName: "asc",
        },
        include: {
          user: {
            select: {
              fullName: true,
              email: true,
              phone: true,
              address: true,
            },
          },
        },
      });

      return businesses;
    }),

  getInstituteById: protectedProcedure
    .input(z.object({ instituteId: z.string() }))
    .query(async ({ ctx, input }) => {
      const institute = await ctx.db.institute.findUnique({
        where: {
          instituteId: input.instituteId,
        },
        include: {
          user: {
            select: {
              userId: true,
              fullName: true,
              email: true,
              phone: true,
              address: true,
              registerType: true,
              status: true,
            },
          },
        },
      });

      if (!institute) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Institute not found",
        });
      }

      return institute;
    }),

  // Update institute and user information
  updateInstituteWithUser: protectedProcedure
    .input(
      z.object({
        // Institute fields
        instituteId: z.string(),
        instituteName: z.string(),
        instituteEmail: z.string().email(),
        instituteType: z.enum([
          "None",
          "Governance",
          "NGO",
          "Training_Body",
          "Educational_Body"
        ]).transform(val => val as InstitutionType),
        instituteAddress: z.string(),
        instituteMission: z.string(),
        instituteRep: z.string(),
        repDes: z.string(),
        status: z.string(),
        listingCriteria: z.string(),
        documents: z.array(z.string()),

        // User fields
        userId: z.string(),
        fullName: z.string(),
        phone: z.string(),
        email: z.string().email(),
        address: z.string(),
        registerType: z.enum([
          "None",
          "Artisan",
          "Business",
          "Institution",
          "BuyerMembership",
          "CorpoMembership",
          "SponsorMembership"
        ]).transform(val => val as RegisterType),
        userStatus: z.enum([
          "Pending",
          "Actice"
        ]).transform(val => val as Status),
      })
    )
    .mutation(async ({ ctx, input }) => {
      // Check if the institute exists
      const existingInstitute = await ctx.db.institute.findUnique({
        where: {
          instituteId: input.instituteId,
        },
      });

      if (!existingInstitute) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Institute not found",
        });
      }

      // Optional: Check if the user owns this institute or has permission to update it
      // This can be implemented based on your authentication and authorization logic

      // Start a transaction to update both institute and user
      const [updatedUser, updatedInstitute] = await ctx.db.$transaction([
        // Update user information
        ctx.db.user.update({
          where: {
            userId: input.userId,
          },
          data: {
            fullName: input.fullName,
            phone: input.phone,
            email: input.email,
            address: input.address,
            registerType: input.registerType,
            status: input.userStatus,
          },
        }),

        // Update institute information
        ctx.db.institute.update({
          where: {
            instituteId: input.instituteId,
          },
          data: {
            instituteName: input.instituteName,
            instituteEmail: input.instituteEmail,
            instituteType: input.instituteType,
            instituteAddress: input.instituteAddress,
            instituteMission: input.instituteMission,
            instituteRep: input.instituteRep,
            repDes: input.repDes,
            status: input.status,
            documents: input.documents || existingInstitute.documents,
          },
        }),
      ]);

      // Return the updated institute with the updated user information
      return {
        ...updatedInstitute,
        user: updatedUser,
      };
    }),

  // Get all institutes (for listing page)
  getInstitutes: protectedProcedure
    .query(async ({ ctx }) => {
      const institutes = await ctx.db.institute.findMany({
        orderBy: {
          instituteName: "asc",
        },
        include: {
          user: {
            select: {
              fullName: true,
              email: true,
              phone: true,
              address: true,
            },
          },
        },
      });

      return institutes;
    }),

  // Update just the institute status
  updateInstituteStatus: protectedProcedure
    .input(
      z.object({
        instituteId: z.string(),
        status: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const updatedInstitute = await ctx.db.institute.update({
        where: {
          instituteId: input.instituteId,
        },
        data: {
          status: input.status,
        },
      });

      return updatedInstitute;
    }),

});