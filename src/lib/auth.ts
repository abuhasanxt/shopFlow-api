import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { prisma } from "./prisma";
import { Role } from "../../generated/prisma/enums";

// If your Prisma file is located elsewhere, you can change the path

export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: "postgresql", // or "mysql", "postgresql", ...etc
  }),
  emailAndPassword: {
    enabled: true,
  },
  user: {
    additionalFields: {
      role: {
        type: "string",
        required: true,
        defaultValue: Role.CUSTOMER,
      },
    },
  },

  session: {
    expiresIn: 60 * 60 * 24 * 7, //1day in second
    updateAge: 60 * 60 * 24 * 7, //1day in second
    cookieCache: {
      enabled: true,
      maxAge: 60 * 60 * 24 * 7, //1day in second
    },
  },
  // trustedOrigins:[process.env.BETTER_AUTH_URL || "http://localhost:5000"],
  // advanced:{
  //     disableCSRFCheck:true
  // }
});
