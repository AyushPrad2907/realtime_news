import "next-auth";
import "next-auth/jwt";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      email: string;
      name: string;
      role: "EDITOR" | "ADMIN";
    };
  }

  interface User {
    id: string;
    email: string;
    name: string;
    role: "EDITOR" | "ADMIN";
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    role: "EDITOR" | "ADMIN";
  }
}
