import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { login } from "../auth";

const handler = NextAuth({
  providers: [
    CredentialsProvider({
      // The name to display on the sign in form (e.g. "Sign in with...")
      name: "Credentials",
      // `credentials` is used to generate a form on the sign in page.
      // You can specify which fields should be submitted, by adding keys to the `credentials` object.
      // e.g. domain, username, password, 2FA token, etc.
      // You can pass any HTML attribute to the <input> tag through the object.
      credentials: {
        email: {
          label: "Email",
          type: "text",
          placeholder: "enter your email...",
        },
        password: {
          label: "Password",
          type: "password",
          placeholder: "enter your password...",
        },
      },
      async authorize(credentials, req) {
        // Add logic here to look up the user from the credentials supplied
        // const user = { id: "1", name: "Josh", email: "jsmith@example.com" };
        if (!credentials || !credentials.email || !credentials.password) {
          throw new Error("Please enter an email and password to login.");
        }

        const { id, token, admin, exp } = await login({
          email: credentials?.email,
          password: credentials?.password,
        });
        return { id: id, email: credentials.email, token, admin, exp };
      },
    }),
  ],
  pages: {
    signIn: "/auth/login",
    signOut: "/",
    error: "/auth/login",
  },
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async jwt({ token, user }) {
      return { ...token, ...user };
    },
    async session({ session, token, user }) {
      session.user = token as any;
      return session;
    },
  },
});

export { handler as GET, handler as POST };
