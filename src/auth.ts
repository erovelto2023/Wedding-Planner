import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import clientPromise from "@/lib/mongodb";
import { verifyPassword, hashPassword } from "@/lib/auth-utils";

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        username: { label: "Username or Email", type: "text" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.username || !credentials?.password) {
          return null;
        }

        try {
          const client = await clientPromise;
          const db = client.db('wedding-planner');
          const usersCol = db.collection('users');

          // Auto-seed the demo administrator account if users collection is empty
          const count = await usersCol.countDocuments();
          if (count === 0) {
            const demoHashedPassword = hashPassword("password");
            await usersCol.insertOne({
              name: "Wedding Planner",
              username: "admin",
              email: "admin@example.com",
              password: demoHashedPassword,
              createdAt: new Date()
            });
            console.log("Successfully auto-seeded admin demo account.");
          }

          // Query the user by username or email (case-insensitive)
          const searchKey = credentials.username.toLowerCase();
          const userDoc = await usersCol.findOne({
            $or: [
              { username: searchKey },
              { email: searchKey }
            ]
          });

          if (!userDoc) {
            console.log(`Authorize failed: User not found for "${searchKey}"`);
            return null;
          }

          // Verify secure cryptographically hashed password
          const isValid = verifyPassword(credentials.password, userDoc.password);
          if (!isValid) {
            console.log(`Authorize failed: Incorrect password for "${searchKey}"`);
            return null;
          }

          // Return successful Next-Auth User object representation
          return {
            id: userDoc._id.toString(),
            name: userDoc.name,
            email: userDoc.email,
            username: userDoc.username
          };
        } catch (error) {
          console.error("Authentication system error:", error);
          return null;
        }
      }
    })
  ],
  pages: {
    signIn: "/login",
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.username = (user as any).username;
      }
      return token;
    },
    async session({ session, token }) {
      if (token && session.user) {
        (session.user as any).id = token.id;
        (session.user as any).username = token.username;
      }
      return session;
    }
  },
  secret: process.env.AUTH_SECRET || "fallback-secret-for-dev",
};
