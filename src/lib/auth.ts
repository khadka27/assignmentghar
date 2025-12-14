import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import bcrypt from "bcryptjs";
import prisma from "@/lib/prisma";
import type { NextAuthConfig } from "next-auth";

export const authOptions: NextAuthConfig = {
  trustHost: true, // Required for production behind reverse proxy (Coolify/Nginx)
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      allowDangerousEmailAccountLinking: true, // Allow linking Google account to existing email
    }),
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        /**
         * Login Flow:
         * 1. Find user by email
         * 2. Check if password matches
         * 3. Check if email is verified
         *
         * Error codes:
         * - "USER_NOT_FOUND": Email doesn't exist
         * - "INVALID_CREDENTIALS": Wrong password
         * - "UNVERIFIED": Account exists but not verified
         */

        if (!credentials?.email || !credentials?.password) {
          throw new Error(
            "INVALID_CREDENTIALS: Email and password are required"
          );
        }

        // Normalize email
        const email =
          typeof credentials.email === "string"
            ? credentials.email
            : String(credentials.email);
        const normalizedEmail = email.trim().toLowerCase();

        const user = await prisma.user.findUnique({
          where: {
            email: normalizedEmail,
          },
        });

        // User not found
        if (!user) {
          throw new Error("USER_NOT_FOUND: User not found");
        }

        // No password (OAuth user trying to login with credentials)
        if (!user.password) {
          throw new Error("INVALID_CREDENTIALS: Please use Google sign-in");
        }

        // Verify password
        const isPasswordValid = await bcrypt.compare(
          credentials.password as string,
          user.password
        );

        if (!isPasswordValid) {
          throw new Error("INVALID_CREDENTIALS: Email or password incorrect");
        }

        // Check if user is verified
        if (!user.isVerified) {
          throw new Error(
            "UNVERIFIED: Account not verified. Please verify your email."
          );
        }

        // Success
        return {
          id: user.id,
          email: user.email,
          name: user.name,
          username: user.username,
          role: user.role,
          image: user.image,
        };
      },
    }),
  ],
  session: {
    strategy: "jwt",
  },
  pages: {
    signIn: "/login",
    error: "/login",
  },
  callbacks: {
    async signIn({ user, account, profile }) {
      // For OAuth providers (Google), ensure user has required fields
      if (account?.provider === "google") {
        // Check if user exists in database
        const existingUser = await prisma.user.findUnique({
          where: { email: user.email! },
        });

        if (existingUser) {
          // User exists, update their info from Google
          await prisma.user.update({
            where: { email: user.email! },
            data: {
              name: user.name || existingUser.name,
              image: user.image || existingUser.image,
              emailVerified: new Date(), // Mark as verified since Google verified it
              isVerified: true,
            },
          });
        } else {
          // New Google user - create with default role and mark as verified
          await prisma.user.create({
            data: {
              email: user.email!,
              name: user.name!,
              image: user.image,
              emailVerified: new Date(),
              isVerified: true,
              role: "STUDENT", // Default role for OAuth users
              password: "", // OAuth users don't have passwords
            },
          });
        }
      }
      return true;
    },
    async jwt({ token, user, account }) {
      // On initial sign in
      if (user) {
        // Fetch user from database to get role
        const dbUser = await prisma.user.findUnique({
          where: { email: user.email! },
        });

        if (dbUser) {
          token.id = dbUser.id;
          token.role = dbUser.role;
          token.username = dbUser.username;
        }
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.role = token.role as string;
        session.user.username = token.username as string | null;
      }
      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
  debug: process.env.NODE_ENV === "development",
};

export const { handlers, auth, signIn, signOut } = NextAuth(authOptions);
