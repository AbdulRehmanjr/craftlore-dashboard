import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";

export const env = createEnv({
  server: {
    AUTH_SECRET:
      process.env.NODE_ENV === "production"
        ? z.string()
        : z.string().optional(),
        AUTH_URL:z.string().url(),
    DATABASE_URL: z.string().url(),
    NODE_ENV: z
      .enum(["development", "test", "production"])
      .default("development"),
    CLOUD_NAME: z.string(),
    CLOUD_KEY: z.string(),
    CLOUD_SECERT: z.string(),
  },

  client: {
    NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME: z.string(),
  },
  runtimeEnv: {
    AUTH_SECRET: process.env.AUTH_SECRET,
    AUTH_URL:process.env.AUTH_URL,
    DATABASE_URL: process.env.DATABASE_URL,
    NODE_ENV: process.env.NODE_ENV,
    CLOUD_NAME: process.env.CLOUD_NAME,
    CLOUD_KEY: process.env.CLOUD_KEY,
    CLOUD_SECERT: process.env.CLOUD_SECERT,
    NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME:process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  },

  skipValidation: !!process.env.SKIP_ENV_VALIDATION,
  emptyStringAsUndefined: true,
});
