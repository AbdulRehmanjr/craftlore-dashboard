import { type NextAuthConfig } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { db } from "~/server/db";
import bcrypt from "bcrypt"; // For password hashing/comparison

// Add custom properties to the session object
declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      email: string;
      accountType: string
    };
  }
  interface User {
    accountType: string; // Add accountType to User as well
  }
}

// Helper functions for password hashing
async function verifyPassword(plainPassword: string, hashedPassword: string) {
  return bcrypt.compare(plainPassword, hashedPassword);
}

/**
 * NextAuth configuration
 */
export const authConfig: NextAuthConfig = {
  session: {
    strategy: "jwt", // Use JWT-based sessions
  },
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text", placeholder: "you@example.com" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        const { email, password } = credentials as { email: string, password: string };

        // Fetch user from the database
        const userInfo: AccountProps | null = await db.account.findUnique({
          where: { email },
        });

        if (!userInfo) {
          throw new Error("Invalid email or password");
        }

        // Validate password
        const isValid = await verifyPassword(password, userInfo.password);
        if (!isValid) {
          throw new Error("Invalid email or password");
        }

        // Return user object (excluding sensitive fields)
        return {
          id: userInfo.accountId,
          email: userInfo.email,
          accountType: userInfo.accountType
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      // Add user details to the JWT token
      if (user) {
        token.id = user.id;
        token.email = user.email;
        token.name = user.name;
        token.accountType = user.accountType
      }
      return token;
    },
    async session({ session, token }) {
      // Pass JWT data to the session
      if (token) {
        session.user = {
          id: token.id as string,
          email: token.email!,
          accountType: token.accountType as string,
          emailVerified: new Date()
        };
      }
      return session;
    },
  },
  pages: {
    signIn: "/", // Custom sign-in page
    error: "/auth/error", // Error page
  },
  secret: process.env.NEXTAUTH_SECRET, // Secure key for JWT signing
};
