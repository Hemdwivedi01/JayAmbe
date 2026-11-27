import type { NextAuthConfig } from "next-auth";

export const authConfig = {
  session: { strategy: "jwt" },
  pages: {
    signIn: "/login",
  },
  providers: [],
  callbacks: {
    authorized({ auth, request }) {
      const isLoginPage = request.nextUrl.pathname === "/login";
      if (isLoginPage && auth?.user) {
        return Response.redirect(new URL("/", request.nextUrl));
      }
      return isLoginPage || Boolean(auth?.user);
    },
    async jwt({ token, user }) {
      if (user) {
        token.role = user.role;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user && typeof token.role === "string") {
        session.user.role = token.role;
      }
      return session;
    },
  },
} satisfies NextAuthConfig;
