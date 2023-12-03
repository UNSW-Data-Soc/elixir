import NextAuth from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      email: string;
      name: string;
      token: string;
      admin: boolean;
      moderator: boolean;
      exp: number;
    };
  }
}
