import { DefaultSession, DefaultUser } from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      role: "admin" | "teacher" | "student";
    } & DefaultSession["user"];
  }

  interface User extends DefaultUser {
    role: "admin" | "teacher" | "student";
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    role: "admin" | "teacher" | "student";
  }
}
