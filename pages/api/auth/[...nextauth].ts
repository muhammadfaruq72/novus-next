import NextAuth from "next-auth/next";
import GoogleProvider from "next-auth/providers/google";

const { NEXT_PUBLIC_GOOGLE_ID, NEXT_PUBLIC_GOOGLE_SECRET } = process.env;

export const authOptions = {
  // Configure one or more authentication providers
  providers: [
    GoogleProvider({
      clientId: `${NEXT_PUBLIC_GOOGLE_ID}`,
      clientSecret: `${NEXT_PUBLIC_GOOGLE_SECRET}`,
    }),
    // ...add more providers here
  ],
  secret: "ElyBZM9fTANVUOP",
};

export default NextAuth(authOptions);
