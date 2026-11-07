import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import Google from "next-auth/providers/google";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { checkRateLimit } from "@/lib/rateLimit";
import { loginSchema } from "@/lib/authValidators";

export const { handlers, signIn, signOut, auth } = NextAuth({
  secret: process.env.AUTH_SECRET || process.env.NEXTAUTH_SECRET,
  trustHost: true,
  session: { strategy: "jwt" },
  pages: {
    signIn: "/login",
  },
  providers: [
    ...(process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET
      ? [
          Google({
            clientId: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
          }),
        ]
      : []),
    Credentials({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      authorize: async (credentials) => {
        const parsed = loginSchema.safeParse(credentials);
        if (!parsed.success) {
          return null;
        }

        const { email, password } = parsed.data;

        // Rate limit by email
        const rateCheck = checkRateLimit(`login:${email}`, 5, 15 * 60);
        if (!rateCheck.allowed) {
          throw new Error("Account temporarily locked. Please try again in 15 minutes.");
        }

        const user = await prisma.user.findUnique({
          where: { email },
        });

        if (!user || !user.passwordHash) {
          return null;
        }

        // Check if locked
        if (user.lockedUntil && user.lockedUntil > new Date()) {
          const remainingMinutes = Math.ceil(
            (user.lockedUntil.getTime() - Date.now()) / (60 * 1000)
          );
          throw new Error(
            `Account locked due to multiple failed attempts. Please try again in ${remainingMinutes} minute${remainingMinutes > 1 ? "s" : ""}.`
          );
        }

        const passwordMatch = bcrypt.compareSync(password, user.passwordHash);

        if (!passwordMatch) {
          const newFailedAttempts = user.failedLoginAttempts + 1;
          const isNowLocked = newFailedAttempts >= 5;

          await prisma.user.update({
            where: { id: user.id },
            data: {
              failedLoginAttempts: newFailedAttempts,
              lockedUntil: isNowLocked
                ? new Date(Date.now() + 15 * 60 * 1000)
                : null,
            },
          });

          if (isNowLocked) {
            throw new Error(
              "Account locked due to 5 failed attempts. Please wait 15 minutes."
            );
          }

          return null;
        }

        // On successful login: reset lockout counters
        await prisma.user.update({
          where: { id: user.id },
          data: {
            failedLoginAttempts: 0,
            lockedUntil: null,
          },
        });

        // Link past orders by email if any unlinked exist
        try {
          await prisma.order.updateMany({
            where: {
              guestEmail: email,
              userId: null,
            },
            data: {
              userId: user.id,
            },
          });
        } catch (e) {
          console.error("Order linking error:", e);
        }

        return {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
          phone: user.phone,
        };
      },
    }),
  ],
  callbacks: {
    async signIn({ user, account }) {
      if (account?.provider === "google" && user.email) {
        try {
          const existingUser = await prisma.user.findUnique({
            where: { email: user.email },
          });

          let dbUserId = existingUser?.id;

          const isAdminEmail =
            user.email.toLowerCase() === (process.env.ADMIN_EMAIL || "admin@wickandwish.in").toLowerCase() ||
            user.email.toLowerCase() === "pragya.shree.tech@gmail.com" ||
            user.email.toLowerCase() === "ps333mahi@gmail.com";

          if (!existingUser) {
            const created = await prisma.user.create({
              data: {
                email: user.email,
                name: user.name || "Customer",
                image: user.image,
                role: isAdminEmail ? "ADMIN" : "CUSTOMER",
              },
            });
            dbUserId = created.id;
          } else if (isAdminEmail && existingUser.role !== "ADMIN") {
            await prisma.user.update({
              where: { id: existingUser.id },
              data: { role: "ADMIN" },
            });
          }

          if (dbUserId) {
            // Link unlinked past orders
            await prisma.order.updateMany({
              where: {
                guestEmail: user.email,
                userId: null,
              },
              data: {
                userId: dbUserId,
              },
            });
          }
        } catch (err) {
          console.error("Google sign-in sync error:", err);
        }
      }
      return true;
    },
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = user.role;
        token.phone = user.phone;
      }
      const email = token.email?.toLowerCase();
      if (
        email === "pragya.shree.tech@gmail.com" ||
        email === "ps333mahi@gmail.com" ||
        email === (process.env.ADMIN_EMAIL || "admin@wickandwish.in").toLowerCase()
      ) {
        token.role = "ADMIN";
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = (token.id as string) || (token.sub as string);
        session.user.role = (token.role as string) || "CUSTOMER";
        session.user.phone = (token.phone as string) || null;
      }
      return session;
    },
  },
});
