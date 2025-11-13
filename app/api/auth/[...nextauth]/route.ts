import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import jwt from "jsonwebtoken";

// 擴展 Session 類型
declare module "next-auth" {
  interface Session {
    accessToken?: string;
  }
}

const handler = NextAuth({
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        username: { label: "Username", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        // 驗證使用者憑證
        if (
          credentials?.username === "ictesite" &&
          credentials?.password === "icteadmin_62139"
        ) {
          return {
            id: "1",
            name: credentials.username,
            email: "admin@example.com",
          };
        }
        return null;
      },
    }),
  ],
  session: {
    strategy: "jwt",
    maxAge: 24 * 60 * 60, // 24 小時
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.accessToken = jwt.sign(
          { userId: user.id },
          process.env.NEXTAUTH_SECRET || "",
          { expiresIn: "1d" }
        );
      }
      return token;
    },
    async session({ session, token }) {
      session.accessToken = token.accessToken as string;
      return session;
    },
  },
  pages: {
    signIn: "/admin/login",
    error: "/admin/login",
  },
  secret: process.env.NEXTAUTH_SECRET,
});

export { handler as GET, handler as POST };
