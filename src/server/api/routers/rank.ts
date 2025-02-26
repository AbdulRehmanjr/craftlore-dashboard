// src/server/api/routers/ranks.ts
import { createTRPCRouter, publicProcedure } from "../trpc";
import { ListingRanks } from "@prisma/client";

export const ranksRouter = createTRPCRouter({
  getArtisansByRank: publicProcedure.query(async ({ ctx }) => {
    const artisans = await ctx.db.artisan.findMany({
      include: {
        user: true,
        criteria: true,
      },
      orderBy: {
        criteria: {
          listingRank: "asc", // None, Gold, Silver, Bronze order
        }
      }
    });
    
    // Group by rank
    const gold = artisans.filter(a => a.criteria.listingRank === ListingRanks.Gold);
    const silver = artisans.filter(a => a.criteria.listingRank === ListingRanks.Silver);
    const bronze = artisans.filter(a => a.criteria.listingRank === ListingRanks.Bronze);
    const none = artisans.filter(a => a.criteria.listingRank === ListingRanks.None);
    
    return { gold, silver, bronze, none };
  }),
  
  getBusinessesByRank: publicProcedure.query(async ({ ctx }) => {
    const businesses = await ctx.db.business.findMany({
      include: {
        user: true,
        criteria: true,
      },
      orderBy: {
        criteria: {
          listingRank: "asc",
        }
      }
    });
    
    // Group by rank
    const gold = businesses.filter(b => b.criteria.listingRank === ListingRanks.Gold);
    const silver = businesses.filter(b => b.criteria.listingRank === ListingRanks.Silver);
    const bronze = businesses.filter(b => b.criteria.listingRank === ListingRanks.Bronze);
    const none = businesses.filter(b => b.criteria.listingRank === ListingRanks.None);
    
    return { gold, silver, bronze, none };
  }),
  
  getInstitutesByRank: publicProcedure.query(async ({ ctx }) => {
    const institutes = await ctx.db.institute.findMany({
      include: {
        user: true,
        criteria: true,
      },
      orderBy: {
        criteria: {
          listingRank: "asc",
        }
      }
    });
    
    // Group by rank
    const gold = institutes.filter(i => i.criteria.listingRank === ListingRanks.Gold);
    const silver = institutes.filter(i => i.criteria.listingRank === ListingRanks.Silver);
    const bronze = institutes.filter(i => i.criteria.listingRank === ListingRanks.Bronze);
    const none = institutes.filter(i => i.criteria.listingRank === ListingRanks.None);
    
    return { gold, silver, bronze, none };
  }),
});