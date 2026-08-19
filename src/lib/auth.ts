import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { prisma } from "./prisma";
import { Role } from "../../generated/prisma/enums";
import { bearer, emailOTP } from "better-auth/plugins";
import { sendEmail } from "../utils/email";
import { envVars } from "../config/env";

// If your Prisma file is located elsewhere, you can change the path

export const auth = betterAuth({
  baseURL:envVars.BETTER_AUTH_URL,
  secret:envVars.BETTER_AUTH_SECRET,
  database: prismaAdapter(prisma, {
    provider: "postgresql", // or "mysql", "postgresql", ...etc
  }),
  emailAndPassword: {
    enabled: true,
    requireEmailVerification:true
  },
  socialProviders:{
google:{
  clientId:envVars.GOOGLE_CLIENT_ID,
  clientSecret:envVars.GOOGLE_CLIENT_SECRET,
  mapProfileToUser:()=>{
    return{
      role:Role.CUSTOMER,
      emailVerified:true,
      

    }
  }
}
  },
  emailVerification:{

    sendOnSignUp:true,
    sendOnSignIn:true,
    autoSignInAfterVerification:true,

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

   plugins: [
    bearer(),
    emailOTP({
      overrideDefaultEmailVerification:true,
      async sendVerificationOTP({email,otp,type}){

        if (type==="email-verification") {
          const user=await prisma.user.findUnique({
            where:{
              email
            }
          })
          
          if (!user) {
            console.error(`User with email ${email} not found. Cannot send verification OTP`)
          }

          if (user&& user.role===Role.ADMIN) {
            console.log(`User with email ${email} is a admin. Skipping sending verification OTP.`);
            return;
          }

          if (user&& !user.emailVerified) {
            sendEmail({
              to:email,
              subject:"Verify your email",
              templateName:"otp",
              templateData:{
                user:user.name,
                otp
              }
            })
          }
        }

      },

      expiresIn:2*60,
      otpLength:6
    })
  ],
  session: {
    expiresIn: 60 * 60 * 24 * 7, //1day in second
    updateAge: 60 * 60 * 24 * 7, //1day in second
    cookieCache: {
      enabled: true,
      maxAge: 60 * 60 * 24 * 7, //1day in second
    },
  },
  redirectURLs:{
        signIn : `${envVars.BETTER_AUTH_URL}/auth/google/success`,
    },
  trustedOrigins:[envVars.BETTER_AUTH_URL || "http://localhost:5000",envVars.FRONTEND_URL],
  advanced:{
      useSecureCookies:false,
      cookies:{
        state:{
          attributes:{
            sameSite:"none",
            secure:true,
            httpOnly:true,
            path:"/"
          }
        },

        sessionToken:{
          attributes:{
            sameSite:"none",
            secure:true,
            httpOnly:true,
            path:"/"
          }
        }

      }
  }
});
